// ⚡ 超軽量 Service Worker（Flora v5.0 キャッシュ肥大化完全防止・自動パージ）
const CACHE_NAME = 'flora-pwa-v5.0'; // ← バージョン更新で旧85MB超のキャッシュを完全自動削除

// 最低限、オフライン時に動作させたい主要UIシェルのみ事前キャッシュ（合計数MB以内）
const PRECACHE_URLS = [
    './',
    './index.html',
    './lesson.html',
    './insights.html',
    './m/lesson.html',
    './m/insights.html',
    './m/bottom-nav.js',
    './m/style-m.css',
    './style.css?v=3.5',
    './sidebar.js',
    './api-key-manager.js?v=4.1',
    './manifest.json',
    './m/manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all(
                PRECACHE_URLS.map((url) =>
                    cache.add(url).catch((err) => {
                        console.warn('[SW v5.0] precache skipped:', url, err);
                    })
                )
            );
        })
    );
    // 新バージョンを即座に適用
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => {
                        console.log('[SW v5.0] Deleting obsolete/bloated cache:', key);
                        return caches.delete(key);
                    })
            )
        ).then(() => self.clients.claim())
    );
});

// クライアントからの即時キャッシュパージ要請に応答
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PURGE_OLD_CACHES') {
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        );
    }
});

self.addEventListener('fetch', (event) => {
    // 1. GET以外（POST等、Firebase/API通信）は素通し
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);

    // 2. 同一オリジン（自サイト）以外の外部リクエスト（Firebase Storage, Google Fonts, MathJax, CDN等）はキャッシュしない
    // ※ Chromiumのセキュリティ仕様により、不透明レスポンス（opaque response）は1件あたり約7MBのパディングが加算され、
    //    10件程度で約85MB超に激増するため。
    if (url.origin !== self.location.origin) {
        return;
    }

    // 3. API通信や大容量データ（APK, ZIP, CSV, JSONデータ, 写真画像JPG/PNG, 壁紙など）はキャッシュ除外
    const pathname = url.pathname.toLowerCase();
    if (
        pathname.startsWith('/api/') ||
        pathname.endsWith('.apk') ||
        pathname.endsWith('.zip') ||
        pathname.endsWith('.csv') ||
        pathname.endsWith('.json') ||
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.jpeg') ||
        pathname.includes('wallpaper')
    ) {
        return;
    }

    // 4. クエリパラメータ付きのHTML（例: lesson.html?mode=culture-stream 等）
    // パラメータごとに丸ごと1.9MBが複製キャッシュされるのを防ぐため、動的cache.putは行わず
    // ネットワークから取得（オフライン時はクエリなしの正規化キャッシュを参照）
    const hasQueryParams = url.search && url.search.length > 0;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // 成功した同一オリジンの静的アセット（JS, CSS, またはクエリなしの主要HTML）のみキャッシュ更新
                if (
                    !hasQueryParams &&
                    networkResponse &&
                    networkResponse.status === 200 &&
                    networkResponse.type === 'basic'
                ) {
                    const isStaticShell =
                        pathname.endsWith('.js') ||
                        pathname.endsWith('.css') ||
                        pathname.endsWith('.html') ||
                        pathname.endsWith('/');
                    if (isStaticShell) {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                }
                return networkResponse;
            })
            .catch(async () => {
                // オフライン時のフォールバック
                // 1. まず完全一致を試行
                let cached = await caches.match(event.request);
                if (cached) return cached;

                // 2. クエリパラメータ付きの場合はクエリを除いたベースURLでマッチング
                if (hasQueryParams) {
                    const cleanUrl = url.origin + url.pathname;
                    cached = await caches.match(cleanUrl);
                    if (cached) return cached;
                }

                return new Response('オフラインのため読み込めませんでした。インターネット接続を確認してください。', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                });
            })
    );
});
