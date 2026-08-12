/* Graded mini-stories: i+1 German with audio, transcript, translation, questions */
const STORIES = [
  {
    id: "st-cafe", level: "A1", mins: 2, title: "Im Café Sonne",
    gist: "A first order — and a small kindness.",
    lines: [
      { who: "Erzähler", de: "Es ist Montagmorgen in Hamburg. Omar steht vor dem Café Sonne.", en: "It's Monday morning in Hamburg. Omar stands in front of Café Sonne." },
      { who: "Omar", de: "Guten Morgen! Ich möchte einen Kaffee, bitte.", en: "Good morning! I'd like a coffee, please." },
      { who: "Kellnerin", de: "Gern. Mit Milch und Zucker?", en: "Sure. With milk and sugar?" },
      { who: "Omar", de: "Mit Milch, bitte. Kein Zucker.", en: "With milk, please. No sugar." },
      { who: "Erzähler", de: "Omar sucht sein Geld — aber der Geldbeutel ist zu Hause!", en: "Omar looks for his money — but his wallet is at home!" },
      { who: "Kellnerin", de: "Kein Problem. Nächstes Mal.", en: "No problem. Next time." },
      { who: "Omar", de: "Danke schön! Morgen bin ich wieder da.", en: "Thank you! I'll be back tomorrow." }
    ],
    words: ["der Kaffee", "die Milch", "Danke schön"],
    qs: [
      { q: "What does Omar order?", options: ["Coffee with milk, no sugar", "Tea with lemon", "Coffee with sugar"], answer: "Coffee with milk, no sugar" },
      { q: "What's the problem?", options: ["His wallet is at home", "The café is closed", "He lost his ticket"], answer: "His wallet is at home" },
      { q: "What does the waitress say?", options: ["Come back tomorrow — it's fine", "No coffee for you", "Call the police"], answer: "Come back tomorrow — it's fine" }
    ]
  },
  {
    id: "st-bahnhof", level: "A1", mins: 2, title: "Gleis sieben",
    gist: "A ticket, a track, and ten late minutes.",
    lines: [
      { who: "Erzähler", de: "Mia will nach Köln fahren. Am Schalter kauft sie eine Fahrkarte.", en: "Mia wants to go to Cologne. At the counter she buys a ticket." },
      { who: "Mia", de: "Eine Fahrkarte nach Köln, bitte. Einfach.", en: "A ticket to Cologne, please. One way." },
      { who: "Schalter", de: "Vierundzwanzig Euro. Gleis sieben, Abfahrt vierzehn Uhr fünfunddreißig.", en: "Twenty-four euros. Track seven, departure 2:35 pm." },
      { who: "Ansage", de: "Achtung auf Gleis sieben: Der Zug nach Köln hat zehn Minuten Verspätung.", en: "Attention on track seven: the Cologne train is ten minutes late." },
      { who: "Mia", de: "Zum Glück habe ich ein Buch dabei.", en: "Luckily I have a book with me." },
      { who: "Erzähler", de: "Um vierzehn Uhr fünfundvierzig steigt Mia ein. Köln, ich komme!", en: "At 2:45 pm Mia boards. Cologne, here I come!" }
    ],
    words: ["die Fahrkarte", "das Gleis", "die Verspätung"],
    qs: [
      { q: "Where is Mia going?", options: ["Cologne", "Hamburg", "Berlin"], answer: "Cologne" },
      { q: "What kind of ticket?", options: ["One way", "Return", "First class"], answer: "One way" },
      { q: "How late is the train?", options: ["Ten minutes", "Twenty minutes", "On time"], answer: "Ten minutes" }
    ]
  },
  {
    id: "st-nachbar", level: "A1", mins: 3, title: "Die neue Nachbarin",
    gist: "Small talk in the hallway turns into an invitation.",
    lines: [
      { who: "Erzähler", de: "Sam zieht heute ein. Die Wohnung ist klein, aber schön.", en: "Sam moves in today. The flat is small but nice." },
      { who: "Frau Berger", de: "Hallo! Sie sind neu, oder? Ich bin Frau Berger aus Wohnung drei.", en: "Hello! You're new, right? I'm Mrs. Berger from flat three." },
      { who: "Sam", de: "Guten Tag, Frau Berger. Ich heiße Sam. Ich komme aus Indien.", en: "Good day, Mrs. Berger. My name is Sam. I'm from India." },
      { who: "Frau Berger", de: "Willkommen! Übrigens — wir grillen am Samstag im Garten.", en: "Welcome! By the way — we're having a barbecue in the garden on Saturday." },
      { who: "Sam", de: "Oh, gern! Um wie viel Uhr?", en: "Oh, gladly! At what time?" },
      { who: "Frau Berger", de: "Um sechs. Bringen Sie gute Laune mit!", en: "At six. Bring a good mood!" },
      { who: "Erzähler", de: "Sam lächelt. Der erste Tag in Deutschland ist gar nicht schwer.", en: "Sam smiles. The first day in Germany is not hard at all." }
    ],
    words: ["die Wohnung", "Willkommen", "der Samstag"],
    qs: [
      { q: "Who is Frau Berger?", options: ["The neighbor from flat 3", "The landlady", "Sam's boss"], answer: "The neighbor from flat 3" },
      { q: "What happens on Saturday?", options: ["A barbecue in the garden", "A party in flat 3", "A trip to India"], answer: "A barbecue in the garden" },
      { q: "What should Sam bring?", options: ["A good mood", "Salad", "Money"], answer: "A good mood" }
    ]
  },
  {
    id: "st-wochenende", level: "A1", mins: 3, title: "Das Wochenende",
    gist: "Ben tells his weekend — Perfekt in the wild.",
    lines: [
      { who: "Lea", de: "Na Ben, wie war dein Wochenende?", en: "So Ben, how was your weekend?" },
      { who: "Ben", de: "Richtig gut! Am Samstag habe ich lange geschlafen.", en: "Really good! On Saturday I slept in long." },
      { who: "Ben", de: "Dann bin ich mit Tom an den See gefahren.", en: "Then I drove to the lake with Tom." },
      { who: "Lea", de: "Und was habt ihr da gemacht?", en: "And what did you do there?" },
      { who: "Ben", de: "Wir sind geschwommen und haben gegrillt. Abends hat es geregnet!", en: "We swam and had a barbecue. In the evening it rained!" },
      { who: "Lea", de: "Oh nein! Und dann?", en: "Oh no! And then?" },
      { who: "Ben", de: "Dann sind wir nach Hause gefahren und haben einen Film gesehen.", en: "Then we drove home and watched a film." }
    ],
    words: ["das Wochenende", "der See", "grillen"],
    qs: [
      { q: "What did Ben do Saturday morning?", options: ["Slept long", "Went to work", "Drove to the lake"], answer: "Slept long" },
      { q: "What happened in the evening?", options: ["It rained", "They went dancing", "Nothing"], answer: "It rained" },
      { q: "How did the day end?", options: ["Driving home and watching a film", "At the hospital", "At a restaurant"], answer: "Driving home and watching a film" }
    ]
  },
  {
    id: "st-koffer", level: "A2", mins: 3, title: "Der verlorene Koffer",
    gist: "A suitcase goes missing at Hamburg airport.",
    lines: [
      { who: "Erzähler", de: "Fatima ist gelandet, aber ihr Koffer nicht.", en: "Fatima has landed, but her suitcase has not." },
      { who: "Fatima", de: "Entschuldigung, mein Koffer ist weg. Er ist schwarz und mittelgroß.", en: "Excuse me, my suitcase is gone. It's black and medium-sized." },
      { who: "Mitarbeiter", de: "Keine Panik. Von welchem Flug kommen Sie?", en: "Don't panic. Which flight did you arrive on?" },
      { who: "Fatima", de: "Aus Istanbul, LH sieben eins null. Ich habe den Gepäckschein hier.", en: "From Istanbul, LH seven one zero. I have the baggage tag here." },
      { who: "Mitarbeiter", de: "Ah — Ihr Koffer steht noch in Istanbul. Er kommt morgen früh nach.", en: "Ah — your suitcase is still in Istanbul. It follows tomorrow morning." },
      { who: "Fatima", de: "Na gut. Dann sehe ich Hamburg heute ohne Zahnbürste.", en: "Well then. Today I'll see Hamburg without a toothbrush." },
      { who: "Mitarbeiter", de: "Im Hotel bekommen Sie eine. Willkommen in Deutschland!", en: "You'll get one at the hotel. Welcome to Germany!" }
    ],
    words: ["der Koffer", "das Gepäck", "der Flug"],
    qs: [
      { q: "Describe the suitcase.", options: ["Black, medium", "Red, small", "Black, large"], answer: "Black, medium" },
      { q: "Where is it?", options: ["Still in Istanbul", "Destroyed", "In Hamburg already"], answer: "Still in Istanbul" },
      { q: "When does it arrive?", options: ["Tomorrow morning", "Never", "In one hour"], answer: "Tomorrow morning" }
    ]
  },
  {
    id: "st-arzt", level: "A2", mins: 3, title: "Beim Arzt",
    gist: "Back pain, a prescription, and good advice.",
    lines: [
      { who: "Ärztin", de: "Guten Tag! Was kann ich für Sie tun?", en: "Good day! What can I do for you?" },
      { who: "Omar", de: "Ich habe seit Montag starke Rückenschmerzen. Mir tut der ganze Rücken weh.", en: "I've had strong back pain since Monday. My whole back hurts." },
      { who: "Ärztin", de: "Arbeiten Sie viel am Computer?", en: "Do you work at a computer a lot?" },
      { who: "Omar", de: "Ja, acht Stunden am Tag.", en: "Yes, eight hours a day." },
      { who: "Ärztin", de: "Ich verschreibe Ihnen etwas gegen die Schmerzen. Und Sie sollten täglich spazieren gehen.", en: "I'll prescribe something for the pain. And you should walk daily." },
      { who: "Omar", de: "Danke, Frau Doktor. Dann fange ich heute an.", en: "Thank you, doctor. I'll start today then." },
      { who: "Ärztin", de: "Gute Besserung! Kommen Sie in zwei Wochen wieder.", en: "Get well soon! Come back in two weeks." }
    ],
    words: ["der Rücken", "die Schmerzen", "spazieren gehen"],
    qs: [
      { q: "Since when does Omar have pain?", options: ["Since Monday", "Since yesterday", "For two weeks"], answer: "Since Monday" },
      { q: "What's the probable cause?", options: ["Eight hours at the computer", "Sport", "A fall"], answer: "Eight hours at the computer" },
      { q: "What's the advice beyond pills?", options: ["Walk daily", "Sleep more", "Drink coffee"], answer: "Walk daily" }
    ]
  }
];
