/* ══════════════════════════════════════════════
   zZzlim Landing-Page Tracking SDK (v1)
   ══════════════════════════════════════════════
   Loads with <script src="scripts/tracking.js" defer> — shared by all LPs
   in this repo. Reads LP-context from <body data-lp> / <html data-lp-variant>
   or falls back to hostname inference.

   What it ships:
   1.  lp_view              — auto on first paint
   2.  scroll_depth         — 25 / 50 / 75 / 100 thresholds (once each)
   3.  section_view         — IO threshold 0.5, once per section id
   4.  section_dwell        — seconds in viewport on exit
   5.  video_*              — play / progress 25/50/75 / complete
   6.  lp_click             — every [data-cta] / data-track-* click
   7.  kaufseite_redirect   — outbound to zzzlim.de (own beacon, sendBeacon)
   8.  cta_hover_dwell      — hover >1.2s without click on [data-cta]
   9.  faq_open             — <details> + accessible accordion .faq-item buttons
   10. exit_intent          — mouseleave Richtung Top-Tab, once per session
   11. copy_event           — selectionchange + copy
   12. web_vitals           — LCP, INP, CLS (web-vitals@4 from CDN)

   Plus:
   • Attribution: UTM 1st/last + click-IDs (gclid/fbclid/ttclid/msclkid/mc)
     persisted in localStorage + 90-day cookie. Outbound zzzlim.de links
     auto-enriched. _ga (client_id) propagation via GA4 linker (existing).
   • Meta Pixel extensions: ViewContent (pricing in view), InitiateCheckout
     (kaufseite_redirect), AddToCart (?add-to-cart=), Lead (manychat webhook
     spiegelt server-side). event_id sent with every Pixel call for Conversion
     API deduplication.
   • Consent: respects window.__zzzlimConsent (set elsewhere). 'accepted' fires
     everything. 'rejected' / null fires only anonymous /api/track beacons
     (no client_id, no UTMs, only section + viewport).
   • Debug: ?debug=1 logs every event to console + window.__zzzlimEvents queue.
   • Endpoint: POSTs JSON to /api/track via sendBeacon when available, falls
     back to fetch keepalive. If endpoint is 404 / unreachable, events are
     queued in localStorage zzzlim_pending_events (cap 50) and flushed on
     next page load.
*/
(function(){
  'use strict';
  if (window.__zzzlimTracking) return;

  // ───────── Config ─────────
  // GA4-Strategie (User-Decision 2026-05-21): jede LP hat eigene GA4-Property.
  // Property-ID wird im HTML-Head pro LP gesetzt (rettet: G-5T4DK6TSPE).
  // Dashboard filtert pro Property; Cross-LP-Reports laufen ueber lp_id-Parameter.
  var CFG = {
    endpoint: '/api/track',
    pixelId:  '2028396997989291',
    sessionTtlMin: 30,
    cookieDays: 90,
    queueCap: 50,
    queueKey: 'zzzlim_pending_events',
    attribKey: 'zzzlim_attrib',
    sessionKey: 'zzzlim_session',
    clientKey: 'zzzlim_client',
    clickIdParams: ['gclid','fbclid','ttclid','msclkid','mc','utm_id'],
    utmParams: ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'],
    debug: /[?&]debug=1\b/.test(location.search) || localStorage.getItem('zzzlim_debug') === '1'
  };

  // ───────── Helpers ─────────
  var ls = {
    get: function(k){ try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch(e){ return null; } },
    set: function(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} },
    raw: function(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  };
  function cookieSet(name, value, days){
    try {
      var d = new Date(Date.now() + days*864e5);
      document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + d.toUTCString() + '; path=/; samesite=lax';
    } catch(e){}
  }
  function cookieGet(name){
    var m = document.cookie.match('(?:^|; )' + name.replace(/([.*+?^${}()|[\]\\])/g,'\\$1') + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : null;
  }
  function nowMs(){ return Date.now(); }
  function uuid(){
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
      var r = Math.random()*16|0, v = c==='x'? r : (r&0x3|0x8); return v.toString(16);
    });
  }
  function parseQuery(qs){
    var out = {};
    (qs || location.search).replace(/^\?/,'').split('&').filter(Boolean).forEach(function(p){
      var i = p.indexOf('='); var k = decodeURIComponent(i>=0? p.slice(0,i) : p); var v = i>=0? decodeURIComponent(p.slice(i+1)) : '';
      out[k] = v;
    });
    return out;
  }

  // ───────── LP context ─────────
  function inferLpId(){
    var b = document.body;
    // Beide Attribute akzeptieren — data-lp (canonical) + data-lp-id (legacy)
    if (b) {
      if (b.dataset.lp)   return b.dataset.lp;
      if (b.dataset.lpId) return b.dataset.lpId;
    }
    // Hostname-Fallback: erstes Sub-Domain-Segment (mude.zzzlim.de -> 'mude').
    // Ohne Whitelist, damit neue LPs ohne SDK-Edit auskommen.
    var parts = location.hostname.split('.');
    if (parts.length >= 3 && parts[0] && parts[0] !== 'www') return parts[0];
    return 'unknown';
  }
  function inferLpVariant(){
    var b = document.body;
    if (b) {
      if (b.dataset.lpVariant)   return b.dataset.lpVariant;
      if (b.dataset.lpIdVariant) return b.dataset.lpIdVariant;
    }
    return parseQuery().lp_variant || 'default';
  }
  var LP = { id: inferLpId(), variant: inferLpVariant() };

  // ───────── Identity (session + client) ─────────
  function getOrInitClientId(){
    // Prefer GA4 client_id (_ga cookie) if present, fallback to our own UUID.
    var ga = cookieGet('_ga');
    if (ga) {
      var parts = ga.split('.');
      if (parts.length >= 4) return parts.slice(2).join('.');
    }
    var own = ls.raw(CFG.clientKey);
    if (own) return own;
    own = uuid();
    try { localStorage.setItem(CFG.clientKey, own); } catch(e){}
    return own;
  }
  function getOrRotateSession(){
    var cur = ls.get(CFG.sessionKey);
    var now = nowMs();
    if (cur && (now - cur.last) < CFG.sessionTtlMin*60e3) {
      cur.last = now; ls.set(CFG.sessionKey, cur); return cur.id;
    }
    var s = { id: uuid(), start: now, last: now };
    ls.set(CFG.sessionKey, s); return s.id;
  }
  var CLIENT_ID = getOrInitClientId();
  var SESSION_ID = getOrRotateSession();

  // ───────── Attribution: 1st-touch + last-touch + click-IDs ─────────
  function captureAttribution(){
    var q = parseQuery();
    var stored = ls.get(CFG.attribKey) || { first: null, last: null, clickIds: {} };
    var touch = {};
    var hasUtm = false;
    CFG.utmParams.forEach(function(k){ if (q[k]) { touch[k] = q[k]; hasUtm = true; } });
    if (document.referrer && !touch.utm_source) {
      try { var ref = new URL(document.referrer); if (ref.host && ref.host !== location.host) touch.referrer = ref.host; } catch(e){}
    }
    if (hasUtm || touch.referrer) {
      touch.ts = nowMs();
      if (!stored.first) stored.first = touch;
      stored.last = touch;
    }
    CFG.clickIdParams.forEach(function(p){
      if (q[p]) {
        stored.clickIds[p] = q[p];
        cookieSet('zz_' + p, q[p], CFG.cookieDays);
      } else if (!stored.clickIds[p]) {
        var ck = cookieGet('zz_' + p); if (ck) stored.clickIds[p] = ck;
      }
    });
    ls.set(CFG.attribKey, stored);
    return stored;
  }
  var ATTRIB = captureAttribution();

  // Outbound-Link-Enrichment: append UTM + click-IDs to zzzlim.de links
  function enrichOutboundLinks(){
    var attribLast = ATTRIB.last || ATTRIB.first || {};
    var clickIds = ATTRIB.clickIds || {};
    document.querySelectorAll('a[href]').forEach(function(a){
      var href = a.getAttribute('href') || '';
      if (!/^https?:\/\//i.test(href)) return;
      try {
        var u = new URL(href);
        if (!/(^|\.)zzzlim\.de$/i.test(u.hostname)) return;
        var modified = false;
        CFG.utmParams.forEach(function(k){
          if (!u.searchParams.has(k) && attribLast[k]) { u.searchParams.set(k, attribLast[k]); modified = true; }
        });
        Object.keys(clickIds).forEach(function(k){
          if (!u.searchParams.has(k) && clickIds[k]) { u.searchParams.set(k, clickIds[k]); modified = true; }
        });
        if (!u.searchParams.has('lp_id')) { u.searchParams.set('lp_id', LP.id); modified = true; }
        if (modified) a.setAttribute('href', u.toString());
      } catch(e){}
    });
  }

  // ───────── Consent ─────────
  function consentLevel(){
    // 'accepted' | 'rejected' | null
    return localStorage.getItem('cookie-consent') || null;
  }

  // ───────── Beacon / Queue ─────────
  function buildPayload(event, props){
    props = props || {};
    var consent = consentLevel();
    var anonymous = consent !== 'accepted';
    var base = {
      event: event,
      lp_id: LP.id,
      lp_variant: LP.variant,
      session_id: anonymous ? null : SESSION_ID,
      client_id:  anonymous ? null : CLIENT_ID,
      utm:        anonymous ? null : (ATTRIB.last || ATTRIB.first || null),
      attrib:     anonymous ? null : { first: ATTRIB.first, last: ATTRIB.last, clickIds: ATTRIB.clickIds },
      consent: consent || 'none',
      ts: nowMs(),
      page: location.pathname + location.search,
      ua_hint: navigator.userAgentData ? {
        mobile: navigator.userAgentData.mobile,
        platform: navigator.userAgentData.platform
      } : { ua: (navigator.userAgent || '').slice(0,200) }
    };
    Object.keys(props).forEach(function(k){ base[k] = props[k]; });
    return base;
  }

  function postBeacon(payload){
    var body = JSON.stringify(payload);
    var url = CFG.endpoint;
    var ok = false;
    try {
      if (navigator.sendBeacon) {
        ok = navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
      }
    } catch(e){}
    if (!ok) {
      try {
        fetch(url, { method:'POST', body:body, headers:{'Content-Type':'application/json'}, keepalive:true, credentials:'omit' })
          .catch(function(){ queueEvent(payload); });
      } catch(e){ queueEvent(payload); }
    }
  }

  function queueEvent(payload){
    var q = ls.get(CFG.queueKey) || [];
    if (q.length >= CFG.queueCap) q.shift();
    q.push(payload);
    ls.set(CFG.queueKey, q);
  }

  function flushQueue(){
    var q = ls.get(CFG.queueKey) || [];
    if (!q.length) return;
    ls.set(CFG.queueKey, []);
    q.forEach(postBeacon);
  }

  // ───────── Public emit ─────────
  window.__zzzlimEvents = window.__zzzlimEvents || [];
  function emit(event, props){
    var payload = buildPayload(event, props);
    window.__zzzlimEvents.push(payload);
    if (CFG.debug) console.log('%c[zzz] ' + event, 'color:#851330;font-weight:600', payload);

    postBeacon(payload);

    // Forward to GA4 if loaded
    if (typeof window.gtag === 'function' && consentLevel() === 'accepted') {
      var gaParams = { lp_id: LP.id, lp_variant: LP.variant };
      Object.keys(props || {}).forEach(function(k){
        // GA4 param limits: 25 chars name, 100 chars value, primitives only
        var v = props[k];
        if (v && typeof v === 'object') return;
        var key = k.slice(0,25).replace(/[^A-Za-z0-9_]/g,'_');
        gaParams[key] = v;
      });
      try { window.gtag('event', event, gaParams); } catch(e){}
    }
  }

  // ───────── Pixel (Meta) wrappers ─────────
  function pixelEvent(name, params){
    if (consentLevel() !== 'accepted' || typeof window.fbq !== 'function') return;
    var eventId = uuid();
    try {
      window.fbq('track', name, params || {}, { eventID: eventId });
    } catch(e){}
    // Mirror to our backend for Conversion API dedup (server matches eventID)
    postBeacon(buildPayload('pixel_' + name.toLowerCase(), { pixel_event_id: eventId, params: params || {} }));
    if (CFG.debug) console.log('%c[zzz] fbq ' + name, 'color:#4267B2', { eventID: eventId, params: params });
  }

  // ───────── Event implementations ─────────

  // 1. lp_view
  function trackLpView(){
    emit('lp_view', {
      title: document.title.slice(0,120),
      referrer: (document.referrer || '').slice(0,200),
      lang: document.documentElement.lang || null,
      viewport_w: window.innerWidth, viewport_h: window.innerHeight,
      session_first: !!(ls.get(CFG.sessionKey) || {}).start && ((ls.get(CFG.sessionKey).last - ls.get(CFG.sessionKey).start) < 1000)
    });
  }

  // 2. scroll_depth
  function initScrollDepth(){
    var thresholds = [25,50,75,100];
    var hit = {};
    function check(){
      var sh = document.documentElement.scrollHeight - window.innerHeight;
      if (sh <= 0) return;
      var pct = Math.round((window.scrollY / sh) * 100);
      thresholds.forEach(function(t){
        if (!hit[t] && pct >= t) { hit[t] = true; emit('scroll_depth_' + t, { percent: t }); }
      });
    }
    var ticking = false;
    window.addEventListener('scroll', function(){
      if (!ticking) { ticking = true; requestAnimationFrame(function(){ check(); ticking = false; }); }
    }, { passive: true });
    check();
  }

  // 3 + 4. section_view + section_dwell
  function initSectionTracking(){
    if (!('IntersectionObserver' in window)) return;
    var seen = {};
    var dwellStart = {};
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        var id = e.target.id; if (!id) return;
        if (e.isIntersecting && e.intersectionRatio >= 0.5) {
          if (!seen[id]) { seen[id] = true; emit('section_view', { section: id }); }
          dwellStart[id] = nowMs();
        } else if (dwellStart[id]) {
          var secs = Math.round((nowMs() - dwellStart[id]) / 1000);
          if (secs >= 1) emit('section_dwell', { section: id, seconds: secs });
          dwellStart[id] = 0;
        }
      });
    }, { threshold: [0, 0.5, 1] });
    document.querySelectorAll('main > section[id], section[id]').forEach(function(s){ io.observe(s); });
    // Flush remaining dwells on unload
    window.addEventListener('pagehide', function(){
      Object.keys(dwellStart).forEach(function(id){
        if (!dwellStart[id]) return;
        var secs = Math.round((nowMs() - dwellStart[id]) / 1000);
        if (secs >= 1) emit('section_dwell', { section: id, seconds: secs });
      });
    });

    // 3b. Pixel ViewContent when #produkt-info or .produkt-section-cta enters viewport
    var pricing = document.querySelector('#produkt-info, .produkt-section-cta');
    if (pricing) {
      var pcIo = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (e.isIntersecting && e.intersectionRatio >= 0.5) {
            pixelEvent('ViewContent', { content_name: 'zZzlim Monatskur 30 Kapseln', content_type:'product', content_ids:['zzzlim-monatskur-30'], value: 49.95, currency:'EUR' });
            pcIo.disconnect();
          }
        });
      }, { threshold: [0.5] });
      pcIo.observe(pricing);
    }
  }

  // 5. video tracking (any <video> + youtube iframe is out-of-scope; native only)
  function initVideoTracking(){
    document.querySelectorAll('video').forEach(function(v){
      var id = v.id || v.getAttribute('data-video-id') || v.currentSrc || 'video';
      var played = false, q = { 25:false, 50:false, 75:false };
      v.addEventListener('play', function(){
        if (played) return; played = true; emit('video_play', { video: id });
      });
      v.addEventListener('timeupdate', function(){
        if (!v.duration) return;
        var pct = v.currentTime / v.duration;
        [25,50,75].forEach(function(t){
          if (!q[t] && pct*100 >= t) { q[t] = true; emit('video_progress_' + t, { video: id, percent: t }); }
        });
      });
      v.addEventListener('ended', function(){ emit('video_complete', { video: id }); });
    });
  }

  // 6. lp_click — every [data-cta] / [data-track-cta-type]
  // 7. kaufseite_redirect — outbound to zzzlim.de
  // 8. cta_hover_dwell — hover >1.2s no click
  function initClickTracking(){
    var hoverTimers = new WeakMap();
    var clicked = new WeakSet();

    document.addEventListener('click', function(ev){
      var el = ev.target && ev.target.closest && ev.target.closest('a[data-cta], button[data-cta], a[data-track-cta-type], button[data-track-cta-type]');
      if (!el) return;
      clicked.add(el);
      var ds = el.dataset || {};
      var href = el.getAttribute && el.getAttribute('href') || null;
      var isOutboundShop = false;
      if (href) {
        try {
          var u = new URL(href, location.href);
          if (/(^|\.)zzzlim\.de$/i.test(u.hostname)) isOutboundShop = true;
        } catch(e){}
      }
      var payload = {
        cta: ds.cta || null,
        cta_type: ds.trackCtaType || null,
        section: ds.trackSection || null,
        position: ds.trackPosition || null,
        target: ds.trackTarget || null,
        label: ds.trackLabel || null,
        href: href
      };
      emit('lp_click', payload);
      if (isOutboundShop) {
        emit('kaufseite_redirect', payload);
        pixelEvent('InitiateCheckout', { content_ids:['zzzlim-monatskur-30'], value: 49.95, currency:'EUR' });
        if (href && /[?&]add[-_]to[-_]cart=/i.test(href)) {
          pixelEvent('AddToCart', { content_ids:['zzzlim-monatskur-30'], value: 49.95, currency:'EUR' });
        }
      }
    }, true);

    document.addEventListener('mouseover', function(ev){
      var el = ev.target && ev.target.closest && ev.target.closest('[data-cta]');
      if (!el || hoverTimers.has(el)) return;
      var t = setTimeout(function(){
        if (!clicked.has(el)) emit('cta_hover_dwell', { cta: el.dataset.cta || null, ms: 1200 });
      }, 1200);
      hoverTimers.set(el, t);
    });
    document.addEventListener('mouseout', function(ev){
      var el = ev.target && ev.target.closest && ev.target.closest('[data-cta]');
      if (!el) return;
      var t = hoverTimers.get(el);
      if (t) { clearTimeout(t); hoverTimers.delete(el); }
    });
  }

  // 9. faq_open — <details> + .faq-item button[aria-expanded] flips
  function initFaqTracking(){
    document.querySelectorAll('details').forEach(function(d){
      d.addEventListener('toggle', function(){
        if (d.open) {
          var s = d.querySelector('summary'); var q = s ? s.textContent.trim().slice(0,120) : null;
          emit('faq_open', { question: q });
        }
      });
    });
    document.querySelectorAll('.faq-question, .faq-item button').forEach(function(btn){
      btn.addEventListener('click', function(){
        // Defer to next frame so any aria-expanded toggle in app code has run
        setTimeout(function(){
          var item = btn.closest('.faq-item');
          var isOpen = (item && item.classList.contains('is-open')) || btn.getAttribute('aria-expanded') === 'true';
          if (isOpen) {
            var q = btn.querySelector('span') ? btn.querySelector('span').textContent.trim().slice(0,120) : btn.textContent.trim().slice(0,120);
            emit('faq_open', { question: q });
          }
        }, 16);
      });
    });
  }

  // 10. exit_intent — mouseleave gen top
  function initExitIntent(){
    if (sessionStorage.getItem('zz_exit_fired') === '1') return;
    if (window.matchMedia && window.matchMedia('(pointer:coarse)').matches) return; // skip mobile
    document.documentElement.addEventListener('mouseleave', function(ev){
      if (ev.clientY > 8) return;
      sessionStorage.setItem('zz_exit_fired', '1');
      emit('exit_intent', { y: ev.clientY });
    });
  }

  // 11. copy_event
  function initCopyTracking(){
    var fired = 0;
    document.addEventListener('copy', function(){
      var sel = (window.getSelection && window.getSelection().toString() || '').slice(0,200);
      if (!sel || ++fired > 5) return;
      emit('copy_event', { selection: sel, length: sel.length });
    });
  }

  // 13. consent_banner — view + accept + reject + ignore (page-hide ohne Wahl)
  function initConsentTracking(){
    var banner = document.getElementById('cookie-consent');
    if (!banner || sessionStorage.getItem('zz_consent_view_fired') === '1') {
      // Banner-View nur 1x pro Session — danach nur noch Accept/Reject-Klicks tracken
    } else {
      // Erst wenn Banner wirklich sichtbar wird (style.display != 'none')
      var checkVisible = function(){
        if (banner.offsetParent !== null && getComputedStyle(banner).display !== 'none') {
          sessionStorage.setItem('zz_consent_view_fired', '1');
          emit('consent_banner_view', { current: consentLevel() || 'none' });
          return true;
        }
        return false;
      };
      if (!checkVisible()) {
        // Banner-Erscheinung mit setTimeout-Delay (erklaer.js Pattern)
        var mo = new MutationObserver(function(){ if (checkVisible()) mo.disconnect(); });
        mo.observe(banner, { attributes: true, attributeFilter: ['style', 'class'] });
      }
    }
    var accept = document.getElementById('cookie-accept');
    var reject = document.getElementById('cookie-reject');
    if (accept) accept.addEventListener('click', function(){ emit('consent_accept', {}); }, { capture: true });
    if (reject) reject.addEventListener('click', function(){ emit('consent_reject', {}); }, { capture: true });
    // Ignored = User verlaesst Seite ohne aktive Wahl
    window.addEventListener('pagehide', function(){
      if (consentLevel() == null && sessionStorage.getItem('zz_consent_view_fired') === '1') {
        emit('consent_ignored', {});
      }
    });
  }

  // 12. web_vitals via CDN — bei consent=rejected nicht laden (DSGVO-strict)
  function initWebVitals(){
    if (consentLevel() === 'rejected') return;
    if (window.__zzzlimWebVitalsLoaded) return;
    window.__zzzlimWebVitalsLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://unpkg.com/web-vitals@4/dist/web-vitals.iife.js';
    s.async = true;
    s.onload = function(){
      if (!window.webVitals) return;
      var handler = function(metric){
        emit('web_vitals', {
          name: metric.name, value: Math.round(metric.value),
          rating: metric.rating || null, id: metric.id
        });
      };
      try { webVitals.onLCP(handler); webVitals.onINP(handler); webVitals.onCLS(handler);
            if (webVitals.onFCP) webVitals.onFCP(handler);
            if (webVitals.onTTFB) webVitals.onTTFB(handler); } catch(e){}
    };
    s.onerror = function(){ if (CFG.debug) console.warn('[zzz] web-vitals load failed'); };
    document.head.appendChild(s);
  }

  // ───────── Bootstrap ─────────
  function boot(){
    enrichOutboundLinks();
    flushQueue();
    trackLpView();
    initScrollDepth();
    initSectionTracking();
    initVideoTracking();
    initClickTracking();
    initFaqTracking();
    initExitIntent();
    initCopyTracking();
    initConsentTracking();
    initWebVitals();

    // Re-enrich after any late-rendered DOM (mobile menu, modal CTAs)
    new MutationObserver(function(){ enrichOutboundLinks(); })
      .observe(document.body, { childList:true, subtree:true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once:true });
  } else {
    boot();
  }

  // Expose for debug / manual fires
  window.__zzzlimTracking = {
    emit: emit,
    pixelEvent: pixelEvent,
    attrib: function(){ return ATTRIB; },
    config: CFG,
    flushQueue: flushQueue,
    setDebug: function(on){
      CFG.debug = !!on;
      try { localStorage.setItem('zzzlim_debug', on ? '1' : '0'); } catch(e){}
    }
  };

  if (CFG.debug) {
    console.log('%c[zzz] tracking SDK loaded', 'background:#851330;color:#fff;padding:2px 6px;border-radius:3px', {
      lp: LP, client: CLIENT_ID, session: SESSION_ID, attrib: ATTRIB, consent: consentLevel()
    });
  }
})();
