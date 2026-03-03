// ============================================================
// THEME — Miftah
// Dark/light toggle and text size.
// JS sets data-theme and data-text-size on <html> only.
// CSS does all the visual work from there.
//
// Depends on: store.js (loadTheme, saveTheme, loadTextSize, saveTextSize)
// ============================================================

// Sets theme and persists. Called by settings buttons + initTheme().
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  saveTheme(theme);

  document.querySelectorAll('[data-theme-btn]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme-btn') === theme);
  });
}

// Sets text size and persists. Called by settings buttons + initTheme().
function setTextSize(size) {
  document.documentElement.setAttribute('data-text-size', size);
  saveTextSize(size);

  document.querySelectorAll('[data-size-btn]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-size-btn') === size);
  });
}

// Called once by app.js on startup.
function initTheme() {
  setTheme(loadTheme());
  setTextSize(loadTextSize());
}
