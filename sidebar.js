/**
 * Flora Desktop Sidebar Navigation (PC専用・共通左側サイドバー)
 * Clean, Modern, Notion/Linear Style
 *
 * 壁紙画像は IndexedDB に保存（localStorage 容量圧迫を防ぐ）
 */
(function() {
    // ==========================================================================
    // 🌙 ダークモード初期化（PC共通・チラつき防止）
    // ==========================================================================
    (function initDarkMode() {
        const stored = localStorage.getItem('flora-dark-mode');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (stored === 'true' || (!stored && prefersDark)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    })();

    // ==========================================================================
    // 🗄️ IndexedDB 壁紙ストレージ（localStorage の容量枯渇対策）
    // localStorageは5〜10MB上限だが、IndexedDBは数百MB〜GB利用可能。
    // 壁紙DataURL(数MB)をlocalStorageに保存すると他のデータ(APIキー等)が
    // QuotaExceededErrorで保存できなくなるため、IndexedDBに移行した。
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

    // グローバルAPIとして公開（ai-settings.html 等からも利用可能にする）
    window.floraWallpaperDB = {
        save: saveWallpaperToDB,
        load: loadWallpaperFromDB,
        remove: removeWallpaperFromDB
    };

    // 🚪 共通ログアウト関数（未定義のページでも Firebase Auth & localStorage を確実に同期クリーンアップ）
    if (!window.handleFloraLogout) {
        window.handleFloraLogout = async function() {
            try {
                const { getApps } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
                const apps = getApps();
                if (apps && apps.length > 0) {
                    const { getAuth, signOut } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
                    const auth = getAuth(apps[0]);
                    await signOut(auth);
                }
            } catch(e) {
                console.warn("[Flora] Sidebar dynamic signOut fallback warning:", e);
            }
            try { localStorage.removeItem('flora_user'); } catch(e) {}
            location.reload();
        };
    }

    // ==========================================================================
    // 🌐 多言語対応 (i18n) 管理
    // ==========================================================================
    const I18N = {
        ja: {
            brandSubtitle: '学習ワークスペース',
            navSectionMain: 'メイン',
            navSectionPractice: '演習・ツール',
            navSectionSettings: '設定 & ツール',
            navDashboard: 'ダッシュボード',
            navProblem: '問題演習セッション',
            navLesson: '参考書・授業モード',
            navRefbook: '一問一答',
            navDaily: 'デイリースプリント10',
            navCustomSprint: 'カスタムスプリント',
            navAnswerCheck: 'クイック答え合わせ',
            navInsights: '質問・学びアーカイブ',
            navTimelineQuiz: '共テ年代整序特訓',
            navTimeline: '歴史 統合年表',
            navAiSettings: 'AI設定',
            badgeImportant: '重要',
            btnDark: 'ダーク',
            btnLight: 'ライト',
            btnWallpaper: '🖼️ 壁紙設定',
            btnMobile: '📱 モバイル表示',
            syncingLocal: 'ローカル同期中',
            notLoggedIn: '未ログイン',
            logout: 'ログアウト',
            langToggle: 'English',
            langTitle: '英語に切り替え / Switch to English',

            // ページヘッダー共通（lesson.html 等）
            headerLessonTitle: '📖 参考書 授業モード',
            headerLessonDocTitle: 'Flora | 参考書 授業モード',
            headerLessonsLink: '📚 授業一覧・新しい授業',
            headerBackDash: '← ダッシュボードに戻る',
            headerHistoryBtn: '🕒 閲覧履歴 (10件)',
            headerAiBtn: '✨ AIモデル設定',
            headerPolicyBtn: '⚙️ 授業方針を編集',
            headerLangToggle: 'English',
            btnStartNewLesson: '🆕 新しい授業を始める',
            recentLessonsTitle: '最近開いた授業 (過去10件)',
            btnViewAll: 'すべて見る ➔',
            btnClear: 'クリア',
            searchLessonPlaceholder: '教科や単元名で絞り込み...',
        },
        en: {
            brandSubtitle: 'Study Workspace',
            navSectionMain: 'Main',
            navSectionPractice: 'Practice & Tools',
            navSectionSettings: 'Settings & Tools',
            navDashboard: 'Dashboard',
            navProblem: 'Practice Session',
            navLesson: 'Reference & Lessons',
            navRefbook: 'Flashcards / Q&A',
            navDaily: 'Daily Sprint 10',
            navCustomSprint: 'Custom Sprint',
            navAnswerCheck: 'Quick Answer Check',
            navInsights: 'Questions & Insights',
            navTimelineQuiz: 'Chronology Drill',
            navTimeline: 'History Timeline',
            navAiSettings: 'AI Settings',
            badgeImportant: 'Important',
            btnDark: 'Dark',
            btnLight: 'Light',
            btnWallpaper: '🖼️ Wallpaper',
            btnMobile: '📱 Mobile View',
            syncingLocal: 'Syncing locally',
            notLoggedIn: 'Not signed in',
            logout: 'Log out',
            langToggle: '日本語',
            langTitle: '日本語に切り替え / Switch to Japanese',

            // ページヘッダー共通（lesson.html 等）
            headerLessonTitle: '📖 Reference & Lessons',
            headerLessonDocTitle: 'Flora | Reference & Lessons',
            headerLessonsLink: '📚 Lessons & New',
            headerBackDash: '← Back to Dashboard',
            headerHistoryBtn: '🕒 History (10)',
            headerAiBtn: '✨ AI Model Settings',
            headerPolicyBtn: '⚙️ Lesson Policy',
            headerLangToggle: '日本語',
            btnStartNewLesson: '🆕 Start New Lesson',
            recentLessonsTitle: 'Recent Lessons (Last 10)',
            btnViewAll: 'View All ➔',
            btnClear: 'Clear',
            searchLessonPlaceholder: 'Filter by subject or unit...',
        }
    };

    function getLanguage() {
        return localStorage.getItem('flora_lang') === 'en' ? 'en' : 'ja';
    }

    function t(key) {
        const lang = getLanguage();
        return (I18N[lang] && I18N[lang][key]) || (I18N.ja && I18N.ja[key]) || key;
    }

    function isDarkModeActive() {
        return document.documentElement.classList.contains('dark');
    }

    function updatePageLanguage(lang) {
        const currentLang = lang || getLanguage();
        document.documentElement.lang = currentLang;

        // data-i18n 属性を持つ要素の自動更新
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = I18N[currentLang]?.[key];
            if (translation) {
                if (el.dataset.i18nTarget === 'title') {
                    el.title = translation;
                } else if (el.dataset.i18nTarget === 'placeholder') {
                    el.placeholder = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });

        // lesson.html 向けのヘッダー要素をスマート連動
        const isLessonPage = window.location.pathname.endsWith('lesson.html') || window.location.pathname.includes('/lesson');
        if (isLessonPage) {
            document.title = t('headerLessonDocTitle');
            const pageTitleEl = document.querySelector('.page-title');
            if (pageTitleEl) pageTitleEl.textContent = t('headerLessonTitle');

            const lessonLink = document.querySelector('a.back-link[href="lesson.html"]');
            if (lessonLink) lessonLink.textContent = t('headerLessonsLink');

            const dashLink = document.querySelector('a.back-link[href="index.html"]');
            if (dashLink) dashLink.textContent = t('headerBackDash');

            const histBtn = document.getElementById('btn-recent-lessons-history');
            if (histBtn) {
                const labelSpan = histBtn.querySelector('span:last-child');
                if (labelSpan) labelSpan.textContent = currentLang === 'en' ? 'History (10)' : '閲覧履歴 (10件)';
            }

            const aiBtn = document.getElementById('btn-open-ai-studio-settings');
            if (aiBtn) {
                const labelSpan = aiBtn.querySelector('span:last-child');
                if (labelSpan) labelSpan.textContent = currentLang === 'en' ? 'AI Model Settings' : 'AIモデル設定';
            }

            const policyBtn = document.getElementById('open-settings-btn');
            if (policyBtn) {
                policyBtn.textContent = t('headerPolicyBtn');
            }

            const headerLangLabel = document.getElementById('header-lang-label');
            if (headerLangLabel) {
                headerLangLabel.textContent = t('headerLangToggle');
            }

            const headerLangBtn = document.getElementById('header-lang-btn');
            if (headerLangBtn && !headerLangBtn._boundFloraLang) {
                headerLangBtn._boundFloraLang = true;
                headerLangBtn.onclick = () => {
                    const next = getLanguage() === 'ja' ? 'en' : 'ja';
                    setLanguage(next);
                };
            }

            // 新規作成ボタンやツールバーのテキストも更新
            const newLessonToggleText = document.querySelector('#new-lesson-toggle > span:first-child');
            if (newLessonToggleText) {
                newLessonToggleText.textContent = t('btnStartNewLesson');
            }
            const searchInput = document.querySelector('.lesson-search-input');
            if (searchInput) {
                searchInput.placeholder = t('searchLessonPlaceholder');
            }
            const viewAllLink = document.getElementById('btn-open-recent-modal-link');
            if (viewAllLink) {
                viewAllLink.textContent = t('btnViewAll');
            }
            const clearLink = document.getElementById('btn-clear-recent-history-inline');
            if (clearLink) {
                clearLink.textContent = t('btnClear');
            }
        }
    }

    function setLanguage(lang) {
        localStorage.setItem('flora_lang', lang);
        renderSidebar();
        updatePageLanguage(lang);
        window.dispatchEvent(new CustomEvent('flora-lang-change', { detail: { lang } }));
    }

    window.floraLang = {
        get: getLanguage,
        set: setLanguage,
        t: t,
        updatePage: updatePageLanguage
    };

    // ==========================================================================

    function renderSidebar() {
        const sidebarMount = document.getElementById('flora-sidebar');
        if (!sidebarMount) return;

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        const navSections = [
            {
                title: t('navSectionMain'),
                items: [
                    { href: 'index.html', icon: '📊', label: t('navDashboard'), match: ['index.html', ''] },
                    { href: 'problem.html', icon: '✏️', label: t('navProblem'), match: ['problem.html'] },
                    { href: 'lesson.html', icon: '📖', label: t('navLesson'), match: ['lesson.html'] },
                    { href: 'refbook.html', icon: '📝', label: t('navRefbook'), match: ['refbook.html'] },
                ]
            },
            {
                title: t('navSectionPractice'),
                items: [
                    { href: 'daily.html', icon: '📅', label: t('navDaily'), match: ['daily.html'] },
                    { href: 'custom-sprint.html', icon: '⚡', label: t('navCustomSprint'), match: ['custom-sprint.html'] },
                    { href: 'answer-check.html', icon: '✅', label: t('navAnswerCheck'), match: ['answer-check.html'] },
                    { href: 'insights.html', icon: '💡', label: t('navInsights'), match: ['insights.html'] },
                    { href: 'timeline.html?quiz=true', icon: '🎯', label: t('navTimelineQuiz'), badge: t('badgeImportant'), match: ['timeline.html?quiz=true'] },
                    { href: 'timeline.html', icon: '🏛️', label: t('navTimeline'), match: ['timeline.html'] },
                ]
            },
            {
                title: t('navSectionSettings'),
                items: [
                    { href: 'ai-settings.html', icon: '⚙️', label: t('navAiSettings'), match: ['ai-settings.html'] },
                ]
            }
        ];

        const isTimelineQuizActive = window.location.pathname.endsWith('timeline.html') && (window.location.search.includes('quiz') || window.location.search.includes('drill'));

        let navHtml = '';
        navSections.forEach(section => {
            navHtml += `<div class="sidebar-section">`;
            navHtml += `<div class="sidebar-section-title">${section.title}</div>`;
            section.items.forEach(item => {
                let isActive = false;
                if (item.href === 'timeline.html?quiz=true') {
                    isActive = isTimelineQuizActive;
                } else if (item.href === 'timeline.html') {
                    isActive = window.location.pathname.endsWith('timeline.html') && !isTimelineQuizActive;
                } else {
                    isActive = item.match && item.match.includes(currentPath);
                }
                const onclickAttr = item.onclick ? `onclick="${item.onclick}"` : '';
                const badgeHtml = item.badge ? `<span class="sidebar-item-badge" style="background: var(--brand-light); color: var(--brand-primary); font-size: 0.65rem; padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 700; margin-left: auto;">${item.badge}</span>` : '';
                navHtml += `
                    <a href="${item.href}" ${onclickAttr} class="sidebar-item ${isActive ? 'active' : ''}">
                        <span class="sidebar-item-icon">${item.icon}</span>
                        <span>${item.label}</span>
                        ${badgeHtml}
                    </a>
                `;
            });
            navHtml += `</div>`;
        });

        const darkActive = isDarkModeActive();

        sidebarMount.className = 'app-sidebar';
        sidebarMount.innerHTML = `
            <div class="sidebar-header">
                <a href="index.html" class="sidebar-brand">
                    <div class="sidebar-brand-icon">🌱</div>
                    <div class="sidebar-brand-text">
                        <span class="sidebar-brand-title">Flora</span>
                        <span class="sidebar-brand-badge">${t('brandSubtitle')}</span>
                    </div>
                </a>
            </div>

            <div class="sidebar-nav-container">
                ${navHtml}
            </div>

            <div class="sidebar-footer">
                <div style="display: flex; gap: 0.4rem; margin-bottom: 0.4rem;">
                    <button type="button" id="sidebar-dark-mode-btn" title="テーマ切り替え / Toggle Theme" class="sidebar-item" style="flex: 1; padding: 0.35rem 0.5rem; font-size: 0.74rem; background: var(--bg-subtle); justify-content: center; border: 1px solid var(--border-color); cursor: pointer;">
                        <span id="sidebar-dark-mode-icon">${darkActive ? '☀️' : '🌙'}</span>
                        <span id="sidebar-dark-mode-text" style="margin-left: 0.35rem;">${darkActive ? t('btnLight') : t('btnDark')}</span>
                    </button>
                    <button type="button" id="sidebar-wallpaper-btn" title="壁紙や透過度をカスタマイズ" class="sidebar-item" style="flex: 1; padding: 0.35rem 0.5rem; font-size: 0.74rem; background: var(--bg-subtle); justify-content: center; border: 1px solid var(--border-color);">
                        <span>${t('btnWallpaper')}</span>
                    </button>
                    <input type="file" id="sidebar-wallpaper-input" accept="image/*" style="display: none;">
                </div>
                <div style="display: flex; gap: 0.4rem; margin-bottom: 0.4rem;">
                    <button type="button" id="sidebar-lang-btn" title="${t('langTitle')}" class="sidebar-item" style="flex: 1; padding: 0.35rem 0.5rem; font-size: 0.74rem; background: var(--bg-subtle); justify-content: center; border: 1px solid var(--border-color); cursor: pointer;">
                        <span>🌐</span>
                        <span id="sidebar-lang-text" style="margin-left: 0.35rem; font-weight: 600;">${t('langToggle')}</span>
                    </button>
                    <a href="m/lesson.html" class="sidebar-item" style="flex: 1; padding: 0.35rem 0.5rem; font-size: 0.74rem; background: var(--bg-subtle); justify-content: center; border: 1px solid var(--border-color); text-decoration: none;">
                        <span>${t('btnMobile')}</span>
                    </a>
                </div>
                <div class="sidebar-user-card" id="sidebar-user-container">
                    <div class="sidebar-user-avatar" id="sidebar-user-avatar">F</div>
                    <div style="flex: 1; min-width: 0;">
                        <div class="sidebar-user-name" id="sidebar-user-name">Flora Student</div>
                        <div id="sidebar-sync-text" style="font-size: 0.68rem; color: var(--text-muted);">${t('syncingLocal')}</div>
                    </div>
                    <button id="sidebar-logout-btn" onclick="if(window.handleFloraLogout){window.handleFloraLogout();}else{localStorage.removeItem('flora_user'); location.reload();}" title="${t('logout')}" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.75rem;">
                        🚪
                    </button>
                </div>
            </div>
        `;

        // ユーザー情報の同期 & 壁紙イベント & ダークモードイベント & 言語切替イベントのバインド
        updateSidebarUser();
        setupWallpaperControls();
        setupDarkModeControls();
        setupLanguageControls();
        updatePageLanguage();
    }

    // 🌐 言語切替コントロール
    function setupLanguageControls() {
        const btn = document.getElementById('sidebar-lang-btn');
        if (!btn) return;
        btn.onclick = () => {
            const nextLang = getLanguage() === 'ja' ? 'en' : 'ja';
            setLanguage(nextLang);
        };
    }

    // 🌙 ダークモード コントロール
    function setupDarkModeControls() {
        const btn = document.getElementById('sidebar-dark-mode-btn');
        const icon = document.getElementById('sidebar-dark-mode-icon');
        const text = document.getElementById('sidebar-dark-mode-text');
        if (!btn) return;

        function updateUI() {
            const dark = isDarkModeActive();
            if (icon) icon.textContent = dark ? '☀️' : '🌙';
            if (text) text.textContent = dark ? t('btnLight') : t('btnDark');
            const meta = document.getElementById('meta-theme-color');
            if (meta) meta.setAttribute('content', dark ? '#131314' : '#059669');
        }

        updateUI();

        btn.onclick = () => {
            document.documentElement.classList.add('dark-transition');
            setTimeout(() => {
                document.documentElement.classList.remove('dark-transition');
            }, 350);

            document.documentElement.classList.toggle('dark');
            const nowDark = isDark();
            localStorage.setItem('flora-dark-mode', nowDark ? 'true' : 'false');
            updateUI();
        };

        // OSテーマ変更検知
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const stored = localStorage.getItem('flora-dark-mode');
            if (!stored) {
                if (e.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                updateUI();
            }
        });
    }

    // 🖼️ 壁紙 & 透過カスタマイザー モーダル
    function setupWallpaperControls() {
        const btn = document.getElementById('sidebar-wallpaper-btn');
        const input = document.getElementById('sidebar-wallpaper-input');
        if (!btn || !input) return;

        btn.onclick = () => {
            openWallpaperCustomizerModal();
        };

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const dataUrl = ev.target.result;
                // IndexedDB に保存（容量制限が大きいため安全）
                saveWallpaperToDB(dataUrl).catch(err => {
                    console.warn("IndexedDB wallpaper save failed:", err);
                });
                applyWallpaper(dataUrl);
                updateCustomizerPreview();
            };
            reader.readAsDataURL(file);
        };
    }

    function openWallpaperCustomizerModal() {
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
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 0.8rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.2rem;">🖼️</span>
                        <h3 style="font-family: var(--font-heading); font-size: 1rem; font-weight: 800; margin: 0;">壁紙 & 表示カスタマイザー</h3>
                    </div>
                    <button type="button" class="modal-close-btn" id="wp-modal-close-btn" style="background:none; border:none; cursor:pointer; font-size:1.1rem; color:var(--text-muted);">✕</button>
                </div>

                <!-- 画像変更エリア -->
                <div style="display: flex; gap: 0.6rem; align-items: center;">
                    <button type="button" class="flora-btn flora-btn-primary btn-sm" id="wp-change-img-btn" style="flex: 1;">
                        📷 画像ファイルを変更
                    </button>
                    <button type="button" class="flora-btn flora-btn-ghost btn-sm" id="wp-remove-btn" style="color: var(--error);">
                        🗑️ デフォルトに戻す
                    </button>
                </div>

                <!-- スライダー 1: 背景オーバーレイの濃さ -->
                <div class="wp-slider-group">
                    <div class="wp-slider-label-row">
                        <span>背景の白オーバーレイ（薄いほど壁紙が鮮明）：</span>
                        <span class="wp-slider-val" id="wp-val-overlay">${Math.round(currentOverlay * 100)}%</span>
                    </div>
                    <input type="range" class="wp-range-input" id="wp-range-overlay" min="0" max="80" step="5" value="${Math.round(currentOverlay * 100)}">
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
                        <span class="wp-slider-val" id="wp-val-card">${Math.round(currentCard * 100)}%</span>
                    </div>
                    <input type="range" class="wp-range-input" id="wp-range-card" min="30" max="95" step="5" value="${Math.round(currentCard * 100)}">
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
                        <span class="wp-slider-val" id="wp-val-blur">${currentBlur}px</span>
                    </div>
                    <input type="range" class="wp-range-input" id="wp-range-blur" min="0" max="20" step="1" value="${currentBlur}">
                    <div style="display: flex; justify-content: space-between; font-size: 0.68rem; color: var(--text-muted);">
                        <span>0px (ぼかしなし)</span>
                        <span>10px</span>
                        <span>20px (強)</span>
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--border-color); padding-top: 0.8rem;">
                    <button type="button" class="flora-btn flora-btn-primary btn-sm" id="wp-save-btn" style="min-width: 90px;">
                        完了
                    </button>
                </div>
            </div>
        `;

        modal.style.display = 'flex';

        // イベントバインド
        const closeBtn = document.getElementById('wp-modal-close-btn');
        const saveBtn = document.getElementById('wp-save-btn');
        const changeImgBtn = document.getElementById('wp-change-img-btn');
        const removeBtn = document.getElementById('wp-remove-btn');
        const fileInput = document.getElementById('sidebar-wallpaper-input');

        const rangeOverlay = document.getElementById('wp-range-overlay');
        const rangeCard = document.getElementById('wp-range-card');
        const rangeBlur = document.getElementById('wp-range-blur');

        const valOverlay = document.getElementById('wp-val-overlay');
        const valCard = document.getElementById('wp-val-card');
        const valBlur = document.getElementById('wp-val-blur');

        const closeModal = () => { modal.style.display = 'none'; };
        closeBtn.onclick = closeModal;
        saveBtn.onclick = closeModal;
        modal.onclick = (e) => { if (e.target === modal) closeModal(); };

        changeImgBtn.onclick = () => { fileInput.click(); };

        removeBtn.onclick = () => {
            if (confirm("壁紙を解除してデフォルトの背景に戻しますか？")) {
                // IndexedDB から削除
                removeWallpaperFromDB().catch(err => console.warn("IndexedDB wallpaper remove failed:", err));
                // 旧 localStorage の残骸もクリーンアップ
                try { localStorage.removeItem('flora_wallpaper'); } catch(e) {}
                document.body.classList.remove('has-custom-wallpaper');
                document.body.style.removeProperty('--user-wallpaper');
                closeModal();
            }
        };

        // スライダーリアルタイム変更
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
    }

    function updateCustomizerPreview() {
        applyTransparencySettings();
    }

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
        document.body.classList.add('has-custom-wallpaper');
        applyTransparencySettings();
    }

    function initWallpaper() {
        applyTransparencySettings();

        // IndexedDB から壁紙を読み込む（非同期）
        loadWallpaperFromDB().then(saved => {
            if (saved) {
                applyWallpaper(saved);
                return;
            }

            // 旧 localStorage に壁紙が残っていれば IndexedDB に移行し、localStorage から削除する
            const legacyWallpaper = localStorage.getItem('flora_wallpaper');
            if (legacyWallpaper) {
                applyWallpaper(legacyWallpaper);
                saveWallpaperToDB(legacyWallpaper).then(() => {
                    localStorage.removeItem('flora_wallpaper');
                    console.info('[Flora] 壁紙を localStorage → IndexedDB に移行しました（容量節約）');
                }).catch(err => {
                    console.warn('[Flora] IndexedDB 移行失敗（localStorage を維持）:', err);
                });
                return;
            }

            // フォルダ内の wallpaper.jpg を自動プローブ
            const probeImg = new Image();
            probeImg.onload = () => {
                applyWallpaper('./wallpaper.jpg');
            };
            probeImg.src = './wallpaper.jpg';
        }).catch(err => {
            console.warn('[Flora] IndexedDB wallpaper load failed, trying localStorage fallback:', err);
            // IndexedDB が使えない場合は localStorage を試す
            const fallback = localStorage.getItem('flora_wallpaper');
            if (fallback) {
                applyWallpaper(fallback);
            } else {
                const probeImg = new Image();
                probeImg.onload = () => { applyWallpaper('./wallpaper.jpg'); };
                probeImg.src = './wallpaper.jpg';
            }
        });
    }

    function updateSidebarUser() {
        try {
            const userJson = localStorage.getItem('flora_user') || localStorage.getItem('lolz_user');
            const nameEl = document.getElementById('sidebar-user-name');
            const avatarEl = document.getElementById('sidebar-user-avatar');
            if (userJson) {
                const user = JSON.parse(userJson);
                if (nameEl && user.name) nameEl.textContent = user.name;
                if (avatarEl) {
                    if (user.avatar) {
                        avatarEl.innerHTML = `<img src="${user.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
                    } else if (user.name) {
                        avatarEl.textContent = user.name.charAt(0).toUpperCase();
                    }
                }
            } else {
                if (nameEl) nameEl.textContent = t('notLoggedIn');
                if (avatarEl) avatarEl.textContent = '👤';
            }
            const syncEl = document.getElementById('sidebar-sync-text');
            if (syncEl) syncEl.textContent = t('syncingLocal');
        } catch(e) {}
    }

    window.updateFloraSidebarUser = updateSidebarUser;
    window.addEventListener('storage', (e) => {
        if (e.key === 'flora_user') updateSidebarUser();
    });

    // 壁紙の即時適用
    initWallpaper();

    // Firebase Auth 状態の自動検知と同期（全ページ共通）
    async function initAuthSync() {
        try {
            const { getApps } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
            let attached = false;
            const attach = async () => {
                if (attached) return true;
                const apps = getApps();
                if (apps && apps.length > 0) {
                    try {
                        const { getAuth, onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
                        const auth = getAuth(apps[0]);
                        onAuthStateChanged(auth, (user) => {
                            if (user) {
                                try {
                                    localStorage.setItem('flora_user', JSON.stringify({
                                        uid: user.uid,
                                        name: user.displayName || user.email?.split('@')[0] || "Flora Student",
                                        email: user.email || "",
                                        avatar: user.photoURL || ""
                                    }));
                                } catch(e) {}
                            } else {
                                try { localStorage.removeItem('flora_user'); } catch(e) {}
                            }
                            updateSidebarUser();
                        });
                        attached = true;
                        return true;
                    } catch(e) {
                        return false;
                    }
                }
                return false;
            };

            if (!await attach()) {
                let attempts = 0;
                const timer = setInterval(async () => {
                    attempts++;
                    if (await attach() || attempts > 20) clearInterval(timer);
                }, 500);
            }
        } catch(e) {}
    }
    initAuthSync();

    // DOM読み込み完了時に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderSidebar);
    } else {
        renderSidebar();
    }
})();
