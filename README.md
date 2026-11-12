# Muhammad Babar: portfolio

Static Astro site, published at https://mbabar90.github.io. Fonts are self-hosted (`@fontsource`); the only outside request is the Cloudflare Web Analytics beacon.

## Run it
Node 20 or newer.

    npm install
    npm run dev        # http://localhost:4321
    npm run build      # writes dist/
    npm run preview    # serves dist/

## Structure
- `src/pages/`: one file per page (`index`, `experience`, `work`, `projects` (redirects to `/#apps`), `404`)
- `src/layouts/Base.astro`: head, fonts, analytics beacon, `public/js/site.js`
- `src/components/`: `Header`, `Footer`, `Contact`
- `src/styles/global.css`: colours, type and layout (CSS variables)
- `public/`: `img/`, `js/site.js`, `og.png`, `favicon.svg`, `robots.txt`
- `.github/workflows/deploy.yml`: builds and publishes to GitHub Pages on every push to `main`

## Changes
See `CHANGELOG.md`. Branches, commit names and versions follow the ApexPaths rules (`F:\Portfolio Development\claude - FINSTRIDE\Plan\team-structure-plan.md`).
