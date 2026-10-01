/* The "Talk to our front desk" pill (the #vd markup in src/components/AerioxAddons.tsx; addons.css styles it).
   Loads with the page, so it stays small: it shows the pill, loads voice.js (the call panel) on the pill's
   first hover, focus or tap, and moves the pill out of the way of the home hero's buttons. The AI chat's
   launcher (#axc) takes the pill's place while the chat is on, so the same step-aside covers it too.
   Ported from the original Canino site (aeriox/canino-construction voice-pill.js). The pages are Next.js
   routes that share one layout, so this runs once; after each client-side navigation (ax:route,
   AerioxRoute.tsx) it looks up the hero's buttons again. */
(function () {
  'use strict';
  var root = document.getElementById('vd');
  var pill = root && root.querySelector('.vd-pill');
  if (!pill || root.hasAttribute('data-ready')) return;
  root.setAttribute('data-ready', '');
  var doc = document.documentElement;
  doc.classList.add('has-voice');

  var loading = null;
  function load() {
    if (!loading) loading = new Promise(function (ok, fail) {
      var s = document.createElement('script');
      s.src = '/aeriox/voice.js?v=voice-2'; s.async = true;
      s.onload = ok; s.onerror = function () { loading = null; fail(new Error('voice.js')); };
      document.head.appendChild(s);
    });
    return loading;
  }
  ['pointerenter', 'focus', 'touchstart'].forEach(function (t) {
    pill.addEventListener(t, function () { load().catch(function () {}); }, { once: true, passive: true });
  });
  pill.addEventListener('click', function () {
    pill.setAttribute('aria-busy', 'true');
    load().then(function () { pill.removeAttribute('aria-busy'); if (window.FrontDeskVoice) window.FrontDeskVoice.toggle(); },
      function () { pill.removeAttribute('aria-busy'); });
  });
  /* #owner=<pass> or #owner=off: load the panel's script now, so it keeps or forgets the owner pass and
     takes it out of the address bar (voice.js) */
  if (/^#owner=/.test(location.hash)) load().catch(function () {});

  /* On a short phone the hero's copy can run past the fold, so its buttons land where the pill sits.
     While the two would overlap, the pill steps aside (addons.css: .vd.is-aside) and comes back once the
     buttons scroll clear. Never while the panel is open or a call is on, and a focused pill always shows. */
  var HERO_CTAS = 'main#top > section:first-of-type a';
  var ctas = [];
  var chat = null, launcher = null;
  var queued = false;
  var ro = window.ResizeObserver ? new ResizeObserver(schedule) : null;
  function overlaps(a, b) { return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom; }
  /* whichever front-desk button is on show: the chat's launcher in the pill's place, or the pill */
  function frontDesk() {
    var l = launcher && launcher.getBoundingClientRect();
    return l && l.width ? l : pill.getBoundingClientRect();
  }
  function check() {
    queued = false;
    var p = frontDesk();
    var hit = !!p.width && ctas.some(function (c) {
      if (!c.isConnected) return false;
      var r = c.getBoundingClientRect();
      return r.width > 0 && overlaps(p, { left: r.left - 2, right: r.right + 2, top: r.top - 2, bottom: r.bottom + 2 });
    });
    root.classList.toggle('is-aside', hit);
    if (chat) chat.classList.toggle('is-aside', hit);
  }
  function schedule() {
    if (queued) return;
    queued = true;
    if (window.requestAnimationFrame) requestAnimationFrame(check); else setTimeout(check, 16);
  }
  /* the home page's hero buttons, looked up again on every route: other pages have none */
  function findCtas() {
    if (ro) ctas.forEach(function (c) { ro.unobserve(c); });
    ctas = Array.prototype.slice.call(document.querySelectorAll(HERO_CTAS));
    if (ro) ctas.forEach(function (c) { ro.observe(c); });
    schedule();
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  window.addEventListener('ax:route', findCtas);
  /* the hero's copy rises into place (globals.css .reveal-eager): measure again once it lands */
  document.addEventListener('animationend', schedule, true);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  if (ro) ro.observe(pill);
  /* a new look moves the hero's copy; the ribbon's height moves the pill */
  if (window.MutationObserver) new MutationObserver(schedule).observe(doc, { attributes: true, attributeFilter: ['data-font', 'data-logo', 'style', 'class'] });
  function chatReady() {
    chat = document.getElementById('axc');
    launcher = chat && chat.querySelector('.axc-l');
    if (!launcher) return;
    if (ro) ro.observe(launcher);
    /* the chat turning out to be off hands the corner back to the pill */
    if (window.MutationObserver) new MutationObserver(schedule).observe(chat, { attributes: true, attributeFilter: ['hidden'] });
    schedule();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { chatReady(); findCtas(); });
  else { chatReady(); findCtas(); }
})();
