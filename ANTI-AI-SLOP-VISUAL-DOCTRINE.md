# Anti-AI-Slop Visual Doctrine — zZzlim LP

**Pflicht-Read für jeden Agent + jeden Builder, der an LP-Sections arbeitet.**
**Stand:** 2026-05-18 · **Owner:** Samuel Heymig
**Begleitend:** [DESIGN.md](DESIGN.md) (Tokens) · [BRIEFING-zzzlim-lp-foundation-2026-05-16.md](BRIEFING-zzzlim-lp-foundation-2026-05-16.md) (Architecture)

---

## 0. Warum existiert dieses Doc

AI generiert per Default „kompetente Mittelmäßigkeit": symmetrische Grids, glatte Cards, einheitliche Padding, plausible Stock-Anmutung. Das sieht nach 2024 aus. Tier-1-Sleep-Brands (Lyma, Aesop, Beam, Ritual, Liquid Death) wirken **unverwechselbar**, weil sie ihre Templates brechen.

Diese Doctrine listet die 10 AI-Slop-Defaults, die zZzlim verlässt, und die 10 Premium-Patterns, die zZzlim einbaut. Jede Section-Polish-PR muss diese 10+10 als Checklist abhaken.

---

## 1. Die 10 AI-Slop-Defaults (ALLE VERBOTEN)

| # | AI-Slop-Pattern | Warum es Slop ist | Was wir stattdessen tun |
|---|---|---|---|
| **1** | Symmetrisches 3- oder 4-Card-Grid mit identischem Padding | Wirkt wie Template, kein Editorial-Rhythmus | Bento-asymmetrisch (eine Card 2× Höhe, eine Card span-2-cols) ODER vertikaler Editorial-Flow mit unterschiedlichem Whitespace |
| **2** | Flache farbige Icons als Section-Anker (Material-Symbols, Hero-Icons, Feather-Standard) | Erkennbar generisch, jeder Tech-Blog nutzt sie | Inline-SVG mit Hand-getuneten Strokes, Brand-Burgundy-only, ODER Number-Badges (01/02/03 in Fraunces) statt Icon |
| **3** | Lila-Blau-Gradient-Hintergrund-Decken (besonders auf Cards) | Standard-Tailwind-AI-Output 2024 | Solid `--bg-warm` (#FDF6F4) oder `--bg-cool` (#F5F7F2) als Section-Background, KEINE Gradients außer Burgundy-radial-glow am Hero |
| **4** | Stock-Photo-Smiling-Frau-im-weißen-Bett | Pharmamodel-Vibe, Anke-58 erkennt es sofort | Anatomy-Illustration ODER Living-Body-Render ODER nicht-gestellte UGC-Frame ODER blackgrund-only Hero-Pouch |
| **5** | Glatte Rectangle-Cards mit `border-radius: 12px` und `shadow-lg` überall | Bootstrap-Default seit 2015 | Mixed Radius (pill für CTAs, sm für Pills, lg für Hero-Cards), Shadow NUR auf Hover ODER nur unter CTAs, `border: 1px solid var(--border)` statt Shadow |
| **6** | „Trusted by 10,000+ customers" + Logo-Wall mit Stockfoto-Marken | Funktioniert nicht in DACH-Anke-58-Segment, wirkt B2B-SaaS | Konkrete Persona-Testimonials (Anna 47 / Susanne 52) + 3 echte Authority-Köpfe (Apotheker mit Foto + Name) + Mérieux-Cert (echt) |
| **7** | „Endless-scroll"-Carousels (Testimonials/Vorteile) mit Auto-Slide | Mobile-User sieht nur Card 1, Algo-Decay | Statischer Vertical-Stack auf Mobile, scroll-driven Horizontal-Snap auf Desktop, KEINE Auto-Slide |
| **8** | Generische Eyebrow-Tags „Premium · Wissenschaftlich · Vegan" als Pill-Stack | Klingt nach jedem Supplement-LP | Konkrete Trust-Pills mit Fakten: „Made in Germany · Apotheken-Qualität · 100 % vegan · 60 Tage Geld-zurück" — alle 4 messbar/belegbar |
| **9** | Hero-CTA „Start Free Trial" / „Jetzt entdecken" / „Hier kaufen" | Generisches Conversion-Vokabular | Brand-spezifisch: **„In Ruhe ausprobieren"** überall, niemals abweichen |
| **10** | Hover-Lift-Animation auf JEDER Card (translate-Y -4px) | Über-animiert, lenkt vom Inhalt ab | Hover-Animationen NUR auf Cards die klick-aktionierbar sind (CTA, Inhaltsstoff-Card mit Modal). Statische Content-Cards bleiben statisch. |

---

## 2. Die 10 Premium-Patterns (PFLICHT für zZzlim)

| # | Pattern | Tier-1-Vorbild | Wo bei uns einsetzen |
|---|---|---|---|
| **1** | **Editorial-Asymmetrie** — eine dominante Card + zwei kleine, statt 3 gleich | Aesop Story-Pages, Apple-Pro-Pages | 3 Säulen, Ursachen-Story-Cards, In-Zahlen-Block |
| **2** | **Big-Number-Type** — `clamp(4rem, 12vw, 9rem)` Fraunces für 14, 60, 1, 100 | Beam „Save 20%", Lyma Inhaltsstoff-Counter | In Zahlen, Pricing-Anchor, Compare-Table-Counter |
| **3** | **Sage-Akzent für Anti-Signal** — `#C3CCA6` als Border/Accent NUR für Anti-Ingredients + Decision-Frames | unique zZzlim — keiner sonst | Anti-Ingredients-Section, Decision-Frame im Final-CTA, „Was NICHT drin ist"-Footer-Bar |
| **4** | **HCVO-Sternchen als Brand-Asset** — `*` direkt am Wirkstoff, Footnote unten zitiert EU-VO 432/2012 mit klickbarem Link zur EFSA | Lyma deutet es an, niemand zitiert die Verordnung | 3 Säulen, Inhaltsstoff-Tabs, Compare-Table-rechte-Spalte |
| **5** | **Decision-Frame statt CTA-Push** — „Du musst nicht alles auf einmal entscheiden. Probier eine Packung. 14 Nächte. Wenn nicht spürbar leiser, schreib uns. Wir nehmen es zurück, ohne Rückfragen." in Burgundy-Box | Liquid Death Conviction, Aesop Tonalität | Final-CTA, FAQ-Header, Sticky-Mobile-CTA-Sub |
| **6** | **Authority-Köpfe mit echten Namen** — Apotheker + Wissenschaftler + Mérieux-Prüfer als 3 Portraits mit Inline-Quote | Lyma „Minds Behind", Ritual „Made traceable" | Authority-Section (zwischen In-Zahlen und Routine) |
| **7** | **Scroll-driven Burgundy-Progress-Line** durch Pain-Mechanik-Timeline | Apple Pro-Pages, Stripe Press | Kreislauf-Section (4 Steps mit Linie die sich beim Scroll füllt) |
| **8** | **Anatomy-Hero statt Person-Hero** — Living-Body-Render mit glowing Organen + Burgundy-Tint-Overlay | Lyma einzigartig im Premium-Segment | Hero (Pflicht), optional auch in 3-Säulen-Section-Backdrop |
| **9** | **Casual-intim Brand-Voice** — du-Form, lowercase wo organisch („du musst nicht alles auf einmal entscheiden"), Reel-Vokabular zitieren („um 02:47", „kaputt und durcheinander") | Ritual feministisch-warm, Liquid Death conviction-cool | Hero-Subhead, Decision-Frame, FAQ-Antworten, Routine-Section |
| **10** | **Number-Badge statt Icon** — `01` / `02` / `03` in Fraunces 2rem als Section-Step-Marker, mit Burgundy-Circle-Outline | Aesop Editorial-Standard | Kreislauf, Routine-Abend, Authority-Köpfe |

---

## 3. Schicht-Architektur (CSS-Specificity-Level für Polish)

Jede Section bekommt 3 Polish-Schichten — von außen nach innen:

### Schicht A — Section-Container (Background + Spacing)
- Background: `--bg`, `--bg-warm`, `--bg-cool` rotieren (nicht 3× hintereinander dieselbe)
- Vertical-Padding: variiert per Section (`4rem` / `6rem` / `8rem`) — Monotonie ist Slop
- Horizontal-Padding: `clamp(1rem, 4vw, 2rem)`
- Max-Width: 1600px

### Schicht B — Headline-Cluster (Eyebrow + H2 + Sub)
```html
<div class="section-headline">
  <span class="eyebrow">[CAPS · Instrument Sans · Burgundy]</span>
  <h2><em>[Fraunces 700, italic-optional, clamp(1.75rem,4vw,2.75rem)]</em></h2>
  <p class="sub">[Onest 400, max-width 38rem, line-height 1.6, text-mute]</p>
</div>
```

**Pflicht-Regeln:**
- **NIE** zwei Sections in Folge mit identischer Headline-Struktur (mal mit Eyebrow, mal ohne, mal italic, mal nicht)
- Eyebrow nutzen, wenn die Section eine Cluster-Funktion hat („PERSONA · Anke 58 sagt…", „WIRKMECHANIK · So bricht der Teufelskreis")
- Italic nur für emotionale H2s, NIEMALS für faktische („Eine durchdachte Kombination")

### Schicht C — Content-Block
Asymmetrie-Pflicht: kein perfektes 3- oder 4-Card-Grid wenn nicht funktional zwingend. Vermeide:
- Drei identische Säulen unter „Die 3 Säulen" → kleine Variation in Höhe/Padding/Visual-Weight
- Vier identische Big-Numbers → die wichtigste 1,5× größer

---

## 4. Mikro-Details die premium signalisieren

| Detail | Warum | Wo |
|---|---|---|
| **Curly Quotes („" '')** statt straight ("" '') | Editorial-Polish | ALLE Testimonial-Zitate, ALLE Body-Copy mit Anführungszeichen |
| **Geviertstrich (–) statt Bindestrich (-) für Numbers** | „14–60 Tage" statt „14-60 Tage" | Pricing, In Zahlen, FAQ |
| **Non-Breaking-Space (`&nbsp;`)** vor Einheiten | „49,95 €" als ein Block, nie umbrechen | Pricing, Footnotes |
| **Letter-Spacing -0.01em bis -0.02em** auf großen Headlines | Tight-Tracking signalisiert Editorial-Care | Hero H1, Section H2 ≥ 2rem |
| **Line-Height 1.05–1.1** auf großen Headlines, 1.6 auf Body | Display-Type knapp, Body atmend | Hero, Section H2, FAQ-Antworten |
| **Drop-Cap auf einzelnen Lead-Paragraphen** (Fraunces, 3em float-left) | Editorial-Signal, max 1× pro Page | Decision-Frame im Final-CTA |
| **Underline-Animation auf Hover** statt schwarzes Underline-Default | Detail-Care | Footer-Links, In-Text-Links |
| **Focus-Ring in Burgundy mit 4px Offset** | Accessibility + Brand-Konsistenz | ALLE focusable Elements |
| **`scroll-margin-top: 6rem`** auf Section-Anker | Sticky-Header überdeckt nicht den Section-Start beim Anker-Klick | ALLE `<section id="...">` |

---

## 5. Anti-Slop-Checkliste (PFLICHT vor jedem Section-Commit)

Pro Section-Edit nimmst du diese Liste durch. Jeder ❌ ist ein Slop-Bug und blockiert den Commit.

- [ ] **Headline:** weicht von der vorherigen Section in Struktur ab (Eyebrow ja/nein, italic ja/nein)
- [ ] **Background:** ist nicht identisch zur vorherigen Section
- [ ] **Vertical-Spacing:** weicht ab vom Vorgänger (Rhythmus statt Monotonie)
- [ ] **Cards/Items:** asymmetrische Hierarchie ODER funktional begründete Symmetrie (z. B. Compare-Table)
- [ ] **Icons:** entweder Brand-Custom-SVG ODER Number-Badge ODER kein Icon. KEINE Material/Hero/Feather-Standards
- [ ] **Curly Quotes** überall wo Anführungszeichen
- [ ] **HCVO-Sternchen** wenn Wirkstoff genannt wird, mit Footnote-Link
- [ ] **Brand-Voice:** „in Ruhe", du-Form, kein „Sie", kein „Jetzt sichern"
- [ ] **Mobile-Check:** Above-the-fold-Hierarchie sinnvoll, Tap-Targets ≥ 44px, kein versteckter-Tab-Content
- [ ] **Lazy-Load** auf allen below-the-fold-Images
- [ ] **Hover-Animation** nur auf interaktiven Elementen, nicht auf Static Content
- [ ] **Trust-Signal** in der Section (mindestens 1 pro Viewport-Höhe)

---

## 6. Was diese Doctrine NICHT ist

- **Kein Style-Guide für neue Brands.** zZzlim-spezifisch.
- **Kein Ersatz für DESIGN.md** (Tokens), sondern Layer drüber.
- **Kein Verbot von Whitespace.** Editorial-Whitespace ist Premium. Pflicht ist nur, dass Whitespace **variiert**, nicht überall identisch.
- **Kein Verbot von Animationen.** Verbot ist „Animation aus Default-Hover-Habit". Funktionale Animationen (Scroll-Reveal mit Burgundy-Progress, Number-Counter beim In-View, Checkmark-Sequence beim Compare-Table) sind explizit erwünscht — siehe BRIEFING §9.

---

## 7. Anwendung in der Praxis

**Workflow für Section-Polish:**
1. Section in Live-Preview auf Mobile + Desktop ansehen
2. Diese Doctrine §1 (Slop) + §2 (Premium) durchgehen — was triggert?
3. Schicht A → B → C einzeln durcharbeiten
4. §4 Mikro-Details checken
5. §5 Checklist als Final-Gate
6. Commit-Message: `polish(section-X): [Was geändert] (anti-slop §1.N + §2.M)`

**Wenn unsicher:** lieber **mehr Whitespace und weniger Elemente** als ein Card-Stack der „kompetent aber langweilig" wirkt.
