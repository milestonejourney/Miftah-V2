// ============================================================
// STORE — Miftah
// The ONLY file that reads or writes localStorage. No exceptions.
// All other files call these functions. None touch localStorage directly.
//
// Storage key: 'miftah_v1_s67'
// Schema: see MASTER_ARCHITECTURE.md §5.2
// ============================================================

const STORAGE_KEY = 'miftah_v1_s67';

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

// ── Notes ────────────────────────────────────────────────

function noteKey(ayah, lens) {
  return 'notes_' + ayah + '_' + lens;
}

function loadNote(ayah, lens) {
  return loadStore()[noteKey(ayah, lens)] || '';
}

function saveNote(ayah, lens, text) {
  const data = loadStore();
  data[noteKey(ayah, lens)] = text;

  // Recalculate and cache progress for this ayah
  if (!data.progress) data.progress = {};
  if (!data.progress[ayah]) data.progress[ayah] = {};
  data.progress[ayah]['l' + lens] = text.trim().length > 0;

  saveStore(data);
}

// ── Progress ─────────────────────────────────────────────

// Returns progress object for one ayah: { l1, l2, l3, l4, l5 } — booleans
function loadAyahProgress(ayah) {
  const data = loadStore();
  return (data.progress && data.progress[ayah]) || {};
}

// Returns true only if all 5 lenses are non-empty for this ayah
function isAyahComplete(ayah) {
  const p = loadAyahProgress(ayah);
  return p.l1 && p.l2 && p.l3 && p.l4 && p.l5;
}

// Returns count of complete ayahs (all 5 lenses done)
function countCompleteAyahs() {
  const data = loadStore();
  if (!data.progress) return 0;
  let count = 0;
  for (let i = 1; i <= 30; i++) {
    const p = data.progress[i];
    if (p && p.l1 && p.l2 && p.l3 && p.l4 && p.l5) count++;
  }
  return count;
}

// Returns true if all 30 ayahs are fully complete (all 150 notes)
function isJourneyComplete() {
  return countCompleteAyahs() === 30;
}

// ── Journey metadata ──────────────────────────────────────

function loadLastAyah() {
  return loadStore().last_ayah || 1;
}

function saveLastAyah(num) {
  const data = loadStore();
  data.last_ayah = num;
  saveStore(data);
}

function hasSeenOnboarding() {
  return !!loadStore().onboarding_seen;
}

function markOnboardingSeen() {
  const data = loadStore();
  data.onboarding_seen = true;
  saveStore(data);
}

function hasSeenHeartFilter() {
  return !!loadStore().heart_filter_seen;
}

function saveHeartFilterNote(text) {
  const data = loadStore();
  data.heart_filter_seen = true;
  data.heart_filter_note = text;
  saveStore(data);
}

function loadHeartFilterNote() {
  return loadStore().heart_filter_note || '';
}

function saveActionPlan(text) {
  const data = loadStore();
  data.action_plan = text;
  saveStore(data);
}

function loadActionPlan() {
  return loadStore().action_plan || '';
}

function saveFinalReflection(text) {
  const data = loadStore();
  data.final_reflection = text;
  saveStore(data);
}

function loadFinalReflection() {
  return loadStore().final_reflection || '';
}

function markJourneySealed() {
  const data = loadStore();
  data.journey_sealed = true;
  saveStore(data);
}

// ── Vocab bank ────────────────────────────────────────────

function loadVocab() {
  return loadStore().vocab || [];
}

function isWordSaved(arabic, ayah) {
  return loadVocab().some(w => w.arabic === arabic && w.ayah === ayah);
}

function saveWord(wordObj) {
  // wordObj: { arabic, translation, root, pos, ayah }
  if (isWordSaved(wordObj.arabic, wordObj.ayah)) return false;
  const data = loadStore();
  if (!data.vocab) data.vocab = [];
  data.vocab.push(Object.assign({}, wordObj, { savedAt: new Date().toISOString() }));
  saveStore(data);
  return true;
}

function removeWord(arabic, ayah) {
  const data = loadStore();
  if (!data.vocab) return;
  data.vocab = data.vocab.filter(w => !(w.arabic === arabic && w.ayah === ayah));
  saveStore(data);
}

// ── Preferences ───────────────────────────────────────────

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
