// InHaus Digital — small progressive enhancements. The site works without this file.
(function () {
  // Meta (Facebook/Instagram) Pixel ID. Leave empty and no tracking code loads at all.
  // Paste the ID from Meta Events Manager between the quotes to switch it on.
  var META_PIXEL_ID = '';

  var body = document.body;

  // sessionStorage can be blocked (private modes, in-app browsers), so never let it break the page
  var store = {
    get: function (key) { try { return sessionStorage.getItem(key); } catch (e) { return null; } },
    set: function (key, value) { try { sessionStorage.setItem(key, value); } catch (e) { /* not available */ } }
  };

  // Remember how this visitor arrived (the campaign tags on the ad's link, and the first page
  // they saw), so every enquiry email says which ad it came from.
  var arrival = {};
  try { arrival = JSON.parse(store.get('arrival') || '{}'); } catch (e) { arrival = {}; }
  var query = new URLSearchParams(location.search);
  if (!arrival.landing_page || query.has('utm_source') || query.has('fbclid')) {
    arrival = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (tag) {
      if (query.get(tag)) arrival[tag] = query.get(tag).slice(0, 120);
    });
    if (query.get('fbclid')) arrival.from_meta_ad = 'yes';
    arrival.landing_page = location.pathname;
    if (document.referrer && document.referrer.indexOf(location.origin) !== 0) {
      arrival.referrer = document.referrer.split('/').slice(0, 3).join('/');
    }
    store.set('arrival', JSON.stringify(arrival));
  }

  // Forms send people to a thank-you page with "#sent" on the address. Take the marker off
  // straight away, so refreshing or revisiting that page never counts as a second lead.
  var justSent = location.hash === '#sent';
  if (justSent && window.history.replaceState) history.replaceState(null, '', location.pathname + location.search);

  // Meta Pixel: counts page views, plus a lead (workshop application) or a contact (general
  // enquiry) when someone arrives on a thank-you page straight after sending a form.
  if (META_PIXEL_ID) {
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
    if (justSent && location.pathname.indexOf('/workshops/') === 0) window.fbq('track', 'Lead', { content_name: 'Workshop application' });
    else if (justSent) window.fbq('track', 'Contact');
  }

  // Mobile menu
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.getElementById('site-nav');
  function setNav(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    body.classList.toggle('nav-open', open);
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && body.classList.contains('nav-open')) { setNav(false); toggle.focus(); }
    });
  }

  // Workshops drop-down: hovering opens it (CSS); the arrow button opens it for keyboards and
  // touch screens. It closes when focus or a click moves elsewhere, or on Escape.
  document.querySelectorAll('.sub-toggle').forEach(function (button) {
    var item = button.parentNode;
    function setOpen(open) { button.setAttribute('aria-expanded', String(open)); }
    button.addEventListener('click', function () {
      setOpen(button.getAttribute('aria-expanded') !== 'true');
    });
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) setOpen(false);
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
        e.stopPropagation();
        setOpen(false);
        button.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!item.contains(e.target)) setOpen(false);
    });
  });

  // Header: a background once the page scrolls. On phones (the CSS only acts there) it also
  // slides away while reading down and comes back as soon as you scroll up.
  var header = document.querySelector('.site-header');
  if (header) {
    var lastY = window.scrollY;
    var onHeaderScroll = function () {
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 8);
      if (body.classList.contains('nav-open') || y < 200) header.classList.remove('is-hidden');
      else if (y > lastY + 6) header.classList.add('is-hidden');
      else if (y < lastY - 6) header.classList.remove('is-hidden');
      lastY = y;
    };
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
    onHeaderScroll();
  }

  // Sticky Apply bar (workshop pages, phones and tablets): shows once the hero's buttons have
  // scrolled away, and steps aside while the application form itself is on screen.
  var applyBar = document.querySelector('[data-apply-bar]');
  var heroButtons = document.querySelector('.page-hero .btn-row');
  var applyForm = document.getElementById('enquire');
  if (applyBar && heroButtons && applyForm && 'IntersectionObserver' in window) {
    var pastHero = false, atForm = false;
    var updateBar = function () { applyBar.classList.toggle('is-shown', pastHero && !atForm); };
    new IntersectionObserver(function (entries) {
      pastHero = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
      updateBar();
    }).observe(heroButtons);
    new IntersectionObserver(function (entries) {
      atForm = entries[0].isIntersecting;
      updateBar();
    }, { rootMargin: '0px 0px -25% 0px' }).observe(applyForm);
  }

  // Fade sections in as they scroll into view
  var reveals = document.querySelectorAll('[data-reveal]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Headline numbers count up the first time they scroll into view. The real number is
  // already in the page, so nothing is lost without this.
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        countIO.unobserve(el);
        var from = Number(el.getAttribute('data-from') || 0);
        var to = Number(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var began = null;
        var tick = function (now) {
          if (began === null) began = now;
          var t = Math.min(1, (now - began) / 1200);
          el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3))) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.2 });
    counters.forEach(function (el) {
      // start from the low number so it doesn't flash the final one first
      el.textContent = (el.getAttribute('data-from') || 0) + (el.getAttribute('data-suffix') || '');
      countIO.observe(el);
    });
  }

  // Videos show a thumbnail first and only load the player when clicked, which keeps
  // pages fast. YouTube links (data-video) become YouTube's player; our own MP4s
  // (data-mp4) play in the browser. Without JavaScript the thumbnail is a plain link.
  document.querySelectorAll('a[data-video], a[data-mp4]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var player;
      if (link.hasAttribute('data-mp4')) {
        player = document.createElement('video');
        player.src = link.getAttribute('href');
        player.controls = true;
        player.autoplay = true;
        player.playsInline = true;
        player.setAttribute('aria-label', link.getAttribute('data-title') || 'Video');
      } else {
        var start = link.getAttribute('data-start');
        player = document.createElement('iframe');
        player.src = 'https://www.youtube-nocookie.com/embed/' + link.getAttribute('data-video') +
          '?autoplay=1&rel=0&playsinline=1' + (start ? '&start=' + start : '');
        player.title = link.getAttribute('data-title') || 'YouTube video';
        player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        player.referrerPolicy = 'strict-origin-when-cross-origin';
        player.allowFullscreen = true;
      }
      var frame = document.createElement('div');
      frame.className = link.className;
      frame.appendChild(player);
      link.replaceWith(frame);
      player.focus();
    });
  });

  // Bauhaus shapes drift as the page scrolls. Each [data-drift] group gets a --drift value
  // (its distance from the middle of the screen, in px) that follows the scroll on a soft
  // spring, so the shapes overshoot a little and settle. The CSS turns it into movement.
  var driftGroups = [].slice.call(document.querySelectorAll('[data-drift]'));
  if (driftGroups.length && !reduceMotion) {
    var groups = driftGroups.map(function (el) { return { el: el, pos: 0, vel: 0, target: 0 }; });
    var running = false;
    var measure = function () {
      var middle = window.innerHeight / 2;
      groups.forEach(function (g) {
        var r = g.el.getBoundingClientRect();
        g.target = Math.max(-420, Math.min(420, r.top + r.height / 2 - middle));
      });
    };
    var step = function () {
      var moving = false;
      groups.forEach(function (g) {
        g.vel = (g.vel + (g.target - g.pos) * 0.05) * 0.82;
        g.pos += g.vel;
        if (Math.abs(g.vel) > 0.05 || Math.abs(g.target - g.pos) > 0.5) moving = true;
        g.el.style.setProperty('--drift', g.pos.toFixed(1));
      });
      if (moving) requestAnimationFrame(step); else running = false;
    };
    var onScroll = function () {
      measure();
      if (!running) { running = true; requestAnimationFrame(step); }
    };
    measure();
    groups.forEach(function (g) { g.pos = g.target; g.el.style.setProperty('--drift', g.pos.toFixed(1)); });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  // App walkthrough: steps through its scenes like a short video while it's on screen.
  // Visitors can pause it or jump to a step; with reduced motion it only moves when asked.
  document.querySelectorAll('[data-tour]').forEach(function (tour) {
    var scenes = tour.querySelectorAll('.tour__scene');
    var buttons = tour.querySelectorAll('[data-goto]');
    var playBtn = tour.querySelector('.tour__play');
    var DURATION = 5500;
    var current = 0, timer = null, playing = !reduceMotion, onScreen = false;
    tour.style.setProperty('--tour-duration', DURATION + 'ms');
    function show(i) {
      current = (i + scenes.length) % scenes.length;
      scenes.forEach(function (s, k) {
        s.classList.toggle('is-active', k === current);
        s.setAttribute('aria-hidden', String(k !== current));
      });
      buttons.forEach(function (b, k) {
        b.classList.remove('is-active');
        void b.offsetWidth; // restart the progress bar
        b.classList.toggle('is-active', k === current);
        b.setAttribute('aria-pressed', String(k === current));
      });
      schedule();
    }
    function schedule() {
      clearTimeout(timer);
      tour.classList.toggle('is-playing', playing && onScreen);
      if (playing && onScreen) timer = setTimeout(function () { show(current + 1); }, DURATION);
    }
    buttons.forEach(function (b, k) { b.addEventListener('click', function () { show(k); }); });
    if (playBtn) playBtn.addEventListener('click', function () {
      playing = !playing;
      playBtn.setAttribute('aria-label', playing ? 'Pause walkthrough' : 'Play walkthrough');
      show(current);
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        var visible = entries[0].isIntersecting;
        if (visible !== onScreen) { onScreen = visible; schedule(); }
      }, { threshold: 0.35 }).observe(tour);
    }
    if (playBtn) playBtn.setAttribute('aria-label', playing ? 'Pause walkthrough' : 'Play walkthrough');
    show(0);
  });

  // Current year in the footer
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Contact forms post to Web3Forms, which emails each enquiry to us.
  // Until the real access key replaces the placeholder in the form, submitting only shows a notice.
  var KEY_PLACEHOLDER = 'ADD-WEB3FORMS-ACCESS-KEY';
  var FAILED = 'Sorry, that didn’t send. Please try again, or message us on Instagram.';
  document.querySelectorAll('form[data-form="contact"]').forEach(function (form) {
    var status = form.querySelector('[data-form-status]');
    var button = form.querySelector('[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var key = form.querySelector('[name="access_key"]');
      if (!key || key.value === KEY_PLACEHOLDER) {
        status.textContent = 'Preview only: this form isn’t connected yet.';
        return;
      }
      // Join repeated fields (tick boxes) into one line, e.g. "Meta ads, Google ads"
      var data = {};
      new FormData(form).forEach(function (value, key) {
        data[key] = key in data ? data[key] + ', ' + value : value;
      });
      if (data.botcheck) return;
      // which ad or link brought them here (see "arrival" at the top)
      Object.keys(arrival).forEach(function (key) { data[key] = arrival[key]; });
      button.disabled = true;
      status.textContent = 'Sending…';
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          return res.json().then(function (json) { return res.ok && json.success !== false; });
        })
        .then(function (sent) {
          status.textContent = sent ? 'Thanks! We’ll be in touch soon.' : FAILED;
          if (!sent) return;
          form.reset();
          // on to the thank-you page, which is also where the lead is counted for Meta
          var thanks = form.getAttribute('data-thanks');
          if (thanks) window.location.href = thanks + '#sent';
        })
        .catch(function () { status.textContent = FAILED; })
        .then(function () { button.disabled = false; });
    });
  });
})();
