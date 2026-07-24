<?php
declare(strict_types=1);

// Copy this file to /home/CPANEL_USERNAME/sis-contact-config.php,
// replace every placeholder, and never commit the completed file to Git.
if (!defined('SIS_CONTACT_BOOTSTRAPPED')) {
    http_response_code(404);
    exit;
}

return [
    'allowed_hosts' => [
        'example.com',
        'www.example.com',
    ],

    'contact' => [
        'to' => ['contact@example.com'],
        'from_address' => 'website@example.com',
        'from_name' => 'SIS Website',
    ],

    'smtp' => [
        'host' => 'mail.example.com',
        'port' => 587,
        'auth' => true,
        'username' => 'website@example.com',
        'password' => 'REPLACE_WITH_A_STRONG_MAILBOX_PASSWORD',
        // Use tls for port 587, ssl for port 465, or none only for a trusted local relay.
        'encryption' => 'tls',
    ],

    'turnstile' => [
        'required' => true,
        'secret' => 'REPLACE_WITH_CLOUDFLARE_TURNSTILE_SECRET_KEY',
        'hostnames' => [
            'example.com',
            'www.example.com',
        ],
    ],

    // Keep logs and rate-limit data outside public_html.
    'data_dir' => __DIR__ . '/sis-contact-data',
    'rate_limit_salt' => 'REPLACE_WITH_AT_LEAST_32_RANDOM_CHARACTERS',

    // Enable this only when the domain is proxied through Cloudflare.
    'trust_cloudflare' => false,
];
