// ============================================================
// ONBOARDING PAGE — Miftah
// 3-step onboarding. Lens cards built from STRINGS data.
// beginFromOnboarding() and obStep() live in app.js.
//
// Depends on: i18n.js (t), app.js
// ============================================================

// Lens colour map — matches CSS --lens-N variables
const LENS_COLOURS = {
  1: '#C9A84C',
  2: '#7B9E87',
  3: '#9B7BB5',
  4: '#5B8DB8',
  5: '#B5735A'
};

// Called once when the onboarding page first becomes active.
// Renders the 5 lens cards into #ob-lens-cards.
function renderOnboarding() {
  const container = document.getElementById('ob-lens-cards');
  if (!container || container.dataset.rendered) return;

  for (let i = 1; i <= 5; i++) {
    const card = _buildLensCard(i);
    container.appendChild(card);
  }

  container.dataset.rendered = 'true';
}

function _buildLensCard(num) {
  const colour = LENS_COLOURS[num];

  const card = document.createElement('div');
  card.className = 'ob-lens-card';
  card.dataset.lens = num;

  // Header (clickable — expand/collapse)
  const header = document.createElement('div');
  header.className = 'ob-lens-card-header';
  header.setAttribute('role', 'button');
  header.setAttribute('aria-expanded', 'false');
  header.onclick = () => _toggleLensCard(card, header);

  const numBadge = document.createElement('span');
  numBadge.className = 'ob-lens-num';
  numBadge.style.background = colour;
  numBadge.textContent = num;

  const name = document.createElement('span');
  name.className = 'ob-lens-name';
  name.style.color = colour;
  name.setAttribute('data-i18n', 'lens' + num + '_name');
  name.textContent = t('lens' + num + '_name');

  const chevron = document.createElement('span');
  chevron.className = 'ob-lens-chevron';
  chevron.textContent = '▾';

  header.appendChild(numBadge);
  header.appendChild(name);
  header.appendChild(chevron);

  // Body (description)
  const body = document.createElement('div');
  body.className = 'ob-lens-card-body';

  const desc = document.createElement('p');
  desc.className = 'ob-lens-desc';
  desc.setAttribute('data-i18n', 'lens' + num + '_desc');
  desc.textContent = t('lens' + num + '_desc');

  body.appendChild(desc);
  card.appendChild(header);
  card.appendChild(body);

  return card;
}

function _toggleLensCard(card, header) {
  const isExpanded = card.classList.contains('expanded');
  // Collapse all first
  document.querySelectorAll('.ob-lens-card').forEach(c => c.classList.remove('expanded'));
  // Expand this one if it was closed
  if (!isExpanded) card.classList.add('expanded');
  header.setAttribute('aria-expanded', !isExpanded);
}

// Hook into app.js showPage — render on first view
// app.js calls renderOnboarding() when onboarding page shows
// We need to register this — patch showPage's onShow map isn't possible
// so we watch via onboarding page being shown in app.js directly.
// app.js will call renderOnboarding() — add it to the onShow map there.
// For now, auto-init on DOMContentLoaded as fallback.
document.addEventListener('DOMContentLoaded', () => {
  // Pre-render lens cards so they're ready when the page shows
  renderOnboarding();
});
