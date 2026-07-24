# SIS cPanel Production Deployment

This deployment keeps the React website static and runs only the contact endpoint in PHP. The contact service uses authenticated SMTP, Cloudflare Turnstile, origin validation, server-side input validation, rate limiting, and metadata-only audit logs.

## 1. Hosting requirements

- PHP 8.1 or newer (PHP 8.2/8.3 recommended)
- PHP extensions: OpenSSL, cURL, mbstring, JSON, filter, hash
- Apache with `.htaccess` enabled
- One mailbox on the final domain, for example `website@example.com`
- SMTP access for that mailbox

PHPMailer 7.1.1 is included in the deployment package, so Composer is not required on cPanel.

## 2. Prepare the public build

Set these values in `.env.cpanel`:

```dotenv
VITE_SITE_URL=https://example.com
VITE_CONTACT_ENDPOINT=/api/contact.php
VITE_TURNSTILE_SITE_KEY=YOUR_PUBLIC_TURNSTILE_SITE_KEY
```

The Turnstile site key is public. Never place the Turnstile secret or SMTP password in this file.

Build the cPanel package:

```powershell
npm run build:cpanel
```

Upload the **contents** of `dist/` to the domain document root, normally `public_html`.

## 3. Create the private backend configuration

In cPanel File Manager:

1. Copy `public_html/api/sis-contact-config.example.php`.
2. Move the copy one level above `public_html`.
3. Rename it to `sis-contact-config.php`.
4. Replace every `example.com` and `REPLACE_...` value.
5. Set the file permission to `0600` when the host supports it.
6. The API creates `/home/CPANEL_USERNAME/sis-contact-data`; keep this directory outside `public_html` with permission `0700`.

The final private file is loaded automatically from:

```text
/home/CPANEL_USERNAME/sis-contact-config.php
```

Do not upload this completed private file to GitHub.

For SMTP port 587 use `tls`. For port 465 use `ssl`. Use `none` only when the hosting provider explicitly supplies a trusted local relay.

## 4. Mail authentication

In cPanel Email Deliverability, enable and verify:

- SPF
- DKIM
- DMARC

Use a `From` address on the same domain as the website. Test both delivery and reply handling. A successful website response means the SMTP server accepted the message; the reference number and server mail logs are used for further tracing.

## 5. Cloudflare Turnstile

Create one managed Turnstile widget and allow both forms of the final hostname:

```text
example.com
www.example.com
```

Place the public site key in `.env.cpanel`. Place the secret key only in `/home/CPANEL_USERNAME/sis-contact-config.php`. The PHP endpoint validates every token, its action, and its hostname.

## 6. Launch verification

After DNS and HTTPS are active:

1. Open the final domain, not a temporary cPanel preview URL.
2. Submit one real contact request.
3. Confirm that the success dialog shows an `SIS-...` reference.
4. Confirm delivery to the company inbox and that Reply works when the visitor entered an email.
5. Submit an invalid contact and confirm it is rejected.
6. Submit twice within 20 seconds and confirm the second attempt is rate-limited.
7. Check `/home/CPANEL_USERNAME/sis-contact-data/contact-events.jsonl` for the matching reference and `smtp_accepted` status.
8. Confirm that direct access to `/api/vendor/` and `/api/sis-contact-config.example.php` is denied.

The audit log contains timestamps, delivery states, truncated client hashes, topic codes, and mail IDs. It intentionally excludes the visitor's name, contact details, and message body.

## 7. Values required from the company before launch

- Final HTTPS domain
- Receiving company email address
- SMTP host, port, username, password, and encryption type
- Cloudflare Turnstile site key and secret key
- Approved privacy notice and data-retention policy
