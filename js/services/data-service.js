// ============================================================
// DATA SERVICE — Miftah
// Single access layer for all static data.
// No page or service file ever touches SURAH_67, TAFSIR_67,
// MORPHOLOGY_67, or LENS_DATA_67 directly. All access goes here.
//
// Depends on: surah-67.js, tafsir-67.js, morphology-67.js, lens-67.js
// (loaded before this file in index.html — globals are available)
// ============================================================

// ── Surah Registry ────────────────────────────────────────
// One entry per surah. Each entry holds:
//   - data:  references to the four global constants (set at runtime below)
//   - meta:  surah-level facts that never change
//   - strings: display text in all three languages [en, ur, hi]
//
// To add a new surah:
//   1. Drop its 4 data files into /js/data/
//   2. Add 4 <script> tags to index.html (before data-service.js)
//   3. Add one entry here
//   Nothing else changes.

const SURAH_REGISTRY = {

  67: {
    data: {
      // Populated at runtime by _initRegistry() below.
      // Globals: SURAH_67, TAFSIR_67, MORPHOLOGY_67, LENS_DATA_67
      surah:      null,
      tafsir:     null,
      morphology: null,
      lens:       null,
    },
    meta: {
      number:       67,
      ayahCount:    30,
      hasBismillah: true,
      revelation:   'Makkan',   // 'Makkan' | 'Madinan'
    },
    strings: {
      // [en, ur, hi]
      name:         ['Surah Al-Mulk',    'سورۃ الملک',   'सूरह अल-मुल्क'],
      nameArabic:   'سُورَةُ الْمُلْكِ',
      subtitle:     ['The Sovereignty',  'بادشاہی',      'बादशाही'],
      revelation:   ['Makkan',           'مکی',           'मक्की'],
      intro: [
        'Known as Al-Munjiyah (The Rescuer), this surah protects its reader from the punishment of the grave. The Prophet ﷺ would not sleep until he recited it. Begin your study journey by selecting any ayah below.',
        'اسے المنجیہ (نجات دینے والی) بھی کہتے ہیں۔ یہ سورۃ قبر کے عذاب سے بچاتی ہے۔ نبی ﷺ اسے پڑھے بغیر نہیں سوتے تھے۔ نیچے کوئی بھی آیت چن کر مطالعہ شروع کریں۔',
        'इसे अल-मुंजियह (नजात देने वाली) भी कहते हैं। यह सूरह क़ब्र के अज़ाब से बचाती है। नबी ﷺ इसे पढ़े बिना नहीं सोते थे। नीचे कोई भी आयत चुन कर मुताला शुरू करें।'
      ],
      heartFilterTitle: [
        'Heart Filter · Surah Al-Mulk',
        'دل کی نیت · سورۃ الملک',
        'दिल की नीयत · सूरह अल-मुल्क'
      ],
      heartFilterBody: [
        'You are about to open Surah Al-Mulk for deep study. Before the first ayah, pause for a moment. What do you bring with you? What do you hope to find?',
        'آپ سورۃ الملک کا گہرا مطالعہ شروع کرنے والے ہیں۔ پہلی آیت سے پہلے ایک لمحہ رکیں۔ آپ کیا لے کر آئے ہیں؟ کیا پانا چاہتے ہیں؟',
        'आप सूरह अल-मुल्क का गहरा मुताला शुरू करने वाले हैं। पहली आयत से पहले एक लम्हा रुकें। आप क्या लेकर आए हैं? क्या पाना चाहते हैं?'
      ],
      journeyBegins: [
        'Your journey through Surah Al-Mulk begins.',
        'سورۃ الملک کا آپ کا سفر شروع ہو رہا ہے۔',
        'सूरह अल-मुल्क का आपका सफ़र शुरू हो रहा है।'
      ],
      vocabSubtitle: [
        'Words saved from your study of Surah Al-Mulk',
        'سورۃ الملک کے مطالعے سے محفوظ کیے گئے الفاظ',
        'सूरह अल-मुल्क के मुताले से महफ़ूज़ किए गए अल्फ़ाज़'
      ],
    },
  },

  // ── Add future surahs here ─────────────────────────────
  // 18: { data: { surah: null, ... }, meta: { ... }, strings: { ... } },

  1: {
    data: {
      surah:      null,
      tafsir:     null,
      morphology: null,
      lens:       null,
    },
    meta: {
      number:       1,
      ayahCount:    7,
      hasBismillah: false,  // Al-Fatiha's Bismillah is Ayah 1 itself, not a prefix
      revelation:   'Makkan',
    },
    strings: {
      name:       ['Surah Al-Fatiha',   'سورۃ الفاتحہ',  'सूरह अल-फ़ातिहा'],
      nameArabic: 'سُورَةُ الْفَاتِحَةِ',
      subtitle:   ['The Opening',       'افتتاح',         'खुलासा'],
      revelation: ['Makkan',            'مکی',            'मक्की'],
      intro: [
        'Known as Umm al-Kitab — the Mother of the Book. Recited in every unit of every prayer. The Prophet ﷺ said: "There is no prayer for one who does not recite it." Begin your study by selecting any ayah below.',
        'اسے امّ الکتاب کہا جاتا ہے — کتاب کی ماں۔ ہر نماز کی ہر رکعت میں پڑھی جاتی ہے۔ نبی ﷺ نے فرمایا: "جو اسے نہ پڑھے اس کی نماز نہیں۔" نیچے کوئی آیت چن کر مطالعہ شروع کریں۔',
        'इसे उम्म अल-किताब कहा जाता है — किताब की माँ। हर नमाज़ की हर रक्अत में पढ़ी जाती है। नबी ﷺ ने फ़रमाया: "जो इसे न पढ़े उसकी नमाज़ नहीं।" नीचे कोई आयत चुन कर मुताला शुरू करें।'
      ],
      heartFilterTitle: [
        'Heart Filter · Surah Al-Fatiha',
        'دل کی نیت · سورۃ الفاتحہ',
        'दिल की नीयत · सूरह अल-फ़ातिहा'
      ],
      heartFilterBody: [
        'You are about to open Surah Al-Fatiha — the prayer you have recited thousands of times. Before the first ayah, pause. What do you hope to discover in words so familiar?',
        'آپ سورۃ الفاتحہ کھولنے والے ہیں — وہ دعا جو آپ نے ہزاروں بار پڑھی ہے۔ پہلی آیت سے پہلے رکیں۔ اتنے مانوس الفاظ میں آپ کیا نیا دریافت کرنا چاہتے ہیں؟',
        'आप सूरह अल-फ़ातिहा खोलने वाले हैं — वह दुआ जो आपने हज़ारों बार पढ़ी है। पहली आयत से पहले रुकें। इतने जाने-पहचाने अल्फ़ाज़ में आप क्या नया दरयाफ़्त करना चाहते हैं?'
      ],
      journeyBegins: [
        'Your journey through Surah Al-Fatiha begins.',
        'سورۃ الفاتحہ کا آپ کا سفر شروع ہو رہا ہے۔',
        'सूरह अल-फ़ातिहा का आपका सफ़र शुरू हो रहा है।'
      ],
      vocabSubtitle: [
        'Words saved from your study of Surah Al-Fatiha',
        'سورۃ الفاتحہ کے مطالعے سے محفوظ کیے گئے الفاظ',
        'सूरह अल-फ़ातिहा के मुताले से महफ़ूज़ किए गए अल्फ़ाज़'
      ],
    },
  },

};

// Populates data references from globals after scripts have loaded.
// Called once by DataService.init() on DOMContentLoaded.
function _initRegistry() {
  /* eslint-disable no-undef */
  if (typeof SURAH_1      !== 'undefined') SURAH_REGISTRY[1].data.surah      = SURAH_1;
  if (typeof TAFSIR_1     !== 'undefined') SURAH_REGISTRY[1].data.tafsir     = TAFSIR_1;
  if (typeof MORPHOLOGY_1 !== 'undefined') SURAH_REGISTRY[1].data.morphology = MORPHOLOGY_1;
  if (typeof LENS_1       !== 'undefined') SURAH_REGISTRY[1].data.lens       = LENS_1;

  if (typeof SURAH_67      !== 'undefined') SURAH_REGISTRY[67].data.surah      = SURAH_67;
  if (typeof TAFSIR_67     !== 'undefined') SURAH_REGISTRY[67].data.tafsir     = TAFSIR_67;
  if (typeof MORPHOLOGY_67 !== 'undefined') SURAH_REGISTRY[67].data.morphology = MORPHOLOGY_67;
  if (typeof LENS_DATA_67  !== 'undefined') SURAH_REGISTRY[67].data.lens       = LENS_DATA_67;
  /* eslint-enable no-undef */
}

const DataService = {

  // Called once on DOMContentLoaded (by app.js).
  // Wires global constants into the registry.
  init() {
    _initRegistry();
  },

  // ── Arabic display sanitiser ─────────────────────────────
  // Strips Uthmanic-specific combining marks that browsers orphan as
  // dotted circles when the shaping engine can't attach them to a base.
  // These marks are printing conventions from the physical Mushaf —
  // they carry no meaning needed for study and are absent from most
  // digital Quran platforms (Quran.com, Tanzil etc.).
  //
  // Stripped:
  //   U+06DF  ۟  Small High Rounded Zero   (suppressed alif marker)
  //   U+06E0  ۠  Small High Rect Zero       (variant suppressed alif)
  //   U+06E2  ۢ  Small High Meem            (isolated Meem annotation)
  //   U+06ED  ۭ  Small Low Meem             (isolated Meem annotation)
  //
  // Kept (rendered correctly by KFGQPC):
  //   U+0670  ٰ  Dagger Alif, U+0671 ٱ Alef Wasla,
  //   U+06D6  ۖ  Pause marks, U+06E5/06E6 small Waw/Yeh
  _sanitiseArabic(text) {
    // eslint-disable-next-line no-misleading-character-class
    return text.replace(/[\u06DF\u06E0\u06E2\u06ED]/g, '');
  },

  // ── Private resolver ────────────────────────────────────
  // Returns the registry entry for the given surah number.
  // Falls back to App.state.currentSurah when no number is passed.
  // Throws clearly if the surah is not registered or data is missing.
  _resolve(surahNum) {
    const num   = surahNum || App.state.currentSurah;
    const entry = SURAH_REGISTRY[num];
    if (!entry)      throw new Error('DataService: surah ' + num + ' is not in the registry');
    if (!entry.data.surah) throw new Error('DataService: data for surah ' + num + ' not initialised — check _initRegistry()');
    return entry;
  },

  // ── Ayah data ────────────────────────────────────────────
  // Returns the full ayah object merged with its tafsir.
  // { num, arabic, transliteration, translation, translation_ur,
  //   translation_hi, summary, detail, sources }
  getAyah(num, surahNum) {
    const { data } = this._resolve(surahNum);
    const ayah     = data.surah.find(a => a.num === num);
    const tafsir   = data.tafsir.find(t => t.num === num);
    if (!ayah)   throw new Error('DataService.getAyah: ayah ' + num + ' not found');
    if (!tafsir) throw new Error('DataService.getAyah: tafsir ' + num + ' not found');
    return Object.assign({}, ayah, {
      arabic:     this._sanitiseArabic(ayah.arabic),
      summary:    tafsir.summary,
      summary_ur: tafsir.summary_ur || '',
      detail:     tafsir.detail,
      detail_ur:  tafsir.detail_ur  || '',
      sources:    tafsir.sources
    });
  },

  // Returns lens content for lenses 2-5 for a given ayah.
  // { l2: { context, asbab, reference },
  //   l3: { questions: [...] },
  //   l4: { ayat: [...], hadith },
  //   l5: { seed } }
  getLensData(num, surahNum) {
    const { data } = this._resolve(surahNum);
    const d = data.lens[num];
    if (!d) throw new Error('DataService.getLensData: ayah ' + num + ' not found');
    return d;
  },

  // Returns the word array for lens 1 (Wording) for a given ayah.
  // Each word: { arabic, trans, root, pos, form, irab, segments, note }
  getMorphology(num, surahNum) {
    const { data } = this._resolve(surahNum);
    const words = data.morphology[num];
    if (!words) throw new Error('DataService.getMorphology: ayah ' + num + ' not found');
    // Sanitise Arabic display text on each word
    return words.map(w => Object.assign({}, w, {
      arabic: this._sanitiseArabic(w.arabic)
    }));
  },

  // Returns total ayah count for the active (or specified) surah.
  getAyahCount(surahNum) {
    const { meta } = this._resolve(surahNum);
    return meta.ayahCount;
  },

  // Returns the full registry entry for the active (or specified) surah.
  // Consumers should use .meta and .strings — never .data directly.
  getSurahMeta(surahNum) {
    const { meta, strings } = this._resolve(surahNum);
    return { meta, strings };
  },

};
