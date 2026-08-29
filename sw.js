// ⚡ 軽量 Service Worker（Flora v3.2 高速マルチAI並列・壁紙・STEPウィザード対応）
const CACHE_NAME = 'flora-pwa-v3.2'; // ← バージョンを上げて古いキャッシュを完全破棄

// 最低限、オフライン時に救いたい主要ページだけ事前キャッシュ
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
    './style.css?v=3.2',
    './sidebar.js',
    './manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // 個々のURLが404等でもinstall全体を失敗させない
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
                    .map((key) => caches.delete(key))
            )
        ).then(() => clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // GET以外（POST等、Firebase/API呼び出し含む）はSWを介さずそのまま素通し
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // 成功したレスポンスはキャッシュを更新しておく（オフライン精度向上）
                const clone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                return networkResponse;
            })
            .catch(async () => {
                const cached = await caches.match(event.request);
                if (cached) {
                    return cached;
                }
                // キャッシュにも無い場合は必ずResponseを返す（undefinedを渡さない）
                return new Response('オフラインのため読み込めませんでした。', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                });
            })
    );
});
