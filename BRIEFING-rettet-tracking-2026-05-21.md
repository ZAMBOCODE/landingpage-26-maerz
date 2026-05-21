# Briefing zurück ans Dashboard: rettet.zzzlim.de Tracking-Vollausbau

**Datum:** 2026-05-21
**Status:** Client-SDK live, Backend-Endpoint offen (Sam, ~2 Tage)
**Live URL:** https://rettet.zzzlim.de · Debug: `?debug=1`

---

## 1. Was umgesetzt ist

### A · Script-Tag → echte Datei
`scripts/tracking.js` (517 LOC) ist jetzt da. Wird via `<script defer>` von jeder LP geladen — gemeinsame Datei für alle Pain-LPs (rettet, zucker, künftige). Geteilt mit dem Master-Index.

### B · 12 Event-Typen feuern automatisch

| # | Event | Trigger | Payload-Felder |
|---|---|---|---|
| 1 | `lp_view` | DOMContentLoaded | title, referrer, lang, viewport_w/h, session_first |
| 2 | `scroll_depth_25/50/75/100` | Scroll-Throttle (rAF), je 1× | percent |
| 3 | `section_view` | IO threshold 0.5, je `<section id>` 1× | section |
| 4 | `section_dwell` | beim Verlassen + `pagehide` | section, seconds |
| 5 | `video_play` / `video_progress_25/50/75` / `video_complete` | native `<video>` | video, percent |
| 6 | `lp_click` | jeder `[data-cta]` / `[data-track-cta-type]` | cta, cta_type, section, position, target, label, href |
| 7 | `kaufseite_redirect` | Outbound zu `*.zzzlim.de` | (gleicher Payload wie 6) |
| 8 | `cta_hover_dwell` | Hover ≥ 1.2s ohne Klick auf `[data-cta]` | cta, ms |
| 9 | `faq_open` | `<details>` toggle + `.faq-item` Accordion | question (max 120 chars) |
| 10 | `exit_intent` | mouseleave gen Top-Tab, Desktop only, 1× pro Session | y |
| 11 | `copy_event` | `copy`-Event (max 5× pro Session) | selection, length |
| 12 | `web_vitals` | LCP / INP / CLS / FCP / TTFB via web-vitals@4 CDN | name, value, rating, id |

### C · Meta Pixel erweitert (zusätzlich zu bestehendem `PageView`)
- `ViewContent` — feuert wenn `#produkt-info` ≥50% im Viewport
- `InitiateCheckout` — feuert mit `kaufseite_redirect`
- `AddToCart` — feuert wenn Outbound-URL `?add-to-cart=` enthält
- `Lead` — **server-side via ManyChat-Webhook** (offen, Sam)
- **`eventID` (UUID)** wird mit jedem Pixel-Call gesetzt + parallel an `/api/track` gespiegelt → ermöglicht Conversion-API-Deduplication

### D · Attribution & Identity
- **UTM 1st-touch + last-touch** persistiert in `localStorage.zzzlim_attrib`
- **Click-IDs** (`gclid`, `fbclid`, `ttclid`, `msclkid`, `mc`, `utm_id`) als **90-Tage-Cookies** + in Attribution-Objekt
- **Outbound-Link-Enrichment**: alle `<a href>` Richtung `*.zzzlim.de` bekommen automatisch UTM + Click-IDs + `lp_id` angehängt (auch dynamisch nachgerenderte Links via MutationObserver)
- **client_id**: aus `_ga`-Cookie extrahiert (GA4-Linker ist bereits über alle Subdomains konfiguriert), Fallback eigene UUID in `localStorage.zzzlim_client`
- **session_id**: 30min TTL (GA4-Standard), in `localStorage.zzzlim_session`

### E · Consent verfeinert
- `'accepted'` → alles (GA4 + Pixel + Clarity + `/api/track` mit voller Identität)
- `'rejected'` oder `null` → **nur** anonymer `/api/track`-Beacon ohne `client_id`, ohne UTMs (nur Sektion, Dwell, Viewport, LP-ID, Consent-Status)
- Banner-Text aktualisiert: „Anonyme technische Statistik (Sektionen, Scrolltiefe) ist immer aktiv, ohne Identifikation. Personalisierte Analyse-Tools (Google Analytics, Meta Pixel, Microsoft Clarity) nur mit deinem OK."

### F · Config-Decisions (User 2026-05-21)
- **GA4 per LP**: jede LP behält eigene GA4-Property-ID. rettet = `G-5T4DK6TSPE`. Dashboard filtert pro Property; SDK schickt `lp_id` als Event-Parameter zusätzlich für Cross-LP-Auswertungen.
- **reviewCount**: vereinheitlicht auf **2847+** (Shopify-Reviews aggregiert). Hero-Rating + JSON-LD `aggregateRating.reviewCount` beide gebunden. Inkonsistenz beseitigt.

### G · Endpoint
- Client postet an `POST /api/track` per `navigator.sendBeacon` (Fallback: `fetch` mit `keepalive`)
- Bei 404/Unreachable: **localStorage-Queue** (cap 50 Events, flush beim nächsten Page-Load)
- Payload-Format wie spezifiziert:
  ```json
  {
    "event": "lp_click",
    "lp_id": "rettet",
    "lp_variant": "default",
    "session_id": "uuid",
    "client_id": "uuid-or-_ga-derived",
    "utm": { "utm_source": "...", ... },
    "attrib": { "first": {...}, "last": {...}, "clickIds": {...} },
    "consent": "accepted" | "rejected" | "none",
    "ts": 1779356400000,
    "page": "/?utm_source=meta",
    "ua_hint": { "mobile": false, "platform": "Windows" },
    "...": "event-spezifische Felder"
  }
  ```

### H · Debug-Logger
- Aktivierung via `?debug=1` URL-Param **oder** `localStorage.zzzlim_debug = '1'`
- Console-Log jedes Events mit Farbcode: `[zzz] <event-name>` (burgundy) bzw. `[zzz] fbq <name>` (FB-blau)
- Global-Window-API:
  - `window.__zzzlimTracking.emit(name, props)` — manuelles Event-Feuern
  - `window.__zzzlimTracking.pixelEvent(name, params)` — manuelles Pixel-Event mit Dedup
  - `window.__zzzlimTracking.attrib()` — aktueller Attribution-State
  - `window.__zzzlimTracking.config` — Live-Config
  - `window.__zzzlimTracking.setDebug(true|false)` — Toggle persistiert
- `window.__zzzlimEvents` — In-Memory-Array aller Events seit Page-Load (für Inspektion)

---

## 2. Was offen ist — braucht Sam (Backend)

| Item | Was | Wer |
|---|---|---|
| `POST /api/track` | Supabase-Endpoint, akzeptiert JSON-Payload, persistiert in `events`-Tabelle. Bis dahin fängt Client-Queue Beacons ab. | Sam |
| Conversion API Dedup | Server-Side Pixel-Calls mit `event_id` matchen (Client-`pixel_event_id` gespiegelt) | Sam |
| ManyChat Lead-Spiegel | Webhook-Endpoint, der bei Subscribe ein `Lead`-Event Richtung Pixel CAPI + `/api/track` schickt | Sam |
| Shopify Checkout-Bridge | `client_id` (`_ga`) muss bis Bestellbestätigung tragen — GA4-Linker ist konfiguriert für `.zzzlim.de`-Subdomains, Verify durch Test-Kauf | Sam |

---

## 3. Wiederverwendbarkeit für künftige LPs

Setup pro neuer LP (z.B. `zucker.zzzlim.de`):

1. Folder `zucker/` mit eigener `index.html` (rettet/ als Vorlage)
2. Im `<head>`: eigene GA4-Property-ID einsetzen (`gtag('config','G-...')`)
3. `<body data-lp="zucker" data-lp-variant="v1">` setzen (SDK liest automatisch)
4. `<script src="scripts/tracking.js" defer>` — SDK funktioniert sofort, alle Events feuern mit `lp_id=zucker`
5. In Vercel-Middleware `middleware.js` Eintrag `'zucker.zzzlim.de': '/zucker'` ergänzen
6. Domain in Vercel anhängen + DNS-CNAME setzen → live

**Kein weiterer Tracking-Code nötig**, das SDK adaptiert sich an `data-lp`/Hostname.

---

## 4. Testing

```bash
# Lokal (vor Vercel-Build)
bunx serve . -p 8787
open http://localhost:8787/rettet/?debug=1

# Live (nach Push, ~2min Build)
open https://rettet.zzzlim.de/?debug=1
```

DevTools-Console zeigt Live-Stream. Test-Klick auf SHOP → erwartete Sequenz:
```
[zzz] lp_click       { cta: "header", target: "shop", ... }
[zzz] kaufseite_redirect ...
[zzz] fbq InitiateCheckout { eventID: "..." }
```

`window.__zzzlimTracking.attrib()` liefert Attribution-Objekt. `window.__zzzlimEvents.length` zeigt Anzahl Events seit Load.

---

## 5. Commits dieser Iteration

- `feat(tracking): zZzlim LP-Tracking-SDK v1 (scripts/tracking.js)` — `879ef6e`
- `chore(rettet): reviewCount-Quelle = 2847 (Shopify-Reviews aggregated), GA4 per LP dokumentiert`

— Ende des Briefings —
