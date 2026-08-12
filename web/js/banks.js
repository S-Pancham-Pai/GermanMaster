// Vocabulary & phrase banks (curated). Each item: {de,en,gender,ipa,exampleDe,exampleEn,pos}
const w = (de, en, gender, ipa, exampleDe, exampleEn, pos) => ({ de, en, gender: gender || null, ipa: ipa || "", exampleDe: exampleDe || "", exampleEn: exampleEn || "", pos: pos || (gender ? "noun" : "other") });
const BANKS = {
  "a1-v-greet": [
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
  ],
  "a1-v-numbers": [
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
  ],
  "a1-v-family": [
    w("der Vater", "the father", "der", "/ˈfaːtɐ/", "Mein Vater kocht gern.", "My father likes to cook.", "noun"),
    w("die Mutter", "the mother", "die", "/ˈmʊtɐ/", "Meine Mutter heißt Lena.", "My mother's name is Lena.", "noun"),
    w("das Kind", "the child", "das", "/kɪnt/", "Das Kind spielt im Garten.", "The child is playing in the garden.", "noun"),
    w("der Bruder", "the brother", "der", "/ˈbʁuːdɐ/", "Ich habe einen Bruder.", "I have a brother.", "noun"),
    w("die Schwester", "the sister", "die", "/ˈʃvɛstɐ/", "Meine Schwester wohnt in Berlin.", "My sister lives in Berlin.", "noun"),
    w("die Familie", "the family", "die", "/faˈmiːli̯ə/", "Meine Familie ist klein.", "My family is small.", "noun"),
    w("der Freund", "the (male) friend", "der", "/fʁɔʏnt/", "Das ist mein Freund Max.", "This is my friend Max.", "noun"),
    w("die Freundin", "the (female) friend", "die", "/ˈfʁɔʏndɪn/", "Anna ist meine Freundin.", "Anna is my friend.", "noun"),
    w("der Mann", "the man / husband", "der", "/man/", "Der Mann liest eine Zeitung.", "The man is reading a newspaper.", "noun"),
    w("die Frau", "the woman / wife", "die", "/fʁaʊ/", "Die Frau arbeitet hier.", "The woman works here.", "noun")
  ],
  "a1-v-food": [
    w("das Brot", "the bread", "das", "/bʁoːt/", "Ich kaufe frisches Brot.", "I buy fresh bread.", "noun"),
    w("der Käse", "the cheese", "der", "/ˈkɛːzə/", "Der Käse ist lecker.", "The cheese is tasty.", "noun"),
    w("der Apfel", "the apple", "der", "/ˈapfl̩/", "Ich esse einen Apfel.", "I am eating an apple.", "noun"),
    w("das Wasser", "the water", "das", "/ˈvasɐ/", "Ein Glas Wasser, bitte.", "A glass of water, please.", "noun"),
    w("der Kaffee", "the coffee", "der", "/ˈkafe/", "Ich trinke morgens Kaffee.", "I drink coffee in the morning.", "noun"),
    w("der Tee", "the tea", "der", "/teː/", "Möchtest du Tee?", "Would you like tea?", "noun"),
    w("das Bier", "the beer", "das", "/biːɐ̯/", "Ein kleines Bier, bitte.", "A small beer, please.", "noun"),
    w("die Milch", "the milk", "die", "/mɪlç/", "Die Milch ist kalt.", "The milk is cold.", "noun"),
    w("das Essen", "the food / meal", "das", "/ˈɛsn̩/", "Das Essen schmeckt gut.", "The food tastes good.", "noun"),
    w("die Rechnung", "the bill", "die", "/ˈʁɛçnʊŋ/", "Die Rechnung, bitte.", "The bill, please.", "noun")
  ],
  "a1-v-colors": [
    w("rot", "red", null, "/ʁoːt/", "Der Apfel ist rot.", "The apple is red.", "adj"),
    w("blau", "blue", null, "/blaʊ/", "Der Himmel ist blau.", "The sky is blue.", "adj"),
    w("grün", "green", null, "/ɡʁyːn/", "Das Gras ist grün.", "The grass is green.", "adj"),
    w("gelb", "yellow", null, "/ɡɛlp/", "Die Banane ist gelb.", "The banana is yellow.", "adj"),
    w("schwarz", "black", null, "/ʃvaʁts/", "Das Auto ist schwarz.", "The car is black.", "adj"),
    w("weiß", "white", null, "/vaɪs/", "Der Schnee ist weiß.", "The snow is white.", "adj"),
    w("braun", "brown", null, "/bʁaʊn/", "Der Tisch ist braun.", "The table is brown.", "adj"),
    w("grau", "grey", null, "/ɡʁaʊ/", "Die Katze ist grau.", "The cat is grey.", "adj")
  ],
  "a1-v-time": [
    w("heute", "today", null, "/ˈhɔʏtə/", "Heute lerne ich Deutsch.", "Today I am learning German."),
    w("morgen", "tomorrow", null, "/ˈmɔʁɡn̩/", "Morgen gehe ich zur Arbeit.", "Tomorrow I go to work."),
    w("gestern", "yesterday", null, "/ˈɡɛstɐn/", "Gestern war ich müde.", "Yesterday I was tired."),
    w("der Montag", "Monday", "der", "/ˈmoːntaːk/", "Am Montag habe ich Zeit.", "On Monday I have time.", "noun"),
    w("der Freitag", "Friday", "der", "/ˈfʁaɪtaːk/", "Freitagabend gehe ich aus.", "Friday evening I go out.", "noun"),
    w("das Wochenende", "the weekend", "das", "/ˈvɔxn̩ˌɛndə/", "Am Wochenende schlafe ich lange.", "On the weekend I sleep in.", "noun"),
    w("die Uhr", "the clock / o'clock", "die", "/uːɐ̯/", "Es ist acht Uhr.", "It is eight o'clock.", "noun"),
    w("jetzt", "now", null, "/jɛtst/", "Ich bin jetzt hier.", "I am here now.")
  ],
  "a1-v-home": [
    w("das Haus", "the house", "das", "/haʊs/", "Unser Haus ist alt.", "Our house is old.", "noun"),
    w("die Wohnung", "the apartment", "die", "/ˈvoːnʊŋ/", "Die Wohnung ist klein, aber hell.", "The apartment is small but bright.", "noun"),
    w("das Zimmer", "the room", "das", "/ˈtsɪmɐ/", "Mein Zimmer ist oben.", "My room is upstairs.", "noun"),
    w("die Küche", "the kitchen", "die", "/ˈkʏçə/", "Wir essen in der Küche.", "We eat in the kitchen.", "noun"),
    w("das Bad", "the bathroom", "das", "/baːt/", "Wo ist das Bad?", "Where is the bathroom?", "noun"),
    w("der Tisch", "the table", "der", "/tɪʃ/", "Die Schlüssel liegen auf dem Tisch.", "The keys are on the table.", "noun"),
    w("das Bett", "the bed", "das", "/bɛt/", "Ich gehe ins Bett.", "I am going to bed.", "noun"),
    w("die Tür", "the door", "die", "/tyːɐ̯/", "Bitte mach die Tür zu.", "Please close the door.", "noun")
  ],
  "a1-v-city": [
    w("die Stadt", "the city", "die", "/ʃtat/", "Die Stadt ist groß.", "The city is big.", "noun"),
    w("der Bahnhof", "the train station", "der", "/ˈbaːnhoːf/", "Der Zug kommt am Bahnhof an.", "The train arrives at the station.", "noun"),
    w("der Supermarkt", "the supermarket", "der", "/ˈzuːpɐmaʁkt/", "Ich gehe in den Supermarkt.", "I am going to the supermarket.", "noun"),
    w("die Schule", "the school", "die", "/ˈʃuːlə/", "Die Schule beginnt um acht.", "School starts at eight.", "noun"),
    w("das Restaurant", "the restaurant", "das", "/ʁɛstoˈʁãː/", "Wir essen im Restaurant.", "We are eating at the restaurant.", "noun"),
    w("die Straße", "the street", "die", "/ˈʃtʁaːsə/", "In welcher Straße wohnst du?", "Which street do you live on?", "noun"),
    w("links", "left", null, "/lɪŋks/", "Die Bank ist links.", "The bank is on the left."),
    w("rechts", "right", null, "/ʁɛçts/", "Gehen Sie rechts.", "Go right.")
  ],
  "a1-g-pronouns": [
    w("ich", "I", null, "/ɪç/", "Ich lerne Deutsch.", "I am learning German."),
    w("du", "you (informal)", null, "/duː/", "Du bist nett.", "You are nice."),
    w("er", "he", null, "/eːɐ̯/", "Er kommt aus Indien.", "He comes from India."),
    w("sie", "she / they", null, "/ziː/", "Sie heißt Mira.", "Her name is Mira."),
    w("es", "it", null, "/ɛs/", "Es ist kalt.", "It is cold."),
    w("wir", "we", null, "/viːɐ̯/", "Wir wohnen in München.", "We live in Munich."),
    w("ihr", "you all", null, "/iːɐ̯/", "Ihr seid müde.", "You all are tired."),
    w("Sie", "you (formal)", null, "/ziː/", "Wie heißen Sie?", "What is your name? (formal)")
  ],
  "a1-g-articles": [
    w("der Tisch", "the table (masc.)", "der", "/tɪʃ/", "Der Tisch ist neu.", "The table is new.", "noun"),
    w("die Lampe", "the lamp (fem.)", "die", "/ˈlampə/", "Die Lampe ist hell.", "The lamp is bright.", "noun"),
    w("das Buch", "the book (neut.)", "das", "/buːx/", "Das Buch ist spannend.", "The book is exciting.", "noun"),
    w("der Stuhl", "the chair", "der", "/ʃtuːl/", "Der Stuhl ist bequem.", "The chair is comfortable.", "noun"),
    w("die Tasche", "the bag", "die", "/ˈtaʃə/", "Die Tasche ist schwer.", "The bag is heavy.", "noun"),
    w("das Fenster", "the window", "das", "/ˈfɛnstɐ/", "Das Fenster ist offen.", "The window is open.", "noun"),
    w("der Hund", "the dog", "der", "/hʊnt/", "Der Hund ist klein.", "The dog is small.", "noun"),
    w("die Katze", "the cat", "die", "/ˈkatsə/", "Die Katze schläft.", "The cat is sleeping.", "noun")
  ],
  "a1-g-seinhaben": [
    w("ich bin", "I am", null, "/ɪç bɪn/", "Ich bin Student.", "I am a student."),
    w("du bist", "you are", null, "/duː bɪst/", "Du bist freundlich.", "You are friendly."),
    w("er ist", "he is", null, "/eːɐ̯ ɪst/", "Er ist Arzt.", "He is a doctor."),
    w("wir sind", "we are", null, "/viːɐ̯ zɪnt/", "Wir sind zu Hause.", "We are at home."),
    w("ich habe", "I have", null, "/ɪç ˈhaːbə/", "Ich habe Zeit.", "I have time."),
    w("du hast", "you have", null, "/duː hast/", "Du hast ein Auto.", "You have a car."),
    w("sie hat", "she has", null, "/ziː hat/", "Sie hat zwei Geschwister.", "She has two siblings."),
    w("wir haben", "we have", null, "/viːɐ̯ ˈhaːbn̩/", "Wir haben Hunger.", "We are hungry.")
  ],
  "a1-g-present": [
    w("lernen", "to learn", null, "/ˈlɛʁnən/", "Ich lerne jeden Tag.", "I learn every day.", "verb"),
    w("wohnen", "to live", null, "/ˈvoːnən/", "Wir wohnen in Hamburg.", "We live in Hamburg.", "verb"),
    w("kommen", "to come", null, "/ˈkɔmən/", "Woher kommst du?", "Where do you come from?", "verb"),
    w("machen", "to do / make", null, "/ˈmaxn̩/", "Was machst du?", "What are you doing?", "verb"),
    w("spielen", "to play", null, "/ˈʃpiːlən/", "Die Kinder spielen draußen.", "The children are playing outside.", "verb"),
    w("kaufen", "to buy", null, "/ˈkaʊfn̩/", "Ich kaufe Brot.", "I am buying bread.", "verb"),
    w("arbeiten", "to work", null, "/ˈaʁbaɪtn̩/", "Sie arbeitet im Büro.", "She works in the office.", "verb"),
    w("heißen", "to be called", null, "/ˈhaɪsn̩/", "Wie heißt das auf Deutsch?", "What is that called in German?", "verb")
  ],
  "a1-g-wordorder": [
    w("Ich lerne Deutsch.", "I learn German.", null, "", "Ich lerne Deutsch.", "I learn German."),
    w("Heute lerne ich.", "Today I learn.", null, "", "Heute lerne ich zu Hause.", "Today I learn at home."),
    w("Am Montag arbeite ich.", "On Monday I work.", null, "", "Am Montag arbeite ich von zu Hause.", "On Monday I work from home."),
    w("Wir trinken Kaffee.", "We drink coffee.", null, "", "Wir trinken Kaffee im Café.", "We drink coffee in the café.")
  ],
  "a1-g-accusative": [
    w("Ich sehe den Mann.", "I see the man.", null, "", "Ich sehe den Mann.", "I see the man."),
    w("Ich habe einen Hund.", "I have a dog.", null, "", "Ich habe einen Hund.", "I have a dog."),
    w("Sie kauft das Brot.", "She buys the bread.", null, "", "Sie kauft das Brot.", "She buys the bread."),
    w("Wir treffen die Frau.", "We meet the woman.", null, "", "Wir treffen die Frau.", "We meet the woman.")
  ],
  "a1-g-negation": [
    w("kein", "no / not a", null, "/kaɪn/", "Ich habe kein Geld.", "I have no money."),
    w("nicht", "not", null, "/nɪçt/", "Ich bin nicht müde.", "I am not tired."),
    w("Ich komme nicht.", "I am not coming.", null, "", "Ich komme heute nicht.", "I am not coming today."),
    w("keine Zeit", "no time", null, "", "Ich habe keine Zeit.", "I have no time.")
  ],
  "a1-g-questions": [
    w("Wie?", "How?", null, "/viː/", "Wie geht's?", "How's it going?"),
    w("Wo?", "Where?", null, "/voː/", "Wo wohnst du?", "Where do you live?"),
    w("Wann?", "When?", null, "/van/", "Wann beginnt der Kurs?", "When does the course start?"),
    w("Was?", "What?", null, "/vas/", "Was machst du?", "What are you doing?"),
    w("Wer?", "Who?", null, "/veːɐ̯/", "Wer ist das?", "Who is that?"),
    w("Warum?", "Why?", null, "/vaˈʁʊm/", "Warum lernst du Deutsch?", "Why are you learning German?")
  ],
  "a1-l-greet": [
    w("Hallo, ich heiße Anna.", "Hello, my name is Anna.", null, "", "Hallo, ich heiße Anna.", "Hello, my name is Anna."),
    w("Guten Morgen, wie geht's?", "Good morning, how's it going?", null, "", "Guten Morgen, wie geht's?", "Good morning, how's it going?"),
    w("Freut mich.", "Nice to meet you.", null, "", "Freut mich.", "Nice to meet you."),
    w("Tschüss, bis morgen.", "Bye, see you tomorrow.", null, "", "Tschüss, bis morgen.", "Bye, see you tomorrow.")
  ],
  "a1-l-numbers": [
    w("Es kostet zehn Euro.", "It costs ten euros.", null, "", "Es kostet zehn Euro.", "It costs ten euros."),
    w("Ich bin zwanzig.", "I am twenty.", null, "", "Ich bin zwanzig Jahre alt.", "I am twenty years old."),
    w("Zwei Kaffee, bitte.", "Two coffees, please.", null, "", "Zwei Kaffee, bitte.", "Two coffees, please."),
    w("Es ist acht Uhr.", "It is eight o'clock.", null, "", "Es ist acht Uhr.", "It is eight o'clock.")
  ],
  "a1-s-intro": [
    w("Ich heiße…", "My name is…", null, "", "Ich heiße Sam.", "My name is Sam."),
    w("Ich komme aus…", "I come from…", null, "", "Ich komme aus Indien.", "I come from India."),
    w("Ich wohne in…", "I live in…", null, "", "Ich wohne in Bengaluru.", "I live in Bengaluru."),
    w("Ich lerne Deutsch.", "I am learning German.", null, "", "Ich lerne Deutsch.", "I am learning German.")
  ],
  "a1-s-cafe": [
    w("Ich möchte einen Kaffee.", "I would like a coffee.", null, "", "Ich möchte einen Kaffee, bitte.", "I would like a coffee, please."),
    w("Mit Milch, bitte.", "With milk, please.", null, "", "Mit Milch, bitte.", "With milk, please."),
    w("Das ist alles.", "That's all.", null, "", "Das ist alles, danke.", "That's all, thank you."),
    w("Die Rechnung, bitte.", "The bill, please.", null, "", "Die Rechnung, bitte.", "The bill, please.")
  ],
  "a1-r-dialogue": [
    w("Wie heißt du?", "What's your name?", null, "", "Wie heißt du?", "What's your name?"),
    w("Und du?", "And you?", null, "", "Und du?", "And you?"),
    w("Freut mich.", "Nice to meet you.", null, "", "Freut mich.", "Nice to meet you."),
    w("Ich bin Omar.", "I am Omar.", null, "", "Ich bin Omar.", "I am Omar.")
  ],
  "a1-r-sign": [
    w("Eingang", "entrance", null, "/ˈaɪnɡaŋ/", "Der Eingang ist links.", "The entrance is on the left."),
    w("Ausgang", "exit", null, "/ˈaʊsɡaŋ/", "Wo ist der Ausgang?", "Where is the exit?"),
    w("geöffnet", "open", null, "/ɡəˈœfnət/", "Das Café ist geöffnet.", "The café is open."),
    w("geschlossen", "closed", null, "/ɡəˈʃlɔsn̩/", "Heute geschlossen.", "Closed today.")
  ],
  "a1-w-form": [
    w("Mein Name ist…", "My name is…", null, "", "Mein Name ist Riya.", "My name is Riya."),
    w("Ich wohne in…", "I live in…", null, "", "Ich wohne in Bengaluru.", "I live in Bengaluru."),
    w("Ich komme aus…", "I come from…", null, "", "Ich komme aus Indien.", "I come from India."),
    w("Meine E-Mail ist…", "My email is…", null, "", "Meine E-Mail ist riya@mail.com.", "My email is riya@mail.com.")
  ],
  "a1-w-three": [
    w("Hallo!", "Hello!", null, "", "Hallo!", "Hello!"),
    w("Ich bin Student.", "I am a student.", null, "", "Ich bin Student.", "I am a student."),
    w("Ich wohne in der Stadt.", "I live in the city.", null, "", "Ich wohne in der Stadt.", "I live in the city."),
    w("Ich lerne Deutsch.", "I am learning German.", null, "", "Ich lerne Deutsch.", "I am learning German.")
  ],
  "a2-v-routine": [
    w("aufstehen", "to get up", null, "/ˈaʊfˌʃteːən/", "Ich stehe um sieben auf.", "I get up at seven.", "verb"),
    w("frühstücken", "to have breakfast", null, "/ˈfʁyːʃtʏkn̩/", "Wir frühstücken zusammen.", "We have breakfast together.", "verb"),
    w("die Arbeit", "work", "die", "/ˈaʁbaɪt/", "Nach der Arbeit bin ich müde.", "After work I am tired.", "noun"),
    w("einkaufen", "to go shopping", null, "/ˈaɪnˌkaʊfn̩/", "Am Samstag kaufe ich ein.", "On Saturday I go shopping.", "verb"),
    w("kochen", "to cook", null, "/ˈkɔxn̩/", "Er kocht am Abend.", "He cooks in the evening.", "verb"),
    w("schlafen", "to sleep", null, "/ˈʃlaːfn̩/", "Ich schlafe acht Stunden.", "I sleep eight hours.", "verb"),
    w("die Pause", "the break", "die", "/ˈpaʊzə/", "Wir machen eine Pause.", "We are taking a break.", "noun"),
    w("müde", "tired", null, "/ˈmyːdə/", "Ich bin heute müde.", "I am tired today.", "adj")
  ],
  "a2-v-shopping": [
    w("kosten", "to cost", null, "/ˈkɔstn̩/", "Was kostet das?", "What does that cost?", "verb"),
    w("teuer", "expensive", null, "/ˈtɔʏɐ/", "Das ist zu teuer.", "That is too expensive.", "adj"),
    w("billig", "cheap", null, "/ˈbɪlɪç/", "Dieses Brot ist billig.", "This bread is cheap.", "adj"),
    w("die Größe", "the size", "die", "/ˈɡʁøːsə/", "Welche Größe haben Sie?", "Which size do you have?", "noun"),
    w("probieren", "to try on / try", null, "/pʁoˈbiːʁən/", "Kann ich das probieren?", "Can I try that?", "verb"),
    w("bar", "in cash", null, "/baːɐ̯/", "Zahle ich bar oder mit Karte?", "Shall I pay cash or by card?"),
    w("die Karte", "the card", "die", "/ˈkaʁtə/", "Ich zahle mit Karte.", "I pay by card.", "noun"),
    w("zurückgeben", "to return", null, "/t͡suˈʁʏkˌɡeːbn̩/", "Kann ich das zurückgeben?", "Can I return this?", "verb")
  ],
  "a2-v-travel": [
    w("der Zug", "the train", "der", "/t͡suːk/", "Der Zug hat Verspätung.", "The train is delayed.", "noun"),
    w("das Gleis", "the platform / track", "das", "/ɡlaɪs/", "Gleis fünf, bitte.", "Platform five, please.", "noun"),
    w("die Fahrkarte", "the ticket", "die", "/ˈfaːɐ̯kaʁtə/", "Wo kann ich eine Fahrkarte kaufen?", "Where can I buy a ticket?", "noun"),
    w("umsteigen", "to change trains", null, "/ˈʊmˌʃtaɪɡn̩/", "Sie müssen in Köln umsteigen.", "You have to change in Cologne.", "verb"),
    w("die Verspätung", "the delay", "die", "/fɛɐ̯ˈʃpɛːtʊŋ/", "Zehn Minuten Verspätung.", "A ten-minute delay.", "noun"),
    w("ankommen", "to arrive", null, "/ˈanˌkɔmən/", "Wann kommt der Zug an?", "When does the train arrive?", "verb"),
    w("abfahren", "to depart", null, "/ˈapˌfaːʁən/", "Der Bus fährt um neun ab.", "The bus leaves at nine.", "verb"),
    w("das Hotel", "the hotel", "das", "/hoˈtɛl/", "Ich habe ein Zimmer im Hotel.", "I have a room at the hotel.", "noun")
  ],
  "a2-v-health": [
    w("der Arzt", "the doctor (m.)", "der", "/aːɐ̯tst/", "Ich gehe zum Arzt.", "I am going to the doctor.", "noun"),
    w("die Ärztin", "the doctor (f.)", "die", "/ˈɛːɐ̯tstɪn/", "Die Ärztin ist sehr nett.", "The doctor is very kind.", "noun"),
    w("der Kopf", "the head", "der", "/kɔpf/", "Mein Kopf tut weh.", "My head hurts.", "noun"),
    w("der Schmerz", "the pain", "der", "/ʃmɛʁts/", "Ich habe Schmerzen.", "I am in pain.", "noun"),
    w("krank", "sick", null, "/kʁaŋk/", "Ich bin krank.", "I am sick.", "adj"),
    w("die Apotheke", "the pharmacy", "die", "/apoˈteːkə/", "Wo ist die Apotheke?", "Where is the pharmacy?", "noun"),
    w("das Rezept", "the prescription", "das", "/ʁeˈt͡sɛpt/", "Hier ist das Rezept.", "Here is the prescription.", "noun"),
    w("ruhen", "to rest", null, "/ˈʁuːən/", "Sie müssen sich ruhen.", "You need to rest.", "verb")
  ],
  "a2-g-perfekt": [
    w("ich habe gelernt", "I learned / have learned", null, "", "Ich habe gestern gelernt.", "I studied yesterday."),
    w("ich habe gekauft", "I bought", null, "", "Ich habe Brot gekauft.", "I bought bread."),
    w("ich bin gegangen", "I went", null, "", "Ich bin nach Hause gegangen.", "I went home."),
    w("wir sind gefahren", "we traveled / drove", null, "", "Wir sind mit dem Zug gefahren.", "We went by train."),
    w("sie hat gemacht", "she did / made", null, "", "Sie hat das Essen gemacht.", "She made the food."),
    w("hast du gesehen?", "did you see?", null, "", "Hast du den Film gesehen?", "Did you see the film?")
  ],
  "a2-g-dative": [
    w("dem Mann", "to the man", "der", "", "Ich helfe dem Mann.", "I help the man.", "noun"),
    w("der Frau", "to the woman", "die", "", "Das gehört der Frau.", "That belongs to the woman.", "noun"),
    w("dem Kind", "to the child", "das", "", "Ich gebe dem Kind einen Apfel.", "I give the child an apple.", "noun"),
    w("mit dem Zug", "by train", "der", "", "Ich fahre mit dem Zug.", "I travel by train.", "noun"),
    w("aus der Stadt", "from the city", "die", "", "Er kommt aus der Stadt.", "He comes from the city.", "noun")
  ],
  "a2-g-separable": [
    w("aufstehen", "to get up", null, "", "Ich stehe früh auf.", "I get up early.", "verb"),
    w("ankommen", "to arrive", null, "", "Der Zug kommt pünktlich an.", "The train arrives on time.", "verb"),
    w("einkaufen", "to shop", null, "", "Wir kaufen am Markt ein.", "We shop at the market.", "verb"),
    w("mitkommen", "to come along", null, "", "Kommst du mit?", "Are you coming along?", "verb"),
    w("fernsehen", "to watch TV", null, "", "Abends sehen wir fern.", "In the evenings we watch TV.", "verb")
  ],
  "a2-g-modals": [
    w("können", "can / to be able to", null, "/ˈkœnən/", "Ich kann Deutsch sprechen.", "I can speak German.", "verb"),
    w("müssen", "must / to have to", null, "/ˈmʏsn̩/", "Ich muss gehen.", "I have to go.", "verb"),
    w("wollen", "to want", null, "/ˈvɔlən/", "Wir wollen reisen.", "We want to travel.", "verb"),
    w("dürfen", "may / to be allowed", null, "/ˈdʏʁfn̩/", "Darf ich hier sitzen?", "May I sit here?", "verb"),
    w("sollen", "should / ought to", null, "/ˈzɔlən/", "Du sollst mehr trinken.", "You should drink more.", "verb")
  ],
  "a2-g-comparatives": [
    w("größer als", "bigger than", null, "", "Berlin ist größer als Bremen.", "Berlin is bigger than Bremen."),
    w("kleiner als", "smaller than", null, "", "Meine Wohnung ist kleiner als deine.", "My apartment is smaller than yours."),
    w("besser", "better", null, "", "Heute geht es besser.", "Today it's better."),
    w("lieber", "prefer / rather", null, "", "Ich trinke lieber Tee.", "I prefer tea."),
    w("am besten", "the best", null, "", "Das ist am besten.", "That is the best.")
  ],
  "a2-g-weil": [
    w("weil", "because (verb last)", null, "/vaɪl/", "Ich lerne, weil ich in Berlin studieren will.", "I study because I want to study in Berlin."),
    w("denn", "because (verb 2)", null, "/dɛn/", "Ich gehe, denn es ist spät.", "I am leaving because it is late."),
    w("deshalb", "therefore", null, "/ˈdɛshalp/", "Ich bin krank, deshalb bleibe ich zu Hause.", "I am sick, therefore I stay home.")
  ],
  "a2-l-station": [
    w("Der Zug nach Hamburg hat zehn Minuten Verspätung.", "The train to Hamburg is delayed by ten minutes.", null, "", "Der Zug nach Hamburg hat zehn Minuten Verspätung.", "The train to Hamburg is delayed by ten minutes."),
    w("Abfahrt auf Gleis fünf.", "Departure on platform five.", null, "", "Abfahrt auf Gleis fünf.", "Departure on platform five."),
    w("Bitte umsteigen in Köln.", "Please change in Cologne.", null, "", "Bitte umsteigen in Köln.", "Please change in Cologne.")
  ],
  "a2-s-doctor": [
    w("Ich habe Kopfschmerzen.", "I have a headache.", null, "", "Ich habe seit gestern Kopfschmerzen.", "I have had a headache since yesterday."),
    w("Mir ist schlecht.", "I feel sick.", null, "", "Mir ist schlecht.", "I feel sick."),
    w("Seit wann?", "Since when?", null, "", "Seit wann haben Sie das?", "Since when have you had that?")
  ],
  "a2-r-email": [
    w("vielen Dank", "many thanks", null, "", "Vielen Dank für Ihre E-Mail.", "Many thanks for your email."),
    w("Leider", "unfortunately", null, "", "Leider kann ich nicht kommen.", "Unfortunately I cannot come."),
    w("Viele Grüße", "best regards", null, "", "Viele Grüße, Ana", "Best regards, Ana.")
  ],
  "a2-w-message": [
    w("Hallo Lea,", "Hi Lea,", null, "", "Hallo Lea,", "Hi Lea,"),
    w("ich kann heute nicht kommen, weil ich krank bin.", "I cannot come today because I am sick.", null, "", "ich kann heute nicht kommen, weil ich krank bin.", "I cannot come today because I am sick."),
    w("Viele Grüße", "Best regards", null, "", "Viele Grüße", "Best regards")
  ],
  "b1-v-opinions": [
    w("die Meinung", "the opinion", "die", "/ˈmaɪnʊŋ/", "Meiner Meinung nach ist das richtig.", "In my opinion that is right.", "noun"),
    w("finden", "to find / think", null, "/ˈfɪndn̩/", "Ich finde den Film spannend.", "I find the film exciting.", "verb"),
    w("zustimmen", "to agree", null, "/ˈt͡suːˌʃtɪmən/", "Ich stimme dir zu.", "I agree with you.", "verb"),
    w("dagegen sein", "to be against", null, "", "Ich bin dagegen.", "I am against it."),
    w("der Vorteil", "the advantage", "der", "/ˈfoːɐ̯taɪl/", "Der Vorteil ist klar.", "The advantage is clear.", "noun"),
    w("der Nachteil", "the disadvantage", "der", "/ˈnaːxtaɪl/", "Ein Nachteil ist der Preis.", "One disadvantage is the price.", "noun")
  ],
  "b1-v-work": [
    w("die Bewerbung", "the application", "die", "/bəˈvɛʁbʊŋ/", "Ich schreibe eine Bewerbung.", "I am writing an application.", "noun"),
    w("das Vorstellungsgespräch", "the interview", "das", "/ˈfoːɐ̯ʃtɛlʊŋsɡəˌʃpʁɛːç/", "Das Vorstellungsgespräch ist am Dienstag.", "The interview is on Tuesday.", "noun"),
    w("der Kollege", "the colleague (m.)", "der", "/kɔˈleːɡə/", "Mein Kollege hilft mir.", "My colleague helps me.", "noun"),
    w("die Besprechung", "the meeting", "die", "/bəˈʃpʁɛçʊŋ/", "Die Besprechung dauert eine Stunde.", "The meeting lasts an hour.", "noun"),
    w("kündigen", "to resign / give notice", null, "/ˈkʏndɪɡn̩/", "Sie hat gekündigt.", "She resigned.", "verb"),
    w("flexibel", "flexible", null, "/flɛˈksiːbl̩/", "Die Arbeitszeiten sind flexibel.", "The working hours are flexible.", "adj")
  ],
  "b1-g-clauses": [
    w("dass", "that", null, "/das/", "Ich denke, dass das stimmt.", "I think that that is true."),
    w("wenn", "if / when", null, "/vɛn/", "Wenn ich Zeit habe, rufe ich an.", "If I have time, I'll call."),
    w("obwohl", "although", null, "/ɔpˈvoːl/", "Obwohl ich müde bin, lerne ich.", "Although I am tired, I study."),
    w("ob", "whether", null, "/ɔp/", "Ich weiß nicht, ob sie kommt.", "I don't know whether she is coming."),
    w("damit", "so that", null, "/daˈmɪt/", "Ich lerne, damit ich den Test bestehe.", "I study so that I pass the test.")
  ],
  "b1-g-relatives": [
    w("der Mann, der…", "the man who…", "der", "", "Der Mann, der dort sitzt, ist Arzt.", "The man who is sitting there is a doctor.", "noun"),
    w("die Frau, die…", "the woman who…", "die", "", "Die Frau, die ich kenne, wohnt hier.", "The woman I know lives here.", "noun"),
    w("das Buch, das…", "the book that…", "das", "", "Das Buch, das ich lese, ist gut.", "The book I am reading is good.", "noun"),
    w("die Stadt, in der…", "the city in which…", "die", "", "Die Stadt, in der ich wohne, ist laut.", "The city I live in is loud.", "noun")
  ],
  "b1-g-k2": [
    w("ich würde", "I would", null, "", "Ich würde gern helfen.", "I would like to help."),
    w("ich hätte gern", "I would like (to have)", null, "", "Ich hätte gern einen Tee.", "I would like a tea."),
    w("wenn ich Zeit hätte", "if I had time", null, "", "Wenn ich Zeit hätte, würde ich kommen.", "If I had time, I would come."),
    w("könnten Sie…?", "could you…?", null, "", "Könnten Sie das wiederholen?", "Could you repeat that?")
  ],
  "b1-g-passive": [
    w("wird gemacht", "is being done", null, "", "Das wird morgen gemacht.", "That will be done tomorrow."),
    w("wird gesprochen", "is spoken", null, "", "Hier wird Deutsch gesprochen.", "German is spoken here."),
    w("wurde gebaut", "was built", null, "", "Das Haus wurde 1920 gebaut.", "The house was built in 1920.")
  ],
  "b1-l-interview": [
    w("Meiner Meinung nach ist Homeoffice besser.", "In my opinion working from home is better.", null, "", "Meiner Meinung nach ist Homeoffice besser.", "In my opinion working from home is better."),
    w("Ein Vorteil ist die Flexibilität.", "One advantage is flexibility.", null, "", "Ein Vorteil ist die Flexibilität.", "One advantage is flexibility.")
  ],
  "b1-s-argue": [
    w("Ich finde, dass Deutsch logisch ist.", "I think that German is logical.", null, "", "Ich finde, dass Deutsch logisch ist, weil die Regeln klar sind.", "I think German is logical because the rules are clear."),
    w("Ich bin dafür, weil…", "I am in favour because…", null, "", "Ich bin dafür, weil es Zeit spart.", "I am in favour because it saves time.")
  ],
  "b1-r-article": [
    w("Die Stadt baut eine neue Bahnlinie, obwohl es teuer ist.", "The city is building a new rail line although it is expensive.", null, "", "Die Stadt baut eine neue Bahnlinie, obwohl es teuer ist.", "The city is building a new rail line although it is expensive."),
    w("Viele Bürger sind dafür.", "Many citizens are in favour.", null, "", "Viele Bürger sind dafür.", "Many citizens are in favour.")
  ],
  "b1-w-opinion": [
    w("Ich finde, dass…", "I think that…", null, "", "Ich finde, dass öffentliche Verkehrsmittel wichtig sind.", "I think that public transport is important."),
    w("Ein Beispiel ist…", "An example is…", null, "", "Ein Beispiel ist die Verspätung gestern.", "An example is yesterday's delay.")
  ],
  "b2-v-abstract": [
    w("die Gesellschaft", "society", "die", "/ɡəˈzɛlʃaft/", "Die Gesellschaft verändert sich schnell.", "Society is changing quickly.", "noun"),
    w("die Umwelt", "the environment", "die", "/ˈʊmvɛlt/", "Wir müssen die Umwelt schützen.", "We must protect the environment.", "noun"),
    w("die Herausforderung", "the challenge", "die", "/hɛˈʁaʊsfɔʁdəʁʊŋ/", "Das ist eine große Herausforderung.", "That is a big challenge.", "noun"),
    w("nachhaltig", "sustainable", null, "/ˈnaːxhaltɪç/", "Wir brauchen nachhaltige Lösungen.", "We need sustainable solutions.", "adj"),
    w("die Voraussetzung", "the prerequisite", "die", "/foˈʁaʊssetzʊŋ/", "Gute Deutschkenntnisse sind eine Voraussetzung.", "Good German is a prerequisite.", "noun")
  ],
  "b2-g-passiveplus": [
    w("es würde begrüßt werden", "it would be welcomed", null, "", "Es würde begrüßt werden, wenn mehr Züge fahren.", "It would be welcomed if more trains ran."),
    w("man sollte", "one should", null, "", "Man sollte die Kosten prüfen.", "One should examine the costs."),
    w("es wird behauptet", "it is claimed", null, "", "Es wird behauptet, dass das hilft.", "It is claimed that that helps.")
  ],
  "b2-l-debate": [
    w("Einerseits spart es Geld, andererseits fehlt der Kontakt.", "On the one hand it saves money, on the other hand contact is missing.", null, "", "Einerseits spart es Geld, andererseits fehlt der Kontakt.", "On the one hand it saves money, on the other hand contact is missing.")
  ],
  "b2-w-essay": [
    w("einerseits", "on the one hand", null, "", "Einerseits ist es praktisch.", "On the one hand it is practical."),
    w("andererseits", "on the other hand", null, "", "Andererseits ist es teuer.", "On the other hand it is expensive."),
    w("zusammenfassend", "in summary", null, "", "Zusammenfassend würde ich sagen…", "In summary I would say…")
  ],
  "c1-v-nuance": [
    w("die Auseinandersetzung", "the critical engagement / dispute", "die", "/ˈaʊsʔaɪnandɐzɛtsʊŋ/", "Die kritische Auseinandersetzung mit dem Thema ist nötig.", "A critical engagement with the topic is necessary.", "noun"),
    w("entscheidend", "decisive", null, "/ɛntˈʃaɪdn̩t/", "Das ist entscheidend für den Erfolg.", "That is decisive for success.", "adj"),
    w("nachvollziehbar", "understandable / traceable", null, "/ˈnaːxfɔltsiːbaːɐ̯/", "Ihre Kritik ist nachvollziehbar.", "Your criticism is understandable.", "adj"),
    w("im Wesentlichen", "essentially", null, "", "Im Wesentlichen stimme ich zu.", "Essentially I agree.")
  ],
  "c1-g-style": [
    w("aufgrund", "due to", null, "", "Aufgrund der Verspätung verpassten wir den Anschluss.", "Due to the delay we missed the connection."),
    w("hinsichtlich", "with regard to", null, "", "Hinsichtlich der Kosten gibt es Bedenken.", "With regard to the costs there are concerns."),
    w("infolge", "as a result of", null, "", "Infolge des Streiks fuhren weniger Züge.", "As a result of the strike fewer trains ran.")
  ],
  "c1-r-essay": [
    w("Gleichwohl bleibt fraglich, ob die Maßnahme greift.", "Nevertheless it remains questionable whether the measure will work.", null, "", "Gleichwohl bleibt fraglich, ob die Maßnahme greift.", "Nevertheless it remains questionable whether the measure will work.")
  ],
  "c2-v-idiom": [
    w("das Fingerspitzengefühl", "tact / fine instinct", "das", "/ˈfɪŋɐʃpɪtsn̩ɡəfyːl/", "Das verlangt Fingerspitzengefühl.", "That requires tact.", "noun"),
    w("unabdingbar", "indispensable", null, "/ˈʊnapdɪŋbaːɐ̯/", "Regelmäßiges Sprechen ist unabdingbar.", "Regular speaking is indispensable.", "adj"),
    w("den Nagel auf den Kopf treffen", "to hit the nail on the head", null, "", "Damit triffst du den Nagel auf den Kopf.", "With that you hit the nail on the head.")
  ],
  "c2-g-register": [
    w("Würden Sie so freundlich sein…", "Would you be so kind as to…", null, "", "Würden Sie so freundlich sein, das zu prüfen?", "Would you be so kind as to check that?"),
    w("Mach das bitte.", "Please do that.", null, "", "Mach das bitte.", "Please do that."),
    w("Es wäre wünschenswert, dass…", "It would be desirable that…", null, "", "Es wäre wünschenswert, dass wir uns einigen.", "It would be desirable that we agree.")
  ],
};
