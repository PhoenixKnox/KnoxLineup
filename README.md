# Knox · Brimstone guides

Static site, no build step. Open `index.html` or host the folder (GitHub Pages: upload everything, Settings > Pages > main / root).

- `index.html`  page structure
- `style.css`   all styling (colors are CSS variables at the top)
- `data.js`     maps, pins, lineups, videos: **the file you edit most**
- `app.js`      behaviour (filters, pins, card, binder, full screen)
- `images/<map>/`  lineup images; `images/radar/` minimaps

## Add a lineup
1. Save the image as `images/abyss/ab11.webp`.
2. In `data.js`, under that map's `images`, add:
   `{id:"ab11",image:"images/abyss/ab11.webp",categories:["B Site (Attack)"],title:"My lineup",note:"Simple left click"}`
3. Add or reuse a pin: `pins:[x%, y%, ["ab11"]]` (several ids can share one pin).

Categories: `A Site (Attack)`, `A Site (Defense)`, `B Site (Attack)`, `B Site (Defense)`, `Mid`, `Setups`, `Ultimate` (Haven/Lotus also use C Site).
