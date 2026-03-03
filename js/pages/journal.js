// ============================================================
// JOURNAL PAGE — Miftah
// Complete tadabbur record — all ayahs, all lenses, all notes.
// Plus the heart filter opening entry and final reflection.
// Called by app.js showPage('journal') → renderJournal()
//
// Depends on: DataService, store.js, sync.js, app.js, i18n.js
// ============================================================

let _finalReflectionTimer = null;

function renderJournal() {
  _renderHeartFilterEntry();
  _renderAyahEntries();
  _renderFinalReflection();
}

// ── Heart filter opening entry ────────────────────────────

function _renderHeartFilterEntry() {
  const container = document.getElementById('journal-heart-section');
  if (!container) return;

  const note = loadHeartFilterNote();
  if (!note) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  const noteEl = document.getElementById('journal-heart-text');
  if (noteEl) noteEl.textContent = note;
}

// ── Per-ayah entries ──────────────────────────────────────

function _renderAyahEntries() {
  const container = document.getElementById('journal-entries');
  if (!container) return;
  container.innerHTML = '';

  const total = DataService.getAyahCount();

  for (let ayah = 1; ayah <= total; ayah++) {
    const entry = _buildAyahEntry(ayah);
    container.appendChild(entry);
  }
}

function _buildAyahEntry(ayahNum) {
  const ayah      = DataService.getAyah(ayahNum);
  const progress  = loadAyahProgress(ayahNum);
  const hasNotes  = [1,2,3,4,5].some(l => progress['l' + l]);
  const complete  = [1,2,3,4,5].every(l => progress['l' + l]);

  const entry = document.createElement('div');
  entry.className = 'journal-entry' + (complete ? ' complete' : '');
  entry.dataset.ayah = ayahNum;

  // Header — always visible, tap to expand
  const header = document.createElement('div');
  header.className = 'journal-entry-header';
  header.setAttribute('role', 'button');
  header.setAttribute('aria-expanded', 'false');
  header.onclick = () => _toggleJournalEntry(entry, header);

  const numBadge = document.createElement('span');
  numBadge.className = 'journal-entry-num' + (complete ? ' complete' : '');
  numBadge.textContent = ayahNum;

  const arabicSnippet = document.createElement('span');
  arabicSnippet.className = 'journal-entry-arabic';
  arabicSnippet.textContent = ayah.arabic.split(' ').slice(0, 4).join(' ') + (ayah.arabic.split(' ').length > 4 ? '…' : '');

  const status = document.createElement('span');
  status.className = 'journal-entry-status';
  const lensCount = [1,2,3,4,5].filter(l => progress['l' + l]).length;
  status.textContent = complete ? '✦' : (lensCount > 0 ? lensCount + '/5' : '');
  status.style.color = complete ? 'var(--gold)' : 'var(--text-tertiary)';

  header.appendChild(numBadge);
  header.appendChild(arabicSnippet);
  header.appendChild(status);

  // Body — hidden until expanded
  const body = document.createElement('div');
  body.className = 'journal-entry-body';
  body.setAttribute('aria-hidden', 'true');

  // Translation
  const trans = document.createElement('p');
  trans.className = 'journal-entry-translation';
  trans.textContent = getAyahTranslation(ayah);
  body.appendChild(trans);

  // Lens notes
  const lensNames = ['Wording', 'World of the Quran', 'My Experience', 'Connections', 'General Lessons'];
  const lensColors = ['var(--lens-1)', 'var(--lens-2)', 'var(--lens-3)', 'var(--lens-4)', 'var(--lens-5)'];

  lensNames.forEach((name, idx) => {
    const lens     = idx + 1;
    const noteText = loadNote(ayahNum, lens);
    if (!noteText) return; // skip empty lenses

    const lensSection = document.createElement('div');
    lensSection.className = 'journal-lens-section';

    const lensLabel = document.createElement('p');
    lensLabel.className = 'journal-lens-label';
    lensLabel.style.color = lensColors[idx];
    lensLabel.textContent = lens + ' · ' + name;

    const lensNote = document.createElement('p');
    lensNote.className = 'journal-lens-note';
    lensNote.textContent = noteText;

    lensSection.appendChild(lensLabel);
    lensSection.appendChild(lensNote);
    body.appendChild(lensSection);
  });

  // If no notes at all
  if (!hasNotes) {
    const empty = document.createElement('p');
    empty.className = 'journal-entry-empty';
    empty.textContent = 'No notes yet — tap to study this ayah.';
    empty.onclick = () => goToAyah(ayahNum);
    body.appendChild(empty);
  }

  // Go to study shortcut
  const studyLink = document.createElement('button');
  studyLink.className = 'journal-study-link';
  studyLink.textContent = hasNotes ? 'Continue studying →' : 'Begin studying →';
  studyLink.onclick = (e) => { e.stopPropagation(); goToAyah(ayahNum); };
  body.appendChild(studyLink);

  entry.appendChild(header);
  entry.appendChild(body);

  return entry;
}

function _toggleJournalEntry(entry, header) {
  const isOpen = entry.classList.contains('expanded');
  // Collapse all entries first for accordion behaviour
  document.querySelectorAll('.journal-entry.expanded').forEach(e => {
    e.classList.remove('expanded');
    const h = e.querySelector('.journal-entry-header');
    const b = e.querySelector('.journal-entry-body');
    if (h) h.setAttribute('aria-expanded', 'false');
    if (b) b.setAttribute('aria-hidden', 'true');
  });
  // Open this one if it was closed
  if (!isOpen) {
    entry.classList.add('expanded');
    header.setAttribute('aria-expanded', 'true');
    const body = entry.querySelector('.journal-entry-body');
    if (body) body.setAttribute('aria-hidden', 'false');
  }
}

// ── Final reflection ──────────────────────────────────────

function _renderFinalReflection() {
  const ta        = document.getElementById('journal-final-reflection');
  const indicator = document.getElementById('journal-final-saved');
  const section   = document.getElementById('journal-final');

  if (!ta) return;

  ta.value = loadFinalReflection();

  // Only show final reflection section once journey is complete
  if (section) {
    section.style.display = isJourneyComplete() ? 'block' : 'none';
  }

  if (indicator) indicator.classList.remove('visible');
}

function handleFinalReflectionInput() {
  clearTimeout(_finalReflectionTimer);
  _finalReflectionTimer = setTimeout(_saveFinalReflection, 800);
}

function _saveFinalReflection() {
  const ta = document.getElementById('journal-final-reflection');
  if (!ta) return;

  const text = ta.value;
  saveFinalReflection(text);
  syncJourneyField(App.state.user ? App.state.user.uid : null, { final_reflection: text });

  const indicator = document.getElementById('journal-final-saved');
  if (indicator) {
    indicator.classList.add('visible');
    setTimeout(() => indicator.classList.remove('visible'), 2000);
  }
}

// Wire textarea
document.addEventListener('DOMContentLoaded', () => {
  const ta = document.getElementById('journal-final-reflection');
  if (ta) ta.addEventListener('input', handleFinalReflectionInput);
});
