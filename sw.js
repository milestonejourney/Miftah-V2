// ============================================================
// SERVICE WORKER — Miftah
// Cache-first for static assets. Network-first for Firebase.
// Version bump CACHE_NAME to force update on deploy.
// ============================================================

const CACHE_NAME = 'miftah-v16';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/design-system.css',
  '/css/components.css',
  '/js/app.js',
  '/js/core/i18n.js',
  '/js/core/theme.js',
  '/js/core/settings.js',
  '/js/data/surah-67.js',
  '/js/data/tafsir-67.js',
  '/js/data/morphology-67.js',
  '/js/data/lens-67.js',
  '/js/services/store.js',
  '/js/services/data-service.js',
  '/js/services/firebase-client.js',
  '/js/services/sync.js',
  '/js/pages/auth.js',
  '/js/pages/onboarding.js',
  '/js/pages/overview.js',
  '/js/pages/study.js',
  '/js/pages/vocab.js',
  '/js/pages/action.js',
  '/js/pages/journal.js',
  'https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Noto+Naskh+Arabic:wght@400;600&family=Noto+Nastaliq+Urdu&display=swap'
];

// ── Install: cache all static assets ─────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache what we can — don't fail install if a font is unavailable
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(() => {}))
      );
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: remove old caches ───────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for static, passthrough for Firebase ──
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Always network for Firebase — never cache auth/Firestore
  if (
    url.includes('firebaseapp.com') ||
    url.includes('googleapis.com/identitytoolkit') ||
    url.includes('firestore.googleapis.com') ||
    url.includes('securetoken.googleapis.com')
  ) {
    return; // let it fall through to network
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache successful GET responses
        if (
          response.ok &&
          event.request.method === 'GET' &&
          !url.includes('chrome-extension')
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
