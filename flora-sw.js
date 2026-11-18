/* =========================================================
   Flora 学習ワークスペース — PWA Service Worker
   - アプリシェル（index.html / manifest / アイコン）を先読み
   - 画面遷移はネットワーク優先、オフライン時はシェルへフォールバック
   - ハッシュ付きアセットはキャッシュ優先、それ以外はSWR
   - 旧Flora（sw.js）の巨大キャッシュは activate 時に削除
   ========================================================= */

const VERSION = 'v1';
const CACHE_PREFIX = 'flora-app-';
const CACHE_NAME = `${CACHE_PREFIX}${VERSION}`;
const SCOPE = new URL('./', self.location.href).href;

const PRECACHE_PATHS = [
  '',
  'index.html',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-192.png',
  'icons/apple-touch-icon.png',
];

const toScopedUrl = (path) => new URL(path, SCOPE).href;

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.all(
        PRECACHE_PATHS.map((path) =>
          cache.add(new Request(toScopedUrl(path), { cache: 'reload' })).catch((error) => {
            console.warn('[flora-sw] precache skipped:', path, error);
          }),
        ),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key.startsWith(CACHE_PREFIX))
          .map((key) => caches.delete(key)),
      );
      // 旧Floraのサービスワーカーが残した巨大キャッシュを掃除する
      await Promise.all(
        keys.filter((key) => key === 'flora-pwa-v5.0').map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

function isCacheableAsset(url) {
  return (
    url.pathname.includes('/assets/') ||
    url.pathname.includes('/icons/') ||
    url.pathname.includes('/images/') ||
    /\.(?:css|js|mjs|woff2?|ttf|otf|png|jpe?g|svg|webp|avif|ico)$/i.test(url.pathname)
  );
}

async function networkFirstNavigation(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    const shell =
      (await cache.match(toScopedUrl('index.html'))) || (await cache.match(toScopedUrl('')));
    if (shell) return shell;
    return Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone()).catch(() => {});
  }
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    })
    .catch(() => undefined);
  return cached || network || Response.error();
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (!url.href.startsWith(SCOPE)) return;
  // AIプロキシ等の動的APIはキャッシュしない
  if (url.pathname.startsWith(`${new URL(SCOPE).pathname}api/`)) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  event.respondWith(isCacheableAsset(url) ? cacheFirst(request) : staleWhileRevalidate(request));
});
