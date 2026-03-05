// ============================================================
// SYNC — Miftah
// Coordinates Firebase ↔ localStorage sync.
// Calls firebase-client.js functions and store.js functions only.
// Never touches Firebase SDK or localStorage directly.
//
// Surah is always derived from App.state.currentSurah — never hardcoded.
// All store writes go through store.js functions (_surahStore namespace).
//
// Depends on: firebase-client.js, store.js (loaded before this)
// ============================================================

// Holds unsubscribe functions for active Firestore listeners,
// keyed by surah number so switching surahs starts fresh listeners.
let _unsubscribeListeners = [];
let _listeningSurah       = null;

// ── On login: bulk load then start listeners ──────────────

// Called by app.js handleUserLoggedIn(user).
async function initFirebaseSync(user) {
  await loadUserDataFromFirebase(user);
  startFirebaseListeners(user);
}

// Bulk load: pull all data for the current surah from Firestore.
// Writes into the correct surahs[N] slot via store.js functions.
async function loadUserDataFromFirebase(user) {
  const uid   = user.uid;
  const surah = App.state.currentSurah;

  try {
    const [notes, journey, vocabArr] = await Promise.all([
      dbLoadAllNotes(uid, surah),
      dbLoadJourney(uid, surah),
      dbLoadAllVocab(uid, surah),
    ]);

    // Write notes — each key is 'notes_ayah_lens'
    Object.entries(notes).forEach(([key, text]) => {
      const parts = key.split('_');
      const ayah  = parseInt(parts[1]);
      const lens  = parseInt(parts[2]);
      if (ayah && lens) saveNote(ayah, lens, text, surah);
    });

    // Write journey fields into surah slot
    if (journey.heart_filter_note !== undefined) saveHeartFilterNote(journey.heart_filter_note, surah);
    if (journey.action_plan       !== undefined) saveActionPlan(journey.action_plan, surah);
    if (journey.final_reflection  !== undefined) saveFinalReflection(journey.final_reflection, surah);
    if (journey.journey_sealed)                  markJourneySealed(surah);
    if (journey.onboarding_seen)                 markOnboardingSeen();

    // Vocab: Firebase is source of truth for authenticated users.
    if (vocabArr.length > 0) {
      const data = loadStore();
      if (!data.surahs)        data.surahs = {};
      if (!data.surahs[surah]) data.surahs[surah] = {};
      data.surahs[surah].vocab = vocabArr.map(w => ({
        arabic:      w.arabic      || '',
        translation: w.translation || '',
        root:        w.root        || '',
        pos:         w.pos         || '',
        ayah:        w.ayah        || 0,
        savedAt:     typeof w.savedAt === 'string' ? w.savedAt : new Date().toISOString(),
      }));
      saveStore(data);
    }

  } catch(e) {
    console.warn('loadUserDataFromFirebase failed:', e.message);
  }
}

// Start real-time Firestore listeners for the current surah.
// Stops any existing listeners first (handles surah switching).
function startFirebaseListeners(user) {
  const uid   = user.uid;
  const surah = App.state.currentSurah;

  if (_listeningSurah !== surah) stopFirebaseListeners();
  _listeningSurah = surah;

  const unsubNotes = dbListenNotes(uid, surah, (key, text) => {
    const parts = key.split('_');
    const ayah  = parseInt(parts[1]);
    const lens  = parseInt(parts[2]);
    if (ayah && lens) saveNote(ayah, lens, text, surah);
  });

  const unsubJourney = dbListenJourney(uid, surah, (fields) => {
    if (fields.heart_filter_note !== undefined) saveHeartFilterNote(fields.heart_filter_note, surah);
    if (fields.action_plan       !== undefined) saveActionPlan(fields.action_plan, surah);
    if (fields.final_reflection  !== undefined) saveFinalReflection(fields.final_reflection, surah);
    if (fields.journey_sealed)                  markJourneySealed(surah);
  });

  _unsubscribeListeners = [unsubNotes, unsubJourney];
}

// Stop all listeners — called on sign out or surah switch.
function stopFirebaseListeners() {
  _unsubscribeListeners.forEach(fn => { if (typeof fn === 'function') fn(); });
  _unsubscribeListeners = [];
  _listeningSurah       = null;
}

// ── Surah switching ───────────────────────────────────────

// Called by app.js switchSurah() after state is updated.
// Re-syncs Firebase data and listeners for the newly selected surah.
async function onSurahSwitch(user) {
  if (!user) return;
  stopFirebaseListeners();
  await loadUserDataFromFirebase(user);
  startFirebaseListeners(user);
}

// ── Write-through helpers ─────────────────────────────────
// Called by pages after they write to localStorage via store.js.
// Firebase write is non-blocking — localStorage is already updated.
// Surah always read from App.state.currentSurah.

function syncNote(uid, ayah, lens, text) {
  if (!uid) return;
  dbSaveNote(uid, App.state.currentSurah, ayah, lens, text)
    .catch(e => console.warn('syncNote failed:', e.message));
}

function syncJourneyField(uid, fields) {
  if (!uid) return;
  dbSaveJourney(uid, App.state.currentSurah, fields)
    .catch(e => console.warn('syncJourneyField failed:', e.message));
}

function syncVocabSave(uid, wordObj) {
  if (!uid) return;
  dbSaveVocabWord(uid, App.state.currentSurah, wordObj)
    .catch(e => console.warn('syncVocabSave failed:', e.message));
}

function syncVocabRemove(uid, ayah, arabic) {
  if (!uid) return;
  dbRemoveVocabWord(uid, App.state.currentSurah, ayah, arabic)
    .catch(e => console.warn('syncVocabRemove failed:', e.message));
}
