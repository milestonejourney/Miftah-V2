// ============================================================
// AUTH PAGE — Miftah
// Handles the login page UI and form submissions.
// Calls firebase-client.js auth functions only.
// Never touches Firebase SDK directly.
//
// Depends on: firebase-client.js, app.js (continueAsGuest, routeAfterAuth)
// ============================================================

// ── View switching ────────────────────────────────────────

function showAuthView(view) {
  // Hide all views
  document.querySelectorAll('.auth-view').forEach(v => v.classList.add('hidden'));

  // Show target view
  const target = document.getElementById('auth-view-' + view);
  if (target) target.classList.remove('hidden');

  // Update tab active state
  document.getElementById('tab-signin').classList.toggle('active', view === 'signin');
  document.getElementById('tab-signup').classList.toggle('active', view === 'signup');

  // Clear error on view change
  clearAuthError();
}

// ── Error display ─────────────────────────────────────────

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
}

function clearAuthError() {
  const el = document.getElementById('auth-error');
  if (!el) return;
  el.textContent = '';
  el.classList.remove('visible');
}

// ── Button state ──────────────────────────────────────────

function setAuthLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent = t('please_wait');
  } else if (btn.dataset.originalText) {
    btn.textContent = btn.dataset.originalText;
  }
}

// ── Sign in ───────────────────────────────────────────────

async function handleSignIn() {
  clearAuthError();
  const email    = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;

  if (!email || !password) {
    showAuthError('Please enter your email and password.');
    return;
  }

  setAuthLoading('signin-btn', true);
  const { error } = await authSignIn(email, password);
  setAuthLoading('signin-btn', false);

  if (error) {
    showAuthError(error.message);
  }
  // Success: onAuthStateChanged in app.js handles the rest
}

// ── Sign up ───────────────────────────────────────────────

async function handleSignUp() {
  clearAuthError();
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirm  = document.getElementById('signup-confirm').value;

  if (!email || !password) {
    showAuthError('Please enter your email and password.');
    return;
  }
  if (password !== confirm) {
    showAuthError('Passwords do not match.');
    return;
  }
  if (password.length < 6) {
    showAuthError('Password must be at least 6 characters.');
    return;
  }

  setAuthLoading('signup-btn', true);
  const { error } = await authSignUp(email, password);
  setAuthLoading('signup-btn', false);

  if (error) {
    showAuthError(error.message);
  } else {
    // Show check email confirmation
    document.getElementById('auth-confirm-email').textContent = email;
    showAuthView('check-email');
  }
}

// ── Reset password ────────────────────────────────────────

async function handleResetPassword() {
  clearAuthError();
  const email = document.getElementById('reset-email').value.trim();

  if (!email) {
    showAuthError('Please enter your email address.');
    return;
  }

  setAuthLoading('reset-btn', true);
  const { error } = await authResetPassword(email);
  setAuthLoading('reset-btn', false);

  if (error) {
    showAuthError(error.message);
  } else {
    document.getElementById('auth-reset-email').textContent = email;
    showAuthView('reset-sent');
  }
}

// ── Enter key support ─────────────────────────────────────

document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (App.state.currentPage !== 'login') return;

  const active = document.querySelector('.auth-view:not(.hidden)');
  if (!active) return;

  const id = active.id;
  if (id === 'auth-view-signin')  handleSignIn();
  if (id === 'auth-view-signup')  handleSignUp();
  if (id === 'auth-view-reset')   handleResetPassword();
});
