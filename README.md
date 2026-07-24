# SIS Siam Infinity Solution

React corporate website for **SIS Siam Infinity Solution**, focused on MRT fare gate systems, AFC integration, station devices, and the **Bi-directions Automatic Gates** project.

## Stack

- React + Vite
- CoFo Sans-first typography stack with Thai Sans Neue as a bundled fallback
- Dark cinematic liquid-glass interface inspired by premium MRT gate systems
- Local project images sourced from the SIS Solution services page plus generated MRT gate hero assets
- Render static-site deployment

## Typography

The website is configured to use **CoFo Sans** first. Because CoFo Sans is a licensed commercial font, the repo does not bundle unlicensed font files. If CoFo Sans is installed on the viewer's system, the site will use it automatically; otherwise it falls back to system sans fonts, with the bundled **Thai Sans Neue 1.0** files from [f0nt.com](http://www.f0nt.com/release/thaisans-neue-1-0/) available for Thai glyph support.

## Project Images

Portfolio images are bundled under `assets/services/` from `https://www.sissolution.co.th/services` so the deployed site is not dependent on hotlinking.

The generated hero assets live under `assets/sis-mrt-fare-gates-hero.jpg` and `assets/sis-bidirectional-gate-focus.jpg`.

## Local Preview

```powershell
npm install
npm run dev
```

Then open the local Vite URL.

## Production Build

The default build remains compatible with the current Render deployment:

```powershell
npm run build
```

For a cPanel deployment, set the final HTTPS domain in `.env.cpanel`, then run:

```powershell
npm run build:cpanel
```

Upload the **contents** of `dist/` to the domain's document root (normally `public_html`). The generated package includes clean-URL rewrites, security and cache headers, `robots.txt`, a sitemap when `VITE_SITE_URL` is configured, and the same-origin PHP contact endpoint.

## Contact Delivery

- The current Render build sends contact messages through Web3Forms to `golfsama2006@gmail.com`. Its public endpoint and access key are defined in `.env.production`; `render.yaml` mirrors those settings. Web3Forms access keys are designed to be public client-side identifiers rather than secret credentials.
- The cPanel build uses the same-origin `/api/contact.php` endpoint with authenticated SMTP through the bundled PHPMailer 7.1.1 library. Composer is not required on the server.
- The cPanel endpoint validates the request origin, required fields, email/phone format, topic-specific fields, Cloudflare Turnstile tokens, and per-client rate limits.
- Successful messages receive a reference such as `SIS-20260714-A1B2C3D4`. Delivery and rejection events are logged outside `public_html` without storing the visitor's message or contact details.
- SMTP credentials and the Turnstile secret must be stored in `/home/CPANEL_USERNAME/sis-contact-config.php`, never inside `public_html`, a `VITE_*` value, or Git.

See [CPANEL_DEPLOY.md](./CPANEL_DEPLOY.md) for the complete production checklist. Before launch, replace the placeholder domain, create the company mailbox, enable SPF/DKIM/DMARC, create the Turnstile widget, test one real submission, and add the company's approved privacy notice.
