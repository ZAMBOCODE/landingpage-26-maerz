# BRIEFING — „Rettet" LP Fixes + Universal Tonalität-Rule

**Datum:** 2026-05-20
**Quelle:** Call Sam ↔ Kollege (Voice-Memo)
**Target-File:** `rettet/index.html`
**Status:** vor nächstem Ad-Push abarbeiten

---

## INSTRUCTION FÜR LLM-AGENT

Du bekommst eine Liste konkreter Find→Replace-Aufträge für `rettet/index.html` plus universelle Tonalität-Regeln, die auch für zukünftige LPs in diesem Repo gelten.

**Reihenfolge der Bearbeitung:**
1. Erst Tonalität-Pass (Sektion A)
2. Dann strukturelle Änderungen (Sektion B)
3. Dann Animation + Responsive-Fixes (Sektion C)
4. Dann Tracking-Tags einbauen (Sektion D)
5. Zum Schluss: 3 Text-Varianten pro Sektion in `rettet/COPY-VARIANTS.md` ablegen (siehe Sektion E)

Nichts überspringen. Bei jeder Sektion: vor der Änderung den Original-Text als Kommentar `<!-- ORIG: ... -->` direkt drüber lassen, damit Sam vergleichen kann.

---

## 0. UNIVERSAL TONALITÄT-REGEL (gilt für alle LPs in diesem Repo)

**Hard-Rule:** Keine englischen Wörter. Keine Metaphern. Keine Übersetzungs-Klingelei.

**Zielgruppe:** DACH, ältere Schlaf-Käufer, kaum bis gar kein Englisch-Verständnis.
**Latte:** Mutter-Test. Würde Sams Mutter (60+) das verstehen?

**Anti-Pattern-Liste (im Repo verboten):**
| Verboten | Ersatz |
|---|---|
| `kapern` | `zerstören` / `wegnehmen` |
| `lauter Abend` (ohne Erklärung) | `"lauter" Abend` (Anführungsstriche + Cortisol-Erklärung daneben) |
| `der Abend bekommt eine Form` | `deine Routine startet` |
| `hätte sonst gefühlt für dich entschieden` | `was wir weggelassen haben, ist genauso wichtig` |
| `scrollen` | `am Handy sein` |
| `wirst hellwach` | `bleibst hellwach` |
| jedes englische Wort | deutsche Entsprechung |
| jede LLM-Übersetzungs-Floskel | menschliche Umformulierung |

**Werbung-Callbacks erlaubt + erwünscht:** „gerädert", „müde gereizt", „heißer Kaffee" — Ad↔LP-Konsistenz.

---

## A. Tonalität-Pass `rettet/index.html`

### A.1 Hero
- **Suche:** Headline mit „kapern" / „leer aufwachen" / ähnlichen Metaphern
- **Ersetze:** `Warum ein „lauter" Abend deinen nächsten Tag zerstört` (Anführungsstriche um „lauter", kein Em-Dash)
- **Sub-Headline / Sub-Text** auf „gerädert aufwachen" / „müde, gereizt, Hals trocken" umstellen (Werbung-Callback)

### A.2 Hero-Tagline (Komma-Bug fixen!)
- **Suche:** `Was meinen Tag rettet,beginnt am Abend zuvor` ODER ähnlich ohne Leerzeichen nach Komma
- **Ersetze:** `Was meinen Tag rettet, beginnt am Abend zuvor` (Leerzeichen nach Komma — sonst Responsive-Bug: 3 Zeilen statt 2 auf Mobile)

### A.3 Sektion „Warum dein Abend laut bleibt"
- Kürzen (aktuell zu lang)
- Cortisol-Block + „Schlafsignal kommt nicht durch" **behalten** (sachlich, gut)
- **Suche:** `du wälzt dich, scrollst, wirst hellwach`
- **Ersetze:** `spätabends, du wälzt dich, bist am Handy, bleibst hellwach`
- **Suche:** `Jede Stunde stiehlt aus deiner Reserve für morgen`
- **Ersetze:** `stiehlt dir wichtige Reserven für morgen`
- Tiefschlaf-Block: „Die ersten Stunden sind die wertvollsten, ohne sie wachst du gerädert auf" **behalten**
- „Der Morgen bezahlt" **behalten**
- „Müde, gereizt, heißer Kaffee" **behalten**

### A.4 Sektion „Dein neuer Abend / 22 Uhr"
- **Suche:** `3 Minuten und der Abend bekommt eine Form`
- **Ersetze:** `3 Minuten und deine Routine startet`
- Markiere die ganze Sektion mit `<!-- TODO Sam: Sektion doppelt mit Hero, entscheiden ob streichen oder nach oben ziehen -->`

### A.5 Sektion „Hinter der Formel"
- **Suche** die 4 Pillars `Apotheker / Wissenschaft / Qualitätskontrolle / nicht anonym`
- **Ersetze** durch 3 Pillars: **`Wissenschaft + Qualität + Transparenz`** (mit Plus-Zeichen, nicht Komma)
- **Tagline obendrüber:** `Unsere Formel: Wissenschaft + Qualität + Transparenz`
- **Begründung im Kommentar:** „Apotheker" = Krankheits-Assoziation, „Kontrolle" = negativ, „nicht anonym" = semantisch leer.

### A.6 Sektion „3 Säulen / Eine Kapsel Slim"
- **Suche:** `Was nicht drin ist, hätte sonst für dich gefühlt entschieden`
- **Ersetze:** `Was wir weggelassen haben, ist genauso wichtig`
- Kleingedrucktes als Proof unter jeder Säule **behalten**

### A.7 Sektion „Testimonials"
- **Suche + entfernen:** Überschrift `Was andere über ...`
- **Suche + entfernen:** Datums-Stamps `vor 6 Tagen` / `vor 2 Wochen` / ähnlich
- Testimonial-Text-Stil: entspannter, nicht-kommerziell — wenn unklar, 3 Varianten in `COPY-VARIANTS.md` für Sam-Review
- „Jetzt ansehen"-Button **behalten**

### A.8 Kleinigkeiten
- **Suche + entfernen:** `Jederzeit pausieren` (unter „Ruhe ausprobieren") — macht keinen Sinn
- **Suche + neu schreiben:** Sektionen `Was wir versprechen` + `Worauf du dich verlässt`
- **Suche + entfernen:** Whitespace-Block / leerer Spacer nach „Einladung auf deinen Markenkopf"

---

## B. Strukturelle Änderungen

### B.1 Preis-Tile
- **Suche:** Preis-Angabe `Ab 1€` (zu großzügig abgerundet)
- **Ersetze:** `Ab 1,17€ pro Abend` (4er-Variante, präzise)
- **Suche:** `statt 3× einzelne Präparate` (oder ähnlich)
- **Ersetze:** `statt 14 Einzelpräparate`
- **CAPS-Highlight:** `14 Inhaltsstoffe in EINER Kapsel` — „EINER" als CAPS/fett

### B.2 Reihenfolge
- **„Hinter der Formel"** Sektion nach unten verschieben → als letzter Proof, nicht früh im Flow
- **„3 Säulen / Eine Kapsel Slim"** evtl. vor „Hinter der Formel" platzieren (Sam-Review nötig — als HTML-Kommentar markieren)
- **Bewertungen-Block** nach unten

### B.3 Aussagen-Quellen
- Alle zitierten Sätze / Studien-Verweise mit `<!-- TODO Sam: Quelle prüfen, evtl. erfunden -->` markieren

---

## C. Animation + Responsive

### C.1 Hero-Animation
- Hero-Sektion soll beim Scrollen kurz **gepinnt** bleiben, dann weiter (Scroll-Pinning/Sticky-Effect)
- Aktuell: kaputt + scrollt zu schnell durch
- Mobile: gleiche Logik wie Desktop, langsamer als aktuell
- Falls GSAP / Locomotive vorhanden: `ScrollTrigger.pin: true` mit `end: "+=100%"` als Startwert, dann fine-tunen

### C.2 Universal Responsive-Rule (ab jetzt für alle Sektionen)
- **Text-Container fixieren.** `max-width` auf Box, `font-size` skaliert via clamp() — niemals Text untereinander staffeln.
- Beispiel-Pattern:
  ```css
  .hero-headline {
    max-width: 720px;
    font-size: clamp(1.5rem, 4vw, 3rem);
    text-wrap: balance;
  }
  ```
- Vor jedem Push: Screenshot 320/768/1024/1440 prüfen.

---

## D. Tracking — Button-Tags (KRITISCH)

Das ist DIE wichtigste Daten-Quelle. Wir wissen aktuell nicht, wo Leute zwischen LP-Stöbern und Kaufseite abspringen.

### D.1 Tag-Schema (für jeden Button)
Jeder `<button>`, `<a>`, klickbare `<div>` bekommt diese `data-track-*` Attribute:

```html
<a
  data-track-lp="rettet"
  data-track-section="hero|preis|säulen|formel|testimonials|cta"
  data-track-cta-type="primary|secondary|sticky"
  data-track-position="above_fold|below_fold"
  data-track-target="shop|anchor|manychat|scroll"
  data-track-label="kaufseite-hero-primary"
>
  Jetzt bestellen
</a>
```

### D.2 Event-Layer (zentral)
- Neue Datei `scripts/tracking.js` anlegen
- Beim DOMContentLoaded: alle `[data-track-lp]` Elemente registrieren
- Click-Handler feuert ein Event mit allen `data-track-*` Werten an:
  - **GA4** (gtag): `gtag('event', 'lp_click', { lp_id, section, cta_type, position, target, label })`
  - **Clarity** (clarity): `clarity('event', 'lp_click_${section}_${target}')`
  - **Optional:** Server-Beacon an `/api/track` für eigenes Dashboard (preppilot)

### D.3 Pflicht-Events (zusätzlich zu Click)
- `lp_view` (beim Page-Load, mit `lp_id`)
- `scroll_depth_25`, `scroll_depth_50`, `scroll_depth_75`, `scroll_depth_100`
- `kaufseite_redirect` (separates Event, **MUSS** bei jedem Übergang LP→offizielle Kaufseite feuern — größter Drop-Off-Punkt)

### D.4 Bestehende Buttons taggen
Geh die LP komplett durch und tagge:
- Hero-CTA (primary)
- Preis-Tile-CTAs
- Sticky-CTA (falls vorhanden)
- Testimonials „Jetzt ansehen"
- Footer-CTAs
- ManyChat-Trigger
- Anchor-Scroll-Buttons (z.B. „mehr erfahren")

---

## E. Copy-Varianten ablegen

Für jede neu geschriebene Sektion (nicht nur 1:1-Replaces) **3 Varianten** in neue Datei `rettet/COPY-VARIANTS.md` schreiben — Sam wählt aus.

Format:
```markdown
## Sektion: <name>

### Variante A
<text>

### Variante B
<text>

### Variante C
<text>
```

Hard-Brief für die Varianten: „Einfach, menschlich, keine Metaphern, keine Anglizismen, keine kommerzielle Klingelei."

---

## F. Acceptance-Check (vor Pull-Request)

- [ ] Kein englisches Wort in `rettet/index.html` (außer Marken-Eigennamen)
- [ ] Keine Metaphern aus der Anti-Pattern-Liste in Sektion 0
- [ ] Alle Find→Replace aus Sektion A erledigt
- [ ] Preis-Tile auf 1,17€ + „14 Einzelpräparate" + „EINER" CAPS
- [ ] „Hinter der Formel" Pillars = `Wissenschaft + Qualität + Transparenz`
- [ ] Hero-Animation funktioniert + Mobile getestet
- [ ] Text-Container nirgendwo gestaffelt (320/768/1024/1440 Screenshots)
- [ ] Jeder Button hat `data-track-*` Attribute
- [ ] `scripts/tracking.js` registriert + GA4 + Clarity Events feuern
- [ ] `kaufseite_redirect` Event feuert bei LP→Kaufseite-Übergang
- [ ] `rettet/COPY-VARIANTS.md` mit 3 Varianten pro neu geschriebener Sektion
- [ ] HTML-Kommentare `<!-- ORIG: ... -->` und `<!-- TODO Sam: ... -->` an offenen Stellen

---

**Cross-Ref:** preppilot-Repo `docs/landingpage-briefing-2026-05-20.md` (gleicher Inhalt, conversational Format).
