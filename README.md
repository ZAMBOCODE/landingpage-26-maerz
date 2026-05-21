# landingpage-26-maerz

Statische Multi-LP-Repo fuer das zZzlim-Brand-System. Ein Vercel-Projekt, ein gemeinsamer Asset-Pool, viele Subdomains.

## LPs in diesem Repo

| Live-Domain | Folder | Status | Ziel-Cluster |
|---|---|---|---|
| `k2.zzzlim.de` | `/index.html` (Root) | live | Master-LP, generisch |
| `rettet.zzzlim.de` | `rettet/` | live | Pain-Cluster „Abend zerstoert Morgen" |
| `zucker.zzzlim.de` | `zucker/` | Vorlage (nicht live) | Pain-Cluster „Zucker am Abend" |

Routing pro Subdomain via [middleware.js](middleware.js) (Edge Middleware, host-based path-rewrite — `has: host`-Rewrites in vercel.json funktionieren auf reinen Static Sites nicht zuverlaessig).

## Stack

- Static HTML / CSS / JS (kein Framework)
- Vercel als Host + Edge-Middleware fuer Subdomain-Routing
- Gemeinsame Assets im Repo-Root: `media/`, `erklaer.css`, `tokens.css`, `LOGOREAL.svg`, …
- Gemeinsames i18n (`i18n.js`) + LP-spezifische Extensions (z.B. `rettet/i18n-rettet.js`)
- Gemeinsames Tracking-SDK (`scripts/tracking.js`)

Each LP folder uses `<base href="../" />` so shared assets resolve to the repo root. Anchor-Links (`#section`) werden per JS-Hijack abgefangen, sonst wuerde der `<base>`-Tag sie an die Parent-LP schicken.

## Tracking

**SDK:** [scripts/tracking.js](scripts/tracking.js) — shared LP-Tracking-SDK (12 Event-Typen, Attribution-Capture, Outbound-Enrichment, Consent-Gate, Pixel-Dedup, web-vitals).

**Embedding:** `<script src="scripts/tracking.js" defer>` im `<head>`, plus `<body data-lp="LPSLUG" data-lp-variant="default">`. Das SDK liest beides automatisch aus.

**Debug:**
```
https://rettet.zzzlim.de/?debug=1
```
DevTools-Console zeigt jeden Event live mit `[zzz] <event-name>`-Praefix. `window.__zzzlimEvents` ist der In-Memory-Stream, `window.__zzzlimTracking.attrib()` der Attribution-State.

**Backend:** Events gehen an `POST https://zzzlim-dashboard.vercel.app/api/track` (Repo `preppilot`, Skill `lp-tracking-backend`). Bis Endpoint live ist, faengt eine localStorage-Queue 404er ab (cap 50, flush beim naechsten Page-Load).

**Dashboard:** PrepPilot → Web → LP-Funnel-Panel. Pro LP einzeln filterbar via `lp_id`.

Komplettes Briefing: [BRIEFING-rettet-tracking-2026-05-21.md](BRIEFING-rettet-tracking-2026-05-21.md). Skill: [.claude/skills/lp-tracking-client/SKILL.md](.claude/skills/lp-tracking-client/SKILL.md).

## Neue LP launchen

→ [docs/lp-launch-checklist.md](docs/lp-launch-checklist.md). Kurzform:

1. `cp -r rettet/ NEUERSLUG/`
2. `<body data-lp="NEUERSLUG">` setzen, Title/Meta/JSON-LD anpassen, eigene GA4-Property eintragen
3. `middleware.js` Eintrag `'NEUERSLUG.zzzlim.de': '/NEUERSLUG'`
4. Vercel-Dashboard: Domain anhaengen + DNS-CNAME zu `cname.vercel-dns.com`
5. Push → Vercel auto-deploy
6. `?debug=1`-Smoke-Test, dann Mobile-QA durchlaufen

## Lokal entwickeln

```bash
bunx serve . -p 8787
# rettet: http://localhost:8787/rettet/
# master: http://localhost:8787/
```

## Branch-Modell

Default-Branch: `master`. Pushen auf `master` triggert sofort Production-Deploy auf alle Custom-Domains. Feature-Branches bekommen Vercel-Preview-URLs.

## Cross-Repo

- [`preppilot`](https://github.com/ZAMBOCODE/preppilot) — Dashboard + Tracking-Endpoint + Skill `lp-tracking-backend`
- Shopify Shop unter `zzzlim.de` — Outbound-Ziel aller CTAs, GA4-Linker konfiguriert
