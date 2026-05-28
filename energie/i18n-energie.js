/* ══════════════════════════════════════════════
   energie/i18n-energie.js
   Extends the global `translations` dict (defined in /i18n.js) with
   energie-LP-specific keys (energie.*) for DE / EN / TR.
   Loaded after i18n.js (defer order) so `translations` exists,
   and before DOMContentLoaded so applyLanguage() picks up the merged dict.
   ══════════════════════════════════════════════ */
(function(){
  if (typeof translations === 'undefined') return;

  // Keys whose value contains HTML (br, strong, span) — must be set via innerHTML
  if (typeof htmlKeys !== 'undefined') {
    ['energie.zahlen.l1','energie.zahlen.l2','energie.zahlen.l3','energie.zahlen.l4',
     'energie.auth.h2'
    ].forEach(function(k){ htmlKeys.add(k); });
  }

  var R = {
    de: {
      // Hero
      'energie.hero.h1': 'Du hast kein Kaffee-Problem. Du hast ein Adenosin-Problem.',
      'energie.hero.sub': 'Drei Tassen, immer noch müde. Was du als Müdigkeit spürst, hat einen Namen.',
      'energie.hero.cta': 'Jetzt ansehen',

      // Kreislauf
      'energie.kr.h2': 'Wie Adenosin den Tag steuert — und warum Kaffee es nicht löst.',
      'energie.kr.s1.time': 'Tagsüber',
      'energie.kr.s1.label': 'Adenosin baut sich auf',
      'energie.kr.s1.desc': 'Mit jeder Stunde sammelt sich mehr Adenosin in deinem Gehirn. Es dockt an Rezeptoren an. Je voller die Rezeptoren, desto müder fühlst du dich.',
      'energie.kr.s2.time': 'Morgens',
      'energie.kr.s2.label': 'Kaffee blockiert die Rezeptoren',
      'energie.kr.s2.desc': 'Coffein passt rein zufällig in dieselben Rezeptoren wie Adenosin. Es setzt sich davor und blockiert das Müdigkeits-Signal. Aber das Adenosin ist noch da.',
      'energie.kr.s3.time': 'Nachmittags',
      'energie.kr.s3.label': 'Der Coffein-Crash',
      'energie.kr.s3.desc': 'Nach vier bis sechs Stunden ist das Coffein abgebaut. Alle Rezeptoren springen auf einmal frei. Das gestaute Adenosin überflutet sie. Du brauchst die nächste Tasse.',
      'energie.kr.s4.time': 'Nachts',
      'energie.kr.s4.label': 'Tiefschlaf räumt aus',
      'energie.kr.s4.desc': 'Nur in der tiefen Non-REM-Phase spült dein Gehirn Adenosin über das glymphatische System raus. Ist diese Phase zu kurz, beginnt der Tag mit Restmüdigkeit.',

      // Testimonials
      'energie.tm.h2': 'Die Erfahrungen.',
      'energie.tm.q1': '„hab das jetzt drei wochen genommen, und ehrlich, mein mann hat zuerst gemerkt, dass ich morgens nicht mehr brumme. das war eigentlich der moment."',
      'energie.tm.q2': '„Ich war ehrlich gesagt skeptisch. Meine Frau hat das Päckchen geöffnet und reingelegt. Nach zwei Wochen war ich plötzlich nicht mehr um halb vier wach. das reicht mir."',
      'energie.tm.q3': '„Ich hatte das ehrlich gesagt nicht erwartet. Seit ich abends eine Kapsel nehm, hab ich einfach wieder einen Rhythmus. Mein Körper weiß wieder wann er rüber soll."',
      'energie.tm.q4': '„Über Schlafmittel hatte ich nie viel gehalten. Das hier ist auch keins, sondern ein Ergänzungsmittel. Macht halt nicht knock-out, sondern man kommt einfach runter. das wars."',

      // CTAs / shared
      'energie.cta.try': 'In Ruhe ausprobieren',
      'energie.cta.guarantee': '60 Tage Geld-zurück, ohne Rückfragen',

      // Zahlen (HTML)
      'energie.zahlen.lead': 'Vier Zahlen, die unser Versprechen tragen.',
      'energie.zahlen.l1': 'Inhaltsstoffe<br>in <strong>EINER</strong> Kapsel',
      'energie.zahlen.l2': 'Tage<br>Geld-zurück-Garantie',
      'energie.zahlen.l3': 'pro Abend<br>statt 14 Einzelpräparate',
      'energie.zahlen.l4': 'vegan, ohne<br>künstliche Zusätze',

      // Authority
      'energie.auth.h2': 'Unsere Formel: <span class="authority-plus">Wissenschaft + Qualität + Transparenz</span>',
      'energie.auth.q1': '„Die Dosierungen orientieren sich an EFSA-Empfehlungen. Wir nutzen nur, was im EU-Wortlaut zugelassen ist."',
      'energie.auth.q2': '„Jede Charge wird unabhängig auf Reinheit und Mengen geprüft. Werte werden dokumentiert und sind einsehbar."',
      'energie.auth.q3': '„Was im Wortlaut der EU-Verordnung steht, steht auch auf unserer Verpackung. Nichts darüber, nichts darunter."',
      'energie.auth.t1': 'Wissenschaft · Formulierung',
      'energie.auth.t2': 'Qualität · externe Chargen-Prüfung',
      'energie.auth.t3': 'Transparenz · HCVO-konforme Auslobung',

      // Routine (22 Uhr)
      'energie.ra.h2': 'Drei Minuten, und deine Routine startet.',
      'energie.ra.sub': 'Keine Methode, keine 30-Schritte-App. Eine kleine Verschiebung in den Stunden vor dem Schlafen.',
      'energie.ra.s1.h': 'Das letzte Licht wird wärmer.',
      'energie.ra.s1.p': 'Helle Decken-Lampen aus. Eine kleine Lampe, warm getöntes Licht, vielleicht ein Buch. Dein Körper liest das als „Tag ist vorbei."',
      'energie.ra.s2.h': 'Eine Kapsel zZzlim®, ein Glas Wasser.',
      'energie.ra.s2.p': 'Melatonin braucht ca. 30 Minuten, um die Einschlafschwelle abzusenken.* Du musst nichts tun. Du gibst deinem Körper nur das Signal, das ihm im Stress fehlt.',
      'energie.ra.s3.h': 'Der Morgen fängt anders an.',
      'energie.ra.s3.p': 'Kein Wunder, kein Knock-out. Der Wecker klingelt, und du musst nicht erst eine Stunde lang ins Leben zurückkriechen.',
      'energie.ra.disclaimer': '*Melatonin trägt zur Verkürzung der Einschlafzeit bei (EU-Verordnung 432/2012). Wirkung tritt ein bei einer Aufnahme von 1 mg kurz vor dem Schlafengehen.',

      // Vergleich
      'energie.vg.h2': 'Eine durchdachte Kombination für deine nächtliche Routine',

      // Final CTA
      'energie.fcta.h2': 'Bereit, dein Leben wieder in eigenen Händen zu tragen?',
      'energie.fcta.lead': 'Eine Packung. 30 Tage.',

      // FAQ
      'energie.faq.h2': 'Häufige Fragen',
      'energie.faq.intro': 'Antworten auf das, was Frauen mit Wechseljahres- und Cortisol-Müdigkeit am häufigsten fragen.',
      'energie.faq.contact': 'Noch Fragen? Schreib uns an info@zzzlim.de',
      'energie.faq.q1': 'Wie schnell merke ich was?',
      'energie.faq.a1': 'Das ist individuell. Viele berichten subjektiv nach 3 bis 7 Nächten von einem leichteren Übergang in den Schlaf. Wir versprechen kein Wunder über Nacht, das wäre unseriös. Gib deinem Körper 14 Tage Zeit, ehrlich zu antworten.',
      'energie.faq.q2': 'Was ist drin und warum?',
      'energie.faq.a2': '14 Inhaltsstoffe mit Fokus auf den Abend: Melatonin (trägt zur Verkürzung der Einschlafzeit bei), L-Tryptophan, Safran-Extrakt, Vitamin B12 (trägt zur Verringerung von Müdigkeit und Ermüdung bei), Zink (trägt zu einer normalen Funktion des Immunsystems bei) und Chrom (trägt zur Aufrechterhaltung eines normalen Blutzuckerspiegels bei). Plus B-Komplex, Niacin, Biotin, Pantothensäure und Nopal-Kaktus-Pulver.',
      'energie.faq.q3': 'Kann ich das langfristig nehmen?',
      'energie.faq.a3': 'Ja. zZzlim® ist ein Nahrungsergänzungsmittel und kein Medikament. Es enthält keine Stoffe mit Abhängigkeitspotenzial und ist für dauerhafte Einnahme konzipiert. Du kannst jederzeit aufhören oder pausieren.',
      'energie.faq.q4': 'Wechseljahre oder Cortisol-Müdigkeit, passt das für mich?',
      'energie.faq.a4': 'Genau für diese Phase haben viele Frauen aus unserer Community zZzlim® zum ersten Mal probiert. Wir versprechen dir keine hormonelle Lösung. Was wir anbieten: eine Abendkapsel, die den Übergang in die Nacht ein Stück weicher machen kann.',
      'energie.faq.q5': 'Was, wenn ich es nicht vertrage oder es nicht wirkt?',
      'energie.faq.a5': 'Du hast 30 Tage Zeit, in Ruhe auszuprobieren. Wenn du nicht zufrieden bist, schreib uns kurz an info@zzzlim.de und wir erstatten dir den vollen Kaufpreis. Ohne Wenn und Aber.',
      'energie.faq.q6': 'Wann und wie nehme ich zZzlim® ein?',
      'energie.faq.a6': 'Eine Kapsel täglich, etwa 30 Minuten vor dem Schlafengehen, mit einem Glas Wasser.',
      'energie.faq.q7': 'Bin ich zu alt dafür?',
      'energie.faq.a7': 'Nein. zZzlim® ist speziell für Menschen entwickelt, deren Schlafqualität mit dem Alter nachlässt. Unsere ältesten zufriedenen Kundinnen und Kunden sind über 80.',
      'energie.faq.q8': 'Kann ich zZzlim® mit anderen Medikamenten nehmen?',
      'energie.faq.a8': 'Wenn du regelmäßig Medikamente einnimmst, sprich vorher mit deinem Arzt oder Apotheker. Das gilt besonders bei Blutverdünnern oder Schilddrüsenmedikamenten.',
      'energie.faq.q9': 'Ist zZzlim® auch für Schwangere geeignet?',
      'energie.faq.a9': 'Während Schwangerschaft und Stillzeit empfehlen wir, vor der Einnahme Rücksprache mit dem Arzt zu halten. Die enthaltenen Inhaltsstoffe sind natürlich, aber Sicherheit geht immer vor.'
    },

    en: {
      'energie.hero.h1': 'Why your evening ruins the next day.',
      'energie.hero.sub': 'Tired, irritable and completely drained.',
      'energie.hero.cta': 'See how',

      'energie.kr.h2': 'How your evening can wreck your morning.',
      'energie.kr.s1.time': 'Evening',
      'energie.kr.s1.label': 'Stress doesn\'t wind down',
      'energie.kr.s1.desc': 'Cortisol stays high, the sleep signal doesn\'t get through. Your mind keeps going while your body wants to rest.',
      'energie.kr.s2.time': 'Late evening',
      'energie.kr.s2.label': 'The falling-asleep threshold is too high',
      'energie.kr.s2.desc': 'You toss and turn, scroll your phone, stay wide awake. It steals the reserves you need for tomorrow.',
      'energie.kr.s3.time': 'Deep sleep',
      'energie.kr.s3.label': 'The window is missed',
      'energie.kr.s3.desc': 'The first hours are the most valuable. Without them you wake up wrecked.',
      'energie.kr.s4.time': 'Next morning',
      'energie.kr.s4.label': 'The morning pays the price',
      'energie.kr.s4.desc': 'Tired, irritable, even hot coffee doesn\'t help. The day starts broken.',

      'energie.tm.h2': 'Real experiences.',
      'energie.tm.q1': '„been taking this for three weeks, and honestly, my husband noticed first that I don\'t grumble in the morning anymore. that was the moment."',
      'energie.tm.q2': '„I was honestly skeptical. My wife opened the package and put it in front of me. After two weeks I suddenly wasn\'t awake at half past three anymore. that\'s enough for me."',
      'energie.tm.q3': '„I honestly hadn\'t expected it. Since I take a capsule in the evening, I simply have a rhythm again. My body knows again when it should switch off."',
      'energie.tm.q4': '„I never thought much of sleeping pills. This isn\'t one either, it\'s a supplement. Doesn\'t knock you out, you just wind down. that\'s it."',

      'energie.cta.try': 'Try it without pressure',
      'energie.cta.guarantee': '60 days money-back, no questions asked',

      'energie.zahlen.lead': 'Four numbers that carry our promise.',
      'energie.zahlen.l1': 'ingredients<br>in <strong>ONE</strong> capsule',
      'energie.zahlen.l2': 'days<br>money-back guarantee',
      'energie.zahlen.l3': 'per evening<br>instead of 14 single supplements',
      'energie.zahlen.l4': 'vegan, no<br>artificial additives',

      'energie.auth.h2': 'Our formula: <span class="authority-plus">Science + Quality + Transparency</span>',
      'energie.auth.q1': '„Dosages follow EFSA recommendations. We only use what is approved under EU regulation."',
      'energie.auth.q2': '„Every batch is independently tested for purity and quantity. Values are documented and can be reviewed."',
      'energie.auth.q3': '„What\'s written in EU regulation is what\'s written on our packaging. Nothing more, nothing less."',
      'energie.auth.t1': 'Science · Formulation',
      'energie.auth.t2': 'Quality · External batch testing',
      'energie.auth.t3': 'Transparency · HCVO-compliant claims',

      'energie.ra.h2': 'Three minutes, and your routine starts.',
      'energie.ra.sub': 'No method, no 30-step app. A small shift in the hours before sleep.',
      'energie.ra.s1.h': 'The last light gets warmer.',
      'energie.ra.s1.p': 'Bright ceiling lamps off. A small lamp, warm-toned light, maybe a book. Your body reads it as „the day is over."',
      'energie.ra.s2.h': 'One capsule of zZzlim®, a glass of water.',
      'energie.ra.s2.p': 'Melatonin takes about 30 minutes to lower the falling-asleep threshold.* You don\'t have to do anything. You just give your body the signal it\'s missing under stress.',
      'energie.ra.s3.h': 'The morning starts differently.',
      'energie.ra.s3.p': 'No miracle, no knock-out. The alarm rings, and you don\'t have to crawl back into life for an hour first.',
      'energie.ra.disclaimer': '*Melatonin contributes to the reduction of time to fall asleep (EU Regulation 432/2012). Beneficial effect is obtained with a consumption of 1 mg close to bedtime.',

      'energie.vg.h2': 'A thoughtful combination for your nightly routine',

      'energie.fcta.h2': 'Ready to take your life back into your own hands?',
      'energie.fcta.lead': 'One pack. 30 days.',

      'energie.faq.h2': 'Frequently asked questions',
      'energie.faq.intro': 'Answers to what women with menopause- and cortisol-fatigue ask most often.',
      'energie.faq.contact': 'Still have questions? Write us at info@zzzlim.de',
      'energie.faq.q1': 'How quickly will I notice something?',
      'energie.faq.a1': 'It varies. Many report a lighter transition into sleep subjectively after 3 to 7 nights. We don\'t promise a miracle overnight, that would be dishonest. Give your body 14 days to answer honestly.',
      'energie.faq.q2': 'What\'s in it and why?',
      'energie.faq.a2': '14 ingredients with focus on the evening: melatonin (contributes to reducing time to fall asleep), L-tryptophan, saffron extract, vitamin B12 (contributes to reducing tiredness and fatigue), zinc (contributes to normal immune function) and chromium (contributes to normal blood-sugar levels). Plus B-complex, niacin, biotin, pantothenic acid and nopal-cactus powder.',
      'energie.faq.q3': 'Can I take this long-term?',
      'energie.faq.a3': 'Yes. zZzlim® is a dietary supplement, not a medication. It contains no substances with dependency potential and is designed for continuous use. You can stop or pause at any time.',
      'energie.faq.q4': 'Menopause or cortisol fatigue — is this right for me?',
      'energie.faq.a4': 'Exactly for this phase, many women in our community tried zZzlim® for the first time. We don\'t promise you a hormonal solution. What we offer: an evening capsule that can make the transition into the night a little softer.',
      'energie.faq.q5': 'What if I don\'t tolerate it or it doesn\'t work?',
      'energie.faq.a5': 'You have 30 days to try it in peace. If you\'re not satisfied, just write us briefly at info@zzzlim.de and we\'ll refund the full purchase price. No ifs, no buts.',
      'energie.faq.q6': 'When and how do I take zZzlim®?',
      'energie.faq.a6': 'One capsule daily, about 30 minutes before going to bed, with a glass of water.',
      'energie.faq.q7': 'Am I too old for this?',
      'energie.faq.a7': 'No. zZzlim® is specifically developed for people whose sleep quality decreases with age. Our oldest satisfied customers are over 80.',
      'energie.faq.q8': 'Can I take zZzlim® with other medications?',
      'energie.faq.a8': 'If you regularly take medications, talk to your doctor or pharmacist first. This applies especially to blood thinners or thyroid medications.',
      'energie.faq.q9': 'Is zZzlim® suitable for pregnant women?',
      'energie.faq.a9': 'During pregnancy and breastfeeding we recommend consulting your doctor before use. The ingredients are natural, but safety always comes first.'
    },

    tr: {
      'energie.hero.h1': 'Akşamın neden ertesi gününü mahvediyor.',
      'energie.hero.sub': 'Yorgun, sinirli ve tamamen bitkin.',
      'energie.hero.cta': 'Şimdi gör',

      'energie.kr.h2': 'Akşamın sabahını nasıl mahvedebilir.',
      'energie.kr.s1.time': 'Akşam',
      'energie.kr.s1.label': 'Stres dinmiyor',
      'energie.kr.s1.desc': 'Kortizol yüksek kalıyor, uyku sinyali geçmiyor. Vücudun mola isterken kafan devam ediyor.',
      'energie.kr.s2.time': 'Geç saat',
      'energie.kr.s2.label': 'Uykuya dalma eşiği çok yüksek',
      'energie.kr.s2.desc': 'Dönüp duruyorsun, telefondasın, hâlâ uyanıksın. Yarınki rezervlerinden çalıyor.',
      'energie.kr.s3.time': 'Derin uyku',
      'energie.kr.s3.label': 'Pencere kaçırılıyor',
      'energie.kr.s3.desc': 'İlk saatler en değerli olanlardır. Onlar olmadan paramparça uyanıyorsun.',
      'energie.kr.s4.time': 'Ertesi sabah',
      'energie.kr.s4.label': 'Bedelini sabah ödüyor',
      'energie.kr.s4.desc': 'Yorgun, sinirli, sıcak kahve bile yardımcı olmuyor. Gün daha başlarken bitik başlıyor.',

      'energie.tm.h2': 'Deneyimler.',
      'energie.tm.q1': '„üç haftadır kullanıyorum, ve dürüst söylemek gerekirse, eşim ilk önce sabahları artık homurdanmadığımı fark etti. o an oldu aslında."',
      'energie.tm.q2': '„Açıkçası şüpheciydim. Eşim paketi açıp önüme koydu. İki hafta sonra birden gece üç buçukta uyanmıyordum artık. bu bana yeter."',
      'energie.tm.q3': '„Doğrusu beklemiyordum. Akşamları bir kapsül aldığımdan beri tekrar bir ritmim var. Vücudum ne zaman dinleneceğini yine biliyor."',
      'energie.tm.q4': '„Uyku ilaçlarını hiç sevmedim. Bu da bir ilaç değil zaten, takviye. Bayıltmıyor, sadece sakinleştiriyor. işte bu kadar."',

      'energie.cta.try': 'Rahatça deneyin',
      'energie.cta.guarantee': '60 gün para iade garantisi, sorgusuz',

      'energie.zahlen.lead': 'Sözümüzü taşıyan dört rakam.',
      'energie.zahlen.l1': 'içerik<br><strong>BİR</strong> kapsülde',
      'energie.zahlen.l2': 'gün<br>para iade garantisi',
      'energie.zahlen.l3': 'akşam başına<br>14 ayrı takviye yerine',
      'energie.zahlen.l4': 'vegan, yapay<br>katkı maddesi yok',

      'energie.auth.h2': 'Formülümüz: <span class="authority-plus">Bilim + Kalite + Şeffaflık</span>',
      'energie.auth.q1': '„Dozajlar EFSA önerilerine göre belirlenmiştir. Yalnızca AB yönetmeliğinde onaylananı kullanıyoruz."',
      'energie.auth.q2': '„Her parti, saflık ve miktar açısından bağımsız olarak test edilir. Değerler belgelenir ve incelenebilir."',
      'energie.auth.q3': '„AB yönetmeliğinde yazan ne ise, ambalajımızda da o yazıyor. Ne fazla, ne eksik."',
      'energie.auth.t1': 'Bilim · Formülasyon',
      'energie.auth.t2': 'Kalite · Bağımsız parti testi',
      'energie.auth.t3': 'Şeffaflık · HCVO-uyumlu beyan',

      'energie.ra.h2': 'Üç dakika ve rutinin başlıyor.',
      'energie.ra.sub': 'Yöntem yok, 30 adımlık uygulama yok. Sadece uyumadan önceki saatlerde küçük bir değişim.',
      'energie.ra.s1.h': 'Son ışık daha sıcak olur.',
      'energie.ra.s1.p': 'Parlak tavan lambaları kapalı. Küçük bir lamba, sıcak tonlu ışık, belki bir kitap. Vücudun bunu „gün bitti" diye okur.',
      'energie.ra.s2.h': 'Bir kapsül zZzlim®, bir bardak su.',
      'energie.ra.s2.p': 'Melatoninin uykuya dalma eşiğini düşürmesi için yaklaşık 30 dakika gerekir.* Hiçbir şey yapman gerekmiyor. Sadece vücuduna stres altında eksik olan sinyali veriyorsun.',
      'energie.ra.s3.h': 'Sabah farklı başlar.',
      'energie.ra.s3.p': 'Mucize değil, bayıltma değil. Çalar saat çalar ve hayata geri sürünmek için bir saat geçirmen gerekmez.',
      'energie.ra.disclaimer': '*Melatonin uykuya dalma süresinin azaltılmasına katkıda bulunur (AB Yönetmeliği 432/2012). Etki, yatmadan kısa süre önce 1 mg alınmasıyla ortaya çıkar.',

      'energie.vg.h2': 'Gece rutinin için özenle tasarlanmış bir bileşim',

      'energie.fcta.h2': 'Hayatını yeniden kendi ellerinde tutmaya hazır mısın?',
      'energie.fcta.lead': 'Bir paket. 30 gün.',

      'energie.faq.h2': 'Sık sorulan sorular',
      'energie.faq.intro': 'Menopoz ve kortizol yorgunluğu yaşayan kadınların en sık sorduğu soruların yanıtları.',
      'energie.faq.contact': 'Hâlâ sorun mu var? Bize info@zzzlim.de adresinden yazın',
      'energie.faq.q1': 'Ne kadar sürede fark ederim?',
      'energie.faq.a1': 'Bu kişiseldir. Birçok kişi 3 ila 7 gece sonra uykuya daha rahat geçtiğini bildiriyor. Mucize vaat etmiyoruz, bu dürüst olmaz. Vücuduna dürüstçe yanıt vermesi için 14 gün ver.',
      'energie.faq.q2': 'İçinde ne var ve neden?',
      'energie.faq.a2': 'Akşama odaklı 14 içerik: melatonin (uykuya dalma süresinin azalmasına katkıda bulunur), L-triptofan, safran ekstresi, B12 vitamini (yorgunluk ve bitkinliğin azalmasına katkıda bulunur), çinko (bağışıklığın normal işleyişine katkıda bulunur) ve krom (normal kan şekeri seviyelerinin korunmasına katkıda bulunur). Ayrıca B-kompleks, niasin, biyotin, pantotenik asit ve nopal kaktüsü tozu.',
      'energie.faq.q3': 'Uzun süre alabilir miyim?',
      'energie.faq.a3': 'Evet. zZzlim® bir gıda takviyesidir, ilaç değildir. Bağımlılık yapıcı madde içermez ve sürekli kullanım için tasarlanmıştır. İstediğin zaman bırakabilir veya ara verebilirsin.',
      'energie.faq.q4': 'Menopoz veya kortizol yorgunluğu, bana uygun mu?',
      'energie.faq.a4': 'Tam bu dönem için topluluğumuzdaki birçok kadın zZzlim®\'i ilk kez denedi. Hormonal bir çözüm vaat etmiyoruz. Sunduğumuz: gece geçişini biraz yumuşatabilecek bir akşam kapsülü.',
      'energie.faq.q5': 'Tahammül edemezsem veya işe yaramazsa ne olur?',
      'energie.faq.a5': '30 gün rahatça deneme süren var. Memnun kalmazsan info@zzzlim.de adresinden kısa bir mesaj at, satın alma bedelini tam olarak iade ederiz. Şartsız.',
      'energie.faq.q6': 'zZzlim®\'i ne zaman ve nasıl alırım?',
      'energie.faq.a6': 'Günde bir kapsül, yatmadan yaklaşık 30 dakika önce, bir bardak suyla.',
      'energie.faq.q7': 'Bunun için çok mu yaşlıyım?',
      'energie.faq.a7': 'Hayır. zZzlim® özellikle yaşla birlikte uyku kalitesi düşen kişiler için geliştirilmiştir. En yaşlı memnun müşterilerimiz 80 yaşın üzerindedir.',
      'energie.faq.q8': 'zZzlim®\'i başka ilaçlarla birlikte alabilir miyim?',
      'energie.faq.a8': 'Düzenli ilaç kullanıyorsanız, önce doktorunuza veya eczacınıza danışın. Bu özellikle kan sulandırıcılar veya tiroid ilaçları için geçerlidir.',
      'energie.faq.q9': 'zZzlim® hamileler için uygun mu?',
      'energie.faq.a9': 'Hamilelik ve emzirme döneminde kullanmadan önce doktorunuza danışmanızı öneririz. İçerikler doğaldır, ama güvenlik her zaman önce gelir.'
    }
  };

  // Merge into the global `translations` object
  Object.keys(R).forEach(function(lang){
    if (!translations[lang]) translations[lang] = {};
    Object.assign(translations[lang], R[lang]);
  });
})();
