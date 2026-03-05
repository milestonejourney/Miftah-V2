// ============================================================
// STORE — Miftah
// The ONLY file that reads or writes localStorage. No exceptions.
// All other files call these functions. None touch localStorage directly.
//
// Storage key: 'miftah_v1'
// Schema:
//   {
//     theme, lang, textSize,      ← global preferences
//     onboarding_seen,            ← global, seen once ever
//     surahs: {
//       67: {                     ← per-surah data
//         progress, notes_*,
//         last_ayah, vocab,
//         heart_filter_seen, heart_filter_note,
//         action_plan, final_reflection, journey_sealed
//       },
//       18: { ... },
//     }
//   }
// ============================================================

const STORAGE_KEY     = 'miftah_v1';
const STORAGE_KEY_OLD = 'miftah_v1_s67';  // pre-registry key — migrate once then delete

// ── Core read / write ─────────────────────────────────────

function loadStore() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch(e) {
    return {};
  }
}

function saveStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch(e) {
    console.warn('store: saveStore failed', e);
  }
}

// ── One-time migration from pre-registry storage key ──────
// Old schema (miftah_v1_s67) was flat — all surah-67 data at top level.
// New schema (miftah_v1) nests surah data under surahs[67].
// Runs once on startup; deletes old key when done.
function migrateFromLegacyStore() {
  let old;
  try {
    old = JSON.parse(localStorage.getItem(STORAGE_KEY_OLD));
  } catch(e) { return; }
  if (!old) return;

  // Only migrate if the new key doesn't already have surah-67 data
  const current = loadStore();
  if (current.surahs && current.surahs[67]) {
    localStorage.removeItem(STORAGE_KEY_OLD);
    return;
  }

  // Lift global preferences to top level
  const migrated = {
    theme:           old.theme       || 'dark',
    lang:            old.lang        || 'en',
    textSize:        old.textSize    || 'md',
    onboarding_seen: old.onboarding_seen || false,
    surahs: {
      67: {}
    }
  };

  const s = migrated.surahs[67];

  // Lift surah-67 scoped data into the nested slot
  if (old.progress)          s.progress           = old.progress;
  if (old.last_ayah)         s.last_ayah          = old.last_ayah;
  if (old.vocab)             s.vocab              = old.vocab;
  if (old.heart_filter_seen) s.heart_filter_seen  = old.heart_filter_seen;
  if (old.heart_filter_note) s.heart_filter_note  = old.heart_filter_note;
  if (old.action_plan)       s.action_plan        = old.action_plan;
  if (old.final_reflection)  s.final_reflection   = old.final_reflection;
  if (old.journey_sealed)    s.journey_sealed     = old.journey_sealed;

  // Migrate all notes_ayah_lens keys
  Object.keys(old).forEach(key => {
    if (key.startsWith('notes_')) s[key] = old[key];
  });

  saveStore(migrated);
  localStorage.removeItem(STORAGE_KEY_OLD);
  console.log('store: migrated from legacy key miftah_v1_s67');
}

// Returns the per-surah slice, creating it if absent.
// surahNum defaults to App.state.currentSurah.
function _surahStore(surahNum) {
  const num  = surahNum || App.state.currentSurah;
  const data = loadStore();
  if (!data.surahs)      data.surahs = {};
  if (!data.surahs[num]) data.surahs[num] = {};
  return data.surahs[num];
}

// Writes back an updated per-surah slice.
function _saveSurahStore(surahNum, surahData) {
  const num  = surahNum || App.state.currentSurah;
  const data = loadStore();
  if (!data.surahs) data.surahs = {};
  data.surahs[num] = surahData;
  saveStore(data);
}

// ── Notes ────────────────────────────────────────────────

function noteKey(ayah, lens) {
  return 'notes_' + ayah + '_' + lens;
}

function loadNote(ayah, lens, surahNum) {
  return _surahStore(surahNum)[noteKey(ayah, lens)] || '';
}

function saveNote(ayah, lens, text, surahNum) {
  const sd = _surahStore(surahNum);
  sd[noteKey(ayah, lens)] = text;

  // Recalculate and cache progress for this ayah
  if (!sd.progress)       sd.progress = {};
  if (!sd.progress[ayah]) sd.progress[ayah] = {};
  sd.progress[ayah]['l' + lens] = text.trim().length > 0;

  _saveSurahStore(surahNum, sd);
}

// ── Progress ─────────────────────────────────────────────

// Returns progress object for one ayah: { l1, l2, l3, l4, l5 } — booleans
function loadAyahProgress(ayah, surahNum) {
  const sd = _surahStore(surahNum);
  return (sd.progress && sd.progress[ayah]) || {};
}

// Returns true only if all 5 lenses are non-empty for this ayah
function isAyahComplete(ayah, surahNum) {
  const p = loadAyahProgress(ayah, surahNum);
  return p.l1 && p.l2 && p.l3 && p.l4 && p.l5;
}

// Returns count of complete ayahs (all 5 lenses done)
function countCompleteAyahs(surahNum) {
  const num   = surahNum || App.state.currentSurah;
  const sd    = _surahStore(num);
  const total = DataService.getAyahCount(num);
  if (!sd.progress) return 0;
  let count = 0;
  for (let i = 1; i <= total; i++) {
    const p = sd.progress[i];
    if (p && p.l1 && p.l2 && p.l3 && p.l4 && p.l5) count++;
  }
  return count;
}

// Returns true if all ayahs in the surah are fully complete
function isJourneyComplete(surahNum) {
  const num = surahNum || App.state.currentSurah;
  return countCompleteAyahs(num) === DataService.getAyahCount(num);
}

// ── Journey metadata ──────────────────────────────────────

function loadLastAyah(surahNum) {
  return _surahStore(surahNum).last_ayah || 1;
}

function saveLastAyah(num, surahNum) {
  const sd = _surahStore(surahNum);
  sd.last_ayah = num;
  _saveSurahStore(surahNum, sd);
}

function hasSeenOnboarding() {
  return !!loadStore().onboarding_seen;
}

function markOnboardingSeen() {
  const data = loadStore();
  data.onboarding_seen = true;
  saveStore(data);
}

function hasSeenHeartFilter(surahNum) {
  return !!_surahStore(surahNum).heart_filter_seen;
}

function saveHeartFilterNote(text, surahNum) {
  const sd = _surahStore(surahNum);
  sd.heart_filter_seen = true;
  sd.heart_filter_note = text;
  _saveSurahStore(surahNum, sd);
}

function loadHeartFilterNote(surahNum) {
  return _surahStore(surahNum).heart_filter_note || '';
}

function saveActionPlan(text, surahNum) {
  const sd = _surahStore(surahNum);
  sd.action_plan = text;
  _saveSurahStore(surahNum, sd);
}

function loadActionPlan(surahNum) {
  return _surahStore(surahNum).action_plan || '';
}

function saveFinalReflection(text, surahNum) {
  const sd = _surahStore(surahNum);
  sd.final_reflection = text;
  _saveSurahStore(surahNum, sd);
}

function loadFinalReflection(surahNum) {
  return _surahStore(surahNum).final_reflection || '';
}

function markJourneySealed(surahNum) {
  const sd = _surahStore(surahNum);
  sd.journey_sealed = true;
  _saveSurahStore(surahNum, sd);
}

// ── Vocab bank ────────────────────────────────────────────

function loadVocab(surahNum) {
  return _surahStore(surahNum).vocab || [];
}

function isWordSaved(arabic, ayah, surahNum) {
  return loadVocab(surahNum).some(w => w.arabic === arabic && w.ayah === ayah);
}

function saveWord(wordObj, surahNum) {
  // wordObj: { arabic, translation, root, pos, ayah }
  if (isWordSaved(wordObj.arabic, wordObj.ayah, surahNum)) return false;
  const sd = _surahStore(surahNum);
  if (!sd.vocab) sd.vocab = [];
  sd.vocab.push(Object.assign({}, wordObj, { savedAt: new Date().toISOString() }));
  _saveSurahStore(surahNum, sd);
  return true;
}

function removeWord(arabic, ayah, surahNum) {
  const sd = _surahStore(surahNum);
  if (!sd.vocab) return;
  sd.vocab = sd.vocab.filter(w => !(w.arabic === arabic && w.ayah === ayah));
  _saveSurahStore(surahNum, sd);
}

// ── Preferences (global — not per-surah) ─────────────────

function loadTheme() {
  return loadStore().theme || 'dark';
}

function saveTheme(theme) {
  const data = loadStore();
  data.theme = theme;
  saveStore(data);
}

function loadLang() {
  return loadStore().lang || 'en';
}

function saveLang(lang) {
  const data = loadStore();
  data.lang = lang;
  saveStore(data);
}

function loadTextSize() {
  return loadStore().textSize || 'md';
}

function saveTextSize(size) {
  const data = loadStore();
  data.textSize = size;
  saveStore(data);
}

// ── Bulk load (used by sync.js after Firebase login) ──────

// Merges a flat object of remote data into localStorage.
// Only writes keys that are present in the remote data.
function bulkWriteToStore(remoteData) {
  const data = loadStore();
  Object.assign(data, remoteData);
  saveStore(data);
}
