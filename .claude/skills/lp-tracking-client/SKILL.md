---
name: lp-tracking-client
description: When the user wants to add a new zZzlim LP (e.g. zucker.zzzlim.de, mude.zzzlim.de), wire up a new HTML-template with tracking, change events in scripts/tracking.js, add an A/B-Variant, adjust the consent banner, add a Meta-Pixel-Event, debug events that don't reach the dashboard, or set up Outbound-Enrichment for new Shopify-URLs. Triggers — "neue LP fuer Cluster X bauen", "tracking auf neuer LP einbinden", "Event-Typ erweitern", "A/B-Test einrichten", "Pixel-Event hinzufuegen", "Consent-Banner anpassen", "tracking debug LP-Seite", "Outbound-Enrichment". For the dashboard/backend side use companion skill `lp-tracking-backend` in the preppilot repo.
metadata:
  version: 1.0.0
---

# LP-Tracking-Client (LP-Builder-Seite)

Du bist der Custodian von `scripts/tracking.js` und der HTML-Embedding-Logik aller zZzlim-LPs. Du baust neue LPs aus der Vorlage `rettet/`, setzt Tracking-Tags, integrierst Meta-Pixel-Custom-Events und debuggst, wenn Beacons nicht ankommen.

Das Dashboard-Backend (`/api/track`, `lp_events`, `lp_sessions`, LP-Funnel-Panel) gehoert dir NICHT. Es liegt im Repo `preppilot` mit dem Skill `lp-tracking-backend`. Beide Seiten teilen sich nur das Payload-Format.

## Architektur (immer im Kopf)

```
LP-HTML       scripts/tracking.js   Vercel-Edge   Supabase   PrepPilot-UI
─────         ───────────────────   ───────────   ────────   ────────────
<body          IO/Scroll/Click       POST          INSERT     Dashboard
 data-lp=x>    -> Beacons            /api/track    lp_events  Web -> LP-Funnel
                                                   lp_sessions
```

## Schnittstelle: Payload-Format an /api/track

```json
{
  "event": "lp_click",
  "lp_id": "rettet",
  "lp_variant": "default",
  "session_id": "uuid",
  "client_id": "uuid-or-_ga-derived",
  "consent": "accepted" | "rejected" | "none",
  "page": "/?utm_source=meta",
  "ts": 1779356400000,
  "utm": { "utm_source": "...", "utm_medium": "...", "utm_campaign": "..." },
  "attrib": {
    "first": { /* 1st-touch utm */ },
    "last": { /* last-touch utm */ },
    "clickIds": { "fbclid": "...", "gclid": "...", "ttclid": "...", "msclkid": "...", "mc": "..." }
  },
  "ua_hint": { "mobile": false, "platform": "Win32", "viewport_w": 1440, "viewport_h": 900 },
  "pixel_event_id": "uuid-for-meta-capi-dedup",
  "section": "hero", "cta": "header-shop", "cta_type": "primary",
  "position": "above_fold", "target": "shop", "label": "header-shop-ausprobieren",
  "href": "https://zzzlim.de/...",
  "value": 50,
  "payload": { /* event-spezifische Extras, geht in jsonb */ }
}
```

**Pflichtfelder:** `event`, `lp_id`. Alles andere optional. Endpoint rejected 400 sonst.

## 12 Event-Typen (Stand 2026-05-21)

| # | Event | Trigger | Pflicht-Payload |
|---|---|---|---|
| 1 | lp_view | DOMContentLoaded | session_first |
| 2 | scroll_depth_25/50/75/100 | Scroll-Throttle, je 1x | value (percent) |
| 3 | section_view | IO threshold 0.5 | section |
| 4 | section_dwell | Verlassen + pagehide | section, value (sec) |
| 5 | video_play / video_progress_25/50/75 / video_complete | native video | payload.video, value (percent) |
| 6 | lp_click | [data-cta] / [data-track-cta-type] | cta, section, target, href |
| 7 | kaufseite_redirect | Outbound zu *.zzzlim.de | href, target |
| 8 | cta_hover_dwell | Hover >= 1.2s ohne Klick | cta, value (ms) |
| 9 | faq_open | <details> toggle + .faq-item | payload.question |
| 10 | exit_intent | mouseleave top, 1x/Session | y |
| 11 | copy_event | copy-Event, cap 5/session | selection, length |
| 12 | web_vitals | web-vitals@4 | payload.name, value, payload.rating |

## Hard-Rules

- **Cookie-Consent ist Pflicht.** Anonyme Beacons (consent=rejected/none) DUERFEN gesendet werden, ABER nur ohne client_id und ohne utm/clickIds. Section-Dwell + Scroll OK.
- **Outbound-Enrichment**: utm + clickIds + lp_id MUSS an Links zu *.zzzlim.de angehaengt werden, sonst bricht Shopify-Attribution. MutationObserver fuer dynamisch nachgerenderte Links nutzen.
- **eventID-Spiegelung**: Meta-Pixel-Event + /api/track muss IMMER mit identischer `pixel_event_id` (UUID) gehen, sonst keine CAPI-Deduplication.
- **Keine eigene client_id wenn _ga existiert**: GA4-Linker ist auf *.zzzlim.de konfiguriert, eigene UUID ist Fallback.
- **lp_id aus `<body data-lp="">` lesen**, NICHT hardcoden — das gleiche Skript laeuft auf allen LPs.

## Workflows

### 1. Neue LP bauen (Vorlage rettet)

1. `cp -r rettet/ NEUERSLUG/` (oder eigene Vorlage)
2. In NEUERSLUG/index.html:
   - `<base href="../" />` lassen
   - `<title>` + `<meta>` + JSON-LD anpassen
   - GA4-Property-ID + Pixel-ID je nach LP eigene
   - `<body data-lp="NEUERSLUG" data-lp-variant="default">`
3. In `middleware.js` Eintrag: `'neuerslug.zzzlim.de': '/NEUERSLUG'`
4. Im Vercel-Dashboard Domain `neuerslug.zzzlim.de` zum Projekt + DNS-CNAME setzen
5. Push -> Vercel auto-deploy
6. Mit `?debug=1` testen: Console muss `[zzz] lp_view ...` mit `lp_id: "NEUERSLUG"` zeigen
7. PrepPilot-Skill briefen: `KNOWN_LPS`-Array in `lp-funnel-panel.tsx` ergaenzen

### 2. Event-Typ aendern (z.B. neuer `pricing_toggle`)

1. In `scripts/tracking.js` neuen Event-Emitter ergaenzen:
   ```js
   document.querySelectorAll('[data-bundle-toggle]').forEach(el => {
     el.addEventListener('click', (e) => {
       emit('pricing_toggle', { bundle: el.dataset.bundle });
     });
   });
   ```
2. **PARALLEL** den Backend-Skill (`lp-tracking-backend` im preppilot-Repo) anstossen → der ergaenzt `api/track.ts` + `lp-funnel.ts` + UI
3. Auf rettet.zzzlim.de testen mit `?debug=1` bevor live
4. Sobald 1 Tag Live-Daten da: Im PrepPilot-Dashboard pruefen ob neue Tile renderet

### 3. A/B-Variant einrichten

1. `<body data-lp="rettet" data-lp-variant="v2-bold-hero">` ODER per Cookie aus URL-Param `?v=2`
2. SDK liest `data-lp-variant` automatisch und schickt es mit jedem Event
3. Backend hat `lp_variant` als eigene Spalte in `lp_sessions` → im Dashboard nach Variant filtern moeglich
4. Variant-Cookie 7 Tage TTL setzen (consistency)

### 4. Consent-Banner anpassen

Aktueller Wortlaut: „Anonyme technische Statistik ... ist immer aktiv, ohne Identifikation. Personalisierte Analyse-Tools nur mit OK."

Aenderungs-Hard-Rules:
- „Akzeptieren" + „Ablehnen" muessen gleich prominent sein (DSGVO)
- Detail-Tools (Clarity, GA4, Pixel) namentlich nennen
- Link zur Datenschutzerklaerung
- Default = abgelehnt (Banner zeigt sich, bis User aktiv waehlt)

### 5. Meta-Pixel-Custom-Event hinzufuegen (z.B. AddPaymentInfo)

1. In `scripts/tracking.js` Trigger ergaenzen, dann:
   ```js
   const eventID = crypto.randomUUID();
   fbq('track', 'AddPaymentInfo', { value: 49.95, currency: 'EUR' }, { eventID });
   emit('add_payment_info', { pixel_event_id: eventID });
   ```
2. PrepPilot-Side: optional in `api/track.ts` auf `pixel_event_id` reagieren (Server-Side-Spiegel via CAPI) — das ist Sam-Backend-Item.

### 6. Debug "Events landen nicht"

Schritt-fuer-Schritt:

1. `?debug=1` + DevTools-Console — kommen die `[zzz] ...` Logs?
2. Network-Tab: `/api/track`-Requests, Status-Code?
   - **0/network error**: CORS oder Endpoint unreachable. CORS-Regex im PrepPilot-Endpoint pruefen lassen.
   - **400**: Pflichtfelder fehlen. `event` + `lp_id` da?
   - **202 supabase not configured**: Backend-Env-Var fehlt. Sam.
   - **500 insert failed**: Backend-Skill konsultieren.
3. `window.__zzzlimEvents` — Events in Memory? Wenn ja, aber kein Netzwerk-Call, dann Beacon-Throttle pruefen.
4. localStorage-Queue: `localStorage.zzzlim_pending_events` — sollte leer sein wenn alles ankommt. Bei vollem Queue: Endpoint hat geantwortet, aber nicht 200.
5. Beim PrepPilot-Backend-Skill verifyieren lassen (`verify-lp-tracking.ts`).

### 7. Wenn der Builder die LP zu Wireframe-Phase zurueckkippt

NEUE LP wird oft erst spaeter mit Tracking versehen. Beim Final-Polish-Schritt:
- [ ] `scripts/tracking.js` im `<head>` als defer eingebunden
- [ ] `<body data-lp="...">` gesetzt
- [ ] alle CTAs haben `data-cta="..."` + `data-track-section=".."` + `data-track-position="..."` + `data-track-target="..."`
- [ ] alle FAQ-Items als `<details>` ODER `.faq-item` markiert
- [ ] Video-Elemente sind echte `<video>` (nicht YouTube-iframe, sonst kein Event)
- [ ] Sticky-Mobile-CTA hat `data-cta="sticky"`
- [ ] Outbound-Links zu zzzlim.de werden NICHT manuell utm-getaggt (SDK macht es automatisch)

## Cross-Refs

- Backend-Skill: `preppilot/.claude/skills/lp-tracking-backend/SKILL.md`
- SDK-Source: `scripts/tracking.js` (im selben Repo)
- LP-Vorlage: `rettet/index.html`
- Vercel-Routing: `middleware.js`
- LP-Launch-Checkliste: `docs/lp-launch-checklist.md`
- Briefing-Quelle: `BRIEFING-rettet-tracking-2026-05-21.md`

## Wenn du das Payload-Format aenderst

BEIDE Seiten gleichzeitig anfassen, sonst landen Events in `/dev/null` (Endpoint rejected 400) oder Dashboard rendert nichts:

| File | Repo | Owner |
|---|---|---|
| `scripts/tracking.js` | landingpage-26-maerz | **du** |
| `api/track.ts` | preppilot | lp-tracking-backend (Sam) |
| `src/lib/server/lp-funnel.ts` | preppilot | lp-tracking-backend (Sam) |
| `src/components/dashboard/web/lp-funnel-panel.tsx` | preppilot | lp-tracking-backend (Sam) |

Cross-Ref ist absichtlich in beiden Skill-Bodys gespiegelt — bleibt damit lebendig.
