# Builds the site's shared and generated parts. Run from anywhere:  python3 tools/build.py
#
# - Writes the pages whose content lives in this file: Workshops (parent + three workshops),
#   InHaus App, the thank-you pages and the privacy policy.
# - Keeps the header and footer the same on the hand-written pages (home, services, about,
#   contact, media, 404) by rewriting those two blocks in place. Their content is edited by hand.
# - Stamps the stylesheet and script links on every page, so run it after changing either file.
import hashlib, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', 'public')


# Every page links the stylesheet and script with a short stamp of their contents
# (site.css?v=1a2b3c4d). When either file changes, its address changes with it, so a
# browser can never keep showing an old copy after an update.
def stamp(asset):
    with open(os.path.join(OUT, asset.lstrip('/')), 'rb') as f:
        return f'{asset}?v={hashlib.md5(f.read()).hexdigest()[:8]}'


CSS = stamp('/assets/css/site.css')
JS = stamp('/assets/js/site.js')
KEY = '6ce5cb49-0e93-4e2a-8fad-6b6bf7481932'
SITE = 'https://www.inhausdigital.com.au'

# Calendly link for the quick chat after someone applies, for example
# 'https://calendly.com/your-name/quick-chat'. While this is empty the pages say
# "we'll be in touch" and nothing from Calendly loads. With a link, the thank-you page
# shows the booking calendar and the wording changes to "pick a time".
CALENDLY_URL = 'https://calendly.com/justin-inhausdigital/30min'
CHAT_STEP = 'Pick a time for a quick chat' if CALENDLY_URL else 'We’ll be in touch to set up a quick chat'

SPRITE = '''  <svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
    <symbol id="i-asterisk" viewBox="0 0 32 32"><path d="M16 4v24M4 16h24M7.5 7.5l17 17M24.5 7.5l-17 17" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></symbol>
    <symbol id="i-play" viewBox="0 0 24 24"><path d="M7 4.6v14.8a1 1 0 0 0 1.5.86l12.3-7.4a1 1 0 0 0 0-1.72L8.5 3.74A1 1 0 0 0 7 4.6Z" fill="currentColor"/></symbol>
    <symbol id="i-pause" viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="i-instagram" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.3" fill="currentColor"/></symbol>
    <symbol id="i-linkedin" viewBox="0 0 24 24"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.16-.02-2.64-1.61-2.64-1.61 0-1.86 1.26-1.86 2.56v4.92h-4v-11Z"/></symbol>
  </svg>'''

ICONS = {
    'pink': '<svg class="service__icon" viewBox="0 0 56 56" aria-hidden="true"><path d="M0 0a56 56 0 0 1 56 56H0Z" fill="#fd3773"/><circle cx="44" cy="12" r="10" fill="#f5f3f1"/></svg>',
    'green': '<svg class="service__icon" viewBox="0 0 56 56" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#86c98f"/><path d="M16 56a20 20 0 0 1 40 0Z" fill="#f5f3f1"/></svg>',
    'orange': '<svg class="service__icon" viewBox="0 0 56 56" aria-hidden="true"><path d="M0 0h28a28 28 0 0 1 0 56H0Z" fill="#f85d28"/><rect x="36" y="0" width="20" height="20" fill="#f5f3f1"/></svg>',
}

WORKSHOPS = {
    'meta-ads': dict(
        name='Meta Ads', accent='pink', short='Best practice & optimisation',
        card='Structure, audiences, retargeting, creative and budget, so you can launch, manage and scale your own Meta Ads.',
        title='Meta Ads Workshop | InHaus Digital',
        desc='A hands-on, online Meta Ads best practice and optimisation workshop. Learn to launch, manage and scale your own Facebook and Instagram ads with the team behind Style My Wall.',
        h1='Run your own Meta Ads, <span class="text-pink">like a pro.</span>',
        lead='A hands-on Meta Ads best practice and optimisation workshop. Running ads for the first time, or already spending and not sure it’s working? We’ll teach you to run, read and scale them yourself.',
        img=('duo-warehouse.webp', 1200, 1179, 'orange', 'Justin Bausch and Felisha Mina at the Style My Wall warehouse'),
        platform_line='Meta has made it easier than ever to run your own ads. You just need to learn the best-practice way to do it, and how to scale. We do that with you, until you’re a master at running your own ads.',
        start_title='Starting out', start='Never run Meta Ads before? We’ll set you up properly from day one, so you don’t waste budget learning the hard way.',
        start_list=['Your account set up the right way', 'The numbers that matter, explained', 'Confidence to launch your first campaign'],
        running_title='Already running ads', running='Spending but not sure it’s working? We’ll review what you’ve got, fix the structure and show you exactly where your money is going.',
        running_list=['An honest review of your account', 'A cleaner, best-practice structure', 'Clear rules for when to scale or pull back'],
        covered=['Review of your campaign, ad set and audience structure', 'Retargeting strategy', 'Budget allocation and optimisation', 'Creative strategy and best practice',
                 'Reporting, KPIs and performance analysis', 'Training on how to launch, manage, analyse and optimise campaigns'],
        goal='Build on your understanding of Meta Ads and optimise your creative, strategy and structure.',
        note='Runs over a month: a 2-hour hands-on workshop to start, then 30-minute catch-ups every week.',
        enquire_h2='Ready to take control of your Meta Ads?',
        faq_start=('Do I need to be running Meta Ads already?', 'No. If you’re starting out, we set your account up the right way from day one. If you’re already spending, we review what you’ve got, fix the structure and show you exactly where your money is going.')),
    'google-ads': dict(
        name='Google Ads', accent='green', short='Best practice & optimisation',
        card='Account audit, conversion tracking, optimisation and the key metrics that tell you when to scale or pull back.',
        title='Google Ads Workshop | InHaus Digital',
        desc='A hands-on, online Google Ads best practice and optimisation workshop. Learn to set up, track and optimise your own Google Ads with the team behind Style My Wall.',
        h1='Make every Google Ads dollar <span class="text-green">work harder.</span>',
        lead='A hands-on Google Ads best practice and optimisation workshop. Setting up your first campaign, or already spending and unsure where the budget goes? We’ll teach you to run it efficiently yourself.',
        img=('talk-powerup.webp', 1000, 667, 'green', 'Justin Bausch speaking on stage at Power Retail PowerUP'),
        platform_line='Google has made it easier than ever to run your own ads. You just need the best-practice setup, tracking you can trust and the key metrics that tell you when to scale or pull back. We do that with you, until you’re running your own ads with confidence.',
        start_title='Starting out', start='Never run Google Ads before? We’ll set you up properly from day one, so you don’t waste budget learning the hard way.',
        start_list=['Your account set up the right way', 'Conversion tracking you can trust', 'Confidence to launch your first campaign'],
        running_title='Already running ads', running='Spending but not sure it’s working? We’ll audit what you’ve got, restructure where it’s needed and show you exactly where your budget is going.',
        running_list=['A full account audit', 'A best-practice restructure where it’s needed', 'Clear rules for when to scale or pull back'],
        covered=['Google Ads account audit and/or best-practice restructure', 'Conversion tracking and measurement setup', 'Campaign optimisation',
                 'Reporting and key metrics', 'The key metrics for scaling or reducing your ad budget'],
        goal='Optimise your Google Ads budget and strategy, understand the key metrics and make sure your budget is being used efficiently.',
        note='Runs over four weeks: a 2-hour hands-on workshop to start, then 30-minute catch-ups every week.',
        enquire_h2='Ready to take control of your Google Ads?',
        faq_start=('Do I need to be running Google Ads already?', 'No. If you’re starting out, we set your account and tracking up the right way from day one. If you’re already spending, we audit what you’ve got, restructure where it’s needed and show you exactly where your budget is going.')),
    'crm-email': dict(
        name='CRM & Email', accent='orange', short='Flows, segmentation & automation',
        card='The flows, segments and campaigns that turn one-time buyers into repeat customers, set up so you can run them yourself.',
        title='CRM & Email Workshop | InHaus Digital',
        desc='A hands-on, online CRM and email marketing workshop. Build the flows, segments and campaigns that drive repeat revenue, and learn to run them yourself.',
        h1='Turn one-time buyers into <span class="text-orange">repeat customers.</span>',
        lead='A hands-on CRM and email workshop. Starting from scratch, or already sending emails without a plan? We’ll build the flows, segments and campaigns that drive repeat revenue with you, and teach you to run them yourself.',
        img=('duo-garden.webp', 900, 1350, 'orange', 'Justin Bausch and Felisha Mina talking on a garden terrace'),
        platform_line='Your email list is the one channel you own. You don’t need an agency to run it; you need the right flows, smart segments and a plan you can keep up. We build it with you, so you can run it yourself.',
        start_title='Starting out', start='No email marketing set up yet? We’ll build the essentials with you from day one, so every new customer gets the right message at the right time.',
        start_list=['Your platform set up the right way', 'The core flows every brand needs', 'Confidence to send your first campaigns'],
        running_title='Already sending emails', running='Sending emails but not sure they’re pulling their weight? We’ll review your flows and segments, fill the gaps and show you what email really contributes.',
        running_list=['An honest review of your flows and list', 'Smarter segments and automation', 'Reporting on what email actually earns'],
        covered=['Lifecycle and automation strategy', 'Welcome, abandoned cart and post-purchase flows', 'Segmentation and database growth',
                 'Campaign planning and email best practice', 'Loyalty and repeat-purchase programs', 'Reporting on what email really contributes to revenue'],
        goal='Build email and automation that turns one-time buyers into repeat revenue you can measure.',
        note='A 2-hour hands-on workshop to start, then 30-minute catch-ups every week.',
        enquire_h2='Ready to make email pull its weight?',
        faq_start=('Do I need email marketing set up already?', 'No. If you’re starting from scratch, we build the essentials with you from day one. If you’re already sending, we review your flows and segments, fill the gaps and show you what email really contributes.')),
}


TOUR = '''        <div class="tour" data-tour role="region" aria-label="Walkthrough: how the InHaus platform works">
          <div class="tour__window">
            <div class="tour__bar" aria-hidden="true"><i></i><i></i><i></i><span class="tour__url">app.inhausdigital.com.au</span></div>
            <div class="tour__stage">
              <div class="tour__scene">
                <p class="tour__label tour__in">Step 1 · Connect</p>
                <p class="tour__title tour__in" style="--i:1">Plug in your whole stack in days.</p>
                <ul class="tour__chips">
                  <li class="tour__in" style="--i:2">Shopify</li><li class="tour__in" style="--i:3">Meta</li><li class="tour__in" style="--i:4">Google</li>
                  <li class="tour__in" style="--i:5">Klaviyo</li><li class="tour__in" style="--i:6">Pinterest</li><li class="tour__in" style="--i:7">Slack</li>
                </ul>
              </div>
              <div class="tour__scene">
                <p class="tour__label tour__in">Step 2 · True attribution, last 30 days</p>
                <p class="tour__title tour__in" style="--i:1">See what really drove your orders.</p>
                <div class="tour__bars">
                  <div class="tour__row"><span>Google Ads</span><div class="tour__track"><i class="claimed" style="--w:100%;--i:0"></i><i class="real" style="--w:70.5%;--i:1"></i></div><b>$5,930</b></div>
                  <div class="tour__row"><span>Meta Ads</span><div class="tour__track"><i class="claimed" style="--w:74%;--i:1"></i><i class="real" style="--w:49.7%;--i:2"></i></div><b>$4,180</b></div>
                  <div class="tour__row"><span>Email</span><div class="tour__track"><i class="claimed" style="--w:46.8%;--i:2"></i><i class="real" style="--w:29.1%;--i:3"></i></div><b>$2,450</b></div>
                  <div class="tour__row"><span>Organic</span><div class="tour__track"><i class="claimed" style="--w:0%;--i:3"></i><i class="real" style="--w:22.1%;--i:4"></i></div><b>$1,860</b></div>
                </div>
                <p class="tour__legend tour__in" style="--i:3"><span>What the platforms claim</span><span class="real">What actually drove orders</span></p>
              </div>
              <div class="tour__scene">
                <p class="tour__label tour__in">Step 3 · AI account brain</p>
                <p class="tour__title tour__in" style="--i:1">An analyst for every channel that never forgets.</p>
                <p class="tour__msg tour__in" style="--i:2">Weekly report, Meta Ads: prospecting cost per purchase is up 18% since Tuesday, and two creatives are fatiguing.</p>
                <p class="tour__msg tour__msg--alt tour__in" style="--i:3">Next step: pause both, move budget to your best ad set and test three new hooks.</p>
              </div>
              <div class="tour__scene">
                <p class="tour__label tour__in">Step 4 · Live business P&amp;L, today</p>
                <p class="tour__title tour__in" style="--i:1">Real profit, every day. Not just ROAS.</p>
                <dl class="tour__pl">
                  <div class="tour__in" style="--i:2"><dt>Revenue</dt><dd>$12,480</dd></div>
                  <div class="tour__in" style="--i:3"><dt>Product costs</dt><dd>−$4,370</dd></div>
                  <div class="tour__in" style="--i:4"><dt>Ad spend</dt><dd>−$2,960</dd></div>
                  <div class="tour__in" style="--i:5"><dt>Operating expenses</dt><dd>−$1,840</dd></div>
                  <div class="tour__in is-total" style="--i:6"><dt>Profit</dt><dd>$3,310</dd></div>
                </dl>
              </div>
              <div class="tour__scene">
                <p class="tour__label tour__in">Step 5 · Daily watchdog</p>
                <p class="tour__title tour__in" style="--i:1">Quiet when it’s healthy. Loud when it isn’t.</p>
                <p class="tour__alert tour__in" style="--i:2"><b>Heads up:</b> your Google Shopping feed has 12 disapproved products, and that campaign’s spend is down 40% today.</p>
                <p class="tour__alert tour__alert--ok tour__in" style="--i:3"><b>All clear:</b> Meta, Klaviyo and Pinterest are healthy.</p>
              </div>
            </div>
          </div>
          <div class="tour__controls">
            <button class="tour__play" type="button" aria-label="Pause walkthrough"><svg class="i-play" aria-hidden="true"><use href="#i-play"/></svg><svg class="i-pause" aria-hidden="true"><use href="#i-pause"/></svg></button>
            <ol class="tour__steps">
              <li><button type="button" data-goto><span>01 </span>Connect<i></i></button></li>
              <li><button type="button" data-goto><span>02 </span>Attribution<i></i></button></li>
              <li><button type="button" data-goto><span>03 </span>AI brain<i></i></button></li>
              <li><button type="button" data-goto><span>04 </span>Profit<i></i></button></li>
              <li><button type="button" data-goto><span>05 </span>Watchdog<i></i></button></li>
            </ol>
          </div>
          <p class="tour__note">Illustrative walkthrough with example data.</p>
        </div>'''

# The promo video with voiceover (made with Remotion, see /video in the repo). Click-to-play like the YouTube embeds.
APP_VIDEO = '''        <figure class="app-video" data-reveal>
          <div class="app-video__media">
            <span class="shape shape--yellow q-br app-video__shape" aria-hidden="true"></span>
            <a class="video" href="/assets/video/inhaus-app.mp4" data-mp4 data-title="The InHaus App">
              <img src="/assets/video/inhaus-app-poster.webp" alt="" width="1280" height="720" loading="lazy">
              <span class="video__play" aria-hidden="true"><svg><use href="#i-play"/></svg></span>
              <span class="visually-hidden">Play the InHaus App video</span>
            </a>
          </div>
          <figcaption>Sound on. Figures shown are sample data.</figcaption>
        </figure>'''


# The Workshops item in the main menu, with its drop-down. `path` marks the current page.
WORKSHOP_LINKS = [
    ('/workshops/meta-ads', 'pink', 'Meta Ads'),
    ('/workshops/google-ads', 'green', 'Google Ads'),
    ('/workshops/crm-email', 'orange', 'CRM &amp; Email'),
    ('/workshops', 'all', 'All workshops'),
]


def workshops_nav(path=None):
    def current(href):
        return ' aria-current="page"' if href == path else ''
    parent = ' aria-current="true"' if path and path.startswith('/workshops/') else current('/workshops')
    links = '\n'.join(
        f'              <li><a class="sub--{colour}" href="{href}"{current(href)}>{label}</a></li>'
        for href, colour, label in WORKSHOP_LINKS)
    return f'''          <li class="has-sub">
            <a href="/workshops"{parent}>Workshops</a>
            <button class="sub-toggle" type="button" aria-expanded="false" aria-controls="workshops-menu" aria-label="Workshops menu"><svg viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5"/></svg></button>
            <ul id="workshops-menu" class="site-nav__sub">
{links}
            </ul>
          </li>'''


def header(path, cta):
    def link(href, label):
        current = ' aria-current="page"' if href == path else ''
        return f'          <li><a href="{href}"{current}>{label}</a></li>'
    return f'''  <header class="site-header">
    <div class="container site-header__inner">
      <a class="site-header__logo" href="/" aria-label="InHaus Digital home">
        <img src="/assets/img/logo-on-dark.png" alt="InHaus Digital" width="392" height="120">
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu" data-nav-toggle>
        <span></span><span></span><span></span>
      </button>
      <nav id="site-nav" class="site-nav" aria-label="Main">
        <ul>
{link('/services', 'Services')}
{link('/about', 'About')}
{workshops_nav(path)}
{link('/inhaus-app', 'InHaus App')}
{link('/media', 'Media')}
{link('/contact', 'Contact')}
          <li><a class="btn" href="{cta[0]}">{cta[1]}</a></li>
        </ul>
      </nav>
    </div>
  </header>'''


ENQUIRE = ('/contact', 'Enquire now')
APPLY = ('#enquire', 'Apply now')


def head(title, desc, path, cta=APPLY, index=True):
    robots = '' if index else '\n  <meta name="robots" content="noindex">'
    return f'''<!doctype html>
<html lang="en-AU">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">{robots}
  <link rel="canonical" href="{SITE}{path}">
  <meta name="theme-color" content="#2f2f2f">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="InHaus Digital">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:url" content="{SITE}{path}">
  <meta property="og:image" content="{SITE}/assets/img/share.jpg">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <link rel="preload" href="/assets/fonts/righteous-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/plus-jakarta-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="{CSS}">
  <script>document.documentElement.classList.add('js')</script>
  <script defer src="{JS}"></script>
</head>
<body>
{SPRITE}

  <a class="skip-link" href="#main">Skip to content</a>

{header(path, cta)}

  <main id="main">
'''


FOOTER_BLOCK = '''  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__top">
        <div class="site-footer__brand">
          <img src="/assets/img/logo-on-dark.png" alt="InHaus Digital" width="392" height="120" loading="lazy">
          <p>In-house thinking.<br><span class="text-pink">Agency impact.</span></p>
        </div>
        <div class="site-footer__cols">
          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore">Explore</h2>
            <ul>
              <li><a href="/services">Services</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/workshops">Workshops</a></li>
              <li><a href="/inhaus-app">InHaus App</a></li>
              <li><a href="/media">Media</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </nav>
          <div>
            <h2>Follow</h2>
            <ul>
              <li><a class="social" href="https://www.instagram.com/inhausdigital.au"><svg aria-hidden="true"><use href="#i-instagram"/></svg>Instagram</a></li>
              <li><a class="social" href="https://www.linkedin.com/company/inhaus-digital-aus"><svg aria-hidden="true"><use href="#i-linkedin"/></svg>LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="site-footer__bottom">
        <p class="site-footer__legal">© <span data-year>2026</span> InHaus Digital <a href="/privacy">Privacy</a></p>
        <div class="shape-strip" data-drift aria-hidden="true">
          <span class="shape shape--green half-r"></span>
          <span class="shape shape--orange q-bl"></span>
          <span class="shape shape--yellow circle"></span>
          <span class="shape shape--pink q-tr"></span>
          <span class="shape shape--green half-t"></span>
          <span class="shape shape--orange dot"></span>
        </div>
      </div>
    </div>
    <p class="site-footer__mega" aria-hidden="true">InHaus Digital</p>
  </footer>'''

FOOTER = f'''
  </main>

{FOOTER_BLOCK}
</body>
</html>
'''

ASTERISK = '<svg aria-hidden="true"><use href="#i-asterisk"/></svg>'
ARROW = '<svg aria-hidden="true"><use href="#i-arrow"/></svg>'
BOOK = f'<a class="btn" href="#enquire">Apply now {ARROW}</a>'
BOOK_DARK = f'<a class="btn btn--dark" href="#enquire">Apply now {ARROW}</a>'


def hero(eyebrow, h1, lead, img, second_href, second_label, badge='Online workshop'):
    src, w, h, tint, alt = img
    return f'''
    <section class="page-hero section--charcoal" aria-labelledby="page-title">
      <div class="container page-hero__grid">
        <div>
          <p class="eyebrow">{ASTERISK}{eyebrow}</p>
          <h1 id="page-title" class="display-xl">{h1}</h1>
          <p class="lead">{lead}</p>
          <div class="btn-row">
            {BOOK}
            <a class="btn btn--ghost" href="{second_href}">{second_label}</a>
          </div>
          <p class="hero-proof">
            <span class="hero-proof__faces" aria-hidden="true"><img src="/assets/img/avatar-justin.webp" alt="" width="96" height="96"><img src="/assets/img/avatar-felisha.webp" alt="" width="96" height="96"></span>
            <span>Taught by Justin and Felisha, the founders who took <strong>Style My Wall to $1M in year one.</strong></span>
          </p>
        </div>
        <figure class="page-hero__media" data-drift>
          <div class="tint tint--{tint}">
            <img src="/assets/img/{src}" alt="{alt}" width="{w}" height="{h}" fetchpriority="high">
          </div>
          <span class="shape shape--pink q-tl" style="left:-8%;top:-4%" aria-hidden="true"></span>
          <span class="shape shape--yellow dot" style="right:-10%;bottom:6%" aria-hidden="true"></span>
          <a class="spin-badge" href="#enquire">
            <span class="visually-hidden">Apply now</span>
            <svg viewBox="0 0 200 200" aria-hidden="true"><path id="spin-ring" d="M100 100m-76 0a76 76 0 1 1 152 0a76 76 0 1 1-152 0" fill="none"/><text><textPath href="#spin-ring" textLength="462" lengthAdjust="spacingAndGlyphs">{badge} • Apply now •</textPath></text></svg>
            <span class="spin-badge__arrow" aria-hidden="true">{ARROW}</span>
          </a>
        </figure>
      </div>
    </section>
'''


# Brands the founders have worked with, shown as a slow-moving strip under the hero.
# (file, name, width, height, size) - the logos have very different shapes, so "size" is the
# height each one needs, relative to the others, to look the same weight in the strip.
LOGOS = [
    ('kmart', 'Kmart', 438, 82, 1), ('the-iconic', 'The Iconic', 802, 96, 0.62), ('the-body-shop', 'The Body Shop', 110, 110, 1.9),
    ('sportsbet', 'Sportsbet', 346, 74, 1), ('hp', 'HP', 135, 136, 1.7), ('ray-white', 'Ray White', 806, 150, 1.05),
    ('2xu', '2XU', 221, 57, 0.85), ('ryderwear', 'Ryderwear', 233, 62, 0.8), ('olympus', 'Olympus', 338, 64, 0.72),
]


def logo_strip():
    # the strip is listed twice so it can loop without a gap; screen readers get it once
    def row(hidden):
        items = ''
        for f, name, w, h, size in LOGOS:
            alt = '' if hidden else name
            items += f'<li><img style="--size:{size}" src="/assets/img/clients/{f}.png" alt="{alt}" width="{w}" height="{h}" loading="lazy"></li>'
        attr = ' aria-hidden="true"' if hidden else ''
        return f'          <ul{attr}>{items}</ul>'
    return f'''
    <section class="trust" aria-label="Brands we’ve worked with">
      <div class="container">
        <p class="trust__label">We’ve gone to work with</p>
        <div class="logo-marquee">
{row(False)}
{row(True)}
        </div>
      </div>
    </section>
'''


AFTER_APPLYING = (
    'You can book a quick chat with us straight away, at a time that suits. We’ll talk through your business and where you’re at, then book in your 2-hour workshop.'
    if CALENDLY_URL else
    'We’ll be in touch to set up a quick chat about your business and where you’re at. From there we book in your 2-hour workshop at a time that suits.')


def faq(start, note):
    items = [
        start,
        ('How does the workshop run?', f'{note} You leave the first session with a clear plan for your structure, budget and next steps.'),
        ('Is it online or in person?', 'Online. You can join from wherever you are, and we work in your own accounts together.'),
        ('Will we be working in my own accounts?', 'Yes. It’s hands-on implementation and training in your own accounts, so everything we set up together is yours to keep running.'),
        ('Who will I be learning from?', 'Justin and Felisha, the co-founders of InHaus Digital and Style My Wall. You’ll learn from us, not a junior.'),
        ('What if I get stuck between sessions?', 'Ask us. Support between sessions is included, and we review results and optimise together at each weekly catch-up.'),
        ('Do I get access to the InHaus App?', 'Yes. Join a workshop and you join the InHaus team: you get your own login to the platform Justin built to run Style My Wall.'),
        ('Can I do more than one workshop?', 'Yes. Take one, or work through them back to back.'),
        ('What happens after I apply?', AFTER_APPLYING),
    ]
    rows = '\n'.join(f'''          <details class="faq__item">
            <summary>{q}<span class="faq__icon" aria-hidden="true"><svg><use href="#i-plus"/></svg></span></summary>
            <p>{a}</p>
          </details>''' for q, a in items)
    return f'''
    <section class="section section--deep" aria-labelledby="faq-title">
      <div class="container faq-grid">
        <div class="section-head" data-reveal>
          <p class="eyebrow">{ASTERISK}Good questions</p>
          <h2 id="faq-title" class="display-lg">Before you apply</h2>
          <div class="btn-row">{BOOK}</div>
        </div>
        <div class="faq" data-reveal="2">
{rows}
        </div>
      </div>
    </section>
'''


def word_band(words, modifier=''):
    row = ''.join(f'<li>{w}</li><li>{ASTERISK}</li>' for w in words)
    return f'''
    <div class="marquee{modifier}" role="img" aria-label="{', '.join(words)}">
      <div class="marquee__track" aria-hidden="true">
        <ul class="marquee__list">{row}</ul>
        <ul class="marquee__list">{row}</ul>
      </div>
    </div>
'''


APPLY_BAND = word_band(['Take back control', 'Learn it yourself', 'Run it like a pro', 'Apply now'], ' marquee--pink marquee--outline')


# Phones and tablets: an Apply button that stays within reach once the hero has scrolled away
def apply_bar(name):
    return f'''
  <div class="apply-bar" data-apply-bar>
    <p>{name}<span>Online, with Justin &amp; Felisha</span></p>
    <a class="btn" href="#enquire">Apply now {ARROW}</a>
  </div>
'''


def pains(platform_line):
    return f'''
    <section class="section section--yellow" aria-labelledby="pains-title">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow">{ASTERISK}Sound familiar?</p>
          <h2 id="pains-title" class="display-lg">Been burnt by an agency before?</h2>
          <p class="lead">Are you paying all this money for other people to take from you and do little in return?</p>
        </div>
        <div class="pains">
          <article class="pain" data-reveal>
            <span class="shape shape--pink q-bl pain__shape" aria-hidden="true"></span>
            <h3>Big retainers, little in return</h3>
            <p>Thousands a month for “account management”, and results that barely move.</p>
          </article>
          <article class="pain" data-reveal="2">
            <span class="shape shape--charcoal circle pain__shape" aria-hidden="true"></span>
            <h3>Reports you can’t make sense of</h3>
            <p>Pages of platform numbers, and nothing tied to your actual sales.</p>
          </article>
          <article class="pain" data-reveal="3">
            <span class="shape shape--orange half-r pain__shape" aria-hidden="true"></span>
            <h3>Know-how that walks out the door</h3>
            <p>When the agency goes, everything they learned about your business goes with them.</p>
          </article>
        </div>
        <div class="manifesto" data-reveal>
          <h3>Most businesses don’t need an agency.</h3>
          <div>
            <p class="lead">We believe <mark class="hl">95% of businesses</mark> can do it themselves.</p>
            <p>{platform_line}</p>
            <div class="btn-row">{BOOK}</div>
          </div>
        </div>
      </div>
    </section>
'''


def audience(w):
    li = lambda items: '\n'.join(f'              <li>{ASTERISK}{i}</li>' for i in items)
    return f'''
    <section class="section section--cream" aria-labelledby="audience-title">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow">{ASTERISK}Who it’s for</p>
          <h2 id="audience-title" class="display-lg">Wherever you’re starting from</h2>
          <p class="lead">Either way, the goal is the same: we help you learn it, so you can run it yourself with confidence.</p>
        </div>
        <div class="ways">
          <article class="way way--dark" data-reveal>
            <span class="shape shape--green circle way__shape" aria-hidden="true"></span>
            <h3>{w['start_title']}</h3>
            <p>{w['start']}</p>
            <ul>
{li(w['start_list'])}
            </ul>
          </article>
          <article class="way way--yellow" data-reveal="2">
            <span class="shape shape--pink q-bl way__shape" aria-hidden="true"></span>
            <h3>{w['running_title']}</h3>
            <p>{w['running']}</p>
            <ul>
{li(w['running_list'])}
            </ul>
          </article>
        </div>
        <div class="btn-row" data-reveal>{BOOK_DARK}</div>
      </div>
    </section>
'''


def covered(w):
    items = '\n'.join(f'            <li>{ASTERISK}{c}</li>' for c in w['covered'])
    return f'''
    <section id="covered" class="section section--deep accent-{w['accent']}" aria-labelledby="covered-title">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow">{ASTERISK}{w['name']} workshop</p>
          <h2 id="covered-title" class="display-lg">What we cover</h2>
        </div>
        <div class="covered">
          <ul class="checklist" data-reveal>
{items}
          </ul>
          <div class="goal" data-reveal="2">
            <p class="eyebrow">{ASTERISK}The goal</p>
            <p>{w['goal']}</p>
          </div>
        </div>
      </div>
    </section>
'''


def included(note):
    return f'''
    <section class="section section--yellow" aria-labelledby="included-title">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow">{ASTERISK}How it works</p>
          <h2 id="included-title" class="display-lg">What’s included</h2>
        </div>
        <ol class="included" data-reveal="2">
          <li><h3>2-hour workshop</h3><p>A hands-on implementation and training session online, working in your own accounts.</p></li>
          <li><h3>Strategy development</h3><p>A clear plan for your structure, budget and next steps.</p></li>
          <li><h3>Weekly catch-ups</h3><p>30 minutes every week to review results and optimise together.</p></li>
          <li><h3>Support</h3><p>Questions between sessions? We’re there to help.</p></li>
        </ol>
        <p class="included-note" data-reveal>{note}</p>
        <div class="btn-row" data-reveal>{BOOK_DARK}</div>
      </div>
    </section>
'''


PROOF = f'''
    <section class="section section--deep" aria-labelledby="proof-title">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow">{ASTERISK}Proof, not promises</p>
          <h2 id="proof-title" class="display-lg">Learn from people who’ve <span class="text-yellow">done it.</span></h2>
        </div>
        <ul class="numbers" data-reveal="2">
          <li><strong class="text-pink">$1M</strong><span>Style My Wall revenue in its first year</span></li>
          <li><strong>1<svg aria-hidden="true"><use href="#i-arrow"/></svg><span class="text-orange" data-count="20" data-from="1">20</span></strong><span>people on the team in two years</span></li>
          <li><strong class="text-green" data-count="35" data-suffix="%">35%</strong><span>increase in email’s contribution to revenue for a global gym apparel brand</span></li>
        </ul>
        <p class="included-note" data-reveal>Australia Post ORIAS 2026 Finalist, Best Small Independent Retailer.</p>
      </div>
    </section>
'''

PLATFORM = f'''
    <section class="section section--charcoal" aria-labelledby="platform-title">
      <div class="container platform">
        <div data-reveal>
          <p class="eyebrow">{ASTERISK}Included when you join the InHaus team</p>
          <h2 id="platform-title" class="display-lg">The AI system Justin built <span class="text-yellow">to scale Style My Wall.</span></h2>
          <p class="lead">Justin built his own AI-powered growth platform to run Style My Wall as it grew to a team of 20, on track for $8–10M in year two. Now he’s opening it up to the small businesses we work with.</p>
          <p class="muted">Join a workshop and you join the InHaus team: you get your own login to use the platform to help scale your business.</p>
          <div class="features">
            <div class="feature"><h3>True attribution</h3><p>See what each channel really drove, side by side with what the ad platforms claim.</p></div>
            <div class="feature"><h3>AI account brains</h3><p>An AI analyst for each channel that remembers your account and watches it daily.</p></div>
            <div class="feature"><h3>Live business P&amp;L</h3><p>Revenue minus product costs, ad spend and expenses, every day.</p></div>
            <div class="feature"><h3>Daily watchdog</h3><p>Alerts the moment a campaign bleeds, plus weekly reports in plain English.</p></div>
          </div>
          <div class="btn-row">
            {BOOK}
            <a class="btn btn--ghost" href="https://app.inhausdigital.com.au/" target="_blank" rel="noopener">See the platform</a>
          </div>
        </div>
        <div class="platform__media" data-reveal="2">
          <figure>
            <a class="video video--short" href="https://www.youtube.com/shorts/MnvIZc3WEZs" data-video="MnvIZc3WEZs" data-title="The app that helped me scale to 7 figures">
              <img src="https://i.ytimg.com/vi/MnvIZc3WEZs/oar2.jpg" alt="" width="720" height="1280" loading="lazy">
              <span class="video__play" aria-hidden="true"><svg><use href="#i-play"/></svg></span>
              <span class="visually-hidden">Play: The app that helped me scale to 7 figures</span>
            </a>
            <figcaption>The app that helped me scale to 7 figures</figcaption>
          </figure>
          <figure class="spotify">
            <iframe src="https://open.spotify.com/embed/episode/6oEpmkSQ0begz8l3CUrlTs?utm_source=generator" title="Listen on Spotify: The Self-Built AI Brain Behind Style My Wall’s Growth" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
            <figcaption>Add To Cart #656: the self-built AI brain behind Style My Wall’s growth</figcaption>
          </figure>
        </div>
      </div>
      <div id="how-it-works" class="container tour-wrap">
        <div class="section-head" data-reveal>
          <p class="eyebrow">{ASTERISK}See it in action</p>
          <h3 class="display-md">The InHaus App in just over a minute</h3>
        </div>
{APP_VIDEO}
      </div>
    </section>
'''

TEAM = f'''
    <section class="section section--cream" aria-labelledby="team-title">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow">{ASTERISK}Meet your team</p>
          <h2 id="team-title" class="display-lg">You’ll learn from us, not a junior.</h2>
        </div>
        <div class="people">
          <article class="person" data-reveal>
            <div class="tint tint--yellow"><img src="/assets/img/justin-studio.webp" alt="Justin Bausch" width="1600" height="1067" loading="lazy" style="object-position:62% 40%"></div>
            <h3>Justin Bausch</h3>
            <span class="person__role">Co-founder</span>
            <p>Justin spent over a decade managing global CRM platforms for major retail and ecommerce brands, including Kmart and Ryderwear, before building Style My Wall with Felisha. He built the InHaus platform to run it, and he’ll show you exactly how he runs and scales ads.</p>
          </article>
          <article class="person" data-reveal="2">
            <div class="tint tint--pink"><img src="/assets/img/felisha.webp" alt="Felisha Mina" width="1400" height="804" loading="lazy" style="object-position:28% 35%"></div>
            <h3>Felisha Mina</h3>
            <span class="person__role">Co-founder</span>
            <p>Felisha co-founded Style My Wall with Justin and helped grow it from launch to $1M in its first year and a team of 20. She knows what it takes to build a brand people remember, and buy from.</p>
          </article>
        </div>
        <div class="btn-row" data-reveal>{BOOK_DARK}</div>
      </div>
    </section>
'''


APPLY_LEAD = ('Tell us a little about your business and where you’re at, then pick a time for a quick chat.' if CALENDLY_URL else
              'Tell us a little about your business and where you’re at. We’ll be in touch to find the right workshop and a time that suits.')


def enquire(h2, checked, page_name):
    opts = [('Meta Ads', 'meta-ads'), ('Google Ads', 'google-ads'), ('CRM & Email', 'crm-email')]
    boxes = '\n'.join(
        f'              <label class="choice"><input type="checkbox" name="workshop" value="{n.replace("&", "&amp;")}"{" checked" if s == checked else ""}>{n.replace("&", "&amp;")}</label>'
        for n, s in opts)
    subject = f'Workshop enquiry: {page_name}' if page_name != 'Workshops' else 'Workshop enquiry'
    return f'''
    <section id="enquire" class="section section--yellow contact" aria-labelledby="enquire-title">
      <div class="container contact__grid">
        <div class="contact__intro" data-reveal>
          <p class="eyebrow">{ASTERISK}Apply now</p>
          <h2 id="enquire-title" class="display-lg">{h2}</h2>
          <p class="lead">{APPLY_LEAD}</p>
          <ol class="next-steps">
            <li>Tell us about your business</li>
            <li>{CHAT_STEP}</li>
            <li>We book in your 2-hour workshop</li>
          </ol>
        </div>

        <form class="form" data-form="contact" data-thanks="/workshops/thank-you" action="https://api.web3forms.com/submit" method="POST" data-reveal="2">
          <input type="hidden" name="access_key" value="{KEY}">
          <input type="hidden" name="subject" value="{subject.replace("&", "&amp;")}">
          <input type="hidden" name="from_name" value="InHaus Digital website">
          <input type="hidden" name="page" value="{page_name.replace("&", "&amp;")} workshop page">
          <input type="checkbox" name="botcheck" class="form__trap" tabindex="-1" autocomplete="off" aria-hidden="true">
          <div class="field field--pair">
            <label for="first-name">First name</label>
            <input id="first-name" name="first_name" type="text" autocomplete="given-name" required>
          </div>
          <div class="field field--pair">
            <label for="last-name">Last name</label>
            <input id="last-name" name="last_name" type="text" autocomplete="family-name" required>
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" autocomplete="email" required>
          </div>
          <div class="field">
            <label for="phone">Contact number</label>
            <input id="phone" name="phone" type="tel" autocomplete="tel" required>
          </div>
          <div class="field field--full">
            <label for="company">Business name or website</label>
            <input id="company" name="company" type="text" autocomplete="organization">
          </div>
          <fieldset class="field field--full">
            <legend>Which workshop? <span class="field__hint">(tick all that apply)</span></legend>
            <div class="choices">
{boxes}
            </div>
          </fieldset>
          <fieldset class="field field--full">
            <legend>Where are you at?</legend>
            <div class="choices">
              <label class="choice"><input type="radio" name="where_at" value="Just starting out">Just starting out</label>
              <label class="choice"><input type="radio" name="where_at" value="Already running ads">Already running ads</label>
              <label class="choice"><input type="radio" name="where_at" value="Not sure">Not sure</label>
            </div>
          </fieldset>
          <div class="field field--full">
            <label for="message">Anything else? <span class="field__hint">(optional)</span></label>
            <textarea id="message" name="message"></textarea>
          </div>
          <div class="form__actions">
            <button class="btn btn--dark" type="submit">Apply now {ARROW}</button>
            <p class="form__status" data-form-status role="status" aria-live="polite"></p>
          </div>
          <p class="form__note">No obligation. We handle your details as set out in our <a href="/privacy">privacy policy</a>.</p>
        </form>
      </div>
    </section>
'''


def card(slug, heading_tag='h3'):
    w = WORKSHOPS[slug]
    return f'''          <a class="workshop-card workshop-card--{w['accent']} service--{w['accent']}" href="/workshops/{slug}" data-reveal>
            {ICONS[w['accent']]}
            <{heading_tag}>{w['name'].replace("&", "&amp;")}</{heading_tag}>
            <span class="workshop-card__kicker">{w['short'].replace("&", "&amp;")}</span>
            <p>{w['card']}</p>
            <span class="workshop-card__link">Explore the workshop {ARROW}</span>
          </a>'''


def write(path, html):
    full = os.path.join(OUT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    open(full, 'w', encoding='utf-8').write(html)
    print('wrote', path, len(html) // 1024, 'KB')


# Parent page
parent = head('Workshops | InHaus Digital',
              'Hands-on, online Meta Ads, Google Ads and CRM/email workshops. Learn to run your own marketing with the team behind Style My Wall, and get access to the InHaus growth platform.',
              '/workshops')
parent += hero('Online workshops', 'Stop paying an agency. <span class="text-pink">Learn to do it yourself.</span>',
               'Hands-on Meta Ads, Google Ads and CRM/email workshops from the duo who built Style My Wall. Running ads for the first time, or already spending and unsure what’s working? We’ll teach you to run it like a pro.',
               ('talk-powerup.webp', 1000, 667, 'yellow', 'Justin Bausch speaking on stage at Power Retail PowerUP'), '#workshops', 'See the workshops', badge='Online workshops')
parent += logo_strip()
parent += pains('Meta and Google have made it easier than ever to run your own ads. You just need to learn the best-practice way to do it, and how to scale. We do that with you, until you’re a master at running your own marketing.')
parent += PROOF
parent += audience(dict(start_title='Starting out', start='Never run ads before? We’ll set you up properly from day one, so you don’t waste budget learning the hard way.',
                        start_list=['Accounts set up the right way', 'The numbers that matter, explained', 'Confidence to launch your first campaign'],
                        running_title='Already running ads', running='Spending but not sure it’s working? We’ll review what you’ve got, fix the structure and show you exactly where your money is going.',
                        running_list=['An honest review of your accounts', 'A cleaner, best-practice structure', 'Clear rules for when to scale or pull back']))
parent += f'''
    <section id="workshops" class="section section--deep" aria-labelledby="workshops-title">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow">{ASTERISK}Choose your workshop</p>
          <h2 id="workshops-title" class="display-lg">Three workshops. <span class="text-green">One goal: you, in control.</span></h2>
          <p class="lead">Take one, or work through them back to back.</p>
        </div>
        <div class="workshop-cards">
{card('meta-ads')}
{card('google-ads')}
{card('crm-email')}
        </div>
      </div>
    </section>
'''
PARENT_NOTE = 'Google Ads and Meta Ads each run over four weeks: a 2-hour hands-on workshop to start, then 30-minute catch-ups every week.'
parent += included(PARENT_NOTE)
parent += PLATFORM + TEAM
parent += faq(('Do I need to be running ads already?', 'No. If you’re starting out, we set you up the right way from day one. If you’re already spending, we review what you’ve got, fix the structure and show you exactly where your money is going.'), PARENT_NOTE)
parent += APPLY_BAND + enquire('Ready to take back control?', None, 'Workshops')
parent += FOOTER.replace('  </main>\n', '  </main>\n' + apply_bar('InHaus workshops'))
write('workshops.html', parent)

# One page per workshop
for slug, w in WORKSHOPS.items():
    others = [s for s in WORKSHOPS if s != slug]
    page = head(w['title'], w['desc'], f'/workshops/{slug}')
    page += hero(f'Online workshop · {w["name"].replace("&", "&amp;")}', w['h1'], w['lead'], w['img'], '#covered', 'What’s covered')
    page += logo_strip()
    page += pains(w['platform_line'])
    page += PROOF
    page += audience(w)
    page += covered(w)
    page += included(w['note'])
    page += PLATFORM + TEAM + faq(w['faq_start'], w['note']) + APPLY_BAND + enquire(w['enquire_h2'], slug, w['name'])
    page += f'''
    <section class="section section--charcoal" aria-labelledby="others-title">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow">{ASTERISK}More workshops</p>
          <h2 id="others-title" class="display-md">Pair it with another workshop</h2>
        </div>
        <div class="workshop-cards workshop-cards--two">
{card(others[0])}
{card(others[1])}
        </div>
        <div class="btn-row" data-reveal><a class="btn btn--ghost" href="/workshops">All workshops</a></div>
      </div>
    </section>
'''
    page += FOOTER.replace('  </main>\n', '  </main>\n' + apply_bar(f'{w["name"].replace("&", "&amp;")} workshop'))
    write(f'workshops/{slug}.html', page)


# InHaus App page
def feature(title, text):
    return f'            <div class="feature"><h3>{title}</h3><p>{text}</p></div>'


def bolt(shape, title, text, n):
    return f'''          <article class="pain" data-reveal="{n}">
            <span class="shape {shape} pain__shape" aria-hidden="true"></span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>'''


app = head('InHaus App | InHaus Digital',
           'The AI-powered growth platform Justin built to run Style My Wall: true attribution, AI account brains, live profit tracking and daily alerts, in one login.',
           '/inhaus-app', cta=ENQUIRE)
app += f'''
    <section class="page-hero section--charcoal" aria-labelledby="page-title">
      <div class="container page-hero__grid">
        <div>
          <p class="eyebrow">{ASTERISK}InHaus App</p>
          <h1 id="page-title" class="display-xl">The growth platform <span class="text-yellow">we built for ourselves.</span></h1>
          <p class="lead">Justin built the InHaus platform to run Style My Wall as it grew to a team of 20, on track for $8–10M in year two. True attribution, AI account brains and live profit tracking, all in one login. Now it’s available to the businesses we work with.</p>
          <div class="btn-row">
            <a class="btn" href="#how-it-works">Watch the video <svg aria-hidden="true"><use href="#i-play"/></svg></a>
            <a class="btn btn--ghost" href="/contact">Enquire now</a>
          </div>
        </div>
        <div class="page-hero__shapes" data-drift aria-hidden="true">
          <span class="shape shape--yellow q-br"></span>
          <span class="shape shape--pink circle"></span>
          <span class="shape shape--green half-r"></span>
          <span class="shape shape--orange q-tl"></span>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="section section--deep" aria-labelledby="tour-title">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow">{ASTERISK}See it in action</p>
          <h2 id="tour-title" class="display-lg">The InHaus App in just over a minute</h2>
          <p class="lead muted">Your numbers, your AI brain, your products and your ads, all in one place.</p>
        </div>
{APP_VIDEO}
        <div class="section-head tour-head" data-reveal>
          <h3 class="display-md">How it works, step by step</h3>
          <p class="lead muted">From plugging in your tools to the alert that saves a bad day of ad spend.</p>
        </div>
{TOUR}
      </div>
    </section>

    <section class="section section--charcoal" aria-labelledby="features-title">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow">{ASTERISK}What’s inside</p>
          <h2 id="features-title" class="display-lg">One login. <span class="text-green">Everything that matters.</span></h2>
        </div>
        <div class="features features--3" data-reveal="2">
{feature('True attribution', 'A first-party pixel stamps every visit and click onto every order, and shows what each channel really drove next to what the ad platforms claim.')}
{feature('AI account brains', 'A dedicated AI analyst for each channel, with a living memory of your account: its rules, its history and every change. It watches daily and reports weekly.')}
{feature('Live business P&amp;L', 'Revenue minus product costs, ad spend and your real operating expenses, every day. Scale what’s profitable, not what merely has a pretty ROAS.')}
{feature('Daily watchdog', 'Silent when things are healthy, loud the moment a campaign bleeds, a feed breaks or spend drifts. Weekly deep-dives land automatically.')}
{feature('Your own workspace', 'Your dashboards, your P&amp;L and your AI brain in a workspace of your own, with your own login to see everything.')}
{feature('Wired into your stack', 'Shopify, Meta, Google, Klaviyo, Pinterest and Slack, with server-side conversions sent back so the ad platforms learn from real sales.')}
        </div>
      </div>
    </section>

    <section class="section section--cream" aria-labelledby="bolt-title">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow">{ASTERISK}Custom bolt-ons</p>
          <h2 id="bolt-title" class="display-lg">Tools built for your business, not everyone’s.</h2>
          <p class="lead">Off-the-shelf software makes you fit its shape. We add bespoke modules to your workspace when your growth needs them.</p>
        </div>
        <div class="pains pains--six">
{bolt('shape--pink q-bl', 'UGC creative generator', 'On-brand image and video creatives generated from your products, for fresh ad angles without the shoot.', 1)}
{bolt('shape--green circle', 'Lead finder', 'A prospector that finds, qualifies and exports the businesses you should be talking to.', 2)}
{bolt('shape--orange half-r', 'Product creator', 'Generate product imagery, variants and listings, and publish straight to Shopify in minutes.', 3)}
{bolt('shape--charcoal q-tr', 'AI support copilot', 'Reads your support inbox, checks real order status and drafts accurate replies in your brand voice.', 1)}
{bolt('shape--pink half-t', 'Fulfilment &amp; ops suite', 'Production dashboards, courier scorecards, automated returns and staff output reports.', 2)}
{bolt('shape--green dot', 'Whatever you need next', 'Each of these started as a build for one business’s problem. If your growth needs a tool, we build it in.', 3)}
        </div>
      </div>
    </section>

    <section class="section section--yellow" aria-labelledby="story-title">
      <div class="container platform">
        <div data-reveal>
          <p class="eyebrow">{ASTERISK}Built for Style My Wall first</p>
          <h2 id="story-title" class="display-lg">Not software we sell. A system we run on.</h2>
          <p class="lead">Justin built the platform to run his own ecommerce brand, and Style My Wall still runs on it every day. Hear him talk about how it works on the Add To Cart podcast.</p>
        </div>
        <div class="platform__media" data-reveal="2">
          <figure>
            <a class="video video--short" href="https://www.youtube.com/shorts/MnvIZc3WEZs" data-video="MnvIZc3WEZs" data-title="The app that helped me scale to 7 figures">
              <img src="https://i.ytimg.com/vi/MnvIZc3WEZs/oar2.jpg" alt="" width="720" height="1280" loading="lazy">
              <span class="video__play" aria-hidden="true"><svg><use href="#i-play"/></svg></span>
              <span class="visually-hidden">Play: The app that helped me scale to 7 figures</span>
            </a>
            <figcaption>The app that helped me scale to 7 figures</figcaption>
          </figure>
          <figure class="spotify">
            <iframe src="https://open.spotify.com/embed/episode/6oEpmkSQ0begz8l3CUrlTs?utm_source=generator" title="Listen on Spotify: The Self-Built AI Brain Behind Style My Wall’s Growth" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
            <figcaption>Add To Cart #656: the self-built AI brain behind Style My Wall’s growth</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section id="get-access" class="section section--charcoal" aria-labelledby="access-title">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow">{ASTERISK}Get access</p>
          <h2 id="access-title" class="display-lg">Two ways in.</h2>
          <p class="lead muted">The platform comes with working with us, whichever way suits you.</p>
        </div>
        <div class="workshop-cards workshop-cards--two">
          <a class="workshop-card workshop-card--pink service--pink" href="/workshops" data-reveal>
            {ICONS['pink']}
            <h3>Join a workshop</h3>
            <span class="workshop-card__kicker">Learn to do it yourself</span>
            <p>Learn to run your own Meta Ads, Google Ads or email with us, and get your own login to the platform to help scale your business.</p>
            <span class="workshop-card__link">Explore workshops {ARROW}</span>
          </a>
          <a class="workshop-card workshop-card--green service--green" href="/contact" data-reveal="2">
            {ICONS['green']}
            <h3>Partner with us</h3>
            <span class="workshop-card__kicker">We run it for you</span>
            <p>We run your marketing like an in-house team, with the platform watching your attribution, profit and channels around the clock.</p>
            <span class="workshop-card__link">Enquire now {ARROW}</span>
          </a>
        </div>
        <p class="included-note" data-reveal>Already working with us? <a href="https://app.inhausdigital.com.au/login" target="_blank" rel="noopener">Log in to the app</a>.</p>
      </div>
    </section>
'''
app += FOOTER
write('inhaus-app.html', app)


# Thank-you pages: where the forms send people once their details are in. Search engines skip
# them, and site.js reports the lead to Meta from here (once a Pixel ID is set).
def thanks(path, title, eyebrow, lead, body, h1='Thanks. We’ve got it.', compact=False):
    page = head(title, 'Thanks for getting in touch with InHaus Digital.', path, cta=ENQUIRE, index=False)
    page += f'''
    <section class="page-hero section--yellow thanks{' thanks--compact' if compact else ''}" aria-labelledby="page-title">
      <div class="container">
        <span class="thanks__tick" aria-hidden="true"><svg><use href="#i-check"/></svg></span>
        <p class="eyebrow">{ASTERISK}{eyebrow}</p>
        <h1 id="page-title" class="display-xl">{h1}</h1>
        <p class="lead">{lead}</p>
{body}
      </div>
    </section>
'''
    return page


if CALENDLY_URL:
    workshop_thanks = thanks('/workshops/thank-you', 'Application received | InHaus Digital', 'Application received',
                             'One last step: choose a time below for a quick chat about your business and where you’re at.',
                             '', h1='Thanks. <span>Now pick a time.</span>', compact=True)
    # The calendar itself is loaded by site.js. Without JavaScript the button opens Calendly instead.
    workshop_thanks += f'''
    <section class="section section--cream booking" aria-labelledby="book-title">
      <div class="container">
        <h2 id="book-title" class="visually-hidden">Book your quick chat</h2>
        <div class="booking__frame" data-calendly="{CALENDLY_URL}">
          <a class="btn btn--dark" href="{CALENDLY_URL}">Choose a time {ARROW}</a>
        </div>
        <p class="booking__note">Can’t see a time that works? Don’t worry, we’ve got your details and we’ll be in touch.</p>
      </div>
    </section>
'''
else:
    workshop_thanks = thanks('/workshops/thank-you', 'Application received | InHaus Digital', 'Application received',
                             'We’ll be in touch to set up a quick chat about your business and where you’re at. Keep an eye on your phone and inbox.',
                             '''        <ol class="next-steps">
          <li class="is-done">You told us about your business</li>
          <li>We’ll be in touch to set up a quick chat</li>
          <li>We book in your 2-hour workshop</li>
        </ol>''')
workshop_thanks += f'''
    <section class="section section--charcoal" aria-labelledby="wait-title">
      <div class="container">
        <div class="section-head" data-reveal>
          <p class="eyebrow">{ASTERISK}While you wait</p>
          <h2 id="wait-title" class="display-md">See the app you’ll get access to</h2>
        </div>
{APP_VIDEO}
        <div class="btn-row" data-reveal>
          <a class="btn btn--ghost" href="/media">Hear our story</a>
          <a class="btn btn--ghost" href="https://www.instagram.com/inhausdigital.au">Follow us on Instagram</a>
        </div>
      </div>
    </section>
''' + FOOTER
write('workshops/thank-you.html', workshop_thanks)

write('thank-you.html', thanks('/thank-you', 'Message received | InHaus Digital', 'Message received',
                               'We’ll be in touch soon. In the meantime, have a look around.',
                               '''        <div class="btn-row">
          <a class="btn btn--dark" href="/workshops">Explore the workshops</a>
          <a class="btn btn--ghost" href="/inhaus-app">See the InHaus App</a>
        </div>''') + FOOTER)


# Privacy policy: plain English, and only what the site actually does
privacy = head('Privacy Policy | InHaus Digital', 'How InHaus Digital collects, uses and looks after your personal information.', '/privacy', cta=ENQUIRE)
privacy += f'''
    <section class="page-hero section--charcoal" aria-labelledby="page-title">
      <div class="container">
        <p class="eyebrow">{ASTERISK}Privacy</p>
        <h1 id="page-title" class="display-lg">Privacy policy</h1>
        <p class="lead muted">Last updated November 2026</p>
      </div>
    </section>

    <section class="section section--cream">
      <div class="container">
       <div class="prose">
        <p class="lead">InHaus Digital (“we”, “us”) is an Australian marketing business. This page explains what personal information we collect through this website, why we collect it and what we do with it.</p>

        <h2>What we collect</h2>
        <ul>
          <li><strong>Details you give us.</strong> When you send an enquiry or apply for a workshop, we collect what you enter in the form: your name, email address, phone number, business name or website, your answers and your message.</li>
          <li><strong>How you found us.</strong> If you arrive from an ad or a link, we record which campaign it was and the page you landed on, and attach that to your enquiry.</li>
          <li><strong>How the site is used.</strong> Our website host, Cloudflare, gives us anonymous visitor statistics such as pages viewed, the referring site and the type of device. This doesn’t use cookies or identify you.</li>
          <li><strong>Advertising measurement.</strong> We may use advertising tools such as the Meta Pixel to understand how our ads on Facebook and Instagram perform. When active, these tools use cookies and share information about your visit, such as the pages you viewed and whether you sent us a form, with the advertising platform. You can manage how Meta uses this in your Facebook or Instagram ad settings.</li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To reply to your enquiry or application and arrange a time to talk.</li>
          <li>To plan and deliver the services or workshops you ask about.</li>
          <li>To understand which of our pages and ads are working, and improve them.</li>
          <li>To send you updates or marketing only where you’ve asked for them or agreed to them. You can opt out at any time.</li>
        </ul>

        <h2>Who we share it with</h2>
        <p>We don’t sell your personal information. We share it only with the service providers that help us run this website and our business, such as our website host, our form, booking and email providers and our advertising platforms, and only so they can provide those services to us. Some of these providers store information outside Australia.</p>

        <h2>Keeping it safe</h2>
        <p>We take reasonable steps to protect your information from misuse, loss and unauthorised access, and we keep it only for as long as we need it for the purposes above or as the law requires.</p>

        <h2>Your choices</h2>
        <p>You can ask to see the personal information we hold about you, ask us to correct it or ask us to delete it. To do that, or to raise a privacy concern, <a href="/contact">contact us</a> and we’ll respond within a reasonable time. If you’re not satisfied with our response, you can contact the Office of the Australian Information Commissioner at <a href="https://www.oaic.gov.au" rel="noopener">oaic.gov.au</a>.</p>

        <h2>Changes to this policy</h2>
        <p>We may update this policy from time to time. The latest version will always be on this page.</p>
       </div>
      </div>
    </section>
''' + FOOTER
write('privacy.html', privacy)


# Hand-written pages: keep their header and footer in step with the ones above
HAND_WRITTEN = {
    'index.html': '/', 'services.html': '/services', 'about.html': '/about',
    'contact.html': '/contact', 'media.html': '/media', '404.html': None,
}
for name, path in HAND_WRITTEN.items():
    full = os.path.join(OUT, name)
    html = open(full, encoding='utf-8').read()
    new = re.sub(r'  <header class="site-header">.*?</header>', lambda m: header(path, ENQUIRE), html, count=1, flags=re.S)
    new = re.sub(r'  <footer class="site-footer">.*?</footer>', lambda m: FOOTER_BLOCK, new, count=1, flags=re.S)
    new = re.sub(r'/assets/css/site\.css(\?v=\w+)?"', CSS + '"', new)
    new = re.sub(r'/assets/js/site\.js(\?v=\w+)?"', JS + '"', new)
    if new != html:
        open(full, 'w', encoding='utf-8').write(new)
    print('synced', name, '(changed)' if new != html else '')
