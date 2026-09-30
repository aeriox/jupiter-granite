/* Jupiter Granite Co.: "Talk to our front desk", a live voice demo of an AERIOX agent (an AERIOX add-on on the
   original demo site). Loaded on first use by the pill's loader (public/aeriox/voice-pill.js; addons.css
   styles both). The call runs through AERIOX's voice relay: /api/demo-voice-session (on the API base below)
   issues a one-use ticket for the "jupiter-granite" demo, the page opens a WebSocket to /api/demo-voice-relay
   with it, and the relay holds the AI keys, sets up the company's front desk, answers its demo-calendar
   lookups and demo bookings (a showroom appointment) itself, and ends the call at 3 minutes. Nothing is booked
   with the company. aeriox.co allows the "jupiter-granite" demo on this site's origin (the tenant's origins).
   Ported from the original Canino site (aeriox/canino-construction voice.js), with its copy in AERIOX's words. */
(function () {
  'use strict';
  if (window.FrontDeskVoice) return;
  var root = document.getElementById('vd');
  if (!root) return;
  var pill = root.querySelector('.vd-pill');
  var doc = document.documentElement;

  /* The API: aeriox.co in production (data-api). A local preview can point it at a dev server,
     e.g. http://localhost:4320/?voiceApi=http://localhost:5190; the hosted page never takes that. */
  var API = (root.getAttribute('data-api') || 'https://aeriox.co').replace(/\/+$/, '');
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) {
    try {
      var devApi = new URLSearchParams(location.search).get('voiceApi');
      if (devApi && /^https?:\/\/[\w.:[\]-]+$/.test(devApi)) API = devApi;
    } catch (e) { /* keep the default */ }
  }
  var TENANT = 'jupiter-granite';
  var VOICES = [
    { id: 'ara', name: 'Ara', hint: 'Female voice · warm, friendly' },
    { id: 'castor', name: 'Castor', hint: 'Male voice · charismatic, down-to-earth' }
  ];
  var VOICE_KEY = 'jupiter-granite-voice-demo';
  /* Owner pass: opening the site with #owner=<pass> keeps the pass in this browser and takes it out
     of the address bar; #owner=off forgets it (the pill's loader loads this file right away for either).
     Each call sends it: a valid one skips the per-visitor limits (never the shared ones), and the
     server treats any other as no pass. The fine print says "Owner pass saved" (stored, not proven),
     and "not accepted" once a call is refused for a per-visitor limit, which a valid pass never is:
     a mistyped pass, or a server not set up for it. */
  var OWNER_KEY = 'aeriox.demo.owner';
  var ownerMem = null; /* this page's pass, for when storage is blocked */
  (function () {
    var m = /^#owner=(.*)$/.exec(location.hash || '');
    if (!m) return;
    var v = '';
    try { v = decodeURIComponent(m[1]).trim(); } catch (e) {}
    ownerMem = v && v !== 'off' ? v : null;
    try { if (ownerMem) localStorage.setItem(OWNER_KEY, ownerMem); else localStorage.removeItem(OWNER_KEY); } catch (e) {}
    try { history.replaceState(history.state, '', location.pathname + location.search); } catch (e) {}
  })();
  function ownerPass() {
    try { return localStorage.getItem(OWNER_KEY) || ownerMem; } catch (e) { return ownerMem; }
  }
  var PCM_RATES = [8000, 11025, 16000, 22050, 24000, 32000, 44100, 48000];
  var CANCEL_GUARD_MS = 400; /* a double-click must not start and cancel a call, or end one and start another */
  var END_WAIT_MS = 5000;    /* longest a hang-up waits for the relay to close the call */
  /* Mic capture: mono Float32 -> PCM16 LE, posted every ~100 ms. */
  var WORKLET = 'class FrontDeskMic extends AudioWorkletProcessor{constructor(){super();this.b=[];this.n=0}' +
    'process(inputs){var c=inputs[0]&&inputs[0][0];if(c){this.b.push(c.slice());this.n+=c.length;' +
    'if(this.n>=sampleRate/10){var o=new Int16Array(this.n),k=0;for(var i=0;i<this.b.length;i++){var a=this.b[i];' +
    'for(var j=0;j<a.length;j++){var x=Math.max(-1,Math.min(1,a[j]));o[k++]=x<0?x*32768:x*32767}}' +
    'this.port.postMessage(o.buffer,[o.buffer]);this.b=[];this.n=0}}return true}}' +
    'registerProcessor("front-desk-mic",FrontDeskMic);';

  var reduce = function () { return doc.classList.contains('reduced') || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  /* this site has no icon sprite: the mic is drawn inline (the pill's own copy is in the page markup) */
  var MIC = '<svg class="vd-i" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11.5" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>';
  function svg() { return MIC; }

  /* ---------------- the panel ---------------- */
  var panel, log, statusEl, timerEl, talkBtn, talkLabel, muteBtn, resumeBtn, announceEl, closeBtn, hintEl, voiceInputs;

  function build() {
    panel = el('section', 'vd-panel');
    panel.id = 'vd-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-labelledby', 'vd-title');
    panel.setAttribute('aria-describedby', 'vd-fine');
    panel.setAttribute('data-state', 'idle');
    var voices = VOICES.map(function (v, i) {
      return '<label class="vd-chip"><input type="radio" name="vd-voice" value="' + v.id + '"' + (i === 0 ? ' checked' : '') +
        ' aria-label="' + v.name + ', ' + v.hint.toLowerCase() + '"><span>' + v.name + '</span></label>';
    }).join('');
    panel.innerHTML =
      '<header class="vd-head">' +
        '<span class="vd-badge" aria-hidden="true">' + svg() + '</span>' +
        '<div class="vd-titles">' +
          '<p class="vd-eyebrow">Voice agent · demo</p>' +
          '<h2 class="vd-title" id="vd-title">Jupiter Granite Co.</h2>' +
          '<p class="vd-status"><i class="vd-dot" aria-hidden="true"></i><span id="vd-status">Ready</span>' +
            '<span class="vd-timer" id="vd-timer" aria-hidden="true">0:00</span></p>' +
        '</div>' +
        '<button class="vd-x" type="button" aria-label="Close the front desk demo">' +
          '<svg class="vd-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '</header>' +
      '<span class="sr-only" id="vd-announce" role="status" aria-live="polite" aria-atomic="true"></span>' +
      '<div class="vd-log" id="vd-log" tabindex="0" aria-label="Call transcript"></div>' +
      '<div class="vd-foot">' +
        '<fieldset class="vd-voices"><legend class="vd-legend">Voice</legend>' + voices +
          '<span class="vd-hint" id="vd-hint" aria-hidden="true"></span></fieldset>' +
        /* the fine print (mic, 30 days) sits just above Talk, so it's in view whenever Talk is */
        '<p class="vd-fine" id="vd-fine">Uses your mic. AERIOX keeps no recording; the AI provider behind AERIOX agents may keep the call up to 30 days to check for abuse (<a href="https://aeriox.co/legal/privacy" target="_blank" rel="noopener">privacy</a>). Ends at 3 min. No real bookings.</p>' +
        (ownerPass() ? '<p class="vd-fine vd-owner" id="vd-owner">Owner pass saved</p>' : '') +
        '<div class="vd-actions">' +
          '<button class="vd-talk" type="button" id="vd-talk"><span id="vd-talk-label">Talk</span><span class="vd-talk-ico">' + svg() + '</span></button>' +
          '<button class="vd-link" type="button" id="vd-mute" aria-pressed="false" hidden>Mute</button>' +
          '<button class="vd-link" type="button" id="vd-resume" hidden>Tap to resume audio</button>' +
        '</div>' +
        '<p class="vd-by">Voice agent by <a href="https://aeriox.co" target="_blank" rel="noopener">AERIOX</a></p>' +
      '</div>';
    root.appendChild(panel);
    log = panel.querySelector('#vd-log');
    statusEl = panel.querySelector('#vd-status');
    timerEl = panel.querySelector('#vd-timer');
    talkBtn = panel.querySelector('#vd-talk');
    talkLabel = panel.querySelector('#vd-talk-label');
    muteBtn = panel.querySelector('#vd-mute');
    resumeBtn = panel.querySelector('#vd-resume');
    announceEl = panel.querySelector('#vd-announce');
    closeBtn = panel.querySelector('.vd-x');
    hintEl = panel.querySelector('#vd-hint');
    voiceInputs = Array.prototype.slice.call(panel.querySelectorAll('input[name="vd-voice"]'));
    pill.setAttribute('aria-controls', 'vd-panel');

    try {
      var saved = localStorage.getItem(VOICE_KEY);
      if (saved) voiceInputs.forEach(function (i) { i.checked = i.value === saved; });
      if (!voiceInputs.some(function (i) { return i.checked; })) voiceInputs[0].checked = true;
    } catch (e) { /* storage blocked: keep the default */ }
    voiceInputs.forEach(function (i) {
      i.addEventListener('change', function () { showHint(); try { localStorage.setItem(VOICE_KEY, i.value); } catch (e) {} });
    });
    showHint();
    intro();

    talkBtn.addEventListener('click', function () {
      if (live || conv) {
        if (!live && conv && Date.now() - conv.startedAt < CANCEL_GUARD_MS) return;
        finishLive('Call ended');
      } else if (Date.now() - lastEndAt >= CANCEL_GUARD_MS) startLive();
    });
    muteBtn.addEventListener('click', function () {
      var c = conv; if (!c || !live) return;
      c.muted = !c.muted;
      muteBtn.setAttribute('aria-pressed', String(c.muted));
      muteBtn.textContent = c.muted ? 'Unmute' : 'Mute';
      if (!speaking(c)) setStatus(c.muted ? 'Muted' : 'Listening');
      sendState(c);
    });
    resumeBtn.addEventListener('click', function () {
      var c = conv; if (!c || !c.ctx) return;
      var p = c.ctx.resume();
      if (p && p.then) p.then(function () { if (conv === c && !audioPaused(c)) { resumeBtn.hidden = true; announce('Audio resumed.'); } }, function () {});
    });
    closeBtn.addEventListener('click', function () { close(); });
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } });
  }

  function showHint() {
    var on = voiceInputs.filter(function (i) { return i.checked; })[0];
    var v = on && VOICES.filter(function (x) { return x.id === on.value; })[0];
    if (hintEl) hintEl.textContent = v ? v.hint : '';
  }
  function pickedVoice() {
    var on = voiceInputs.filter(function (i) { return i.checked; })[0];
    return (on && VOICES.filter(function (x) { return x.id === on.value; })[0]) || VOICES[0];
  }
  function intro() {
    log.innerHTML = '';
    addNote('Ask about the stone work Jupiter Granite Co. does, or book a demo showroom appointment, in English or Spanish. Nothing is booked for real.');
  }
  function setState(s) {
    panel.setAttribute('data-state', s);
    var locked = s === 'connecting' || s === 'live';
    voiceInputs.forEach(function (i) { i.disabled = locked; });
    root.classList.toggle('is-live', locked);
  }
  function setStatus(t) { statusEl.textContent = t; }
  function setMode(m) { if (m) panel.setAttribute('data-mode', m); else panel.removeAttribute('data-mode'); }
  function fmt(sec) { return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); }
  function scrollDown() { log.scrollTop = log.scrollHeight; }
  function addBubble(who, text) {
    var b = el('div', 'vd-b ' + (who === 'ai' ? 'ai' : 'you'));
    b.appendChild(el('span', 'vd-who', who === 'ai' ? 'Front desk' : 'You'));
    if (text) b.appendChild(document.createTextNode(text));
    log.appendChild(b); scrollDown(); return b;
  }
  function addNote(text) { var n = el('p', 'vd-note', text); log.appendChild(n); scrollDown(); }
  /* One polite status region for screen readers, once per event. */
  function announce(text) {
    announceEl.textContent = '';
    setTimeout(function () { announceEl.textContent = text; }, 60);
  }
  /* The relay made a demo booking: show it the way the company would see it, marked as a demo. */
  function bookingCard(b) {
    var card = el('div', 'vd-card');
    card.appendChild(el('p', 'vd-card-eyebrow', 'Demo booking · not sent to Jupiter Granite Co.'));
    card.appendChild(el('p', 'vd-card-what', b.service || ''));
    card.appendChild(el('p', 'vd-card-when', (b.day || '') + (b.time ? ' · ' + b.time : '')));
    card.appendChild(el('p', 'vd-card-who', (b.name ? 'For ' + b.name : '') + (b.price ? (b.name ? ' · ' : '') + b.price : '')));
    /* The number (and email, if they gave one) the confirmation would go to, as the relay sends them:
       already masked there. Shown as text, never unmasked or kept. An older relay sends neither. */
    var contact = [b.phone, b.email].filter(function (v) { return typeof v === 'string' && v && v.length <= 80; }).join(' · ');
    if (contact) card.appendChild(el('p', 'vd-card-contact', contact));
    log.appendChild(card); scrollDown();
    announce('Demo booking shown: ' + (b.service || '') + ', ' + (b.day || '') + ' at ' + (b.time || '') + '. Nothing was sent to Jupiter Granite Co.');
  }

  /* ---------------- open / close ---------------- */
  var opened = false;
  /* the Look panel sits over this one (it's a layer up); opening the demo closes it, as the buy panel does */
  function closeLookPicker() {
    var picker = document.querySelector('.look-picker');
    var x = picker && picker.classList.contains('is-open') && picker.querySelector('.look-toggle');
    if (x) x.click();
  }
  /* and the other way round: opening Look puts this panel away. A call stays on, the panel hidden under
     Look (voice.css), and it shows again when Look closes. */
  if (window.MutationObserver) new MutationObserver(function () {
    if (doc.hasAttribute('data-picker-open') && opened && !(live || conv)) close({ keepFocus: true });
  }).observe(doc, { attributes: true, attributeFilter: ['data-picker-open'] });
  function open() {
    if (!panel) build();
    closeLookPicker();
    if (opened) { talkBtn.focus(); return; }
    opened = true;
    panel.hidden = false;
    root.classList.add('is-open');
    pill.setAttribute('aria-expanded', 'true');
    /* next frame, so the entrance transition runs */
    requestAnimationFrame(function () { panel.classList.add('is-in'); });
    talkBtn.focus();
  }
  function close(opts) {
    if (!panel || !opened) return;
    if (live || conv) finishLive('Call ended');
    opened = false;
    panel.classList.remove('is-in');
    root.classList.remove('is-open');
    pill.setAttribute('aria-expanded', 'false');
    var hide = function () { if (!opened) panel.hidden = true; };
    if (reduce()) hide(); else setTimeout(hide, 280);
    if (!(opts && opts.keepFocus)) frontDesk().focus();
  }
  /* focus goes back to the front-desk button on show: the AI chat's launcher when it has the pill's place
     (voice.css, #axc; the pill is hidden then), else the pill */
  function frontDesk() {
    var l = document.querySelector('#axc:not([hidden]) .axc-l');
    return l && l.getClientRects().length ? l : pill;
  }
  function toggle() { if (opened) close(); else open(); }
  /* On a short screen the panel scrolls. When the screen changes size with it open (a phone turned, a
     window resized), bring Talk back into view: the fine print sits just above it. */
  var fitQueued = false;
  window.addEventListener('resize', function () {
    if (!opened || fitQueued) return;
    fitQueued = true;
    requestAnimationFrame(function () {
      fitQueued = false;
      if (!opened || panel.scrollHeight <= panel.clientHeight) return;
      var over = talkBtn.getBoundingClientRect().bottom - panel.getBoundingClientRect().bottom;
      if (over > 0) panel.scrollTop += over + 12;
    });
  });

  /* ---------------- the call (port of aeriox.co's front-desk client) ---------------- */
  var conv = null, live = false, busy = false, lastEndAt = 0;
  var ending = null; /* the last call's hang-up, until the relay has closed it */

  function named(name, msg) { var e = new Error(msg || name); e.name = name; return e; }
  function wsSend(c, obj) { if (c.ws && c.ws.readyState === 1) c.ws.send(JSON.stringify(obj)); }
  function b64FromPcm(buf) {
    var u = new Uint8Array(buf), out = '';
    for (var i = 0; i < u.length; i += 0x8000) out += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
    return btoa(out);
  }
  function pcmFromB64(d) {
    var bin = atob(d), u = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return new Int16Array(u.buffer, 0, u.length >> 1);
  }
  /* Rough language guess from a finished reply; the relay switches its pronunciation map with it. */
  var ES_WORDS = { que: 1, 'qué': 1, usted: 1, gracias: 1, para: 1, puedo: 1, 'cómo': 1, 'está': 1, llamada: 1, corte: 1, una: 1, los: 1, las: 1, con: 1, por: 1, le: 1, en: 1, es: 1, su: 1, y: 1, hola: 1 };
  var EN_WORDS = { the: 1, you: 1, your: 1, and: 1, what: 1, how: 1, can: 1, is: 1, are: 1, to: 1, 'for': 1, 'with': 1, call: 1, it: 1, i: 1, we: 1 };
  function guessLang(text) {
    var es = 0, en = 0;
    String(text || '').toLowerCase().split(/[^a-záéíóúñü]+/).forEach(function (w) { if (ES_WORDS[w]) es++; if (EN_WORDS[w]) en++; });
    if (/[¿¡ñ]/.test(text)) es += 2;
    if (es >= 3 && es > en * 1.5) return 'es';
    if (en >= 3 && en > es * 1.5) return 'en';
    return null;
  }

  function speaking(c) { return !!(c.ctx && c.ctx.state === 'running' && c.playhead > c.ctx.currentTime + 0.02); }
  /* iOS can suspend the AudioContext mid-call (Siri, an alarm, a route change): say so, let a tap resume it. */
  function audioPaused(c) { return !!(c.ctx && c.ctx.state !== 'running' && !c.ctxClosed); }
  /* tells the relay whether the caller is muted or the audio is paused: it holds the AI's
     "are you still there?" check-ins while either is true */
  function sendState(c) { wsSend(c, { type: 'demo.state', muted: !!c.muted, paused: audioPaused(c) }); }
  function watchAudio(c) {
    c.ctx.onstatechange = function () {
      if (conv !== c || !live) return;
      if (audioPaused(c)) {
        resumeBtn.hidden = false; setStatus('Audio paused'); setMode(null);
        announce('Audio paused. Tap to resume audio.');
      } else {
        resumeBtn.hidden = true;
      }
      sendState(c);
    };
  }
  function absolute(u) { try { return new URL(u, API + '/').href; } catch (e) { return null; } }
  function greetingUrl(voice, lang) { return API + '/demo-voice/' + TENANT + '/greetings/' + voice + '-' + lang + '.mp3'; }
  function fetchBytes(url) {
    return fetch(url, { mode: 'cors', credentials: 'omit' }).then(function (r) { if (!r.ok) throw named('GreetingError'); return r.arrayBuffer(); });
  }
  function decode(ctx, bytes) {
    return new Promise(function (resolve, reject) { /* callback form too, for older Safari */
      var p = ctx.decodeAudioData(bytes, resolve, reject);
      if (p && p.then) p.then(resolve, reject);
    });
  }
  function queueBuffer(c, buf) {
    var src = c.ctx.createBufferSource();
    src.buffer = buf; src.connect(c.ctx.destination);
    var at = Math.max(c.playhead, c.ctx.currentTime + 0.05);
    src.start(at); c.playhead = at + buf.duration;
    c.sources.push(src);
    src.onended = function () { c.sources = c.sources.filter(function (x) { return x !== src; }); };
  }
  function playPcm(c, delta, itemId) {
    var pcm = pcmFromB64(delta);
    if (!pcm.length) return;
    var f = new Float32Array(pcm.length);
    for (var i = 0; i < pcm.length; i++) f[i] = pcm[i] / 32768;
    var buf = c.ctx.createBuffer(1, f.length, c.rate);
    buf.getChannelData(0).set(f);
    /* audio arrives faster than real time: queue it on a playhead so it plays gap-free */
    if (itemId && c.itemStart[itemId] == null) c.itemStart[itemId] = Math.max(c.playhead, c.ctx.currentTime + 0.05);
    c.lastItem = itemId || c.lastItem;
    queueBuffer(c, buf);
  }
  function stopPlayback(c) {
    c.sources.forEach(function (x) { try { x.stop(); } catch (e) {} });
    c.sources = []; c.playhead = 0;
  }
  /* Barge-in: the caller started talking, so stop the reply they are talking over. */
  function bargeIn(c) {
    if (speaking(c) && c.lastItem && c.itemStart[c.lastItem] != null) {
      var ms = Math.max(0, Math.round((c.ctx.currentTime - c.itemStart[c.lastItem]) * 1000));
      wsSend(c, { type: 'conversation.item.truncate', item_id: c.lastItem, content_index: 0, audio_end_ms: ms });
    }
    stopPlayback(c);
    if (c.curResp && !c.done[c.curResp]) c.cutResp = c.curResp;
  }
  function callerSlot(c) {
    if (!c.callerSlot) {
      c.callerSlot = el('div', 'vd-typing');
      c.callerSlot.innerHTML = '<i></i><i></i><i></i>';
      log.appendChild(c.callerSlot); scrollDown();
    }
    return c.callerSlot;
  }
  function fillCaller(c, text) {
    var slot = c.callerSlot; c.callerSlot = null;
    text = String(text || '').trim();
    if (!text) { if (slot) slot.remove(); return; }
    var b = addBubble('you', text);
    if (slot) { log.insertBefore(b, slot); slot.remove(); }
  }
  function agentBubble(c, respId) {
    if (!c.bubbles[respId]) c.bubbles[respId] = addBubble('ai', '');
    return c.bubbles[respId];
  }
  /* The relay says the 3-minute limit (or silence) is up: drop the reply in progress; the goodbye comes next. */
  function onClosing(c) {
    if (c.closing) return;
    c.closing = true; c.goodbyeSent = true;
    if (c.curResp && !c.done[c.curResp]) c.cutResp = c.curResp;
    stopPlayback(c);
  }

  function onEvent(c, ev) {
    switch (ev.type) {
      case 'session.updated':
        if (c.ready) break;
        /* Play the recorded greeting with the recording notice. Until it has played in full, the mic
           stays closed and nothing can interrupt it; the relay holds the mic closed for as long. */
        c.ready = true; c.greeting = true; goLive(c);
        queueBuffer(c, c.greetBuf); c.greetDone = true;
        addBubble('ai', c.cfg.greeting || '');
        break;
      case 'demo.closing':
        /* idle: the call went quiet. heard: the caller had spoken, so it isn't a mic problem. */
        if (ev.reason === 'idle') { c.idle = true; c.heard = !!ev.heard; }
        onClosing(c);
        break;
      case 'demo.booking':
        if (ev.booking && typeof ev.booking === 'object') bookingCard(ev.booking);
        break;
      case 'response.created':
        var rid = ev.response && ev.response.id;
        c.curResp = rid;
        if (c.goodbyeSent && !c.goodbyeResp && rid !== c.cutResp) c.goodbyeResp = rid;
        break;
      case 'input_audio_buffer.speech_started':
        if (c.closing || c.greeting) break;
        bargeIn(c); callerSlot(c);
        break;
      case 'conversation.item.input_audio_transcription.completed':
        fillCaller(c, ev.transcript);
        break;
      case 'response.output_audio.delta':
      case 'response.audio.delta':
        if (ev.response_id !== c.cutResp) playPcm(c, ev.delta, ev.item_id);
        break;
      case 'response.output_audio_transcript.delta':
        if (ev.response_id !== c.cutResp && ev.delta) {
          var b = agentBubble(c, ev.response_id);
          b.appendChild(document.createTextNode(ev.delta)); scrollDown();
          c.text[ev.response_id] = (c.text[ev.response_id] || '') + ev.delta;
        }
        break;
      case 'response.function_call_arguments.done':
        if (ev.name === 'end_call') { c.hangupResp = ev.response_id || c.curResp; c.hangupAt = Date.now(); c.closing = true; }
        break;
      case 'response.done':
        var id = ev.response && ev.response.id;
        if (!id) break;
        c.done[id] = true;
        var bub = c.bubbles[id];
        if (bub && bub.childNodes.length <= 1) bub.remove();
        /* follow the caller's language: the relay switches how AERIOX is said with it */
        var lang = guessLang(c.text[id]);
        if (lang && lang !== c.lang) { c.lang = lang; wsSend(c, { type: 'demo.lang', lang: lang }); }
        break;
      case 'error':
        if (window.console) console.warn('Voice demo:', ev.error && (ev.error.message || ev.error.type));
        break;
    }
  }

  function goLive(c) {
    live = true; busy = false; setState('live'); setStatus('Live');
    /* No aria-live on the transcript during a call: the audio already carries the words, and a screen
       reader reading every streamed fragment would talk over the AI and into the mic. */
    log.innerHTML = '';
    announce('Call connected. Our voice agent is answering.');
    talkBtn.disabled = false; talkLabel.textContent = 'End';
    muteBtn.hidden = false; muteBtn.setAttribute('aria-pressed', 'false'); muteBtn.textContent = 'Mute';
    c.t0 = Date.now();
    timerEl.textContent = '0:00';
    c.tick = setInterval(function () { tick(c); }, 200);
    sendState(c);
  }
  function tick(c) {
    if (conv !== c) return;
    var sec = (Date.now() - c.t0) / 1000, max = c.cfg.maxSeconds || 180;
    timerEl.textContent = fmt(Math.floor(sec));
    if (audioPaused(c)) { if (sec >= max + 3 || c.sockClosed) finishLive('Call ended'); return; }
    var talking = speaking(c);
    /* the greeting has played out: the mic is open and barge-in works */
    if (c.greeting && c.greetDone && !talking) c.greeting = false;
    var mode = talking ? 'speaking' : 'listening';
    if (panel.getAttribute('data-mode') !== mode) {
      setMode(mode);
      setStatus(talking ? 'Agent speaking' : c.muted ? 'Muted' : 'Listening');
    }
    var capMsg = c.idle ? (c.heard ? 'Call ended' : 'Call ended · nothing heard') : 'Call ended · 3-minute limit';
    if (c.sockClosed && !talking) return finishLive(c.timeUp || c.goodbyeResp ? capMsg : 'Call ended');
    if (c.goodbyeResp && c.done[c.goodbyeResp] && !talking) return finishLive(capMsg);
    if (c.hangupResp && ((c.done[c.hangupResp] && !talking) || Date.now() - c.hangupAt > 15000)) return finishLive('Call ended');
    /* the relay ends the call at the cap; this only covers a relay that went quiet */
    if (sec >= max + 3) finishLive(capMsg);
  }

  function fetchSession(voice, lang, rate) {
    var body = { tenant: TENANT, voice: voice, lang: lang, rate: rate };
    var pass = ownerPass();
    if (pass) body.owner_pass = pass;
    return fetch(API + '/api/demo-voice-session', {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().catch(function () { return null; }).then(function (j) {
        if (!r.ok || !j || !j.ticket) {
          var err = named('SessionError');
          err.userMessage = j && j.message;
          err.reason = j && j.reason;
          err.retryAfter = j && Number(j.retryAfter);
          var line = pass && (err.reason === 'hourly' || err.reason === 'daily') && document.getElementById('vd-owner');
          if (line) line.textContent = 'Owner pass saved · not accepted';
          throw err;
        }
        return j;
      });
    });
  }
  /* A short wait (the per-visitor cooldown, or the last call still closing on the server) is
     waited out with a countdown instead of refusing the visitor. */
  async function sessionWithRetry(c, voice, lang, rate) {
    for (var attempt = 0; ; attempt++) {
      try { return await fetchSession(voice, lang, rate); }
      catch (e) {
        var s = e && e.retryAfter;
        if (attempt >= 2 || !(e.reason === 'cooldown' || e.reason === 'active') || !(s > 0 && s <= 15)) throw e;
        for (; s > 0; s--) {
          if (conv !== c) throw named('Cancelled');
          setStatus('Starting in ' + s + 's');
          await new Promise(function (r) { setTimeout(r, 1000); });
        }
        if (conv !== c) throw named('Cancelled');
        setStatus('Connecting');
      }
    }
  }

  async function startLive() {
    if (busy || live) return;
    busy = true;
    var voice = pickedVoice();
    talkBtn.disabled = false; talkLabel.textContent = 'Cancel';
    setState('connecting'); setStatus('Connecting'); setMode(null);
    announce('Connecting.');
    timerEl.textContent = '0:00';
    log.innerHTML = '';
    var c = conv = { sources: [], playhead: 0, bubbles: {}, text: {}, done: {}, itemStart: {}, muted: false, startedAt: Date.now() };
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.WebSocket || !window.fetch) throw named('NotSupportedError');
      /* Create and resume the AudioContext inside the tap (Safari). Use its native rate when the relay takes it. */
      c.ctx = new AC();
      if (PCM_RATES.indexOf(c.ctx.sampleRate) < 0) { c.ctx.close(); c.ctx = new AC({ sampleRate: 48000 }); }
      if (!c.ctx.audioWorklet) throw named('NotSupportedError');
      var resumed = c.ctx.resume();
      c.rate = c.ctx.sampleRate;
      var lang = /^es\b/i.test(navigator.language || '') ? 'es' : 'en';
      /* the greeting recording (about 20 KB) loads while the session and the mic prompt are pending */
      var greetUrl = greetingUrl(voice.id, lang);
      var greetBytes = fetchBytes(greetUrl);
      greetBytes.catch(function () {});
      /* the last call may still be hanging up; the server frees its slot once that's recorded */
      if (ending) { await ending; if (conv !== c) return teardown(c); }
      /* limits first: a visitor the demo can't take right now never sees a mic prompt */
      c.cfg = await sessionWithRetry(c, voice.id, lang, c.rate);
      if (conv !== c) return teardown(c);
      addNote('Allow microphone access to start. Speak normally once it answers.');
      announce('Allow microphone access to start.');
      c.stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      if (conv !== c) return teardown(c);
      /* the ticket lasts a minute; a mic prompt left open longer gets a fresh one (it replaces the old) */
      if (c.cfg.expiresAt && Date.now() / 1000 > c.cfg.expiresAt - 10) {
        c.cfg = await sessionWithRetry(c, voice.id, lang, c.rate);
        if (conv !== c) return teardown(c);
      }
      c.lang = c.cfg.lang || lang;
      if (c.cfg.rate !== c.rate) throw named('SessionError');
      await resumed;
      /* Safari can leave the context suspended even after resume() in the tap */
      if (c.ctx.state !== 'running') throw named('AudioBlocked');
      watchAudio(c);
      var cfgGreet = c.cfg.greetingAudio && absolute(c.cfg.greetingAudio);
      c.greetBuf = await decode(c.ctx, await (cfgGreet && cfgGreet !== greetUrl ? fetchBytes(cfgGreet) : greetBytes));
      if (conv !== c) return teardown(c);
      var modUrl = URL.createObjectURL(new Blob([WORKLET], { type: 'text/javascript' }));
      try { await c.ctx.audioWorklet.addModule(modUrl); } finally { URL.revokeObjectURL(modUrl); }
      if (conv !== c) return teardown(c);
      c.node = new AudioWorkletNode(c.ctx, 'front-desk-mic');
      c.mic = c.ctx.createMediaStreamSource(c.stream);
      c.mic.connect(c.node);
      c.node.connect(c.ctx.destination); /* the worklet outputs silence; connected so every browser pulls it */
      c.node.port.onmessage = function (e) {
        /* nothing goes up until the greeting (with the recording notice) has played in full */
        if (!c.ready || c.greeting || !c.ws || c.ws.readyState !== 1) return;
        /* muted or wrapping up: keep the stream going with silence so the server's turn detection settles */
        var buf = c.muted || c.closing ? new Int16Array(e.data.byteLength >> 1).buffer : e.data;
        c.ws.send(JSON.stringify({ type: 'input_audio_buffer.append', audio: b64FromPcm(buf) }));
      };
      await new Promise(function (resolve, reject) {
        var relay = API.replace(/^http/, 'ws') + c.cfg.url;
        var ws = c.ws = new WebSocket(relay, [c.cfg.protocol || 'aeriox-demo', 'ticket.' + c.cfg.ticket]);
        var timer = setTimeout(function () { reject(named('ConnectTimeout')); }, 12000);
        ws.onmessage = function (m) {
          var ev; try { ev = JSON.parse(m.data); } catch (err) { return; }
          onEvent(c, ev);
          if (c.ready) { clearTimeout(timer); resolve(); }
        };
        ws.onclose = function (e) {
          clearTimeout(timer);
          if (!c.ready) return reject(named('ConnectClosed'));
          if (conv !== c || c.endedByUs) return;
          c.sockClosed = true;
          /* 4000: the 3-minute cap. 4001: the AI hung up. Let queued audio finish; tick() ends the call. */
          if (e.code === 4000) c.timeUp = true;
          /* 4003: the AI side reported an error it won't recover from; no reply follows */
          if (e.code === 4003) {
            finishLive('Call ended');
            addNote('The demo hit a problem. Try again in a moment.');
            announce('The demo hit a problem. Try again in a moment.');
            return;
          }
          /* 4002: the call went quiet and the relay said goodbye; tick() ends the call once it has played */
          if (e.code === 4002) c.idle = true;
          if (c.closing || e.code === 4000 || e.code === 4001 || e.code === 4002) return;
          finishLive('Call ended');
          addNote('The connection dropped. Try again in a moment.');
          announce('The connection dropped. Try again in a moment.');
        };
      });
    } catch (e) {
      teardown(c);
      if (conv !== c) return;
      conv = null; live = false; busy = false;
      setState('done'); setStatus('Couldn’t start'); setMode(null);
      log.innerHTML = '';
      var n = e && e.name;
      var why = n === 'NotAllowedError' || n === 'SecurityError'
        ? 'Microphone access is blocked. Allow it for this site in your browser settings, then try again.'
        : n === 'NotFoundError'
        ? 'No microphone was found. Try on your phone, or on a computer with a mic.'
        : n === 'NotSupportedError'
        ? 'This browser can’t run the voice demo. Try a current Chrome, Safari, Edge or Firefox.'
        : n === 'AudioBlocked'
        ? 'Your browser kept the sound off. Tap Talk again to start with audio.'
        : (e && e.userMessage) || 'The voice demo couldn’t connect right now. Try again in a moment.';
      addNote(why);
      announce('Couldn’t start. ' + why);
      talkBtn.disabled = false; talkLabel.textContent = 'Talk';
    }
  }

  /* Hang up through the relay: it records the end on the server, then closes the socket. Closing
     the socket from here instead can leave the call open on the server, and the next call is
     refused as "already on a demo call". A relay that doesn't close in END_WAIT_MS is closed from here. */
  function hangUp(c) {
    var ws = c.ws;
    if (!ws || ws.readyState > 1) return;
    ws.onmessage = null; /* nothing from the ended call reaches the page */
    if (ws.readyState === 0) { try { ws.close(1000); } catch (e) {} return; }
    try { ws.send(JSON.stringify({ type: 'demo.end' })); } catch (e) {}
    ending = new Promise(function (resolve) {
      var t = setTimeout(function () { try { ws.close(1000); } catch (e) {} resolve(); }, END_WAIT_MS);
      ws.addEventListener('close', function () { clearTimeout(t); resolve(); });
    });
  }
  /* Every exit path closes everything. Safe to call again. */
  function teardown(c) {
    if (!c) return;
    c.endedByUs = true;
    if (c.tick) { clearInterval(c.tick); c.tick = null; }
    hangUp(c);
    if (c.stream) c.stream.getTracks().forEach(function (t) { if (t.readyState !== 'ended') t.stop(); });
    try { if (c.node) { c.node.port.onmessage = null; c.node.disconnect(); } if (c.mic) c.mic.disconnect(); } catch (e) {}
    stopPlayback(c);
    if (c.ctx && !c.ctxClosed) {
      c.ctxClosed = true;
      try { var closing = c.ctx.close(); if (closing && closing.catch) closing.catch(function () {}); } catch (e) {}
    }
  }
  function finishLive(msg) {
    var c = conv; conv = null;
    if (c) lastEndAt = Date.now();
    teardown(c);
    /* don't strand keyboard focus on a button that's about to disappear */
    if (document.activeElement === muteBtn || document.activeElement === resumeBtn) talkBtn.focus();
    muteBtn.hidden = true; resumeBtn.hidden = true;
    if (!c) { busy = false; return; }
    var wasLive = live;
    live = false; busy = false; setMode(null);
    setState('done'); setStatus(msg || 'Call ended');
    if (!wasLive) { setStatus('Cancelled'); log.innerHTML = ''; addNote('Call cancelled.'); announce('Call cancelled.'); }
    else announce(statusEl.textContent + '.');
    if (wasLive && c.idle && !c.heard) addNote('The call ended because our voice agent didn’t hear anything. Check that your microphone is on and unmuted, then try again.');
    talkBtn.disabled = false; talkLabel.textContent = wasLive ? 'Talk again' : 'Talk';
  }

  window.addEventListener('pagehide', function () { if (conv) finishLive(); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && conv) finishLive('Call ended'); });

  window.FrontDeskVoice = { open: open, close: close, toggle: toggle, api: function () { return API; } };
})();
