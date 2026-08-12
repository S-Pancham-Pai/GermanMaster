/* Course model: CEFR level -> units -> stages.
   Stage = { id, title, mission, dialogue[], notice{}, cards[], banks[], items[], ask[], check{} }
   Higher levels explicitly say which lower-level blocks they build on ("uses"). */
const Curriculum = (() => {
  const B = (id) => BANKS[id] || [];
  const ln = (who, de, en) => ({ who, de, en });
  const card = (t, de, en, note) => ({ t, de, en, note });
  const notice = (q, options, answer, why) => ({ q, options, answer, why });

  const LEVELS = [
    { code: "A1", name: "Beginner", slogan: "Your first real conversations." },
    { code: "A2", name: "Elementary", slogan: "Yesterday, plans, opinions — daily life handled." },
    { code: "B1", name: "Intermediate", slogan: "Hold a view. Tell a story. Work in German." },
    { code: "B2", name: "Upper", slogan: "Argue with structure and nuance." },
    { code: "C1", name: "Advanced", slogan: "Precision, register, academic German." },
    { code: "C2", name: "Mastery", slogan: "Idiom and tact — sound like you mean it." }
  ];

  /* ============ A1 ============ */
  const A1 = [
    {
      id: "A1-U1", title: "How German sounds", sub: "Read any word out loud",
      why: "German spelling is honest — learn the sounds once and you can say almost anything you read.",
      stages: [
        {
          id: "A1-U1-S1", title: "Alphabet & umlauts", mission: "Say every letter, including ä, ö, ü and ß.",
          dialogue: [ln("Tutor", "A B C … ä ö ü ß", "A B C … ä ö ü ß"), ln("Tutor", "Mädchen, schön, über", "Girl, beautiful, over"), ln("You", "Straße", "Street")],
          notice: notice("Which sound is written with three dots in total?", ["ß", "ü", "sch"], "ü", "Two dots sit on the u: ü. Together with ä and ö these are the Umlaute."),
          cards: [
            card("ä / ö / ü", "Mädchen · schön · über", "Dots change the vowel, not the meaning.", "Say 'bed' then hold it longer for ä. Round your lips for ö and ü."),
            card("ß (Eszett)", "die Straße", "Pronounced like a sharp s.", "After a long vowel Germans write ß: Straße, Fuß, heiß."),
            card("Vowel length", "Staat — Stadt", "Long aa vs short a.", "Doubled or followed by h, a vowel is long: Staat, sehen.")
          ],
          items: [
            w("das Mädchen", "the girl", "das", "", "Das Mädchen heißt Lena.", "The girl is called Lena."),
            w("schön", "beautiful", null, "", "Der Tag ist schön.", "The day is beautiful."),
            w("über", "over / about", null, "", "Wir sprechen über Musik.", "We are talking about music."),
            w("die Straße", "the street", "die", "", "Die Straße ist lang.", "The street is long."),
            w("heiß", "hot", null, "", "Die Suppe ist heiß.", "The soup is hot."),
            w("grüßen", "to greet", null, "", "Wir grüßen die Nachbarn.", "We greet the neighbors.")
          ],
          check: { type: "say", prompt: "Read these aloud like a German:", target: "Mädchen, schön, Straße", model: "Mädchen, schön, Straße" }
        },
        {
          id: "A1-U1-S2", title: "w, v, z, j, sch", mission: "Pronounce the five letters that trick English speakers.",
          dialogue: [ln("Tutor", "Wasser, vier, zwei, ja, Schule", "Water, four, two, yes, school"), ln("You", "Wie? Wo? Was?", "How? Where? What?")],
          notice: notice("In German, how does the letter w sound?", ["like English w", "like English v", "silent"], "like English v", "Wasser = 'Vasser'. And German v sounds like f: vier = 'fear'."),
          cards: [
            card("w = v", "das Wasser · wo · wie", "Water · where · how", "German w is always the English v sound."),
            card("v = f", "vier · der Vater", "Four · the father", "German v sounds like f."),
            card("z = ts", "zwei · die Zeit", "Two · the time", "Zwei = 'tsvai'. One motion: t+s."),
            card("j = y", "ja · jung", "Yes · young", "Ja = 'ya'. Never like English j."),
            card("sch = sh", "die Schule · Tschüss", "School · bye", "Schule = 'shoo-le'.")
          ],
          ask: [
            { engine: "listen", kicker: "What did you hear?", audio: "Wasser", options: ["Vasser — water", "Waffel — waffle"], answer: "Vasser — water", why: "German w = English v." },
            { engine: "listen", kicker: "What did you hear?", audio: "zwei", options: ["tsvai — two", "svai — soft"], answer: "tsvai — two", why: "German z starts with a ts sound." }
          ],
          items: [
            w("das Wasser", "the water", "das", "", "Das Wasser ist kalt.", "The water is cold."),
            w("vier", "four", null, "", "Wir sind vier Leute.", "We are four people."),
            w("zwei", "two", null, "", "Zwei Kaffee, bitte.", "Two coffees, please."),
            w("ja", "yes", null, "", "Ja, gern!", "Yes, gladly!"),
            w("die Schule", "the school", "die", "", "Die Schule ist nah.", "The school is near."),
            w("jung", "young", null, "", "Mein Bruder ist jung.", "My brother is young.")
          ],
          check: { type: "say", prompt: "Say: Wasser, vier, zwei, ja, Schule", target: "Wasser vier zwei ja Schule", model: "Wasser, vier, zwei, ja, Schule." }
        },
        {
          id: "A1-U1-S3", title: "ch, r and word endings", mission: "Tell ich-Laut from ach-Laut and finish words like a native.",
          dialogue: [ln("Tutor", "ich, nicht, Milch — aber: Bach, auch, Buch", "ich, nicht, milk — but: stream, also, book"), ln("Tutor", "Tag klingt wie Tak", "Tag sounds like Tak")],
          notice: notice("How does 'Tag' end in real pronunciation?", ["with a soft g", "with a k sound", "the g is silent"], "with a k sound", "Final b, d, g turn into p, t, k: Tag → Tak, Hund → Hunt."),
          cards: [
            card("ich-Laut", "ich · nicht · Milch", "Soft ch after i, e, ä, ö, ü.", "A soft hiss, like a cat hiss: ihh."),
            card("ach-Laut", "auch · das Buch · Bach", "Rough ch after a, o, u.", "From the back of the throat: ahh-ch."),
            card("German r", "rot · der Bruder", "Rolled or voiced in the throat.", "At word endings it softens: Bruder → 'Bruhda'."),
            card("Endings go hard", "Tag · Hund · Dieb", "Sound: Tak · Hunt · Diep", "b, d, g at the end become p, t, k.")
          ],
          items: [
            w("ich", "I", null, "", "Ich lerne Deutsch.", "I am learning German."),
            w("auch", "also / too", null, "", "Ich komme auch.", "I am coming too."),
            w("das Buch", "the book", "das", "", "Das Buch ist gut.", "The book is good."),
            w("der Tag", "the day", "der", "", "Der Tag war lang.", "The day was long."),
            w("der Bruder", "the brother", "der", "", "Mein Bruder wohnt hier.", "My brother lives here."),
            w("richtig", "correct", null, "", "Das ist richtig!", "That is correct!")
          ],
          check: { type: "say", prompt: "Say: ich, auch, Buch, Tag", target: "ich auch Buch Tag", model: "ich, auch, Buch, Tag" }
        },
        {
          id: "A1-U1-S4", title: "Hear the difference", mission: "Catch the small sound changes Germans hear instantly.",
          dialogue: [ln("Tutor", "schon oder schön?", "already or beautiful?"), ln("Tutor", "musste oder müsste?", "had to or would have to?"), ln("You", "Noch einmal, bitte!", "Once more, please!")],
          notice: notice("'schon' and 'schön' differ by…", ["the vowel ö", "the final n", "stress"], "the vowel ö", "Rounded lips make ö. schon = already, schön = beautiful."),
          cards: [
            card("o vs ö", "schon — schön", "already — beautiful", "Round your lips for ö."),
            card("u vs ü", "musste — müsste", "had to — would have to", "Ü is i said with rounded lips."),
            card("ei vs ie", "wein — Wien… einfach: ei = 'eye', ie = 'ee'", "Wein — Vienna", "Read the second letter: ei→'eye', ie→'ee'."),
            card("Stress", "UMfahren vs umFAHren", "Almost every German word stresses the first syllable of its root.", "Listen for the strong first beat.")
          ],
          ask: [
            { engine: "listen", kicker: "Which word did you hear?", audio: "schön", options: ["schon (already)", "schön (beautiful)"], answer: "schön (beautiful)", why: "Ö rounds the vowel: schön." },
            { engine: "listen", kicker: "Which word did you hear?", audio: "musste", options: ["musste (had to)", "müsste (would have to)"], answer: "musste (had to)", why: "Short u, no umlaut: musste." },
            { engine: "mc", kicker: "How is 'Viel' pronounced?", text: "Viel", options: ["like 'feel'", "like 'vile'"], answer: "like 'feel'", why: "ie is long 'ee': Viel = 'feel'." }
          ],
          items: [
            w("schon", "already", null, "", "Ich bin schon fertig.", "I am already done."),
            w("schön", "beautiful", null, "", "Das ist schön.", "That is beautiful."),
            w("viel", "much / a lot", null, "", "Vielen Dank!", "Many thanks!"),
            w("der Wein", "the wine", "der", "", "Der Wein ist gut.", "The wine is good."),
            w("fertig", "finished / ready", null, "", "Ich bin fertig.", "I am ready.")
          ],
          check: { type: "mc", prompt: "Final sound check", text: "Which pair sounds different?", options: ["Tag / Tak", "schon / schön"], answer: "schon / schön", why: "Tag and Tak sound identical — final g becomes k. ö makes schön different.", immediate: true }
        }
      ]
    },
    {
      id: "A1-U2", title: "First useful German", sub: "Survive hour one",
      why: "Six phrases carry you through any first encounter — including asking people to slow down.",
      stages: [
        {
          id: "A1-U2-S1", title: "Hallo to Tschüss", mission: "Open and close a conversation politely.",
          dialogue: [ln("Mia", "Guten Morgen!", "Good morning!"), ln("Omar", "Morgen! Wie geht's?", "Morning! How are you?"), ln("Mia", "Gut, danke. Und dir?", "Good, thanks. And you?"), ln("Omar", "Auch gut. Tschüss, bis morgen!", "Good too. Bye, see you tomorrow!")],
          notice: notice("Which phrase ends the conversation?", ["Guten Morgen", "Bis morgen", "Wie geht's?"], "Bis morgen", "'Bis morgen' — until tomorrow — is a farewell."),
          cards: [
            card("All day", "Guten Tag", "Good day", "Safe with anyone, 10am–6pm."),
            card("Morning only", "Guten Morgen", "Good morning", "Short form: just 'Morgen!'."),
            card("Evening", "Guten Abend", "Good evening", "After ~6pm."),
            card("Leaving", "Tschüss · Bis später", "Bye · See you later", "Tschüss is friendly and universal.")
          ],
          banks: ["a1-v-greet"],
          check: { type: "say", prompt: "Greet me, then say goodbye.", target: "Guten Tag … Tschüss", model: "Guten Tag! … Tschüss!" }
        },
        {
          id: "A1-U2-S2", title: "Ja, nein, bitte, danke", mission: "Be polite in four words.",
          dialogue: [ln("Kellner", "Noch ein Kaffee?", "Another coffee?"), ln("Mia", "Ja, bitte!", "Yes, please!"), ln("Kellner", "Gern.", "With pleasure."), ln("Mia", "Danke schön!", "Thank you very much!")],
          notice: notice("'Ja, ___!' accepts an offer politely.", ["nein", "bitte", "danke"], "bitte", "Bitte does three jobs: please, you're welcome, and here 'yes please'."),
          cards: [
            card("Accept", "Ja, bitte.", "Yes, please.", "The polite yes."),
            card("Decline", "Nein, danke.", "No, thank you.", "The polite no."),
            card("Thanks", "Danke schön / Vielen Dank", "Thanks a lot / Many thanks", "Both work everywhere."),
            card("Reply", "Bitte. / Gern geschehen.", "You're welcome.", "Gern geschehen = 'happily done'.")
          ],
          items: [
            w("ja, bitte", "yes, please", null, "", "Noch ein Brot? — Ja, bitte.", "Another bread? — Yes, please."),
            w("nein, danke", "no, thank you", null, "", "Nein, danke, ich bin satt.", "No thanks, I'm full."),
            w("Danke schön", "thank you very much", null, "", "Danke schön für die Hilfe.", "Thank you very much for the help."),
            w("Bitte schön", "you're welcome / here you go", null, "", "Bitte schön, der Kaffee.", "Here you go, the coffee."),
            w("Entschuldigung", "excuse me / sorry", null, "", "Entschuldigung, wo ist der Bahnhof?", "Excuse me, where is the station?")
          ],
          check: { type: "mc", prompt: "A stranger hands you your dropped ticket.", text: "You say:", options: ["Ja, bitte!", "Danke schön!", "Nein, danke!"], answer: "Danke schön!", why: "Receiving something → thank them: Danke schön.", immediate: true }
        },
        {
          id: "A1-U2-S3", title: "Help phrases", mission: "Slow any German down and get a repeat.",
          dialogue: [ln("Passant", "Die U-Bahn fährt gleich da drüben ab, sie müssen sich beeilen!", "(fast German…)"), ln("You", "Entschuldigung, ich verstehe nicht. Langsamer, bitte.", "Sorry, I don't understand. Slower, please."), ln("Passant", "Die U-Bahn — da drüben.", "The subway — over there."), ln("You", "Danke! Was bedeutet 'ab'?", "Thanks! What does 'ab' mean?")],
          notice: notice("Someone speaks too fast. You say:", ["Was bedeutet das?", "Langsamer, bitte.", "Wie sagt man…?"], "Langsamer, bitte.", "Langsamer = slower. Germans will happily repeat."),
          cards: [
            card("No understanding", "Ich verstehe nicht.", "I don't understand.", "Your safest sentence in Germany."),
            card("Repeat", "Bitte noch einmal.", "Once more, please.", "Also: Können Sie das wiederholen?"),
            card("Meaning", "Was bedeutet …?", "What does … mean?", "Was bedeutet 'Abfahrt'?"),
            card("How to say", "Wie sagt man … auf Deutsch?", "How do you say … in German?", "Learn any word on the street with this.")
          ],
          items: [
            w("Ich verstehe nicht.", "I don't understand.", null, "", "Tut mir leid, ich verstehe nicht.", "Sorry, I don't understand."),
            w("Bitte noch einmal.", "Once more, please.", null, "", "Bitte noch einmal, ich lerne Deutsch.", "Once more please, I'm learning German."),
            w("Langsamer, bitte.", "Slower, please.", null, "", "Langsamer, bitte — danke!", "Slower please — thanks!"),
            w("Was bedeutet das?", "What does that mean?", null, "", "Was bedeutet 'Gleis'?", "What does 'Gleis' mean?"),
            w("Wie sagt man das auf Deutsch?", "How do you say that in German?", null, "", "Wie sagt man 'ticket' auf Deutsch?", "How do you say 'ticket' in German?"),
            w("Können Sie das wiederholen?", "Can you repeat that?", null, "", "Können Sie das bitte wiederholen?", "Can you repeat that, please?")
          ],
          check: { type: "open", prompt: "Write: ask someone to repeat, politely.", model: "Können Sie das bitte wiederholen?" }
        },
        {
          id: "A1-U2-S4", title: "du or Sie?", mission: "Pick the right 'you' without offending anyone.",
          dialogue: [ln("Freund", "Hallo, wie heißt du?", "Hi, what's your name? (to a friend)"), ln("Rezeptionistin", "Guten Tag. Wie heißen Sie?", "Good day. What's your name? (formal)"), ln("Tutor", "Jugendliche und Freunde: du. Alle anderen: Sie.", "Teens and friends: du. Everyone else: Sie.")],
          notice: notice("At a hotel reception you ask…", ["Wie heißt du?", "Wie heißen Sie?"], "Wie heißen Sie?", "Strangers and staff get Sie. Capital S, always."),
          cards: [
            card("du", "Wie heißt du?", "Friends, children, classmates.", "Relaxed, lowercase in speech."),
            card("Sie", "Wie heißen Sie?", "Strangers, officials, service.", "Same word as 'they' but capitalized."),
            card("Rule of thumb", "Wenn unsicher: Sie.", "When unsure: Sie.", "Nobody is offended by Sie; many are by du."),
            card("Hearing it", "Kommen Sie aus …?", "Formal questions use Sie + -en verb.", "kommst du vs kommen Sie.")
          ],
          ask: [
            { engine: "formal", situation: "Asking a classmate their name", options: ["Wie heißt du?", "Wie heißen Sie?"], answer: "Wie heißt du?", why: "Classmates are du." },
            { engine: "formal", situation: "Asking a police officer for help", options: ["Kannst du mir helfen?", "Können Sie mir helfen?"], answer: "Können Sie mir helfen?", why: "Officials are always Sie." },
            { engine: "formal", situation: "Talking to your friend's little brother", options: ["Wie alt bist du?", "Wie alt sind Sie?"], answer: "Wie alt bist du?", why: "Children are du." }
          ],
          items: [
            w("Wie heißt du?", "What's your name? (informal)", null, "", "Hallo, wie heißt du?", "Hi, what's your name?"),
            w("Wie heißen Sie?", "What's your name? (formal)", null, "", "Guten Tag, wie heißen Sie?", "Good day, what's your name?"),
            w("Kommst du mit?", "Are you coming along? (informal)", null, "", "Wir gehen ins Kino, kommst du mit?", "We're going to the cinema, are you coming?"),
            w("Kommen Sie aus Indien?", "Are you from India? (formal)", null, "", "Kommen Sie aus Indien? — Ja, aus Mumbai.", "Are you from India? — Yes, from Mumbai.")
          ],
          check: { type: "say", prompt: "Ask a stranger (formally) what their name is.", target: "Wie heißen Sie?", model: "Guten Tag, wie heißen Sie?" }
        }
      ]
    },
    {
      id: "A1-U3", title: "Meeting people", sub: "Say who you are, ask who they are",
      why: "Names, countries, numbers — the complete first conversation, built line by line.",
      stages: [
        {
          id: "A1-U3-S1", title: "Your name", mission: "Introduce yourself and ask names back.",
          dialogue: [ln("Anna", "Hallo! Ich heiße Anna. Wie heißt du?", "Hi! My name is Anna. What's your name?"), ln("Omar", "Ich heiße Omar.", "My name is Omar."), ln("Anna", "Freut mich, Omar!", "Nice to meet you, Omar!"), ln("Omar", "Mich auch!", "Me too!")],
          notice: notice("Which phrase means 'My name is…'?", ["Ich komme aus …", "Ich heiße …", "Wie heißt du?"], "Ich heiße …", "heißen = to be called. Ich heiße Omar = I am called Omar."),
          cards: [
            card("Giving your name", "Ich heiße Maya.", "My name is Maya.", "Short. No 'name ist' needed."),
            card("Also correct", "Mein Name ist Maya.", "My name is Maya.", "Slightly more formal/complete."),
            card("Asking", "Wie heißt du?", "What are you called?", "Informal. Formal: Wie heißen Sie?"),
            card("The reply", "Freut mich!", "Pleased to meet you!", "Answer: Mich auch!")
          ],
          banks: ["a1-s-intro", "a1-r-dialogue"],
          ask: [
            { engine: "builder", chunks: ["heiße", "Ich", "Amir"], answer: "Ich heiße Amir", why: "Subject first, verb second — always position 2.", hint: "Build: My name is Amir." },
            { engine: "recall", prompt: "Write: “My name is Sofia.”", answer: "Ich heiße Sofia", alts: ["Ich heiße Sofia.", "Mein Name ist Sofia"], why: "Ich heiße + name." }
          ],
          check: { type: "say", prompt: "Say your real name in German.", target: "Ich heiße …", model: "Ich heiße …" }
        },
        {
          id: "A1-U3-S2", title: "ich, du, er, sie", mission: "Use the personal pronouns without thinking.",
          dialogue: [ln("Lea", "Ich bin Lea. Das ist Max.", "I am Lea. This is Max."), ln("Ben", "Und das sind meine Freundinnen.", "And those are my friends (f)."), ln("Lea", "Wir lernen alle Deutsch.", "We are all learning German.")],
          notice: notice("'Das sind meine Freundinnen' — 'das sind' means…", ["this is", "those are", "she is"], "those are", "das ist = this/that is (singular), das sind = those are (plural)."),
          cards: [
            card("Singular", "ich · du · er · sie · es", "I · you · he · she · it", "German nouns force gender: der Tisch = er."),
            card("Plural", "wir · ihr · sie · Sie", "we · you-all · they · You-formal", "sie (they) vs Sie (you formal) — capital S matters."),
            card("It for things", "Wo ist das Buch? — Es ist hier.", "Where is the book? It is here.", "das → es, der → er, die → sie.")
          ],
          banks: ["a1-g-pronouns"],
          ask: [
            { engine: "mc", kicker: "die Lampe → ?", text: "Replace: die Lampe", options: ["er", "sie", "es"], answer: "sie", why: "die-words are 'sie'." },
            { engine: "mc", kicker: "der Tisch → ?", text: "Replace: der Tisch", options: ["er", "sie", "es"], answer: "er", why: "der-words are 'er'." }
          ],
          check: { type: "recall", prompt: "Write the three plural pronouns (we)", answer: "wir", alts: ["wir"], why: "wir = we", optional: false }
        },
        {
          id: "A1-U3-S3", title: "sein & haben", mission: "Conjugate the two most important verbs.",
          dialogue: [ln("Max", "Ich bin müde.", "I am tired."), ln("Lea", "Ich habe Hunger.", "I am hungry."), ln("Max", "Und du? Bist du auch müde?", "And you? Are you tired too?")],
          notice: notice("Complete: du ___ müde.", ["bin", "bist", "ist"], "bist", "sein is irregular: ich bin, du bist, er/sie/es ist."),
          cards: [
            card("sein", "ich bin · du bist · er ist", "I am · you are · he is", "wir sind · ihr seid · sie sind"),
            card("haben", "ich habe · du hast · er hat", "I have · you have · he has", "Only du/er lose the b."),
            card("Use case", "Ich habe Hunger.", "I have hunger = I'm hungry.", "Germans have hunger and thirst, not 'am hungry'.")
          ],
          banks: ["a1-g-seinhaben"],
          ask: [
            { engine: "recall", prompt: "Complete: „Wir ___ Studenten.“", answer: "sind", why: "wir sind." },
            { engine: "recall", prompt: "Complete: „Du ___ Durst.“", answer: "hast", why: "du hast (haben loses b)." }
          ],
          check: { type: "say", prompt: "Say: I am tired, and I am hungry.", target: "Ich bin müde. Ich habe Hunger.", model: "Ich bin müde und ich habe Hunger." }
        },
        {
          id: "A1-U3-S4", title: "Question words", mission: "Ask wer, wie, wo, woher — and answer them.",
          dialogue: [ln("Ben", "Woher kommst du?", "Where are you from?"), ln("Fatima", "Ich komme aus Ägypten. Und du?", "I come from Egypt. And you?"), ln("Ben", "Aus Indien. Wo wohnst du jetzt?", "From India. Where do you live now?"), ln("Fatima", "In Berlin.", "In Berlin.")],
          notice: notice("'Woher kommst du?' asks about…", ["place of origin", "current location", "destination"], "place of origin", "woher = from where → origin. wo = where → location. wohin = where to."),
          cards: [
            card("woher + aus", "Woher kommst du? — Aus Indien.", "Origin uses 'aus'.", "Städte und Länder: aus Berlin, aus Indien."),
            card("wo + in", "Wo wohnst du? — In Berlin.", "Location uses 'in'.", "Ich wohne in + Stadt."),
            card("The questions", "wer · wie · was · wo · wann", "who · how · what · where · when", "Question word first, verb second."),
            card("Word order", "Wie heißt du?", "How are you called?", "W-Frage + verb + subject.")
          ],
          banks: ["a1-g-questions"],
          items: [
            w("aus Indien", "from India", null, "", "Ich komme aus Indien.", "I come from India."),
            w("aus Deutschland", "from Germany", null, "", "Er kommt aus Deutschland.", "He comes from Germany."),
            w("in Berlin", "in Berlin", null, "", "Ich wohne in Berlin.", "I live in Berlin."),
            w("woher", "from where", null, "", "Woher kommst du?", "Where are you from?"),
            w("wo", "where", null, "", "Wo wohnst du?", "Where do you live?")
          ],
          ask: [
            { engine: "builder", chunks: ["kommst", "Woher", "du", "?"], answer: "Woher kommst du?", why: "Question word → verb → you." },
            { engine: "recall", prompt: "Answer in German: “Where are you from?” → (India)", answer: "Ich komme aus Indien", alts: ["Aus Indien"], why: "aus + country, verb second." }
          ],
          check: { type: "open", prompt: "Write where YOU come from.", model: "Ich komme aus Indien." }
        },
        {
          id: "A1-U3-S5", title: "Numbers, age, phone", mission: "Count to 100 and give your age and number.",
          dialogue: [ln("Kursleiterin", "Wie alt bist du?", "How old are you?"), ln("Omar", "Ich bin dreiundzwanzig.", "I am twenty-three."), ln("Kursleiterin", "Und deine Nummer?", "And your number?"), ln("Omar", "Null eins fünf zwei …", "0152 …")],
          notice: notice("23 in German is…", ["zwanzigdrei", "dreiundzwanzig", "dreizwanzig"], "dreiundzwanzig", "Ones come first: drei-und-zwanzig = three-and-twenty."),
          cards: [
            card("0–12", "null … elf · zwölf", "0–12", "Elf and zwölf break the pattern — memorize them."),
            card("Teens", "dreizehn … neunzehn", "13–19", "Number + zehn."),
            card("Tens", "zwanzig · dreißig · vierzig", "20 · 30 · 40", "Note: dreißig with ß-sound z."),
            card("The flip", "24 → vierundzwanzig", "four-and-twenty", "Ones + und + tens. Hear it in phone numbers.")
          ],
          banks: ["a1-v-numbers", "a1-l-numbers"],
          ask: [
            { engine: "listen", kicker: "Which number did you hear?", audio: "dreiundzwanzig", options: ["23", "32", "33"], answer: "23", why: "drei-und-zwanzig: ones first." },
            { engine: "recall", prompt: "Write 45 in German.", answer: "fünfundvierzig", alts: ["fünf und vierzig"], why: "fünf-und-vierzig." }
          ],
          check: { type: "say", prompt: "Say your age in German.", target: "Ich bin …", model: "Ich bin zwanzig." }
        },
        {
          id: "A1-U3-S6", title: "Mission: Café introduction", mission: "Hold a complete first conversation — greeting to country.",
          dialogue: [ln("Lukas", "Hallo! Ich heiße Lukas. Wie heißt du?", "Hi! I'm Lukas. What's your name?"), ln("You", "…", "your turn")],
          notice: notice("Lukas says „Wie heißt du?“ — informally. So Lukas is…", ["a hotel clerk", "roughly your age / a peer", "your boss"], "roughly your age / a peer", "du between peers — answer relaxed."),
          cards: [card("Your tools", "Ich heiße … · Ich komme aus … · Wie alt bist du?", "Everything from this unit.", "Relax: this unit gave you all of it.")],
          items: [
            w("Ich heiße…", "My name is…", null, "", "Hallo, ich heiße Jonas.", "Hi, my name is Jonas."),
            w("Ich komme aus…", "I come from…", null, "", "Ich komme aus Indien.", "I come from India."),
            w("Woher kommst du?", "Where are you from?", null, "", "Und du — woher kommst du?", "And you — where are you from?")
          ],
          check: {
            type: "dialogue", title: "Meet Lukas", script: [
              { who: "Lukas", de: "Hallo! Ich heiße Lukas. Wie heißt du?", en: "Hi! I'm Lukas. What's your name?", options: [{ de: "Ich heiße Sam.", en: "My name is Sam.", ok: true }, { de: "Guten Abend.", en: "Good evening.", ok: false, tip: "He asked your name — answer with Ich heiße …" }] },
              { who: "Lukas", de: "Freut mich, Sam! Woher kommst du?", en: "Nice to meet you! Where are you from?", options: [{ de: "Ich komme aus Indien.", en: "I'm from India.", ok: true }, { de: "Ich bin zwanzig.", en: "I am twenty.", ok: false, tip: "Woher asks origin, not age." }] },
              { who: "Lukas", de: "Cool! Und wie alt bist du?", en: "Cool! And how old are you?", options: [{ de: "Ich bin dreiundzwanzig.", en: "I'm twenty-three.", ok: true }, { de: "Ich wohne in Berlin.", en: "I live in Berlin.", ok: false, tip: "wie alt = how old." }] },
              { who: "Lukas", de: "Super. Bis bald, Sam!", en: "Great. See you soon!", options: [{ de: "Tschüss, Lukas!", en: "Bye, Lukas!", ok: true }, { de: "Guten Morgen!", en: "Good morning!", ok: false, tip: "He's leaving — say goodbye." }] }
            ]
          }
        }
      ]
    },
    {
      id: "A1-U4", title: "Family & people", sub: "Talk about your people",
      why: "Family words + possessives + your first regular verbs — people are the best topic to practice.",
      uses: "A1-U2/3: sein, questions, du/Sie.",
      stages: [
        {
          id: "A1-U4-S1", title: "Family members", mission: "Name everyone in a family photo.",
          dialogue: [ln("Mia", "Das ist meine Mutter und das ist mein Vater.", "This is my mother and this is my father."), ln("Ben", "Und die Kinder?", "And the children?"), ln("Mia", "Mein Bruder und meine Schwester.", "My brother and my sister.")],
          notice: notice("'mein Bruder' vs 'meine Schwester' — the difference is…", ["singular/plural", "the article before it", "word order"], "the article before it", "der Bruder → mein, die Schwester → meine. Possessive copies the article."),
          cards: [
            card("Masculine", "der Vater · der Bruder · der Sohn", "father · brother · son", "mein Vater"),
            card("Feminine", "die Mutter · die Schwester · die Tochter", "mother · sister · daughter", "meine Mutter"),
            card("Neuter", "das Kind · das Baby", "child · baby", "mein Kind"),
            card("Plural", "die Eltern · die Kinder", "parents · children", "meine Eltern")
          ],
          banks: ["a1-v-family"],
          check: { type: "say", prompt: "Name two family members with article.", target: "die Mutter, der Vater", model: "die Mutter, der Vater, das Kind" }
        },
        {
          id: "A1-U4-S2", title: "mein & dein", mission: "Show possession with mein, dein — and its little case changes.",
          dialogue: [ln("Omar", "Ist das dein Hund?", "Is that your dog?"), ln("Mia", "Ja, das ist mein Hund. Und das da ist meine Katze.", "Yes, that's my dog. And that over there is my cat."), ln("Omar", "Ich habe einen Hund!", "I have a dog!")],
          notice: notice("'Ich habe ___ Hund' — mein changes because…", ["it is plural", "the dog receives the action (accusative)", "dogs are special"], "the dog receives the action (accusative)", "Masculine mein → einen Hund: der Hund becomes einen Hund when it's the object."),
          cards: [
            card("Subject position", "Mein Hund ist groß.", "My dog is big.", "der → mein, die → meine, das → mein."),
            card("Object position", "Ich habe einen Hund.", "I have a dog.", "Only masculine changes: mein → einen."),
            card("Asking", "Ist das dein Bruder?", "Is that your brother?", "dein mirrors mein."),
            card("Full set", "mein · dein · sein · ihr", "my · your · his · her", "More in A2 — these four first.")
          ],
          items: [
            w("mein", "my (der/das)", null, "", "Das ist mein Bruder.", "That is my brother."),
            w("meine", "my (die/plural)", null, "", "Meine Schwester wohnt hier.", "My sister lives here."),
            w("dein", "your (der/das)", null, "", "Ist das dein Vater?", "Is that your father?"),
            w("deine", "your (die/plural)", null, "", "Deine Mutter ist nett.", "Your mother is nice."),
            w("sein", "his/its", null, "", "Sein Bruder heißt Tom.", "His brother is called Tom."),
            w("einen Hund", "a dog (object)", null, "", "Ich habe einen Hund.", "I have a dog.")
          ],
          ask: [
            { engine: "mc", kicker: "Which fits?", text: "Das ist ___ Mutter.", options: ["mein", "meine", "einen"], answer: "meine", why: "die Mutter → meine." },
            { engine: "mc", kicker: "Which fits?", text: "Ich habe ___ Bruder.", options: ["mein", "meine", "einen"], answer: "einen", why: "der Bruder as object → einen." }
          ],
          check: { type: "open", prompt: "Write: “This is my mother.”", model: "Das ist meine Mutter." }
        },
        {
          id: "A1-U4-S3", title: "Regular verbs", mission: "Conjugate everyday verbs in the present, all persons.",
          dialogue: [ln("Lea", "Ich wohne in Köln und lerne Deutsch.", "I live in Cologne and learn German."), ln("Tom", "Mein Bruder wohnt in Hamburg. Er macht Sport.", "My brother lives in Hamburg. He does sports."), ln("Lea", "Wir spielen am Wochenende Fußball.", "We play football at the weekend.")],
          notice: notice("'wohnen' → er ___", ["wohn", "wohnt", "wohne"], "wohnt", "Stem + t for er/sie/es. ich + e, du + st, wir + en."),
          cards: [
            card("The stem trick", "wohnen → wohn-", "Cut -en, add endings.", "ich wohne, du wohnst, er wohnt, wir wohnen."),
            card("All endings", "ich -e · du -st · er -t · wir -en · sie -en", "e, st, t, en, en", "Works for 95% of verbs."),
            card("In a sentence", "Ich lerne Deutsch.", "I learn German.", "Notice again: verb second.")
          ],
          banks: ["a1-g-present"],
          ask: [
            { engine: "recall", prompt: "er / machen →", answer: "er macht", alts: ["macht"], why: "stem mach + t." },
            { engine: "recall", prompt: "du / kommen →", answer: "du kommst", alts: ["kommst"], why: "stem komm + st." },
            { engine: "mc", kicker: "Which is correct?", text: "wir / spielen", options: ["wir spielt", "wir spielen", "wir spielst"], answer: "wir spielen", why: "wir keeps -en." }
          ],
          check: { type: "say", prompt: "Say where you live: Ich wohne in …", target: "Ich wohne in …", model: "Ich wohne in Bengaluru." }
        },
        {
          id: "A1-U4-S4", title: "nicht & kein", mission: "Negate verbs and nouns correctly.",
          dialogue: [ln("Ben", "Bist du müde?", "Are you tired?"), ln("Fatima", "Nein, ich bin nicht müde.", "No, I am not tired."), ln("Ben", "Hast du Zeit?", "Do you have time?"), ln("Fatima", "Leider nicht — ich habe keine Zeit.", "Unfortunately not — I have no time.")],
          notice: notice("'Ich habe ___ Zeit.' — why kein?", ["Zeit is a noun with article ein", "Zeit is feminine", "negations are always kein"], "Zeit is a noun with article ein", "kein negates ein-nouns (no time = keine Zeit). nicht negates everything else."),
          cards: [
            card("nicht", "Ich bin nicht müde.", "Not tired.", "nicht after the verb/adjective."),
            card("kein", "Ich habe keinen Hunger.", "No hunger.", "kein = not a / no + noun."),
            card("Side by side", "nicht müde · keine Zeit", "not tired · no time", "Adjective → nicht. ein-noun → kein."),
          ],
          banks: ["a1-g-negation"],
          ask: [
            { engine: "mc", kicker: "nicht or kein?", text: "Ich habe ___ Auto.", options: ["nicht", "kein"], answer: "kein", why: "ein Auto → kein Auto." },
            { engine: "mc", kicker: "nicht or kein?", text: "Das ist ___ richtig.", options: ["nicht", "kein"], answer: "nicht", why: "adjective → nicht." },
            { engine: "repair", wrong: "Ich bin kein müde.", options: ["Ich bin nicht müde.", "Ich habe kein müde.", "Ich nicht bin müde."], answer: "Ich bin nicht müde.", why: "müde is an adjective → nicht, and nicht follows the verb." }
          ],
          check: { type: "recall", prompt: "Write: “I have no time.”", answer: "Ich habe keine Zeit", alts: ["Ich habe keine Zeit."], why: "die Zeit → keine." }
        },
        {
          id: "A1-U4-S5", title: "Yes/no questions", mission: "Flip any statement into a question.",
          dialogue: [ln("Tom", "Kommst du aus Deutschland?", "Do you come from Germany?"), ln("Mia", "Nein, ich komme aus Österreich.", "No, I come from Austria."), ln("Tom", "Wohnst du hier?", "Do you live here?"), ln("Mia", "Ja, seit zwei Jahren.", "Yes, for two years.")],
          notice: notice("Statement: „Du wohnst hier.“ Question: …", ["Wo wohnst du?", "Wohnst du hier?", "Du wohnst hier?"], "Wohnst du hier?", "Yes/no questions start with the verb. W-questions start with question word."),
          cards: [
            card("Verb first", "Bist du Student?", "Are you a student?", "Yes/no → verb wears the first slot."),
            card("Same words, new order", "Du kommst. → Kommst du?", "You come. → Do you come?", "Just swap subject and verb."),
            card("Answering", "Ja. / Nein, ich komme nicht aus …", "Yes / No …", "Don't repeat the whole sentence — Germans rarely do.")
          ],
          ask: [
            { engine: "mc", kicker: "Make it a question", text: "Du bist müde.", options: ["Bist du müde?", "Du bist müde?", "Müde bist du?"], answer: "Bist du müde?", why: "Verb first for yes/no." },
            { engine: "builder", chunks: ["du", "Kommst", "aus", "Indien", "?"], answer: "Kommst du aus Indien?", why: "Verb → subject → rest.", hint: "Build the question: Do you come from India?" }
          ],
          check: { type: "dialogue", title: "20 seconds of questions", script: [
            { who: "Freund", de: "Wir treffen uns morgen. Kommst du?", en: "We're meeting tomorrow. Are you coming?", options: [{ de: "Ja, ich komme.", en: "Yes, I'm coming.", ok: true }, { de: "Ich bin müde nicht.", en: "wrong word order", ok: false, tip: "nicht goes after the verb: Ich bin nicht müde." }] },
            { who: "Freund", de: "Super. Hast du Zeit um 18 Uhr?", en: "Great. Do you have time at 6pm?", options: [{ de: "Ja, ich habe Zeit.", en: "Yes, I have time.", ok: true }, { de: "Keine müde.", en: "gibberish", ok: false, tip: "haben: ich habe Zeit." }] }
          ] }
        },
        {
          id: "A1-U4-S6", title: "Mission: Your family", mission: "Describe your own family in 3–4 sentences.",
          dialogue: [ln("Partnerin", "Erzähl mal — deine Familie!", "Tell me — your family!"), ln("You", "…", "your turn")],
          cards: [card("Template", "Meine Familie ist klein. Mein Vater heißt … Meine Mutter … Ich habe einen Bruder.", "My family is small…", "Swap in your real family.")],
          banks: ["a1-v-family"],
          check: { type: "open", prompt: "Write 3 sentences about your family.", model: "Meine Familie ist klein. Ich habe einen Bruder. Meine Mutter heißt Sunita." }
        }
      ]
    },
    {
      id: "A1-U5", title: "Food & drink", sub: "Order anything, anywhere",
      why: "Cafés are where German first pays off — and where accusative sneaks in.",
      uses: "A1-U3: sein/haben · A1-U4: mein, kein.",
      stages: [
        {
          id: "A1-U5-S1", title: "Café words", mission: "Read a German menu without pictures.",
          dialogue: [ln("Omar", "Ich nehme einen Kaffee und ein Brot.", "I'll take a coffee and a bread."), ln("Mia", "Für mich einen Tee und den Käse.", "For me a tea and the cheese."), ln("Kellner", "Und Wasser für den Tisch?", "And water for the table?")],
          notice: notice("'das Brot', 'der Kaffee', 'die Milch' — nouns come with…", ["a random flavor", "a fixed article to memorize", "a capital S"], "a fixed article to memorize", "Gender is part of the word. Always learn: der Kaffee, not just Kaffee."),
          cards: [
            card("Drinks", "der Kaffee · der Tee · das Wasser · das Bier", "coffee · tea · water · beer", "Beer is neuter, weirdly. Learn it as a chunk: ein Bier."),
            card("Food", "das Brot · der Käse · der Apfel", "bread · cheese · apple", "das Essen = food/the meal."),
            card("At the end", "die Rechnung, bitte.", "The bill, please.", "Separately: getrennt, bitte."),
            card("Quantity", "ein Glas Wasser · zwei Stück Kuchen", "a glass of water · two pieces of cake", "Numbers from U3 do the work.")
          ],
          banks: ["a1-v-food"],
          check: { type: "say", prompt: "Order a coffee and a tea for the table.", target: "Einen Kaffee und einen Tee, bitte.", model: "Einen Kaffee und einen Tee, bitte." }
        },
        {
          id: "A1-U5-S2", title: "möchten", mission: "Ask for things politely with ich möchte.",
          dialogue: [ln("Kellnerin", "Guten Tag! Was möchten Sie?", "Good day! What would you like?"), ln("Fatima", "Ich möchte einen Kaffee, bitte.", "I'd like a coffee, please."), ln("Kellnerin", "Mit Milch?", "With milk?"), ln("Fatima", "Ja, bitte. Und ein Wasser.", "Yes please. And a water.")],
          notice: notice("'Was möchten Sie?' — why is it polite?", ["it's longer", "möchten = 'would like', softer than wollen ('want')", "it uses Sie and möchte together"], "möchten = 'would like', softer than wollen ('want')", "möchte = would like. ich will = I want — sounds demanding in shops."),
          cards: [
            card("The magic word", "Ich möchte …", "I would like …", "du möchtest, er möchte, wir möchten."),
            card("Full order", "Ich möchte einen Kaffee, bitte.", "I'd like a coffee, please.", "bitte at the end keeps it soft."),
            card("Question", "Was möchten Sie?", "What would you like?", "The waiter's opener — expect it."),
            card("Alternative", "Ich hätte gern …", "I'd gladly have …", "Same politeness level, more fluid.")
          ],
          ask: [
            { engine: "builder", chunks: ["möchte", "Ich", "einen", "Kaffee", "bitte"], answer: "Ich möchte einen Kaffee bitte", why: "möchte in slot 2; the order last.", hint: "Build: I'd like a coffee, please." },
            { engine: "recall", prompt: "Write: “What would you like?” (formal)", answer: "Was möchten Sie?", alts: ["Was möchten Sie"], why: "Was + möchten + Sie." }
          ],
          banks: ["a1-s-cafe"],
          check: { type: "dialogue", title: "Order like a local", script: [
            { who: "Kellnerin", de: "Guten Tag! Was möchten Sie?", en: "Good day! What would you like?", options: [{ de: "Ich möchte einen Tee, bitte.", en: "I'd like a tea, please.", ok: true }, { de: "Ich will Tee.", en: "I want tea.", ok: false, tip: "wollen sounds demanding — use möchte." }] },
            { who: "Kellnerin", de: "Mit Zitrone?", en: "With lemon?", options: [{ de: "Ja, bitte.", en: "Yes, please.", ok: true }, { de: "Ich möchte.", en: "I would like.", ok: false, tip: "It's a yes/no question: Ja, bitte." }] },
            { who: "Kellnerin", de: "Sonst noch etwas?", en: "Anything else?", options: [{ de: "Nein, danke. Das ist alles.", en: "No thanks, that's all.", ok: true }, { de: "Was möchten Sie?", en: "What would you like?", ok: false, tip: "That's her line! Decline: Nein, danke." }] },
            { who: "Kellnerin", de: "Gern geschehen!", en: "You're welcome!", options: [{ de: "Die Rechnung, bitte.", en: "The bill, please.", ok: true }, { de: "Guten Morgen!", en: "Good morning!", ok: false, tip: "Wrap up: ask for the bill." }] }
          ] }
        },
        {
          id: "A1-U5-S3", title: "der becomes den", mission: "Use the accusative for the thing being eaten, bought, seen.",
          dialogue: [ln("Omar", "Der Kaffee ist heiß.", "The coffee is hot."), ln("Mia", "Ich trinke den Kaffee.", "I drink the coffee."), ln("Omar", "Ah — der wird den!", "Ah — der becomes den!")],
          notice: notice("'Ich trinke ___ Kaffee.' — which article?", ["der", "den", "das"], "den", "Kaffee is the object (accusative). Masculine der → den. die and das stay the same."),
          cards: [
            card("The rule", "der → den · ein → einen", "Only masculine changes.", "die → die, das → das. Lucky us."),
            card("Subject vs object", "Der Kaffee ist heiß. / Ich trinke den Kaffee.", "Does the coffee act, or get drunk?", "Acting → der. Receiving → den."),
            card("ein partners", "Ich möchte einen Kaffee.", "a coffee (object)", "ein → einen for masculine objects."),
            card("Spot it", "Sie kauft das Brot.", "She buys the bread.", "das stays das.")
          ],
          banks: ["a1-g-accusative", "a1-g-articles"],
          ask: [
            { engine: "mc", kicker: "der or den?", text: "Ich sehe ___ Mann.", options: ["der", "den", "dem"], answer: "den", why: "der Mann is the object → den." },
            { engine: "mc", kicker: "ein or einen?", text: "Sie kauft ___ Apfel.", options: ["ein", "einen", "eine"], answer: "einen", why: "der Apfel as object → einen." },
            { engine: "repair", wrong: "Ich habe ein Bruder.", options: ["Ich habe einen Bruder.", "Ich habe der Bruder.", "Ich habe ein Mann."], answer: "Ich habe einen Bruder.", why: "der Bruder as object → einen Bruder." },
            { engine: "repair", wrong: "Der Hund sieht der Mann.", options: ["Der Hund sieht den Mann.", "Den Hund sieht der Mann.", "Der Hund sieht die Mann."], answer: "Der Hund sieht den Mann.", why: "The man is seen (object) → den." }
          ],
          check: { type: "recall", prompt: "Complete: „Er trinkt ___ Tee.“ (der Tee)", answer: "den", why: "masculine object → den." }
        },
        {
          id: "A1-U5-S4", title: "kein & quantities", mission: "Say what you don't have and what things cost.",
          dialogue: [ln("Marktfrau", "Noch etwas? Wir haben frische Äpfel!", "Anything else? Fresh apples!"), ln("Ben", "Danke, ich habe kein Geld mehr.", "Thanks, I have no money left."), ln("Marktfrau", "Wie viel kostet der Käse?", "How much does the cheese cost?"), ln("Ben", "Vier Euro fünfzig.", "Four fifty.")],
          notice: notice("'Wie viel kostet das?' expects…", ["a time", "a price", "a quantity in kilos"], "a price", "Wie viel = how much. Answer: numbers + Euro/Cent."),
          cards: [
            card("No!", "Ich habe kein Geld. / keine Zeit. / keinen Hunger.", "No money/time/hunger.", "kein follows the article's gender & case."),
            card("Prices", "Das kostet drei Euro.", "That costs three euros.", "Der? — Der Apfel kostet einen Euro."),
            card("wie viel vs wie viele", "Wie viel kostet…? / Wie viele Äpfel?", "uncountable vs countable", "viele with plural things you can count.")
          ],
          items: [
            w("kein Geld", "no money", null, "", "Ich habe kein Geld dabei.", "I have no money on me."),
            w("Wie viel kostet das?", "How much is that?", null, "", "Wie viel kostet der Kaffee?", "How much is the coffee?"),
            w("das kostet", "that costs", null, "", "Das kostet zwei Euro.", "That costs two euros."),
            w("zu teuer", "too expensive", null, "", "Das ist mir zu teuer.", "That's too expensive for me."),
            w("billig", "cheap", null, "", "Das Brot ist billig.", "The bread is cheap.")
          ],
          check: { type: "open", prompt: "Ask how much the cheese costs.", model: "Wie viel kostet der Käse?" }
        },
        {
          id: "A1-U5-S5", title: "Mission: Café run", mission: "Greet, order, pay — the full café script.",
          dialogue: [ln("Kellner", "Guten Morgen! Was bekommen Sie?", "Good morning! What'll it be?"), ln("You", "…", "your turn")],
          cards: [card("Script recall", "Guten Morgen! · Ich möchte … · Mit …, bitte. · Das ist alles. · Die Rechnung, bitte.", "The five café moves.", "You've practiced every single one.")],
          banks: ["a1-v-food", "a1-s-cafe"],
          check: { type: "dialogue", title: "Café Sonne", script: [
            { who: "Kellner", de: "Guten Morgen! Was bekommen Sie?", en: "Good morning! What would you like?", options: [{ de: "Guten Morgen! Ich möchte einen Kaffee, bitte.", en: "Good morning! I'd like a coffee, please.", ok: true }, { de: "Kaffee!", en: "Coffee!", ok: false, tip: "Greet back and use möchte." }] },
            { who: "Kellner", de: "Mit Milch und Zucker?", en: "With milk and sugar?", options: [{ de: "Mit Milch, bitte. Kein Zucker.", en: "With milk, please. No sugar.", ok: true }, { de: "Das kostet drei Euro.", en: "That costs three euros.", ok: false, tip: "Answer what you want: Mit Milch…" }] },
            { who: "Kellner", de: "Noch etwas dazu? Ein Stück Kuchen?", en: "Anything with it? A piece of cake?", options: [{ de: "Ja, ein Stück Kuchen, bitte.", en: "Yes, a piece of cake, please.", ok: true }, { de: "Ich trinke den Kaffee.", en: "I drink the coffee.", ok: false, tip: "Accept food with: Ja, …, bitte." }] },
            { who: "Kellner", de: "Zusammen 7,50 €.", en: "Altogether €7.50.", options: [{ de: "Hier, bitte. Danke schön!", en: "Here you go. Thanks!", ok: true }, { de: "Woher kommst du?", en: "Where are you from?", ok: false, tip: "Time to pay — Hier, bitte." }] }
          ] }
        }
      ]
    },
    {
      id: "A1-U6", title: "Daily routine", sub: "Narrate your own day",
      why: "Separable verbs + clock time = you can now describe a full day like a native.",
      uses: "A1-U4: regular verbs · A1-U5: accusative.",
      stages: [
        {
          id: "A1-U6-S1", title: "The routine verbs", mission: "Say what you do from aufstehen to schlafen.",
          dialogue: [ln("Mia", "Ich stehe um sieben auf.", "I get up at seven."), ln("Ben", "Ich frühstücke und gehe zur Arbeit.", "I have breakfast and go to work."), ln("Mia", "Abends koche ich und sehe fern.", "In the evening I cook and watch TV.")],
          notice: notice("'Ich stehe um sieben AUF.' — what happened to aufstehen?", ["it split: verb second, prefix last", "it's a typo", "auf is optional"], "it split: verb second, prefix last", "Separable verbs: auf/stehen. Conjugated part sits in slot 2, prefix flies to the end."),
          cards: [
            card("Separable stars", "aufstehen · frühstücken · einkaufen · fernsehen", "get up · breakfast · shop · watch TV", "ich stehe auf, er kauft ein, wir sehen fern."),
            card("Anchors", "die Arbeit · der Sport · das Bett", "work · sport · bed", "zur Arbeit gehen, ins Bett gehen."),
            card("A full line", "Ich stehe um 7 Uhr auf.", "I get up at 7.", "Time before the split-off ending.")
          ],
          banks: ["a2-v-routine", "a2-g-separable"],
          ask: [
            { engine: "builder", chunks: ["steht", "Er", "um", "sieben", "auf"], answer: "Er steht um sieben auf", why: "stein-part second, auf to the end.", hint: "Build: He gets up at seven." },
            { engine: "repair", wrong: "Ich aufstehe um sieben.", options: ["Ich stehe um sieben auf.", "Ich stehe auf um sieben.", "Aufstehe ich um sieben."], answer: "Ich stehe um sieben auf.", why: "Separate: steh- in slot 2, auf at the end." }
          ],
          check: { type: "say", prompt: "Say when you get up.", target: "Ich stehe um … Uhr auf.", model: "Ich stehe um sieben Uhr auf." }
        },
        {
          id: "A1-U6-S2", title: "fahren, lesen, sehen", mission: "Handle the common stem-changers without hesitating.",
          dialogue: [ln("Lea", "Liest du die Zeitung?", "Do you read the newspaper?"), ln("Tom", "Nein, ich lese Bücher. Und du — fährst du Bus?", "No, I read books. And you — do you take the bus?"), ln("Lea", "Ja, ich fahre jeden Tag.", "Yes, I ride every day.")],
          notice: notice("lesen → er ___", ["lest", "liest", "leset"], "liest", "e→ie for du/er: lesen→liest, sehen→sieht. fahren: a→ä: fährt."),
          cards: [
            card("e → ie", "lesen: du liest · sehen: er sieht", "read · see", "Only du and er/sie/es change."),
            card("a → ä", "fahren: du fährst · schlafen: er schläft", "drive · sleep", "Umlaut for du/er."),
            card("In context", "Sie liest ein Buch. Er fährt Rad.", "She reads. He cycles.", "Same rule, new verbs — apply it.")
          ],
          ask: [
            { engine: "mc", kicker: "Conjugate", text: "schlafen → er ___", options: ["schlafst", "schläft", "schlafet"], answer: "schläft", why: "a→ä + t." },
            { engine: "mc", kicker: "Conjugate", text: "sehen → du ___", options: ["siehst", "seest", "sieht"], answer: "siehst", why: "e→ie + st." },
            { engine: "recall", prompt: "fahren → er", answer: "er fährt", alts: ["fährt"], why: "a→ä: er fährt." }
          ],
          items: [
            w("lesen", "to read", null, "", "Ich lese jeden Abend.", "I read every evening."),
            w("sehen", "to see", null, "", "Siehst du das?", "Do you see that?"),
            w("fahren", "to drive / ride", null, "", "Wir fahren nach Hamburg.", "We're driving to Hamburg."),
            w("schlafen", "to sleep", null, "", "Das Baby schläft.", "The baby is sleeping.")
          ],
          check: { type: "recall", prompt: "Write: “She reads a book.”", answer: "Sie liest ein Buch", why: "e→ie: sie liest." }
        },
        {
          id: "A1-U6-S3", title: "Clock time", mission: "Say the time both officially and like a human.",
          dialogue: [ln("Freundin", "Wann treffen wir uns?", "When do we meet?"), ln("Omar", "Um halb vier?", "At half three (3:30)?"), ln("Freundin", "Perfekt. Es ist jetzt zwei Uhr — bis gleich!", "Perfect. It's two o'clock now — see you soon!")],
          notice: notice("'halb vier' is…", ["4:30", "3:30", "5:30"], "3:30", "halb vier = half WAY TO four. The German half points forward, not back."),
          cards: [
            card("Official", "Es ist 15:30 Uhr.", "15:30.", "Radio, stations, appointments: 24-hour + Uhr."),
            card("Casual", "halb vier · Viertel nach drei", "3:30 · quarter past three", "With friends."),
            card("At a time", "um vier Uhr · um halb fünf", "at four · at half past four", "um + time."),
            card("Duration", "von acht bis zwölf", "from eight till twelve", "Work hours, opening hours.")
          ],
          banks: ["a1-v-time"],
          ask: [
            { engine: "mc", kicker: "Translate", text: "halb sechs", options: ["6:30", "5:30", "7:30"], answer: "5:30", why: "half way TO six." },
            { engine: "recall", prompt: "Write: “At 8 o'clock.”", answer: "um acht Uhr", alts: ["um 8 Uhr"], why: "um + Uhr." }
          ],
          check: { type: "say", prompt: "Suggest meeting at 4:30.", target: "Wir treffen uns um halb fünf.", model: "Wir treffen uns um halb fünf." }
        },
        {
          id: "A1-U6-S4", title: "Days & word order", mission: "Build time-first sentences: Heute arbeite ich.",
          dialogue: [ln("Ben", "Am Montag arbeite ich.", "On Monday I work."), ln("Mia", "Heute lerne ich Deutsch.", "Today I learn German."), ln("Ben", "Morgen? Da habe ich frei.", "Tomorrow? I'm off then.")],
          notice: notice("'Heute LERNE ICH Deutsch.' — why ich after lerne?", ["verb always sits in slot 2", "ich is weak", "time words are bosses"], "verb always sits in slot 2", "First slot: heute. Second slot must be the verb — subject goes third. V2 is sacred."),
          cards: [
            card("V2 law", "Heute lerne ich Deutsch.", "Today I learn German.", "Whatever leads, the verb keeps position 2."),
            card("The days", "Montag … Sonntag + am", "on Monday = am Montag", "am Sonntag, am Wochenende."),
            card("Parts of day", "morgens · mittags · abends · nachts", "mornings · at noon · evenings · at night", "-s makes it habitual: abends sehe ich fern.")
          ],
          banks: ["a1-g-wordorder"],
          ask: [
            { engine: "builder", chunks: ["ich", "Heute", "lerne", "Deutsch"], answer: "Heute lerne ich Deutsch", why: "Time first → verb second → subject third.", hint: "Start with Heute." },
            { engine: "repair", wrong: "Heute ich lerne Deutsch.", options: ["Heute lerne ich Deutsch.", "Heute Deutsch lerne ich.", "Ich heute lerne Deutsch."], answer: "Heute lerne ich Deutsch.", why: "Verb must stay in slot 2." }
          ],
          check: { type: "open", prompt: "Write one V2 sentence with Morgen.", model: "Morgen arbeite ich von zu Hause." }
        },
        {
          id: "A1-U6-S5", title: "Mission: Your day", mission: "Narrate your real day from morning to night.",
          dialogue: [ln("Partner", "Wie sieht dein Tag aus?", "What does your day look like?"), ln("You", "…", "your turn")],
          cards: [card("Skeleton", "Ich stehe um … auf. Dann frühstücke ich. Um … gehe ich … Abends …", "Fill your times and verbs.", "Four sentences is a complete story.")],
          banks: ["a2-v-routine"],
          check: { type: "open", prompt: "Describe your day in 3–4 German sentences.", model: "Ich stehe um acht auf und frühstücke. Dann arbeite ich. Abends koche ich und lese ein Buch." }
        }
      ]
    },
    {
      id: "A1-U7", title: "Home & things", sub: "Show someone around",
      why: "Rooms, furniture, where things stand — including the dreaded two-way prepositions, taken gently.",
      uses: "A1-U5: accusative · A1-U4: possessives.",
      stages: [
        {
          id: "A1-U7-S1", title: "Rooms & furniture", mission: "Name every room and three things in it.",
          dialogue: [ln("Mia", "Willkommen! Das ist die Küche.", "Welcome! This is the kitchen."), ln("Ben", "Und das Wohnzimmer?", "And the living room?"), ln("Mia", "Hier — mit Sofa und Lampe.", "Here — with sofa and lamp.")],
          notice: notice("'das Wohnzimmer' is built from…", ["two nouns glued: wohnen + Zimmer", "an adjective", "English"], "two nouns glued: wohnen + Zimmer", "Compound nouns: the LAST part gets the gender. Zimmer is das → Wohnzimmer is das."),
          cards: [
            card("Rooms", "die Küche · das Bad · das Schlafzimmer · das Wohnzimmer", "kitchen · bath · bedroom · living room", "Compound check: Schlaf+zimmer → das!"),
            card("Furniture", "der Tisch · die Lampe · das Bett · der Stuhl", "table · lamp · bed · chair", "Learn each with its article."),
            card("Flat vs house", "die Wohnung / das Haus", "apartment / house", "Ich suche eine Wohnung — accusative!")
          ],
          banks: ["a1-v-home", "a1-g-articles"],
          check: { type: "say", prompt: "Name three rooms.", target: "die Küche, das Bad, das Wohnzimmer", model: "die Küche, das Bad, das Wohnzimmer" }
        },
        {
          id: "A1-U7-S2", title: "es gibt", mission: "Announce what a place has — one phrase for everything.",
          dialogue: [ln("Vermieter", "Die Wohnung hat zwei Zimmer.", "The flat has two rooms."), ln("Mia", "Gibt es einen Balkon?", "Is there a balcony?"), ln("Vermieter", "Ja, es gibt einen Balkon und einen Keller.", "Yes, there's a balcony and a cellar.")],
          notice: notice("'Gibt es ___ Balkon?' — the gap takes…", ["der", "einen", "das"], "einen", "es gibt + accusative: der Balkon → einen Balkon. A1-U5 pays off."),
          cards: [
            card("There is/are", "Es gibt einen Garten.", "There is a garden.", "es gibt + accusative, singular or plural."),
            card("Question", "Gibt es ein Bad?", "Is there a bathroom?", "Verb first: Gibt es…?"),
            card("Handy negation", "Es gibt keinen Aufzug.", "There's no elevator.", "kein joins in for free.")
          ],
          ask: [
            { engine: "mc", kicker: "Complete", text: "Es gibt ___ Garten. (der Garten)", options: ["der", "einen", "ein"], answer: "einen", why: "es gibt + accusative, masculine → einen." },
            { engine: "recall", prompt: "Ask: “Is there a kitchen?”", answer: "Gibt es eine Küche?", alts: ["Gibt es eine Küche"], why: "die Küche → eine (feminine accusative = nominative)." }
          ],
          items: [
            w("es gibt", "there is / there are", null, "", "Es gibt einen Park hier.", "There is a park here."),
            w("der Balkon", "the balcony", "der", "", "Der Balkon ist klein.", "The balcony is small."),
            w("der Garten", "the garden", "der", "", "Wir haben einen Garten.", "We have a garden."),
            w("der Keller", "the cellar", "der", "", "Der Keller ist dunkel.", "The cellar is dark.")
          ],
          check: { type: "open", prompt: "Write: “There is a garden.”", model: "Es gibt einen Garten." }
        },
        {
          id: "A1-U7-S3", title: "Where things stand", mission: "Place objects: auf, unter, neben the table.",
          dialogue: [ln("Ben", "Wo ist mein Schlüssel?", "Where is my key?"), ln("Mia", "Auf dem Tisch, neben der Lampe.", "On the table, next to the lamp."), ln("Ben", "Und der Hund?", "And the dog?"), ln("Mia", "Unter dem Tisch.", "Under the table.")],
          notice: notice("'auf DEM Tisch' — why dem?", ["location → dative", "tables are masculine", "random"], "location → dative", "Two-way prepositions: WHERE something IS = dative (dem/der). Movement into a spot = accusative — that's A2."),
          cards: [
            card("The cast", "auf · unter · neben · vor · hinter · in", "on · under · next to · before · behind · in", "A1: slow answers = dative."),
            card("der → dem", "auf dem Tisch", "on the table", "Masculine & neuter: dem."),
            card("die → der", "neben der Lampe", "next to the lamp", "Feminine: der."),
            card("das → dem", "in dem (= im) Zimmer", "in the room", "in dem → im, an dem → am.")
          ],
          ask: [
            { engine: "mc", kicker: "Complete", text: "Das Buch liegt auf ___ Tisch. (der)", options: ["dem", "der", "den"], answer: "dem", why: "location → dative: auf dem Tisch." },
            { engine: "mc", kicker: "Complete", text: "Der Stuhl steht neben ___ Lampe. (die)", options: ["die", "der", "dem"], answer: "der", why: "feminine dative: neben der Lampe." },
            { engine: "repair", wrong: "Die Katze sitzt unter die Sofa.", options: ["Die Katze sitzt unter dem Sofa.", "Die Katze sitzt unter das Sofa.", "Die Katze unter dem Sofa sitzt."], answer: "Die Katze sitzt unter dem Sofa.", why: "das Sofa → dative dem; verb stays second." }
          ],
          items: [
            w("auf dem Tisch", "on the table", null, "", "Der Schlüssel liegt auf dem Tisch.", "The key is on the table."),
            w("unter dem Bett", "under the bed", null, "", "Die Katze schläft unter dem Bett.", "The cat sleeps under the bed."),
            w("neben der Tür", "next to the door", null, "", "Die Lampe steht neben der Tür.", "The lamp stands next to the door."),
            w("im Zimmer", "in the room", null, "", "Wir sind im Zimmer.", "We are in the room.")
          ],
          check: { type: "say", prompt: "Say where your phone is.", target: "Das Handy liegt auf …", model: "Das Handy liegt auf dem Tisch." }
        },
        {
          id: "A1-U7-S4", title: "Mission: Home tour", mission: "Guide someone through your home in German.",
          dialogue: [ln("Gast", "Schöne Wohnung! Gibt es einen Balkon?", "Nice flat! Is there a balcony?"), ln("You", "…", "your turn")],
          cards: [card("Tour script", "Das ist die Küche. Hier koche ich. Das Wohnzimmer ist groß. Es gibt …", "Room + one thing in it.", "3 rooms = a real tour.")],
          banks: ["a1-v-home"],
          check: { type: "open", prompt: "Give a mini home tour (3 sentences).", model: "Das ist meine Wohnung. Die Küche ist klein, aber schön. Im Wohnzimmer gibt es ein Sofa und einen Tisch." }
        }
      ]
    },
    {
      id: "A1-U8", title: "Around town", sub: "Ask the way, understand the answer",
      why: "Directions, transport, signs — German starts working as a survival tool.",
      uses: "A1-U3: question words · A1-U7: dative keeps growing.",
      stages: [
        {
          id: "A1-U8-S1", title: "Places & signs", mission: "Name the places a city throws at you.",
          dialogue: [ln("Schild", "Eingang — Ausgang", "Entrance — exit"), ln("Ben", "Wo ist die Apotheke?", "Where is the pharmacy?"), ln("Passentin", "Neben dem Bahnhof, gegenüber vom Kino.", "Next to the station, opposite the cinema.")],
          notice: notice("'geöffnet' / 'geschlossen' on a door mean…", ["push / pull", "open / closed", "sale / sold"], "open / closed", "Shop hours live on these two words."),
          cards: [
            card("City cast", "der Bahnhof · das Kino · die Apotheke · die Bank", "station · cinema · pharmacy · bank", "die Post = post office."),
            card("Door words", "Eingang · Ausgang · geöffnet · geschlossen", "entrance · exit · open · closed", "Schilder first, grammar later."),
            card("Anchors", "gegenüber von · neben", "opposite · next to", "German direction answers love these.")
          ],
          banks: ["a1-v-city", "a1-r-sign"],
          check: { type: "say", prompt: "Name three places in a city.", target: "der Bahnhof, das Kino, die Apotheke", model: "der Bahnhof, das Kino, die Bank" }
        },
        {
          id: "A1-U8-S2", title: "Directions", mission: "Give and follow geradeaus, links, rechts.",
          dialogue: [ln("You", "Entschuldigung, wo ist der Bahnhof?", "Excuse me, where is the station?"), ln("Passant", "Gehen Sie geradeaus, dann links.", "Go straight, then left."), ln("You", "Ist es weit?", "Is it far?"), ln("Passant", "Nein, fünf Minuten zu Fuß.", "No, five minutes on foot.")],
          notice: notice("Which form of the command fits a stranger?", ["Geh!", "Gehen Sie!", "Geht!"], "Gehen Sie!", "Formal imperative = infinitive + Sie. Geh! is for friends."),
          cards: [
            card("The trio", "geradeaus · links · rechts", "straight · left · right", "The answer is always built from these."),
            card("Asking", "Wo ist die Bank?", "Where is the bank?", "Or: Wie komme ich zum Bahnhof?"),
            card("Commands", "Gehen Sie geradeaus!", "Go straight! (formal)", "Geh! (informal)"),
            card("Distance", "zu Fuß · weit · nah", "on foot · far · near", "Ist es weit?")
          ],
          ask: [
            { engine: "listen", kicker: "Which instruction did you hear?", audio: "Gehen Sie links.", options: ["Turn left", "Turn right", "Go straight"], answer: "Turn left", why: "links = left." },
            { engine: "mc", kicker: "Formal command", text: "Tell a stranger: Come!", options: ["Komm!", "Kommen Sie!", "Kommt!"], answer: "Kommen Sie!", why: "Infinitive + Sie for formal commands." },
            { engine: "builder", chunks: ["Sie", "Gehen", "geradeaus"], answer: "Gehen Sie geradeaus", why: "Formal command: verb first, then Sie.", hint: "Build: Go straight (formal)." }
          ],
          items: [
            w("geradeaus", "straight ahead", null, "", "Gehen Sie immer geradeaus.", "Keep going straight ahead."),
            w("links", "left", null, "", "Dann links abbiegen.", "Then turn left."),
            w("rechts", "right", null, "", "Die Bank ist rechts.", "The bank is on the right."),
            w("zu Fuß", "on foot", null, "", "Zehn Minuten zu Fuß.", "Ten minutes on foot."),
            w("weit", "far", null, "", "Ist der Bahnhof weit?", "Is the station far?")
          ],
          check: { type: "dialogue", title: "Lost but polite", script: [
            { who: "Passantin", de: "Ja, bitte? Kann ich helfen?", en: "Yes? Can I help?", options: [{ de: "Wo ist der Bahnhof, bitte?", en: "Where is the station, please?", ok: true }, { de: "Du Bahnhof?", en: "You station?", ok: false, tip: "Full question: Wo ist der Bahnhof?" }] },
            { who: "Passantin", de: "Immer geradeaus, dann die zweite Straße rechts.", en: "Straight ahead, then the second street right.", options: [{ de: "Danke schön!", en: "Thank you very much!", ok: true }, { de: "Wo ist links?", en: "Where is left?", ok: false, tip: "She helped — thank her." }] }
          ] }
        },
        {
          id: "A1-U8-S3", title: "mit, nach, zu", mission: "Move through the city with the dative prepositions.",
          dialogue: [ln("Lea", "Ich fahre mit dem Bus zur Arbeit.", "I take the bus to work."), ln("Tom", "Ich gehe zu Fuß.", "I walk."), ln("Lea", "Am Wochenende fahren wir nach Hamburg.", "On the weekend we're driving to Hamburg.")],
          notice: notice("'mit ___ Bus' — gap?", ["dem", "der", "den"], "dem", "mit always takes dative: mit dem Bus. nach (cities/countries) and zu (places/people) too."),
          cards: [
            card("mit", "mit dem Bus · mit dem Zug · mit der U-Bahn", "by bus/train/subway", "Transport = mit + dative."),
            card("nach", "nach Hamburg · nach Hause", "to Hamburg · home", "Cities & countries get nach."),
            card("zu", "zur Arbeit · zum Arzt · zur Schule", "to work/doctor/school", "zu + dative; zu dem → zum, zu der → zur."),
            card("Pattern", "mit deM Bus zur Schule nach Berlin", "one city move, three preps", "Say it as a chant.")
          ],
          banks: ["a2-g-dative"],
          ask: [
            { engine: "mc", kicker: "Complete", text: "Ich fahre ___ Zug. (by train)", options: ["mit dem", "mit der", "nach dem"], answer: "mit dem", why: "der Zug → dative dem after mit." },
            { engine: "mc", kicker: "nach or zu?", text: "Wir fahren ___ Berlin.", options: ["nach", "zu", "mit"], answer: "nach", why: "Cities take nach." },
            { engine: "repair", wrong: "Ich gehe zu Schule.", options: ["Ich gehe zur Schule.", "Ich gehe nach Schule.", "Ich gehe zu die Schule."], answer: "Ich gehe zur Schule.", why: "die Schule → zu der → zur." }
          ],
          check: { type: "say", prompt: "Say you go to work by bus.", target: "Ich fahre mit dem Bus zur Arbeit.", model: "Ich fahre mit dem Bus zur Arbeit." }
        },
        {
          id: "A1-U8-S4", title: "Mission: Find the museum", mission: "Ask, understand, confirm — full direction exchange.",
          dialogue: [ln("Passant", "Sie suchen etwas?", "Are you looking for something?")],
          cards: [card("Your moves", "Entschuldigung, wie komme ich zum …? · Ist es weit? · Danke!", "ask, check, thank", "Keep it moving — three lines are enough.")],
          banks: ["a1-v-city"],
          check: { type: "dialogue", title: "Das Museum", script: [
            { who: "Passant", de: "Sie sehen verloren aus!", en: "You look lost!", options: [{ de: "Ja — wie komme ich zum Museum?", en: "Yes — how do I get to the museum?", ok: true }, { de: "Ich heiße Sam.", en: "My name is Sam.", ok: false, tip: "Ask your question with wie komme ich …" }] },
            { who: "Passant", de: "Links, dann geradeaus bis zur Post. Das Museum ist gegenüber.", en: "Left, then straight to the post office. The museum is opposite.", options: [{ de: "Also: links, geradeaus — gegenüber der Post.", en: "So: left, straight — opposite the post office.", ok: true }, { de: "Das Museum ist geschlossen.", en: "The museum is closed.", ok: false, tip: "Repeat the directions back to confirm." }] },
            { who: "Passant", de: "Genau! Zehn Minuten zu Fuß.", en: "Exactly! Ten minutes on foot.", options: [{ de: "Vielen Dank! Tschüss!", en: "Many thanks! Bye!", ok: true }, { de: "Es kostet zehn Euro.", en: "It costs ten euros.", ok: false, tip: "Finish politely: Vielen Dank." }] }
          ] }
        }
      ]
    },
    {
      id: "A1-U9", title: "Shopping & clothes", sub: "Buy what you actually want",
      why: "Sizes, colors, prices, dieser — shop German with style.",
      uses: "A1-U5: prices & accusative · A1-U3: numbers.",
      stages: [
        {
          id: "A1-U9-S1", title: "Clothes & colors", mission: "Name what you're wearing, in color.",
          dialogue: [ln("Mia", "Die rote Jacke ist schön!", "The red jacket is beautiful!"), ln("Ben", "Ich suche eine blaue Hose.", "I'm looking for blue trousers."), ln("Mia", "Welche Größe?", "Which size?"), ln("Ben", "Größe 50.", "Size 50.")],
          notice: notice("'eine blaue Hose' — why blaue, not blau?", ["adjective after eine takes -e (feminine)", "colors are always -e", "Hose is plural"], "adjective after eine takes -e (feminine)", "After ein/kein the adjective takes the gender ending: ein roter Pullover, eine blaue Hose, ein schwarzes Kleid."),
          cards: [
            card("Clothes", "die Hose · das Kleid · das Hemd · die Jacke · der Pullover", "trousers · dress · shirt · jacket · sweater", "die Schuhe — shoes (plural)."),
            card("Colors", "rot · blau · grün · schwarz · weiß", "red · blue · green · black · white", "Invariable after 'ist': Die Jacke ist rot."),
            card("Before a noun", "ein schwarzes Kleid", "a black dress", "Adjective takes an ending — das → -es."),
            card("Sizes", "Größe 38 · klein · mittel · groß", "size 38 · S · M · L", "Ich habe Größe 42.")
          ],
          banks: ["a1-v-colors", "a2-v-shopping"],
          ask: [
            { engine: "mc", kicker: "Complete", text: "ein roter ___ / eine rote ___ / ein rotes ___", options: ["Pullover · Hose · Kleid", "Hose · Pullover · Kleid", "Kleid · Hose · Pullover"], answer: "Pullover · Hose · Kleid", why: "der Pullover→er, die Hose→e, das Kleid→es." }
          ],
          check: { type: "say", prompt: "Describe what you're wearing.", target: "Ich trage ein schwarzes T-Shirt und eine blaue Jeans.", model: "Ich trage ein schwarzes T-Shirt." }
        },
        {
          id: "A1-U9-S2", title: "In the shop", mission: "Ask for items, sizes, prices; handle the reply.",
          dialogue: [ln("Verkäuferin", "Kann ich Ihnen helfen?", "Can I help you?"), ln("Fatima", "Haben Sie diese Jacke in Größe 40?", "Do you have this jacket in size 40?"), ln("Verkäuferin", "Ja, hier. Sie kostet 60 Euro.", "Yes, here. It's 60 euros."), ln("Fatima", "Kann ich sie anprobieren?", "Can I try it on?")],
          notice: notice("'Haben Sie diese Jacke ___ Größe 40?'", ["mit", "in", "für"], "in", "in + size in German: in Größe 40, in Rot."),
          cards: [
            card("Opening", "Haben Sie …?", "Do you have …?", "Haben Sie das Hemd in Blau?"),
            card("Trying", "Kann ich sie anprobieren?", "Can I try it on?", "Separable: probieren → probiere … an."),
            card("dieser", "dieser Pullover · diese Hose · dieses Kleid", "this + gender form", "dies- copies der/die/das."),
            card("Verdict", "Das passt. / Das ist zu teuer.", "That fits. / Too expensive.", "zu klein, zu groß.")
          ],
          ask: [
            { engine: "mc", kicker: "dieser/diese/dieses?", text: "___ Hemd gefällt mir. (das Hemd)", options: ["Dieser", "Diese", "Dieses"], answer: "Dieses", why: "das Hemd → dieses." },
            { engine: "recall", prompt: "Write: “That is too expensive.”", answer: "Das ist zu teuer", why: "zu + adjective." },
            { engine: "listen", kicker: "What did the clerk say?", audio: "Die Jacke kostet sechzig Euro.", options: ["It costs 60 euros", "It costs 16 euros", "Size 60"], answer: "It costs 60 euros", why: "sechzig = 60. sechzehn = 16." }
          ],
          check: { type: "dialogue", title: "Kaufhaus", script: [
            { who: "Verkäufer", de: "Guten Tag! Sie suchen etwas Bestimmtes?", en: "Good day! Looking for something specific?", options: [{ de: "Haben Sie dieses Hemd in Größe M?", en: "Do you have this shirt in size M?", ok: true }, { de: "Das Hemd ist blau.", en: "The shirt is blue.", ok: false, tip: "Ask with Haben Sie … in Größe …?" }] },
            { who: "Verkäufer", de: "Ja. Möchten Sie es anprobieren? Die Umkleide ist dort.", en: "Yes. Want to try it on? The fitting room is there.", options: [{ de: "Ja, gern. Danke!", en: "Yes, gladly. Thanks!", ok: true }, { de: "Nein, kaufen Sie!", en: "No, you buy it!", ok: false, tip: "Accept politely: Ja, gern." }] },
            { who: "Verkäufer", de: "Passt es? Es kostet nur 29 Euro.", en: "Does it fit? It's only 29 euros.", options: [{ de: "Es passt! Ich nehme es.", en: "It fits! I'll take it.", ok: true }, { de: "Zu hässlich, tschüss!", en: "Too ugly, bye!", ok: false, tip: "#1: it fits — Ich nehme es. And stay polite." }] }
          ] }
        },
        {
          id: "A1-U9-S3", title: "Mission: Buy the outfit", mission: "Complete a purchase start to finish.",
          dialogue: [ln("Verkäuferin", "Die Umkleiden sind links.", "The fitting rooms are on the left.")],
          cards: [card("Checklist", "ask (Haben Sie…?) → size/color → try on (anprobieren) → price (Wie viel…?) → buy (Ich nehme es)", "5 moves", "You have all of them.")],
          check: { type: "open", prompt: "Write your shopping script: ask for a blue shirt in your size, then say you take it.", model: "Haben Sie dieses Hemd in Blau? Größe M, bitte. Es passt — ich nehme es." }
        }
      ]
    },
    {
      id: "A1-U10", title: "Free time & plans", sub: "Invite, accept, refuse",
      why: "Modal verbs können and wollen unlock plans — the social payoff of A1.",
      uses: "A1-U6: times & days · A1-U4: yes/no questions.",
      stages: [
        {
          id: "A1-U10-S1", title: "Hobbies", mission: "Say what you do for fun.",
          dialogue: [ln("Ben", "Was machst du gern?", "What do you like doing?"), ln("Mia", "Ich spiele Fußball und höre Musik.", "I play football and listen to music."), ln("Ben", "Ich lese gern. Und schwimmen!", "I like reading. And swimming!")],
          notice: notice("gern turns a verb into…", ["a past tense", "something you LIKE doing", "a question"], "something you LIKE doing", "Ich schwimme = I swim. Ich schwimme gern = I like swimming."),
          cards: [
            card("Hobbies", "Fußball spielen · Musik hören · schwimmen · lesen", "play football · listen to music · swim · read", "German hobbies are verb-first: gern + verb."),
            card("Like doing", "Ich koche gern.", "I like cooking.", "gern after the verb."),
            card("Don't like", "Ich jogge nicht so gern.", "I don't like jogging much.", "nicht + gern.")
          ],
          items: [
            w("gern", "gladly / like to", null, "", "Ich tanze gern.", "I like dancing."),
            w("Fußball spielen", "to play football", null, "", "Wir spielen am Samstag Fußball.", "We play football on Saturday."),
            w("Musik hören", "to listen to music", null, "", "Ich höre gern Musik.", "I like listening to music."),
            w("schwimmen", "to swim", null, "", "Im Sommer schwimmen wir im See.", "In summer we swim in the lake."),
            w("das Hobby", "the hobby", "das", "", "Mein Hobby ist Lesen.", "My hobby is reading.")
          ],
          check: { type: "open", prompt: "Write your two hobbies.", model: "Ich spiele gern Fußball und ich höre gern Musik." }
        },
        {
          id: "A1-U10-S2", title: "können & wollen", mission: "Say what you can and want to do.",
          dialogue: [ln("Tom", "Kannst du schwimmen?", "Can you swim?"), ln("Lea", "Ja, aber ich will heute nicht schwimmen.", "Yes, but I don't want to swim today."), ln("Tom", "Dann wollen wir ins Kino gehen!", "Then let's go to the cinema!")],
          notice: notice("'Ich will ins Kino GEHEN.' — where's the infinitive?", ["second", "at the very end", "missing"], "at the very end", "Modal verbs push the main verb to the end as infinitive: Ich will gehen."),
          cards: [
            card("können", "ich kann · du kannst · er kann", "can", "Ich kann schwimmen. — No -t for ich/er!"),
            card("wollen", "ich will · du willst · er will", "want", "Same endings as können."),
            card("Bracket order", "Ich will morgen ins Kino gehen.", "I want to go to the cinema tomorrow.", "Modal in slot 2, infinitive last — the sentence bracket."),
            card("Plan opener", "Wollen wir …?", "Shall we …?", "Wollen wir ins Kino gehen?")
          ],
          banks: ["a2-g-modals"],
          ask: [
            { engine: "builder", chunks: ["will", "Ich", "morgen", "ins", "Kino", "gehen"], answer: "Ich will morgen ins Kino gehen", why: "will in slot 2, gehen at the end.", hint: "Build: I want to go to the cinema tomorrow." },
            { engine: "repair", wrong: "Ich kann schwimmt.", options: ["Ich kann schwimmen.", "Ich schwimmen kann.", "Ich kannt schwimmen."], answer: "Ich kann schwimmen.", why: "After a modal, the main verb is the bare infinitive at the end." }
          ],
          check: { type: "recall", prompt: "Write: “Can you swim?” (informal)", answer: "Kannst du schwimmen?", alts: ["Kannst du schwimmen"], why: "du kannst; question = verb first." }
        },
        {
          id: "A1-U10-S3", title: "Invitations", mission: "Invite, accept, and refuse without going quiet.",
          dialogue: [ln("Mia", "Wollen wir am Freitag essen gehen?", "Shall we go eat on Friday?"), ln("Ben", "Gute Idee! Um wie viel Uhr?", "Good idea! At what time?"), ln("Mia", "Um sieben.", "At seven."), ln("Ben", "Sorry, Freitag kann ich nicht. Samstag?", "Sorry, I can't Friday. Saturday?")],
          notice: notice("'Freitag kann ich nicht.' — what's the word order trick?", ["kann first", "Freitag takes slot 1, verb still slot 2", "nicht starts"], "Freitag takes slot 1, verb still slot 2", "Topic-first + V2, from U6 — reused here with modals."),
          cards: [
            card("Invite", "Wollen wir …? / Hast du Lust …?", "Shall we? / Feel like?", "Hast du Lust, ins Kino zu gehen?"),
            card("Accept", "Gute Idee! / Klar, gern!", "Good idea! / Sure, gladly!", "Short and warm."),
            card("Refuse kindly", "Da kann ich leider nicht. / Ich habe keine Zeit.", "Unfortunately I can't. / No time.", "leider softens the no."),
            card("Reschedule", "Vielleicht Samstag?", "Maybe Saturday?", "Offer an alternative — very German.")
          ],
          ask: [
            { engine: "formal", situation: "A friend invites you but you're busy — refuse kindly", options: ["Nein. Keine Lust.", "Da kann ich leider nicht.", "Ich will nicht."], answer: "Da kann ich leider nicht.", why: "leider makes the refusal kind." },
            { engine: "recall", prompt: "Write: “Shall we meet tomorrow?”", answer: "Wollen wir uns morgen treffen?", alts: ["Wollen wir morgen treffen?"], why: "Wollen wir + infinitive at the end." }
          ],
          check: { type: "say", prompt: "Invite me to eat on Friday evening.", target: "Wollen wir am Freitagabend essen gehen?", model: "Wollen wir am Freitagabend essen gehen?" }
        },
        {
          id: "A1-U10-S4", title: "Mission: Make the plan", mission: "Set up a real meeting: activity, day, time.",
          dialogue: [ln("Freundin", "Lange nicht gesehen! Wollen wir was machen?", "Long time no see! Shall we do something?")],
          cards: [card("Plan recipe", "activity (Wollen wir …?) + day (am …) + time (um …)", "three details", "Close with: Perfekt, bis dann!")],
          check: { type: "dialogue", title: "Weekend plans", script: [
            { who: "Jana", de: "Hey! Lange nicht gesehen. Wollen wir was machen?", en: "Hey! Long time. Shall we do something?", options: [{ de: "Klar! Wollen wir am Samstag schwimmen gehen?", en: "Sure! Shall we go swimming Saturday?", ok: true }, { de: "Ich schwimme gern.", en: "I like swimming.", ok: false, tip: "Answer the invitation with Wollen wir …?" }] },
            { who: "Jana", de: "Samstag bin ich bei meinen Eltern. Sonntag?", en: "Saturday I'm at my parents'. Sunday?", options: [{ de: "Sonntag passt. Um wie viel Uhr?", en: "Sunday works. At what time?", ok: true }, { de: "Meine Eltern wohnen in Köln.", en: "My parents live in Cologne.", ok: false, tip: "Respond to Sonntag?" }] },
            { who: "Jana", de: "Um vier, am See?", en: "At four, at the lake?", options: [{ de: "Perfekt, um vier am See. Bis dann!", en: "Perfect, four at the lake. See you!", ok: true }, { de: "Der See ist groß.", en: "The lake is big.", ok: false, tip: "Confirm and close." }] }
          ] }
        }
      ]
    },
    {
      id: "A1-U11", title: "Health & travel", sub: "Get help, get moving",
      why: "Symptoms and train tickets — where German stops being a hobby.",
      uses: "A1-U8: town & transport · A1-U9: shopping language.",
      stages: [
        {
          id: "A1-U11-S1", title: "Body & symptoms", mission: "Say what hurts and where.",
          dialogue: [ln("Ärztin", "Was fehlt Ihnen?", "What's wrong?"), ln("Omar", "Ich habe Kopfschmerzen. Mir tut der Kopf weh.", "I have a headache. My head hurts."), ln("Ärztin", "Seit wann?", "Since when?"), ln("Omar", "Seit gestern.", "Since yesterday.")],
          notice: notice("'MIR tut der Kopf weh' — why mir?", ["dative: the pain happens TO me", "mir = my", "fixed phrase, no reason"], "dative: the pain happens TO me", "weh tun + dative: Mir tut der Kopf weh = the head hurts to me."),
          cards: [
            card("Body", "der Kopf · der Arm · der Bauch · das Bein", "head · arm · stomach · leg", "Plural: die Zähne."),
            card("Symptom 1", "Ich habe Kopfschmerzen.", "I have a headache.", "-schmerzen glues to any body part."),
            card("Symptom 2", "Mir tut der Rücken weh.", "My back hurts.", "Mir tut + der/die/das + weh."),
            card("Duration", "seit gestern · seit zwei Tagen", "since yesterday · for two days", "The doctor will ask: Seit wann?")
          ],
          banks: ["a2-v-health", "a2-s-doctor"],
          ask: [
            { engine: "recall", prompt: "Write: “My head hurts.” (weh-tun version)", answer: "Mir tut der Kopf weh", alts: ["Mir tut der Kopf weh."], why: "Mir + tut … weh." },
            { engine: "mc", kicker: "Complete", text: "Ich habe ___ . (stomach ache)", options: ["Bauchschmerzen", "Bauchweh schön", "der Bauch"], answer: "Bauchschmerzen", why: "Bauch + schmerzen." }
          ],
          check: { type: "say", prompt: "Tell the doctor your head hurts since yesterday.", target: "Ich habe seit gestern Kopfschmerzen.", model: "Ich habe seit gestern Kopfschmerzen." }
        },
        {
          id: "A1-U11-S2", title: "müssen & sollen", mission: "Understand what you must and should do.",
          dialogue: [ln("Ärztin", "Sie müssen zum Arzt — äh, Sie sind schon hier.", "You must see a doctor — oh, you're here."), ln("Omar", "Was soll ich machen?", "What should I do?"), ln("Ärztin", "Sie sollen viel Wasser trinken und schlafen.", "You should drink lots of water and sleep.")],
          notice: notice("'Sie sollen viel Wasser TRINKEN.' — the infinitive sits…", ["second", "at the end", "third"], "at the end", "Same bracket as können/wollen from U10: modal second, infinitive last."),
          cards: [
            card("müssen", "ich muss · du musst · er muss", "must", "ich/er lose the umlaut AND the -t."),
            card("sollen", "ich soll · du sollst", "should/shall", "Advice: Sie sollen schlafen."),
            card("dürfen", "Darf ich fragen?", "may I ask?", "Permission word."),
            card("Advice frame", "Sie sollten …", "You should …", "Softer B1 preview — hear it at the doctor's.")
          ],
          banks: ["a2-g-modals"],
          ask: [
            { engine: "mc", kicker: "Conjugate", text: "müssen → er", options: ["musst", "muss", "müsst"], answer: "muss", why: "er muss — no umlaut, no t." },
            { engine: "builder", chunks: ["sollen", "Sie", "viel", "Wasser", "trinken"], answer: "Sie sollen viel Wasser trinken", why: "sollen second, trinken last.", hint: "Build: You should drink a lot of water." }
          ],
          check: { type: "recall", prompt: "Write: “I must go to the doctor.”", answer: "Ich muss zum Arzt gehen", alts: ["Ich muss zum Arzt", "Ich muss zum Arzt gehen."], why: "muss second, gehen last, zum = zu dem." }
        },
        {
          id: "A1-U11-S3", title: "Tickets & stations", mission: "Buy a ticket and catch the right train.",
          dialogue: [ln("Schalter", "Bitte schön?", "How can I help?"), ln("Fatima", "Eine Fahrkarte nach Berlin, bitte.", "A ticket to Berlin, please."), ln("Schalter", "Einfach oder hin und zurück?  Abfahrt Gleis 5, 14:35 Uhr.", "One-way or return? Departure track 5, 2:35 pm."), ln("Ansage", "Der Zug nach Berlin hat zehn Minuten Verspätung.", "The Berlin train is 10 minutes late.")],
          notice: notice("'hin und zurück' means…", ["first class", "round trip", "standing only"], "round trip", "einfach = one way, hin und zurück = return."),
          cards: [
            card("The ask", "Eine Fahrkarte nach Köln, bitte.", "A ticket to Cologne, please.", "nach + city again (U8)."),
            card("Track words", "das Gleis · die Abfahrt · die Ankunft", "track · departure · arrival", "Boards say: Abfahrt/Ankunft."),
            card("Trouble", "die Verspätung · umsteigen", "delay · change trains", "Der Zug hat Verspätung — 10 Minuten Verspätung.")
          ],
          banks: ["a2-v-travel", "a2-l-station"],
          ask: [
            { engine: "listen", kicker: "What did the announcement say?", audio: "Der Zug nach Hamburg hat zwanzig Minuten Verspätung.", options: ["Train is 20 min late", "Train left already", "Train is on track 20"], answer: "Train is 20 min late", why: "Verspätung = delay." },
            { engine: "recall", prompt: "Write: “A ticket to Berlin, please.”", answer: "Eine Fahrkarte nach Berlin, bitte", alts: ["Eine Fahrkarte nach Berlin bitte"], why: "Fahrkarte + nach + city." }
          ],
          check: { type: "dialogue", title: "Am Schalter", script: [
            { who: "Schalter", de: "Guten Tag, bitte schön?", en: "Good day, how can I help?", options: [{ de: "Eine Fahrkarte nach München, bitte.", en: "A ticket to Munich, please.", ok: true }, { de: "München ist schön.", en: "Munich is beautiful.", ok: false, tip: "State your need: Eine Fahrkarte nach …" }] },
            { who: "Schalter", de: "Gern. Einfach oder hin und zurück?", en: "Sure. One-way or return?", options: [{ de: "Hin und zurück, bitte.", en: "Return, please.", ok: true }, { de: "Fünf Minuten.", en: "Five minutes.", ok: false, tip: "Choose: einfach or hin und zurück." }] },
            { who: "Schalter", de: "Umstiegsfrei um 15:20, Gleis 7. 58 Euro.", en: "Direct 15:20, track 7. 58 euros.", options: [{ de: "Perfekt. Hier, bitte — und vielen Dank!", en: "Perfect. Here you go — thanks!", ok: true }, { de: "Gleis 7 ist weit?", en: "Is track 7 far?", ok: false, tip: "You have all info — pay and thank." }] }
          ] }
        },
        {
          id: "A1-U11-S4", title: "Mission: Full journey", mission: "From symptom check to boarding — one combined scenario.",
          dialogue: [ln("System", "Zwei Situationen: Apotheke am Morgen, Bahnhof am Nachmittag.", "Two situations: pharmacy in the morning, station in the afternoon.")],
          cards: [card("Both scripts", "Ich habe … · Ich brauche etwas gegen … / Eine Fahrkarte nach … · Gleis …?", "health line + travel line", "Different topics, same confidence.")],
          check: { type: "dialogue", title: "Ein Tag unterwegs", script: [
            { who: "Apothekerin", de: "Guten Morgen! Was darf es sein?", en: "Good morning! What can I get you?", options: [{ de: "Ich habe Kopfschmerzen. Ich brauche etwas dagegen.", en: "I have a headache. I need something for it.", ok: true }, { de: "Eine Fahrkarte nach Berlin.", en: "A ticket to Berlin.", ok: false, tip: "Wrong shop! State the symptom first." }] },
            { who: "Apothekerin", de: "Diese Tabletten, zwei Mal täglich. Sonst noch etwas?", en: "These tablets, twice daily. Anything else?", options: [{ de: "Nein, danke. Das ist alles.", en: "No thanks, that's all.", ok: true }, { de: "Zwei Kaffee, bitte.", en: "Two coffees, please.", ok: false, tip: "Decline politely: Das ist alles." }] },
            { who: "Schalter", de: "Nachmittag! Wohin geht's?", en: "Afternoon! Where to?", options: [{ de: "Nach Leipzig, einfach. Wann fährt der nächste Zug?", en: "To Leipzig, one way. When's the next train?", ok: true }, { de: "Kopfschmerzen habe ich nicht mehr.", en: "I don't have a headache anymore.", ok: false, tip: "Wrong conversation — it's the ticket counter now." }] },
            { who: "Schalter", de: "16:05, Gleis 2.", en: "16:05, track 2.", options: [{ de: "Danke! Einen schönen Tag noch.", en: "Thanks! Have a nice day.", ok: true }, { de: "Gleis?", en: "Track?", ok: false, tip: "You heard it — close warmly." }] }
          ] }
        }
      ]
    },
    {
      id: "A1-U12", title: "Talking about the past", sub: "Tell yesterday's story",
      why: "The Perfekt is how Germans actually talk about the past — and you already know the parts.",
      uses: "A1-U3: haben/sein · A1-U6: time expressions.",
      stages: [
        {
          id: "A1-U12-S1", title: "Das Perfekt with haben", mission: "Form your first past sentences: Ich habe gegessen.",
          dialogue: [ln("Mia", "Was hast du gestern gemacht?", "What did you do yesterday?"), ln("Ben", "Ich habe Fußball gespielt und Pizza gegessen.", "I played football and ate pizza."), ln("Mia", "Schön! Ich habe nur gearbeitet.", "Nice! I just worked.")],
          notice: notice("The Perfekt recipe is…", ["haben/sein + participle at the end", "verb + ed", "haben twice"], "haben/sein + participle at the end", "Ich HABE gespielt — helper second, ge-form last. Default helper: haben."),
          cards: [
            card("The bracket", "Ich habe Fußball gespielt.", "I played football.", "habe … gespielt — slots 2 and last."),
            card("Regular participants", "machen → gemacht · spielen → gespielt · kaufen → gekauft", "ge + stem + t", "Ge-MACH-t: say the rhythm."),
            card("Separable friends", "einkaufen → eingekauft", "bought groceries", "ge- hides inside: EINgekauft.")
          ],
          banks: ["a2-g-perfekt"],
          ask: [
            { engine: "builder", chunks: ["habe", "Ich", "gestern", "Pizza", "gegessen"], answer: "Ich habe gestern Pizza gegessen", why: "habe slot 2, gegessen at the end.", hint: "Build: I ate pizza yesterday." },
            { engine: "recall", prompt: "machen → (ich …)", answer: "ich habe gemacht", alts: ["habe gemacht"], why: "ge + mach + t." }
          ],
          check: { type: "say", prompt: "Say two things you did yesterday.", target: "Ich habe … gemacht. Ich habe … gegessen.", model: "Ich habe gearbeitet und ich habe Pasta gekocht." }
        },
        {
          id: "A1-U12-S2", title: "gehen takes sein", mission: "Pick sein for movement and change.",
          dialogue: [ln("Tom", "Wir sind nach Berlin gefahren!", "We drove to Berlin!"), ln("Lea", "Und ich bin zu Hause geblieben.", "And I stayed at home."), ln("Tom", "Bist du auch spät aufgestanden?", "Did you get up late too?")],
          notice: notice("Why 'ich BIN gefahren' but 'ich HABE gegessen'?", ["fahren describes movement → sein", "gefahren is longer", "random"], "fahren describes movement → sein", "Movement (fahren, gehen, kommen) and change (einschlafen, sterben) take sein. Almost everything else: haben."),
          cards: [
            card("Movement = sein", "ich bin gegangen · wir sind gefahren", "I went · we drove", "gehen, fahren, kommen, laufen, fliegen."),
            card("Change = sein", "Ich bin eingeschlafen.", "I fell asleep.", "aufstehen → aufgestanden too!"),
            card("Error repair", "✗ Ich habe gefahren. → ✓ Ich bin gefahren.", "classic mistake", "Your most-corrected A2 sentence, fixed today.")
          ],
          ask: [
            { engine: "mc", kicker: "haben or sein?", text: "Ich ___ nach Hamburg gefahren.", options: ["habe", "bin"], answer: "bin", why: "Movement → sein." },
            { engine: "mc", kicker: "haben or sein?", text: "Ich ___ ein Buch gelesen.", options: ["habe", "bin"], answer: "habe", why: "No movement → haben." },
            { engine: "repair", wrong: "Ich habe nach Berlin gefahren.", options: ["Ich bin nach Berlin gefahren.", "Ich habe nach Berlin gefahrt.", "Ich bin nach Berlin gefahrt."], answer: "Ich bin nach Berlin gefahren.", why: "fahren expresses movement → sein. Participle: gefahren." }
          ],
          check: { type: "recall", prompt: "Write: “We went to the cinema yesterday.”", answer: "Wir sind gestern ins Kino gegangen", alts: ["Wir sind gestern ins Kino gegangen."], why: "gehen → sind … gegangen." }
        },
        {
          id: "A1-U12-S3", title: "Yesterday, in order", mission: "Chain past events with zuerst, dann, danach.",
          dialogue: [ln("Ben", "Gestern bin ich spät aufgestanden.", "Yesterday I got up late."), ln("Ben", "Dann habe ich schnell gefrühstückt.", "Then I had a quick breakfast."), ln("Ben", "Danach bin ich zur Arbeit gefahren.", "After that I drove to work.")],
          notice: notice("zuerst, dann, danach all sit in slot…", ["1, pushing verb to slot 2", "2", "the end"], "1, pushing verb to slot 2", "Dann HABE ich … — time connector + V2, again."),
          cards: [
            card("The chain", "zuerst · dann · danach · zum Schluss", "first · then · after that · finally", "Story glue for any narrative."),
            card("Yesterday words", "gestern · gestern Abend · letzte Woche", "yesterday · yesterday evening · last week", "Time triggers Perfekt."),
            card("Full line", "Gestern Abend sind wir ins Restaurant gegangen.", "Last night we went to a restaurant.", "Time — verb — … — participle.")
          ],
          ask: [
            { engine: "builder", chunks: ["habe", "Dann", "ich", "gefrühstückt"], answer: "Dann habe ich gefrühstückt", why: "Dann slot 1, habe slot 2, participle last.", hint: "Build: Then I had breakfast." }
          ],
          check: { type: "open", prompt: "Write yesterday in three chained sentences.", model: "Gestern bin ich um acht aufgestanden. Dann habe ich gearbeitet. Abends habe ich einen Film gesehen." }
        },
        {
          id: "A1-U12-S4", title: "Mission: The weekend story", mission: "Tell a real past story — the A1 finale.",
          dialogue: [ln("Kollegin", "Na, wie war dein Wochenende?", "So, how was your weekend?"), ln("You", "…", "your turn")],
          cards: [card("Your moves", "Wie war…? → zuerst/dann chain → Perfekt with sein & haben → verdict (Es war super!)", "the finale", "Everything in this unit, used at once.")],
          check: { type: "dialogue", title: "Monday small talk", script: [
            { who: "Kollegin", de: "Morgen! Wie war dein Wochenende?", en: "Morning! How was your weekend?", options: [{ de: "Super! Ich bin nach Hamburg gefahren.", en: "Great! I went to Hamburg.", ok: true }, { de: "Ich fahre nach Hamburg.", en: "I drive to Hamburg.", ok: false, tip: "Past: bin … gefahren." }] },
            { who: "Kollegin", de: "Oh toll! Was hast du da gemacht?", en: "Oh nice! What did you do there?", options: [{ de: "Ich habe Fisch gegessen und bin viel gelaufen.", en: "I ate fish and walked a lot.", ok: true }, { de: "Ich esse Fisch gern.", en: "I like eating fish.", ok: false, tip: "She asked about the past." }] },
            { who: "Kollegin", de: "Klingt perfekt. Wir sehen uns in der Pause!", en: "Sounds perfect. See you at break!", options: [{ de: "Bis dann!", en: "See you!", ok: true }, { de: "Das Wochenende war schön.", en: "The weekend was nice.", ok: false, tip: "Just close the chat." }] }
          ] }
        }
      ]
    },
    {
      id: "A1-U13", title: "A1 checkpoint", sub: "Prove you can do it all",
      why: "Listening, reading, writing, speaking — one integrated assessment, then A2 opens.",
      uses: "All of A1.",
      stages: [
        {
          id: "A1-U13-S1", title: "Listening assessment", mission: "Understand real-speed German: announcements, cafés, introductions.",
          dialogue: [ln("System", "Vier Hörtexte. Keine Hilfe. Du schaffst das.", "Four listenings. No help. You can do it.")],
          cards: [card("Strategy", "first: who speaks? then: what do they want? finally: numbers/times", "listen in layers", "Don't translate word by word.")],
          ask: [
            { engine: "listen", kicker: "Listening 1 — What does she order?", audio: "Guten Tag, ich möchte einen Tee mit Zitrone, bitte.", options: ["Tea with lemon", "Coffee with milk", "The bill"], answer: "Tea with lemon", why: "einen Tee mit Zitrone." },
            { engine: "listen", kicker: "Listening 2 — What time is the train?", audio: "Der Zug nach Frankfurt fährt um fünfzehn Uhr fünfundzwanzig, Gleis drei.", options: ["15:25, track 3", "15:35, track 3", "17:25, track 13"], answer: "15:25, track 3", why: "fünfundzwanzig = 25." },
            { engine: "listen", kicker: "Listening 3 — Is it formal or informal?", audio: "Hallo Papa, ich habe jetzt Feierabend. Kommst du mit?", options: ["informal (family)", "formal (office)", "a stranger"], answer: "informal (family)", why: "Papa + du = informal." },
            { engine: "listen", kicker: "Listening 4 — What does he lack?", audio: "Ich habe seit Montag starke Rückenschmerzen.", options: ["Back pain since Monday", "Headache since Monday", "No money since Monday"], answer: "Back pain since Monday", why: "Rückenschmerzen = back pain." }
          ],
          items: [
            w("Feierabend", "end of the workday", "der", "", "Um sechs ist Feierabend.", "At six the workday ends."),
            w("die Ansage", "the announcement", "die", "", "Die Ansage war sehr schnell.", "The announcement was very fast.")
          ],
          check: { type: "say", prompt: "Repeat the announcement you heard best.", target: "Der Zug … hat Verspätung.", model: "Der Zug nach Frankfurt fährt um fünfzehn Uhr fünfundzwanzig." }
        },
        {
          id: "A1-U13-S2", title: "Reading assessment", mission: "Read signs, messages and a short note.",
          dialogue: [ln("Zettel", "Bin beim Bäcker. Zurück um zehn. — Lena", "At the bakery. Back at ten.")],
          cards: [card("Skim & scan", "Zweck zuerst: will der Text informieren, verkaufen, einladen?", "purpose first", "Then hunt the details.")],
          ask: [
            { engine: "reading", text: "Lieber Max, ich komme heute später, der Zug hatte Verspätung. Wir treffen uns um 19 Uhr im Café Stern. Bis gleich! — Jona", kicker: "Read the message. Why is Jona late?", options: ["His train was delayed", "He is sick", "He forgot the time"], answer: "His train was delayed", why: "der Zug hatte Verspätung." },
            { engine: "reading", text: "WANN treffen sie sich?", kicker: "Same message — when do they meet?", options: ["19 Uhr", "zehn Uhr", "Montag"], answer: "19 Uhr", why: "um 19 Uhr im Café Stern." },
            { engine: "reading", text: "Öffnungszeiten: Mo–Fr 9–18 Uhr · Sa 9–14 Uhr · So geschlossen", kicker: "The shop on Sunday?", options: ["closed", "open 9–14", "open 9–18"], answer: "closed", why: "So geschlossen." }
          ],
          check: { type: "mc", prompt: "A door says 'Bitte ziehen'.", text: "You should:", options: ["pull", "push", "knock"], answer: "pull", why: "ziehen = pull. drücken = push.", immediate: true }
        },
        {
          id: "A1-U13-S3", title: "Writing assessment", mission: "Fill a form and write a short message.",
          dialogue: [ln("Formular", "Name · Vorname · Adresse · Telefon", "Last name · first name · address · phone")],
          cards: [card("Form words", "der Name · der Vorname · die Adresse · das Datum", "the four fields", "Vorname comes first in German forms.")],
          banks: ["a1-w-form", "a1-w-three"],
          ask: [
            { engine: "recall", prompt: "Write: “My e-mail is ana@mail.de” (spell it German-style: ana-klammeraffe …)", answer: "Meine E-Mail ist ana@mail.de", alts: ["Meine E-Mail ist ana at mail punkt de"], why: "Meine E-Mail ist …", loose: true },
            { engine: "open", prompt: "Write a message: you'll be 15 minutes late (train!).", model: "Hallo Lea, ich komme 15 Minuten später. Der Zug hatte Verspätung. Bis gleich! — Sam" }
          ],
          check: { type: "open", prompt: "Fill the form: your full name, city, one sentence why you learn German.", model: "Sam Sharma · Bengaluru · Ich lerne Deutsch, weil ich in Hamburg studieren will." }
        },
        {
          id: "A1-U13-S4", title: "A1 scenario", mission: "One long live scenario: arrive, introduce, order, plan. Breathe.",
          dialogue: [ln("System", "Dein erster Tag in Hamburg. Vier Stationen, ein Gespräch.", "Your first day in Hamburg.")],
          cards: [card("Not a test", "Es zählt Mut, nicht Perfektion. Fehler sind erlaubt.", "courage over perfection", "Du wiederholst jede Station, bis sie sitzt.")],
          check: { type: "dialogue", title: "Tag eins in Hamburg", script: [
            { who: "Nachbarin", de: "Hallo, Sie sind neu hier, oder? Ich bin Frau Berger.", en: "Hello, you're new here, right? I'm Mrs. Berger.", options: [{ de: "Guten Tag, Frau Berger. Ich heiße Sam. Ich komme aus Indien.", en: "Good day. I'm Sam, from India.", ok: true }, { de: "Ja, tschüss.", en: "Yes, bye.", ok: false, tip: "Introduce yourself fully." }] },
            { who: "Kellner", de: "Was bekommen Sie?", en: "What'll it be?", options: [{ de: "Ich möchte einen Kaffee und ein Brot, bitte.", en: "A coffee and a bread, please.", ok: true }, { de: "Ich bin neu hier.", en: "I'm new here.", ok: false, tip: "This is the café scene — order." }] },
            { who: "Passant", de: ("Entschuldigung — wo geht's hier zum Hafen?"), en: "Excuse me — which way to the harbor?", options: [{ de: "Tut mir leid, ich bin auch neu. Aber ich glaube: geradeaus, dann links.", en: "Sorry, I'm new too. But I think: straight, then left.", ok: true }, { de: "Kein Deutsch!", en: "No German!", ok: false, tip: "You know 'geradeaus, dann links' — offer it kindly." }] },
            { who: "Frau Berger", de: "Schön, Sie kennenzulernen! Wollen Sie Samstag mit uns grillen?", en: "Nice to meet you! Want to grill with us Saturday?", options: [{ de: "Sehr gern! Um wie viel Uhr?", en: "Gladly! At what time?", ok: true }, { de: "Vielleicht.", en: "Maybe.", ok: false, tip: "Accept warmly and ask the time." }] }
          ] }
        }
      ]
    }
  ];

  /* ============ A2 (uses A1 tools, unlocked at 80%) ============ */
  const A2 = [
    {
      id: "A2-U1", title: "Routines, deeper", sub: "Reflexives & frequency",
      why: "You can narrate a day (A1-U6); now add sich freuen, immer/oft/nie and real schedule talk.",
      uses: "A1-U6 separable verbs · A1-U3 word order.",
      stages: [
        {
          id: "A2-U1-S1", title: "Reflexiva", mission: "Say what you enjoy, remember, and hurry for.",
          dialogue: [ln("Mia", "Ich freue mich auf das Wochenende.", "I'm looking forward to the weekend."), ln("Ben", "Und ich freue mich über deine Nachricht!", "And I'm happy about your message!"), ln("Mia", "Jetzt beeilen wir uns aber!", "Now let's hurry!")],
          notice: notice("'Ich freue MICH' — mich is…", ["a reflexive pronoun (accusative)", "a typo for 'ich'", "dative"], "a reflexive pronoun (accusative)", "The action comes back to me: ich — mich, du — dich, er — sich."),
          cards: [
            card("Reflexive set", "ich mich · du dich · er/sie sich · wir uns", "myself, yourself…", "sich for er, sie, es, Sie."),
            card("Freuen auf/über", "Ich freue mich auf den Urlaub.", "looking forward to (future) / about (now)", "auf = future, über = now."),
            card("Daily reflexives", "sich beeilen · sich erinnern an · sich freuen", "hurry · remember · be glad", "sich interessieren für — into B1.")
          ],
          ask: [
            { engine: "mc", kicker: "Complete", text: "Wir freuen ___ auf die Party.", options: ["uns", "euch", "sich"], answer: "uns", why: "wir ↔ uns." },
            { engine: "recall", prompt: "Write: “Hurry up!” (informal, du)", answer: "Beeil dich!", alts: ["Beeil dich"], why: "du ↔ dich; imperative drops -st." }
          ],
          banks: ["a2-v-routine"],
          check: { type: "say", prompt: "Say you're looking forward to the weekend.", target: "Ich freue mich auf das Wochenende.", model: "Ich freue mich auf das Wochenende." }
        },
        {
          id: "A2-U1-S2", title: "immer, oft, nie", mission: "Grade your habits from always to never.",
          dialogue: [ln("Tom", "Sport machst du nie!", "You never do sport!"), ln("Lea", "Doch! Ich gehe manchmal laufen.", "I do! I sometimes go running."), ln("Tom", "Und ich schwimme fast immer.", "And I swim almost always.")],
          notice: notice("Where does 'manchmal' sit?", ["slot 1 or mid, never between verb and subject", "always last", "slot 2"], "slot 1 or mid, never between verb and subject", "Frequency words float after the verb: Ich gehe manchmal laufen."),
          cards: [
            card("The scale", "immer · fast immer · oft · manchmal · selten · nie", "always → never", "100 → 0 percent, six steps."),
            card("Position", "Ich koche oft Pasta.", "I often cook pasta.", "After the verb, before the object usually."),
            card("Fronted", "Manchmal stehe ich früh auf.", "Sometimes I get up early.", "Slot 1, V2 intact — A1-U6 again.")
          ],
          check: { type: "open", prompt: "Write one sentence with 'selten' about your habits.", model: "Ich esse selten Fastfood." }
        }
      ]
    },
    {
      id: "A2-U2", title: "Shopping, deeper", sub: "Compare, complain, return",
      why: "A1-U9 got you buying; now compare products and take one back.",
      uses: "A1-U9 dieser/endings · A1-U5 prices.",
      stages: [
        {
          id: "A2-U2-S1", title: "Comparatives", mission: "Compare: billiger, teurer, besser.",
          dialogue: [ln("Mia", "Der rote Pullover ist schöner, aber teurer.", "The red sweater is nicer but more expensive."), ln("Ben", "Nimm den blauen — der ist fast so schön und viel billiger.", "Take the blue — almost as nice and much cheaper."), ln("Mia", "Du hast recht. Der beste Preis gewinnt.", "You're right. Best price wins.")],
          notice: notice("'besser' breaks the pattern because…", ["it's irregular like good→better", "it's plural", "it's Swiss"], "it's irregular like good→better", "gut → besser → am besten. Most others: adjective + -er."),
          cards: [
            card("Form", "billig → billiger · schön → schöner", "add -er", "als for the comparison: teurer als der andere."),
            card("Umlaut alert", "groß → größer · alt → älter", "a/o/u often get umlauts", "klein stays klein — kleiner."),
            card("Superlative", "am billigsten", "the cheapest", "am + stem + -sten.")
          ],
          banks: ["a2-g-comparatives"],
          ask: [
            { engine: "mc", kicker: "Complete", text: "Der Zug ist ___ als der Bus. (fast)", options: ["schneller", "schnellster", "mehr schnell"], answer: "schneller", why: "schnell + -er." },
            { engine: "recall", prompt: "Write: “better than mine”", answer: "besser als meiner", alts: ["besser als meins", "besser als meine"], why: "gut→besser + als." }
          ],
          check: { type: "say", prompt: "Compare two products out loud.", target: "Der … ist billiger, aber der … ist besser.", model: "Dieser Laptop ist billiger, aber der andere ist besser." }
        },
        {
          id: "A2-U2-S2", title: "Returns", mission: "Return a broken item and get a refund.",
          dialogue: [ln("Fatima", "Ich möchte diese Kopfhörer zurückgeben.", "I'd like to return these headphones."), ln("Verkäufer", "Gibt es ein Problem?", "Is there a problem?"), ln("Fatima", "Ja, die linke Seite funktioniert nicht. Hier ist der Kassenbon.", "Yes, the left side doesn't work. Here's the receipt.")],
          notice: notice("For a return you MUST bring…", ["your passport", "den Kassenbon (receipt)", "the original box"], "den Kassenbon (receipt)", "Receipt = Kassenbon/Bon/Quittung — no return without it."),
          cards: [
            card("Opening", "Ich möchte das zurückgeben.", "I'd like to return this.", "Alternative: umtauschen = exchange."),
            card("Defects", "… funktioniert nicht · ist kaputt · hat einen Fehler", "doesn't work · broken · has a flaw", "One sentence is enough."),
            card("The paper", "Hier ist der Kassenbon.", "Here's the receipt.", "Quittung in small shops.")
          ],
          check: { type: "dialogue", title: "Die Rückgabe", script: [
            { who: "Verkäuferin", de: "Kann ich Ihnen helfen?", en: "Can I help you?", options: [{ de: "Ja, ich möchte diese Lampe zurückgeben.", en: "Yes, I'd like to return this lamp.", ok: true }, { de: "Ich suche eine Lampe.", en: "I'm looking for a lamp.", ok: false, tip: "Opposite task — you're returning, not buying." }] },
            { who: "Verkäuferin", de: "Oh. Und was ist das Problem?", en: "Oh. What's the problem?", options: [{ de: "Sie funktioniert nicht. Hier ist der Bon.", en: "It doesn't work. Here's the receipt.", ok: true }, { de: "Sie ist schön.", en: "It's beautiful.", ok: false, tip: "Name the defect + show the receipt." }] }
          ] }
        }
      ]
    },
    {
      id: "A2-U3", title: "Because, so clauses begin", sub: "weil, denn, deshalb",
      why: "A1 said WHAT; A2 starts saying WHY — your sentences get a second floor.",
      uses: "A1-U6 V2 · A1-U10 modals.",
      stages: [
        {
          id: "A2-U3-S1", title: "weil & denn", mission: "Give reasons with the verb-tucked because.",
          dialogue: [ln("Ben", "Warum lernst du Deutsch?", "Why are you learning German?"), ln("Omar", "Weil ich in München studieren will.", "Because I want to study in Munich."), ln("Ben", "Logisch. Ich bleibe hier, denn meine Familie ist hier.", "Logical. I'm staying here, because my family is here.")],
          notice: notice("'Weil ich in München studieren WILL.' — the verb went…", ["to the very end", "second as always", "missing"], "to the very end", "weil kicks the verb to the end: weil ich WILL. denn keeps V2: denn ich will."),
          cards: [
            card("weil = kicker", "Weil ich müde bin, gehe ich früh.", "Because I'm tired…", "verb at the absolute end."),
            card("denn = polite V2", "…, denn ich bin müde.", "…, for I'm tired.", "No kick. Written, careful style."),
            card("deshalb restart", "Ich bin müde, deshalb gehe ich früh.", "…therefore…", "New V2 sentence after deshalb.")
          ],
          banks: ["a2-g-weil"],
          ask: [
            { engine: "builder", chunks: ["will", "Weil", "ich", "in", "München", "studieren"], answer: "Weil ich in München studieren will", why: "weil sends will to the end.", hint: "Start with Weil." },
            { engine: "repair", wrong: "Weil ich will in München studieren.", options: ["Weil ich in München studieren will.", "Weil will ich in München studieren.", "Weil ich studieren will in München."], answer: "Weil ich in München studieren will.", why: "Inside a weil-clause the verb waits at the end." }
          ],
          check: { type: "open", prompt: "Why are you learning German? Answer with weil.", model: "Ich lerne Deutsch, weil ich in Deutschland arbeiten will." }
        },
        {
          id: "A2-U3-S2", title: "Perfekt, fluent", mission: "Tell longer past stories with correct helpers.",
          dialogue: [ln("Lea", "Was habt ihr im Urlaub gemacht?", "What did you do on vacation?"), ln("Tom", "Wir sind nach Italien gefahren, haben viel gegessen und sind jeden Tag geschwommen.", "We drove to Italy, ate a lot, swam every day.")],
          notice: notice("'haben gegessen' but 'sind geschwommen' because…", ["essen=haben, schwimmen=movement→sein", "random", "mixed is fine"], "essen=haben, schwimmen=movement→sein", "A1-U12's rule scales to longer chains."),
          cards: [card("Chain rhythm", "haben gegessen · sind gefahren · haben geschlafen", "helper … participle", "Keep pairs tight, listeners track them.")],
          banks: ["a2-g-perfekt"],
          check: { type: "open", prompt: "Describe your last trip in 2–3 sentences.", model: "Wir sind ans Meer gefahren. Wir haben viel gegessen und sind viel geschwommen." }
        }
      ]
    },
    {
      id: "A2-U4", title: "Travel problems", sub: "Lost luggage, late trains",
      why: "A1-U11 got you a ticket; A2 gets you out of trouble.",
      uses: "A1-U11 stations · A2-U3 weil for complaints.",
      stages: [
        {
          id: "A2-U4-S1", title: "Something is missing", mission: "Report lost luggage and delays clearly.",
          dialogue: [ln("Omar", "Entschuldigung, mein Koffer ist nicht da.", "Excuse me, my suitcase isn't here."), ln("Mitarbeiterin", "Wie sieht er aus? Wann sind Sie gelandet?", "What does it look like? When did you land?"), ln("Omar", "Schwarz, mittelgroß. Um 14 Uhr.", "Black, medium. At 2 pm.")],
          notice: notice("The two key details for lost luggage:", ["color + size · arrival time", "brand + price", "weight + lock code"], "color + size · arrival time", "Describe: schwarz, mittelgroß — dann Flugdetails."),
          cards: [
            card("Report", "Mein Koffer ist weg. / Ich habe mein Gepäck verloren.", "My suitcase is gone / lost my luggage.", "Fundbüro = lost & found."),
            card("Describe", "schwarz, mittelgroß, mit einem Streifen", "black, medium, with a stripe", "Colors from A1-U9 return."),
            card("Delay", "Der Zug hatte 40 Minuten Verspätung.", "The train was 40 min late.", "Perfekt of haben — A2-U3.")
          ],
          banks: ["a2-v-travel"],
          check: { type: "say", prompt: "Report your lost black suitcase.", target: "Entschuldigung, mein schwarzer Koffer ist weg.", model: "Entschuldigung, mein schwarzer Koffer ist weg." }
        }
      ]
    },
    {
      id: "A2-U5", title: "Messages & appointments", sub: "Write like a person",
      why: "A1-U13 filled forms; A2 writes real messages to real people.",
      uses: "A1-U13 writing · A2-U3 weil for excuses.",
      stages: [
        {
          id: "A2-U5-S1", title: "The appointment e-mail", mission: "Cancel and reschedule politely in writing.",
          dialogue: [ln("E-Mail", "Sehr geehrte Frau Klein, leider kann ich unseren Termin am Dienstag nicht wahrnehmen, weil ich krank bin. Könnten wir ihn auf nächste Woche verschieben? Viele Grüße, Sam", "Dear Ms. Klein, unfortunately I can't make Tuesday's appointment because I'm sick. Could we move it to next week? Best, Sam")],
          notice: notice("'einen Termin wahrnehmen' means…", ["cancel an appointment", "attend an appointment", "book an appointment"], "attend an appointment", "Formal: Termin wahrnehmen = attend. absagen = cancel, verschieben = postpone."),
          cards: [
            card("Open", "Sehr geehrte/r … / Hallo … / Liebe/r …", "formal / neutral / warm", "Match your reader."),
            card("The excuse", "…, weil ich krank bin.", "… because I'm sick.", "weil-clause = verb end (A2-U3)."),
            card("The fix", "Könnten wir … verschieben?", "Could we move …?", "Könnten = soft B1-modal preview."),
            card("Close", "Viele Grüße / Mit freundlichen Grüßen", "Best / Kind regards", "VG only with people you know well.")
          ],
          banks: ["a2-r-email", "a2-w-message"],
          check: { type: "open", prompt: "Write the cancel-and-move e-mail in your words.", model: "Hallo Frau Klein, leider kann ich am Montag nicht kommen, weil ich krank bin. Geht es am Mittwoch? Viele Grüße, Sam" }
        }
      ]
    }
  ];

  /* ============ B1+ shells (content grows; structure ready) ============ */
  const B1 = [
    {
      id: "B1-U1", title: "Opinions & arguments", sub: "Say what you think — and why",
      why: "A2 gave you weil; B1 gives you dass, obwohl, damit for real argumentation.",
      uses: "A2-U3 weil · A2-U2 comparatives.",
      stages: [
        {
          id: "B1-U1-S1", title: "dass & obwohl", mission: "Build subordinate clauses that hold an opinion.",
          dialogue: [ln("Mia", "Ich finde, dass Homeoffice effizienter ist.", "I think home office is more efficient."), ln("Ben", "Obwohl ich das Büro vermisse, stimme ich zu.", "Although I miss the office, I agree.")],
          notice: notice("'…, dass Homeoffice effizienter IST.' — the verb…", ["end, like weil", "second", "first"], "end, like weil", "dass, obwohl, wenn, damit all kick the verb to the end — same family as weil."),
          cards: [
            card("dass", "Ich denke, dass du recht hast.", "I think that you're right.", "The opinion toolbox."),
            card("obwohl", "Obwohl es teuer ist, kaufe ich es.", "Although it's expensive…", "Concession first, then the point."),
            card("damit", "Ich lerne Deutsch, damit ich hier studieren kann.", "so that…", "Purpose with modal inside.")
          ],
          banks: ["b1-v-opinions", "b1-g-clauses"],
          ask: [
            { engine: "builder", chunks: ["hast", "Ich", "denke,", "dass", "du", "recht"], answer: "Ich denke, dass du recht hast", why: "dass-clause: hast at the end.", hint: "Build: I think that you're right." },
            { engine: "repair", wrong: "Ich denke, dass du hast recht.", options: ["Ich denke, dass du recht hast.", "Ich denke, dass hast du recht.", "Ich denke, du dass recht hast."], answer: "Ich denke, dass du recht hast.", why: "The subordinate verb must travel to the end." }
          ],
          check: { type: "open", prompt: "Give one opinion with dass.", model: "Ich finde, dass Deutsch Spaß macht." }
        }
      ]
    },
    {
      id: "B1-U2", title: "Work & applications", sub: "Bewerbung to Kündigung",
      why: "The vocabulary of German working life.",
      uses: "A2-U5 formal writing.",
      stages: [
        {
          id: "B1-U2-S1", title: "Office words", mission: "Survive your first week of German small talk at work.",
          dialogue: [ln("Kollege", "Die Besprechung ist um zehn, vergiss das nicht.", "The meeting is at ten, don't forget."), ln("Du", "Kein Problem, ich habe die Präsentation fast fertig.", "No problem, the presentation is almost done.")],
          cards: [
            card("The set", "die Bewerbung · das Vorstellungsgespräch · die Besprechung · der Kollege", "application · interview · meeting · colleague", "Compound check: Vor-stellungs-gespräch - imagine a selling talk."),
            card("Verbs", "sich bewerben um · kündigen · einstellen", "apply for · quit/fire · hire", "Reflexive: bewerben + sich.")
          ],
          banks: ["b1-v-work"],
          check: { type: "say", prompt: "Say you have a job interview tomorrow.", target: "Ich habe morgen ein Vorstellungsgespräch.", model: "Ich habe morgen ein Vorstellungsgespräch." }
        }
      ]
    },
    {
      id: "B1-U3", title: "Politeness & hypotheticals", sub: "Konjunktiv II",
      why: "ich hätte gern, könnten Sie — the soft German that opens doors.",
      uses: "A1-U5 möchten · A1-U10 modals.",
      stages: [
        {
          id: "B1-U3-S1", title: "Hätte, würde, könnte", mission: "Ask for the impossible politely.",
          dialogue: [ln("Du", "Ich hätte gern einen Termin für morgen.", "I'd like an appointment for tomorrow."), ln("Ärztin", "Wenn wir Zeit hätten, gern — aber morgen ist voll.", "If we had time, gladly — but tomorrow is full.")],
          notice: notice("'hätten' is…", ["past of haben reshaped for politeness", "a verb for hotels", "slang"], "past of haben reshaped for politeness", "K2: pretend it's hypothetical → everyone stays friendly."),
          cards: [
            card("ich hätte gern", "Ich hätte gern die Karte.", "I'd like the menu.", "Upgrade of ich möchte."),
            card("würde", "Ich würde gern nach Berlin ziehen.", "I would gladly move to Berlin.", "würde + infinitive."),
            card("könnten Sie …?", "Könnten Sie das Fenster öffnen?", "Could you open the window?", "Service German's master key.")
          ],
          banks: ["b1-g-k2"],
          check: { type: "open", prompt: "Ask a stranger to open the window, politely.", model: "Könnten Sie bitte das Fenster öffnen?" }
        }
      ]
    }
  ];
  const HIGH = (level, units) => units;
  const B2 = HIGH("B2", [
    { id: "B2-U1", title: "Structured argument", sub: "Reports, sources, nuance", why: "B1 opinions become B2 positions with evidence.", uses: "B1-U1 clauses · B1-U3 K2.", stages: [
      { id: "B2-U1-S1", title: "Passive & impersonal", mission: "Report events without naming an actor.", dialogue: [ln("Text", "Es wird behauptet, die Maßnahme sei zu teuer.", "It is claimed the measure is too expensive.")], cards: [card("Passive", "Der Fehler wurde gemacht.", "The mistake was made.", "wurden + participle.")], banks: ["b2-g-passiveplus", "b2-v-abstract"], check: { type: "open", prompt: "Turn: 'Man hat das Haus gebaut' into passive.", model: "Das Haus wurde gebaut." } }
    ] }
  ]);
  const C1 = HIGH("C1", [
    { id: "C1-U1", title: "Register & precision", sub: "Same idea, three altitudes", why: "Formal connectives aufgrund/hinsichtlich replace everyday weil.", uses: "B2 impersonal style.", stages: [
      { id: "C1-U1-S1", title: "Formal connectives", mission: "Write one sentence a professor would quote.", dialogue: [ln("Essay", "Aufgrund steigender Kosten wird das Projekt verschoben.", "Due to rising costs the project is postponed.")], cards: [card("Connectives", "aufgrund · hinsichtlich · infolge", "due to · regarding · as a result", "Noun-style, genitive flavor.")], banks: ["c1-g-style", "c1-v-nuance"], check: { type: "open", prompt: "Rewrite with aufgrund: 'Wegen der Kosten stoppen wir.'", model: "Aufgrund der Kosten stoppen wir." } }
    ] }
  ]);
  const C2 = HIGH("C2", [
    { id: "C2-U1", title: "Idiom & tact", sub: "What natives reach for", why: "Final polish: Fingerspitzengefühl.", uses: "Everything below.", stages: [
      { id: "C2-U1-S1", title: "Idioms that land", mission: "Drop one idiom correctly in conversation.", dialogue: [ln("Chef", "Damit triffst du den Nagel auf den Kopf.", "With that you hit the nail on the head.")], cards: [card("The idiom", "den Nagel auf den Kopf treffen", "nail it (literally)", "Use for exact observations.")], banks: ["c2-v-idiom", "c2-g-register"], check: { type: "open", prompt: "Compliment a precise analysis with the nail idiom.", model: "Damit triffst du den Nagel auf den Kopf." } }
    ] }
  ]);

  const LEVEL_UNITS = { A1, A2, B1, B2, C1, C2 };

  /* index everything */
  const units = [], stages = [];
  for (const lv of LEVELS) {
    for (const u of (LEVEL_UNITS[lv.code] || [])) {
      u.level = lv.code;
      units.push(u);
      u.stages.forEach((s, i) => { s.unitId = u.id; s.level = lv.code; s.index = i; stages.push(s); });
    }
  }
  const byUnit = (id) => units.find(u => u.id === id);
  const byStage = (id) => stages.find(s => s.id === id);
  function unitItems(u) { return u.stages.flatMap(s => stageItems(s)); }
  function stageItems(s) {
    const out = [];
    for (const b of (s.banks || [])) out.push(...B(b));
    out.push(...(s.items || []));
    const seen = new Set();
    return out.filter(it => it && it.de && !seen.has(it.de) && seen.add(it.de));
  }
  function allItems() {
    const out = [];
    for (const s of stages) for (const it of stageItems(s)) out.push({ ...it, stageId: s.id, level: s.level });
    return out;
  }
  function stageQuestion(s) {
    // authored questions first
    return [...(s.ask || [])];
  }
  return { LEVELS, units, stages, byUnit, byStage, levelUnits: (c) => LEVEL_UNITS[c] || [], stageItems, unitItems, allItems, stageQuestion };
})();
