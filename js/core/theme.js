// ============================================================
// THEME — Miftah
// System/Dark/Light toggle and text size.
// JS sets data-theme and data-text-size on <html> only.
// CSS does all the visual work from there.
//
// Themes: system (default) | dark | light
// System mirrors device prefers-color-scheme.
//
// Depends on: store.js (loadTheme, saveTheme, loadTextSize, saveTextSize)
// ============================================================

// Returns 'dark' or 'light' for the resolved effective theme.
// For 'system', reads prefers-color-scheme from device.
function _resolveEffectiveTheme(theme) {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

// Updates logo src across all .theme-logo elements based on effective theme.
function _applyLogo(theme) {
  const effective = _resolveEffectiveTheme(theme);
  const logoSrc = (effective === 'dark') ? 'icons/logo-dark.png' : 'icons/logo-light.png';
  document.querySelectorAll('.theme-logo').forEach(img => { img.src = logoSrc; });
}

// Sets theme and persists. Called by settings buttons + initTheme().
function setTheme(theme) {
  const effective = _resolveEffectiveTheme(theme);
  document.documentElement.setAttribute('data-theme', effective);
  saveTheme(theme); // Save the user's choice (system/dark/light), not the resolved value

  document.querySelectorAll('[data-theme-btn]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme-btn') === theme);
  });

  _applyLogo(theme);
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
  const savedTheme = loadTheme();
  setTheme(savedTheme);
  setTextSize(loadTextSize());

  // If system theme is active, re-resolve logo if device preference changes
  // (e.g. user switches device from light to dark mode while app is open)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (loadTheme() === 'system') {
      setTheme('system');
    }
  });
}
