// ============================================================
// SERVICE WORKER — Miftah
// Cache-first for static assets. Network-first for Firebase.
// Version bump CACHE_NAME to force update on deploy.
// ============================================================

const CACHE_NAME = 'miftah-v28';
const BASE = '/Miftah-V2';

const STATIC_ASSETS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/css/design-system.css',
  BASE + '/css/components.css',
  BASE + '/js/app.js',
  BASE + '/js/core/i18n.js',
  BASE + '/js/core/theme.js',
  BASE + '/js/core/settings.js',
  BASE + '/js/data/surah-1.js',
  BASE + '/js/data/tafsir-1.js',
  BASE + '/js/data/morphology-1.js',
  BASE + '/js/data/lens-1.js',
  BASE + '/js/data/surah-63.js',
  BASE + '/js/data/tafsir-63.js',
  BASE + '/js/data/morphology-63.js',
  BASE + '/js/data/lens-63.js',
  BASE + '/js/data/surah-67.js',
  BASE + '/js/data/tafsir-67.js',
  BASE + '/js/data/morphology-67.js',
  BASE + '/js/data/lens-67.js',
  BASE + '/js/services/store.js',
  BASE + '/js/services/data-service.js',
  BASE + '/js/services/firebase-client.js',
  BASE + '/js/services/sync.js',
  BASE + '/js/pages/auth.js',
  BASE + '/js/pages/onboarding.js',
  BASE + '/js/pages/overview.js',
  BASE + '/js/pages/study.js',
  BASE + '/js/pages/vocab.js',
  BASE + '/js/pages/action.js',
  BASE + '/js/pages/journal.js',
  BASE + '/fonts/KFGQPCUthmanicScriptHAFS.woff2',
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
          return caches.match(BASE + '/index.html');
        }
      });
    })
  );
});
