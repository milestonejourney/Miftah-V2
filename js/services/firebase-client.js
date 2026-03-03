// ============================================================
// FIREBASE CLIENT — Miftah
// The ONLY file that touches the Firebase SDK. No exceptions.
// sync.js and app.js call these functions.
// Nothing else calls firebase.* directly.
//
// Data structure (subcollections under /users/{uid}/):
//   /users/{uid}/notes/{surah}_{ayah}_{lens}
//   /users/{uid}/journey/{surah}
//   /users/{uid}/vocab/{surah}_{ayah}_{encodedArabic}
//
// Uses Firebase compat SDK (v9 compat) loaded via <script> tags.
// ============================================================

const firebaseConfig = {
  apiKey:            "AIzaSyA-3Y9u3ZAPOp_CuFfSbQ0sKpdiwWbjHvY",
  authDomain:        "miftah-733ad.firebaseapp.com",
  projectId:         "miftah-733ad",
  storageBucket:     "miftah-733ad.firebasestorage.app",
  messagingSenderId: "137953052782",
  appId:             "1:137953052782:web:295b72d99922f749057e7f"
};

firebase.initializeApp(firebaseConfig);

const _auth = firebase.auth();
const _db   = firebase.firestore();

// ── Path helpers ──────────────────────────────────────────

function _userRef(uid)              { return _db.collection('users').doc(uid); }
function _notesRef(uid)             { return _userRef(uid).collection('notes'); }
function _journeyRef(uid)           { return _userRef(uid).collection('journey'); }
function _vocabRef(uid)             { return _userRef(uid).collection('vocab'); }

function _noteDocId(surah, ayah, lens)          { return surah + '_' + ayah + '_' + lens; }
function _journeyDocId(surah)                   { return '' + surah; }
function _vocabDocId(surah, ayah, arabic)       {
  const safe = encodeURIComponent(arabic).slice(0, 60);
  return surah + '_' + ayah + '_' + safe;
}

// ── Auth ──────────────────────────────────────────────────

async function authSignIn(email, password) {
  try {
    const cred = await _auth.signInWithEmailAndPassword(email, password);
    return { data: cred, error: null };
  } catch(e) {
    return { data: null, error: { message: _friendlyError(e.code) } };
  }
}

async function authSignUp(email, password) {
  try {
    const cred = await _auth.createUserWithEmailAndPassword(email, password);
    return { data: cred, error: null };
  } catch(e) {
    return { data: null, error: { message: _friendlyError(e.code) } };
  }
}

async function authResetPassword(email) {
  try {
    await _auth.sendPasswordResetEmail(email);
    return { error: null };
  } catch(e) {
    return { error: { message: _friendlyError(e.code) } };
  }
}

async function authSignOut() {
  try {
    await _auth.signOut();
    return { error: null };
  } catch(e) {
    return { error: { message: e.message } };
  }
}

function authOnStateChange(callback) { return _auth.onAuthStateChanged(callback); }
function authGetUser()               { return _auth.currentUser; }

// ── Notes ────────────────────────────────────────────────

async function dbSaveNote(uid, surah, ayah, lens, text) {
  try {
    await _notesRef(uid).doc(_noteDocId(surah, ayah, lens)).set({
      text,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch(e) { console.warn('dbSaveNote failed:', e.message); }
}

async function dbLoadAllNotes(uid, surah) {
  try {
    const snap = await _notesRef(uid)
      .where(firebase.firestore.FieldPath.documentId(), '>=', surah + '_')
      .where(firebase.firestore.FieldPath.documentId(), '<',  surah + '_\uffff')
      .get();
    const result = {};
    snap.forEach(doc => {
      // Doc ID: surah_ayah_lens
      const parts = doc.id.split('_');
      const ayah  = parts[1];
      const lens  = parts[2];
      result['notes_' + ayah + '_' + lens] = doc.data().text || '';
    });
    return result;
  } catch(e) { console.warn('dbLoadAllNotes failed:', e.message); return {}; }
}

function dbListenNotes(uid, surah, onChange) {
  return _notesRef(uid)
    .where(firebase.firestore.FieldPath.documentId(), '>=', surah + '_')
    .where(firebase.firestore.FieldPath.documentId(), '<',  surah + '_\uffff')
    .onSnapshot(snap => {
      snap.docChanges().forEach(change => {
        if (change.type === 'modified' || change.type === 'added') {
          const parts = change.doc.id.split('_');
          const ayah  = parts[1];
          const lens  = parts[2];
          onChange('notes_' + ayah + '_' + lens, change.doc.data().text || '');
        }
      });
    }, e => console.warn('dbListenNotes error:', e.message));
}

// ── Journey ───────────────────────────────────────────────

async function dbSaveJourney(uid, surah, fields) {
  try {
    await _journeyRef(uid).doc(_journeyDocId(surah)).set(
      Object.assign({}, fields, { updatedAt: firebase.firestore.FieldValue.serverTimestamp() }),
      { merge: true }
    );
  } catch(e) { console.warn('dbSaveJourney failed:', e.message); }
}

async function dbLoadJourney(uid, surah) {
  try {
    const snap = await _journeyRef(uid).doc(_journeyDocId(surah)).get();
    return snap.exists ? snap.data() : {};
  } catch(e) { console.warn('dbLoadJourney failed:', e.message); return {}; }
}

function dbListenJourney(uid, surah, onChange) {
  return _journeyRef(uid).doc(_journeyDocId(surah))
    .onSnapshot(snap => {
      if (snap.exists) onChange(snap.data());
    }, e => console.warn('dbListenJourney error:', e.message));
}

// ── Vocab ─────────────────────────────────────────────────

async function dbSaveVocabWord(uid, surah, wordObj) {
  try {
    await _vocabRef(uid).doc(_vocabDocId(surah, wordObj.ayah, wordObj.arabic))
      .set(Object.assign({}, wordObj, { updatedAt: firebase.firestore.FieldValue.serverTimestamp() }));
  } catch(e) { console.warn('dbSaveVocabWord failed:', e.message); }
}

async function dbRemoveVocabWord(uid, surah, ayah, arabic) {
  try {
    await _vocabRef(uid).doc(_vocabDocId(surah, ayah, arabic)).delete();
  } catch(e) { console.warn('dbRemoveVocabWord failed:', e.message); }
}

async function dbLoadAllVocab(uid, surah) {
  try {
    const snap = await _vocabRef(uid)
      .where(firebase.firestore.FieldPath.documentId(), '>=', surah + '_')
      .where(firebase.firestore.FieldPath.documentId(), '<',  surah + '_\uffff')
      .get();
    const words = [];
    snap.forEach(doc => words.push(doc.data()));
    return words;
  } catch(e) { console.warn('dbLoadAllVocab failed:', e.message); return []; }
}

// ── Error helpers ─────────────────────────────────────────

function _friendlyError(code) {
  const map = {
    'auth/user-not-found':        'No account found with that email.',
    'auth/wrong-password':        'Incorrect password.',
    'auth/invalid-credential':    'Incorrect email or password.',
    'auth/email-already-in-use':  'An account with that email already exists.',
    'auth/weak-password':         'Password must be at least 6 characters.',
    'auth/invalid-email':         'Please enter a valid email address.',
    'auth/too-many-requests':     'Too many attempts. Please try again later.',
    'auth/network-request-failed':'Network error. Check your connection.'
  };
  return map[code] || 'Something went wrong. Please try again.';
}

// ── Dev helper: clear all vocab (run once in console to reset test data) ──
// Usage: clearAllVocab().then(() => location.reload())
async function clearAllVocab() {
  const user = authGetUser();
  if (!user) { console.warn('Not logged in'); return; }
  const snap = await _vocabRef(user.uid).get();
  const batch = _db.batch();
  snap.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  console.log('Vocab cleared:', snap.size, 'documents deleted');
}
