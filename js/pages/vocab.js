// ============================================================
// VOCAB PAGE — Miftah
// Displays saved words from the vocab bank.
// Called by app.js showPage('vocab') → renderVocab()
//
// Depends on: store.js (loadVocab, removeWord), sync.js, app.js
// ============================================================

function renderVocab() {
  const list    = document.getElementById('vocab-list');
  const empty   = document.getElementById('vocab-empty');
  const counter = document.getElementById('vocab-count');
  if (!list) return;

  const words = loadVocab();
  list.innerHTML = '';

  if (counter) counter.textContent = words.length + ' word' + (words.length !== 1 ? 's' : '');

  if (!words.length) {
    if (empty) empty.style.display = 'block';
    list.style.display = 'none';
    return;
  }

  if (empty) empty.style.display = 'none';
  list.style.display = 'flex';

  words.forEach(word => {
    const card = _buildVocabCard(word);
    list.appendChild(card);
  });
}

function _buildVocabCard(word) {
  const card = document.createElement('div');
  card.className = 'vocab-card';

  // Arabic + POS badge
  const top = document.createElement('div');
  top.className = 'vocab-card-top';

  const arabic = document.createElement('p');
  arabic.className = 'vocab-card-arabic';
  arabic.textContent = word.arabic;

  const pos = document.createElement('span');
  pos.className = 'vocab-card-pos';
  pos.textContent = word.pos || '';

  top.appendChild(arabic);
  top.appendChild(pos);

  // Translation
  const trans = document.createElement('p');
  trans.className = 'vocab-card-trans';
  trans.textContent = word.translation;

  // Root + ayah info
  const meta = document.createElement('p');
  meta.className = 'vocab-card-meta';
  meta.textContent = (word.root ? word.root + '  ·  ' : '') + 'Ayah ' + word.ayah;

  // Remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'vocab-card-remove';
  removeBtn.textContent = '✕';
  removeBtn.setAttribute('aria-label', 'Remove ' + word.arabic);
  removeBtn.onclick = () => _removeVocabWord(word.arabic, word.ayah, card);

  card.appendChild(top);
  card.appendChild(trans);
  card.appendChild(meta);
  card.appendChild(removeBtn);

  return card;
}

function _removeVocabWord(arabic, ayah, cardEl) {
  removeWord(arabic, ayah);
  syncVocabRemove(App.state.user ? App.state.user.uid : null, ayah, arabic);

  // Animate out then re-render
  cardEl.style.opacity = '0';
  cardEl.style.transform = 'scale(0.95)';
  cardEl.style.transition = 'opacity 0.2s, transform 0.2s';
  setTimeout(() => renderVocab(), 220);
}
