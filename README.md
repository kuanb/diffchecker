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

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the app and publishes `dist/` to the `gh-pages` branch via [`peaceiris/actions-gh-pages`](https://github.com/peaceiris/actions-gh-pages).

After the first successful run:

1. Go to repo **Settings -> Pages**.
2. Set **Source** to `Deploy from a branch`, branch `gh-pages`, folder `/ (root)`.
3. Site goes live at `https://<user>.github.io/diffchecker/`.
