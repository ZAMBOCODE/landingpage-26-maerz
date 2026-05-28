# COPY-VARIANTS — energie.zzzlim.de

**Briefing-Bezug:** [`BRIEFING-energie-lp-2026-05-28.md`](../BRIEFING-energie-lp-2026-05-28.md)
**Skelett-Source:** `rettet/` (kopiert + adaptiert 2026-05-28).
**Launch-Strategie:** V1-Only. Nach 500 Views Performance prüfen. Bei `outbound_to_product < 2%` → V2 + V3 nachschieben und A/B aktivieren.
**Hard-Brief:** Einfach, menschlich, keine Metaphern, keine Anglizismen. Mutter-Test (60+, kaum Englisch).

---

## Adaptierte Sektionen (ENERGIE-Pivot)

Diese Sektionen wurden gegen rettet/ inhaltlich verändert — sie tragen die Pain-Bridge zum ENERGIE-Reel + Karussell + Story (alle 2026-05-28).

### Hero — H1 (aktiv im HTML)
```
Du hast kein Kaffee-Problem. Du hast ein Adenosin-Problem.
```

### Hero — Sub (aktiv im HTML)
```
Drei Tassen, immer noch müde. Was du als Müdigkeit spürst, hat einen Namen.
```

### Kreislauf — H2 (aktiv im HTML)
```
Wie Adenosin den Tag steuert — und warum Kaffee es nicht löst.
```

### Kreislauf — Step 1 (Tagsüber)
```
Label: Adenosin baut sich auf
Desc:  Mit jeder Stunde sammelt sich mehr Adenosin in deinem Gehirn. Es dockt an
       Rezeptoren an. Je voller die Rezeptoren, desto müder fühlst du dich.
```

### Kreislauf — Step 2 (Morgens)
```
Label: Kaffee blockiert die Rezeptoren
Desc:  Coffein passt rein zufällig in dieselben Rezeptoren wie Adenosin. Es setzt
       sich davor und blockiert das Müdigkeits-Signal. Aber das Adenosin ist noch da.
```

### Kreislauf — Step 3 (Nachmittags)
```
Label: Der Coffein-Crash
Desc:  Nach vier bis sechs Stunden ist das Coffein abgebaut. Alle Rezeptoren springen
       auf einmal frei. Das gestaute Adenosin überflutet sie. Du brauchst die nächste Tasse.
```

### Kreislauf — Step 4 (Nachts)
```
Label: Tiefschlaf räumt aus
Desc:  Nur in der tiefen Non-REM-Phase spült dein Gehirn Adenosin über das glymphatische
       System raus. Ist diese Phase zu kurz, beginnt der Tag mit Restmüdigkeit.
```

---

## Generisch beibehaltene Sektionen

Diese sind 1:1 wie rettet/ — das Produkt deckt mehr ab als nur den Adenosin-Winkel, deshalb bleibt der untere Funnel breit:

- Testimonials Q1-Q4 (4 Stimmen aus DACH-Mix)
- Routine 22:00 / 22:30 / 06:30 (Drei-Minuten-Routine)
- Produkt-Info „Unterstützung für deine Abendroutine"
- In-Zahlen 14 / 60 / 1,17 € / 100 %
- Authority (Wissenschaft + Qualität + Transparenz)
- 3 Säulen (Schlafbeginn / Stoffwechsel / Vitalität)
- Vergleichstabelle
- Final-CTA „Bereit, dein Leben wieder in eigenen Händen zu tragen?"
- FAQ (9 Items, identisch zu rettet)
- Footer

Wenn du eine dieser Sektionen ENERGIE-spezifisch willst, sag „Sektion X → ENERGIE" und ich tausche.

---

## Tracking

- `data-track-lp="energie"` an allen CTAs
- `data-utm-content="final_cta_energie"` für den Final-CTA-Button
- ManyChat-Bridge-LP nutzt `utm_content=bridge-lp-{story|karussell|reel}` zur Cross-Channel-Attribution (siehe Brief Sec. 7)

---

## A/B-Plan (nach 500 Views)

Wenn `outbound_to_product < 2 %`, drei Varianten pro Hero-Block testen:

### Hero — H1 V2 (Wissens-Curiosity)
```
Adenosin. Niemand sagt es dir.
```

### Hero — H1 V3 (Identifikation)
```
Drei Kaffees am Morgen. Immer noch müde.
```

### Hero — Sub Alt 1
```
Kaffee blockiert dein Müdigkeits-Signal nur. Räumt es nicht weg.
```

### Hero — Sub Alt 2
```
Was Kaffee versteckt — und was nachts wirklich aufräumt.
```
