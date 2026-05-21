# LP-Launch-Checkliste

Punkt fuer Punkt was VOR jedem Live-Schalten einer neuen zZzlim-LP gepruefet wird.
Erst alle Haken, dann Push auf `master`.

**Wer:** Builder. **Wann:** unmittelbar vor Production-Push einer neuen LP.
**Pendant-Doku:** [.claude/skills/lp-tracking-client/SKILL.md](../.claude/skills/lp-tracking-client/SKILL.md)

---

## 1 · Repo + Folder

- [ ] Folder `LPSLUG/` aus `rettet/` kopiert (oder eigene Vorlage)
- [ ] `LPSLUG/index.html` exists mit `<base href="../" />` im Head
- [ ] Folder enthaelt nur LP-spezifische Files (Hero-Background, etc.) — Shared-Assets liegen im Repo-Root und werden ueber `<base>` aufgeloest

## 2 · HTML-Head

- [ ] `<title>`, `<meta name="description">`, OG-Tags, Twitter-Card auf den LP-Cluster gemuenzt
- [ ] `<link rel="canonical">`, `hreflang`-Alternates auf die finale Domain
- [ ] JSON-LD aktualisiert: `Product` + `Organization` + `FAQPage` (Fragen 1:1 zur sichtbaren FAQ-Sektion)
- [ ] `aggregateRating.reviewCount` UND Hero-Rating-Text zeigen dieselbe Zahl (aktuell `2847+`, Quelle: Shopify-Reviews)
- [ ] Favicon-`<link rel="icon">` gesetzt

## 3 · Body + Tracking-Marker

- [ ] `<body data-lp="LPSLUG" data-lp-variant="default">` (Slug = Subdomain ohne `.zzzlim.de`)
- [ ] `<script src="scripts/tracking.js" defer></script>` im `<head>` oder am Body-Ende
- [ ] Alle CTAs haben:
  - `data-cta="..."` (eindeutiger Identifier, z.B. `hero`, `mid`, `final`, `sticky`)
  - `data-track-section="..."` (id der umgebenden Section)
  - `data-track-position="..."` (`above_fold` / `below_fold` / `sticky` / `header`)
  - `data-track-target="..."` (`shop` fuer Outbound, sonst Section-Ziel)
  - `data-track-label="..."` (menschlich lesbarer Click-Label)
- [ ] FAQ-Items als `<details>` ODER `.faq-item`-Pattern (Skill-Code erkennt beide)
- [ ] Sticky-Mobile-CTA hat `data-cta="sticky"`
- [ ] Outbound-Shop-Links zeigen direkt auf `https://zzzlim.de/products/...` **ohne** manuelle UTM-Tags — das SDK haengt UTM + Click-IDs + `lp_id` automatisch an

## 4 · Analytics-IDs

- [ ] GA4-Property-ID im `<head>`-Loader ist die der LP (nicht die einer anderen LP versehentlich kopiert)
- [ ] Pixel-ID bleibt `2028396997989291` (zentral fuer alle LPs, Audience-Filter laeuft ueber `lp_id`)
- [ ] Clarity-Tag-ID ggf. neu pro LP — sonst zentral

## 5 · i18n

- [ ] Alle sichtbaren Strings haben `data-i18n="LPSLUG.<section>.<key>"`-Attribute
- [ ] LP-spezifisches Dict-File angelegt unter `LPSLUG/i18n-LPSLUG.js`
- [ ] Drei Sprachen: DE / EN / TR komplett uebersetzt (kein „TODO translate")
- [ ] Script-Tag-Reihenfolge: `i18n.js` → `LPSLUG/i18n-LPSLUG.js` → tracking, alle `defer`

## 6 · Vercel-Routing

- [ ] `middleware.js`: Eintrag `'LPSLUG.zzzlim.de': '/LPSLUG'` ergaenzt
- [ ] Lokal getestet mit `bunx serve . -p 8787` → `http://localhost:8787/LPSLUG/` rendert
- [ ] In Vercel-Dashboard: Custom-Domain `LPSLUG.zzzlim.de` zum Projekt `landingpage-26-maerz` hinzugefuegt
- [ ] DNS bei Registrar: CNAME `LPSLUG` → `cname.vercel-dns.com`, TTL 300s
- [ ] SSL-Status in Vercel = gruen

## 7 · Smoke-Test mit `?debug=1`

```
https://LPSLUG.zzzlim.de/?debug=1
```

DevTools-Console muss zeigen:

- [ ] `[zzz] tracking SDK loaded` mit `lp: { id: "LPSLUG", variant: "default" }`
- [ ] `[zzz] lp_view` direkt beim Laden
- [ ] `[zzz] section_view section: <id>` beim Scrollen durch jede Section
- [ ] `[zzz] scroll_depth_25`, `_50`, `_75`, `_100` beim Komplett-Durchscrollen
- [ ] Click auf SHOP-Button: `[zzz] lp_click` → `[zzz] kaufseite_redirect` → `[zzz] fbq InitiateCheckout`
- [ ] FAQ-Item oeffnen: `[zzz] faq_open question: "..."`
- [ ] Tab schliessen: `[zzz] section_dwell` fuer alle besuchten Sections (im `pagehide`)

## 8 · Mobile-Smoke-Test

Realer Test auf iOS Safari + Android Chrome (nicht nur DevTools-Toolbar).

- [ ] Hero rendert ohne horizontalen Scroll, kein Content hinter Sticky-Header versteckt
- [ ] Tap-Targets >= 44x44px (CTAs, Nav, FAQ-Toggle, Lang-Switcher)
- [ ] Scroll-Hijack-Sektionen (Kreislauf, Routine, Testimonials, Authority) sind smooth, keine Sticky-Killer
- [ ] Cookie-Consent-Banner blockt nichts Wichtiges, ist von Hand schliessbar
- [ ] Refresh → landet immer im Hero (nicht in einer Sticky-Sektion mitten in der Seite)
- [ ] Sticky-Mobile-Buy-CTA sichtbar ab unter-Hero-Scroll, klickbar, fuehrt zum Shop

## 9 · Visual + Copy

- [ ] Keine Bindestriche („-") in sichtbarer Copy. Echte Em-Dashes oder eigene Worte.
- [ ] Umlaute korrekt: ä/ö/ü, kein ae/oe/ue in UI-Texten
- [ ] EU-Health-Claims-konform: jede Wirk-Aussage hat Sternchen + Disclaimer
- [ ] Footer-Links zu Impressum / Datenschutz / AGB fuehren zu `zzzlim.de/policies/*` (nicht Subdomain)
- [ ] Logo-Click + Header-Nav-Links scrollen sauber zur Section, NICHT zur Parent-LP (Anchor-Hijack-JS aktiv)

## 10 · Performance

- [ ] Hero-Hintergrund-Bilder optimiert: WebP wo moeglich, <500 KB pro Bild
- [ ] Below-Fold-Bilder haben `loading="lazy"`, oben-bleibt `fetchpriority="high"`
- [ ] Keine 5+ MB PNGs (Final-CTA-Lesson learned)
- [ ] Lighthouse-Score auf Mobile: Performance >= 80, Accessibility >= 90

## 11 · Cross-Repo / Dashboard

- [ ] PrepPilot-Skill `lp-tracking-backend` notified: `KNOWN_LPS`-Array in `lp-funnel-panel.tsx` ergaenzt um neuen `LPSLUG`
- [ ] Erste Events nach 5 Min Traffic im PrepPilot-Dashboard sichtbar (LP-Funnel-Panel filtert nach `lp_id=LPSLUG`)

## 12 · Final

- [ ] Branch gemergt nach `master`
- [ ] Vercel-Production-Deploy „READY"
- [ ] Eine letzte Live-Runde durch die LP — Desktop + Mobile, alle CTAs durchgeklickt

---

**Wenn alle Haken stehen:** push announcen, Sam fuer Dashboard-Verify pingen, Ads aktivieren.

**Bei Zweifel:** lieber `?debug=1` noch eine Iteration laufen lassen als kaputt live gehen. Wiederherstellbar ist auch nur, was im Git ist.
