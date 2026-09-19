// ⚡ 軽量 Service Worker（Flora v3.7 キャッシュ肥大化防止・完全更新）
const CACHE_NAME = 'flora-pwa-v3.7'; // ← バージョン更新で旧キャッシュを完全自動削除

// 最低限、オフライン時に救いたい主要シェルだけ事前キャッシュ
const PRECACHE_URLS = [
    './',
    './index.html',
    './problem.html',
    './lesson.html',
    './refbook.html',
    './answer-check.html',
    './custom-sprint.html',
    './daily.html',
    './insights.html',
    './timeline.html',
    './ai-settings.html',
    './style.css?v=3.5',
    './sidebar.js?v=3.5',
    './api-key-manager.js?v=3.6',
    './manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all(
                PRECACHE_URLS.map((url) =>
                    cache.add(url).catch((err) => {
                        console.warn('[SW] precache failed:', url, err);
                    })
                )
            );
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => {
                        console.log('[SW] Deleting old bloated cache:', key);
                        return caches.delete(key);
                    })
            )
        ).then(() => clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // GET以外（POST等、Firebase/API呼び出し含む）はSWを介さずそのまま素通し
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);

    // 1. 同一オリジン（自サイト）以外の外部リクエスト（Firebase Storage、Google Fonts、CDN等）はCache Storageに溜めない
    // ※ Chromeのセキュリティ仕様により、クロスオリジンの不透明レスポンス（opaque response）は1件あたり約7MBのパディングが加算され、
    //    10件程度画像やCDNを読み込むだけで90MB超に激増するため。
    if (url.origin !== self.location.origin) {
        return;
    }

    // 2. APKや大容量バイナリ、壁紙画像等はキャッシュ除外
    if (url.pathname.endsWith('.apk') || url.pathname.endsWith('.zip') || url.pathname.includes('wallpaper.jpg')) {
        return;
    }

    // 3. APIリクエストはキャッシュしない
    if (url.pathname.startsWith('/api/')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // 成功した同一オリジンのレスポンスのみキャッシュを更新（オフライン精度維持）
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const clone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return networkResponse;
            })
            .catch(async () => {
                const cached = await caches.match(event.request);
                if (cached) {
                    return cached;
                }
                return new Response('オフラインのため読み込めませんでした。', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                });
            })
    );
});

