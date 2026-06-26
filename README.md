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

## Production Notes

Before production launch, connect the contact form to a backend, email service, or Render Web Service endpoint. Add real phone, email, and office details when they are ready for publication.
