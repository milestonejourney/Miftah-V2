// ============================================================
// ACTION PAGE — Miftah
// Personal action plan — single textarea, auto-saves.
// Called by app.js showPage('action') → renderAction()
//
// Depends on: store.js (loadActionPlan, saveActionPlan), sync.js, app.js
// ============================================================

let _actionSaveTimer = null;

function renderAction() {
  const ta        = document.getElementById('action-textarea');
  const indicator = document.getElementById('action-saved');
  if (!ta) return;

  ta.value = loadActionPlan();
  if (indicator) indicator.classList.remove('visible');
}

function handleActionInput() {
  clearTimeout(_actionSaveTimer);
  _actionSaveTimer = setTimeout(_saveAction, 800);
}

function _saveAction() {
  const ta = document.getElementById('action-textarea');
  if (!ta) return;

  const text = ta.value;
  saveActionPlan(text);
  syncJourneyField(App.state.user ? App.state.user.uid : null, { action_plan: text });

  const indicator = document.getElementById('action-saved');
  if (indicator) {
    indicator.classList.add('visible');
    setTimeout(() => indicator.classList.remove('visible'), 2000);
  }
}

// Wire textarea on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const ta = document.getElementById('action-textarea');
  if (ta) ta.addEventListener('input', handleActionInput);
});
