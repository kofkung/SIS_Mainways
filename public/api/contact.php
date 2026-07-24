<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as MailerException;
use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

const MAX_BODY_BYTES = 32768;
const MIN_FORM_TIME_MS = 1500;

function respond(int $status, bool $success, string $message, ?string $reference = null): void
{
    http_response_code($status);
    $response = [
        'success' => $success,
        'message' => $message,
    ];

    if ($reference !== null) {
        $response['reference'] = $reference;
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function clean_line($value, int $maxLength): string
{
    $text = trim((string) ($value ?? ''));
    $text = preg_replace('/[\r\n\t]+/u', ' ', $text) ?? '';
    $text = preg_replace('/\s{2,}/u', ' ', $text) ?? '';
    return text_slice($text, $maxLength);
}

function clean_message($value, int $maxLength): string
{
    $text = trim((string) ($value ?? ''));
    $text = str_replace(["\r\n", "\r"], "\n", $text);
    $text = preg_replace('/\n{4,}/', "\n\n\n", $text) ?? '';
    return text_slice($text, $maxLength);
}

function text_slice(string $value, int $maxLength): string
{
    return function_exists('mb_substr')
        ? mb_substr($value, 0, $maxLength, 'UTF-8')
        : substr($value, 0, $maxLength);
}

function text_length(string $value): int
{
    return function_exists('mb_strlen')
        ? mb_strlen($value, 'UTF-8')
        : strlen($value);
}

function config_path_value(array $config, string $path, $default = '')
{
    $value = $config;
    foreach (explode('.', $path) as $segment) {
        if (!is_array($value) || !array_key_exists($segment, $value)) {
            return $default;
        }
        $value = $value[$segment];
    }
    return $value;
}

function setting(array $config, string $environmentName, string $configPath, $default = '')
{
    $environmentValue = getenv($environmentName);
    if ($environmentValue !== false && $environmentValue !== '') {
        return $environmentValue;
    }

    return config_path_value($config, $configPath, $default);
}

function bool_setting(array $config, string $environmentName, string $configPath, bool $default): bool
{
    $value = setting($config, $environmentName, $configPath, $default);
    if (is_bool($value)) {
        return $value;
    }

    $parsed = filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    return $parsed === null ? $default : $parsed;
}

function csv_values($value): array
{
    if (is_array($value)) {
        $values = $value;
    } else {
        $values = preg_split('/[,;]+/', (string) $value) ?: [];
    }

    return array_values(array_filter(array_map(static function ($item): string {
        return trim((string) $item);
    }, $values), static function (string $item): bool {
        return $item !== '';
    }));
}

function normalize_host(string $host): string
{
    $host = strtolower(trim($host));
    $host = preg_replace('/:\d+$/', '', $host) ?? '';
    return rtrim($host, '.');
}

function ensure_private_directory(string $directory): bool
{
    if (is_dir($directory)) {
        return true;
    }

    if (!@mkdir($directory, 0700, true) && !is_dir($directory)) {
        return false;
    }

    @chmod($directory, 0700);
    return true;
}

function append_audit_event(string $directory, array $event): void
{
    if (!ensure_private_directory($directory)) {
        error_log('SIS contact audit directory could not be created.');
        return;
    }

    $event['timestamp'] = gmdate('c');
    $line = json_encode($event, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($line === false || @file_put_contents(
        $directory . DIRECTORY_SEPARATOR . 'contact-events.jsonl',
        $line . PHP_EOL,
        FILE_APPEND | LOCK_EX
    ) === false) {
        error_log('SIS contact audit event could not be written.');
    }
}

function enforce_rate_limit(
    string $directory,
    string $clientKey,
    int $minimumIntervalSeconds,
    int $windowSeconds,
    int $maximumAttempts
): int {
    if (!ensure_private_directory($directory)) {
        return -1;
    }

    $path = $directory . DIRECTORY_SEPARATOR . 'contact-rate-limit.json';
    $handle = @fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) {
            fclose($handle);
        }
        return -1;
    }

    $contents = stream_get_contents($handle);
    $records = json_decode($contents ?: '{}', true);
    if (!is_array($records)) {
        $records = [];
    }

    $now = time();
    foreach ($records as $key => $timestamps) {
        if (!is_array($timestamps)) {
            unset($records[$key]);
            continue;
        }
        $records[$key] = array_values(array_filter($timestamps, static function ($timestamp) use ($now, $windowSeconds): bool {
            return is_int($timestamp) && $timestamp > ($now - $windowSeconds);
        }));
        if ($records[$key] === []) {
            unset($records[$key]);
        }
    }

    $attempts = $records[$clientKey] ?? [];
    $lastAttempt = $attempts === [] ? 0 : (int) end($attempts);
    $waitSeconds = 0;
    if ($lastAttempt > 0 && ($now - $lastAttempt) < $minimumIntervalSeconds) {
        $waitSeconds = $minimumIntervalSeconds - ($now - $lastAttempt);
    } elseif (count($attempts) >= $maximumAttempts) {
        $waitSeconds = max(1, $windowSeconds - ($now - (int) $attempts[0]));
    } else {
        $attempts[] = $now;
        $records[$clientKey] = $attempts;
    }

    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($records, JSON_UNESCAPED_SLASHES) ?: '{}');
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    @chmod($path, 0600);

    return $waitSeconds;
}

function verify_turnstile(string $secret, string $token, string $remoteAddress): array
{
    $endpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    $fields = http_build_query([
        'secret' => $secret,
        'response' => $token,
        'remoteip' => $remoteAddress,
    ]);
    $response = false;

    if (function_exists('curl_init')) {
        $curl = curl_init($endpoint);
        curl_setopt_array($curl, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $fields,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        ]);
        if (defined('CURLOPT_PROTOCOLS') && defined('CURLPROTO_HTTPS')) {
            curl_setopt($curl, CURLOPT_PROTOCOLS, CURLPROTO_HTTPS);
        }
        $response = curl_exec($curl);
        curl_close($curl);
    } else {
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
                'content' => $fields,
                'timeout' => 8,
                'ignore_errors' => true,
            ],
        ]);
        $response = @file_get_contents($endpoint, false, $context);
    }

    if (!is_string($response) || $response === '') {
        return ['success' => false, 'error-codes' => ['verification-unavailable']];
    }

    $result = json_decode($response, true);
    return is_array($result)
        ? $result
        : ['success' => false, 'error-codes' => ['invalid-verification-response']];
}

function escape_html(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Method not allowed.');
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength <= 0 || $contentLength > MAX_BODY_BYTES) {
    respond($contentLength > MAX_BODY_BYTES ? 413 : 400, false, 'Invalid request body.');
}

$contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
if (strpos($contentType, 'application/json') !== 0 && strpos($contentType, 'application/x-www-form-urlencoded') !== 0) {
    respond(415, false, 'Unsupported content type.');
}

define('SIS_CONTACT_BOOTSTRAPPED', true);
$configuredPath = getenv('SIS_CONTACT_CONFIG');
$configurationPath = is_string($configuredPath) && $configuredPath !== ''
    ? $configuredPath
    : dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'sis-contact-config.php';
$config = [];
if (is_file($configurationPath)) {
    $loadedConfig = require $configurationPath;
    if (is_array($loadedConfig)) {
        $config = $loadedConfig;
    }
}

$host = normalize_host((string) ($_SERVER['HTTP_HOST'] ?? ''));
if ($host === '' || !preg_match('/^[a-z0-9.-]+$/', $host)) {
    respond(400, false, 'Invalid request host.');
}

$allowedHosts = array_map('normalize_host', csv_values(setting($config, 'SIS_ALLOWED_HOSTS', 'allowed_hosts', [])));
if ($allowedHosts !== [] && !in_array($host, $allowedHosts, true)) {
    respond(403, false, 'Invalid request host.');
}

$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
if ($origin !== '') {
    $originHost = normalize_host((string) (parse_url($origin, PHP_URL_HOST) ?? ''));
    $acceptedOriginHosts = $allowedHosts === [] ? [$host] : $allowedHosts;
    if ($originHost === '' || !in_array($originHost, $acceptedOriginHosts, true)) {
        respond(403, false, 'Invalid request origin.');
    }
}

$fetchSite = strtolower((string) ($_SERVER['HTTP_SEC_FETCH_SITE'] ?? ''));
if ($fetchSite !== '' && !in_array($fetchSite, ['same-origin', 'same-site', 'none'], true)) {
    respond(403, false, 'Cross-site requests are not accepted.');
}

$rawBody = file_get_contents('php://input');
$payload = strpos($contentType, 'application/json') === 0
    ? json_decode($rawBody ?: '{}', true)
    : $_POST;
if (!is_array($payload)) {
    respond(400, false, 'Invalid request data.');
}

if (clean_line($payload['_honey'] ?? $payload['website'] ?? '', 200) !== '') {
    respond(200, true, 'Message accepted.');
}

$startedAt = (float) ($payload['started_at'] ?? 0);
$elapsedMilliseconds = (microtime(true) * 1000) - $startedAt;
if ($startedAt <= 0 || $elapsedMilliseconds < MIN_FORM_TIME_MS) {
    respond(429, false, 'Please wait a moment and try again.');
}

$requestId = 'SIS-' . gmdate('Ymd') . '-' . strtoupper(bin2hex(random_bytes(4)));
$trustCloudflare = bool_setting($config, 'SIS_TRUST_CLOUDFLARE', 'trust_cloudflare', false);
$remoteAddress = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
if ($trustCloudflare && filter_var($_SERVER['HTTP_CF_CONNECTING_IP'] ?? '', FILTER_VALIDATE_IP)) {
    $remoteAddress = (string) $_SERVER['HTTP_CF_CONNECTING_IP'];
}

$dataDirectory = (string) setting(
    $config,
    'SIS_CONTACT_DATA_DIR',
    'data_dir',
    dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'sis-contact-data'
);
$rateSalt = (string) setting($config, 'SIS_RATE_LIMIT_SALT', 'rate_limit_salt', $host);
$clientKey = hash_hmac('sha256', $remoteAddress, $rateSalt);
$waitSeconds = enforce_rate_limit($dataDirectory, $clientKey, 20, 3600, 5);
if ($waitSeconds < 0) {
    append_audit_event($dataDirectory, [
        'reference' => $requestId,
        'status' => 'rate_limit_unavailable',
    ]);
    respond(503, false, 'The contact service is temporarily unavailable.', $requestId);
}
if ($waitSeconds > 0) {
    header('Retry-After: ' . $waitSeconds);
    append_audit_event($dataDirectory, [
        'reference' => $requestId,
        'status' => 'rate_limited',
        'client' => substr($clientKey, 0, 16),
    ]);
    respond(429, false, 'Please wait before sending another message.', $requestId);
}

$turnstileRequired = bool_setting($config, 'SIS_REQUIRE_TURNSTILE', 'turnstile.required', false);
$turnstileSecret = (string) setting($config, 'SIS_TURNSTILE_SECRET', 'turnstile.secret', '');
if ($turnstileRequired && $turnstileSecret === '') {
    append_audit_event($dataDirectory, [
        'reference' => $requestId,
        'status' => 'turnstile_not_configured',
    ]);
    respond(503, false, 'Security verification is not configured yet.', $requestId);
}

if ($turnstileSecret !== '') {
    $turnstileToken = clean_line($payload['turnstile_token'] ?? $payload['cf-turnstile-response'] ?? '', 2048);
    if ($turnstileToken === '') {
        respond(422, false, 'Please complete the security verification.', $requestId);
    }

    $turnstileResult = verify_turnstile($turnstileSecret, $turnstileToken, $remoteAddress);
    $verified = ($turnstileResult['success'] ?? false) === true;
    $verifiedAction = (string) ($turnstileResult['action'] ?? '');
    $verifiedHost = normalize_host((string) ($turnstileResult['hostname'] ?? ''));
    $turnstileHosts = array_map('normalize_host', csv_values(setting(
        $config,
        'SIS_TURNSTILE_HOSTNAMES',
        'turnstile.hostnames',
        $allowedHosts
    )));

    if (
        !$verified
        || ($verifiedAction !== '' && $verifiedAction !== 'contact')
        || ($turnstileHosts !== [] && !in_array($verifiedHost, $turnstileHosts, true))
    ) {
        append_audit_event($dataDirectory, [
            'reference' => $requestId,
            'status' => 'turnstile_rejected',
            'client' => substr($clientKey, 0, 16),
            'codes' => array_values((array) ($turnstileResult['error-codes'] ?? [])),
        ]);
        respond(422, false, 'Security verification failed. Please try again.', $requestId);
    }
}

$topicCode = strtolower(clean_line($payload['topic_code'] ?? $payload['subject'] ?? 'general', 30));
$topicLabels = [
    'general' => 'Contact Services',
    'product' => 'Ask for Products',
    'support' => 'Support',
    'other' => 'Other',
];
if (!array_key_exists($topicCode, $topicLabels)) {
    respond(422, false, 'Invalid enquiry subject.', $requestId);
}

$name = clean_line($payload['name'] ?? '', 120);
$contact = clean_line($payload['contact'] ?? '', 190);
$message = clean_message($payload['message'] ?? '', 5000);
$product = clean_line($payload['product'] ?? '', 200);
$company = clean_line($payload['company'] ?? '', 200);
$station = clean_line($payload['station'] ?? '', 200);
$device = clean_line($payload['device'] ?? '', 200);
$page = clean_line($payload['page'] ?? '', 500);

if (text_length($name) < 2 || text_length($contact) < 3 || text_length($message) < 10) {
    respond(422, false, 'Please complete the required fields.', $requestId);
}
if ($topicCode === 'product' && ($product === '' || $company === '')) {
    respond(422, false, 'Please provide the product and company information.', $requestId);
}
if ($topicCode === 'support' && $station === '') {
    respond(422, false, 'Please provide the station or location.', $requestId);
}

$contactIsEmail = filter_var($contact, FILTER_VALIDATE_EMAIL) !== false;
$phoneDigits = preg_replace('/\D+/', '', $contact) ?? '';
$contactIsPhone = preg_match('/^[+()0-9 .-]{7,30}$/', $contact) === 1
    && strlen($phoneDigits) >= 7
    && strlen($phoneDigits) <= 15;
if (!$contactIsEmail && !$contactIsPhone) {
    respond(422, false, 'Please enter a valid email address or phone number.', $requestId);
}

$recipientValues = csv_values(setting($config, 'SIS_CONTACT_TO', 'contact.to', []));
$fromAddress = clean_line(setting($config, 'SIS_CONTACT_FROM', 'contact.from_address', ''), 190);
$fromName = clean_line(setting($config, 'SIS_CONTACT_FROM_NAME', 'contact.from_name', 'SIS Website'), 120);
$smtpHost = clean_line(setting($config, 'SIS_SMTP_HOST', 'smtp.host', ''), 255);
$smtpPort = (int) setting($config, 'SIS_SMTP_PORT', 'smtp.port', 587);
$smtpUsername = clean_line(setting($config, 'SIS_SMTP_USERNAME', 'smtp.username', ''), 255);
$smtpPassword = (string) setting($config, 'SIS_SMTP_PASSWORD', 'smtp.password', '');
$smtpEncryption = strtolower(clean_line(setting($config, 'SIS_SMTP_ENCRYPTION', 'smtp.encryption', 'tls'), 20));
$smtpAuth = bool_setting($config, 'SIS_SMTP_AUTH', 'smtp.auth', $smtpUsername !== '');

$validRecipients = array_values(array_filter($recipientValues, static function (string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}));
$mailerFiles = [
    __DIR__ . '/vendor/phpmailer/src/Exception.php',
    __DIR__ . '/vendor/phpmailer/src/PHPMailer.php',
    __DIR__ . '/vendor/phpmailer/src/SMTP.php',
];
$mailerReady = count($validRecipients) === count($recipientValues)
    && $validRecipients !== []
    && filter_var($fromAddress, FILTER_VALIDATE_EMAIL)
    && $smtpHost !== ''
    && $smtpPort > 0
    && $smtpPort <= 65535
    && (!$smtpAuth || ($smtpUsername !== '' && $smtpPassword !== ''))
    && in_array($smtpEncryption, ['tls', 'ssl', 'none'], true)
    && count(array_filter($mailerFiles, 'is_file')) === count($mailerFiles);

if (!$mailerReady) {
    append_audit_event($dataDirectory, [
        'reference' => $requestId,
        'status' => 'email_not_configured',
    ]);
    error_log('SIS contact SMTP configuration is incomplete. Reference: ' . $requestId);
    respond(503, false, 'Email delivery is not configured yet.', $requestId);
}

foreach ($mailerFiles as $mailerFile) {
    require_once $mailerFile;
}

$topicLabel = $topicLabels[$topicCode];
$subject = '[SIS Website][' . $requestId . '] ' . $topicLabel . ' - ' . $name;
$plainBody = implode("\n", [
    'New enquiry from the SIS website',
    'Reference: ' . $requestId,
    '',
    'Name: ' . $name,
    'Contact: ' . $contact,
    'Topic: ' . $topicLabel,
    'Product: ' . ($product ?: '-'),
    'Company: ' . ($company ?: '-'),
    'Station: ' . ($station ?: '-'),
    'Device: ' . ($device ?: '-'),
    'Page: ' . ($page ?: '-'),
    '',
    'Message:',
    $message,
]);

$fieldRows = [
    'Reference' => $requestId,
    'Name' => $name,
    'Contact' => $contact,
    'Topic' => $topicLabel,
    'Product' => $product ?: '-',
    'Company' => $company ?: '-',
    'Station' => $station ?: '-',
    'Device' => $device ?: '-',
    'Page' => $page ?: '-',
];
$htmlRows = '';
foreach ($fieldRows as $label => $value) {
    $htmlRows .= '<tr><th style="padding:8px 12px;text-align:left;vertical-align:top;color:#5b708b;border-bottom:1px solid #dce7f3">'
        . escape_html($label)
        . '</th><td style="padding:8px 12px;color:#102a4c;border-bottom:1px solid #dce7f3">'
        . escape_html($value)
        . '</td></tr>';
}
$htmlBody = '<!doctype html><html><body style="margin:0;background:#eef5fb;font-family:Arial,sans-serif;color:#102a4c">'
    . '<div style="max-width:680px;margin:0 auto;padding:32px 16px">'
    . '<div style="background:#ffffff;border:1px solid #d6e4f2;border-radius:16px;overflow:hidden">'
    . '<div style="padding:24px;background:#041b3d;color:#ffffff"><div style="font-size:12px;letter-spacing:.12em;color:#5ad7ff">SIS WEBSITE</div>'
    . '<h1 style="margin:8px 0 0;font-size:24px">New website enquiry</h1></div>'
    . '<table role="presentation" style="width:100%;border-collapse:collapse"><tbody>' . $htmlRows . '</tbody></table>'
    . '<div style="padding:20px 24px"><h2 style="margin:0 0 10px;font-size:16px">Message</h2>'
    . '<div style="line-height:1.6;white-space:normal">' . nl2br(escape_html($message)) . '</div></div>'
    . '</div></div></body></html>';

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $smtpHost;
    $mail->Port = $smtpPort;
    $mail->SMTPAuth = $smtpAuth;
    $mail->Username = $smtpUsername;
    $mail->Password = $smtpPassword;
    $mail->Timeout = 12;
    $mail->SMTPKeepAlive = false;

    if ($smtpEncryption === 'tls') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    } elseif ($smtpEncryption === 'ssl') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } else {
        $mail->SMTPSecure = '';
        $mail->SMTPAutoTLS = false;
    }

    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->setFrom($fromAddress, $fromName);
    foreach ($validRecipients as $recipient) {
        $mail->addAddress($recipient);
    }
    if ($contactIsEmail) {
        $mail->addReplyTo($contact, $name);
    }
    $mail->addCustomHeader('X-SIS-Reference', $requestId);
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $htmlBody;
    $mail->AltBody = $plainBody;
    $mail->send();

    append_audit_event($dataDirectory, [
        'reference' => $requestId,
        'status' => 'smtp_accepted',
        'topic' => $topicCode,
        'client' => substr($clientKey, 0, 16),
        'message_id' => $mail->getLastMessageID(),
    ]);
} catch (MailerException $exception) {
    append_audit_event($dataDirectory, [
        'reference' => $requestId,
        'status' => 'smtp_failed',
        'topic' => $topicCode,
        'client' => substr($clientKey, 0, 16),
        'error' => text_slice($exception->getMessage(), 500),
    ]);
    error_log('SIS contact SMTP failure. Reference: ' . $requestId . '. ' . $exception->getMessage());
    respond(502, false, 'The mail server could not accept this message.', $requestId);
}

respond(200, true, 'Message sent successfully.', $requestId);
