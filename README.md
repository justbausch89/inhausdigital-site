# InHaus Digital website

The new site for https://www.inhausdigital.com.au, replacing the Squarespace site. Plain HTML, CSS and a little JavaScript, with no build step. Everything that gets published is in [`public/`](public/).

## Status

The site is live on Cloudflare at https://www.inhausdigital.com.au and redeploys on every push to `main`.

Still to do before running ads:

- [ ] Have the owners read and approve the wording of the privacy policy
- [ ] Add customer testimonials to the workshop pages when available

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
| Thank you (after a workshop application) | `public/workshops/thank-you.html` |
| Thank you (after a general enquiry) | `public/thank-you.html` |
| Privacy policy | `public/privacy.html` |
| Not found | `public/404.html` |

Shared styles are in `public/assets/css/site.css` (colours and fonts at the top) and behaviour in `public/assets/js/site.js`: mobile menu, scroll fades, click-to-play videos, the forms and ad tracking.

## Look and motion

The site's movement is all in `site.css` and `site.js`, with no animation library:

- **Sheets.** Each section has rounded top corners and overlaps the one before it (`main > .section`).
- **Headlines** reveal word by word: `site.js` wraps each word, the CSS slides it up (`.split`).
- **On scroll:** blocks fade up (`data-reveal`), photos wipe into view, lists and card grids arrive one item after another, key numbers count up (`data-count`), and a marker underline draws under `<mark class="hl">`.
- **Always moving:** the Bauhaus shapes, the word bands (which speed up or reverse with the scroll), the client-logo strip and the turning badge on the workshop hero photo.
- **With a mouse:** hero shapes lean towards the pointer, buttons pull towards it, and a button's colour fills from the bottom on hover.
- A thin progress bar at the top of the screen fills as the page is read, and pages slide in when moving around the site.

Everything respects the "reduce motion" setting on a visitor's device: with it on, content simply appears.

## How the pages are built

There is no build step on Cloudflare: what's in `public/` is the site. One script keeps the pages consistent:

```bash
python3 tools/build.py
```

- It **writes** the pages whose content lives in the script: Workshops and the three workshop pages, InHaus App, both thank-you pages and the privacy policy. Edit their words in `tools/build.py`, not in the HTML, or the next run will overwrite the change.
- It **keeps the header and footer the same** on the hand-written pages (home, services, about, contact, media, 404) by rewriting just those two blocks. Everything else on those pages is edited by hand in the HTML.

So a change to the menu or footer is made once, in `tools/build.py`, and applied everywhere by running it.

The script also stamps the stylesheet and script links on every page with a short version code (`site.css?v=…`). **Run it after any change to `site.css` or `site.js`**, so browsers pick up the new files instead of an old saved copy.

## Workshop landing pages

These are the pages ads point to, so they are built for someone arriving cold on a phone: who teaches it and an Apply button on the first screen, client logos, the problem, proof, who it's for, what's covered, how it runs, the platform, the team, questions and the application form. On phones and tablets an Apply bar stays at the bottom of the screen once the first screen has scrolled away.

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

## Ads and tracking

- **Meta Pixel.** The Pixel ID is set in `META_PIXEL_ID` at the top of `public/assets/js/site.js` (empty it and no tracking code loads). Every page reports a page view, a sent form reports a `Lead` (named "Workshop application" or "General enquiry", so the two can be told apart) and a booked call reports a `Schedule`. Meta's code stays silent in automated test browsers, so test with a real phone or Meta's Test events tool.
- **Thank-you pages.** A successful form sends the visitor to `/workshops/thank-you` or `/thank-you`. The lead is counted there, once: refreshing the page doesn't count again. Both pages are hidden from search engines.
- **Booking a call (Calendly).** Put the Calendly link for the quick chat into `CALENDLY_URL` near the top of `tools/build.py` and run the script. The thank-you page after a workshop application then shows the booking calendar, with the applicant's name and email filled in and the campaign tags passed to Calendly, and the pages' wording changes from "we'll be in touch" to "pick a time". A booking reports a `Schedule` event to Meta. While the setting is empty, nothing from Calendly loads.
- **Which ad a lead came from.** If an ad's link carries campaign tags (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`), they are remembered for the visit and added to the enquiry email, with the first page the person landed on. Example ad link: `https://www.inhausdigital.com.au/workshops/meta-ads?utm_source=meta&utm_medium=paid&utm_campaign=workshops&utm_content=video-1`
- **Visitor numbers.** Cloudflare Web Analytics is on for the site (Cloudflare dashboard → Analytics & Logs → Web Analytics). It uses no cookies.

`public/_headers` sets how long browsers keep fonts and images, and a few standard security headers.

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

## Still worth improving

- **Felisha's bio** on the About page could use a line about her background.
- **Client logos** are small images from the old site. Sharper SVG versions would look better on high-resolution screens.
