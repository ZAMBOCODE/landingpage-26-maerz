# CLAUDE.md — landingpage-26-maerz

> Handoff-Doc für Claude Code. Hier steht der Stand, die Strategie und die Constraints — damit du bei einer neuen Session sofort einsteigen kannst, ohne dass Samuel alles neu erklären muss.

**Stand der Konversation:** Iteration 2 der Zucker-LP fertig. Vorlage wird im Branch `feat/multi-lp-foundation` aufgebaut. User ist gerade dabei, visuelles Feedback zu geben, bevor wir die Vorlage als Recipe für andere Pain-LPs nutzen.

---

## 🧭 Worum geht's

zZzlim® ist eine Premium-Supplement-Brand (Sleep & Night System, 49,95 € / Monat, DACH-Markt, EU-Compliance kritisch). Owner: Samuel Heymig (ZAMBODESIGN).

Diese Repo ist die **Landing Page** (`k2.zzzlim.de`), aktuell plain HTML/CSS/JS via Vercel deployed. Performance ist katastrophal: 13% Scroll-Tiefe, 14 Sek aktive Zeit, 0,51% Click-to-Shop. Diagnose im Brand-Profile: **"Kein Message-Match Ad ↔ Hero."**

**Strategische Lösung:** Mehrere pain-spezifische Landing Pages — eine pro ManyChat-Flow / Ad-Creative-Theme. Jede LP greift den Pain auf, mit dem der User aus Ad/DM kommt:
- `zucker.zzzlim.de` — "Du isst Zucker am Abend..."
- `heisshunger.zzzlim.de` — "Heißhunger am Abend"
- `dreiuhr.zzzlim.de` — "3-Uhr-Wach-Phänomen"
- weitere folgen anhand ManyChat-Flow-Volumen (~70 Flows existieren)

Diese LPs sind **Klone derselben Basis-Vorlage** mit pain-spezifischen Inhalten (Hero, Story-Cards, Testimonial-Auswahl, FAQ-Filter) — gemeinsame Sektionen (Header, 3-Säulen-Wirkung, Inhaltsstoffe, Vergleich, Footer) bleiben identisch.

---

## 📂 Repo-Struktur (aktueller Stand)

```
landingpage-26-maerz/
├── index.html              # Master-LP (k2.zzzlim.de) — produktiv, NICHT ändern bis Vorlage approved
├── erklaer.css             # 2.772 Zeilen Styles (Animationen, Layout)
├── erklaer.js              # 1.412 Zeilen JS (Scroll-Animations, Carousels)
├── i18n.js                 # 405 Zeilen DE/EN/TR Translations
├── tokens.css              # NEU: zZzlim Brand-Tokens (CSS-Variablen)
├── zucker/
│   └── index.html          # Zucker-LP — die "Vorlage" die wir jetzt perfektionieren
├── media/                  # 77 Files, viele 5-10 MB PNGs (CVR-killer auf Mobile)
├── vercel.json             # cleanUrls: true
└── .claude/settings.local.json
```

**Master-LP-Struktur (`index.html`, 2.363 Zeilen):**
1. `<header>` Site-Header mit Logo + Nav + Lang-Switch + Shop-Button
2. Mobile Menu Drawer
3. `<main>`:
   - `#hero` — Bg-Image + Pain-Headline + CTA
   - `#kreislauf` — 4-Step-Timeline (Blutzucker fällt → Stress → Schlafsignal → Wiederholt)
   - `#ursachen` — 4 Story-Cards Carousel (Zucker / Stress / Blau / Nährstoffmangel) ← **User will Timeline statt Karussell**
   - `#testimonials-real` — Testimonials (Zucker-LP: 6 Stück, horizontaler Scroll, Foto-Placeholders)
   - `#produkt-info` — Produktbild + Tabs (Inhaltsstoffe / Qualität)
   - `#wirkung` — 3-Säulen-Carousel (Schlafbeginn / Stoffwechsel / Vitalität) + ChatGPT-Overlay
   - `~~#video2~~` — entfernt in Zucker-LP
   - `#vergleich` — Andere Produkte vs. zZzlim
   - `#faq-section` — FAQ-Accordion + Final CTA + Footer

---

## 🎯 Was schon fertig ist (Zucker-LP, Branch `feat/multi-lp-foundation`)

In `zucker/index.html`:

- ✅ Vollständige Kopie von `index.html` mit `<base href="../">` damit alle Asset-Pfade vom Parent-Folder resolven
- ✅ SEO/Meta komplett auf Zucker umgestellt (title, description, OG, Twitter, canonical → `zucker.zzzlim.de`, hreflang, Schema.org)
- ✅ Hero-Text: "Du isst Zucker am Abend... und dein Körper verarbeitet ihn, statt zu regenerieren." + Heißhunger→Cortisol→Schlafmangel-Subhead
- ✅ Hero-Image: `media/1süßes.webp` als Platzhalter, mit sichtbarem **PLATZHALTER-Badge** oben rechts ("VORLAGE-V1 · HERO-VISUAL PLATZHALTER")
- ✅ Brand-Token-Korrektur: alle `#861330` → `#851330` (Brand-Profile-Drift gefixt) + alle `rgba(134,19,48,...)` → `rgba(133,19,48,...)`
- ✅ Google Fonts erweitert: Onest + Instrument Sans + Fraunces (statt nur Fraunces + Inter)
- ✅ `tokens.css` als Single-Source-of-Truth für Brand-Variablen
- ✅ `data-i18n` von customisierten Hero-Texten entfernt (sonst überschreibt i18n.js die Texte beim Init)
- ✅ `#video2` Section entfernt
- ✅ Testimonials: 6 Cards horizontaler Scroll-Snap, Foto-Platzhalter mit Initialen + "Foto folgt"-Caption, kein "Verifizierter Käufer"-Badge, Texte basierend auf Brand-Profile-Pain-Points (Wechseljahre, Heißhunger, Zucker, Cortisol)
- ✅ Produkt-Bild 20% kleiner (`max-width:80%`) + responsive `width:100%; height:auto;` Fix

---

## 🔧 Open TODO-Liste (priorisiert)

**Quick wins (1× Iteration):**
- [ ] **`#ursachen` Karussell → vertikale Timeline** (User-Wunsch, statt nochmal Bilder-Karussell)
- [ ] Responsive-Fix Produkt-Bild für Hochkant-Tablets + Mobile
- [ ] Scroll-Snap zwischen Sektionen (für 1-Sektion-Durchgang)
- [ ] Animation-Audit: alle [data-sr] checken + fine-tune

**Größere Brocken (2-4 Stunden je):**
- [ ] **Sticky-Scroll 3-Säulen** mit animierten Icons (Inspiration: `C:\Users\sheym\Documents\GithubRepos\warm-audience\warm.html` — siehe Sektion `#variante-4-tabs` ab Zeile 1438 + IntersectionObserver-Pattern ab Zeile 2175)
- [ ] **Universale Sektion** mit austauschbaren Icons + Texten pro Pain-Flow (z.B. ein generischer Timeline-Block der pro Flow andere Schritte zeigt)
- [ ] Echte Testimonials (Phase 1: Mock, später echte mit echten Fotos einsammeln)
- [ ] Hero-Visual: aktuell Platzhalter — finales Visual sollte Living-Anatomy-Stil sein (siehe Brand-Profile `pillars[1]`)

**Phase B — Build-System (sobald Vorlage approved):**
- [ ] Sektionen in `_partials/*.html` extrahieren
- [ ] `flows/<slug>.json` Schema definieren (nur pain-spezifische Werte)
- [ ] `build.js` (~120 LOC Node) → generiert `dist/<flow>/index.html`
- [ ] `vercel.json` Rewrites für Subdomain-Routing

**Phase 1 — Asset-Pipeline (separater Arbeitsblock):**
- [ ] Sharp-Script: 5-10 MB PNGs → AVIF + WebP @ multi-size
- [ ] `<picture>`-Tags überall (statt direkten `<img>`)
- [ ] Lazy-Loading below-the-fold

**Phase 2 — Compliance (kritisch für DACH):**
- [ ] Clarity + GA4 hinter Cookie-Consent-Gate (aktuell feuern sie OHNE Consent — GDPR-Risiko)

**Phase -1 — UTM-Tagging (später, wenn LPs stehen):**
- [ ] ManyChat-Flow-Buttons mit `?utm_source=manychat&utm_medium=dm&utm_campaign=<slug>` taggen
- [ ] Mapping-Liste existiert bereits in der preppilot-Konversation

---

## 🎨 Brand-Constraints (NICHT VERHANDELBAR)

**Source of truth:** `C:\Users\sheym\Documents\ContentDesigner\CONTENT-DESIGNER-OS\BRANDS\zZzlim\brand-profile.md`

**Farben:**
- Primary/Accent: `#851330` (Burgundy) — NICHT `#861330` (alter Drift-Wert)
- Secondary: `#C3CCA6` (Sage)
- Background: `#FFFFFF`
- Text: `#150706`

**Fonts:**
- Display (Hero, Karussells): **Fraunces**
- Heading (H1/H2/H3): **Instrument Sans**
- Body: **Onest**

**Voice / Tone:**
- Casual, intim, du-Form
- Lowercase casual für Reels (LP kann groß sein, aber Ton bleibt casual)
- Trigger-Wörter (oft nutzen): "in ruhe ausprobieren", "das bin ich", "nacht-system", "teufelskreis"

**HCVO — keine Health Claims (EU-regulatorisch zwingend):**
- VERBOTEN: "heilt", "behandelt", "kuriert", "schlafmittel", "abnehmmittel"
- VERBOTEN: "kostenlos testen", "jetzt kaufen", "nur heute" (Verknappung/Druck)
- VERBOTEN: Timer, Countdowns, "Sale endet in..."
- OK: "unterstützt", "hilft", "in ruhe ausprobieren"

**Visual:**
- Hero-Stil idealerweise Living-Anatomy (Kling 2.5/2.6, Haut semi-transparent, Burgundy-Töne, Pure-Black-Background) ODER Cozy Flat Editorial
- KEINE Vorher-Nachher-Bilder, keine Stock-Lächler, keine Champagner-Klischees

---

## ⚠️ Wichtige Konvention: Localhost-Ports

**Port 3000 NIE verwenden** — ist permanent vom preppilot-Dashboard belegt.

Standard für lokales Hosting der LP: **Port 8787**

```bash
cd "C:/Users/sheym/Documents/GithubRepos/landingpage-26-maerz"
bunx serve . -p 8787
# → http://localhost:8787/zucker/
```

Andere sichere Ports: 5500, 8080, 4444, 9000.

---

## 🛠 Skills die in der preppilot-Konversation installiert wurden

Im **preppilot-Repo** (`c:\Users\sheym\Documents\Neuer Ordner\preppilot\.claude\skills\`) sind diese Skills installiert:
- `brainstorming` — vor kreativer Arbeit nutzen
- `find-skills` — Skill-Discovery
- `ui-ux-pro-max` — UI/UX-Design-Intelligenz (50+ Stile, 161 Color-Palettes, etc.)
- `shadcn` — shadcn/ui Components
- `grill-me` — Plan-Stress-Test
- `seo-audit` — SEO-Diagnose
- `marketing-psychology` — Persuasion + Behavioral Science

**Falls du diese Skills hier auch brauchst,** install sie via:
```bash
npx -y skills@latest add https://github.com/obra/superpowers --skill brainstorming --agent claude-code -y
npx -y skills@latest add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max --agent claude-code -y
# etc.
```

---

## 📊 Daten-Kontext (aus GA4 + ManyChat-API gezogen)

- **LP-Traffic 90T:** ~2.800 Sessions, dominanter Source: `fb/paid` (1.472) + `ig/paid` (619), nur 20 von ManyChat
- **Engagement-Rate paid:** 2,7% (katastrophal)
- **UTM-Tagging:** kaputt — nur 1 Flow ("stress") hat sauberes Tagging in GA4
- **ManyChat-Flows:** ~70, viele pain-themed (Zucker, Hunger, DreiUhr, Wach, Stress, Schweiß, Wein, Handy, Cafe, Bier, Reparatur, Haare, Haut, Vergessen, ...)

→ Data lebt in der preppilot-Repo unter `.research/manychat-top-flows.ts` falls du's nochmal querien willst.

---

## 🔄 Token-effiziente Architektur (Phase B Plan)

Ziel: Wenn User sagt "ändere Testimonials überall" → 1 Edit, nicht N Edits.

**Vor Phase B (jetzt):** Eine Vorlage perfektionieren. Änderungen propagieren noch nicht.

**Nach Phase B (sobald Vorlage approved):**
```
_partials/header.html   ←→ shared zwischen ALLEN flows
_partials/wirkung.html  ←→ shared (3 Säulen identisch)
_partials/...
flows/zucker.json       ← nur Hero + Stories + FAQ-Filter-IDs
flows/heisshunger.json
build.js                ← Mustache/Template-String basiert, ~120 LOC
dist/<flow>/index.html  ← Output
```

Build-Befehl: `bun run build` regeneriert alle LPs.

**Nicht überengineeren:** Phase B kommt erst, wenn die Vorlage substanziell steht. Bis dahin: weiter manuell in `zucker/index.html` iterieren, dann das Endprodukt als Template-Quelle nehmen.

---

## 🌐 Server / Test-Workflow

```bash
# 1. Server starten (im Repo-Root)
bunx serve . -p 8787

# 2. Im Browser öffnen
http://localhost:8787/zucker/   # Zucker-LP (Vorlage)
http://localhost:8787/          # Master-LP (k2.zzzlim.de Pendant)
```

`<base href="../">` in `zucker/index.html` regelt dass alle Asset-Pfade vom Parent-Folder kommen — funktioniert sowohl bei `bunx serve` als auch bei file:// (mit minimalen Limitations).

---

## 📌 Branch-Status

- Aktueller Arbeits-Branch: `feat/multi-lp-foundation`
- Master-Branch: `master` (= live `k2.zzzlim.de`)
- Vor Merge: User-Approval der Vorlage (visual review)

---

## 🤝 Letzter Stand der Konversation (2026-05-08)

User-Feedback Iteration 2 (eingearbeitet):
- "Das Video unten kann komplett weg" ✅
- "6 Testimonials statt 3, mit Foto-Platzhaltern, ohne Verifizierter-Käufer-Badge, scrollbar, animiert" ✅
- "Produkt-Bild 20% kleiner" ✅

User-Feedback Iteration 3 (offen, hier weitermachen):
- "Statt nochmal Karussell mit Bildern für 'Unser moderner Abend / Das Problem beginnt vor dem Bett' lieber Zeitstrahl"
- "Sticky-Scroll 3-Säulen mit animierten Icons aus warm-audience-Repo portieren"
- "Universale Sektionen die mit verschiedenen Icons + Texten pro Flow gemixt werden können"
- "Animationen überall — auch auf Testimonials"
- "Responsive-Fix nötig (Hochkant Produkt-Bild war riesig, Handy ultra klein)"

User wechselt zu dieser Repo um mit `ui-ux-pro-max`/`shadcn`-Skills + Design-Architektur weiterzuarbeiten.

**Mein Vorschlag für nächste Iteration:** Mit dem **Timeline-Replacement für `#ursachen`** anfangen — kleinster Aufwand, größter visueller Mehrwert, klares User-Wunsch.
