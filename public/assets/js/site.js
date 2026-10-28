// InHaus Digital — small progressive enhancements. The site works without this file.
(function () {
  var body = document.body;

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

  // Header background once the page scrolls
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
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

  // Videos show a thumbnail first and only load YouTube's player when clicked,
  // which keeps pages fast. Without JavaScript the thumbnail links to YouTube.
  document.querySelectorAll('a[data-video]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var start = link.getAttribute('data-start');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + link.getAttribute('data-video') +
        '?autoplay=1&rel=0&playsinline=1' + (start ? '&start=' + start : '');
      iframe.title = link.getAttribute('data-title') || 'YouTube video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      var frame = document.createElement('div');
      frame.className = link.className;
      frame.appendChild(iframe);
      link.replaceWith(frame);
      iframe.focus();
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
          if (sent) form.reset();
          status.textContent = sent ? 'Thanks! We’ll be in touch soon.' : FAILED;
        })
        .catch(function () { status.textContent = FAILED; })
        .then(function () { button.disabled = false; });
    });
  });
})();
