# InHaus Digital website

The new site for https://www.inhausdigital.com.au, replacing the Squarespace site. Plain HTML, CSS and a little JavaScript, with no build step. Everything that gets published is in [`public/`](public/).

## Status

- [x] Homepage, Services, About, Media and Contact pages
- [x] 404 page, sitemap, robots.txt, redirects for old Squarespace URLs
- [x] Contact form connected to Web3Forms
- [ ] Hosting connected (Cloudflare, see below)
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
| Workshops | `public/workshops.html` |
| Meta Ads workshop | `public/workshops/meta-ads.html` |
| Google Ads workshop | `public/workshops/google-ads.html` |
| CRM & Email workshop | `public/workshops/crm-email.html` |
| InHaus App | `public/inhaus-app.html` |
| Not found | `public/404.html` |

Shared styles are in `public/assets/css/site.css` (colours and fonts at the top) and behaviour in `public/assets/js/site.js`: mobile menu, scroll fades, click-to-play videos and the contact form.

## Workshop landing pages

The three workshop pages share most of their sections (agency pain points, what's included, the platform, the team, the booking form). The booking forms post to Web3Forms like the contact form, with the workshop pre-ticked and a hidden `page` field so enquiries say where they came from. The platform section on each workshop page plays the InHaus App video (see below). The InHaus App page shows the same video, followed by a step-by-step walkthrough that is HTML and CSS animation driven by `site.js` (`[data-tour]`).

## Hosting: Cloudflare

The site deploys as a Cloudflare Worker that serves the files in `public/`. [`wrangler.jsonc`](wrangler.jsonc) holds the settings; there is no build step. A small Worker script, [`worker/video-ranges.js`](worker/video-ranges.js), handles `/assets/video/*` only: it lets browsers fetch videos in pieces, which Safari and iPhones need before they'll play one. Everything else is served straight from `public/`.

1. In the Cloudflare dashboard: **Workers & Pages → Create application**, then connect GitHub and choose this repository.
2. **Project name:** `inhausdigital-site` (it must match `name` in `wrangler.jsonc`).
3. **Build command:** leave empty. **Deploy command:** `npx wrangler deploy`.
4. **Deploy.**

Every push to `main` then redeploys automatically. Cloudflare serves `/about` from `about.html`, uses `404.html` for missing pages, and `public/_redirects` sends old Squarespace URLs (`/page`, `/cart`) to the homepage.

## Contact form: Web3Forms

The forms on the homepage and contact page post to [Web3Forms](https://web3forms.com), which emails each enquiry to the inbox set on the form in the Web3Forms dashboard. The access key is in the hidden `access_key` field in `public/index.html` and `public/contact.html`; it's meant to be public, so it's fine in the page source. Sending a copy to a second address (CC) is a Web3Forms Pro feature.

## Videos

YouTube videos show a thumbnail first and load the player only when clicked, which keeps pages fast. To add one, copy an existing `<a class="video" … data-video="VIDEO_ID">` block and change the ID; add `data-start="seconds"` to start part-way through. Shorts use `video video--short` and the `oar2.jpg` thumbnail.

Our own MP4s use the same block with `data-mp4` instead of `data-video`, and `href` pointing at the file; they play in the browser's own player. Keep each file under 25 MB, Cloudflare's limit for a single file.

## The InHaus App video

The promo video (`public/assets/video/inhaus-app.mp4`, with `inhaus-app-poster.webp` as its thumbnail) is made with [Remotion](https://www.remotion.dev), which builds video from code. Its source is in [`video/`](video), separate from the website, and isn't deployed. All the figures in it are sample data.

The voiceover is `video/public/voiceover.mp3` (made with an AI voice from the script). It sets the video's pace: `video/src/Video.tsx` lists the second each scene's line starts, and each scene's animations are timed to its words. With a new recording, update those start times and the length (`VOICE_END`).

- Scene order and timing: `video/src/Video.tsx` (30 frames = 1 second)
- Each scene, with its words and sample numbers: `video/src/scenes/`
- Colours and fonts: `video/src/theme.ts`

To change it, edit those files and render again (needs Node.js and ffmpeg):

```bash
cd video && npm install
```

```bash
npm run studio
```

That opens a live preview in the browser. When it looks right:

```bash
npm run render && npm run web && npm run poster
```

`render` makes a high-quality master in `video/out/`; `web` compresses it into the site (about 11 MB); `poster` updates the thumbnail. Remotion is free for individuals and companies of up to three people; bigger companies need a [company licence](https://www.remotion.dev/license).

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
- **Client logos** are small images from the old site. Sharper SVG versions would look better on high-resolution screens.
