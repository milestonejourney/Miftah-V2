// ============================================================
// DATA SERVICE — Miftah
// Single access layer for all static data.
// No page or service file ever touches SURAH_67, TAFSIR_67,
// MORPHOLOGY_67, or LENS_DATA_67 directly. All access goes here.
//
// Depends on: surah-67.js, tafsir-67.js, morphology-67.js, lens-67.js
// (loaded before this file in index.html — globals are available)
// ============================================================

const DataService = {

  // Returns the full ayah object merged with its tafsir.
  // { num, arabic, transliteration, translation, translation_ur,
  //   translation_hi, summary, detail, sources }
  getAyah(num) {
    const ayah   = SURAH_67.find(a => a.num === num);
    const tafsir = TAFSIR_67.find(t => t.num === num);
    if (!ayah)   throw new Error('DataService.getAyah: ayah ' + num + ' not found');
    if (!tafsir) throw new Error('DataService.getAyah: tafsir ' + num + ' not found');
    return Object.assign({}, ayah, {
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
  getLensData(num) {
    const data = LENS_DATA_67[num];
    if (!data) throw new Error('DataService.getLensData: ayah ' + num + ' not found');
    return data;
  },

  // Returns the word array for lens 1 (Wording) for a given ayah.
  // Each word: { arabic, trans, root, pos, form, irab, segments, note }
  getMorphology(num) {
    const words = MORPHOLOGY_67[num];
    if (!words) throw new Error('DataService.getMorphology: ayah ' + num + ' not found');
    return words;
  },

  // Returns total ayah count (convenience — avoids direct SURAH_67 access)
  getAyahCount() {
    return SURAH_67.length;
  },

  // Returns surah-level metadata.
  // hasBismillah: false only for Surah 9 (At-Tawbah). True for all others.
  // Extend this when the surah registry is built.
  getSurahMeta() {
    return {
      hasBismillah: true   // Surah 67 — Al-Mulk
    };
  }

};
