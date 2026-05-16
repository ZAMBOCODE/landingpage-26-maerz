# Design

## Theme

Light, warm-tinted. Burgundy-on-Cream als Anker. Dark Mode bewusst NICHT default, weil der Use-Case „Anke 58 liest abends auf dem Sofa unter warmem Wohnzimmerlicht" Helligkeit + Editorial-Ruhe verlangt, nicht App-Cool-Dark.

**Color strategy: Committed.** Burgundy `#851330` trägt 30-60% der Surface (Hero-Overlay, CTAs, Section-Headlines, Footer). Sage `#C3CCA6` als Secondary-Accent für Anti-Ingredient-Signale und Decision-Frames. Tinted neutrals (`#FDF6F4` warmes Off-White, `#F5F7F2` kühles Sage-Off-White) für Section-Differenzierung.

## Color Palette

```css
--primary:    #851330  /* Burgundy — Brand-Anker, CTA, Hero-Overlay, Headlines */
--primary-dark: #6B0F26 /* Hover/Active States für CTA */
--secondary:  #C3CCA6  /* Sage — Anti-Ingredient, Decision-Frames, sekundäre Akzente */
--bg:         #FFFFFF  /* default Section-BG */
--bg-warm:    #FDF6F4  /* leicht rosé — In Zahlen, Routine, Authority */
--bg-cool:    #F5F7F2  /* leicht grün — Anti-Ingredients */
--text:       #0F172A  /* slate-900 — Body, Headlines */
--text-mute:  #475569  /* slate-600 — Sublines, Captions */
--text-soft:  #94A3B8  /* slate-400 — Disclaimer, Footnotes, HCVO-Sternchen */
--gold:       #FFD700  /* Stars — sparsam, max 1 Stelle pro Page */
--border:     #E5E7EB  /* slate-200 — Card-Borders, Dividers */
```

**Brand-Drift-Note:** Historisch wurde `#861330` verwendet, ist falsch. Source-of-Truth: `#851330` in `tokens.css`. Niemals `#000` oder `#fff` rein, immer leicht zur Brand-Hue getönt.

## Typography

**Font-Stack:**

```css
--font-display: 'Fraunces', Georgia, serif;
--font-heading: 'Instrument Sans', system-ui, sans-serif;
--font-body:    'Onest', system-ui, sans-serif;
```

**Hierarchie:**

| Rolle | Font | Größe | Weight | Notes |
|---|---|---|---|---|
| Hero H1 | Fraunces | `clamp(2.5rem, 5.5vw, 4.5rem)` | 700 | optional italic für Pain-Recall |
| Section H2 | Fraunces | `clamp(1.75rem, 4vw, 2.75rem)` | 700 | manchmal italic |
| H3 (Card-Titles) | Fraunces | `1.5rem` | 700 | |
| Eyebrow / Trust-Pill | Instrument Sans | `0.75rem` | 600, uppercase, letter-spacing 0.1em | nur hier Caps |
| Body | Onest | `1rem` | 400, line-height 1.6 | |
| Body-Small / Disclaimer | Onest | `0.875rem` | 400, color: text-mute | |
| HCVO-Footnote | Onest | `0.75rem` | 400, color: text-soft | mit Sternchen-Symbol |

**Regeln:**
- Body-Line-Length capped auf 65-75ch.
- Scale-Ratio zwischen Steps mindestens 1.25.
- Lowercase nur in Reel-VO-Zitaten und Decision-Frames („du musst nicht alles auf einmal entscheiden") — Fraunces in 1.25rem mit feel-lowercase.
- Caps nur für Eyebrows und Trust-Badges („MADE IN GERMANY · APOTHEKEN-QUALITÄT").

## Spacing

8px-Basis. Section-Padding auf Desktop `5rem` vertikal, `clamp(1rem, 4vw, 2rem)` horizontal. Mobile reduziert auf `3rem` vertikal. Inter-Section-Rhythmus variieren (nicht alle gleich), um Monotonie zu vermeiden.

Container-Max-Width: `1600px` (vereinheitlicht über die ganze Seite). Card-Inner-Padding `2-2.5rem`. Cards mit Gap `1.5-2rem`.

## Elevation

Sparsam. Drei Stufen:

```css
--shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.04);
--shadow-md: 0 2px 12px rgba(15, 23, 42, 0.06);
--shadow-lg: 0 6px 24px rgba(133, 19, 48, 0.18);  /* nur für CTAs mit Burgundy-Tint */
```

Cards: `--shadow-md` default, `--shadow-lg` on hover für Lift-Affordance. Buttons: `--shadow-lg` permanent (Brand-Akzent).

## Border Radius

```css
--radius-sm: 0.5rem;   /* Tags, Pills */
--radius-md: 1rem;     /* Buttons, kleine Cards */
--radius-lg: 1.5rem;   /* Section-Cards, Testimonials */
--radius-xl: 1.75rem;  /* große Hero-Bilder */
--radius-pill: 999px;  /* CTAs, Trust-Pills, Star-Bewertungs-Pill */
```

## Components

### CTA Button (Primary)

```
background: var(--primary)
color: #fff
padding: 1.125rem 2.5rem
border-radius: 999px
font: Fraunces, 1.05rem, 700
box-shadow: 0 6px 24px rgba(133, 19, 48, 0.5)
hover: translateY(-2px), shadow-lg
```

CTA-Text-Codex: „In Ruhe ausprobieren", „Verstehen, was dahinter steckt", „Mehr erfahren". NIEMALS „Jetzt kaufen / Sofort sichern / Nur heute / Worauf wartest du noch".

### Trust-Pill (Hero Rating)

Pill mit weißem Background, dunklem Text, mittig zentriert. `display: inline-flex`, `width: auto`, `padding: 10px 24px`, `border-radius: 999px`, `box-shadow: 0 2px 12px rgba(0,0,0,0.1)`.

### Card

Default: weißer Background, `1px solid var(--border)`, `border-radius: var(--radius-lg)`, `padding: 2rem`, `--shadow-md`. Hover: translateY(-4 bis -6px), shadow-lg, 280-320ms transition.

NICHT: Side-Stripe-Borders (border-left als Akzent verboten). NICHT: Nested Cards. NICHT: Gradient-Text inside Cards.

### HCVO-Claim-Block

EFSA-Claim als Body-Text mit Sternchen-Suffix. Footnote-Block am unteren Section-Rand:
```
* Melatonin trägt zur Verkürzung der Einschlafzeit bei (EFSA 432/2012). 
  Nahrungsergänzungsmittel ersetzen keine ausgewogene Ernährung.
```

## Motion

**Easing-Standard:**
```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);          /* Apple ease-out-quint */
--ease-bouncy: cubic-bezier(0.34, 1.56, 0.64, 1);   /* für Checkmarks, Count-Up */
```

**Durations:**
- Micro (hover, focus): 200-280ms
- Cards/Reveals: 380-500ms
- Hero-Breathing: 7s loop, scale 1 → 1.04, brightness 1 → 1.12
- Pricing-Cinematic-Reveal: 900ms blur(6px) → 0 + scale(0.96) → 1

**Stack:** Vanilla CSS + JS only. KEIN Framer Motion, GSAP, Lenis. `transform` und `opacity` only — nie `width`/`height`/`top` animieren.

**Pflicht-Animationen:**
- Hero H1 word-by-word reveal (55ms stagger)
- Stagger-Reveal für Cards (80ms delay per child)
- Kreislauf-Step-Activation an Scroll-Thresholds 0.05/0.3/0.55/0.8
- Card-Hover-Lift (translateY -4 bis -6px)
- Number Count-Up (1.4s ease-out)

**Anti-Animations:** Niemals Confetti, Glitter, Bouncing, Wiggle, Auto-rotating Carousels, Cursor-Trails, Parallax, Smooth-Scroll-Libs.

**Reduced Motion:** Alle Animationen via `@media (prefers-reduced-motion: reduce)` deaktivierbar.

## Layout Patterns

**Section-Order (Master für jede Pain-LP):**
1. Hero (Pain-Recall + Anatomy-Visual + CTA)
2. Kreislauf-Timeline (4-Step Pain-Mechanik)
3. Ursachen-Story (5 Story-Cards, optional)
4. Testimonials (4-6 Frauen 44-58, scrollbar)
5. Produkt + Pricing (Big-Packshot + Tabs + Pro-Day-Anchor)
6. In Zahlen (4 Big-Number-Cards)
7. Authority (3 Köpfe)
8. Routine-Abend (22:00 / 22:30 / 06:30)
9. 3 Säulen Grid (NICHT Carousel) mit HCVO-Claims + EFSA-Link
10. Anti-Ingredients (Sage-akzentuiert)
11. Vergleich-Table (9-Punkte-Stack)
12. FAQ (Top-3 default-expanded)
13. Final CTA (Decision-Frame + Burgundy-Box)

**Mobile-First Constraints:**
- Doc-Height < 12 000 px Mobile
- Hero-CTA above-the-fold auf 375×812
- Sticky-Mobile-CTA-Bar ab `scrollY > 600px`
- FAQ Top-3 expanded by default
- Carousels = NEIN, stattdessen vertikaler Stack

## Breakpoints

```css
/* Mobile-first */
@media (min-width: 768px)  { /* Tablet portrait */ }
@media (min-width: 1025px) { /* Desktop, full nav, 3-col grids */ }
@media (min-width: 1366px) { /* Large desktop */ }
```

Mobile-Hamburger-Menu bis 1024px (Fire-Tablets + iPads bekommen Mobile-Nav).

## Images

- WebP für Photos, SVG für Icons/Logos.
- Hero: `<picture>` mit srcset (Mobile 750w, Desktop 1920w), max 200 kB Mobile.
- `loading="lazy"` auf jedem `<img>` below-the-fold.
- Width/Height-Attribute auf jedem Image (CLS-Prävention).
- Hero-Stil: Living-Anatomy CGI (Kling 2.5/2.6, Haut semi-transparent, Burgundy-Töne) ODER Cozy-Flat-Editorial.
- Anti: Stockfoto-Lächler, Vorher/Nachher, Champagner, Yoga-Studio-Klischees.

## Iconography

Stroke-Icons, 1.5-2px Stroke-Weight. Lucide- oder Phosphor-Style. `currentColor` für Tinting. Niemals farbige Cartoony-Icons, niemals Emoji als UI-Icon.

## Anti-Patterns (Match-and-Refuse)

Diese Pattern bei Erkennung sofort umschreiben:

- Side-stripe borders (border-left/right > 1px als Akzent)
- Gradient text (background-clip: text)
- Glassmorphism als Default
- Hero-Metric-Template (Big-Number + Small-Label + Gradient-Akzent als SaaS-Cliché)
- Identical Card Grids (Icon + Heading + Text endlos repeated)
- Modal/Popup als first thought
- Em-Dashes (—) im Body-Text — durch Komma, Punkt, Doppelpunkt ersetzen
- ChatGPT-Modal-Workaround (historischer Anti-Pattern aus rettet-LP)
- „Foto folgt"-Captions unter Testimonials
- Durchgestrichene MSRP-Preise
- Countdown-Timer

## Reference Sites

**Visual:**
- lyma.life (Premium-Anatomy, „Minds Behind"-Authority)
- aesop.com (Editorial Whitespace, Serif-Display + Sans-Body)
- ritual.com (Transparenz-Doktrin, Anti-Ingredients prominent)
- shopbeam.com/products/dream-powder (How-to-Enjoy + Photo-Reviews)

**Brand-Voice Conviction:**
- liquiddeath.com (Anti-Hype-CTA-Haltung)
- formnutrition.com/products/zzzzs (Minimal-Black + Typo)

**Reflex-Reject Lanes (NICHT diese Familie):**
- Apotheken-Klinik-Steril (Orthomol)
- Bio-Pflanzen-Esoterik (Sunday Natural)
- Performance-Bro-DTC (Braineffect)
- OTC-Pharma-Beipack (ZzzQuil, Hoggar)
