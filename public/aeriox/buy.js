/* Buy this site: the purchase panel on the original Jupiter Granite Co. demo (an AERIOX add-on).
   Entry points: the ribbon along the bottom, "Buy this site with this look" at the end of the Look panel
   (src/components/Look.tsx) and "Buy this site" in the footer (src/components/Footer.tsx); every element with
   data-buy-open opens it. One dialog: a plan, the AI Voice Agent add-on while aeriox.co offers it, how booking
   works (when an agent books), what's due today, the terms box, then "Continue to secure checkout", which posts
   to aeriox.co/api/offer/checkout and sends the buyer to Stripe. Stripe sends them back here with ?offer=thanks
   or ?offer=cancelled.

   Ported from the original Canino site (aeriox/canino-construction buy.js). The look that goes with the order
   is the Look panel's own (src/lib/look.config.ts, window.__LOOK_CONFIG__): read from the <html data-*>
   attributes the panel sets (Look.tsx applyDom), under the panel's ids. The server keeps the same ids
   (aeriox-site api/_lib/offer.ts, JUPITER_GRANITE_ORIGINAL_LOOK) and refuses any other; change them together.
   The AI Voice Agent add-on shows only while aeriox.co offers it (aeriox-site api/_lib/offer.ts
   VOICE_ADDON_OFFERED, the one switch): the first time the panel is built it asks GET /api/offer/checkout,
   and the add-on's card goes in only on {voice: {offered: true, monthlyCents}} at OFFER.prices.voice, with the
   tab's earlier tick restored. No answer, an error or another price: no add-on, and every order goes out with
   voice: false. A 400 voice_unavailable on submit (the switch went off while this page was open) takes it off.
   OFFER is the one place this page keeps the prices and plan text; the server's copy is in the same file.
   termsVersion is aeriox-site's ORDER_TERMS_VERSION and msg.closed its CLOSED_MESSAGE, word for word. */
(function () {
  'use strict';

  var OFFER = {
    demo: 'jupiter-granite-original',
    termsVersion: '2026-09-29-2',
    /* aeriox.co in production. A local preview may point it at a dev server with ?offerApi=http://localhost:PORT. */
    api: 'https://aeriox.co',
    links: {
      terms: 'https://aeriox.co/legal/terms',
      orderTerms: 'https://aeriox.co/legal/order-terms',
      call: 'https://app.aeriox.co/b/aeriox'
    },
    /* USD. {name} in the text below is replaced with these, formatted as money. */
    prices: { site: 750, site_booking: 999, hosting: 20, voice: 150 },
    ribbon: {
      lead: 'From {site} one time',
      rest: 'Hosting is free for the first year, then {hosting} a month.',
      restShort: 'Hosting free the first year',
      button: 'Buy this site'
    },
    title: 'Buy this site',
    sub: 'From AERIOX, who built this site for Jupiter Granite Co.',
    lede: 'Take this site live for Jupiter Granite Co. Pick a plan and check out; we set everything up with you after you order.',
    plans: [
      {
        id: 'site',
        name: 'Website',
        price: '{site}',
        lines: ['The site as shown, with the look you picked.', 'Hosting is free for the first year, then {hosting} a month. Cancel any time.']
      },
      {
        id: 'site_booking',
        name: 'Website + booking + AI chat',
        price: '{site_booking}',
        lines: [
          'The site as shown, with online booking: customers pick a time for a showroom appointment, straight into your Google Calendar.',
          'AI chat agent included, at no extra cost. It answers questions 24/7 and books straight into your Google Calendar, with no monthly fee while hosting is active.',
          'Same hosting: free for the first year, then {hosting} a month. Cancel any time.'
        ]
      }
    ],
    /* The add-on, with either plan. Never charged at checkout: its monthly fee starts after 30 free days from go-live. */
    voice: {
      heading: 'Add-on, with either plan',
      name: 'Add the AI Voice Agent',
      price: '{voice}',
      per: 'a month',
      lines: [
        '30 days free, starting the day your agent goes live.',
        'Cancel it within those 30 days and you never pay its monthly fee, and you keep your website.',
        'It answers Jupiter Granite Co.\u2019s calls 24/7, takes messages and books appointments straight into your Google Calendar.',
        'Fair use applies.'
      ]
    },
    /* Shown when an agent will book: the voice agent (the add-on), the chat agent (Website + booking + AI chat), or
       both. Jupiter Granite Co. books through no platform today, so our agents book into the owner's Google
       Calendar, set up with the owner after they order. */
    square: {
      step: 'Before you pay',
      title: 'How booking works',
      setup: {
        phone: 'We set up the AI Voice Agent with you after you order.',
        chat: 'We set up online booking and the AI chat agent with you after you order, at no extra cost.',
        both: 'We set up online booking, the AI chat agent and the AI Voice Agent with you after you order.'
      },
      books: {
        phone: 'The AI Voice Agent books appointments on the call, straight into your Google Calendar, at the times you choose.',
        chat: 'The chat agent books appointments in the chat, straight into your Google Calendar, at the times you choose.'
      },
      platform: 'If you book through Square or another booking platform instead, the agent sends the customer your booking link, and they book there. We don\u2019t write into your booking platform. Outlook or another calendar: ask us first.',
      ack: 'I understand how booking works.'
    },
    agree: {
      step: 'Agree and pay',
      due: 'Due today',
      pick: 'Choose a plan above.',
      notes: {
        paid: 'This payment is non-refundable.',
        hosting: 'Hosting is free for the first year, then {hosting} a month. Cancel any time.',
        chat: 'AI chat agent included, at no extra cost: no monthly fee while hosting is active.',
        voice: 'AI Voice Agent: nothing charged for it today. {voice} a month, 30 days free, starting the day your agent goes live.'
      },
      ack: 'I agree to the AERIOX {terms} and the {orderTerms}.',
      termsLabel: 'Terms of Service',
      orderTermsLabel: 'Website & Front Desk Order Terms',
      button: 'Continue to secure checkout',
      busy: 'Opening checkout\u2026',
      secure: 'You\u2019ll pay on Stripe\u2019s secure checkout page.'
    },
    /* The Look panel's groups, in its order, under its ids (src/lib/look.config.ts; Look.tsx applyDom writes them
       to <html>: theme goes to data-mode). The first id is lookConfig.DEFAULTS. Names come from
       window.__LOOK_CONFIG__ where it has them. logoVariant is left out: the panel never offers it. */
    look: {
      yourLook: 'Your look:',
      change: 'Change',
      custom: 'Custom',
      groups: [
        { id: 'layout', attr: 'data-layout', ids: ['mosaic', 'editorial', 'magazine'], from: 'layouts', suffix: ' layout' },
        { id: 'theme', attr: 'data-mode', ids: ['light', 'dark'], names: { light: 'Light', dark: 'Dark' }, suffix: ' theme' },
        { id: 'palette', attr: 'data-palette', ids: ['atelier', 'coastal', 'monolith'], from: 'palettes', suffix: ' palette' },
        { id: 'font', attr: 'data-font', ids: ['fraunces', 'montserrat', 'cormorant'], from: 'fonts', suffix: ' type' },
        { id: 'logo', attr: 'data-logo', ids: ['block', 'blockinv', 'serif', 'stone'], from: 'logos', suffix: ' logo' },
        { id: 'nav', attr: 'data-nav', ids: ['pill', 'bar'], names: { pill: 'Pill', bar: 'Full width' }, suffix: ' header' }
      ]
    },
    msg: {
      pickPlan: 'Choose a plan to continue.',
      tick: 'Tick this box to continue.',
      closed: "Checkout isn't available right now. Book a 15-minute call and we'll set it up with you.",
      failed: 'Checkout isn\u2019t available right now. Book a 15-minute call and we\u2019ll set it up with you.',
      limited: 'Too many tries. Wait a minute, or book a 15-minute call and we\u2019ll set it up with you.',
      termsChanged: 'The order terms have changed. Reload this page to see them, or book a 15-minute call.',
      callButton: 'Book a 15-minute call',
      talk: 'Rather talk first?',
      talkLink: 'Book a 15-minute call with an AERIOX rep',
      thanksTitle: 'Thank you',
      thanks: 'Your order is in. We\u2019ll be in touch by email to set everything up with you.',
      done: 'Back to the site',
      cancelled: 'Checkout was cancelled. Nothing was charged.',
      voiceOff: 'We took the AI Voice Agent off this order. Check what\u2019s due today, then continue to checkout.'
    }
  };

  if (window.AxBuy) return;
  var doc = document.documentElement;
  var CFG = window.__LOOK_CONFIG__ || {};
  var PICKS_KEY = 'jupiter-granite-buy';
  var reduce = function () { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };

  var API = OFFER.api.replace(/\/+$/, '');
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) {
    try {
      var devApi = new URLSearchParams(location.search).get('offerApi');
      if (devApi && /^https?:\/\/[\w.:[\]-]+$/.test(devApi)) API = devApi.replace(/\/+$/, '');
    } catch (e) { /* keep the default */ }
  }

  /* ---------------- text ---------------- */
  function money(n) { return '$' + (n % 1 ? n.toFixed(2) : n.toLocaleString('en-US')); }
  function fill(s) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      return Object.prototype.hasOwnProperty.call(OFFER.prices, k) ? money(OFFER.prices[k]) : m;
    });
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var t = function (s) { return esc(fill(s)); };
  function planById(id) { return OFFER.plans.filter(function (p) { return p.id === id; })[0] || null; }
  var NEWTAB = ' target="_blank" rel="noopener"';
  var SR_NEWTAB = '<span class="buy-sr"> (opens in a new tab)</span>';
  /* the site's CTA knob: a round chip with the up-right arrow (ui.tsx CTA) */
  var KNOB = '<span class="buy-knob" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8"/></svg></span>';

  /* ---------------- per-tab memory of the plan picks (never required) ---------------- */
  function readPicks() { try { var v = JSON.parse(sessionStorage.getItem(PICKS_KEY) || 'null'); return v && typeof v === 'object' ? v : {}; } catch (e) { return {}; } }
  function savePicks() { try { sessionStorage.setItem(PICKS_KEY, JSON.stringify({ plan: state.plan, voice: state.voice })); } catch (e) { /* private mode: fine */ } }

  /* ---------------- the look: the picker's picks, as the page shows them right now ---------------- */
  function optionName(g, id) {
    if (g.names && g.names[id]) return g.names[id];
    var list = CFG[g.from] || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i].label || id;
    return id;
  }
  function currentLook() {
    var look = {};
    OFFER.look.groups.forEach(function (g) {
      var v = doc.getAttribute(g.attr);
      look[g.id] = g.ids.indexOf(v) > -1 ? v : g.ids[0];
    });
    return look;
  }
  function presetName(look) {
    var presets = CFG.PRESETS || [];
    for (var i = 0; i < presets.length; i++) {
      var v = presets[i].values || {};
      if (OFFER.look.groups.every(function (g) { return v[g.id] === look[g.id]; })) return presets[i].name;
    }
    return OFFER.look.custom;
  }
  function lookSummary(look) {
    return presetName(look) + ': ' + OFFER.look.groups.map(function (g) { return optionName(g, look[g.id]) + g.suffix; }).join(', ') + '.';
  }

  /* ---------------- the entry points ---------------- */
  /* The ribbon is the one entry point this script adds; the Look panel's button and the footer link are in the
     page's own markup (data-buy-open). addons.css places the ribbon and everything stacked above it by its
     height and the header's (measured here as --buy-ribbon-h and --buy-nav-h). The header is part of each page
     (Nav.tsx), so it is looked up again after every client-side navigation (ax:route, AerioxRoute.tsx). */
  var ribbon;
  function buildRibbon() {
    var R = OFFER.ribbon;
    ribbon = document.createElement('aside');
    ribbon.className = 'buy-ribbon';
    ribbon.setAttribute('aria-label', OFFER.title);
    ribbon.innerHTML =
      '<p><strong>' + t(R.lead) + '</strong> <span class="buy-long">' + t(R.rest) + '</span><span class="buy-short">' + t(R.restShort) + '</span></p>' +
      '<button class="buy-ribbon-btn" type="button" data-buy-open><span>' + esc(R.button) + '</span>' + KNOB + '</button>';
    document.body.appendChild(ribbon);
    doc.classList.add('has-buy-ribbon');
    measureEdges();
    if (window.ResizeObserver) {
      ro = new ResizeObserver(scheduleMeasure);
      ro.observe(ribbon);
      watchNav();
    }
    window.addEventListener('resize', scheduleMeasure);
    /* a new look can change the header (logo, header width, font) */
    if (window.MutationObserver) new MutationObserver(scheduleMeasure).observe(doc, { attributes: true, attributeFilter: ['data-nav', 'data-font', 'data-logo'] });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleMeasure);
    window.addEventListener('ax:route', function () { watchNav(); scheduleMeasure(); });
  }
  var ro = null, navEl = null;
  function watchNav() {
    var n = document.querySelector('header > nav');
    if (n === navEl) return;
    if (ro && navEl) ro.unobserve(navEl);
    navEl = n;
    if (ro && navEl) ro.observe(navEl);
  }
  var measureQueued = false;
  function scheduleMeasure() {
    if (measureQueued) return;
    measureQueued = true;
    var run = function () { measureQueued = false; measureEdges(); };
    if (window.requestAnimationFrame) window.requestAnimationFrame(run); else setTimeout(run, 16);
  }
  function measureEdges() {
    /* fractional, so it matches addons.css's own figure for the ribbon exactly and nothing shifts */
    var rh = ribbon && ribbon.getBoundingClientRect().height;
    if (rh) doc.style.setProperty('--buy-ribbon-h', rh + 'px');
    var n = navEl || document.querySelector('header > nav');
    if (n && n.offsetHeight) doc.style.setProperty('--buy-nav-h', Math.ceil(n.getBoundingClientRect().bottom) + 'px');
  }
  /* The Look panel (Look.tsx) is React's: it opens and closes with its own toggle button. */
  function lookPicker() { return document.querySelector('.look-picker'); }
  function closeLookPicker() {
    var picker = lookPicker();
    var toggle = picker && picker.querySelector('.look-toggle');
    if (toggle && picker.classList.contains('is-open')) toggle.click();
  }
  function openLookPicker() {
    var picker = lookPicker();
    var toggle = picker && picker.querySelector('.look-toggle');
    if (!toggle) return;
    if (!picker.classList.contains('is-open')) toggle.click();
    /* React renders the panel on the next frame */
    var tries = 0;
    (function focusPanel() {
      var panel = picker.querySelector('.look-panel');
      if (panel) { panel.setAttribute('tabindex', '-1'); panel.focus({ preventScroll: true }); return; }
      if (++tries < 20) setTimeout(focusPanel, 25);
    })();
  }

  /* ---------------- the panel ---------------- */
  var root, scrim, form, squareStep, setupEl, booksEl, voiceBox, agreeN, dueAmount, dueNotes, lookLine, goBtn, result, flash, thanksEl;
  var saved = readPicks();
  var state = { open: false, plan: planById(saved.plan) ? saved.plan : null, voice: false, busy: false, opener: null };
  var inerted = [];

  /* ---------------- the AI Voice Agent add-on: only while aeriox.co offers it ---------------- */
  function addonHtml() {
    var V = OFFER.voice;
    return '<p class="buy-addon-h" id="buy-h-addon">' + esc(V.heading) + '</p>' +
      '<label class="buy-card buy-addon">' +
        '<input class="buy-input" type="checkbox" id="buy-voice" aria-describedby="buy-h-addon">' +
        '<span class="buy-mark buy-box" aria-hidden="true"></span>' +
        '<span class="buy-card-top"><span class="buy-card-name">' + esc(V.name) + '</span>' +
          '<span class="buy-price">' + t(V.price) + '<small>' + esc(V.per) + '</small></span></span>' +
        '<ul class="buy-lines">' + V.lines.map(function (l, i) { return '<li' + (i === 0 ? ' class="buy-key"' : '') + '>' + t(l) + '</li>'; }).join('') + '</ul>' +
      '</label>';
  }
  /* Asked once per page: true only on {voice: {offered: true}} at OFFER.prices.voice; anything else is false. */
  var voiceAsk = null;
  function askVoice() {
    if (voiceAsk) return voiceAsk;
    voiceAsk = new Promise(function (done) {
      if (!window.fetch) { done(false); return; }
      var ctrl = window.AbortController ? new AbortController() : null;
      var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 8000) : null;
      fetch(API + '/api/offer/checkout', { method: 'GET', mode: 'cors', credentials: 'omit', cache: 'no-store', signal: ctrl ? ctrl.signal : undefined })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          var v = d && d.voice;
          return !!v && v.offered === true && v.monthlyCents === Math.round(OFFER.prices.voice * 100);
        })
        .catch(function () { return false; })
        .then(function (on) { if (timer) clearTimeout(timer); done(on); });
    });
    return voiceAsk;
  }
  function showAddon() {
    var slot = root && root.querySelector('#buy-addon-slot');
    if (!slot || voiceBox) return;
    slot.innerHTML = addonHtml();
    voiceBox = slot.querySelector('#buy-voice');
    voiceBox.addEventListener('change', function () { setVoice(voiceBox.checked); });
    /* the tick from earlier in this tab (e.g. before a cancelled checkout), now that the add-on is here */
    if (readPicks().voice === true) { voiceBox.checked = true; setVoice(true); }
  }
  /* 400 voice_unavailable: the switch went off while this page was open, so the add-on comes off the order */
  function dropAddon() {
    var slot = root.querySelector('#buy-addon-slot');
    if (slot) slot.innerHTML = '';
    voiceBox = null;
    voiceAsk = Promise.resolve(false);
    state.voice = false;
    markCards();
    update();
    savePicks();
  }

  function build() {
    if (root) return;
    var sq = OFFER.square, ag = OFFER.agree, m = OFFER.msg;

    var plans = OFFER.plans.map(function (p) {
      return '<label class="buy-card buy-plan" data-plan="' + p.id + '">' +
          '<input class="buy-input" type="radio" name="buy-plan" value="' + p.id + '">' +
          '<span class="buy-mark buy-dot" aria-hidden="true"></span>' +
          '<span class="buy-card-top"><span class="buy-card-name">' + esc(p.name) + '</span>' +
            '<span class="buy-price">' + t(p.price) + '<small>one time</small></span></span>' +
          '<ul class="buy-lines">' + p.lines.map(function (l) { return '<li>' + t(l) + '</li>'; }).join('') + '</ul>' +
        '</label>';
    }).join('');
    var ack = esc(ag.ack)
      .replace('{terms}', '<a href="' + esc(OFFER.links.terms) + '"' + NEWTAB + '>' + esc(ag.termsLabel) + SR_NEWTAB + '</a>')
      .replace('{orderTerms}', '<a href="' + esc(OFFER.links.orderTerms) + '"' + NEWTAB + '>' + esc(ag.orderTermsLabel) + SR_NEWTAB + '</a>');

    scrim = document.createElement('div');
    scrim.className = 'buy-scrim';
    scrim.hidden = true;
    scrim.addEventListener('click', function () { close(); });

    root = document.createElement('section');
    root.className = 'buy-panel';
    root.id = 'buy-panel';
    root.hidden = true;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'buy-title');
    root.setAttribute('aria-describedby', 'buy-sub');
    /* the Look panel's double bezel: the shell (.buy-panel) holds the core */
    root.innerHTML = '<div class="buy-core">' +
      '<header class="buy-head">' +
        '<div><h2 class="buy-title" id="buy-title">' + esc(OFFER.title) + '</h2>' +
        '<p class="buy-sub" id="buy-sub">' + esc(OFFER.sub) + '</p></div>' +
        '<button class="buy-x" type="button" data-buy-close aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>' +
      '</header>' +
      '<div class="buy-body">' +
        '<p class="buy-flash" id="buy-flash" role="status" hidden></p>' +
        '<form class="buy-form" novalidate>' +
          '<p class="buy-lede">' + esc(OFFER.lede) + '</p>' +
          '<div class="buy-step">' +
            '<h3 class="buy-step-h" id="buy-h-plan"><span class="buy-n">01</span>Choose a plan</h3>' +
            '<div class="buy-cards" role="radiogroup" aria-labelledby="buy-h-plan" aria-describedby="buy-err-plan">' + plans + '</div>' +
            '<p class="buy-err" id="buy-err-plan" hidden>' + esc(m.pickPlan) + '</p>' +
            '<div id="buy-addon-slot"></div>' +
          '</div>' +
          '<div class="buy-step" id="buy-step-square" hidden>' +
            '<h3 class="buy-step-h"><span class="buy-n">02</span>' + esc(sq.step) + '</h3>' +
            '<p class="buy-h4">' + esc(sq.title) + '</p>' +
            '<p class="buy-p" id="buy-sq-setup"></p>' +
            '<div id="buy-sq-books"></div>' +
            '<p class="buy-p">' + esc(sq.platform) + '</p>' +
            '<label class="buy-check" data-ack="square"><input class="buy-input" type="checkbox" id="buy-ack-square" aria-describedby="buy-err-square">' +
              '<span class="buy-mark buy-box" aria-hidden="true"></span><span>' + esc(sq.ack) + '</span></label>' +
            '<p class="buy-err" id="buy-err-square" hidden>' + esc(m.tick) + '</p>' +
          '</div>' +
          '<div class="buy-step">' +
            '<h3 class="buy-step-h"><span class="buy-n" id="buy-agree-n">02</span>' + esc(ag.step) + '</h3>' +
            '<div class="buy-due" aria-live="polite">' +
              '<div class="buy-due-top"><span class="buy-due-label">' + esc(ag.due) + '</span><span class="buy-due-amount" id="buy-due-amount">–</span></div>' +
              '<ul class="buy-due-notes" id="buy-due-notes"><li>' + esc(ag.pick) + '</li></ul>' +
              '<p class="buy-look-line" id="buy-look-line"></p>' +
            '</div>' +
            '<label class="buy-check" data-ack="terms"><input class="buy-input" type="checkbox" id="buy-ack-terms" aria-describedby="buy-err-terms">' +
              '<span class="buy-mark buy-box" aria-hidden="true"></span><span>' + ack + '</span></label>' +
            '<p class="buy-err" id="buy-err-terms" hidden>' + esc(m.tick) + '</p>' +
            '<button class="buy-go" type="submit"><span class="buy-go-txt">' + esc(ag.button) + '</span>' + KNOB + '</button>' +
            '<p class="buy-secure"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>' + esc(ag.secure) + '</p>' +
            '<div class="buy-result" id="buy-result"></div>' +
          '</div>' +
        '</form>' +
        '<div class="buy-thanks" hidden><h3 class="buy-thanks-h">' + esc(m.thanksTitle) + '</h3><p class="buy-p">' + esc(m.thanks) + '</p>' +
          '<button class="buy-ghost" type="button" data-buy-close>' + esc(m.done) + '</button></div>' +
      '</div>' +
      '<p class="buy-foot">' + esc(m.talk) + ' <a href="' + esc(OFFER.links.call) + '"' + NEWTAB + '>' + esc(m.talkLink) + ' ↗' + SR_NEWTAB + '</a></p>' +
    '</div>';

    document.body.appendChild(scrim);
    document.body.appendChild(root);
    form = root.querySelector('.buy-form');
    squareStep = root.querySelector('#buy-step-square');
    setupEl = root.querySelector('#buy-sq-setup');
    booksEl = root.querySelector('#buy-sq-books');
    agreeN = root.querySelector('#buy-agree-n');
    dueAmount = root.querySelector('#buy-due-amount');
    dueNotes = root.querySelector('#buy-due-notes');
    lookLine = root.querySelector('#buy-look-line');
    goBtn = root.querySelector('.buy-go');
    result = root.querySelector('#buy-result');
    flash = root.querySelector('#buy-flash');
    thanksEl = root.querySelector('.buy-thanks');

    root.addEventListener('keydown', onKey);
    root.addEventListener('click', function (e) {
      var el = e.target.closest && e.target.closest('[data-buy-close], [data-buy-look]');
      if (!el) return;
      if (el.hasAttribute('data-buy-look')) { close({ keepFocus: true }); openLookPicker(); }
      else close();
    });
    Array.prototype.forEach.call(root.querySelectorAll('input[name="buy-plan"]'), function (r) {
      r.addEventListener('change', function () { if (r.checked) pickPlan(r.value); });
    });
    Array.prototype.forEach.call(root.querySelectorAll('.buy-check input'), function (c) {
      c.addEventListener('change', function () { if (c.checked) setError(c.id.replace('buy-ack-', ''), false); });
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); submit(); });

    /* the plan and add-on picked earlier in this tab (e.g. before a cancelled checkout) */
    if (state.plan) { root.querySelector('input[value="' + state.plan + '"]').checked = true; }
    markCards();
    update();
    askVoice().then(function (on) { if (on) showAddon(); });
  }

  /* ---------------- choices ---------------- */
  function withChat() { return state.plan === 'site_booking'; }
  /* An agent will book (the chat agent comes with Website + booking + AI chat; the voice agent is the add-on), so
     the booking notice and its box apply. The server asks for the same box ("square") on the same orders. */
  function agentBooks() { return withChat() || state.voice; }
  function markCards() {
    Array.prototype.forEach.call(root.querySelectorAll('.buy-plan'), function (el) { el.classList.toggle('is-picked', el.getAttribute('data-plan') === state.plan); });
    var card = root.querySelector('.buy-addon');
    if (card) card.classList.toggle('is-picked', state.voice);
  }
  function pickPlan(id) {
    if (!planById(id)) return;
    state.plan = id;
    setError('plan', false);
    markCards();
    update();
    savePicks();
  }
  function setVoice(on) {
    state.voice = !!on && !!voiceBox;
    markCards();
    update();
    savePicks();
  }
  function update() {
    var p = planById(state.plan), books = agentBooks(), n = OFFER.agree.notes;
    squareStep.hidden = !books;
    agreeN.textContent = books ? '03' : '02';
    if (books) renderSquare(); else setError('square', false);
    dueAmount.textContent = p ? fill(p.price) : '–';
    var notes = p ? [n.paid, n.hosting].concat(withChat() ? [n.chat] : [], state.voice ? [n.voice] : []) : [OFFER.agree.pick];
    dueNotes.innerHTML = notes.map(function (x) { return '<li>' + t(x) + '</li>'; }).join('');
    clearResult();
  }
  function renderSquare() {
    var sq = OFFER.square, phone = state.voice, chat = withChat();
    setupEl.textContent = phone && chat ? sq.setup.both : phone ? sq.setup.phone : sq.setup.chat;
    booksEl.innerHTML = (phone ? [sq.books.phone] : []).concat(chat ? [sq.books.chat] : [])
      .map(function (b) { return '<p class="buy-p"><strong>' + esc(b) + '</strong></p>'; }).join('');
  }
  function renderLook() {
    lookLine.innerHTML = '<strong>' + esc(OFFER.look.yourLook) + '</strong> ' + esc(lookSummary(currentLook())) +
      ' <button class="buy-link" type="button" data-buy-look>' + esc(OFFER.look.change) + '</button>';
  }
  function setError(which, on) {
    var err = root.querySelector('#buy-err-' + which);
    if (err) err.hidden = !on;
    if (which === 'plan') { root.querySelector('.buy-cards').setAttribute('aria-invalid', on ? 'true' : 'false'); return; }
    var box = root.querySelector('#buy-ack-' + which);
    if (box) box.setAttribute('aria-invalid', on ? 'true' : 'false');
    var wrap = root.querySelector('.buy-check[data-ack="' + which + '"]');
    if (wrap) wrap.classList.toggle('is-invalid', !!on);
  }
  function clearResult() { if (result) result.innerHTML = ''; }
  function showNote(text) {
    result.innerHTML = '<div class="buy-note" tabindex="-1"><p class="buy-p">' + esc(text) + '</p>' +
      '<a class="buy-ghost" href="' + esc(OFFER.links.call) + '"' + NEWTAB + '>' + esc(OFFER.msg.callButton) + ' ↗' + SR_NEWTAB + '</a></div>';
    var note = result.firstChild;
    note.focus({ preventScroll: true });
    if (note.scrollIntoView) note.scrollIntoView({ block: 'nearest', behavior: reduce() ? 'auto' : 'smooth' });
  }
  function setBusy(on) {
    state.busy = on;
    goBtn.disabled = on;
    if (on) goBtn.setAttribute('aria-busy', 'true'); else goBtn.removeAttribute('aria-busy');
    goBtn.querySelector('.buy-go-txt').textContent = on ? OFFER.agree.busy : OFFER.agree.button;
  }

  /* ---------------- checkout ---------------- */
  function submit() {
    if (state.busy) return;
    clearResult();
    var square = root.querySelector('#buy-ack-square');
    var terms = root.querySelector('#buy-ack-terms');
    var first = null;
    if (!state.plan) { setError('plan', true); first = first || root.querySelector('input[name="buy-plan"]'); }
    if (agentBooks() && !square.checked) { setError('square', true); first = first || square; }
    if (!terms.checked) { setError('terms', true); first = first || terms; }
    if (first) {
      first.focus();
      var target = first.closest('.buy-check, .buy-cards') || first;
      if (target.scrollIntoView) target.scrollIntoView({ block: 'center', behavior: reduce() ? 'auto' : 'smooth' });
      return;
    }
    setBusy(true);
    var payload = {
      demo: OFFER.demo,
      plan: state.plan,
      voice: state.voice,
      acknowledgments: { square: agentBooks() && square.checked, terms: terms.checked },
      terms_version: OFFER.termsVersion,
      look: currentLook(),
      return_path: location.pathname
    };
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 15000) : null;
    var request = window.fetch ? fetch(API + '/api/offer/checkout', {
      method: 'POST', mode: 'cors', credentials: 'omit', cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl ? ctrl.signal : undefined
    }) : Promise.reject(new Error('no fetch'));
    request.then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) { return { status: r.status, data: d || {} }; });
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      var d = res.data;
      if (res.status === 200 && d.enabled === true && typeof d.url === 'string' && /^https:\/\/checkout\.stripe\.com\//.test(d.url)) {
        savePicks();
        location.assign(d.url); /* stays busy while the browser leaves */
        return;
      }
      setBusy(false);
      if (res.status === 200 && d.enabled === false) return showNote(OFFER.msg.closed);
      if (res.status === 400 && d.error === 'acknowledgment_required' && d.missing) {
        d.missing.forEach(function (k) { setError(k, true); });
        var box = root.querySelector('#buy-ack-' + d.missing[0]);
        if (box) box.focus();
        return;
      }
      if (res.status === 400 && d.error === 'voice_unavailable') { dropAddon(); return showNote(OFFER.msg.voiceOff); }
      if (res.status === 409) return showNote(OFFER.msg.termsChanged);
      if (res.status === 429) return showNote(OFFER.msg.limited);
      showNote(OFFER.msg.failed);
    }, function () {
      if (timer) clearTimeout(timer);
      setBusy(false);
      showNote(OFFER.msg.failed);
    });
  }

  /* ---------------- open / close ---------------- */
  function outside() {
    return Array.prototype.filter.call(document.body.children, function (el) { return el !== root && el !== scrim && el.tagName !== 'SCRIPT'; });
  }
  function setOpeners(on) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-buy-open]'), function (b) {
      b.setAttribute('aria-haspopup', 'dialog');
      b.setAttribute('aria-controls', 'buy-panel');
      b.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
  }
  function open(opts) {
    opts = opts || {};
    build();
    closeLookPicker();
    /* one panel at a time: the AI chat closes its panel on ax:open and while html.ax-open is set */
    try { window.dispatchEvent(new CustomEvent('ax:open', { detail: 'buy' })); } catch (e) {}
    flash.hidden = true;
    form.hidden = opts.view === 'thanks';
    thanksEl.hidden = opts.view !== 'thanks';
    if (opts.view === 'cancelled') { flash.textContent = OFFER.msg.cancelled; flash.hidden = false; }
    renderLook();
    if (state.open) return;
    state.open = true;
    state.opener = opts.opener || document.activeElement;
    scrim.hidden = false;
    root.hidden = false;
    doc.classList.add('buy-is-open', 'ax-open');
    inerted = outside().filter(function (el) { return !el.hasAttribute('inert'); });
    inerted.forEach(function (el) { el.setAttribute('inert', ''); });
    setOpeners(true);
    root.querySelector('.buy-body').scrollTop = 0;
    if (!reduce() && !opts.instant) { root.classList.remove('is-in'); void root.offsetWidth; root.classList.add('is-in'); }
    var focusEl = opts.view === 'thanks' ? root.querySelector('.buy-thanks .buy-ghost') : root.querySelector('#buy-title');
    if (focusEl.id === 'buy-title') focusEl.setAttribute('tabindex', '-1');
    focusEl.focus({ preventScroll: true });
  }
  function close(opts) {
    opts = opts || {};
    if (!state.open) return;
    state.open = false;
    inerted.forEach(function (el) { el.removeAttribute('inert'); });
    inerted = [];
    setOpeners(false);
    root.hidden = true;
    scrim.hidden = true;
    root.classList.remove('is-in');
    doc.classList.remove('buy-is-open', 'ax-open');
    if (!opts.keepFocus) {
      var back = state.opener && document.contains(state.opener) && state.opener.getClientRects().length ? state.opener : ribbon && ribbon.querySelector('.buy-ribbon-btn');
      if (back && back.focus) back.focus({ preventScroll: true });
    }
  }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.key !== 'Tab') return;
    var f = Array.prototype.filter.call(root.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'), function (el) {
      return el.getClientRects().length > 0 && !el.closest('[hidden]');
    });
    /* each radio group takes one Tab stop: its checked radio, or its first one when none is */
    f = f.filter(function (el) {
      if (el.type !== 'radio') return true;
      var group = f.filter(function (x) { return x.type === 'radio' && x.name === el.name; });
      return el === (group.filter(function (x) { return x.checked; })[0] || group[0]);
    });
    if (!f.length) return;
    var firstEl = f[0], lastEl = f[f.length - 1], active = document.activeElement;
    if (e.shiftKey && (active === firstEl || !root.contains(active) || active.id === 'buy-title')) { e.preventDefault(); lastEl.focus(); }
    else if (!e.shiftKey && (active === lastEl || !root.contains(active))) { e.preventDefault(); firstEl.focus(); }
  }

  /* ---------------- wire up ---------------- */
  function init() {
    buildRibbon();
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-buy-open]');
      if (!b) return;
      e.preventDefault();
      open({ opener: b });
    });
    setOpeners(false);
    /* Escape closes the panel wherever focus is */
    document.addEventListener('keydown', function (e) { if (state.open && e.key === 'Escape') { e.preventDefault(); close(); } });
    /* Back from Stripe: ?offer=thanks or ?offer=cancelled. Show it once, then drop it from the address. */
    var back = null;
    try {
      var q = new URLSearchParams(location.search);
      back = q.get('offer');
      if (back) {
        q.delete('offer');
        var rest = q.toString();
        history.replaceState(history.state, '', location.pathname + (rest ? '?' + rest : '') + location.hash);
      }
    } catch (e) { back = null; }
    var opener = ribbon.querySelector('.buy-ribbon-btn');
    if (back === 'thanks') { state.plan = null; state.voice = false; try { sessionStorage.removeItem(PICKS_KEY); } catch (e) {} open({ view: 'thanks', instant: true, opener: opener }); }
    else if (back === 'cancelled') open({ view: 'cancelled', instant: true, opener: opener });
  }

  window.AxBuy = {
    open: function () { open({}); },
    close: function () { close(); },
    look: currentLook,
    config: OFFER
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
