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
  /* the two voices the panel offers before the tenant's voice list loads (voicePicker below) */
  var VOICES = [
    { id: 'ara', name: 'Ara', gender: 'female', tone: 'Warm, friendly' },
    { id: 'castor', name: 'Castor', gender: 'male', tone: 'Charismatic, down-to-earth' }
  ];
  var VOICE_KEY = 'jupiter-granite-voice-demo';
  var VOICE_MANIFEST = loadVoiceManifest(API, TENANT); /* the tenant's full voice list (voicePicker) */
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

  /* aeriox:voice-picker v1 */
  /* The voice chooser in the front desk panel. One block, the same in every voice.js: aeriox-app's voice
     template (scripts/site-builder/templates/addons/voice/voice.js) is its source, and the hand-built sites
     carry a copy of it between these two markers.
     The default view keeps two voice chips, the tenant's default and a second one (the visitor's pick when
     it's one of the extra voices), and a "More" chip. More swaps the transcript and the footer for a list of
     every voice the tenant offers, each with a Play button for its recorded greeting (a static MP3 on the
     API's origin: no call, no cost, no visitor limit used); Done or Escape swaps back. The panel keeps its
     height. The list is the tenant's manifest, <api>/demo-voice/<tenant>/voices.json, which aeriox-site
     writes from the same tenant config /api/demo-voice-session checks a voice against
     (scripts/demo-voice-manifest.ts). Until it loads, or when it can't, the panel offers the page's own
     voices and no More chip: the panel as it was. */
  function loadVoiceManifest(api, tenant) {
    return new Promise(function (resolve) {
      var done = false, ctl = null, timer = null;
      function finish(m) { if (!done) { done = true; clearTimeout(timer); resolve(m); } }
      if (!window.fetch) return finish(null);
      try { ctl = new AbortController(); } catch (e) { ctl = null; }
      timer = setTimeout(function () { if (ctl) ctl.abort(); finish(null); }, 4000);
      fetch(api + '/demo-voice/' + tenant + '/voices.json', { mode: 'cors', credentials: 'omit', signal: ctl ? ctl.signal : undefined })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (m) { finish(voiceManifest(m, tenant)); }, function () { finish(null); });
    });
  }
  /* A manifest the picker can use, or null: version 1, this tenant, xAI-style ids, the default among them. */
  function voiceManifest(m, tenant) {
    if (!m || m.v !== 1 || m.tenant !== tenant || !Array.isArray(m.voices) || !m.voices.length) return null;
    var seen = Object.create(null), voices = [];
    for (var i = 0; i < m.voices.length; i++) {
      var v = m.voices[i];
      if (!v || typeof v.id !== 'string' || !/^[a-z]+$/.test(v.id) || seen[v.id] || typeof v.name !== 'string' || !v.name) return null;
      seen[v.id] = true;
      voices.push({ id: v.id, name: v.name, gender: v.gender === 'female' || v.gender === 'male' ? v.gender : '', tone: typeof v.tone === 'string' ? v.tone : '' });
    }
    if (typeof m.defaultVoice !== 'string' || !seen[m.defaultVoice]) return null;
    return { defaultVoice: m.defaultVoice, shown: (Array.isArray(m.shown) ? m.shown : []).filter(function (id) { return seen[id] === true; }), voices: voices };
  }
  /* o: panel, fieldset (.vd-voices: its legend and the hint), hint, swap (what the list stands in for),
     mountAfter (the panel's header), api, tenant, storageKey, fallback ([{id, name, gender, tone}] or
     [{id, name, hint}]: the page's own voices), lang ('en' | 'es'), announce(text), manifest (a promise). */
  function voicePicker(o) {
    var panel = o.panel, fieldset = o.fieldset, hintEl = o.hint, swap = (o.swap || []).filter(Boolean);
    var voices = [], shown = [], defaultVoice = '', pickedId = '', touched = false, locked = false, pending = null;
    var view = null, list = null, more = null, rows = {}, audio = null, playing = null, compact = [];
    var lang = o.lang === 'es' ? 'es' : 'en';
    var ICON_PLAY = '<svg class="vd-pi" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.5 4.8v14.4a.8.8 0 0 0 1.2.7l11.3-7.2a.8.8 0 0 0 0-1.4L8.7 4.1a.8.8 0 0 0-1.2.7z"/></svg>';
    var ICON_STOP = '<svg class="vd-pi" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';

    function h(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function all(sel, el) { return Array.prototype.slice.call((el || fieldset).querySelectorAll(sel)); }
    function byId(id) { for (var i = 0; i < voices.length; i++) if (voices[i].id === id) return voices[i]; return null; }
    /* "Female voice · warm, friendly" under the chips (long), "Female · warm, friendly" in the list */
    function hintOf(v, long) {
      if (!v) return '';
      if (!v.gender && !v.tone) return long ? v.hint || '' : (v.hint || '').replace(/^(Female|Male) voice\b/, '$1');
      var g = v.gender === 'female' ? 'Female' : v.gender === 'male' ? 'Male' : '';
      var t = v.tone ? v.tone.charAt(0).toLowerCase() + v.tone.slice(1) : '';
      return [g && long ? g + ' voice' : g, t].filter(Boolean).join(' · ');
    }
    /* "Iris, female voice, friendly, upbeat" */
    function spoken(v) { var x = hintOf(v, true); return v.name + (x ? ', ' + x.replace(/ · /g, ', ').toLowerCase() : ''); }
    function saved() { try { return localStorage.getItem(o.storageKey); } catch (e) { return null; } }
    function save(id) { try { localStorage.setItem(o.storageKey, id); } catch (e) { /* storage blocked: this page only */ } }

    /* ---- the voices ---- */
    function setVoices(list, def, show) {
      voices = list.map(function (v) { return { id: v.id, name: v.name, gender: v.gender || '', tone: v.tone || '', hint: v.hint || '' }; });
      defaultVoice = byId(def) ? def : voices[0].id;
      shown = [defaultVoice];
      (show || []).concat(voices.map(function (v) { return v.id; })).forEach(function (id) {
        if (shown.length < 2 && byId(id) && shown.indexOf(id) < 0) shown.push(id);
      });
    }
    function use(m) {
      setVoices(m.voices, m.defaultVoice, m.shown);
      /* a pick made before the list arrived stands; else the saved one; else the default. A saved voice
         this list doesn't offer is ignored, not erased: it comes back when a list that has it loads. */
      if (!touched || !byId(pickedId)) { var s = saved(); pickedId = byId(s) ? s : defaultVoice; }
      renderList();
      renderChips();
    }
    function load(m) {
      if (!m || !m.voices || !m.voices.length) return;
      if (locked || isOpen()) pending = m; /* never under a call, or under the visitor's eyes in the list */
      else use(m);
    }

    /* ---- the default view: two chips and More ---- */
    function renderChips() {
      /* the second chip: the picked voice when it's an extra one, else the second shown voice. Fixed until
         the next render (the list closing, or the manifest arriving), so a chip never vanishes under a tap. */
      var slot = shown.indexOf(pickedId) >= 0 ? shown[1] : pickedId;
      var ids = [shown[0], slot].filter(function (id, i, a) { return id && a.indexOf(id) === i; });
      all('.vd-chip, .vd-more').forEach(function (n) { n.parentNode.removeChild(n); });
      var html = ids.map(function (id) {
        var v = byId(id);
        return '<label class="vd-chip"><input type="radio" name="vd-voice" value="' + h(id) + '"' + (id === pickedId ? ' checked' : '') +
          (locked ? ' disabled' : '') + ' aria-label="' + h(spoken(v)) + '"><span>' + h(v.name) + '</span></label>';
      }).join('');
      var extra = voices.length - ids.length;
      if (extra > 0 && view) {
        html += '<button class="vd-more" type="button" aria-expanded="false" aria-controls="vd-vview" aria-label="More voices, ' + extra +
          ' more to try"' + (locked ? ' disabled' : '') + '><span>More</span></button>';
      }
      hintEl.insertAdjacentHTML('beforebegin', html);
      all('.vd-chip input').forEach(function (i) { i.addEventListener('change', function () { pick(i.value); }); });
      more = fieldset.querySelector('.vd-more');
      if (more) more.addEventListener('click', openList);
      hintEl.textContent = hintOf(byId(pickedId), true);
      fit();
    }
    /* one line, always: when the chips and More would wrap, the "Voice" legend leaves the row visually
       (is-tight) and still names the group for screen readers */
    function fit() {
      fieldset.classList.remove('is-tight');
      var c = all('.vd-chip, .vd-more');
      if (c.length > 1 && c[c.length - 1].offsetTop > c[0].offsetTop + 4) fieldset.classList.add('is-tight');
    }
    if (window.ResizeObserver) new ResizeObserver(function () { fit(); }).observe(fieldset);
    function pick(id) {
      if (!byId(id)) return;
      pickedId = id; touched = true; save(id);
      hintEl.textContent = hintOf(byId(id), true);
      all('input[name="vd-voice"]').forEach(function (i) { i.checked = i.value === id; });
      if (list) all('input', list).forEach(function (i) { i.checked = i.value === id; });
    }

    /* ---- the list ---- */
    function renderList() {
      stop();
      if (view && view.parentNode) view.parentNode.removeChild(view);
      view = list = null; rows = {};
      if (voices.length <= 2) return;
      view = document.createElement('div');
      view.className = 'vd-vview'; view.id = 'vd-vview'; view.hidden = true;
      view.innerHTML =
        '<div class="vd-vhead"><div class="vd-vtitles"><h3 class="vd-vtitle" id="vd-vtitle">Choose a voice</h3>' +
          '<p class="vd-vsub">Press play to hear each one.</p></div>' +
          '<button class="vd-done" type="button">Done</button></div>' +
        '<div class="vd-vlist" role="radiogroup" aria-labelledby="vd-vtitle">' + voices.map(function (v) {
          return '<div class="vd-vrow" data-voice="' + h(v.id) + '">' +
            '<label class="vd-vpick"><input type="radio" name="vd-voice-all" value="' + h(v.id) + '"' + (v.id === pickedId ? ' checked' : '') +
              ' aria-label="' + h(spoken(v)) + '"><span class="vd-vdot" aria-hidden="true"></span>' +
              '<span class="vd-vname" aria-hidden="true">' + h(v.name) + '</span><span class="vd-vhint" aria-hidden="true">' + h(hintOf(v)) + '</span></label>' +
            '<button class="vd-play" type="button" data-state="idle" aria-label="Play sample: ' + h(v.name) + '">' + ICON_PLAY + '</button></div>';
        }).join('') + '</div>' +
        '<div class="vd-vfoot"><span class="vd-vlang-l" id="vd-vlang">Samples in</span>' +
          '<div class="vd-seg" role="radiogroup" aria-labelledby="vd-vlang">' +
            '<label><input type="radio" name="vd-vlang" value="en"' + (lang === 'en' ? ' checked' : '') + '><span>English</span></label>' +
            '<label lang="es"><input type="radio" name="vd-vlang" value="es"' + (lang === 'es' ? ' checked' : '') + '><span>Español</span></label>' +
          '</div></div>';
      var after = o.mountAfter;
      after.parentNode.insertBefore(view, after.nextSibling);
      list = view.querySelector('.vd-vlist');
      all('.vd-vrow', view).forEach(function (r) {
        var id = r.getAttribute('data-voice');
        rows[id] = r;
        r.querySelector('input').addEventListener('change', function () { pick(id); });
        r.querySelector('.vd-play').addEventListener('click', function () { play(id); });
      });
      all('.vd-seg input', view).forEach(function (i) { i.addEventListener('change', function () { stop(); lang = i.value; }); });
      view.querySelector('.vd-done').addEventListener('click', function () { closeList(true); });
      view.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); closeList(true); } });
      list.addEventListener('scroll', fade, { passive: true });
    }
    function fade() { if (list) list.classList.toggle('is-end', list.scrollTop + list.clientHeight >= list.scrollHeight - 2); }
    function isOpen() { return !!(view && !view.hidden); }
    function openList() {
      if (locked || !view || isOpen()) return;
      var height = panel.getBoundingClientRect().height;
      panel.scrollTop = 0;
      panel.style.height = height + 'px'; /* the same box: the list scrolls inside it */
      panel.classList.remove('vd-back');
      swap.forEach(function (e) { e.hidden = true; });
      view.hidden = false;
      if (more) more.setAttribute('aria-expanded', 'true');
      /* a short panel (a phone on its side): grow it, up to its own max-height, until about 2.5 rows show */
      var short = 144 - list.clientHeight;
      if (short > 0) {
        var max = parseFloat(getComputedStyle(panel).maxHeight);
        var cap = Math.min(isFinite(max) ? max : Infinity, window.innerHeight - 24);
        panel.style.height = Math.max(height, Math.min(cap, height + short)) + 'px';
      }
      /* still short (the panel is at its max-height): until the list closes, the panel's header steps
         aside and the language switch moves up beside Done, so the list gets their room */
      if (list.clientHeight < 144) {
        var head = view.querySelector('.vd-vhead');
        compact = [o.mountAfter, view.querySelector('.vd-vtitles'), view.querySelector('.vd-vfoot')];
        compact.forEach(function (e) { e.hidden = true; });
        head.insertBefore(view.querySelector('.vd-seg'), head.querySelector('.vd-done'));
        head.style.justifyContent = 'space-between';
      }
      var r = rows[pickedId] || rows[voices[0].id], input = r.querySelector('input');
      input.checked = true;
      list.scrollTop = Math.max(0, r.offsetTop - (list.clientHeight - r.offsetHeight) / 2);
      fade();
      try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); }
    }
    function closeList(returnFocus) {
      if (!isOpen()) return;
      stop();
      view.hidden = true;
      swap.concat(compact).forEach(function (e) { e.hidden = false; });
      if (compact.length) {
        view.querySelector('.vd-vfoot').appendChild(view.querySelector('.vd-seg'));
        view.querySelector('.vd-vhead').style.justifyContent = '';
        compact = [];
      }
      panel.style.height = '';
      panel.classList.add('vd-back');
      if (pending && !locked) { var m = pending; pending = null; use(m); } else renderChips();
      if (returnFocus) {
        var f = more || fieldset.querySelector('.vd-chip input:checked');
        if (f) f.focus();
        if (o.announce) o.announce('Voice: ' + byId(pickedId).name + '.');
      }
    }

    /* ---- samples: the recorded greeting, one at a time (an audio element, so a phone on silent still plays it) ---- */
    function sampleUrl(id) { return o.api + '/demo-voice/' + o.tenant + '/greetings/' + id + '-' + lang + '.mp3'; }
    function setRow(id, st) {
      var r = rows[id], v = byId(id); if (!r || !v) return;
      var b = r.querySelector('.vd-play'), on = st === 'playing' || st === 'loading';
      b.setAttribute('data-state', st);
      b.setAttribute('aria-label', (on ? 'Stop sample: ' : 'Play sample: ') + v.name);
      b.innerHTML = on ? ICON_STOP : ICON_PLAY;
      r.classList.toggle('is-playing', st === 'playing');
      r.classList.toggle('is-failed', st === 'failed');
      r.querySelector('.vd-vhint').textContent = st === 'failed' ? 'The sample didn’t load. Try again.' : hintOf(v);
      if (st !== 'playing') r.style.removeProperty('--p');
    }
    function stop() {
      var id = playing; if (!id) return;
      playing = null;
      if (audio) { audio.pause(); audio.removeAttribute('src'); try { audio.load(); } catch (e) {} }
      setRow(id, 'idle');
    }
    function failed() {
      var id = playing; if (!id) return;
      playing = null;
      setRow(id, 'failed');
      if (o.announce) o.announce('The sample of ' + byId(id).name + ' didn’t load. Try again.');
    }
    function play(id) {
      if (playing === id) return stop();
      stop();
      if (!audio) {
        audio = new Audio();
        audio.preload = 'none';
        audio.addEventListener('playing', function () { if (playing) setRow(playing, 'playing'); });
        audio.addEventListener('timeupdate', function () {
          if (playing && rows[playing] && audio.duration) rows[playing].style.setProperty('--p', Math.min(1, audio.currentTime / audio.duration).toFixed(3));
        });
        audio.addEventListener('ended', function () { var was = playing; playing = null; if (was) setRow(was, 'idle'); });
        /* an error from a source already replaced has no audio.error by the time it arrives */
        audio.addEventListener('error', function () { if (audio.error && audio.getAttribute('src')) failed(); });
      }
      playing = id;
      setRow(id, 'loading');
      audio.src = sampleUrl(id);
      var p = audio.play();
      if (p && p.catch) p.catch(function (e) { if (playing === id && !(e && e.name === 'AbortError')) failed(); });
    }
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') stop(); });

    use({ voices: o.fallback, defaultVoice: o.fallback[0].id, shown: o.fallback.map(function (v) { return v.id; }) });
    if (o.manifest && o.manifest.then) o.manifest.then(load, function () {});
    return {
      /* the voice for the call */
      picked: function () { var v = byId(pickedId) || byId(defaultVoice); return { id: v.id, name: v.name }; },
      /* connecting or live: the chips and More are off and the list is closed */
      lock: function (on) {
        locked = !!on;
        if (locked) closeList(false);
        else if (pending && !isOpen()) { var m = pending; pending = null; use(m); return; }
        all('.vd-chip input, .vd-more').forEach(function (n) { n.disabled = locked; });
      },
      /* the panel closed: back to the default view */
      reset: function () { closeList(false); panel.classList.remove('vd-back'); },
      isOpen: isOpen,
      /* Escape in the panel: the list first, then the panel */
      closeList: closeList,
      /* the session refused the voice (invalid_voice, with the voices it offers): keep only those, take the
         default and save it; returns the default's name */
      refuse: function (ids) {
        if (pending) { var m = pending; pending = null; setVoices(m.voices, m.defaultVoice, m.shown); }
        var keep = Array.isArray(ids) ? voices.filter(function (v) { return ids.indexOf(v.id) >= 0; }) : [];
        if (keep.length) setVoices(keep, defaultVoice, shown);
        pickedId = defaultVoice; touched = true; save(defaultVoice);
        closeList(false);
        renderList();
        renderChips();
        return byId(defaultVoice).name;
      }
    };
  }
  /* /aeriox:voice-picker v1 */

  /* ---------------- the panel ---------------- */
  var panel, log, statusEl, timerEl, talkBtn, talkLabel, muteBtn, resumeBtn, announceEl, closeBtn, hintEl, vpick;

  function build() {
    panel = el('section', 'vd-panel');
    panel.id = 'vd-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-labelledby', 'vd-title');
    panel.setAttribute('aria-describedby', 'vd-fine');
    panel.setAttribute('data-state', 'idle');
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
        '<fieldset class="vd-voices"><legend class="vd-legend">Voice</legend>' +
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
    pill.setAttribute('aria-controls', 'vd-panel');
    vpick = voicePicker({
      panel: panel, fieldset: panel.querySelector('.vd-voices'), hint: hintEl,
      swap: [log, panel.querySelector('.vd-foot')], mountAfter: panel.querySelector('.vd-head'),
      api: API, tenant: TENANT, storageKey: VOICE_KEY, fallback: VOICES,
      lang: /^es\b/i.test(navigator.language || '') ? 'es' : 'en', announce: announce, manifest: VOICE_MANIFEST
    });
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
    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      if (vpick.isOpen()) vpick.closeList(true); else close();
    });
  }

  function pickedVoice() { return vpick.picked(); }
  function intro() {
    log.innerHTML = '';
    addNote('Ask about the stone work Jupiter Granite Co. does, or book a demo showroom appointment, in English or Spanish. Nothing is booked for real.');
  }
  function setState(s) {
    panel.setAttribute('data-state', s);
    var locked = s === 'connecting' || s === 'live';
    if (vpick) vpick.lock(locked);
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
    vpick.reset();
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
          err.code = j && j.error;
          err.voices = j && j.voices;
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
      try {
        c.cfg = await sessionWithRetry(c, voice.id, lang, c.rate);
      } catch (e) {
        /* a voice the server doesn't offer (a list cached from before a change): keep the voices it
           names, take the default, and start the call with it, in the same tap */
        if (!(e && e.code === 'invalid_voice') || conv !== c) throw e;
        var fallbackName = vpick.refuse(e.voices);
        if (vpick.picked().id === voice.id) throw e;
        voice = vpick.picked();
        addNote('That voice isn’t available right now, so this call uses ' + fallbackName + '.');
        announce('That voice isn’t available right now, so this call uses ' + fallbackName + '.');
        c.cfg = await sessionWithRetry(c, voice.id, lang, c.rate);
      }
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
