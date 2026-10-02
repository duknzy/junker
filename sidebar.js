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
    // 🧹 localStorage 緊急サニタイズ & 空き容量復旧 (QuotaExceededError & 強制ログアウト根本防止)
    // 巨大データ（全授業キャッシュ、全SRS進捗、壁紙画像等）が localStorage(5MB上限) を
    // 圧迫すると、Firebase Auth のトークンリフレッシュが QuotaExceededError で失敗し、
    // 認証情報が失われてアプリ内で強制ログアウトが多発する原因となります。
    // そのため巨大キャッシュはすべて IndexedDB へ逃がし、localStorage からは即座に一掃します。
    // ==========================================================================
    (function sanitizeLocalStorage() {
        try {
            const heavyKeys = [
                'flora_wallpaper',
                'cached_lessons',
                'flora_offline_all_lessons',
                'flora_srs_memorize_progress',
                'local_card_user_memos',
                'flora_timeline_user_notes'
            ];
            heavyKeys.forEach(k => {
                try { localStorage.removeItem(k); } catch(_) {}
            });

            for (let i = localStorage.length - 1; i >= 0; i--) {
                const k = localStorage.key(i);
                if (k && (k.startsWith('flora_cached_lessons_') || k.startsWith('flora_cache_'))) {
                    try { localStorage.removeItem(k); } catch(_) {}
                }
            }
        } catch(e) {
            console.warn('[Flora] sanitizeLocalStorage error:', e);
        }
    })();

    // ==========================================================================
    // 🗄️ IndexedDB 汎用キャッシュストレージ (flora_cache_db)
    // 数百MB〜数GBの容量が安全に利用可能。localStorage を一切消費しない。
    // ==========================================================================
    const CACHE_DB_NAME = 'flora_cache_db';
    const CACHE_DB_VERSION = 1;
    const CACHE_STORE_NAME = 'cache';

    function openCacheDB() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                return reject(new Error('IndexedDB not supported'));
            }
            const request = indexedDB.open(CACHE_DB_NAME, CACHE_DB_VERSION);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(CACHE_STORE_NAME)) {
                    db.createObjectStore(CACHE_STORE_NAME);
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    window.floraCacheDB = {
        async get(key) {
            try {
                const db = await openCacheDB();
                return new Promise((resolve, reject) => {
                    const tx = db.transaction(CACHE_STORE_NAME, 'readonly');
                    const store = tx.objectStore(CACHE_STORE_NAME);
                    const req = store.get(key);
                    req.onsuccess = () => { db.close(); resolve(req.result !== undefined ? req.result : null); };
                    req.onerror = () => { db.close(); reject(req.error); };
                });
            } catch(e) {
                return null;
            }
        },
        async set(key, value) {
            try {
                const db = await openCacheDB();
                return new Promise((resolve, reject) => {
                    const tx = db.transaction(CACHE_STORE_NAME, 'readwrite');
                    const store = tx.objectStore(CACHE_STORE_NAME);
                    store.put(value, key);
                    tx.oncomplete = () => { db.close(); resolve(); };
                    tx.onerror = () => { db.close(); reject(tx.error); };
                });
            } catch(e) {
                console.warn('[FloraCacheDB] set error:', key, e);
            }
        },
        async delete(key) {
            try {
                const db = await openCacheDB();
                return new Promise((resolve, reject) => {
                    const tx = db.transaction(CACHE_STORE_NAME, 'readwrite');
                    const store = tx.objectStore(CACHE_STORE_NAME);
                    store.delete(key);
                    tx.oncomplete = () => { db.close(); resolve(); };
                    tx.onerror = () => { db.close(); reject(tx.error); };
                });
            } catch(e) {
                console.warn('[FloraCacheDB] delete error:', key, e);
            }
        }
    };

    // 🛡️ 安全な localStorage ラッパー（万一容量上限に達しても不要キャッシュを一掃して認証情報を死守）
    window.safeLocalStorageSet = function(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch(e) {
            console.warn('[Flora] localStorage.setItem failed, attempting quota recovery for key:', key, e);
            try {
                for (let i = localStorage.length - 1; i >= 0; i--) {
                    const k = localStorage.key(i);
                    if (k && k !== 'flora_user' && !k.startsWith('firebase:')) {
                        if (k.includes('cache') || k.includes('notes') || k.includes('progress') || k.includes('events')) {
                            localStorage.removeItem(k);
                        }
                    }
                }
                localStorage.setItem(key, value);
            } catch(e2) {
                console.error('[Flora] Critical storage exhaustion:', e2);
            }
        }
    };

    // ==========================================================================
    // 🗄️ IndexedDB 壁紙ストレージ（localStorage の容量枯渇対策）
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
            pastLessonsTitle: '📚 過去の授業一覧',
            btnBatchGenerateDrills: '🎯 選択問題を一括生成',
            btnAutofixSubjects: '⚡ 過去の授業の教科を一括自動判別',
            sortLabel: '並び順:',
            sortCustom: '📌 自由並べ替え（ドラッグ＆ボタン）',
            sortCreatedAsc: '📅 受講日（古い順・カリキュラム順）',
            sortCreatedDesc: '📅 受講日（新しい順）',
            sortUpdatedDesc: '⚡ 最終更新日順',
            sortTitleAsc: '🔤 授業タイトル順',
            filterAll: 'すべて',
            customTabsTitle: '🏷️ マイタブ / コレクション',
            btnCreateTab: '➕ 新規タブ作成',

            // insights.html 用
            headerInsightsTitle: '💡 ナレッジ＆質問アーカイブ',
            headerInsightsSubtitle: 'これまでの演習で記録した「気づき・極意」「AI質問ログ」「暗記事項」の統合ナレッジベース',
            btnAiTermAsk: '💬 教科書・単語 AI質問',
            tabInsights: '🧠 気づき・極意メモ',
            tabMemorize: '📌 暗記事項',
            tabDrills: '🎯 授業 選択問題',
            tabQna: '💬 AI質問ログ',
            tabMnemonics: '🎴 世界史 語呂合わせ',
            searchInsightsPlaceholder: 'キーワード・単元名・問題タイトルで検索...',

            // プロフィール設定用
            profileModalTitle: '👤 プロフィール設定',
            profileNameLabel: '表示名',
            profileAvatarType: 'アバターの種類',
            profileInitialColor: 'イニシャル & カラー',
            profileEmoji: '絵文字アイコン',
            profileCustomImage: '画像アップロード',
            profileSavedToast: '✅ プロフィールを更新しました！',
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
            pastLessonsTitle: '📚 Past Lessons Archive',
            btnBatchGenerateDrills: '🎯 Batch Generate Drills',
            btnAutofixSubjects: '⚡ Auto-classify Subjects',
            sortLabel: 'Sort:',
            sortCustom: '📌 Custom Order (Drag & Buttons)',
            sortCreatedAsc: '📅 Date (Oldest / Curriculum)',
            sortCreatedDesc: '📅 Date (Newest)',
            sortUpdatedDesc: '⚡ Recently Updated',
            sortTitleAsc: '🔤 Lesson Title (A-Z)',
            filterAll: 'All',
            customTabsTitle: '🏷️ My Tabs / Collections',
            btnCreateTab: '➕ Create New Tab',

            // insights.html 用
            headerInsightsTitle: '💡 Knowledge & Q&A Archive',
            headerInsightsSubtitle: 'Integrated knowledge base for insights, AI Q&A logs, and memorization cards recorded during practice.',
            btnAiTermAsk: '💬 Textbook & Term AI Q&A',
            tabInsights: '🧠 Insights & Takeaways',
            tabMemorize: '📌 Memorization Cards',
            tabDrills: '🎯 Choice Drills',
            tabQna: '💬 AI Q&A Logs',
            tabMnemonics: '🎴 History Mnemonics',
            searchInsightsPlaceholder: 'Search by keyword, unit, or question title...',

            // プロフィール設定用
            profileModalTitle: '👤 Profile Settings',
            profileNameLabel: 'Display Name',
            profileAvatarType: 'Avatar Type',
            profileInitialColor: 'Initials & Color',
            profileEmoji: 'Emoji Icon',
            profileCustomImage: 'Upload Image',
            profileSavedToast: '✅ Profile updated successfully!',
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

        // 🛡️ ブラウザの自動翻訳プロンプト（「翻訳しますか」）を確実に抑止
        if (!document.querySelector('meta[name="google"][content="notranslate"]')) {
            const meta = document.createElement('meta');
            meta.name = 'google';
            meta.content = 'notranslate';
            document.head.appendChild(meta);
        }
        document.documentElement.classList.add('notranslate');
        document.documentElement.setAttribute('translate', 'no');
        // ブラウザに「外国語サイト」と誤認させないため lang="ja" を維持
        document.documentElement.lang = 'ja';

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

        // 💡 insights.html 向けのヘッダー要素をスマート連動
        const isInsightsPage = window.location.pathname.endsWith('insights.html') || window.location.pathname.includes('/insights');
        if (isInsightsPage) {
            document.title = currentLang === 'en' ? 'Flora | Knowledge & Q&A Archive' : 'Flora 学習ワークスペース - Flora | 質問・気づきアーカイブ';
            const pageTitleEl = document.querySelector('.page-title');
            if (pageTitleEl) pageTitleEl.textContent = t('headerInsightsTitle');
            const pageSubEl = document.querySelector('.page-subtitle');
            if (pageSubEl) pageSubEl.textContent = t('headerInsightsSubtitle');

            const btnAiTermAsk = document.getElementById('btn-open-ai-term-ask');
            if (btnAiTermAsk) btnAiTermAsk.textContent = t('btnAiTermAsk');

            const tabInsights = document.getElementById('tab-btn-insights');
            if (tabInsights) {
                const count = document.getElementById('count-insights')?.textContent || '0';
                tabInsights.innerHTML = `${t('tabInsights')} (<span id="count-insights">${count}</span>)`;
            }
            const tabMemorize = document.getElementById('tab-btn-memorize');
            if (tabMemorize) {
                const count = document.getElementById('count-memorize')?.textContent || '0';
                tabMemorize.innerHTML = `${t('tabMemorize')} (<span id="count-memorize">${count}</span>)`;
            }
            const tabDrills = document.getElementById('tab-btn-drills');
            if (tabDrills) {
                const count = document.getElementById('count-drills')?.textContent || '0';
                tabDrills.innerHTML = `${t('tabDrills')} (<span id="count-drills">${count}</span>)`;
            }
            const tabQna = document.getElementById('tab-btn-qna');
            if (tabQna) {
                const count = document.getElementById('count-qna')?.textContent || '0';
                tabQna.innerHTML = `${t('tabQna')} (<span id="count-qna">${count}</span>)`;
            }
            const tabMnemonics = document.getElementById('tab-btn-mnemonics');
            if (tabMnemonics) {
                const count = document.getElementById('count-mnemonics')?.textContent || '0';
                tabMnemonics.innerHTML = `${t('tabMnemonics')} (<span id="count-mnemonics">${count}</span>)`;
            }

            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.placeholder = t('searchInsightsPlaceholder');
            }

            const btnDrillsGrouped = document.getElementById('btn-drills-view-grouped');
            if (btnDrillsGrouped) btnDrillsGrouped.textContent = currentLang === 'en' ? '🗂 Group by Lesson' : '🗂 授業ごとにまとめる';
            const btnDrillsCards = document.getElementById('btn-drills-view-cards');
            if (btnDrillsCards) btnDrillsCards.textContent = currentLang === 'en' ? '📑 Card List' : '📑 カード一覧';
        }

        // 📖 lesson.html 向けのヘッダー要素をスマート連動
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

            // 過去の授業一覧タイトル & 一括ボタン & 並び順
            const pastLessonsTitle = document.getElementById('lesson-list-title-label') || document.querySelector('#lesson-list-wrap > div:first-child');
            if (pastLessonsTitle) pastLessonsTitle.textContent = t('pastLessonsTitle');

            const batchDrillsBtn = document.getElementById('btn-batch-generate-choice-drills');
            if (batchDrillsBtn) {
                batchDrillsBtn.textContent = t('btnBatchGenerateDrills');
            }
            const autofixBtn = document.getElementById('btn-autofix-lesson-subjects');
            if (autofixBtn) {
                autofixBtn.textContent = t('btnAutofixSubjects');
            }

            const sortSelect = document.getElementById('lesson-sort-select');
            if (sortSelect) {
                const sortOpts = {
                    custom: t('sortCustom'),
                    created_asc: t('sortCreatedAsc'),
                    created_desc: t('sortCreatedDesc'),
                    updated_desc: t('sortUpdatedDesc'),
                    title_asc: t('sortTitleAsc')
                };
                Array.from(sortSelect.options).forEach(opt => {
                    if (sortOpts[opt.value]) opt.textContent = sortOpts[opt.value];
                });
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
                <div class="sidebar-user-card" id="sidebar-user-container" style="cursor: pointer;" title="${t('profileModalTitle')}">
                    <div class="sidebar-user-avatar" id="sidebar-user-avatar">F</div>
                    <div style="flex: 1; min-width: 0;">
                        <div class="sidebar-user-name" id="sidebar-user-name">Flora Student</div>
                        <div id="sidebar-sync-text" style="font-size: 0.68rem; color: var(--text-muted);">${t('syncingLocal')}</div>
                    </div>
                    <button id="sidebar-edit-profile-btn" type="button" title="${t('profileModalTitle')}" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 0.2rem 0.35rem; border-radius: 4px; font-size: 0.8rem; line-height: 1; transition: opacity 0.15s ease;">
                        ✏️
                    </button>
                    <button id="sidebar-logout-btn" type="button" onclick="event.stopPropagation(); if(window.handleFloraLogout){window.handleFloraLogout();}else{localStorage.removeItem('flora_user'); location.reload();}" title="${t('logout')}" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 0.2rem 0.35rem; border-radius: 4px; font-size: 0.8rem; line-height: 1;">
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
        setupUserProfileControls();
        updatePageLanguage();
    }

    // 🌐 グローバル公開関数（設定画面 ai-settings.html 等から呼び出し可能）
    window.toggleFloraDarkMode = function() {
        document.documentElement.classList.add('dark-transition');
        setTimeout(() => {
            document.documentElement.classList.remove('dark-transition');
        }, 350);

        document.documentElement.classList.toggle('dark');
        const nowDark = isDark();
        localStorage.setItem('flora-dark-mode', nowDark ? 'true' : 'false');
        const meta = document.getElementById('meta-theme-color');
        if (meta) meta.setAttribute('content', nowDark ? '#131314' : '#059669');
        window.dispatchEvent(new CustomEvent('flora-theme-changed', { detail: { isDark: nowDark } }));
        return nowDark;
    };

    window.toggleFloraLanguage = function() {
        const nextLang = getLanguage() === 'ja' ? 'en' : 'ja';
        setLanguage(nextLang);
        window.dispatchEvent(new CustomEvent('flora-lang-changed', { detail: { lang: nextLang } }));
        return nextLang;
    };

    window.openFloraWallpaperModal = function() {
        openWallpaperCustomizerModal();
    };

    window.isFloraDarkMode = function() {
        return isDarkModeActive();
    };

    window.getFloraLanguage = function() {
        return getLanguage();
    };

    // 🌐 言語切替コントロール
    function setupLanguageControls() {
        const btn = document.getElementById('sidebar-lang-btn');
        if (!btn) return;
        btn.onclick = () => {
            window.toggleFloraLanguage();
        };
    }

    // 🌙 ダークモード コントロール
    function setupDarkModeControls() {
        const btn = document.getElementById('sidebar-dark-mode-btn');
        const icon = document.getElementById('sidebar-dark-mode-icon');
        const text = document.getElementById('sidebar-dark-mode-text');

        function updateUI() {
            const dark = isDarkModeActive();
            if (icon) icon.textContent = dark ? '☀️' : '🌙';
            if (text) text.textContent = dark ? t('btnLight') : t('btnDark');
            const meta = document.getElementById('meta-theme-color');
            if (meta) meta.setAttribute('content', dark ? '#131314' : '#059669');
        }

        if (btn) {
            updateUI();
            btn.onclick = () => {
                window.toggleFloraDarkMode();
                updateUI();
            };
        }

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
        let fileInput = document.getElementById('sidebar-wallpaper-input');
        if (!fileInput) {
            fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = 'sidebar-wallpaper-input';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const dataUrl = ev.target.result;
                    saveWallpaperToDB(dataUrl).catch(err => {
                        console.warn("IndexedDB wallpaper save failed:", err);
                    });
                    applyWallpaper(dataUrl);
                };
                reader.readAsDataURL(file);
            };
        }

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
        }).catch(err => {
            console.warn('[Flora] IndexedDB wallpaper load failed, trying localStorage fallback:', err);
            const fallback = localStorage.getItem('flora_wallpaper');
            if (fallback) {
                applyWallpaper(fallback);
            }
        });
    }

    // 👤 ユーザープロフィールの取得
    function getCustomProfile() {
        try {
            const raw = localStorage.getItem('flora_custom_profile');
            return raw ? JSON.parse(raw) : null;
        } catch(e) {
            return null;
        }
    }

    function updateSidebarUser() {
        try {
            const custom = getCustomProfile();
            const userJson = localStorage.getItem('flora_user') || localStorage.getItem('lolz_user');
            const defaultUser = userJson ? JSON.parse(userJson) : null;

            const nameEl = document.getElementById('sidebar-user-name');
            const avatarEl = document.getElementById('sidebar-user-avatar');

            const name = custom?.name || defaultUser?.name || "Flora Student";
            if (nameEl) nameEl.textContent = name;

            if (avatarEl) {
                avatarEl.style.display = 'inline-flex';
                avatarEl.style.alignItems = 'center';
                avatarEl.style.justifyContent = 'center';
                avatarEl.style.borderRadius = '50%';
                avatarEl.style.width = '36px';
                avatarEl.style.height = '36px';
                avatarEl.style.minWidth = '36px';
                avatarEl.style.overflow = 'hidden';
                avatarEl.style.fontWeight = '700';
                avatarEl.style.color = '#ffffff';

                if (custom) {
                    if (custom.avatarType === 'image' && custom.avatarImage) {
                        avatarEl.innerHTML = `<img src="${custom.avatarImage}" alt="${name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;">`;
                        avatarEl.style.background = 'transparent';
                    } else if (custom.avatarType === 'emoji' && custom.avatarEmoji) {
                        avatarEl.textContent = custom.avatarEmoji;
                        avatarEl.style.fontSize = '1.25rem';
                        avatarEl.style.background = custom.avatarBg || 'linear-gradient(135deg, #10B981, #059669)';
                    } else {
                        const init = (custom.avatarInitial || name.charAt(0) || 'F').toUpperCase();
                        avatarEl.textContent = init;
                        avatarEl.style.fontSize = '0.95rem';
                        avatarEl.style.background = custom.avatarBg || 'linear-gradient(135deg, #10B981, #059669)';
                    }
                } else if (defaultUser) {
                    if (defaultUser.avatar) {
                        avatarEl.innerHTML = `<img src="${defaultUser.avatar}" alt="${name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;">`;
                        avatarEl.style.background = 'transparent';
                    } else {
                        avatarEl.textContent = (name ? name.charAt(0) : 'F').toUpperCase();
                        avatarEl.style.fontSize = '0.95rem';
                        avatarEl.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                    }
                } else {
                    avatarEl.textContent = '👤';
                    avatarEl.style.fontSize = '1.1rem';
                    avatarEl.style.background = 'var(--bg-subtle)';
                    avatarEl.style.color = 'var(--text-secondary)';
                }
            }

            const syncEl = document.getElementById('sidebar-sync-text');
            if (syncEl) syncEl.textContent = t('syncingLocal');
        } catch(e) {
            console.warn('[Flora] updateSidebarUser error:', e);
        }
    }

    // 👤 プロフィール設定モーダル制御
    function setupUserProfileControls() {
        const userContainer = document.getElementById('sidebar-user-container');
        const editBtn = document.getElementById('sidebar-edit-profile-btn');
        if (!userContainer) return;

        const openHandler = (e) => {
            if (e.target.closest('#sidebar-logout-btn')) return;
            openProfileModal();
        };

        userContainer.onclick = openHandler;
        if (editBtn) editBtn.onclick = openHandler;
    }

    function openProfileModal() {
        const existing = document.getElementById('flora-profile-modal-wrap');
        if (existing) existing.remove();

        const custom = getCustomProfile() || {};
        const userJson = localStorage.getItem('flora_user') || localStorage.getItem('lolz_user');
        const defaultUser = userJson ? JSON.parse(userJson) : null;

        let curName = custom.name || defaultUser?.name || 'Flora Student';
        let curType = custom.avatarType || (custom.avatarImage ? 'image' : (custom.avatarEmoji ? 'emoji' : 'initial'));
        let curBg = custom.avatarBg || 'linear-gradient(135deg, #10B981, #059669)';
        let curInitial = custom.avatarInitial || curName.charAt(0) || 'F';
        let curEmoji = custom.avatarEmoji || '🎓';
        let curImage = custom.avatarImage || defaultUser?.avatar || '';

        const colorPalettes = [
            { bg: 'linear-gradient(135deg, #10B981, #059669)', name: 'Flora Green' },
            { bg: 'linear-gradient(135deg, #6366F1, #4F46E5)', name: 'Indigo' },
            { bg: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', name: 'Purple' },
            { bg: 'linear-gradient(135deg, #EC4899, #DB2777)', name: 'Pink' },
            { bg: 'linear-gradient(135deg, #F59E0B, #D97706)', name: 'Amber' },
            { bg: 'linear-gradient(135deg, #06B6D4, #0891B2)', name: 'Cyan' },
            { bg: 'linear-gradient(135deg, #EF4444, #DC2626)', name: 'Red' },
            { bg: 'linear-gradient(135deg, #475569, #1E293B)', name: 'Slate' }
        ];

        const presetEmojis = ['🎓', '🌿', '🦉', '🦊', '🚀', '💻', '🧠', '⚡', '🌸', '☕', '📖', '🎯', '🎨', '🧪', '🏆', '🪐', '💎', '🐾', '🦁', '🌟'];

        const modalWrap = document.createElement('div');
        modalWrap.id = 'flora-profile-modal-wrap';
        modalWrap.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);z-index:999999;display:flex;align-items:center;justify-content:center;padding:1rem;box-sizing:border-box;animation:floraFadeIn 0.2s ease;';

        modalWrap.innerHTML = `
            <div style="background:var(--bg-surface, #ffffff); border:1px solid var(--border-color, #e2e8f0); border-radius:18px; width:100%; max-width:460px; box-shadow:0 20px 40px rgba(0,0,0,0.3); overflow:hidden; display:flex; flex-direction:column; max-height:90vh; color:var(--text-primary, #1e293b); font-family:var(--font-base, sans-serif);">
                <div style="padding:1.1rem 1.4rem; border-bottom:1px solid var(--border-color, #e2e8f0); display:flex; align-items:center; justify-content:space-between; background:var(--bg-subtle, #f8fafc);">
                    <div style="font-weight:700; font-size:1.05rem; display:flex; align-items:center; gap:0.5rem;">
                        <span>👤</span> <span>${t('profileModalTitle')}</span>
                    </div>
                    <button type="button" id="btn-close-prof-modal" style="background:none; border:none; font-size:1.3rem; color:var(--text-muted, #94a3b8); cursor:pointer; line-height:1; padding:0.2rem;">&times;</button>
                </div>

                <div style="padding:1.4rem; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:1.25rem;">
                    <!-- ライブプレビュー -->
                    <div style="display:flex; align-items:center; gap:1rem; padding:0.9rem 1.1rem; background:var(--bg-subtle, #f8fafc); border:1px solid var(--border-color, #e2e8f0); border-radius:14px;">
                        <div id="prof-preview-avatar" style="width:54px; height:54px; min-width:54px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.35rem; color:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.15); overflow:hidden;"></div>
                        <div style="flex:1; min-width:0;">
                            <div style="font-size:0.75rem; color:var(--text-muted, #94a3b8); font-weight:600; margin-bottom:0.15rem;">プレビュー</div>
                            <div id="prof-preview-name" style="font-weight:700; font-size:1.05rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"></div>
                            <div style="font-size:0.7rem; color:var(--text-muted, #94a3b8);">${t('syncingLocal')}</div>
                        </div>
                    </div>

                    <!-- 名前入力 -->
                    <div>
                        <label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:0.4rem; color:var(--text-secondary, #64748b);">${t('profileNameLabel')}</label>
                        <input type="text" id="prof-input-name" value="${curName.replace(/"/g, '&quot;')}" style="width:100%; height:40px; border-radius:8px; border:1px solid var(--border-color, #cbd5e1); background:var(--bg-surface, #fff); color:var(--text-primary, #1e293b); padding:0 0.85rem; font-size:0.9rem; box-sizing:border-box;">
                    </div>

                    <!-- アバタータイプ選択タブ -->
                    <div>
                        <label style="display:block; font-size:0.8rem; font-weight:700; margin-bottom:0.5rem; color:var(--text-secondary, #64748b);">${t('profileAvatarType')}</label>
                        <div style="display:flex; gap:0.4rem; background:var(--bg-subtle, #f1f5f9); padding:0.25rem; border-radius:10px;">
                            <button type="button" id="tab-avatar-initial" style="flex:1; padding:0.45rem 0.5rem; border-radius:7px; font-size:0.76rem; font-weight:700; border:none; cursor:pointer; transition:all 0.15s ease;">${t('profileInitialColor')}</button>
                            <button type="button" id="tab-avatar-emoji" style="flex:1; padding:0.45rem 0.5rem; border-radius:7px; font-size:0.76rem; font-weight:700; border:none; cursor:pointer; transition:all 0.15s ease;">${t('profileEmoji')}</button>
                            <button type="button" id="tab-avatar-image" style="flex:1; padding:0.45rem 0.5rem; border-radius:7px; font-size:0.76rem; font-weight:700; border:none; cursor:pointer; transition:all 0.15s ease;">${t('profileCustomImage')}</button>
                        </div>
                    </div>

                    <!-- 1. イニシャル設定セクション -->
                    <div id="section-avatar-initial" style="display:none; flex-direction:column; gap:0.9rem;">
                        <div>
                            <label style="display:block; font-size:0.75rem; color:var(--text-muted, #94a3b8); margin-bottom:0.35rem;">イニシャル文字（1〜2文字）</label>
                            <input type="text" id="prof-input-initial" maxlength="2" value="${(curInitial || '').replace(/"/g, '&quot;')}" style="width:80px; height:36px; border-radius:8px; border:1px solid var(--border-color, #cbd5e1); background:var(--bg-surface, #fff); color:var(--text-primary, #1e293b); text-align:center; font-weight:700; font-size:1rem; box-sizing:border-box;">
                        </div>
                        <div>
                            <label style="display:block; font-size:0.75rem; color:var(--text-muted, #94a3b8); margin-bottom:0.45rem;">背景カラーパレット</label>
                            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;" id="prof-color-list"></div>
                        </div>
                    </div>

                    <!-- 2. 絵文字設定セクション -->
                    <div id="section-avatar-emoji" style="display:none; flex-direction:column; gap:0.9rem;">
                        <div>
                            <label style="display:block; font-size:0.75rem; color:var(--text-muted, #94a3b8); margin-bottom:0.45rem;">お好みの絵文字を選択</label>
                            <div style="display:grid; grid-template-columns:repeat(10, 1fr); gap:0.35rem;" id="prof-emoji-list"></div>
                        </div>
                        <div style="display:flex; align-items:center; gap:0.6rem;">
                            <label style="font-size:0.75rem; color:var(--text-muted, #94a3b8); white-space:nowrap;">または直接入力:</label>
                            <input type="text" id="prof-input-emoji" value="${curEmoji}" maxlength="2" style="width:60px; height:34px; border-radius:8px; border:1px solid var(--border-color, #cbd5e1); background:var(--bg-surface, #fff); color:var(--text-primary, #1e293b); text-align:center; font-size:1.1rem; box-sizing:border-box;">
                        </div>
                        <div>
                            <label style="display:block; font-size:0.75rem; color:var(--text-muted, #94a3b8); margin-bottom:0.45rem;">絵文字の背景色</label>
                            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;" id="prof-emoji-color-list"></div>
                        </div>
                    </div>

                    <!-- 3. 画像アップロードセクション -->
                    <div id="section-avatar-image" style="display:none; flex-direction:column; gap:0.9rem;">
                        <div style="border:2px dashed var(--border-color, #cbd5e1); border-radius:12px; padding:1.2rem; text-align:center; background:var(--bg-subtle, #f8fafc); cursor:pointer;" id="prof-drop-zone">
                            <input type="file" id="prof-file-input" accept="image/*" style="display:none;">
                            <div style="font-size:1.8rem; margin-bottom:0.35rem;">🖼️</div>
                            <div style="font-size:0.82rem; font-weight:700; color:var(--brand-primary, #059669); margin-bottom:0.25rem;">画像ファイルを選択</div>
                            <div style="font-size:0.72rem; color:var(--text-muted, #94a3b8);">PNG, JPG, WebP, GIF（自動で円形にトリミング＆最適化されます）</div>
                        </div>
                        ${curImage ? `<button type="button" id="btn-clear-custom-image" style="font-size:0.75rem; color:#ef4444; background:transparent; border:none; cursor:pointer; align-self:flex-start;">🗑️ 画像を削除する</button>` : ''}
                    </div>
                </div>

                <div style="padding:1rem 1.4rem; border-top:1px solid var(--border-color, #e2e8f0); display:flex; align-items:center; justify-content:space-between; background:var(--bg-subtle, #f8fafc);">
                    <button type="button" id="btn-reset-prof" style="font-size:0.75rem; color:var(--text-muted, #94a3b8); background:none; border:none; cursor:pointer; text-decoration:underline;">初期設定に戻す</button>
                    <div style="display:flex; gap:0.5rem;">
                        <button type="button" id="btn-cancel-prof" style="padding:0.45rem 0.9rem; border-radius:8px; border:1px solid var(--border-color, #cbd5e1); background:var(--bg-surface, #fff); color:var(--text-primary, #1e293b); font-size:0.82rem; font-weight:600; cursor:pointer;">${t('logout') === 'Log out' ? 'Cancel' : 'キャンセル'}</button>
                        <button type="button" id="btn-save-prof" style="padding:0.45rem 1.15rem; border-radius:8px; border:none; background:var(--brand-primary, #059669); color:#fff; font-size:0.82rem; font-weight:700; cursor:pointer; box-shadow:0 2px 6px rgba(5,150,105,0.25);">${t('logout') === 'Log out' ? 'Save' : '保存する'}</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalWrap);

        // UIバインド
        const nameInput = modalWrap.querySelector('#prof-input-name');
        const initialInput = modalWrap.querySelector('#prof-input-initial');
        const emojiInput = modalWrap.querySelector('#prof-input-emoji');
        const fileInput = modalWrap.querySelector('#prof-file-input');
        const dropZone = modalWrap.querySelector('#prof-drop-zone');
        const previewAvatar = modalWrap.querySelector('#prof-preview-avatar');
        const previewName = modalWrap.querySelector('#prof-preview-name');

        const tabInitial = modalWrap.querySelector('#tab-avatar-initial');
        const tabEmoji = modalWrap.querySelector('#tab-avatar-emoji');
        const tabImage = modalWrap.querySelector('#tab-avatar-image');
        const secInitial = modalWrap.querySelector('#section-avatar-initial');
        const secEmoji = modalWrap.querySelector('#section-avatar-emoji');
        const secImage = modalWrap.querySelector('#section-avatar-image');

        function updatePreview() {
            previewName.textContent = curName || 'Flora Student';
            previewAvatar.style.background = '';
            previewAvatar.style.color = '#ffffff';

            if (curType === 'image' && curImage) {
                previewAvatar.innerHTML = `<img src="${curImage}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;">`;
                previewAvatar.style.background = 'transparent';
            } else if (curType === 'emoji') {
                previewAvatar.innerHTML = '';
                previewAvatar.textContent = curEmoji || '🎓';
                previewAvatar.style.fontSize = '1.75rem';
                previewAvatar.style.background = curBg;
            } else {
                // initial
                previewAvatar.innerHTML = '';
                const init = (curInitial || curName.charAt(0) || 'F').toUpperCase();
                previewAvatar.textContent = init;
                previewAvatar.style.fontSize = '1.35rem';
                previewAvatar.style.background = curBg;
            }
        }

        function setTab(tab) {
            curType = tab;
            const activeStyle = 'background:var(--bg-surface, #ffffff); color:var(--brand-primary, #059669); box-shadow:0 1px 3px rgba(0,0,0,0.1);';
            const inactiveStyle = 'background:transparent; color:var(--text-secondary, #64748b); box-shadow:none;';

            tabInitial.style.cssText += (tab === 'initial' ? activeStyle : inactiveStyle);
            tabEmoji.style.cssText += (tab === 'emoji' ? activeStyle : inactiveStyle);
            tabImage.style.cssText += (tab === 'image' ? activeStyle : inactiveStyle);

            secInitial.style.display = tab === 'initial' ? 'flex' : 'none';
            secEmoji.style.display = tab === 'emoji' ? 'flex' : 'none';
            secImage.style.display = tab === 'image' ? 'flex' : 'none';

            updatePreview();
        }

        // カラーパレット描画
        function renderColors(containerId) {
            const container = modalWrap.querySelector(containerId);
            if (!container) return;
            container.innerHTML = colorPalettes.map((c, i) => `
                <div data-bg="${c.bg}" style="width:28px; height:28px; border-radius:50%; background:${c.bg}; cursor:pointer; border:2px solid ${curBg === c.bg ? '#ffffff' : 'transparent'}; box-shadow:${curBg === c.bg ? '0 0 0 2px var(--brand-primary, #059669)' : '0 1px 3px rgba(0,0,0,0.15)'}; transition:all 0.15s ease;" title="${c.name}"></div>
            `).join('');

            container.querySelectorAll('div[data-bg]').forEach(div => {
                div.onclick = () => {
                    curBg = div.getAttribute('data-bg');
                    renderColors('#prof-color-list');
                    renderColors('#prof-emoji-color-list');
                    updatePreview();
                };
            });
        }

        // 絵文字リスト描画
        const emojiContainer = modalWrap.querySelector('#prof-emoji-list');
        if (emojiContainer) {
            emojiContainer.innerHTML = presetEmojis.map(em => `
                <button type="button" data-emoji="${em}" style="background:var(--bg-subtle, #f8fafc); border:1px solid ${curEmoji === em ? 'var(--brand-primary, #059669)' : 'var(--border-color, #e2e8f0)'}; border-radius:8px; font-size:1.15rem; padding:0.35rem 0; cursor:pointer; transition:all 0.15s ease;">${em}</button>
            `).join('');

            emojiContainer.querySelectorAll('button[data-emoji]').forEach(btn => {
                btn.onclick = () => {
                    curEmoji = btn.getAttribute('data-emoji');
                    if (emojiInput) emojiInput.value = curEmoji;
                    updatePreview();
                    emojiContainer.querySelectorAll('button[data-emoji]').forEach(b => {
                        b.style.borderColor = b.getAttribute('data-emoji') === curEmoji ? 'var(--brand-primary, #059669)' : 'var(--border-color, #e2e8f0)';
                    });
                };
            });
        }

        renderColors('#prof-color-list');
        renderColors('#prof-emoji-color-list');
        setTab(curType);

        // イベントリスナー
        nameInput.oninput = (e) => {
            curName = e.target.value.trim();
            if (!curInitial || curInitial === curName.charAt(0)) {
                curInitial = curName.charAt(0) || 'F';
                if (initialInput) initialInput.value = curInitial;
            }
            updatePreview();
        };

        if (initialInput) {
            initialInput.oninput = (e) => {
                curInitial = e.target.value.trim();
                updatePreview();
            };
        }

        if (emojiInput) {
            emojiInput.oninput = (e) => {
                curEmoji = e.target.value.trim();
                updatePreview();
            };
        }

        tabInitial.onclick = () => setTab('initial');
        tabEmoji.onclick = () => setTab('emoji');
        tabImage.onclick = () => setTab('image');

        if (dropZone && fileInput) {
            dropZone.onclick = () => fileInput.click();
            fileInput.onchange = (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (evt) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const maxDim = 200;
                        let w = img.width;
                        let h = img.height;
                        if (w > h) {
                            if (w > maxDim) { h = Math.round(h * (maxDim / w)); w = maxDim; }
                        } else {
                            if (h > maxDim) { w = Math.round(w * (maxDim / h)); h = maxDim; }
                        }
                        canvas.width = w;
                        canvas.height = h;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, w, h);
                        curImage = canvas.toDataURL('image/jpeg', 0.85);
                        curType = 'image';
                        setTab('image');
                    };
                    img.src = evt.target.result;
                };
                reader.readAsDataURL(file);
            };
        }

        const clearImgBtn = modalWrap.querySelector('#btn-clear-custom-image');
        if (clearImgBtn) {
            clearImgBtn.onclick = () => {
                curImage = '';
                curType = 'initial';
                setTab('initial');
            };
        }

        // 閉じる
        const closeModal = () => modalWrap.remove();
        modalWrap.querySelector('#btn-close-prof-modal').onclick = closeModal;
        modalWrap.querySelector('#btn-cancel-prof').onclick = closeModal;
        modalWrap.onclick = (e) => { if (e.target === modalWrap) closeModal(); };

        // リセット
        modalWrap.querySelector('#btn-reset-prof').onclick = () => {
            if (confirm('プロフィール設定をリセットし、初期状態に戻しますか？')) {
                localStorage.removeItem('flora_custom_profile');
                updateSidebarUser();
                closeModal();
            }
        };

        // 保存
        modalWrap.querySelector('#btn-save-prof').onclick = () => {
            const profileData = {
                name: curName || 'Flora Student',
                avatarType: curType,
                avatarBg: curBg,
                avatarInitial: (curInitial || curName.charAt(0) || 'F').toUpperCase(),
                avatarEmoji: curEmoji || '🎓',
                avatarImage: curImage || ''
            };
            localStorage.setItem('flora_custom_profile', JSON.stringify(profileData));
            updateSidebarUser();
            closeModal();

            // 簡易トースト表示
            const toast = document.createElement('div');
            toast.textContent = t('profileSavedToast');
            toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#10B981;color:#fff;font-weight:700;font-size:0.85rem;padding:0.6rem 1.2rem;border-radius:30px;box-shadow:0 8px 24px rgba(0,0,0,0.25);z-index:9999999;animation:floraFadeIn 0.2s ease;';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2500);
        };
    }

    window.updateFloraSidebarUser = updateSidebarUser;
    window.addEventListener('storage', (e) => {
        if (e.key === 'flora_user' || e.key === 'flora_custom_profile') updateSidebarUser();
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
                                    window.safeLocalStorageSet('flora_user', JSON.stringify({
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
