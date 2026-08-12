# Third-Party Notices

GermanMaster bundles the following third-party data:

## Offline bulk dictionary (`web/js/dictbulk.js`)
- **Apertium eng–deu bilingual dictionary** (`apertium-eng-deu.eng-deu.dix`),
  from https://github.com/apertium/apertium-eng-deu — licensed under the
  **GNU General Public License v3**. Used as the source of DE–EN glosses,
  parts of speech, and noun genders; filtered, frequency-ranked and
  re-encoded for offline use.
- **FrequencyWords German & English top-50k lists** by Hermit Dave
  (https://github.com/hermitdave/FrequencyWords, derived from OpenSubtitles;
  Creative Commons Attribution licence). Used to rank which lemmas ship in the
  offline dictionary and to pick the most natural English gloss among synonyms.

The hand-curated core dictionary (`web/js/dictdata.js`, ~480 entries with
example sentences) is original to this project.

Online lookups additionally query (only while the device is online):
Google's free translate endpoint, MyMemory (mymemory.translated.net),
Tatoeba (tatoeba.org, CC-BY content) and Pollinations (text.pollinations.ai).
