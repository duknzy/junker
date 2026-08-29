/**
 * Flora Desktop Sidebar Navigation (PC専用・共通左側サイドバー)
 * Clean, Modern, Notion/Linear Style
 */
(function() {
    function renderSidebar() {
        const sidebarMount = document.getElementById('flora-sidebar');
        if (!sidebarMount) return;

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        const navSections = [
            {
                title: 'メイン',
                items: [
                    { href: 'index.html', icon: '📊', label: 'ダッシュボード', match: ['index.html', ''] },
                    { href: 'problem.html', icon: '✏️', label: '問題演習セッション', match: ['problem.html'] },
                    { href: 'lesson.html', icon: '📖', label: '参考書・授業モード', match: ['lesson.html'] },
                    { href: 'refbook.html', icon: '📝', label: '一問一答', match: ['refbook.html'] },
                ]
            },
            {
                title: '演習・ツール',
                items: [
                    { 
                        href: 'javascript:void(0)', 
                        onclick: 'if(window.openStudyClockPopout)window.openStudyClockPopout(event)', 
                        icon: '⏱️', 
                        label: 'StudyClock', 
                        badge: '小窓で開く',
                        match: [] 
                    },
                    { href: 'daily.html', icon: '📅', label: 'デイリースプリント10', match: ['daily.html'] },
                    { href: 'custom-sprint.html', icon: '⚡', label: 'カスタムスプリント', match: ['custom-sprint.html'] },
                    { href: 'answer-check.html', icon: '✅', label: 'クイック答え合わせ', match: ['answer-check.html'] },
                    { href: 'insights.html', icon: '💡', label: '質問・学びアーカイブ', match: ['insights.html'] },
                    { href: 'timeline.html', icon: '🏛️', label: '歴史 統合年表', match: ['timeline.html'] },
                ]
            },
            {
                title: '設定 & ツール',
                items: [
                    { href: 'ai-settings.html', icon: '⚙️', label: 'AI設定', match: ['ai-settings.html'] },
                ]
            }
        ];

        let navHtml = '';
        navSections.forEach(section => {
            navHtml += `<div class="sidebar-section">`;
            navHtml += `<div class="sidebar-section-title">${section.title}</div>`;
            section.items.forEach(item => {
                const isActive = item.match && item.match.includes(currentPath);
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

        sidebarMount.className = 'app-sidebar';
        sidebarMount.innerHTML = `
            <div class="sidebar-header">
                <a href="index.html" class="sidebar-brand">
                    <div class="sidebar-brand-icon">🌱</div>
                    <div class="sidebar-brand-text">
                        <span class="sidebar-brand-title">Flora</span>
                        <span class="sidebar-brand-badge">学習ワークスペース</span>
                    </div>
                </a>
            </div>

            <div class="sidebar-nav-container">
                <!-- ⏱️ 集中タイマー クイックウィジェット -->
                <div class="sidebar-section" style="margin-bottom: 0.2rem;">
                    <a href="javascript:void(0)" onclick="if(window.openTimerPopout)window.openTimerPopout(event)" class="sidebar-item global-timer-link" id="sidebar-timer-btn" style="background: var(--bg-subtle); border: 1px solid var(--border-color);">
                        <span class="sidebar-item-icon">⏱️</span>
                        <span>集中タイマー</span>
                        <span class="sidebar-item-badge" id="sidebar-timer-badge" style="background: var(--brand-light); color: var(--brand-primary);">小窓で開く</span>
                    </a>
                </div>

                ${navHtml}
            </div>

            <div class="sidebar-footer">
                <div style="display: flex; gap: 0.4rem; margin-bottom: 0.4rem;">
                    <button type="button" id="sidebar-wallpaper-btn" title="壁紙や透過度をカスタマイズ" class="sidebar-item" style="flex: 1; padding: 0.35rem 0.5rem; font-size: 0.74rem; background: var(--bg-subtle); justify-content: center; border: 1px solid var(--border-color);">
                        <span>🖼️ 壁紙 & 透過設定</span>
                    </button>
                    <input type="file" id="sidebar-wallpaper-input" accept="image/*" style="display: none;">
                </div>
                <a href="m/index.html" class="sidebar-item" style="padding: 0.35rem 0.5rem; font-size: 0.74rem; background: var(--bg-subtle); justify-content: center; border: 1px solid var(--border-color); margin-bottom: 0.4rem; text-decoration: none;">
                    <span>📱 モバイル表示</span>
                </a>
                <div class="sidebar-user-card" id="sidebar-user-container">
                    <div class="sidebar-user-avatar" id="sidebar-user-avatar">F</div>
                    <div style="flex: 1; min-width: 0;">
                        <div class="sidebar-user-name" id="sidebar-user-name">Flora Student</div>
                        <div style="font-size: 0.68rem; color: var(--text-muted);">ローカル同期中</div>
                    </div>
                    <button id="sidebar-logout-btn" onclick="if(window.handleFloraLogout){window.handleFloraLogout();}else{localStorage.removeItem('flora_user'); location.reload();}" title="ログアウト" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.75rem;">
                        🚪
                    </button>
                </div>
            </div>
        `;

        // ユーザー情報の同期 & 壁紙イベントのバインド
        updateSidebarUser();
        setupWallpaperControls();
    }

    // ⏱️ StudyClock 小窓ポップアップ関数
    window.openStudyClockPopout = function(e) {
        if (e) e.preventDefault();
        const w = 1180;
        const h = 800;
        const left = Math.max(0, Math.floor((window.screen.width - w) / 2));
        const top = Math.max(0, Math.floor((window.screen.height - h) / 2));
        window.open(
            'study/index.html',
            'StudyClockPopoutWindow',
            `width=${w},height=${h},top=${top},left=${left},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
        );
    };

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
                try {
                    localStorage.setItem('flora_wallpaper', dataUrl);
                } catch(err) {
                    console.warn("Storage quota exceeded, applying session only");
                }
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
                localStorage.removeItem('flora_wallpaper');
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

        const saved = localStorage.getItem('flora_wallpaper');
        if (saved) {
            applyWallpaper(saved);
            return;
        }

        // フォルダ内の wallpaper.jpg を自動プローブ
        const probeImg = new Image();
        probeImg.onload = () => {
            applyWallpaper('./wallpaper.jpg');
        };
        probeImg.src = './wallpaper.jpg';
    }

    function updateSidebarUser() {
        try {
            const userJson = localStorage.getItem('flora_user') || localStorage.getItem('lolz_user');
            if (userJson) {
                const user = JSON.parse(userJson);
                const nameEl = document.getElementById('sidebar-user-name');
                const avatarEl = document.getElementById('sidebar-user-avatar');
                if (nameEl && user.name) nameEl.textContent = user.name;
                if (avatarEl) {
                    if (user.avatar) {
                        avatarEl.innerHTML = `<img src="${user.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
                    } else if (user.name) {
                        avatarEl.textContent = user.name.charAt(0).toUpperCase();
                    }
                }
            }
        } catch(e) {}
    }

    // 壁紙の即時適用
    initWallpaper();

    // DOM読み込み完了時に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderSidebar);
    } else {
        renderSidebar();
    }
})();
