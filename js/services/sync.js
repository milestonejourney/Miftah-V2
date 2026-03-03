// ============================================================
// SYNC — Miftah
// Coordinates Firebase ↔ localStorage sync.
// Calls firebase-client.js functions and store.js functions only.
// Never touches Firebase SDK or localStorage directly.
//
// Depends on: firebase-client.js, store.js (loaded before this)
// ============================================================

const CURRENT_SURAH = 67;

// Holds unsubscribe functions for active Firestore listeners.
// Lives here — belongs with the Firebase logic that uses it.
let _unsubscribeListeners = [];

// ── On login: bulk load then start listeners ──────────────

// Called by app.js handleUserLoggedIn(user).
// 1. Bulk load all user data from Firebase into localStorage.
// 2. Start real-time listeners for ongoing sync.
async function initFirebaseSync(user) {
  await loadUserDataFromFirebase(user);
  startFirebaseListeners(user);
}

// Bulk load: pull everything from Firestore and write to localStorage.
// localStorage is always primary — this just hydrates it on login.
async function loadUserDataFromFirebase(user) {
  const uid    = user.uid;
  const surah  = CURRENT_SURAH;

  try {
    // Load notes
    const notes = await dbLoadAllNotes(uid, surah);

    // Load journey metadata
    const journey = await dbLoadJourney(uid, surah);

    // Load vocab
    const vocabArr = await dbLoadAllVocab(uid, surah);

    // Merge everything into localStorage in one pass
    const merged = Object.assign({}, notes);

    // Vocab: Firebase is source of truth for authenticated users.
    // Strip Firestore Timestamps before storing (not JSON-serializable).
    if (vocabArr.length > 0) {
      merged.vocab = vocabArr.map(w => ({
        arabic:      w.arabic      || '',
        translation: w.translation || '',
        root:        w.root        || '',
        pos:         w.pos         || '',
        ayah:        w.ayah        || 0,
        savedAt:     w.savedAt     || ''
      }));
    }

    // Journey fields
    if (journey.heart_filter_note !== undefined) merged.heart_filter_note  = journey.heart_filter_note;
    if (journey.heart_filter_seen !== undefined) merged.heart_filter_seen  = journey.heart_filter_seen;
    if (journey.onboarding_seen   !== undefined) merged.onboarding_seen    = journey.onboarding_seen;
    if (journey.action_plan       !== undefined) merged.action_plan        = journey.action_plan;
    if (journey.final_reflection  !== undefined) merged.final_reflection   = journey.final_reflection;
    if (journey.journey_sealed    !== undefined) merged.journey_sealed     = journey.journey_sealed;


    bulkWriteToStore(merged);

    // Recalculate progress from loaded notes
    _recalculateAllProgress();

  } catch(e) {
    console.warn('loadUserDataFromFirebase failed:', e.message);
  }
}

// Start real-time Firestore listeners.
// When remote data changes, update localStorage immediately.
function startFirebaseListeners(user) {
  const uid   = user.uid;
  const surah = CURRENT_SURAH;

  // Notes listener
  const unsubNotes = dbListenNotes(uid, surah, (storeKey, text) => {
    const data = loadStore();
    data[storeKey] = text;

    // Update progress cache for this note
    const parts = storeKey.split('_'); // 'notes_ayah_lens'
    const ayah  = parseInt(parts[1]);
    const lens  = parseInt(parts[2]);
    if (!data.progress)       data.progress       = {};
    if (!data.progress[ayah]) data.progress[ayah] = {};
    data.progress[ayah]['l' + lens] = text.trim().length > 0;

    saveStore(data);
  });

  // Journey listener
  const unsubJourney = dbListenJourney(uid, surah, (fields) => {
    const data = loadStore();
    if (fields.heart_filter_note !== undefined) data.heart_filter_note = fields.heart_filter_note;
    if (fields.heart_filter_seen !== undefined) data.heart_filter_seen = fields.heart_filter_seen;
    if (fields.action_plan       !== undefined) data.action_plan       = fields.action_plan;
    if (fields.final_reflection  !== undefined) data.final_reflection  = fields.final_reflection;
    if (fields.journey_sealed    !== undefined) data.journey_sealed    = fields.journey_sealed;
    saveStore(data);
  });

  _unsubscribeListeners = [unsubNotes, unsubJourney];
}

// Stop all listeners — called on sign out.
function stopFirebaseListeners() {
  _unsubscribeListeners.forEach(unsub => {
    if (typeof unsub === 'function') unsub();
  });
  _unsubscribeListeners = [];
}

// ── Write-through helpers ─────────────────────────────────
// Called by pages after they write to localStorage via store.js.
// Firebase write is non-blocking — localStorage is already updated.

function syncNote(uid, ayah, lens, text) {
  if (!uid) return; // guest mode — no sync
  dbSaveNote(uid, CURRENT_SURAH, ayah, lens, text)
    .catch(e => console.warn('syncNote failed:', e.message));
}

function syncJourneyField(uid, fields) {
  if (!uid) return;
  dbSaveJourney(uid, CURRENT_SURAH, fields)
    .catch(e => console.warn('syncJourneyField failed:', e.message));
}

function syncVocabSave(uid, wordObj) {
  if (!uid) return;
  dbSaveVocabWord(uid, CURRENT_SURAH, wordObj)
    .catch(e => console.warn('syncVocabSave failed:', e.message));
}

function syncVocabRemove(uid, ayah, arabic) {
  if (!uid) return;
  dbRemoveVocabWord(uid, CURRENT_SURAH, ayah, arabic)
    .catch(e => console.warn('syncVocabRemove failed:', e.message));
}

// ── Internal helpers ──────────────────────────────────────

// Recalculates progress for all 30 ayahs from the current note data.
// Called after bulk load to ensure progress cache is accurate.
function _recalculateAllProgress() {
  const data = loadStore();
  if (!data.progress) data.progress = {};

  for (let ayah = 1; ayah <= 30; ayah++) {
    if (!data.progress[ayah]) data.progress[ayah] = {};
    for (let lens = 1; lens <= 5; lens++) {
      const key  = 'notes_' + ayah + '_' + lens;
      const text = data[key] || '';
      data.progress[ayah]['l' + lens] = text.trim().length > 0;
    }
  }

  saveStore(data);
}
