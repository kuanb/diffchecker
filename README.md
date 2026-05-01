# Diffchecker

A small single-page diff tool: paste text in two panes, hit **Compare**, get a GitHub-style line diff with red/green highlighting.

Live: https://kuanb.github.io/diffchecker/

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- [`diff`](https://github.com/kpdecker/jsdiff) for line-level diffing
- Plain CSS, no UI framework

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:5173/diffchecker/.

## Build

```bash
npm run build
npm run preview
```

The production build is emitted to `dist/`. The Vite `base` is set to `/diffchecker/` to match the GitHub Pages path.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the app and deploys it via the official GitHub Pages actions (`actions/upload-pages-artifact` + `actions/deploy-pages`).

One-time repo setup:

1. Go to repo **Settings -> Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main`; site goes live at `https://<user>.github.io/diffchecker/`.
