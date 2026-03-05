// ============================================================
// APP.JS — Miftah
// The app shell. Loaded last. May call any function.
// Nothing loads after this file.
//
// Responsibilities:
//   - Global state object (single source of truth for runtime state)
//   - showPage() routing
//   - Auth state listener → routes user to correct page
//   - signOut()
//   - DOMContentLoaded init sequence
//
// Depends on: everything
// ============================================================

// ── Global runtime state ──────────────────────────────────
// This is the ONLY place runtime state lives.
// All pages read from App.state — they never keep their own state.

const App = {
  state: {
    currentPage:  'login',
    currentSurah: 67,
    currentAyah:  1,
    currentLens:  1,
    user:         null,
    isGuest:      false,
    memorizeMode: false,
    tafsirOpen:   false,
  }
};

// ── Routing ───────────────────────────────────────────────

function showPage(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  const target = document.getElementById('page-' + pageName);
  if (!target) { console.error('showPage: no page with id page-' + pageName); return; }
  target.classList.add('active');

  App.state.currentPage = pageName;
  window.scrollTo(0, 0);

  const showNav = ['overview', 'study', 'vocab', 'action', 'journal'].includes(pageName);
  document.getElementById('mainNav').style.display   = showNav ? 'flex' : 'none';
  document.getElementById('bottomNav').style.display = showNav ? 'flex' : 'none';

  document.getElementById('navCenter').style.display = (pageName === 'study') ? 'flex' : 'none';

  document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
    btn.classList.toggle('active-page', btn.getAttribute('data-page') === pageName);
  });

  const onShow = {
    onboarding: () => typeof renderOnboarding === 'function' && renderOnboarding(),
    overview: () => typeof renderOverview  === 'function' && renderOverview(),
    study:    () => typeof renderStudyPage === 'function' && renderStudyPage(App.state.currentAyah),
    vocab:    () => typeof renderVocab     === 'function' && renderVocab(),
    action:   () => typeof renderAction    === 'function' && renderAction(),
    journal:  () => typeof renderJournal   === 'function' && renderJournal(),
  };
  if (onShow[pageName]) onShow[pageName]();
}

function goToAyah(num) {
  App.state.currentAyah = num;
  saveLastAyah(num);
  showPage('study');
}

function switchSurah(num) {
  if (App.state.currentSurah === num) return;
  App.state.currentSurah = num;
  App.state.currentAyah  = loadLastAyah(num);
  // Re-sync Firebase data and listeners for the new surah
  if (typeof onSurahSwitch === 'function') onSurahSwitch(App.state.user);
  // Refresh surah-specific strings in the DOM
  if (typeof renderSurahStrings === 'function') renderSurahStrings();
  // Update switcher active state
  document.querySelectorAll('[data-surah-btn]').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.getAttribute('data-surah-btn')) === num);
  });
  showPage('overview');
}

function prevAyah() {
  const prev = App.state.currentAyah - 1;
  if (prev >= 1) goToAyah(prev);
}

function nextAyah() {
  const next = App.state.currentAyah + 1;
  if (next <= DataService.getAyahCount()) goToAyah(next);
}

// ── Auth handlers ─────────────────────────────────────────

function handleUserLoggedIn(user) {
  App.state.user    = user;
  App.state.isGuest = false;

  const email = user.email || '';
  const navEl = document.getElementById('nav-user-email');
  if (navEl) {
    const handle = email.split('@')[0];
    const friendly = handle.charAt(0).toUpperCase() + handle.slice(1);
    navEl.textContent = friendly;
  }
  setSettingsEmail(email);

  initFirebaseSync(user).then(() => {
    routeAfterAuth();
  });
}

function handleUserLoggedOut() {
  App.state.user    = null;
  App.state.isGuest = false;

  stopFirebaseListeners();
  setSettingsEmail('');

  const navEl = document.getElementById('nav-user-email');
  if (navEl) navEl.textContent = '';

  showPage('login');
}

function continueAsGuest() {
  App.state.isGuest = true;
  App.state.user    = null;
  routeAfterAuth();
}

function signOut() {
  closeSettings();
  if (App.state.isGuest) {
    handleUserLoggedOut();
    return;
  }
  authSignOut();
}

// ── Post-auth routing ─────────────────────────────────────

function routeAfterAuth() {
  if (!hasSeenOnboarding()) {
    showPage('onboarding');
    return;
  }
  App.state.currentAyah = loadLastAyah();
  showPage('overview');
}

// ── Completion modal ──────────────────────────────────────

function openJournalFromCompletion() {
  closeCompletionModal();
  showPage('journal');
}

function closeCompletionModal() {
  document.getElementById('completion-modal').classList.remove('open');
}

function checkJourneyCompletion() {
  if (isJourneyComplete()) {
    document.getElementById('completion-modal').classList.add('open');
  }
}

// ── Onboarding ────────────────────────────────────────────

let _obCurrentStep = 1;
const _obTotalSteps = 3;

function obStep(direction) {
  const next = _obCurrentStep + direction;
  if (next < 1 || next > _obTotalSteps) return;

  document.getElementById('ob-step-' + _obCurrentStep).classList.remove('active');
  _obCurrentStep = next;
  document.getElementById('ob-step-' + _obCurrentStep).classList.add('active');

  document.getElementById('ob-back-btn').style.display = (_obCurrentStep > 1) ? 'block' : 'none';

  const nextBtn = document.getElementById('ob-next-btn');
  nextBtn.style.display = (_obCurrentStep === _obTotalSteps) ? 'none' : 'block';
}

function beginFromOnboarding() {
  markOnboardingSeen();
  App.state.currentAyah = 1;
  showPage('overview');
}

// ── Ayah dropdown (top nav) ───────────────────────────────

function toggleDropdown() {
  const dropdown = document.getElementById('ayah-dropdown');
  const arrow    = document.getElementById('dropdown-arrow');
  const isOpen   = dropdown.classList.contains('open');
  dropdown.classList.toggle('open', !isOpen);
  arrow.classList.toggle('open', !isOpen);
}

function closeDropdown() {
  document.getElementById('ayah-dropdown').classList.remove('open');
  document.getElementById('dropdown-arrow').classList.remove('open');
}

document.addEventListener('click', e => {
  const selector = document.querySelector('.ayah-selector-btn');
  if (selector && !selector.contains(e.target)) closeDropdown();
});

// ── Init ──────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // 0. Wire data globals into the registry — must be first
  DataService.init();

  // 0b. Migrate legacy storage key (miftah_v1_s67 → miftah_v1) — runs once, no-ops after
  migrateFromLegacyStore();

  // 1. Apply persisted preferences immediately — no flash
  initTheme();
  initI18n();

  // 2. Firebase auth state listener
  authOnStateChange(user => {
    if (user) {
      handleUserLoggedIn(user);
    } else {
      if (!App.state.isGuest) {
        handleUserLoggedOut();
      }
    }
  });

});
