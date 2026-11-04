# Muhammad Babar — portfolio

Static Astro site (no client-side JavaScript apart from the Cloudflare Web Analytics beacon). Published at https://mbabar90.github.io

## Run it

```
npm install
npm run dev       # http://localhost:4321
npm run build     # output in dist/
npm run preview   # serve dist/ locally
```

## Deploy (GitHub Pages)

1. Create a public GitHub repo named `MBabar90.github.io`.
2. Push this project to its `main` branch.
3. In the repo: Settings → Pages → Source: GitHub Actions.
4. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push to `main`.
5. Open https://mbabar90.github.io when it finishes.

## Notes

- Fonts are self-hosted (`@fontsource`, latin subset). No external requests.
- The photo is `src/assets/dp.jpg`; Astro converts it to WebP at 260, 340 and 560 px wide.
- Colours and type are CSS variables in `src/styles/global.css`.
- No contact form, no CV download.

## Analytics: Cloudflare Web Analytics

Replace `CF_BEACON_TOKEN` in `src/layouts/Base.astro` with the site token from Cloudflare > Web Analytics.
