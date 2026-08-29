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
                    { href: 'daily.html', icon: '📅', label: 'デイリースプリント10', match: ['daily.html'] },
                    { href: 'custom-sprint.html', icon: '⏱️', label: 'カスタムスプリント', match: ['custom-sprint.html'] },
                    { href: 'answer-check.html', icon: '⚡', label: 'クイック答え合わせ', match: ['answer-check.html'] },
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
                const isActive = item.match.includes(currentPath);
                navHtml += `
                    <a href="${item.href}" class="sidebar-item ${isActive ? 'active' : ''}">
                        <span class="sidebar-item-icon">${item.icon}</span>
                        <span>${item.label}</span>
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

        // ユーザー情報の同期
        updateSidebarUser();
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

    // DOM読み込み完了時に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderSidebar);
    } else {
        renderSidebar();
    }
})();
