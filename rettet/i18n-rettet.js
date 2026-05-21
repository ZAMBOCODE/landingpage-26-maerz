/* ══════════════════════════════════════════════
   rettet/i18n-rettet.js
   Extends the global `translations` dict (defined in /i18n.js) with
   rettet-LP-specific keys (rettet.*) for DE / EN / TR.
   Loaded after i18n.js (defer order) so `translations` exists,
   and before DOMContentLoaded so applyLanguage() picks up the merged dict.
   ══════════════════════════════════════════════ */
(function(){
  if (typeof translations === 'undefined') return;

  // Keys whose value contains HTML (br, strong, span) — must be set via innerHTML
  if (typeof htmlKeys !== 'undefined') {
    ['rettet.zahlen.l1','rettet.zahlen.l2','rettet.zahlen.l3','rettet.zahlen.l4',
     'rettet.auth.h2'
    ].forEach(function(k){ htmlKeys.add(k); });
  }

  var R = {
    de: {
      // Hero
      'rettet.hero.h1': 'Warum dein Abend den nächsten Tag zerstört.',
      'rettet.hero.sub': 'Müde, gereizt und total kaputt.',
      'rettet.hero.cta': 'Jetzt ansehen',

      // Kreislauf
      'rettet.kr.h2': 'Wie dein Abend deinen Morgen zerstören kann.',
      'rettet.kr.s1.time': 'Abends',
      'rettet.kr.s1.label': 'Stress klingt nicht ab',
      'rettet.kr.s1.desc': 'Cortisol bleibt oben, das Schlafsignal kommt nicht durch. Dein Kopf macht weiter, obwohl der Körper Pause will.',
      'rettet.kr.s2.time': 'Spätabends',
      'rettet.kr.s2.label': 'Einschlaf-Schwelle zu hoch',
      'rettet.kr.s2.desc': 'Spätabends, du wälzt dich, bist am Handy, bleibst hellwach. Stiehlt dir wichtige Reserven für morgen.',
      'rettet.kr.s3.time': 'Tiefschlaf',
      'rettet.kr.s3.label': 'Das Fenster wird verpasst',
      'rettet.kr.s3.desc': 'Die ersten Stunden sind die wertvollsten. Ohne sie wachst du gerädert auf.',
      'rettet.kr.s4.time': 'Nächster Morgen',
      'rettet.kr.s4.label': 'Der Morgen bezahlt',
      'rettet.kr.s4.desc': 'Müde, gereizt, der heiße Kaffee macht\'s nicht besser. Der Tag fängt schon kaputt an.',

      // Testimonials
      'rettet.tm.h2': 'Die Erfahrungen.',
      'rettet.tm.q1': '„hab das jetzt drei wochen genommen, und ehrlich, mein mann hat zuerst gemerkt, dass ich morgens nicht mehr brumme. das war eigentlich der moment."',
      'rettet.tm.q2': '„Ich war ehrlich gesagt skeptisch. Meine Frau hat das Päckchen geöffnet und reingelegt. Nach zwei Wochen war ich plötzlich nicht mehr um halb vier wach. das reicht mir."',
      'rettet.tm.q3': '„Ich hatte das ehrlich gesagt nicht erwartet. Seit ich abends eine Kapsel nehm, hab ich einfach wieder einen Rhythmus. Mein Körper weiß wieder wann er rüber soll."',
      'rettet.tm.q4': '„Über Schlafmittel hatte ich nie viel gehalten. Das hier ist auch keins, sondern ein Ergänzungsmittel. Macht halt nicht knock-out, sondern man kommt einfach runter. das wars."',

      // CTAs / shared
      'rettet.cta.try': 'In Ruhe ausprobieren',
      'rettet.cta.guarantee': '60 Tage Geld-zurück, ohne Rückfragen',

      // Zahlen (HTML)
      'rettet.zahlen.lead': 'Vier Zahlen, die unser Versprechen tragen.',
      'rettet.zahlen.l1': 'Inhaltsstoffe<br>in <strong>EINER</strong> Kapsel',
      'rettet.zahlen.l2': 'Tage<br>Geld-zurück-Garantie',
      'rettet.zahlen.l3': 'pro Abend<br>statt 14 Einzelpräparate',
      'rettet.zahlen.l4': 'vegan, ohne<br>künstliche Zusätze',

      // Authority
      'rettet.auth.h2': 'Unsere Formel: <span class="authority-plus">Wissenschaft + Qualität + Transparenz</span>',
      'rettet.auth.q1': '„Die Dosierungen orientieren sich an EFSA-Empfehlungen. Wir nutzen nur, was im EU-Wortlaut zugelassen ist."',
      'rettet.auth.q2': '„Jede Charge wird unabhängig auf Reinheit und Mengen geprüft. Werte werden dokumentiert und sind einsehbar."',
      'rettet.auth.q3': '„Was im Wortlaut der EU-Verordnung steht, steht auch auf unserer Verpackung. Nichts darüber, nichts darunter."',
      'rettet.auth.t1': 'Wissenschaft · Formulierung',
      'rettet.auth.t2': 'Qualität · externe Chargen-Prüfung',
      'rettet.auth.t3': 'Transparenz · HCVO-konforme Auslobung',

      // Routine (22 Uhr)
      'rettet.ra.h2': 'Drei Minuten, und deine Routine startet.',
      'rettet.ra.sub': 'Keine Methode, keine 30-Schritte-App. Eine kleine Verschiebung in den Stunden vor dem Schlafen.',
      'rettet.ra.s1.h': 'Das letzte Licht wird wärmer.',
      'rettet.ra.s1.p': 'Helle Decken-Lampen aus. Eine kleine Lampe, warm getöntes Licht, vielleicht ein Buch. Dein Körper liest das als „Tag ist vorbei."',
      'rettet.ra.s2.h': 'Eine Kapsel zZzlim®, ein Glas Wasser.',
      'rettet.ra.s2.p': 'Melatonin braucht ca. 30 Minuten, um die Einschlafschwelle abzusenken.* Du musst nichts tun. Du gibst deinem Körper nur das Signal, das ihm im Stress fehlt.',
      'rettet.ra.s3.h': 'Der Morgen fängt anders an.',
      'rettet.ra.s3.p': 'Kein Wunder, kein Knock-out. Der Wecker klingelt, und du musst nicht erst eine Stunde lang ins Leben zurückkriechen.',
      'rettet.ra.disclaimer': '*Melatonin trägt zur Verkürzung der Einschlafzeit bei (EU-Verordnung 432/2012). Wirkung tritt ein bei einer Aufnahme von 1 mg kurz vor dem Schlafengehen.',

      // Vergleich
      'rettet.vg.h2': 'Eine durchdachte Kombination für deine nächtliche Routine',

      // Final CTA
      'rettet.fcta.h2': 'Bereit, dein Leben wieder in eigenen Händen zu tragen?',
      'rettet.fcta.lead': 'Eine Packung. 30 Tage.',

      // FAQ
      'rettet.faq.h2': 'Häufige Fragen',
      'rettet.faq.intro': 'Antworten auf das, was Frauen mit Wechseljahres- und Cortisol-Müdigkeit am häufigsten fragen.',
      'rettet.faq.contact': 'Noch Fragen? Schreib uns an info@zzzlim.de',
      'rettet.faq.q1': 'Wie schnell merke ich was?',
      'rettet.faq.a1': 'Das ist individuell. Viele berichten subjektiv nach 3 bis 7 Nächten von einem leichteren Übergang in den Schlaf. Wir versprechen kein Wunder über Nacht, das wäre unseriös. Gib deinem Körper 14 Tage Zeit, ehrlich zu antworten.',
      'rettet.faq.q2': 'Was ist drin und warum?',
      'rettet.faq.a2': '14 Inhaltsstoffe mit Fokus auf den Abend: Melatonin (trägt zur Verkürzung der Einschlafzeit bei), L-Tryptophan, Safran-Extrakt, Vitamin B12 (trägt zur Verringerung von Müdigkeit und Ermüdung bei), Zink (trägt zu einer normalen Funktion des Immunsystems bei) und Chrom (trägt zur Aufrechterhaltung eines normalen Blutzuckerspiegels bei). Plus B-Komplex, Niacin, Biotin, Pantothensäure und Nopal-Kaktus-Pulver.',
      'rettet.faq.q3': 'Kann ich das langfristig nehmen?',
      'rettet.faq.a3': 'Ja. zZzlim® ist ein Nahrungsergänzungsmittel und kein Medikament. Es enthält keine Stoffe mit Abhängigkeitspotenzial und ist für dauerhafte Einnahme konzipiert. Du kannst jederzeit aufhören oder pausieren.',
      'rettet.faq.q4': 'Wechseljahre oder Cortisol-Müdigkeit, passt das für mich?',
      'rettet.faq.a4': 'Genau für diese Phase haben viele Frauen aus unserer Community zZzlim® zum ersten Mal probiert. Wir versprechen dir keine hormonelle Lösung. Was wir anbieten: eine Abendkapsel, die den Übergang in die Nacht ein Stück weicher machen kann.',
      'rettet.faq.q5': 'Was, wenn ich es nicht vertrage oder es nicht wirkt?',
      'rettet.faq.a5': 'Du hast 30 Tage Zeit, in Ruhe auszuprobieren. Wenn du nicht zufrieden bist, schreib uns kurz an info@zzzlim.de und wir erstatten dir den vollen Kaufpreis. Ohne Wenn und Aber.',
      'rettet.faq.q6': 'Wann und wie nehme ich zZzlim® ein?',
      'rettet.faq.a6': 'Eine Kapsel täglich, etwa 30 Minuten vor dem Schlafengehen, mit einem Glas Wasser.',
      'rettet.faq.q7': 'Bin ich zu alt dafür?',
      'rettet.faq.a7': 'Nein. zZzlim® ist speziell für Menschen entwickelt, deren Schlafqualität mit dem Alter nachlässt. Unsere ältesten zufriedenen Kundinnen und Kunden sind über 80.',
      'rettet.faq.q8': 'Kann ich zZzlim® mit anderen Medikamenten nehmen?',
      'rettet.faq.a8': 'Wenn du regelmäßig Medikamente einnimmst, sprich vorher mit deinem Arzt oder Apotheker. Das gilt besonders bei Blutverdünnern oder Schilddrüsenmedikamenten.',
      'rettet.faq.q9': 'Ist zZzlim® auch für Schwangere geeignet?',
      'rettet.faq.a9': 'Während Schwangerschaft und Stillzeit empfehlen wir, vor der Einnahme Rücksprache mit dem Arzt zu halten. Die enthaltenen Inhaltsstoffe sind natürlich, aber Sicherheit geht immer vor.'
    },

    en: {
      'rettet.hero.h1': 'Why your evening ruins the next day.',
      'rettet.hero.sub': 'Tired, irritable and completely drained.',
      'rettet.hero.cta': 'See how',

      'rettet.kr.h2': 'How your evening can wreck your morning.',
      'rettet.kr.s1.time': 'Evening',
      'rettet.kr.s1.label': 'Stress doesn\'t wind down',
      'rettet.kr.s1.desc': 'Cortisol stays high, the sleep signal doesn\'t get through. Your mind keeps going while your body wants to rest.',
      'rettet.kr.s2.time': 'Late evening',
      'rettet.kr.s2.label': 'The falling-asleep threshold is too high',
      'rettet.kr.s2.desc': 'You toss and turn, scroll your phone, stay wide awake. It steals the reserves you need for tomorrow.',
      'rettet.kr.s3.time': 'Deep sleep',
      'rettet.kr.s3.label': 'The window is missed',
      'rettet.kr.s3.desc': 'The first hours are the most valuable. Without them you wake up wrecked.',
      'rettet.kr.s4.time': 'Next morning',
      'rettet.kr.s4.label': 'The morning pays the price',
      'rettet.kr.s4.desc': 'Tired, irritable, even hot coffee doesn\'t help. The day starts broken.',

      'rettet.tm.h2': 'Real experiences.',
      'rettet.tm.q1': '„been taking this for three weeks, and honestly, my husband noticed first that I don\'t grumble in the morning anymore. that was the moment."',
      'rettet.tm.q2': '„I was honestly skeptical. My wife opened the package and put it in front of me. After two weeks I suddenly wasn\'t awake at half past three anymore. that\'s enough for me."',
      'rettet.tm.q3': '„I honestly hadn\'t expected it. Since I take a capsule in the evening, I simply have a rhythm again. My body knows again when it should switch off."',
      'rettet.tm.q4': '„I never thought much of sleeping pills. This isn\'t one either, it\'s a supplement. Doesn\'t knock you out, you just wind down. that\'s it."',

      'rettet.cta.try': 'Try it without pressure',
      'rettet.cta.guarantee': '60 days money-back, no questions asked',

      'rettet.zahlen.lead': 'Four numbers that carry our promise.',
      'rettet.zahlen.l1': 'ingredients<br>in <strong>ONE</strong> capsule',
      'rettet.zahlen.l2': 'days<br>money-back guarantee',
      'rettet.zahlen.l3': 'per evening<br>instead of 14 single supplements',
      'rettet.zahlen.l4': 'vegan, no<br>artificial additives',

      'rettet.auth.h2': 'Our formula: <span class="authority-plus">Science + Quality + Transparency</span>',
      'rettet.auth.q1': '„Dosages follow EFSA recommendations. We only use what is approved under EU regulation."',
      'rettet.auth.q2': '„Every batch is independently tested for purity and quantity. Values are documented and can be reviewed."',
      'rettet.auth.q3': '„What\'s written in EU regulation is what\'s written on our packaging. Nothing more, nothing less."',
      'rettet.auth.t1': 'Science · Formulation',
      'rettet.auth.t2': 'Quality · External batch testing',
      'rettet.auth.t3': 'Transparency · HCVO-compliant claims',

      'rettet.ra.h2': 'Three minutes, and your routine starts.',
      'rettet.ra.sub': 'No method, no 30-step app. A small shift in the hours before sleep.',
      'rettet.ra.s1.h': 'The last light gets warmer.',
      'rettet.ra.s1.p': 'Bright ceiling lamps off. A small lamp, warm-toned light, maybe a book. Your body reads it as „the day is over."',
      'rettet.ra.s2.h': 'One capsule of zZzlim®, a glass of water.',
      'rettet.ra.s2.p': 'Melatonin takes about 30 minutes to lower the falling-asleep threshold.* You don\'t have to do anything. You just give your body the signal it\'s missing under stress.',
      'rettet.ra.s3.h': 'The morning starts differently.',
      'rettet.ra.s3.p': 'No miracle, no knock-out. The alarm rings, and you don\'t have to crawl back into life for an hour first.',
      'rettet.ra.disclaimer': '*Melatonin contributes to the reduction of time to fall asleep (EU Regulation 432/2012). Beneficial effect is obtained with a consumption of 1 mg close to bedtime.',

      'rettet.vg.h2': 'A thoughtful combination for your nightly routine',

      'rettet.fcta.h2': 'Ready to take your life back into your own hands?',
      'rettet.fcta.lead': 'One pack. 30 days.',

      'rettet.faq.h2': 'Frequently asked questions',
      'rettet.faq.intro': 'Answers to what women with menopause- and cortisol-fatigue ask most often.',
      'rettet.faq.contact': 'Still have questions? Write us at info@zzzlim.de',
      'rettet.faq.q1': 'How quickly will I notice something?',
      'rettet.faq.a1': 'It varies. Many report a lighter transition into sleep subjectively after 3 to 7 nights. We don\'t promise a miracle overnight, that would be dishonest. Give your body 14 days to answer honestly.',
      'rettet.faq.q2': 'What\'s in it and why?',
      'rettet.faq.a2': '14 ingredients with focus on the evening: melatonin (contributes to reducing time to fall asleep), L-tryptophan, saffron extract, vitamin B12 (contributes to reducing tiredness and fatigue), zinc (contributes to normal immune function) and chromium (contributes to normal blood-sugar levels). Plus B-complex, niacin, biotin, pantothenic acid and nopal-cactus powder.',
      'rettet.faq.q3': 'Can I take this long-term?',
      'rettet.faq.a3': 'Yes. zZzlim® is a dietary supplement, not a medication. It contains no substances with dependency potential and is designed for continuous use. You can stop or pause at any time.',
      'rettet.faq.q4': 'Menopause or cortisol fatigue — is this right for me?',
      'rettet.faq.a4': 'Exactly for this phase, many women in our community tried zZzlim® for the first time. We don\'t promise you a hormonal solution. What we offer: an evening capsule that can make the transition into the night a little softer.',
      'rettet.faq.q5': 'What if I don\'t tolerate it or it doesn\'t work?',
      'rettet.faq.a5': 'You have 30 days to try it in peace. If you\'re not satisfied, just write us briefly at info@zzzlim.de and we\'ll refund the full purchase price. No ifs, no buts.',
      'rettet.faq.q6': 'When and how do I take zZzlim®?',
      'rettet.faq.a6': 'One capsule daily, about 30 minutes before going to bed, with a glass of water.',
      'rettet.faq.q7': 'Am I too old for this?',
      'rettet.faq.a7': 'No. zZzlim® is specifically developed for people whose sleep quality decreases with age. Our oldest satisfied customers are over 80.',
      'rettet.faq.q8': 'Can I take zZzlim® with other medications?',
      'rettet.faq.a8': 'If you regularly take medications, talk to your doctor or pharmacist first. This applies especially to blood thinners or thyroid medications.',
      'rettet.faq.q9': 'Is zZzlim® suitable for pregnant women?',
      'rettet.faq.a9': 'During pregnancy and breastfeeding we recommend consulting your doctor before use. The ingredients are natural, but safety always comes first.'
    },

    tr: {
      'rettet.hero.h1': 'Akşamın neden ertesi gününü mahvediyor.',
      'rettet.hero.sub': 'Yorgun, sinirli ve tamamen bitkin.',
      'rettet.hero.cta': 'Şimdi gör',

      'rettet.kr.h2': 'Akşamın sabahını nasıl mahvedebilir.',
      'rettet.kr.s1.time': 'Akşam',
      'rettet.kr.s1.label': 'Stres dinmiyor',
      'rettet.kr.s1.desc': 'Kortizol yüksek kalıyor, uyku sinyali geçmiyor. Vücudun mola isterken kafan devam ediyor.',
      'rettet.kr.s2.time': 'Geç saat',
      'rettet.kr.s2.label': 'Uykuya dalma eşiği çok yüksek',
      'rettet.kr.s2.desc': 'Dönüp duruyorsun, telefondasın, hâlâ uyanıksın. Yarınki rezervlerinden çalıyor.',
      'rettet.kr.s3.time': 'Derin uyku',
      'rettet.kr.s3.label': 'Pencere kaçırılıyor',
      'rettet.kr.s3.desc': 'İlk saatler en değerli olanlardır. Onlar olmadan paramparça uyanıyorsun.',
      'rettet.kr.s4.time': 'Ertesi sabah',
      'rettet.kr.s4.label': 'Bedelini sabah ödüyor',
      'rettet.kr.s4.desc': 'Yorgun, sinirli, sıcak kahve bile yardımcı olmuyor. Gün daha başlarken bitik başlıyor.',

      'rettet.tm.h2': 'Deneyimler.',
      'rettet.tm.q1': '„üç haftadır kullanıyorum, ve dürüst söylemek gerekirse, eşim ilk önce sabahları artık homurdanmadığımı fark etti. o an oldu aslında."',
      'rettet.tm.q2': '„Açıkçası şüpheciydim. Eşim paketi açıp önüme koydu. İki hafta sonra birden gece üç buçukta uyanmıyordum artık. bu bana yeter."',
      'rettet.tm.q3': '„Doğrusu beklemiyordum. Akşamları bir kapsül aldığımdan beri tekrar bir ritmim var. Vücudum ne zaman dinleneceğini yine biliyor."',
      'rettet.tm.q4': '„Uyku ilaçlarını hiç sevmedim. Bu da bir ilaç değil zaten, takviye. Bayıltmıyor, sadece sakinleştiriyor. işte bu kadar."',

      'rettet.cta.try': 'Rahatça deneyin',
      'rettet.cta.guarantee': '60 gün para iade garantisi, sorgusuz',

      'rettet.zahlen.lead': 'Sözümüzü taşıyan dört rakam.',
      'rettet.zahlen.l1': 'içerik<br><strong>BİR</strong> kapsülde',
      'rettet.zahlen.l2': 'gün<br>para iade garantisi',
      'rettet.zahlen.l3': 'akşam başına<br>14 ayrı takviye yerine',
      'rettet.zahlen.l4': 'vegan, yapay<br>katkı maddesi yok',

      'rettet.auth.h2': 'Formülümüz: <span class="authority-plus">Bilim + Kalite + Şeffaflık</span>',
      'rettet.auth.q1': '„Dozajlar EFSA önerilerine göre belirlenmiştir. Yalnızca AB yönetmeliğinde onaylananı kullanıyoruz."',
      'rettet.auth.q2': '„Her parti, saflık ve miktar açısından bağımsız olarak test edilir. Değerler belgelenir ve incelenebilir."',
      'rettet.auth.q3': '„AB yönetmeliğinde yazan ne ise, ambalajımızda da o yazıyor. Ne fazla, ne eksik."',
      'rettet.auth.t1': 'Bilim · Formülasyon',
      'rettet.auth.t2': 'Kalite · Bağımsız parti testi',
      'rettet.auth.t3': 'Şeffaflık · HCVO-uyumlu beyan',

      'rettet.ra.h2': 'Üç dakika ve rutinin başlıyor.',
      'rettet.ra.sub': 'Yöntem yok, 30 adımlık uygulama yok. Sadece uyumadan önceki saatlerde küçük bir değişim.',
      'rettet.ra.s1.h': 'Son ışık daha sıcak olur.',
      'rettet.ra.s1.p': 'Parlak tavan lambaları kapalı. Küçük bir lamba, sıcak tonlu ışık, belki bir kitap. Vücudun bunu „gün bitti" diye okur.',
      'rettet.ra.s2.h': 'Bir kapsül zZzlim®, bir bardak su.',
      'rettet.ra.s2.p': 'Melatoninin uykuya dalma eşiğini düşürmesi için yaklaşık 30 dakika gerekir.* Hiçbir şey yapman gerekmiyor. Sadece vücuduna stres altında eksik olan sinyali veriyorsun.',
      'rettet.ra.s3.h': 'Sabah farklı başlar.',
      'rettet.ra.s3.p': 'Mucize değil, bayıltma değil. Çalar saat çalar ve hayata geri sürünmek için bir saat geçirmen gerekmez.',
      'rettet.ra.disclaimer': '*Melatonin uykuya dalma süresinin azaltılmasına katkıda bulunur (AB Yönetmeliği 432/2012). Etki, yatmadan kısa süre önce 1 mg alınmasıyla ortaya çıkar.',

      'rettet.vg.h2': 'Gece rutinin için özenle tasarlanmış bir bileşim',

      'rettet.fcta.h2': 'Hayatını yeniden kendi ellerinde tutmaya hazır mısın?',
      'rettet.fcta.lead': 'Bir paket. 30 gün.',

      'rettet.faq.h2': 'Sık sorulan sorular',
      'rettet.faq.intro': 'Menopoz ve kortizol yorgunluğu yaşayan kadınların en sık sorduğu soruların yanıtları.',
      'rettet.faq.contact': 'Hâlâ sorun mu var? Bize info@zzzlim.de adresinden yazın',
      'rettet.faq.q1': 'Ne kadar sürede fark ederim?',
      'rettet.faq.a1': 'Bu kişiseldir. Birçok kişi 3 ila 7 gece sonra uykuya daha rahat geçtiğini bildiriyor. Mucize vaat etmiyoruz, bu dürüst olmaz. Vücuduna dürüstçe yanıt vermesi için 14 gün ver.',
      'rettet.faq.q2': 'İçinde ne var ve neden?',
      'rettet.faq.a2': 'Akşama odaklı 14 içerik: melatonin (uykuya dalma süresinin azalmasına katkıda bulunur), L-triptofan, safran ekstresi, B12 vitamini (yorgunluk ve bitkinliğin azalmasına katkıda bulunur), çinko (bağışıklığın normal işleyişine katkıda bulunur) ve krom (normal kan şekeri seviyelerinin korunmasına katkıda bulunur). Ayrıca B-kompleks, niasin, biyotin, pantotenik asit ve nopal kaktüsü tozu.',
      'rettet.faq.q3': 'Uzun süre alabilir miyim?',
      'rettet.faq.a3': 'Evet. zZzlim® bir gıda takviyesidir, ilaç değildir. Bağımlılık yapıcı madde içermez ve sürekli kullanım için tasarlanmıştır. İstediğin zaman bırakabilir veya ara verebilirsin.',
      'rettet.faq.q4': 'Menopoz veya kortizol yorgunluğu, bana uygun mu?',
      'rettet.faq.a4': 'Tam bu dönem için topluluğumuzdaki birçok kadın zZzlim®\'i ilk kez denedi. Hormonal bir çözüm vaat etmiyoruz. Sunduğumuz: gece geçişini biraz yumuşatabilecek bir akşam kapsülü.',
      'rettet.faq.q5': 'Tahammül edemezsem veya işe yaramazsa ne olur?',
      'rettet.faq.a5': '30 gün rahatça deneme süren var. Memnun kalmazsan info@zzzlim.de adresinden kısa bir mesaj at, satın alma bedelini tam olarak iade ederiz. Şartsız.',
      'rettet.faq.q6': 'zZzlim®\'i ne zaman ve nasıl alırım?',
      'rettet.faq.a6': 'Günde bir kapsül, yatmadan yaklaşık 30 dakika önce, bir bardak suyla.',
      'rettet.faq.q7': 'Bunun için çok mu yaşlıyım?',
      'rettet.faq.a7': 'Hayır. zZzlim® özellikle yaşla birlikte uyku kalitesi düşen kişiler için geliştirilmiştir. En yaşlı memnun müşterilerimiz 80 yaşın üzerindedir.',
      'rettet.faq.q8': 'zZzlim®\'i başka ilaçlarla birlikte alabilir miyim?',
      'rettet.faq.a8': 'Düzenli ilaç kullanıyorsanız, önce doktorunuza veya eczacınıza danışın. Bu özellikle kan sulandırıcılar veya tiroid ilaçları için geçerlidir.',
      'rettet.faq.q9': 'zZzlim® hamileler için uygun mu?',
      'rettet.faq.a9': 'Hamilelik ve emzirme döneminde kullanmadan önce doktorunuza danışmanızı öneririz. İçerikler doğaldır, ama güvenlik her zaman önce gelir.'
    }
  };

  // Merge into the global `translations` object
  Object.keys(R).forEach(function(lang){
    if (!translations[lang]) translations[lang] = {};
    Object.assign(translations[lang], R[lang]);
  });
})();
