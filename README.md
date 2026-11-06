# bruno trevisan · portfolio

Static site. No build step, no dependencies.

## Publish on GitHub Pages

1. Create a repository. Name it `<your-username>.github.io` if you want the site at the root URL.
2. Upload everything in this folder (`index.html`, `assets/`, `.nojekyll`) to the `main` branch.
   On github.com: **Add file → Upload files**, then drag the folder contents in.
3. **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save.**
4. Once it is live, open `index.html` and set `og:image` to the full URL
   (for example `https://<your-username>.github.io/assets/img/og.jpg`) so LinkedIn and WhatsApp show the preview card.

## Where things live

| what | where |
| --- | --- |
| all copy | `index.html` |
| the rules printed in the live demo | `RULES` in `assets/js/main.js` |
| the drawing system (hero, demo, footer strip) | `scene()` in `assets/js/main.js` |
| portrait | `assets/img/bruno.jpg` (960×1200, 4:5) |
| share image | `assets/img/og.jpg` (1200×630) |

Fonts: Outfit and IBM Plex Mono, self-hosted under the SIL Open Font License (see `assets/fonts`).
