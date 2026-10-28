# InHaus Digital website

The new site for https://www.inhausdigital.com.au, replacing the Squarespace site. Plain HTML, CSS and a little JavaScript, with no build step, so any static host can serve it as-is.

## Status

- [x] Homepage (`index.html`)
- [ ] Services, About and Contact pages: copy is ready in [`copy/`](copy/)
- [ ] Contact form connected to a sending service. Until then it shows "Preview only" on submit.
- [ ] Hosting connected (plan: Cloudflare Pages)
- [ ] Domain switched from Squarespace

The live site is still the Squarespace one until the domain is switched.

## Preview locally

From this folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Links to `/services`, `/about` and `/contact` won't work until those pages exist.

## Structure

```
index.html              Homepage
assets/css/site.css     All styles (colours and fonts are set at the top)
assets/js/site.js       Mobile menu, scroll fades, footer year, form placeholder
assets/fonts/           Self-hosted web fonts and their licences
assets/img/             Photos (WebP), logo, client logos
copy/                   Page copy for Services, About and Contact
favicon.ico, favicon-32.png, apple-touch-icon.png
```

## Brand

Taken from the InHaus brand deck.

| Colour | Hex |
|---|---|
| Charcoal | `#2F2F2F` |
| Yellow | `#FCB404` |
| Pink | `#FD3773` |
| Green | `#86C98F` |
| Orange | `#F85D28` |
| Off-white | `#F5F3F1` |

**Fonts.** The deck uses Bauhaus Pro and Garet, which are licensed through Canva for designs only, not for websites. The site uses the closest free web fonts instead: **Righteous** for headings and **Plus Jakarta Sans** for body text. Both are under the SIL Open Font License; the licence files are in `assets/fonts/`. If you buy web licences for the real fonts, swap the files and the two `@font-face` names at the top of `site.css`.

**Photos** are shown in greyscale over a brand colour (the `tint` classes), which keeps the current site's yellow-and-black look and adds the deck's colours.

## To check before going live

- **Speaking section:** the three talks (March, May and July) have passed. Update them, or relabel the section as past talks.
- **"$8–10M":** the old homepage said both "on track for" and "scaled to". The new site uses "on track for".
- **Client logos** are small images taken from the old site. Sharper logo files (SVG) would look better on high-resolution screens.
- **Page copy** in `copy/` was first written for pasting into Squarespace. Anything in [square brackets] still needs filling in.
