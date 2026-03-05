// ============================================================
// STUDY PAGE — Miftah
// The core study experience. Owns:
//   - Ayah display (arabic, transliteration, translation)
//   - Tafsir section (summary + expandable detail + sources)
//   - 5 lens tabs + content rendering
//   - Notes textarea with debounced auto-save
//   - Ayah selector dropdown (top nav)
//   - Memorize mode toggle
//   - Word chip popup modal (Lens 1)
//   - Save word to vocab
//
// Called by app.js: renderStudyPage(ayahNum)
// Depends on: DataService, store.js, sync.js, i18n.js, app.js
// ============================================================

// ── Note save debounce ────────────────────────────────────
let _noteSaveTimer = null;

// ── Word popup state ──────────────────────────────────────
let _activeWord = null;

// ── Entry point ───────────────────────────────────────────

function renderStudyPage(num) {
  if (!num || num < 1 || num > DataService.getAyahCount()) num = 1;
  App.state.currentAyah = num;
  App.state.currentLens = App.state.currentLens || 1;

  // Stop any playing audio when navigating to a new ayah or surah
  if (window._miftahAudio && !window._miftahAudio.paused) {
    window._miftahAudio.pause();
    const btn = document.getElementById('audio-btn');
    if (btn) btn.classList.remove('active');
  }

  const ayah = DataService.getAyah(num);

  _renderAyahDisplay(ayah);
  _renderTafsir(ayah);
  _renderNavDropdown(num);
  _renderLensTabs();
  _renderLensContent(num, App.state.currentLens);
  _loadNote(num, App.state.currentLens);
  _applyMemorizeMode();
  maybeShowHeartFilter();
}

// ── Ayah display ──────────────────────────────────────────

function _renderAyahDisplay(ayah) {
  const numEl      = document.getElementById('ayah-num-display');
  const totalEl    = document.getElementById('ayah-total-display');
  const arabicEl   = document.getElementById('study-arabic');
  const translitEl = document.getElementById('study-transliteration');
  const transEl    = document.getElementById('study-translation');
  const navDisplay = document.getElementById('ayah-current-display');
  const prevBtn    = document.getElementById('prev-ayah-btn');
  const nextBtn    = document.getElementById('next-ayah-btn');

  const total = DataService.getAyahCount();

  if (numEl)      numEl.textContent      = ayah.num;
  if (totalEl)    totalEl.textContent    = total;
  if (translitEl) translitEl.textContent = ayah.transliteration || '';
  if (transEl)    transEl.textContent    = getAyahTranslation(ayah);
  if (navDisplay) navDisplay.textContent = 'Ayah ' + ayah.num;

  if (prevBtn)    prevBtn.disabled = ayah.num <= 1;
  if (nextBtn)    nextBtn.disabled = ayah.num >= total;
  // Build word spans for memorize mode word-by-word reveal
  if (arabicEl) {
    // Remove any existing bismillah first — always, before re-evaluating
    const existing = arabicEl.parentNode.querySelector('.study-bismillah');
    if (existing) existing.remove();

    // Bismillah ornament — shown above Ayah 1 for surahs that begin with it
    if (ayah.num === 1 && DataService.getSurahMeta().meta.hasBismillah) {
      const bism = document.createElement('div');
      bism.className = 'study-bismillah';
      bism.setAttribute('lang', 'ar');
      bism.setAttribute('dir', 'rtl');
      bism.textContent = '﷽';
      arabicEl.parentNode.insertBefore(bism, arabicEl);
    }

    arabicEl.innerHTML = '';
    const words = ayah.arabic.split(' ');
    words.forEach((word, idx) => {
      const span = document.createElement('span');
      span.className = 'arabic-word';
      span.textContent = word;
      span.dataset.idx = idx;
      span.onclick = () => _revealWord(span, arabicEl, translitEl, words.length);
      arabicEl.appendChild(span);
      if (idx < words.length - 1) arabicEl.appendChild(document.createTextNode(' '));
    });
  }
}

// ── Tafsir ────────────────────────────────────────────────

function _renderTafsir(ayah) {
  const summaryEl = document.getElementById('tafsir-summary');
  const detailEl  = document.getElementById('tafsir-detail-inner');
  const sourcesEl = document.getElementById('tafsir-sources');

  // Use Urdu summary when language is ur or hi, fallback to English
  const lang = (typeof currentLang !== 'undefined' ? currentLang : 'en');
  const isUrdu = (lang === 'ur');   // Urdu Nastaliq only — Hindi uses English tafsir
  const summaryText = (isUrdu && ayah.summary_ur) ? ayah.summary_ur : ayah.summary;

  if (summaryEl) {
    summaryEl.innerHTML = summaryText || '';
    // Urdu summary needs RTL + Nastaliq font
    summaryEl.style.direction    = isUrdu ? 'rtl' : '';
    summaryEl.style.textAlign    = isUrdu ? 'right' : '';
    summaryEl.style.fontFamily   = isUrdu ? "'Noto Nastaliq Urdu', serif" : '';
    summaryEl.style.lineHeight   = isUrdu ? '2.4' : '';
    summaryEl.style.fontSize     = isUrdu ? 'calc(var(--sz-tafsir) * 0.95)' : '';
  }
  if (detailEl) {
    const detailText = (isUrdu && ayah.detail_ur) ? ayah.detail_ur : ayah.detail;
    detailEl.innerHTML = detailText || '';
    detailEl.style.direction  = (isUrdu && ayah.detail_ur) ? 'rtl' : '';
    detailEl.style.textAlign  = (isUrdu && ayah.detail_ur) ? 'right' : '';
    detailEl.style.fontFamily = (isUrdu && ayah.detail_ur) ? "'Noto Nastaliq Urdu', serif" : '';
    detailEl.style.lineHeight = (isUrdu && ayah.detail_ur) ? '2.4' : '';
    detailEl.style.fontSize   = (isUrdu && ayah.detail_ur) ? 'calc(var(--sz-tafsir) * 0.95)' : '';
  }

  // Hide the "English only" note now that summaries are translated
  const tafsirLangNote = document.getElementById('tafsir-lang-note');
  if (tafsirLangNote) tafsirLangNote.style.display = 'none';

  if (sourcesEl && ayah.sources) {
    sourcesEl.innerHTML = ayah.sources
      .map(s => '<span class="tafsir-source-tag">' + s + '</span>')
      .join('');
  }

  // Reset expansion on ayah change
  const section = document.getElementById('study-tafsir');
  if (section) section.classList.remove('tafsir-open');
  App.state.tafsirOpen = false;
}

function toggleTafsir() {
  const section = document.getElementById('study-tafsir');
  if (!section) return;
  App.state.tafsirOpen = !App.state.tafsirOpen;
  section.classList.toggle('tafsir-open', App.state.tafsirOpen);
  const header = section.querySelector('.tafsir-header');
  if (header) header.setAttribute('aria-expanded', App.state.tafsirOpen);
}

// ── Lens tabs ─────────────────────────────────────────────

function _renderLensTabs() {
  document.querySelectorAll('.lens-tab').forEach(tab => {
    const lens = parseInt(tab.getAttribute('data-lens'));
    tab.classList.toggle('active', lens === App.state.currentLens);
    tab.setAttribute('aria-selected', lens === App.state.currentLens);
  });
}

function switchLens(lensNum) {
  _flushNoteSave();
  App.state.currentLens = lensNum;
  _renderLensTabs();
  _renderLensContent(App.state.currentAyah, lensNum);
  _loadNote(App.state.currentAyah, lensNum);
}

// ── Lens content ──────────────────────────────────────────

function _renderLensContent(ayahNum, lensNum) {
  const container = document.getElementById('lens-content');
  if (!container) return;
  container.innerHTML = '';

  if (lensNum === 1) {
    _renderLens1(ayahNum, container);
  } else {
    _renderLens2to5(ayahNum, lensNum, container);
  }

  const notesEl = document.getElementById('lens-notes');
  if (notesEl) notesEl.placeholder = t('lens' + lensNum + '_placeholder');
}

// Lens 1 — Wording: word chips
function _renderLens1(ayahNum, container) {
  const words = DataService.getMorphology(ayahNum);
  if (!words || !words.length) {
    container.innerHTML = '<p style="color:var(--text-tertiary);padding:16px 0">No morphology data for this ayah.</p>';
    return;
  }

  const chips = document.createElement('div');
  chips.className = 'word-chips';

  words.forEach(word => {
    const chip = document.createElement('button');
    chip.className = 'word-chip';

    const ar = document.createElement('span');
    ar.className = 'word-chip-arabic';
    ar.textContent = word.arabic;

    const gl = document.createElement('span');
    gl.className = 'word-chip-gloss';
    gl.textContent = word.trans;

    chip.appendChild(ar);
    chip.appendChild(gl);
    chip.onclick = () => openWordPopup(word, ayahNum);
    chips.appendChild(chip);
  });

  container.appendChild(chips);

  const hint = document.createElement('p');
  hint.style.cssText = 'font-size:12px;color:var(--text-tertiary);font-family:system-ui,sans-serif;text-align:center;padding:8px 0 4px;letter-spacing:0.04em';
  hint.textContent = 'Tap any word for full grammatical analysis';
  container.appendChild(hint);
}

// Lenses 2-5
function _renderLens2to5(ayahNum, lensNum, container) {
  let lensData;
  try { lensData = DataService.getLensData(ayahNum); }
  catch(e) {
    container.innerHTML = '<p style="color:var(--text-tertiary);padding:16px 0">No lens data available.</p>';
    return;
  }

  if (lensNum === 2) _renderLens2(lensData.l2, container);
  if (lensNum === 3) _renderLens3(lensData.l3, container);
  if (lensNum === 4) _renderLens4(lensData.l4, container);
  if (lensNum === 5) _renderLens5(lensData.l5, container);
}

// Lens 2 — World of the Quran
function _renderLens2(l2, container) {
  const isUrdu = (typeof currentLang !== 'undefined' && currentLang === 'ur');
  if (l2.context) {
    const txt = (isUrdu && l2.context_ur) ? l2.context_ur : l2.context;
    container.appendChild(_lensBlock('Historical Context', txt, isUrdu && !!l2.context_ur));
  }
  if (l2.asbab) {
    const txt = (isUrdu && l2.asbab_ur) ? l2.asbab_ur : l2.asbab;
    container.appendChild(_lensBlock('Asbab al-Nuzul', txt, isUrdu && !!l2.asbab_ur));
  }
  if (l2.reference) container.appendChild(_lensBlock('Reference', l2.reference));
}

// Lens 3 — My Experience
function _renderLens3(l3, container) {
  if (!l3.questions || !l3.questions.length) return;

  const lang = (typeof currentLang !== 'undefined' ? currentLang : 'en');
  const isUrdu = (lang === 'ur');
  const questions = (isUrdu && l3.questions_ur) ? l3.questions_ur : l3.questions;

  const block = document.createElement('div');
  block.className = 'lens-block';

  const label = document.createElement('p');
  label.className = 'lens-block-label';
  label.textContent = 'Reflection Questions';
  block.appendChild(label);

  const list = document.createElement('ul');
  list.className = 'lens-questions';
  questions.forEach(q => {
    const li = document.createElement('li');
    li.className = 'lens-question-item';
    li.textContent = q;
    if (isUrdu) {
      li.style.cssText = "direction:rtl;text-align:right;font-family:'Noto Nastaliq Urdu',serif;line-height:2.4";
    }
    list.appendChild(li);
  });

  block.appendChild(list);
  container.appendChild(block);
}

// Lens 4 — Connections
function _renderLens4(l4, container) {
  const lang    = (typeof currentLang !== 'undefined' ? currentLang : 'en');
  const isUrdu  = (lang === 'ur');

  function _applyUrduStyles(el) {
    el.style.direction  = 'rtl';
    el.style.textAlign  = 'right';
    el.style.fontFamily = "'Noto Nastaliq Urdu', serif";
    el.style.lineHeight = '2.4';
    el.style.fontSize   = 'calc(var(--sz-tafsir) * 0.95)';
  }

  if (l4.ayat && l4.ayat.length) {
    const block = document.createElement('div');
    block.className = 'lens-block';

    const label = document.createElement('p');
    label.className = 'lens-block-label';
    label.textContent = 'Related Ayat';
    block.appendChild(label);

    l4.ayat.forEach(a => {
      const item = document.createElement('div');
      item.className = 'lens-connection-item';

      const ref = document.createElement('p');
      ref.className = 'lens-connection-ref';
      ref.textContent = a.ref;

      const useUrText = isUrdu && a.text_ur;
      const text = document.createElement('p');
      text.className = 'lens-block-text';
      text.textContent = useUrText ? a.text_ur : a.text;
      if (useUrText) _applyUrduStyles(text);

      item.appendChild(ref);
      item.appendChild(text);
      block.appendChild(item);
    });

    container.appendChild(block);
  }

  if (l4.hadith) {
    const block = document.createElement('div');
    block.className = 'lens-block';

    const label = document.createElement('p');
    label.className = 'lens-block-label';
    label.textContent = 'Hadith';
    block.appendChild(label);

    const useUrHadith = isUrdu && l4.hadith_ur;
    const h = document.createElement('p');
    h.className = 'lens-hadith';
    h.textContent = useUrHadith ? l4.hadith_ur : l4.hadith;
    if (useUrHadith) _applyUrduStyles(h);
    block.appendChild(h);

    container.appendChild(block);
  }
}

// Lens 5 — General Lessons
function _renderLens5(l5, container) {
  if (!l5.seed) return;

  const block = document.createElement('div');
  block.className = 'lens-block';
  block.style.borderColor = 'var(--lens-5)';

  const label = document.createElement('p');
  label.className = 'lens-block-label';
  label.textContent = 'Universal Principle';
  block.appendChild(label);

  const seed = document.createElement('p');
  seed.className = 'lens-block-text';
  const lang = (typeof currentLang !== 'undefined' ? currentLang : 'en');
  if (lang === 'ur' && l5.seed_ur) {
    seed.textContent = l5.seed_ur;
    seed.style.cssText = "direction:rtl;text-align:right;font-family:'Noto Nastaliq Urdu',serif;font-size:1.1em;line-height:2.4;color:var(--text-primary)";
  } else {
    seed.style.cssText = 'font-style:italic;color:var(--text-primary)';
    seed.textContent = l5.seed;
  }
  block.appendChild(seed);
  container.appendChild(block);

  const hint = document.createElement('p');
  hint.style.cssText = 'font-size:12px;color:var(--text-tertiary);font-family:system-ui,sans-serif;padding:8px 0 4px;letter-spacing:0.03em';
  hint.textContent = 'Write the general lesson in your own words in the notes below.';
  container.appendChild(hint);
}

// Generic labelled block
function _lensBlock(labelText, bodyText, rtl) {
  const block = document.createElement('div');
  block.className = 'lens-block';

  const label = document.createElement('p');
  label.className = 'lens-block-label';
  label.textContent = labelText;

  const body = document.createElement('p');
  body.className = 'lens-block-text';
  body.textContent = bodyText;
  if (rtl) {
    body.style.cssText = "direction:rtl;text-align:right;font-family:'Noto Nastaliq Urdu',serif;font-size:1.05em;line-height:2.4";
  }

  block.appendChild(label);
  block.appendChild(body);
  return block;
}

// ── Notes ─────────────────────────────────────────────────

function _loadNote(ayahNum, lensNum) {
  const el = document.getElementById('lens-notes');
  if (!el) return;
  el.value = loadNote(ayahNum, lensNum);
  _hideSavedIndicator();
}

function handleNotesInput() {
  clearTimeout(_noteSaveTimer);
  _noteSaveTimer = setTimeout(_saveCurrentNote, 800);
}

function _saveCurrentNote() {
  const el = document.getElementById('lens-notes');
  if (!el) return;

  const ayah = App.state.currentAyah;
  const lens = App.state.currentLens;
  const text = el.value;

  saveNote(ayah, lens, text);
  syncNote(App.state.user ? App.state.user.uid : null, ayah, lens, text);
  _showSavedIndicator();
  checkJourneyCompletion();
}

function _flushNoteSave() {
  if (_noteSaveTimer) {
    clearTimeout(_noteSaveTimer);
    _noteSaveTimer = null;
    _saveCurrentNote();
  }
}

function _showSavedIndicator() {
  const el = document.getElementById('lens-notes-saved');
  if (!el) return;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 2000);
}

function _hideSavedIndicator() {
  const el = document.getElementById('lens-notes-saved');
  if (el) el.classList.remove('visible');
}

document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('lens-notes');
  if (el) el.addEventListener('input', handleNotesInput);

  const wordPopup = document.getElementById('word-popup');
  if (wordPopup) wordPopup.addEventListener('click', e => {
    if (e.target === wordPopup) closeWordPopup();
  });
});

// ── Memorize mode ─────────────────────────────────────────

function toggleMemorize() {
  App.state.memorizeMode = !App.state.memorizeMode;
  _applyMemorizeMode();
}

function _applyMemorizeMode() {
  const on         = App.state.memorizeMode;
  const btn        = document.getElementById('memorize-btn');
  const translitEl = document.getElementById('study-transliteration');
  const words      = document.querySelectorAll('.arabic-word');

  if (btn) btn.classList.toggle('active', on);

  if (on) {
    words.forEach(w => {
      w.classList.add('memorize-blurred');
      w.classList.remove('memorize-revealed');
    });
    if (translitEl) {
      translitEl.classList.add('memorize-hidden');
      translitEl.classList.remove('memorize-revealed');
    }
  } else {
    words.forEach(w => w.classList.remove('memorize-blurred', 'memorize-revealed'));
    if (translitEl) translitEl.classList.remove('memorize-hidden', 'memorize-revealed');
  }
}

function _revealWord(span) {
  if (!App.state.memorizeMode) return;
  if (!span.classList.contains('memorize-blurred')) return;

  span.classList.remove('memorize-blurred');
  span.classList.add('memorize-revealed');

  // When all words revealed, reveal transliteration too
  const remaining = document.querySelectorAll('.arabic-word.memorize-blurred');
  if (remaining.length === 0) {
    const translitEl = document.getElementById('study-transliteration');
    if (translitEl) {
      translitEl.classList.remove('memorize-hidden');
      translitEl.classList.add('memorize-revealed');
    }
  }
}

// ── Audio ─────────────────────────────────────────────────

function playAudio() {
  const ayah     = App.state.currentAyah;
  const surah    = String(App.state.currentSurah).padStart(3, '0');
  const ayahPad  = String(ayah).padStart(3, '0');
  const url = 'https://everyayah.com/data/Alafasy_128kbps/' + surah + ayahPad + '.mp3';
  const btn = document.getElementById('audio-btn');

  if (!window._miftahAudio) {
    window._miftahAudio = new Audio();
    window._miftahAudio.addEventListener('ended',  () => { if (btn) btn.classList.remove('active'); });
    window._miftahAudio.addEventListener('error',  () => { if (btn) btn.classList.remove('active'); });
  }

  const audio = window._miftahAudio;
  if (!audio.paused) {
    audio.pause();
    if (btn) btn.classList.remove('active');
    return;
  }

  audio.src = url;
  audio.play()
    .then(() => { if (btn) btn.classList.add('active'); })
    .catch(() => { if (btn) btn.classList.remove('active'); });
}

// ── Ayah dropdown ─────────────────────────────────────────

function _renderNavDropdown(currentNum) {
  const dropdown = document.getElementById('ayah-dropdown');
  if (!dropdown) return;

  if (!dropdown.dataset.rendered) {
    const total = DataService.getAyahCount();
    for (let i = 1; i <= total; i++) {
      const btn = document.createElement('button');
      btn.className = 'dropdown-ayah-btn';
      btn.textContent = i;
      btn.setAttribute('data-ayah', i);
      btn.setAttribute('role', 'option');
      btn.onclick = () => { closeDropdown(); goToAyah(i); };
      dropdown.appendChild(btn);
    }
    dropdown.dataset.rendered = 'true';
  }

  // Update active state
  dropdown.querySelectorAll('.dropdown-ayah-btn').forEach(btn => {
    btn.classList.toggle('active-ayah', parseInt(btn.getAttribute('data-ayah')) === currentNum);
  });
}

// ── Word popup ────────────────────────────────────────────

function openWordPopup(word, ayahNum) {
  _activeWord = { word, ayahNum };

  document.getElementById('word-popup-arabic').textContent = word.arabic || '';
  document.getElementById('word-popup-gloss').textContent  = word.trans  || '';
  document.getElementById('word-popup-root').textContent   = word.root   || '—';
  document.getElementById('word-popup-pos').textContent    = word.pos    || '';
  document.getElementById('word-popup-form').textContent   = word.form   || '—';
  document.getElementById('word-popup-irab').textContent   = word.irab   || '—';

  const segWrapper = document.getElementById('word-popup-segments-wrapper');
  const segEl      = document.getElementById('word-popup-segments');
  if (word.segments) {
    segEl.textContent = word.segments;
    segWrapper.style.display = 'block';
  } else {
    segWrapper.style.display = 'none';
  }

  const noteEl = document.getElementById('word-popup-note');
  if (noteEl) {
    noteEl.textContent   = word.note || '';
    noteEl.style.display = word.note ? 'block' : 'none';
  }

  const vocabBtn = document.getElementById('word-vocab-btn');
  if (vocabBtn) {
    const saved = isWordSaved(word.arabic, ayahNum);
    vocabBtn.textContent = saved ? '✓ In Vocab' : t('save_vocab');
    vocabBtn.disabled    = saved;
  }

  document.getElementById('word-popup').classList.add('open');
}

function closeWordPopup() {
  document.getElementById('word-popup').classList.remove('open');
  _activeWord = null;
}

function saveWordToVocab() {
  if (!_activeWord) return;
  const { word, ayahNum } = _activeWord;
  const wordObj = {
    arabic: word.arabic, translation: word.trans,
    root:   word.root,   pos:         word.pos, ayah: ayahNum
  };
  const saved = saveWord(wordObj);
  if (saved) syncVocabSave(App.state.user ? App.state.user.uid : null, wordObj);

  const btn = document.getElementById('word-vocab-btn');
  if (btn) { btn.textContent = '✓ In Vocab'; btn.disabled = true; }
}

// ── Heart filter ──────────────────────────────────────────

function submitHeartFilter() {
  const text = (document.getElementById('heart-note-input').value || '').trim();
  saveHeartFilterNote(text);
  syncJourneyField(App.state.user ? App.state.user.uid : null, {
    heart_filter_seen: true,
    heart_filter_note: text
  });
  document.getElementById('heart-modal').classList.remove('open');
}

function maybeShowHeartFilter() {
  if (!hasSeenHeartFilter()) {
    document.getElementById('heart-modal').classList.add('open');
  }
}
