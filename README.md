# InHaus Digital website

The new site for https://www.inhausdigital.com.au, replacing the Squarespace site. Plain HTML, CSS and a little JavaScript, with no build step. Everything that gets published is in [`public/`](public/).

## Status

- [x] Homepage, Services, About, Media and Contact pages
- [x] 404 page, sitemap, robots.txt, redirects for old Squarespace URLs
- [ ] Contact form connected (needs a Web3Forms access key, see below)
- [ ] Hosting connected (Cloudflare Pages, see below)
- [ ] Domain switched from Squarespace

The live site is still the Squarespace one until the domain is switched.

## Pages

| Page | File |
|---|---|
| Home | `public/index.html` |
| Services | `public/services.html` |
| About | `public/about.html` |
| Media | `public/media.html` |
| Contact | `public/contact.html` |
| Not found | `public/404.html` |

Shared styles are in `public/assets/css/site.css` (colours and fonts at the top) and behaviour in `public/assets/js/site.js`: mobile menu, scroll fades, click-to-play videos and the contact form.

## Hosting: Cloudflare Pages

1. In the Cloudflare dashboard: **Workers & Pages → Create application → Pages → Connect to Git**.
2. Choose GitHub and this repository.
3. Build settings:
   - **Production branch:** `main`
   - **Framework preset:** None
   - **Build command:** `exit 0`
   - **Build output directory:** `public`
4. **Save and Deploy.**

Every push then redeploys automatically. Branches other than `main` get their own preview address, `<branch-name>.<project>.pages.dev`.

`public/_redirects` sends old Squarespace URLs (`/page`, `/cart`) to the homepage.

## Contact form: Web3Forms

The forms on the homepage and contact page post to [Web3Forms](https://web3forms.com), which emails each enquiry. To connect them, create an access key on web3forms.com with the inbox that should receive enquiries. Then replace `ADD-WEB3FORMS-ACCESS-KEY` in `public/index.html` and `public/contact.html`. The key is meant to be public, so it's fine in the page source. Until then, submitting shows "Preview only".

## Videos

YouTube videos show a thumbnail first and load the player only when clicked, which keeps pages fast. To add one, copy an existing `<a class="video" … data-video="VIDEO_ID">` block and change the ID; add `data-start="seconds"` to start part-way through. Shorts use `video video--short` and the `oar2.jpg` thumbnail.

## Preview locally

```bash
cd public && python3 -m http.server 8000
```

Then open http://localhost:8000. Locally, pages need the `.html` ending (for example `/about.html`); Cloudflare serves them without it.

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

**Fonts.** The deck uses Bauhaus Pro and Garet, which are licensed through Canva for designs only, not for websites. The site uses the closest free web fonts instead: **Righteous** for headings and **Plus Jakarta Sans** for body text. Both are under the SIL Open Font License; the licence files are in `public/assets/fonts/`. If you buy web licences for the real fonts, swap the files and the two `@font-face` names at the top of `site.css`.

**Photos** are shown in greyscale over a brand colour (the `tint` classes), which keeps the old site's yellow-and-black look and adds the deck's colours.

## To check before going live

- **Felisha's bio** on the About page could use a line about her background.
- **Power Retail PowerUP** talk has a shape panel instead of a photo until a photo file is added.
- **Client logos** are small images from the old site. Sharper SVG versions would look better on high-resolution screens.
