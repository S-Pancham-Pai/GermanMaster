const Curriculum = (() => {
  const w = (de, en, gender, ipa, exampleDe, exampleEn, extra = {}) => ({
    de, en, gender, ipa, exampleDe, exampleEn, pos: extra.pos || (gender ? "noun" : "other")
  });

  const lessons = [
    {
      id: "a1-v-greet",
      level: "A1", skill: "vocabulary", title: "Greetings",
      blurb: "The first words you say to anyone.",
      teach: "Learn these as whole phrases. Say them out loud — German greeting rhythm is short and clean.",
      items: [
        w("Hallo", "Hello", null, "/haˈloː/", "Hallo, wie geht's?", "Hello, how's it going?"),
        w("Guten Morgen", "Good morning", null, "/ˈɡuːtn̩ ˈmɔʁɡn̩/", "Guten Morgen, Frau Klein!", "Good morning, Ms. Klein!"),
        w("Guten Tag", "Good day", null, "/ˈɡuːtn̩ taːk/", "Guten Tag, mein Name ist Ana.", "Good day, my name is Ana."),
        w("Guten Abend", "Good evening", null, "/ˈɡuːtn̩ ˈaːbn̩t/", "Guten Abend zusammen.", "Good evening everyone."),
        w("Tschüss", "Bye", null, "/tʃʏs/", "Tschüss, bis morgen!", "Bye, see you tomorrow!"),
        w("Bitte", "Please / you're welcome", null, "/ˈbɪtə/", "Einen Kaffee, bitte.", "A coffee, please."),
        w("Danke", "Thank you", null, "/ˈdaŋkə/", "Danke für die Hilfe.", "Thank you for the help."),
        w("Ja", "Yes", null, "/jaː/", "Ja, das stimmt.", "Yes, that's right."),
        w("Nein", "No", null, "/naɪn/", "Nein, danke.", "No, thank you."),
        w("Wie heißt du?", "What's your name?", null, "/viː haɪst duː/", "Hallo, wie heißt du?", "Hi, what's your name?"),
        w("Ich heiße…", "My name is…", null, "/ɪç ˈhaɪsə/", "Ich heiße Jonas.", "My name is Jonas."),
        w("Freut mich", "Nice to meet you", null, "/fʁɔʏt mɪç/", "Freut mich, dich kennenzulernen.", "Nice to meet you.")
      ]
    },
    {
      id: "a1-v-numbers",
      level: "A1", skill: "vocabulary", title: "Numbers 0–20",
      blurb: "Count, pay, and tell your age.",
      teach: "11–12 are special (elf, zwölf). 13–19 add -zehn. Practice saying phone-style digits slowly.",
      items: [
        w("null", "zero", null, "/nʊl/", "Das kostet null Euro extra.", "That costs zero euros extra."),
        w("eins", "one", null, "/aɪns/", "Ich möchte eins, bitte.", "I would like one, please."),
        w("zwei", "two", null, "/tsvaɪ/", "Zwei Tickets, bitte.", "Two tickets, please."),
        w("drei", "three", null, "/dʁaɪ/", "Wir sind drei Personen.", "We are three people."),
        w("vier", "four", null, "/fiːɐ̯/", "Tisch für vier.", "A table for four."),
        w("fünf", "five", null, "/fʏnf/", "Es ist fünf Uhr.", "It is five o'clock."),
        w("sechs", "six", null, "/zɛks/", "Ich arbeite sechs Stunden.", "I work six hours."),
        w("sieben", "seven", null, "/ˈziːbn̩/", "Sieben Tage die Woche.", "Seven days a week."),
        w("acht", "eight", null, "/axt/", "Das Baby ist acht Monate alt.", "The baby is eight months old."),
        w("neun", "nine", null, "/nɔʏn/", "Zimmer neun.", "Room nine."),
        w("zehn", "ten", null, "/tseːn/", "Zehn Minuten zu Fuß.", "Ten minutes on foot."),
        w("zwanzig", "twenty", null, "/ˈtsvantsɪç/", "Ich bin zwanzig Jahre alt.", "I am twenty years old.")
      ]
    },
    {
      id: "a1-v-family",
      level: "A1", skill: "vocabulary", title: "Family & people",
      blurb: "Who is who — and which article they take.",
      teach: "Learn the article with the person: der Vater, die Mutter, das Kind. You'll reuse these in A2 stories.",
      items: [
        w("der Vater", "the father", "der", "/ˈfaːtɐ/", "Mein Vater kocht gern.", "My father likes to cook."),
        w("die Mutter", "the mother", "die", "/ˈmʊtɐ/", "Meine Mutter heißt Lena.", "My mother's name is Lena."),
        w("das Kind", "the child", "das", "/kɪnt/", "Das Kind spielt im Garten.", "The child is playing in the garden."),
        w("der Bruder", "the brother", "der", "/ˈbʁuːdɐ/", "Ich habe einen Bruder.", "I have a brother."),
        w("die Schwester", "the sister", "die", "/ˈʃvɛstɐ/", "Meine Schwester wohnt in Berlin.", "My sister lives in Berlin."),
        w("die Familie", "the family", "die", "/faˈmiːli̯ə/", "Meine Familie ist klein.", "My family is small."),
        w("der Freund", "the (male) friend", "der", "/fʁɔʏnt/", "Das ist mein Freund Max.", "This is my friend Max."),
        w("die Freundin", "the (female) friend", "die", "/ˈfʁɔʏndɪn/", "Anna ist meine Freundin.", "Anna is my friend."),
        w("der Mann", "the man / husband", "der", "/man/", "Der Mann liest eine Zeitung.", "The man is reading a newspaper."),
        w("die Frau", "the woman / wife", "die", "/fʁaʊ/", "Die Frau arbeitet hier.", "The woman works here.")
      ]
    },
    {
      id: "a1-v-food",
      level: "A1", skill: "vocabulary", title: "Food & drink",
      blurb: "Order without pointing at the menu.",
      teach: "Food nouns still need articles. In a café you can survive with ich möchte + item + bitte.",
      items: [
        w("das Brot", "the bread", "das", "/bʁoːt/", "Ich kaufe frisches Brot.", "I buy fresh bread."),
        w("der Käse", "the cheese", "der", "/ˈkɛːzə/", "Der Käse ist lecker.", "The cheese is tasty."),
        w("der Apfel", "the apple", "der", "/ˈapfl̩/", "Ich esse einen Apfel.", "I am eating an apple."),
        w("das Wasser", "the water", "das", "/ˈvasɐ/", "Ein Glas Wasser, bitte.", "A glass of water, please."),
        w("der Kaffee", "the coffee", "der", "/ˈkafe/", "Ich trinke morgens Kaffee.", "I drink coffee in the morning."),
        w("der Tee", "the tea", "der", "/teː/", "Möchtest du Tee?", "Would you like tea?"),
        w("das Bier", "the beer", "das", "/biːɐ̯/", "Ein kleines Bier, bitte.", "A small beer, please."),
        w("die Milch", "the milk", "die", "/mɪlç/", "Die Milch ist kalt.", "The milk is cold."),
        w("das Essen", "the food / meal", "das", "/ˈɛsn̩/", "Das Essen schmeckt gut.", "The food tastes good."),
        w("die Rechnung", "the bill", "die", "/ˈʁɛçnʊŋ/", "Die Rechnung, bitte.", "The bill, please.")
      ]
    },
    {
      id: "a1-v-colors",
      level: "A1", skill: "vocabulary", title: "Colors",
      blurb: "Describe things you can already name.",
      teach: "After the noun these stay simple at A1: das Auto ist rot. Later, A2 will decline them in front of nouns.",
      items: [
        w("rot", "red", null, "/ʁoːt/", "Der Apfel ist rot.", "The apple is red.", { pos: "adj" }),
        w("blau", "blue", null, "/blaʊ/", "Der Himmel ist blau.", "The sky is blue.", { pos: "adj" }),
        w("grün", "green", null, "/ɡʁyːn/", "Das Gras ist grün.", "The grass is green.", { pos: "adj" }),
        w("gelb", "yellow", null, "/ɡɛlp/", "Die Banane ist gelb.", "The banana is yellow.", { pos: "adj" }),
        w("schwarz", "black", null, "/ʃvaʁts/", "Das Auto ist schwarz.", "The car is black.", { pos: "adj" }),
        w("weiß", "white", null, "/vaɪs/", "Der Schnee ist weiß.", "The snow is white.", { pos: "adj" }),
        w("braun", "brown", null, "/bʁaʊn/", "Der Tisch ist braun.", "The table is brown.", { pos: "adj" }),
        w("grau", "grey", null, "/ɡʁaʊ/", "Die Katze ist grau.", "The cat is grey.", { pos: "adj" })
      ]
    },
    {
      id: "a1-v-time",
      level: "A1", skill: "vocabulary", title: "Time & days",
      blurb: "When things happen.",
      teach: "Days are masculine: am Montag. Time uses Uhr: Es ist drei Uhr.",
      items: [
        w("heute", "today", null, "/ˈhɔʏtə/", "Heute lerne ich Deutsch.", "Today I am learning German."),
        w("morgen", "tomorrow", null, "/ˈmɔʁɡn̩/", "Morgen gehe ich zur Arbeit.", "Tomorrow I go to work."),
        w("gestern", "yesterday", null, "/ˈɡɛstɐn/", "Gestern war ich müde.", "Yesterday I was tired."),
        w("der Montag", "Monday", "der", "/ˈmoːntaːk/", "Am Montag habe ich Zeit.", "On Monday I have time."),
        w("der Freitag", "Friday", "der", "/ˈfʁaɪtaːk/", "Freitagabend gehe ich aus.", "Friday evening I go out."),
        w("das Wochenende", "the weekend", "das", "/ˈvɔxn̩ˌɛndə/", "Am Wochenende schlafe ich lange.", "On the weekend I sleep in."),
        w("die Uhr", "the clock / o'clock", "die", "/uːɐ̯/", "Es ist acht Uhr.", "It is eight o'clock."),
        w("jetzt", "now", null, "/jɛtst/", "Ich bin jetzt hier.", "I am here now.")
      ]
    },
    {
      id: "a1-v-home",
      level: "A1", skill: "vocabulary", title: "Home",
      blurb: "Rooms and the things inside them.",
      teach: "A lot of home words are das (das Haus, das Zimmer, das Bett). Pair each noun with its article.",
      items: [
        w("das Haus", "the house", "das", "/haʊs/", "Unser Haus ist alt.", "Our house is old."),
        w("die Wohnung", "the apartment", "die", "/ˈvoːnʊŋ/", "Die Wohnung ist klein, aber hell.", "The apartment is small but bright."),
        w("das Zimmer", "the room", "das", "/ˈtsɪmɐ/", "Mein Zimmer ist oben.", "My room is upstairs."),
        w("die Küche", "the kitchen", "die", "/ˈkʏçə/", "Wir essen in der Küche.", "We eat in the kitchen."),
        w("das Bad", "the bathroom", "das", "/baːt/", "Wo ist das Bad?", "Where is the bathroom?"),
        w("der Tisch", "the table", "der", "/tɪʃ/", "Die Schlüssel liegen auf dem Tisch.", "The keys are on the table."),
        w("das Bett", "the bed", "das", "/bɛt/", "Ich gehe ins Bett.", "I am going to bed."),
        w("die Tür", "the door", "die", "/tyːɐ̯/", "Bitte mach die Tür zu.", "Please close the door.")
      ]
    },
    {
      id: "a1-v-city",
      level: "A1", skill: "vocabulary", title: "City & places",
      blurb: "Ask where something is — and understand the answer.",
      teach: "Wo ist…? + place. These words come back in A2 travel dialogues.",
      items: [
        w("die Stadt", "the city", "die", "/ʃtat/", "Die Stadt ist groß.", "The city is big."),
        w("der Bahnhof", "the train station", "der", "/ˈbaːnhoːf/", "Der Zug kommt am Bahnhof an.", "The train arrives at the station."),
        w("der Supermarkt", "the supermarket", "der", "/ˈzuːpɐmaʁkt/", "Ich gehe in den Supermarkt.", "I am going to the supermarket."),
        w("die Schule", "the school", "die", "/ˈʃuːlə/", "Die Schule beginnt um acht.", "School starts at eight."),
        w("das Restaurant", "the restaurant", "das", "/ʁɛstoˈʁãː/", "Wir essen im Restaurant.", "We are eating at the restaurant."),
        w("die Straße", "the street", "die", "/ˈʃtʁaːsə/", "In welcher Straße wohnst du?", "Which street do you live on?"),
        w("links", "left", null, "/lɪŋks/", "Die Bank ist links.", "The bank is on the left."),
        w("rechts", "right", null, "/ʁɛçts/", "Gehen Sie rechts.", "Go right.")
      ]
    },
    {
      id: "a1-g-pronouns",
      level: "A1", skill: "grammar", title: "Personal pronouns",
      blurb: "ich, du, er — the people in every sentence.",
      teach: "German verbs change with the person. First lock the pronouns: ich, du, er/sie/es, wir, ihr, sie/Sie.",
      items: [
        w("ich", "I", null, "/ɪç/", "Ich lerne Deutsch.", "I am learning German."),
        w("du", "you (informal)", null, "/duː/", "Du bist nett.", "You are nice."),
        w("er", "he", null, "/eːɐ̯/", "Er kommt aus Indien.", "He comes from India."),
        w("sie", "she / they", null, "/ziː/", "Sie heißt Mira.", "Her name is Mira."),
        w("es", "it", null, "/ɛs/", "Es ist kalt.", "It is cold."),
        w("wir", "we", null, "/viːɐ̯/", "Wir wohnen in München.", "We live in Munich."),
        w("ihr", "you all", null, "/iːɐ̯/", "Ihr seid müde.", "You all are tired."),
        w("Sie", "you (formal)", null, "/ziː/", "Wie heißen Sie?", "What is your name? (formal)")
      ]
    },
    {
      id: "a1-g-articles",
      level: "A1", skill: "grammar", title: "der · die · das",
      blurb: "Gender is not optional. Learn the article with the noun.",
      teach: "der = masculine, die = feminine, das = neuter. There is no logic you can trust — pair them. A2 will add den/dem.",
      items: [
        w("der Tisch", "the table (masc.)", "der", "/tɪʃ/", "Der Tisch ist neu.", "The table is new."),
        w("die Lampe", "the lamp (fem.)", "die", "/ˈlampə/", "Die Lampe ist hell.", "The lamp is bright."),
        w("das Buch", "the book (neut.)", "das", "/buːx/", "Das Buch ist spannend.", "The book is exciting."),
        w("der Stuhl", "the chair", "der", "/ʃtuːl/", "Der Stuhl ist bequem.", "The chair is comfortable."),
        w("die Tasche", "the bag", "die", "/ˈtaʃə/", "Die Tasche ist schwer.", "The bag is heavy."),
        w("das Fenster", "the window", "das", "/ˈfɛnstɐ/", "Das Fenster ist offen.", "The window is open."),
        w("der Hund", "the dog", "der", "/hʊnt/", "Der Hund ist klein.", "The dog is small."),
        w("die Katze", "the cat", "die", "/ˈkatsə/", "Die Katze schläft.", "The cat is sleeping.")
      ]
    },
    {
      id: "a1-g-seinhaben",
      level: "A1", skill: "grammar", title: "sein & haben",
      blurb: "The two verbs that carry half of beginner German.",
      teach: "sein (to be): ich bin, du bist, er ist, wir sind, ihr seid, sie sind. haben (to have): ich habe, du hast, er hat, wir haben.",
      items: [
        w("ich bin", "I am", null, "/ɪç bɪn/", "Ich bin Student.", "I am a student."),
        w("du bist", "you are", null, "/duː bɪst/", "Du bist freundlich.", "You are friendly."),
        w("er ist", "he is", null, "/eːɐ̯ ɪst/", "Er ist Arzt.", "He is a doctor."),
        w("wir sind", "we are", null, "/viːɐ̯ zɪnt/", "Wir sind zu Hause.", "We are at home."),
        w("ich habe", "I have", null, "/ɪç ˈhaːbə/", "Ich habe Zeit.", "I have time."),
        w("du hast", "you have", null, "/duː hast/", "Du hast ein Auto.", "You have a car."),
        w("sie hat", "she has", null, "/ziː hat/", "Sie hat zwei Geschwister.", "She has two siblings."),
        w("wir haben", "we have", null, "/viːɐ̯ ˈhaːbn̩/", "Wir haben Hunger.", "We are hungry.")
      ]
    },
    {
      id: "a1-g-present",
      level: "A1", skill: "grammar", title: "Present tense",
      blurb: "Regular verbs: stem + e, st, t, en.",
      teach: "lernen → ich lerne, du lernst, er lernt, wir lernen. The verb sits in position 2 of a main clause.",
      items: [
        w("lernen", "to learn", null, "/ˈlɛʁnən/", "Ich lerne jeden Tag.", "I learn every day.", { pos: "verb" }),
        w("wohnen", "to live", null, "/ˈvoːnən/", "Wir wohnen in Hamburg.", "We live in Hamburg.", { pos: "verb" }),
        w("kommen", "to come", null, "/ˈkɔmən/", "Woher kommst du?", "Where do you come from?", { pos: "verb" }),
        w("machen", "to do / make", null, "/ˈmaxn̩/", "Was machst du?", "What are you doing?", { pos: "verb" }),
        w("spielen", "to play", null, "/ˈʃpiːlən/", "Die Kinder spielen draußen.", "The children are playing outside.", { pos: "verb" }),
        w("kaufen", "to buy", null, "/ˈkaʊfn̩/", "Ich kaufe Brot.", "I am buying bread.", { pos: "verb" }),
        w("arbeiten", "to work", null, "/ˈaʁbaɪtn̩/", "Sie arbeitet im Büro.", "She works in the office.", { pos: "verb" }),
        w("heißen", "to be called", null, "/ˈhaɪsn̩/", "Wie heißt das auf Deutsch?", "What is that called in German?", { pos: "verb" })
      ]
    },
    {
      id: "a1-g-wordorder",
      level: "A1", skill: "grammar", title: "Word order (V2)",
      blurb: "The verb wants the second seat.",
      teach: "In a statement the conjugated verb is always in position 2: Heute lerne ich Deutsch. Not: Heute ich lerne.",
      items: [
        w("Ich lerne Deutsch.", "I learn German.", null, "", "Ich lerne Deutsch.", "I learn German."),
        w("Heute lerne ich.", "Today I learn.", null, "", "Heute lerne ich zu Hause.", "Today I learn at home."),
        w("Am Montag arbeite ich.", "On Monday I work.", null, "", "Am Montag arbeite ich von zu Hause.", "On Monday I work from home."),
        w("Wir trinken Kaffee.", "We drink coffee.", null, "", "Wir trinken Kaffee im Café.", "We drink coffee in the café.")
      ]
    },
    {
      id: "a1-g-accusative",
      level: "A1", skill: "grammar", title: "Accusative",
      blurb: "der becomes den when it's the object.",
      teach: "Subject = nominative. Direct object = accusative. der → den, ein → einen. die and das stay the same.",
      items: [
        w("Ich sehe den Mann.", "I see the man.", null, "", "Ich sehe den Mann.", "I see the man."),
        w("Ich habe einen Hund.", "I have a dog.", null, "", "Ich habe einen Hund.", "I have a dog."),
        w("Sie kauft das Brot.", "She buys the bread.", null, "", "Sie kauft das Brot.", "She buys the bread."),
        w("Wir treffen die Frau.", "We meet the woman.", null, "", "Wir treffen die Frau.", "We meet the woman.")
      ]
    },
    {
      id: "a1-g-negation",
      level: "A1", skill: "grammar", title: "nicht & kein",
      blurb: "How to say no without breaking the sentence.",
      teach: "kein replaces ein and negates nouns: kein Brot. nicht negates verbs, adjectives, and everything else: Ich komme nicht.",
      items: [
        w("kein", "no / not a", null, "/kaɪn/", "Ich habe kein Geld.", "I have no money."),
        w("nicht", "not", null, "/nɪçt/", "Ich bin nicht müde.", "I am not tired."),
        w("Ich komme nicht.", "I am not coming.", null, "", "Ich komme heute nicht.", "I am not coming today."),
        w("keine Zeit", "no time", null, "", "Ich habe keine Zeit.", "I have no time.")
      ]
    },
    {
      id: "a1-g-questions",
      level: "A1", skill: "grammar", title: "Questions",
      blurb: "Flip the verb, or start with a W-word.",
      teach: "Yes/no: verb first — Sprichst du Deutsch? W-questions: Wer, Was, Wo, Wann, Wie, Warum + verb.",
      items: [
        w("Wie?", "How?", null, "/viː/", "Wie geht's?", "How's it going?"),
        w("Wo?", "Where?", null, "/voː/", "Wo wohnst du?", "Where do you live?"),
        w("Wann?", "When?", null, "/van/", "Wann beginnt der Kurs?", "When does the course start?"),
        w("Was?", "What?", null, "/vas/", "Was machst du?", "What are you doing?"),
        w("Wer?", "Who?", null, "/veːɐ̯/", "Wer ist das?", "Who is that?"),
        w("Warum?", "Why?", null, "/vaˈʁʊm/", "Warum lernst du Deutsch?", "Why are you learning German?")
      ]
    },
    {
      id: "a1-l-greet",
      level: "A1", skill: "listening", title: "Hear the greeting",
      blurb: "Catch Hallo and names in real speed.",
      teach: "Play each line, then pick what you heard. Slow is fine — accuracy first.",
      items: [
        w("Hallo, ich heiße Anna.", "Hello, my name is Anna.", null, "", "Hallo, ich heiße Anna.", "Hello, my name is Anna."),
        w("Guten Morgen, wie geht's?", "Good morning, how's it going?", null, "", "Guten Morgen, wie geht's?", "Good morning, how's it going?"),
        w("Freut mich.", "Nice to meet you.", null, "", "Freut mich.", "Nice to meet you."),
        w("Tschüss, bis morgen.", "Bye, see you tomorrow.", null, "", "Tschüss, bis morgen.", "Bye, see you tomorrow.")
      ]
    },
    {
      id: "a1-l-numbers",
      level: "A1", skill: "listening", title: "Numbers by ear",
      blurb: "Prices and times only work if you hear them.",
      teach: "Listen once without looking. German fünf and elf are easy to mix with English — trust the sound.",
      items: [
        w("Es kostet zehn Euro.", "It costs ten euros.", null, "", "Es kostet zehn Euro.", "It costs ten euros."),
        w("Ich bin zwanzig.", "I am twenty.", null, "", "Ich bin zwanzig Jahre alt.", "I am twenty years old."),
        w("Zwei Kaffee, bitte.", "Two coffees, please.", null, "", "Zwei Kaffee, bitte.", "Two coffees, please."),
        w("Es ist acht Uhr.", "It is eight o'clock.", null, "", "Es ist acht Uhr.", "It is eight o'clock.")
      ]
    },
    {
      id: "a1-s-intro",
      level: "A1", skill: "speaking", title: "Introduce yourself",
      blurb: "A 15-second self-intro you can actually say.",
      teach: "Pattern: Hallo, ich heiße … Ich komme aus … Ich lerne Deutsch. Speak, then rebuild the line.",
      items: [
        w("Ich heiße…", "My name is…", null, "", "Ich heiße Sam.", "My name is Sam."),
        w("Ich komme aus…", "I come from…", null, "", "Ich komme aus Indien.", "I come from India."),
        w("Ich wohne in…", "I live in…", null, "", "Ich wohne in Bengaluru.", "I live in Bengaluru."),
        w("Ich lerne Deutsch.", "I am learning German.", null, "", "Ich lerne Deutsch.", "I am learning German.")
      ]
    },
    {
      id: "a1-s-cafe",
      level: "A1", skill: "speaking", title: "At the café",
      blurb: "Order without switching to English.",
      teach: "Ich möchte + item + bitte. Then danke. That's a complete café conversation at A1.",
      items: [
        w("Ich möchte einen Kaffee.", "I would like a coffee.", null, "", "Ich möchte einen Kaffee, bitte.", "I would like a coffee, please."),
        w("Mit Milch, bitte.", "With milk, please.", null, "", "Mit Milch, bitte.", "With milk, please."),
        w("Das ist alles.", "That's all.", null, "", "Das ist alles, danke.", "That's all, thank you."),
        w("Die Rechnung, bitte.", "The bill, please.", null, "", "Die Rechnung, bitte.", "The bill, please.")
      ]
    },
    {
      id: "a1-r-dialogue",
      level: "A1", skill: "reading", title: "A short dialogue",
      blurb: "Read what you can already say.",
      teach: "A: Hallo, wie heißt du? B: Ich heiße Lea. Und du? A: Ich bin Omar. Freut mich.",
      items: [
        w("Wie heißt du?", "What's your name?", null, "", "Wie heißt du?", "What's your name?"),
        w("Und du?", "And you?", null, "", "Und du?", "And you?"),
        w("Freut mich.", "Nice to meet you.", null, "", "Freut mich.", "Nice to meet you."),
        w("Ich bin Omar.", "I am Omar.", null, "", "Ich bin Omar.", "I am Omar.")
      ]
    },
    {
      id: "a1-r-sign",
      level: "A1", skill: "reading", title: "Signs & notices",
      blurb: "The German you see on doors.",
      teach: "Ausgang = exit, Eingang = entrance, geöffnet = open, geschlossen = closed, Zug = train.",
      items: [
        w("Eingang", "entrance", null, "/ˈaɪnɡaŋ/", "Der Eingang ist links.", "The entrance is on the left."),
        w("Ausgang", "exit", null, "/ˈaʊsɡaŋ/", "Wo ist der Ausgang?", "Where is the exit?"),
        w("geöffnet", "open", null, "/ɡəˈœfnət/", "Das Café ist geöffnet.", "The café is open."),
        w("geschlossen", "closed", null, "/ɡəˈʃlɔsn̩/", "Heute geschlossen.", "Closed today.")
      ]
    },
    {
      id: "a1-w-form",
      level: "A1", skill: "writing", title: "Fill a form",
      blurb: "Name, city, country — the first written German.",
      teach: "Name / Vorname / Wohnort / Land. Write full short sentences, not just the noun.",
      items: [
        w("Mein Name ist…", "My name is…", null, "", "Mein Name ist Riya.", "My name is Riya."),
        w("Ich wohne in…", "I live in…", null, "", "Ich wohne in Bengaluru.", "I live in Bengaluru."),
        w("Ich komme aus…", "I come from…", null, "", "Ich komme aus Indien.", "I come from India."),
        w("Meine E-Mail ist…", "My email is…", null, "", "Meine E-Mail ist riya@mail.com.", "My email is riya@mail.com.")
      ]
    },
    {
      id: "a1-w-three",
      level: "A1", skill: "writing", title: "Three sentences",
      blurb: "Put greetings, sein, and a place in one tiny text.",
      teach: "Write: greeting + who you are + where you live. Check verb in position 2.",
      items: [
        w("Hallo!", "Hello!", null, "", "Hallo!", "Hello!"),
        w("Ich bin Student.", "I am a student.", null, "", "Ich bin Student.", "I am a student."),
        w("Ich wohne in der Stadt.", "I live in the city.", null, "", "Ich wohne in der Stadt.", "I live in the city."),
        w("Ich lerne Deutsch.", "I am learning German.", null, "", "Ich lerne Deutsch.", "I am learning German.")
      ]
    },

    {
      id: "a2-v-routine",
      level: "A2", skill: "vocabulary", title: "Daily routine",
      blurb: "Reuse A1 time words with real day verbs.",
      teach: "You already know heute and Uhr. Now attach actions: aufstehen, frühstücken, arbeiten, schlafen.",
      items: [
        w("aufstehen", "to get up", null, "/ˈaʊfˌʃteːən/", "Ich stehe um sieben auf.", "I get up at seven.", { pos: "verb" }),
        w("frühstücken", "to have breakfast", null, "/ˈfʁyːʃtʏkn̩/", "Wir frühstücken zusammen.", "We have breakfast together.", { pos: "verb" }),
        w("die Arbeit", "work", "die", "/ˈaʁbaɪt/", "Nach der Arbeit bin ich müde.", "After work I am tired."),
        w("einkaufen", "to go shopping", null, "/ˈaɪnˌkaʊfn̩/", "Am Samstag kaufe ich ein.", "On Saturday I go shopping.", { pos: "verb" }),
        w("kochen", "to cook", null, "/ˈkɔxn̩/", "Er kocht am Abend.", "He cooks in the evening.", { pos: "verb" }),
        w("schlafen", "to sleep", null, "/ˈʃlaːfn̩/", "Ich schlafe acht Stunden.", "I sleep eight hours.", { pos: "verb" }),
        w("die Pause", "the break", "die", "/ˈpaʊzə/", "Wir machen eine Pause.", "We are taking a break."),
        w("müde", "tired", null, "/ˈmyːdə/", "Ich bin heute müde.", "I am tired today.", { pos: "adj" })
      ]
    },
    {
      id: "a2-v-shopping",
      level: "A2", skill: "vocabulary", title: "Shopping",
      blurb: "A1 food words, now with prices, sizes, and refunds.",
      teach: "Was kostet das? Das ist zu teuer. Haben Sie das in…? Builds on Apfel, Brot, Rechnung.",
      items: [
        w("kosten", "to cost", null, "/ˈkɔstn̩/", "Was kostet das?", "What does that cost?", { pos: "verb" }),
        w("teuer", "expensive", null, "/ˈtɔʏɐ/", "Das ist zu teuer.", "That is too expensive.", { pos: "adj" }),
        w("billig", "cheap", null, "/ˈbɪlɪç/", "Dieses Brot ist billig.", "This bread is cheap.", { pos: "adj" }),
        w("die Größe", "the size", "die", "/ˈɡʁøːsə/", "Welche Größe haben Sie?", "Which size do you have?"),
        w("probieren", "to try on / try", null, "/pʁoˈbiːʁən/", "Kann ich das probieren?", "Can I try that?", { pos: "verb" }),
        w("bar", "in cash", null, "/baːɐ̯/", "Zahle ich bar oder mit Karte?", "Shall I pay cash or by card?"),
        w("die Karte", "the card", "die", "/ˈkaʁtə/", "Ich zahle mit Karte.", "I pay by card."),
        w("zurückgeben", "to return", null, "/t͡suˈʁʏkˌɡeːbn̩/", "Kann ich das zurückgeben?", "Can I return this?", { pos: "verb" })
      ]
    },
    {
      id: "a2-v-travel",
      level: "A2", skill: "vocabulary", title: "Travel",
      blurb: "From A1 Bahnhof to tickets, delays, and platforms.",
      teach: "You know der Bahnhof. Now: der Zug, das Gleis, die Verspätung, umsteigen.",
      items: [
        w("der Zug", "the train", "der", "/t͡suːk/", "Der Zug hat Verspätung.", "The train is delayed."),
        w("das Gleis", "the platform / track", "das", "/ɡlaɪs/", "Gleis fünf, bitte.", "Platform five, please."),
        w("die Fahrkarte", "the ticket", "die", "/ˈfaːɐ̯kaʁtə/", "Wo kann ich eine Fahrkarte kaufen?", "Where can I buy a ticket?"),
        w("umsteigen", "to change trains", null, "/ˈʊmˌʃtaɪɡn̩/", "Sie müssen in Köln umsteigen.", "You have to change in Cologne.", { pos: "verb" }),
        w("die Verspätung", "the delay", "die", "/fɛɐ̯ˈʃpɛːtʊŋ/", "Zehn Minuten Verspätung.", "A ten-minute delay."),
        w("ankommen", "to arrive", null, "/ˈanˌkɔmən/", "Wann kommt der Zug an?", "When does the train arrive?", { pos: "verb" }),
        w("abfahren", "to depart", null, "/ˈapˌfaːʁən/", "Der Bus fährt um neun ab.", "The bus leaves at nine.", { pos: "verb" }),
        w("das Hotel", "the hotel", "das", "/hoˈtɛl/", "Ich habe ein Zimmer im Hotel.", "I have a room at the hotel.")
      ]
    },
    {
      id: "a2-v-health",
      level: "A2", skill: "vocabulary", title: "Health",
      blurb: "Say what hurts — using A1 body-simple + new verbs.",
      teach: "Ich habe Kopfschmerzen. Tut weh. These sentences reuse ich habe from A1 grammar.",
      items: [
        w("der Arzt", "the doctor (m.)", "der", "/aːɐ̯tst/", "Ich gehe zum Arzt.", "I am going to the doctor."),
        w("die Ärztin", "the doctor (f.)", "die", "/ˈɛːɐ̯tstɪn/", "Die Ärztin ist sehr nett.", "The doctor is very kind."),
        w("der Kopf", "the head", "der", "/kɔpf/", "Mein Kopf tut weh.", "My head hurts."),
        w("der Schmerz", "the pain", "der", "/ʃmɛʁts/", "Ich habe Schmerzen.", "I am in pain."),
        w("krank", "sick", null, "/kʁaŋk/", "Ich bin krank.", "I am sick.", { pos: "adj" }),
        w("die Apotheke", "the pharmacy", "die", "/apoˈteːkə/", "Wo ist die Apotheke?", "Where is the pharmacy?"),
        w("das Rezept", "the prescription", "das", "/ʁeˈt͡sɛpt/", "Hier ist das Rezept.", "Here is the prescription."),
        w("ruhen", "to rest", null, "/ˈʁuːən/", "Sie müssen sich ruhen.", "You need to rest.", { pos: "verb" })
      ]
    },
    {
      id: "a2-g-perfekt",
      level: "A2", skill: "grammar", title: "Perfekt",
      blurb: "Talk about yesterday with haben/sein + participle.",
      teach: "Most verbs: haben + ge-…-t (ich habe gelernt). Motion/change: sein (ich bin gegangen). You already know haben and sein.",
      items: [
        w("ich habe gelernt", "I learned / have learned", null, "", "Ich habe gestern gelernt.", "I studied yesterday."),
        w("ich habe gekauft", "I bought", null, "", "Ich habe Brot gekauft.", "I bought bread."),
        w("ich bin gegangen", "I went", null, "", "Ich bin nach Hause gegangen.", "I went home."),
        w("wir sind gefahren", "we traveled / drove", null, "", "Wir sind mit dem Zug gefahren.", "We went by train."),
        w("sie hat gemacht", "she did / made", null, "", "Sie hat das Essen gemacht.", "She made the food."),
        w("hast du gesehen?", "did you see?", null, "", "Hast du den Film gesehen?", "Did you see the film?")
      ]
    },
    {
      id: "a2-g-dative",
      level: "A2", skill: "grammar", title: "Dative",
      blurb: "dem / der / den — the receiver of the action.",
      teach: "A1 accusative was the object. Dative is the 'to/for' person: Ich gebe dem Mann das Buch. der → dem, die → der, das → dem, plural die → den.",
      items: [
        w("dem Mann", "to the man", "der", "", "Ich helfe dem Mann.", "I help the man."),
        w("der Frau", "to the woman", "die", "", "Das gehört der Frau.", "That belongs to the woman."),
        w("dem Kind", "to the child", "das", "", "Ich gebe dem Kind einen Apfel.", "I give the child an apple."),
        w("mit dem Zug", "by train", "der", "", "Ich fahre mit dem Zug.", "I travel by train."),
        w("aus der Stadt", "from the city", "die", "", "Er kommt aus der Stadt.", "He comes from the city.")
      ]
    },
    {
      id: "a2-g-separable",
      level: "A2", skill: "grammar", title: "Separable verbs",
      blurb: "The prefix jumps to the end.",
      teach: "aufstehen → Ich stehe um sieben auf. In Perfekt the ge- sits in the middle: aufgestanden. You used aufstehen in Daily routine.",
      items: [
        w("aufstehen", "to get up", null, "", "Ich stehe früh auf.", "I get up early.", { pos: "verb" }),
        w("ankommen", "to arrive", null, "", "Der Zug kommt pünktlich an.", "The train arrives on time.", { pos: "verb" }),
        w("einkaufen", "to shop", null, "", "Wir kaufen am Markt ein.", "We shop at the market.", { pos: "verb" }),
        w("mitkommen", "to come along", null, "", "Kommst du mit?", "Are you coming along?", { pos: "verb" }),
        w("fernsehen", "to watch TV", null, "", "Abends sehen wir fern.", "In the evenings we watch TV.", { pos: "verb" })
      ]
    },
    {
      id: "a2-g-modals",
      level: "A2", skill: "grammar", title: "Modal verbs",
      blurb: "können, müssen, wollen, dürfen, sollen.",
      teach: "Modal in position 2, second verb at the end in infinitive: Ich muss heute arbeiten. Builds on A1 present-tense order.",
      items: [
        w("können", "can / to be able to", null, "/ˈkœnən/", "Ich kann Deutsch sprechen.", "I can speak German.", { pos: "verb" }),
        w("müssen", "must / to have to", null, "/ˈmʏsn̩/", "Ich muss gehen.", "I have to go.", { pos: "verb" }),
        w("wollen", "to want", null, "/ˈvɔlən/", "Wir wollen reisen.", "We want to travel.", { pos: "verb" }),
        w("dürfen", "may / to be allowed", null, "/ˈdʏʁfn̩/", "Darf ich hier sitzen?", "May I sit here?", { pos: "verb" }),
        w("sollen", "should / ought to", null, "/ˈzɔlən/", "Du sollst mehr trinken.", "You should drink more.", { pos: "verb" })
      ]
    },
    {
      id: "a2-g-comparatives",
      level: "A2", skill: "grammar", title: "Comparatives",
      blurb: "bigger, cheaper, better — from A1 adjectives.",
      teach: "rot → röter is rare; common: klein → kleiner, groß → größer, gut → besser, gern → lieber. als = than.",
      items: [
        w("größer als", "bigger than", null, "", "Berlin ist größer als Bremen.", "Berlin is bigger than Bremen."),
        w("kleiner als", "smaller than", null, "", "Meine Wohnung ist kleiner als deine.", "My apartment is smaller than yours."),
        w("besser", "better", null, "", "Heute geht es besser.", "Today it's better."),
        w("lieber", "prefer / rather", null, "", "Ich trinke lieber Tee.", "I prefer tea."),
        w("am besten", "the best", null, "", "Das ist am besten.", "That is the best.")
      ]
    },
    {
      id: "a2-g-weil",
      level: "A2", skill: "grammar", title: "weil & denn",
      blurb: "Give a reason. Verb placement changes.",
      teach: "denn keeps normal order: Ich bleibe hier, denn ich bin müde. weil kicks the verb to the end: … weil ich müde bin. B1 will add more of these clauses.",
      items: [
        w("weil", "because (verb last)", null, "/vaɪl/", "Ich lerne, weil ich in Berlin studieren will.", "I study because I want to study in Berlin."),
        w("denn", "because (verb 2)", null, "/dɛn/", "Ich gehe, denn es ist spät.", "I am leaving because it is late."),
        w("deshalb", "therefore", null, "/ˈdɛshalp/", "Ich bin krank, deshalb bleibe ich zu Hause.", "I am sick, therefore I stay home.")
      ]
    },
    {
      id: "a2-l-station",
      level: "A2", skill: "listening", title: "At the station",
      blurb: "Hear Gleis and Verspätung in a short announcement.",
      teach: "Listen for the number and the place. You already know zehn and Bahnhof.",
      items: [
        w("Der Zug nach Hamburg hat zehn Minuten Verspätung.", "The train to Hamburg is delayed by ten minutes.", null, "", "Der Zug nach Hamburg hat zehn Minuten Verspätung.", "The train to Hamburg is delayed by ten minutes."),
        w("Abfahrt auf Gleis fünf.", "Departure on platform five.", null, "", "Abfahrt auf Gleis fünf.", "Departure on platform five."),
        w("Bitte umsteigen in Köln.", "Please change in Cologne.", null, "", "Bitte umsteigen in Köln.", "Please change in Cologne.")
      ]
    },
    {
      id: "a2-s-doctor",
      level: "A2", skill: "speaking", title: "At the doctor",
      blurb: "Say what's wrong with A1 haben + A2 body words.",
      teach: "Ich habe… + pain. Seit wann? Seit gestern. Short answers are fine.",
      items: [
        w("Ich habe Kopfschmerzen.", "I have a headache.", null, "", "Ich habe seit gestern Kopfschmerzen.", "I have had a headache since yesterday."),
        w("Mir ist schlecht.", "I feel sick.", null, "", "Mir ist schlecht.", "I feel sick."),
        w("Seit wann?", "Since when?", null, "", "Seit wann haben Sie das?", "Since when have you had that?")
      ]
    },
    {
      id: "a2-r-email",
      level: "A2", skill: "reading", title: "A simple email",
      blurb: "Subject lines and polite A2 messages.",
      teach: "Hallo… / vielen Dank / Viele Grüße. You already know Hallo and Danke.",
      items: [
        w("vielen Dank", "many thanks", null, "", "Vielen Dank für Ihre E-Mail.", "Many thanks for your email."),
        w("Leider", "unfortunately", null, "", "Leider kann ich nicht kommen.", "Unfortunately I cannot come."),
        w("Viele Grüße", "best regards", null, "", "Viele Grüße, Ana", "Best regards, Ana.")
      ]
    },
    {
      id: "a2-w-message",
      level: "A2", skill: "writing", title: "Write a message",
      blurb: "Cancel plans with weil or denn.",
      teach: "Hallo + reason + Grüße. Use one weil clause correctly.",
      items: [
        w("Hallo Lea,", "Hi Lea,", null, "", "Hallo Lea,", "Hi Lea,"),
        w("ich kann heute nicht kommen, weil ich krank bin.", "I cannot come today because I am sick.", null, "", "ich kann heute nicht kommen, weil ich krank bin.", "I cannot come today because I am sick."),
        w("Viele Grüße", "Best regards", null, "", "Viele Grüße", "Best regards")
      ]
    },

    {
      id: "b1-v-opinions",
      level: "B1", skill: "vocabulary", title: "Opinions",
      blurb: "Move past 'gut' — argue a little.",
      teach: "Meiner Meinung nach… Ich finde, dass… Builds on A2 weil-clauses.",
      items: [
        w("die Meinung", "the opinion", "die", "/ˈmaɪnʊŋ/", "Meiner Meinung nach ist das richtig.", "In my opinion that is right."),
        w("finden", "to find / think", null, "/ˈfɪndn̩/", "Ich finde den Film spannend.", "I find the film exciting.", { pos: "verb" }),
        w("zustimmen", "to agree", null, "/ˈt͡suːˌʃtɪmən/", "Ich stimme dir zu.", "I agree with you.", { pos: "verb" }),
        w("dagegen sein", "to be against", null, "", "Ich bin dagegen.", "I am against it."),
        w("der Vorteil", "the advantage", "der", "/ˈfoːɐ̯taɪl/", "Der Vorteil ist klar.", "The advantage is clear."),
        w("der Nachteil", "the disadvantage", "der", "/ˈnaːxtaɪl/", "Ein Nachteil ist der Preis.", "One disadvantage is the price.")
      ]
    },
    {
      id: "b1-v-work",
      level: "B1", skill: "vocabulary", title: "Work life",
      blurb: "Meetings, Bewerbung, colleagues.",
      teach: "A2 Arbeit becomes a whole week: die Besprechung, die Bewerbung, kündigen, flexibel.",
      items: [
        w("die Bewerbung", "the application", "die", "/bəˈvɛʁbʊŋ/", "Ich schreibe eine Bewerbung.", "I am writing an application."),
        w("das Vorstellungsgespräch", "the interview", "das", "/ˈfoːɐ̯ʃtɛlʊŋsɡəˌʃpʁɛːç/", "Das Vorstellungsgespräch ist am Dienstag.", "The interview is on Tuesday."),
        w("der Kollege", "the colleague (m.)", "der", "/kɔˈleːɡə/", "Mein Kollege hilft mir.", "My colleague helps me."),
        w("die Besprechung", "the meeting", "die", "/bəˈʃpʁɛçʊŋ/", "Die Besprechung dauert eine Stunde.", "The meeting lasts an hour."),
        w("kündigen", "to resign / give notice", null, "/ˈkʏndɪɡn̩/", "Sie hat gekündigt.", "She resigned.", { pos: "verb" }),
        w("flexibel", "flexible", null, "/flɛˈksiːbl̩/", "Die Arbeitszeiten sind flexibel.", "The working hours are flexible.", { pos: "adj" })
      ]
    },
    {
      id: "b1-g-clauses",
      level: "B1", skill: "grammar", title: "Subordinate clauses",
      blurb: "dass, wenn, obwohl — verb to the end.",
      teach: "A2 taught weil. Same rule for dass, wenn, ob, obwohl, damit: Ich glaube, dass er recht hat.",
      items: [
        w("dass", "that", null, "/das/", "Ich denke, dass das stimmt.", "I think that that is true."),
        w("wenn", "if / when", null, "/vɛn/", "Wenn ich Zeit habe, rufe ich an.", "If I have time, I'll call."),
        w("obwohl", "although", null, "/ɔpˈvoːl/", "Obwohl ich müde bin, lerne ich.", "Although I am tired, I study."),
        w("ob", "whether", null, "/ɔp/", "Ich weiß nicht, ob sie kommt.", "I don't know whether she is coming."),
        w("damit", "so that", null, "/daˈmɪt/", "Ich lerne, damit ich den Test bestehe.", "I study so that I pass the test.")
      ]
    },
    {
      id: "b1-g-relatives",
      level: "B1", skill: "grammar", title: "Relative clauses",
      blurb: "The man who… — der/die/das as glue.",
      teach: "The relative pronoun matches gender/number of the noun, case from the inner clause: der Mann, der dort sitzt / den ich kenne.",
      items: [
        w("der Mann, der…", "the man who…", "der", "", "Der Mann, der dort sitzt, ist Arzt.", "The man who is sitting there is a doctor."),
        w("die Frau, die…", "the woman who…", "die", "", "Die Frau, die ich kenne, wohnt hier.", "The woman I know lives here."),
        w("das Buch, das…", "the book that…", "das", "", "Das Buch, das ich lese, ist gut.", "The book I am reading is good."),
        w("die Stadt, in der…", "the city in which…", "die", "", "Die Stadt, in der ich wohne, ist laut.", "The city I live in is loud.")
      ]
    },
    {
      id: "b1-g-k2",
      level: "B1", skill: "grammar", title: "Konjunktiv II",
      blurb: "Polite wishes and hypotheticals.",
      teach: "würde + infinitive, plus wäre / hätte. Ich hätte gern… is the grown-up version of A1 ich möchte.",
      items: [
        w("ich würde", "I would", null, "", "Ich würde gern helfen.", "I would like to help."),
        w("ich hätte gern", "I would like (to have)", null, "", "Ich hätte gern einen Tee.", "I would like a tea."),
        w("wenn ich Zeit hätte", "if I had time", null, "", "Wenn ich Zeit hätte, würde ich kommen.", "If I had time, I would come."),
        w("könnten Sie…?", "could you…?", null, "", "Könnten Sie das wiederholen?", "Could you repeat that?")
      ]
    },
    {
      id: "b1-g-passive",
      level: "B1", skill: "grammar", title: "Passive intro",
      blurb: "werden + participle — the thing is done.",
      teach: "Deutsch wird hier gesprochen. A2 Perfekt participles come back: Das Haus wird gebaut / wurde gebaut.",
      items: [
        w("wird gemacht", "is being done", null, "", "Das wird morgen gemacht.", "That will be done tomorrow."),
        w("wird gesprochen", "is spoken", null, "", "Hier wird Deutsch gesprochen.", "German is spoken here."),
        w("wurde gebaut", "was built", null, "", "Das Haus wurde 1920 gebaut.", "The house was built in 1920.")
      ]
    },
    {
      id: "b1-l-interview",
      level: "B1", skill: "listening", title: "A short interview",
      blurb: "Catch the opinion, not every word.",
      teach: "Listen for Meinung, Vorteil, deshalb. You already trained those in Opinions.",
      items: [
        w("Meiner Meinung nach ist Homeoffice besser.", "In my opinion working from home is better.", null, "", "Meiner Meinung nach ist Homeoffice besser.", "In my opinion working from home is better."),
        w("Ein Vorteil ist die Flexibilität.", "One advantage is flexibility.", null, "", "Ein Vorteil ist die Flexibilität.", "One advantage is flexibility.")
      ]
    },
    {
      id: "b1-s-argue",
      level: "B1", skill: "speaking", title: "Give a reason",
      blurb: "State a view + weil/dass in one breath.",
      teach: "Ich finde, dass… weil… Keep it to two clauses. Quality over length.",
      items: [
        w("Ich finde, dass Deutsch logisch ist.", "I think that German is logical.", null, "", "Ich finde, dass Deutsch logisch ist, weil die Regeln klar sind.", "I think German is logical because the rules are clear."),
        w("Ich bin dafür, weil…", "I am in favour because…", null, "", "Ich bin dafür, weil es Zeit spart.", "I am in favour because it saves time.")
      ]
    },
    {
      id: "b1-r-article",
      level: "B1", skill: "reading", title: "A news blurb",
      blurb: "Main point first, detail second.",
      teach: "Scan for weil / dass / obwohl to map the argument.",
      items: [
        w("Die Stadt baut eine neue Bahnlinie, obwohl es teuer ist.", "The city is building a new rail line although it is expensive.", null, "", "Die Stadt baut eine neue Bahnlinie, obwohl es teuer ist.", "The city is building a new rail line although it is expensive."),
        w("Viele Bürger sind dafür.", "Many citizens are in favour.", null, "", "Viele Bürger sind dafür.", "Many citizens are in favour.")
      ]
    },
    {
      id: "b1-w-opinion",
      level: "B1", skill: "writing", title: "Write your view",
      blurb: "Four sentences: claim, reason, example, close.",
      teach: "Use one dass and one weil. This is the B1 letter core.",
      items: [
        w("Ich finde, dass…", "I think that…", null, "", "Ich finde, dass öffentliche Verkehrsmittel wichtig sind.", "I think that public transport is important."),
        w("Ein Beispiel ist…", "An example is…", null, "", "Ein Beispiel ist die Verspätung gestern.", "An example is yesterday's delay.")
      ]
    },

    {
      id: "b2-v-abstract",
      level: "B2", skill: "vocabulary", title: "Abstract topics",
      blurb: "Society, environment, nuance.",
      teach: "These nouns show up in B2 writing. Pair them with B1 clause tools.",
      items: [
        w("die Gesellschaft", "society", "die", "/ɡəˈzɛlʃaft/", "Die Gesellschaft verändert sich schnell.", "Society is changing quickly."),
        w("die Umwelt", "the environment", "die", "/ˈʊmvɛlt/", "Wir müssen die Umwelt schützen.", "We must protect the environment."),
        w("die Herausforderung", "the challenge", "die", "/hɛˈʁaʊsfɔʁdəʁʊŋ/", "Das ist eine große Herausforderung.", "That is a big challenge."),
        w("nachhaltig", "sustainable", null, "/ˈnaːxhaltɪç/", "Wir brauchen nachhaltige Lösungen.", "We need sustainable solutions.", { pos: "adj" }),
        w("die Voraussetzung", "the prerequisite", "die", "/foˈʁaʊssetzʊŋ/", "Gute Deutschkenntnisse sind eine Voraussetzung.", "Good German is a prerequisite.")
      ]
    },
    {
      id: "b2-g-passiveplus",
      level: "B2", skill: "grammar", title: "Passive & Konjunktiv",
      blurb: "Blend B1 tools into longer argument.",
      teach: "Es würde begrüßt werden, wenn… Hypothetical + passive is classic B2 tone.",
      items: [
        w("es würde begrüßt werden", "it would be welcomed", null, "", "Es würde begrüßt werden, wenn mehr Züge fahren.", "It would be welcomed if more trains ran."),
        w("man sollte", "one should", null, "", "Man sollte die Kosten prüfen.", "One should examine the costs."),
        w("es wird behauptet", "it is claimed", null, "", "Es wird behauptet, dass das hilft.", "It is claimed that that helps.")
      ]
    },
    {
      id: "b2-l-debate",
      level: "B2", skill: "listening", title: "A short debate",
      blurb: "Who is for, who is against, and why.",
      items: [
        w("Einerseits spart es Geld, andererseits fehlt der Kontakt.", "On the one hand it saves money, on the other hand contact is missing.", null, "", "Einerseits spart es Geld, andererseits fehlt der Kontakt.", "On the one hand it saves money, on the other hand contact is missing.")
      ]
    },
    {
      id: "b2-w-essay",
      level: "B2", skill: "writing", title: "Structured paragraph",
      blurb: "Thesis, contrast, close.",
      items: [
        w("einerseits", "on the one hand", null, "", "Einerseits ist es praktisch.", "On the one hand it is practical."),
        w("andererseits", "on the other hand", null, "", "Andererseits ist es teuer.", "On the other hand it is expensive."),
        w("zusammenfassend", "in summary", null, "", "Zusammenfassend würde ich sagen…", "In summary I would say…")
      ]
    },

    {
      id: "c1-v-nuance",
      level: "C1", skill: "vocabulary", title: "Nuance & register",
      blurb: "The same idea, said like an adult.",
      teach: "Swap simple B1 words for precise ones: Problem → Herausforderung, wichtig → entscheidend.",
      items: [
        w("die Auseinandersetzung", "the critical engagement / dispute", "die", "/ˈaʊsʔaɪnandɐzɛtsʊŋ/", "Die kritische Auseinandersetzung mit dem Thema ist nötig.", "A critical engagement with the topic is necessary."),
        w("entscheidend", "decisive", null, "/ɛntˈʃaɪdn̩t/", "Das ist entscheidend für den Erfolg.", "That is decisive for success.", { pos: "adj" }),
        w("nachvollziehbar", "understandable / traceable", null, "/ˈnaːxfɔltsiːbaːɐ̯/", "Ihre Kritik ist nachvollziehbar.", "Your criticism is understandable.", { pos: "adj" }),
        w("im Wesentlichen", "essentially", null, "", "Im Wesentlichen stimme ich zu.", "Essentially I agree.")
      ]
    },
    {
      id: "c1-g-style",
      level: "C1", skill: "grammar", title: "Nominal style",
      blurb: "Pack a clause into a noun phrase.",
      teach: "weil die Kosten steigen → aufgrund steigender Kosten. C1 writing prefers this.",
      items: [
        w("aufgrund", "due to", null, "", "Aufgrund der Verspätung verpassten wir den Anschluss.", "Due to the delay we missed the connection."),
        w("hinsichtlich", "with regard to", null, "", "Hinsichtlich der Kosten gibt es Bedenken.", "With regard to the costs there are concerns."),
        w("infolge", "as a result of", null, "", "Infolge des Streiks fuhren weniger Züge.", "As a result of the strike fewer trains ran.")
      ]
    },
    {
      id: "c1-r-essay",
      level: "C1", skill: "reading", title: "Dense paragraph",
      blurb: "Track the author's stance, not every noun.",
      items: [
        w("Gleichwohl bleibt fraglich, ob die Maßnahme greift.", "Nevertheless it remains questionable whether the measure will work.", null, "", "Gleichwohl bleibt fraglich, ob die Maßnahme greift.", "Nevertheless it remains questionable whether the measure will work.")
      ]
    },

    {
      id: "c2-v-idiom",
      level: "C2", skill: "vocabulary", title: "Idiom & tact",
      blurb: "Words natives reach for without thinking.",
      items: [
        w("das Fingerspitzengefühl", "tact / fine instinct", "das", "/ˈfɪŋɐʃpɪtsn̩ɡəfyːl/", "Das verlangt Fingerspitzengefühl.", "That requires tact."),
        w("unabdingbar", "indispensable", null, "/ˈʊnapdɪŋbaːɐ̯/", "Regelmäßiges Sprechen ist unabdingbar.", "Regular speaking is indispensable.", { pos: "adj" }),
        w("den Nagel auf den Kopf treffen", "to hit the nail on the head", null, "", "Damit triffst du den Nagel auf den Kopf.", "With that you hit the nail on the head.")
      ]
    },
    {
      id: "c2-g-register",
      level: "C2", skill: "grammar", title: "Register control",
      blurb: "Same meaning, three social distances.",
      items: [
        w("Würden Sie so freundlich sein…", "Would you be so kind as to…", null, "", "Würden Sie so freundlich sein, das zu prüfen?", "Would you be so kind as to check that?"),
        w("Mach das bitte.", "Please do that.", null, "", "Mach das bitte.", "Please do that."),
        w("Es wäre wünschenswert, dass…", "It would be desirable that…", null, "", "Es wäre wünschenswert, dass wir uns einigen.", "It would be desirable that we agree.")
      ]
    }
  ];

  const skills = [
    { id: "vocabulary", name: "Vocab", color: "#efe7ff", ink: "#5b3cc4" },
    { id: "grammar", name: "Grammar", color: "#ffe8f1", ink: "#c4336a" },
    { id: "listening", name: "Listen", color: "#e7f3ff", ink: "#1d6fd6" },
    { id: "speaking", name: "Speak", color: "#fff3e0", ink: "#c46b12" },
    { id: "reading", name: "Read", color: "#e8f8ee", ink: "#1c8a4d" },
    { id: "writing", name: "Write", color: "#eef0ff", ink: "#3b4bb3" }
  ];

  const levels = [
    { code: "A1", name: "Beginner", hint: "Survive a first day." },
    { code: "A2", name: "Elementary", hint: "Tell yesterday and make plans." },
    { code: "B1", name: "Intermediate", hint: "Give reasons. Hold a view." },
    { code: "B2", name: "Upper", hint: "Argue with structure." },
    { code: "C1", name: "Advanced", hint: "Precision and register." },
    { code: "C2", name: "Mastery", hint: "Sound like you mean it." }
  ];

  const blurbs = {
    vocabulary: "Words you'll actually say — then reuse one level up.",
    grammar: "The rule, then a quiz that forces you to use it.",
    listening: "Hear it at real speed. Pick what was said.",
    speaking: "Build the line, then say it out loud.",
    reading: "Short real German. No walls of text.",
    writing: "Type it yourself. That's when it sticks."
  };

  function allItems() {
    const out = [];
    for (const l of lessons) for (const it of l.items) out.push({ ...it, lessonId: l.id, level: l.level, skill: l.skill });
    return out;
  }

  return { lessons, skills, levels, blurbs, allItems };
})();
