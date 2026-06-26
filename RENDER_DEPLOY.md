# Deploy SIS on Render.com

This site is a React + Vite static build.

## Dashboard Setup

1. Push the project to `kofkung/SIS_Mainways`.
2. Open [Render Dashboard](https://dashboard.render.com/).
3. Choose **New > Static Site**.
4. Connect the repository.
5. Use:
   - Branch: `main`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
6. Click **Create Static Site**.

## Blueprint Setup

The repo includes `render.yaml`, so you can also use **New > Blueprint** and connect this repository.

```yaml
services:
  - type: web
    runtime: static
    buildCommand: npm install && npm run build
    staticPublishPath: dist
```

## Production Notes

- The contact form currently uses front-end state only.
- Connect the form to an email service, backend, or Render Web Service before launch.
- Add the production domain in Render Static Site settings when ready.
