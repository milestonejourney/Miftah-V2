// ============================================================
// OVERVIEW PAGE — Miftah
// 30-tile ayah grid with per-tile lens progress indicators.
// Called by app.js showPage('overview') → renderOverview()
//
// Depends on: DataService, store.js, app.js (goToAyah)
// ============================================================

function renderOverview() {
  _renderProgress();
  _renderGrid();
}

// ── Progress bar ──────────────────────────────────────────

function _renderProgress() {
  const complete = countCompleteAyahs();
  const total    = DataService.getAyahCount();
  const pct      = Math.round((complete / total) * 100);

  const fill  = document.getElementById('overview-progress-fill');
  const label = document.getElementById('overview-progress-label');

  if (fill)  fill.style.width = pct + '%';
  if (label) label.textContent = complete + ' of ' + total + ' complete';
}

// ── Ayah grid ─────────────────────────────────────────────

function _renderGrid() {
  const grid = document.getElementById('ayah-grid');
  if (!grid) return;

  const total   = DataService.getAyahCount();
  const current = App.state.currentAyah;

  grid.innerHTML = '';

  for (let i = 1; i <= total; i++) {
    grid.appendChild(_buildTile(i, current));
  }
}

function _buildTile(num, currentAyah) {
  const progress   = loadAyahProgress(num);
  const lensCount  = [1,2,3,4,5].filter(l => progress['l' + l]).length;
  const isComplete = lensCount === 5;
  const isPartial  = lensCount > 0 && lensCount < 5;
  const isCurrent  = num === currentAyah;

  const tile = document.createElement('button');
  tile.className = 'ayah-tile';
  tile.setAttribute('role', 'listitem');
  tile.setAttribute('data-lenses', lensCount);

  // Status classes
  if (isComplete) tile.classList.add('studied');
  else if (isPartial) tile.classList.add('partial');
  if (isCurrent) tile.classList.add('current');

  // Aria label
  const statusText = isComplete
    ? ' — complete'
    : isPartial ? ' — ' + lensCount + ' of 5 lenses' : '';
  tile.setAttribute('aria-label', 'Ayah ' + num + statusText);

  // Ayah number
  const numEl = document.createElement('span');
  numEl.textContent = num;
  tile.appendChild(numEl);

  // Dot row — 5 dots showing lens completion (only for partial/complete)
  if (lensCount > 0) {
    const dots = document.createElement('div');
    dots.className = 'ayah-tile-dots';
    for (let l = 1; l <= 5; l++) {
      const dot = document.createElement('span');
      dot.className = 'ayah-tile-dot' + (progress['l' + l] ? ' filled' : '');
      dots.appendChild(dot);
    }
    tile.appendChild(dots);
  }

  tile.onclick = () => goToAyah(num);
  return tile;
}

// Called by study.js after saving a note so grid stays in sync
// without requiring a full page transition back to overview.
function refreshOverviewTile(ayahNum) {
  const grid = document.getElementById('ayah-grid');
  if (!grid || App.state.currentPage !== 'overview') return;
  const oldTile = grid.querySelector('[data-ayah="' + ayahNum + '"]');
  if (!oldTile) return;
  const newTile = _buildTile(ayahNum, App.state.currentAyah);
  grid.replaceChild(newTile, oldTile);
  _renderProgress();
}
