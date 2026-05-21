# CLAUDE.md — landingpage-26-maerz

Anweisungen + Architektur-Skizze fuer Claude-Sessions in diesem Repo.

## Was dieses Repo ist

Statische Multi-LP-Plattform fuer das zZzlim-Brand-System. Ein Vercel-Projekt, ein gemeinsamer Asset-Pool, mehrere Custom-Subdomains. Eine LP = ein Ordner im Repo-Root, gemappt auf eine Subdomain via Edge-Middleware.

Aktive LPs:

| Domain | Folder | Branding | Status |
|---|---|---|---|
| `k2.zzzlim.de` | `index.html` (Root) | Master-LP, generisch | live |
| `rettet.zzzlim.de` | `rettet/` | Pain „Abend zerstoert Morgen" | live |
| `zucker.zzzlim.de` | `zucker/` | Pain „Zucker am Abend" | Template, nicht live |

## Stack-Constraints

- **Statisches HTML/CSS/JS.** Kein Framework. Kein Build-Step (noch nicht). Was du schreibst landet 1:1 auf der CDN.
- **Vercel als Host.** Custom-Domains pro LP via `middleware.js`. `vercel.json` ist absichtlich minimal — `has: host`-Rewrites funktionieren auf reinen Static Sites nicht zuverlaessig, deshalb Edge-Middleware.
- **Shared Assets** im Repo-Root: `media/`, `erklaer.css`, `tokens.css`, `LOGOREAL.svg`, `i18n.js`, `scripts/tracking.js`. Jede LP-`index.html` setzt `<base href="../" />`, damit relative Pfade auf den Repo-Root zeigen.
- **Anchor-Hijack:** Wegen des `<base>`-Tags muessen In-Page-Anker (`#section`) per JS abgefangen werden — sonst springt der Browser zur Parent-LP. Pattern siehe `rettet/index.html` (Inline-Script am Body-Ende).
- **Branch-Modell:** Default-Branch `master`. Push auf master = sofortiger Production-Deploy auf alle Custom-Domains. Feature-Branches kriegen Vercel-Preview-URLs.

## Tracking — gehoert dem Skill

Tracking-Aenderungen NICHT inline machen. Es gibt einen dedizierten Skill:

→ [`lp-tracking-client`](.claude/skills/lp-tracking-client/SKILL.md)

Aufgaben fuer den Skill: neue LP launchen, Event-Typen erweitern, A/B-Variants, Pixel-Custom-Events, Consent-Banner anpassen, Outbound-Enrichment, Tracking-Debug. Pendant fuer das Dashboard-Backend ist `lp-tracking-backend` im Repo `preppilot`.

Cross-Repo-Schnittstelle ist das Payload-Format an `POST https://zzzlim-dashboard.vercel.app/api/track`. Aenderungen am Format → **beide Skills gleichzeitig** anfassen.

## Architektur-Skizze

```
                  ┌───────────────────────────────────────┐
  rettet.zzzlim.de│  Vercel Edge Middleware (middleware.js)│
        DNS  ────▶│  host → path-rewrite                   │
                  │  rettet.zzzlim.de/*  →  /rettet/*      │
                  └────────────────┬──────────────────────┘
                                   │
                                   ▼
                  ┌─────────────────────────────────────────┐
                  │  Static files (Vercel CDN)              │
                  │  rettet/index.html                      │
                  │   ├─ <base href="../">  ──┐             │
                  │   ├─ scripts/tracking.js  │ shared      │
                  │   ├─ erklaer.css         ─┤ pool im     │
                  │   ├─ i18n.js             ─┤ repo-root   │
                  │   └─ media/*             ─┘             │
                  └────────────────┬───────────────────────┘
                                   │ (12 Event-Typen)
                                   ▼
              ┌─────────────────────────────────────────┐
              │  POST zzzlim-dashboard.vercel.app/api/track │
              │  (preppilot repo · lp-tracking-backend)    │
              └─────────────────────────────────────────┘
```

## Wenn du eine neue LP launchst

Folge [docs/lp-launch-checklist.md](docs/lp-launch-checklist.md). Kurzfassung steht in [README.md](README.md). Detail-Workflow inkl. Edge-Cases im Skill.

## Wenn du an `scripts/tracking.js` Hand anlegst

Erst den Skill lesen. Pflichtfelder am Payload, Hard-Rules zu Consent + Outbound-Enrichment + Pixel-eventID-Dedup stehen dort. Aenderungen ans Payload-Format → simultaner Patch im `preppilot`-Repo via `lp-tracking-backend`-Skill.

## Schreibstil + Inhaltsregeln

- Keine Bindestriche („-") in deutscher UI-Copy, stattdessen Em-Dash oder echtes Wort.
- Umlaute korrekt: ae/oe/ue nur in Code-Identifiern und Slugs. In sichtbarer Copy IMMER ä/ö/ü.
- EU Health-Claims-konform: nur Aussagen die in EU-Verordnung 432/2012 stehen. Disclaimers an Sternchen-Marker binden.
- Mobile-Responsiveness ist der wiederkehrende Pain-Point. Vor jedem Push: in `?debug=1` + DevTools-Device-Toolbar (375px / 414px) durchklicken.

## Cross-Refs

- Brief-Source dieser Tracking-Iteration: [BRIEFING-rettet-tracking-2026-05-21.md](BRIEFING-rettet-tracking-2026-05-21.md)
- Skill: [.claude/skills/lp-tracking-client/SKILL.md](.claude/skills/lp-tracking-client/SKILL.md)
- Pendant-Skill (anderes Repo): `preppilot/.claude/skills/lp-tracking-backend/SKILL.md`
- Memory-Notes: `C:/Users/sheym/.claude/projects/c--Users-sheym-Documents-GithubRepos-landingpage-26-maerz/memory/`
