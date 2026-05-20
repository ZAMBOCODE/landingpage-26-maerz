// ═══════════════════════════════════════════════════════════════════
// zZzlim® LP Tracking — Briefing 2026-05-20 Sektion D
// ═══════════════════════════════════════════════════════════════════
// Liest data-track-* Attribute auf jedem Element und feuert Events an:
//   - GA4 (gtag)        → 'lp_click' Event mit allen track-Werten
//   - Clarity (clarity) → 'lp_click_<section>_<target>' Custom-Event
//   - Optional: /api/track Beacon (deaktiviert by default, siehe BEACON_ENDPOINT)
//
// Pflicht-Events (Briefing D.3):
//   - lp_view (Page-Load)
//   - scroll_depth_25/50/75/100
//   - kaufseite_redirect (LP → offizielle Kaufseite, groesster Drop-Off-Punkt)
// ═══════════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ─── Config ────────────────────────────────────────────────────
    var LP_ID = (document.body && document.body.dataset && document.body.dataset.lpId)
        || 'rettet';
    var SHOP_HOSTNAME_MATCH = /zzzlim\.de\/products\//i;
    var BEACON_ENDPOINT = null; // Bei Bedarf '/api/track' setzen (preppilot-Dashboard)
    var DEBUG = /[?&]track-debug=1/.test(location.search);

    function log() {
        if (!DEBUG) return;
        try { console.log.apply(console, ['[track]'].concat([].slice.call(arguments))); } catch (e) {}
    }

    // ─── Event-Senders ─────────────────────────────────────────────
    function sendGA4(eventName, params) {
        try {
            if (typeof window.gtag === 'function') {
                window.gtag('event', eventName, params || {});
                log('ga4', eventName, params);
            }
        } catch (e) { log('ga4 err', e); }
    }

    function sendClarity(eventName) {
        try {
            if (typeof window.clarity === 'function') {
                window.clarity('event', eventName);
                log('clarity', eventName);
            }
        } catch (e) { log('clarity err', e); }
    }

    function sendBeacon(payload) {
        if (!BEACON_ENDPOINT) return;
        try {
            var body = JSON.stringify(payload);
            if (navigator.sendBeacon) {
                navigator.sendBeacon(BEACON_ENDPOINT, body);
            } else {
                fetch(BEACON_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: body,
                    keepalive: true,
                });
            }
            log('beacon', payload);
        } catch (e) { log('beacon err', e); }
    }

    // ─── Helpers ───────────────────────────────────────────────────
    function readTrackAttrs(el) {
        // Falls Click auf inner-Element passiert, suche das naechste Element mit data-track-lp
        var node = el;
        while (node && node !== document) {
            if (node.dataset && node.dataset.trackLp) break;
            node = node.parentElement;
        }
        if (!node || node === document) return null;
        var d = node.dataset;
        return {
            lp_id: d.trackLp || LP_ID,
            section: d.trackSection || 'unknown',
            cta_type: d.trackCtaType || 'unknown',
            position: d.trackPosition || 'unknown',
            target: d.trackTarget || 'unknown',
            label: d.trackLabel || 'unlabeled',
            href: node.getAttribute('href') || null,
            tag: node.tagName ? node.tagName.toLowerCase() : null,
        };
    }

    function isShopRedirect(href) {
        if (!href) return false;
        return SHOP_HOSTNAME_MATCH.test(href);
    }

    // ─── lp_view (Page-Load) ───────────────────────────────────────
    function fireLpView() {
        var params = {
            lp_id: LP_ID,
            referrer: document.referrer || '',
            path: location.pathname,
        };
        sendGA4('lp_view', params);
        sendClarity('lp_view_' + LP_ID);
        sendBeacon({ event: 'lp_view', ts: Date.now(), data: params });
    }

    // ─── Click-Handler (delegiert) ─────────────────────────────────
    function onClickAnywhere(ev) {
        var attrs = readTrackAttrs(ev.target);
        if (!attrs) return;

        var clickParams = {
            lp_id: attrs.lp_id,
            section: attrs.section,
            cta_type: attrs.cta_type,
            position: attrs.position,
            target: attrs.target,
            label: attrs.label,
        };

        sendGA4('lp_click', clickParams);
        sendClarity('lp_click_' + attrs.section + '_' + attrs.target);
        sendBeacon({ event: 'lp_click', ts: Date.now(), data: clickParams });

        // Pflicht-Event: kaufseite_redirect (Briefing D.3)
        if (isShopRedirect(attrs.href) || attrs.target === 'shop') {
            var redirectParams = Object.assign({}, clickParams, {
                href: attrs.href || '(missing)',
            });
            sendGA4('kaufseite_redirect', redirectParams);
            sendClarity('kaufseite_redirect_' + attrs.section);
            sendBeacon({ event: 'kaufseite_redirect', ts: Date.now(), data: redirectParams });
        }
    }

    // ─── Scroll-Depth-Tracker (25/50/75/100) ───────────────────────
    function initScrollDepth() {
        var hit = { 25: false, 50: false, 75: false, 100: false };
        function check() {
            var doc = document.documentElement;
            var scrollTop = window.pageYOffset || doc.scrollTop;
            var viewport = window.innerHeight || doc.clientHeight;
            var total = doc.scrollHeight - viewport;
            if (total <= 0) return;
            var pct = (scrollTop / total) * 100;
            [25, 50, 75, 100].forEach(function (mark) {
                if (!hit[mark] && pct >= mark) {
                    hit[mark] = true;
                    var ev = 'scroll_depth_' + mark;
                    sendGA4(ev, { lp_id: LP_ID });
                    sendClarity(ev + '_' + LP_ID);
                    sendBeacon({ event: ev, ts: Date.now(), data: { lp_id: LP_ID } });
                }
            });
        }
        var ticking = false;
        window.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                check();
                ticking = false;
            });
        }, { passive: true });
    }

    // ─── Init ──────────────────────────────────────────────────────
    function init() {
        // lp_view sofort beim Page-Load
        fireLpView();

        // Click-Delegation auf body (capturing falls click vor anderen Handlern feuern soll)
        document.addEventListener('click', onClickAnywhere, true);

        // Scroll-Depth
        initScrollDepth();

        // Debug-Hilfe: alle data-track-lp Elemente listen
        if (DEBUG) {
            var nodes = document.querySelectorAll('[data-track-lp]');
            log('registered', nodes.length, 'elements');
            nodes.forEach(function (n, i) {
                log(i, n.dataset.trackLabel || '(unlabeled)', n);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
