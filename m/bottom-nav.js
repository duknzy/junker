/**
 * Flora Mobile — 共通ボトムナビゲーションバー
 * 5タブ構成: 誤答ノート / 授業 / 参考書 / 気づき / 設定
 * 全モバイルページで <script src="bottom-nav.js"></script> として読み込む
 */
(function () {
    function getBasePath() {
        // 現在のURLが /m/ 配下であることを保証
        const pathname = window.location.pathname;
        const mIdx = pathname.lastIndexOf('/m/');
        if (mIdx !== -1) {
            return pathname.slice(0, mIdx + 3); // ".../m/"
        }
        if (pathname.endsWith('/m')) {
            return pathname + '/';
        }
        return './';
    }

    function renderBottomNav() {
        // 既に描画済みなら何もしない
        if (document.getElementById('flora-bottom-nav')) return;

        const currentFile = window.location.pathname.split('/').pop() || 'index.html';
        const basePath = getBasePath();

        const tabs = [
            { file: 'index.html',       icon: '🧠', label: '誤答ノート', match: ['index.html', ''] },
            { file: 'lesson.html',      icon: '📖', label: '授業',       match: ['lesson.html'] },
            { file: 'refbook.html',     icon: '📚', label: '参考書',     match: ['refbook.html'] },
            { file: 'insights.html',    icon: '🎴', label: '暗記',       match: ['insights.html', 'answer-check.html', 'timeline.html'] },
            { file: 'ai-settings.html', icon: '⚙️', label: '設定',       match: ['ai-settings.html'] },
        ];

        const nav = document.createElement('nav');
        nav.id = 'flora-bottom-nav';
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'メインナビゲーション');

        // CSS を注入
        const style = document.createElement('style');
        style.textContent = `
            #flora-bottom-nav {
                position: fixed;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 9999;
                display: flex;
                align-items: stretch;
                height: var(--bottom-nav-height, 64px);
                padding-bottom: env(safe-area-inset-bottom, 0px);
                background: rgba(255, 255, 255, 0.88);
                backdrop-filter: blur(24px) saturate(180%);
                -webkit-backdrop-filter: blur(24px) saturate(180%);
                border-top: 1px solid rgba(226, 232, 240, 0.85);
                box-shadow: 0 -4px 20px rgba(15, 23, 42, 0.05);
            }

            .bnav-tab {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 0.2rem;
                text-decoration: none;
                color: #64748B;
                font-size: 0.68rem;
                font-weight: 700;
                font-family: var(--font-heading, -apple-system, sans-serif);
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                -webkit-tap-highlight-color: transparent;
                padding: 0.35rem 0;
                min-height: 48px;
                position: relative;
            }

            .bnav-tab:active {
                transform: scale(0.92);
                opacity: 0.8;
            }

            .bnav-tab.active {
                color: var(--brand-primary, #059669);
            }

            .bnav-tab.active::before {
                content: '';
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 22px;
                height: 3.5px;
                background: var(--brand-gradient, linear-gradient(135deg, #059669 0%, #10B981 100%));
                border-radius: 9999px;
                box-shadow: 0 1px 6px rgba(5, 150, 105, 0.45);
            }

            .bnav-icon {
                font-size: 1.35rem;
                line-height: 1;
                transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .bnav-tab.active .bnav-icon {
                transform: translateY(-1.5px) scale(1.05);
            }

            .bnav-label {
                line-height: 1;
                white-space: nowrap;
                letter-spacing: 0.01em;
            }

            /* モバイルでは右下に被るAPIキーのフローティング黒丸ボタンを非表示にし、設定タブに集約 */
            #api-key-floating-btn,
            .api-key-fab-button,
            [data-api-key-fab] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        let tabsHtml = '';
        tabs.forEach(tab => {
            const isActive = tab.match && tab.match.includes(currentFile);
            const targetUrl = basePath + tab.file;
            tabsHtml += `
                <a href="${targetUrl}" class="bnav-tab ${isActive ? 'active' : ''}" aria-label="${tab.label}">
                    <span class="bnav-icon">${tab.icon}</span>
                    <span class="bnav-label">${tab.label}</span>
                </a>
            `;
        });

        nav.innerHTML = tabsHtml;
        document.body.appendChild(nav);
    }

    // --- ユーティリティ: モバイル版トースト通知 ---
    window.mToast = function (message, duration = 2500) {
        let toast = document.querySelector('.m-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'm-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
    };

    // ==========================================================================
    // 🗄️ モバイル版 壁紙 & グラスモーフィズム透過マネージャ (IndexedDB)
    // PC版 (sidebar.js / ai-settings.html) と完全に同一のDB & localStorageキーでシームレス共有
    // ==========================================================================
    const WP_DB_NAME = 'flora_wallpaper_db';
    const WP_DB_VERSION = 1;
    const WP_STORE_NAME = 'wallpaper';
    const WP_KEY = 'current';

    function openWallpaperDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(WP_DB_NAME, WP_DB_VERSION);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(WP_STORE_NAME)) {
                    db.createObjectStore(WP_STORE_NAME);
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    function saveWallpaperToDB(dataUrl) {
        return openWallpaperDB().then(db => {
            return new Promise((resolve, reject) => {
                const tx = db.transaction(WP_STORE_NAME, 'readwrite');
                const store = tx.objectStore(WP_STORE_NAME);
                store.put(dataUrl, WP_KEY);
                tx.oncomplete = () => { db.close(); resolve(); };
                tx.onerror = () => { db.close(); reject(tx.error); };
            });
        });
    }

    function loadWallpaperFromDB() {
        return openWallpaperDB().then(db => {
            return new Promise((resolve, reject) => {
                const tx = db.transaction(WP_STORE_NAME, 'readonly');
                const store = tx.objectStore(WP_STORE_NAME);
                const req = store.get(WP_KEY);
                req.onsuccess = () => { db.close(); resolve(req.result || null); };
                req.onerror = () => { db.close(); reject(req.error); };
            });
        });
    }

    function removeWallpaperFromDB() {
        return openWallpaperDB().then(db => {
            return new Promise((resolve, reject) => {
                const tx = db.transaction(WP_STORE_NAME, 'readwrite');
                const store = tx.objectStore(WP_STORE_NAME);
                store.delete(WP_KEY);
                tx.oncomplete = () => { db.close(); resolve(); };
                tx.onerror = () => { db.close(); reject(tx.error); };
            });
        });
    }

    window.floraWallpaperDB = {
        save: saveWallpaperToDB,
        load: loadWallpaperFromDB,
        remove: removeWallpaperFromDB
    };

    function applyTransparencySettings() {
        const overlay = localStorage.getItem('flora_wallpaper_overlay') || '0.22';
        const card = localStorage.getItem('flora_wallpaper_card') || '0.85';
        const blur = localStorage.getItem('flora_wallpaper_blur') || '8';

        document.documentElement.style.setProperty('--wp-overlay-opacity', overlay);
        document.documentElement.style.setProperty('--wp-card-opacity', card);
        document.documentElement.style.setProperty('--wp-blur', `${blur}px`);
    }

    function applyWallpaper(urlOrData) {
        document.body.style.setProperty('--user-wallpaper', `url("${urlOrData}")`);
        document.documentElement.style.setProperty('--user-wallpaper', `url("${urlOrData}")`);
        document.body.classList.add('has-custom-wallpaper');
        document.documentElement.classList.add('has-custom-wallpaper');
        applyTransparencySettings();
    }

    function removeWallpaper() {
        removeWallpaperFromDB().catch(err => console.warn('[Flora Mobile] DB remove error:', err));
        try { localStorage.removeItem('flora_wallpaper'); } catch(e) {}
        document.body.classList.remove('has-custom-wallpaper');
        document.documentElement.classList.remove('has-custom-wallpaper');
        document.body.style.removeProperty('--user-wallpaper');
        document.documentElement.style.removeProperty('--user-wallpaper');
    }

    window.applyFloraWallpaper = applyWallpaper;
    window.applyFloraTransparencySettings = applyTransparencySettings;
    window.removeFloraWallpaper = removeWallpaper;

    function initFloraWallpaper() {
        applyTransparencySettings();

        loadWallpaperFromDB().then(saved => {
            if (saved) {
                applyWallpaper(saved);
                return;
            }
            const legacy = localStorage.getItem('flora_wallpaper');
            if (legacy) {
                applyWallpaper(legacy);
                saveWallpaperToDB(legacy).then(() => {
                    localStorage.removeItem('flora_wallpaper');
                }).catch(() => {});
                return;
            }
            // フォールバック wallpaper.jpg のプローブ
            const probeImg = new Image();
            probeImg.onload = () => {
                applyWallpaper('../wallpaper.jpg');
            };
            probeImg.onerror = () => {
                const probeImg2 = new Image();
                probeImg2.onload = () => applyWallpaper('/wallpaper.jpg');
                probeImg2.src = '/wallpaper.jpg';
            };
            probeImg.src = '../wallpaper.jpg';
        }).catch(err => {
            console.warn('[Flora Mobile] Wallpaper DB load fallback:', err);
            const legacy = localStorage.getItem('flora_wallpaper');
            if (legacy) applyWallpaper(legacy);
        });
    }

    // 他タブでの設定変更の即時反映
    window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('flora_wallpaper_')) {
            applyTransparencySettings();
        }
    });

    // 🖼️ モバイル用 壁紙 & 表示カスタマイザー モーダル
    window.openFloraWallpaperModal = function() {
        let modal = document.getElementById('flora-wallpaper-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'flora-wallpaper-modal';
            modal.className = 'wallpaper-modal-backdrop';
            document.body.appendChild(modal);
        }

        const currentOverlay = localStorage.getItem('flora_wallpaper_overlay') || '0.22';
        const currentCard = localStorage.getItem('flora_wallpaper_card') || '0.85';
        const currentBlur = localStorage.getItem('flora_wallpaper_blur') || '8';

        modal.innerHTML = `
            <div class="wallpaper-modal-card">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.25rem;">🖼️</span>
                        <h3 style="font-family: var(--font-heading); font-size: 1rem; font-weight: 800; margin: 0; color: var(--text-primary);">壁紙 & 透過カスタマイズ</h3>
                    </div>
                    <button type="button" id="m-wp-close-btn" style="background:none; border:none; cursor:pointer; font-size:1.2rem; color:var(--text-muted); padding:0.2rem 0.4rem;">✕</button>
                </div>

                <!-- 画像アップロード・変更エリア -->
                <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                    <button type="button" class="m-btn m-btn-primary" id="m-wp-upload-btn" style="flex: 1; padding: 0.55rem 0.8rem; font-size: 0.8rem; font-weight: 700; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                        <span>📷 画像を選択 / アップロード</span>
                    </button>
                    <input type="file" id="m-wp-file-input" accept="image/*" style="display: none;">
                    <button type="button" class="m-btn" id="m-wp-remove-btn" style="color: var(--error); border-color: #FECACA; background: #FEF2F2; padding: 0.55rem 0.75rem; font-size: 0.75rem; font-weight: 700; border-radius: 10px; white-space: nowrap;">
                        🗑️ デフォルトに戻す
                    </button>
                </div>

                <!-- スライダー 1: 背景オーバーレイの濃さ -->
                <div class="wp-slider-group">
                    <div class="wp-slider-label-row">
                        <span>背景の白オーバーレイ（薄いほど壁紙鮮明）：</span>
                        <span class="wp-slider-val" id="m-wp-val-overlay">${Math.round(currentOverlay * 100)}%</span>
                    </div>
                    <input type="range" class="wp-range-input" id="m-wp-range-overlay" min="0" max="80" step="5" value="${Math.round(currentOverlay * 100)}">
                    <div style="display: flex; justify-content: space-between; font-size: 0.68rem; color: var(--text-muted);">
                        <span>0% (壁紙くっきり)</span>
                        <span>40%</span>
                        <span>80% (白め)</span>
                    </div>
                </div>

                <!-- スライダー 2: カード・パネルの不透明度 -->
                <div class="wp-slider-group">
                    <div class="wp-slider-label-row">
                        <span>カード・パネルの不透明度：</span>
                        <span class="wp-slider-val" id="m-wp-val-card">${Math.round(currentCard * 100)}%</span>
                    </div>
                    <input type="range" class="wp-range-input" id="m-wp-range-card" min="30" max="95" step="5" value="${Math.round(currentCard * 100)}">
                    <div style="display: flex; justify-content: space-between; font-size: 0.68rem; color: var(--text-muted);">
                        <span>30% (透明グラス)</span>
                        <span>60%</span>
                        <span>95% (ソリッド白)</span>
                    </div>
                </div>

                <!-- スライダー 3: すりガラスのぼかし強度 -->
                <div class="wp-slider-group">
                    <div class="wp-slider-label-row">
                        <span>すりガラスのぼかし強度 (Blur)：</span>
                        <span class="wp-slider-val" id="m-wp-val-blur">${currentBlur}px</span>
                    </div>
                    <input type="range" class="wp-range-input" id="m-wp-range-blur" min="0" max="20" step="1" value="${currentBlur}">
                    <div style="display: flex; justify-content: space-between; font-size: 0.68rem; color: var(--text-muted);">
                        <span>0px (ぼかしなし)</span>
                        <span>10px</span>
                        <span>20px (強)</span>
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
                    <button type="button" class="m-btn m-btn-primary" id="m-wp-save-btn" style="min-width: 100px; padding: 0.5rem 1rem; border-radius: 10px; font-weight: 700;">
                        完了
                    </button>
                </div>
            </div>
        `;

        modal.style.display = 'flex';

        const closeModal = () => { modal.style.display = 'none'; };
        document.getElementById('m-wp-close-btn').onclick = closeModal;
        document.getElementById('m-wp-save-btn').onclick = closeModal;
        modal.onclick = (e) => { if (e.target === modal) closeModal(); };

        const uploadBtn = document.getElementById('m-wp-upload-btn');
        const fileInput = document.getElementById('m-wp-file-input');
        const removeBtn = document.getElementById('m-wp-remove-btn');

        uploadBtn.onclick = () => fileInput.click();

        fileInput.onchange = (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const dataUrl = ev.target.result;
                saveWallpaperToDB(dataUrl).catch(err => console.warn('[Flora Mobile] Save DB error:', err));
                applyWallpaper(dataUrl);
                if (window.mToast) window.mToast('🖼️ 新しい壁紙を設定しました！');
            };
            reader.readAsDataURL(file);
        };

        removeBtn.onclick = () => {
            if (confirm("壁紙を解除してデフォルトの背景に戻しますか？")) {
                removeWallpaper();
                closeModal();
                if (window.mToast) window.mToast('壁紙をデフォルトに戻しました');
            }
        };

        const rangeOverlay = document.getElementById('m-wp-range-overlay');
        const rangeCard = document.getElementById('m-wp-range-card');
        const rangeBlur = document.getElementById('m-wp-range-blur');

        const valOverlay = document.getElementById('m-wp-val-overlay');
        const valCard = document.getElementById('m-wp-val-card');
        const valBlur = document.getElementById('m-wp-val-blur');

        rangeOverlay.oninput = (e) => {
            const val = e.target.value;
            const decimal = (val / 100).toFixed(2);
            valOverlay.textContent = `${val}%`;
            document.documentElement.style.setProperty('--wp-overlay-opacity', decimal);
            localStorage.setItem('flora_wallpaper_overlay', decimal);
        };

        rangeCard.oninput = (e) => {
            const val = e.target.value;
            const decimal = (val / 100).toFixed(2);
            valCard.textContent = `${val}%`;
            document.documentElement.style.setProperty('--wp-card-opacity', decimal);
            localStorage.setItem('flora_wallpaper_card', decimal);
        };

        rangeBlur.oninput = (e) => {
            const val = e.target.value;
            valBlur.textContent = `${val}px`;
            document.documentElement.style.setProperty('--wp-blur', `${val}px`);
            localStorage.setItem('flora_wallpaper_blur', val);
        };
    };

    // ヘッダーへの壁紙クイック設定ボタンのバインド
    function injectHeaderWallpaperButton() {
        if (document.getElementById('m-header-wp-btn')) return;

        const header = document.querySelector('.m-header') || document.querySelector('.memo-app-header');
        if (!header) return;

        const wpBtn = document.createElement('button');
        wpBtn.type = 'button';
        wpBtn.id = 'm-header-wp-btn';
        wpBtn.className = 'm-header-action memo-icon-btn';
        wpBtn.title = '壁紙 & 透過設定';
        wpBtn.innerHTML = '🖼️';
        wpBtn.style.fontSize = '1.05rem';
        wpBtn.onclick = () => {
            window.openFloraWallpaperModal();
        };

        const actions = header.querySelector('.memo-header-actions') || header.querySelector('#m-header-user-actions');
        if (actions) {
            actions.insertBefore(wpBtn, actions.firstChild);
        } else {
            header.appendChild(wpBtn);
        }
    }

    // 壁紙の初期ロード実行
    initFloraWallpaper();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            renderBottomNav();
            injectHeaderWallpaperButton();
        });
    } else {
        renderBottomNav();
        injectHeaderWallpaperButton();
    }
})();
