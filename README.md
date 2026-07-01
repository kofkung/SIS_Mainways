# SIS Siam Infinity Solution

Static corporate website for **SIS Siam Infinity Solution** with a cinematic hero, animated navigation, hash-based page transitions, scroll zoom effects, and Default/Dark theme switching.

## Files

- `index.html` - Website markup and page sections
- `styles.css` - Visual system, responsive layout, animations, Default/Dark themes
- `script.js` - Page routing, scroll effects, theme persistence, mobile menu, form state
- `SiSlogo.jpg` - Company logo used in the header and footer
- `assets/sis-hero-smart-infrastructure.png` - Generated hero image asset
- `render.yaml` - Render Blueprint config for static-site deployment
- `RENDER_DEPLOY.md` - Render.com deployment guide in Thai

## Local Preview

Open `index.html` directly in a browser, or serve the folder with any static server.

```powershell
python -m http.server 4173
```

Then open `http://127.0.0.1:4173`.

## Update Contact Details

Before production launch, replace the placeholder contact form behavior in `script.js` with a real backend, email service, or Render Function/Web Service endpoint.
