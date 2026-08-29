/**
 * Flora Mobile — 共通ボトムナビゲーションバー
 * 5タブ構成: 誤答ノート / 授業 / 参考書 / 気づき / 設定
 * 全モバイルページで <script src="bottom-nav.js"></script> として読み込む
 */
(function () {
    function renderBottomNav() {
        // 既に描画済みなら何もしない
        if (document.getElementById('flora-bottom-nav')) return;

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        const tabs = [
            { href: 'index.html',       icon: '🧠', label: '誤答ノート', match: ['index.html', ''] },
            { href: 'lesson.html',      icon: '📖', label: '授業',       match: ['lesson.html'] },
            { href: 'refbook.html',     icon: '📚', label: '参考書',     match: ['refbook.html'] },
            { href: 'insights.html',    icon: '💡', label: '気づき',     match: ['insights.html', 'answer-check.html', 'timeline.html'] },
            { href: 'ai-settings.html', icon: '⚙️', label: '設定',       match: ['ai-settings.html'] },
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
                z-index: 150;
                display: flex;
                align-items: stretch;
                height: var(--bottom-nav-height, 64px);
                padding-bottom: env(safe-area-inset-bottom, 0px);
                background: rgba(255, 255, 255, 0.92);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-top: 1px solid var(--border-subtle, #F1F5F9);
                box-shadow: 0 -2px 12px rgba(15, 23, 42, 0.04);
            }

            .bnav-tab {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 0.15rem;
                text-decoration: none;
                color: var(--text-muted, #94A3B8);
                font-size: 0.65rem;
                font-weight: 600;
                font-family: var(--font-base, sans-serif);
                transition: color 0.15s;
                -webkit-tap-highlight-color: transparent;
                padding: 0.25rem 0;
                min-height: 44px;
                position: relative;
            }

            .bnav-tab:active {
                opacity: 0.7;
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
                width: 24px;
                height: 2.5px;
                background: var(--brand-primary, #059669);
                border-radius: 0 0 4px 4px;
            }

            .bnav-icon {
                font-size: 1.35rem;
                line-height: 1;
            }

            .bnav-label {
                line-height: 1;
                white-space: nowrap;
            }

            /* 他ページへの badge（未消化など）*/
            .bnav-badge {
                position: absolute;
                top: 4px;
                right: calc(50% - 18px);
                min-width: 16px;
                height: 16px;
                padding: 0 4px;
                background: var(--error, #EF4444);
                color: #fff;
                font-size: 0.6rem;
                font-weight: 800;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 1;
            }
        `;
        document.head.appendChild(style);

        let tabsHtml = '';
        tabs.forEach(tab => {
            const isActive = tab.match && tab.match.includes(currentPath);
            tabsHtml += `
                <a href="${tab.href}" class="bnav-tab ${isActive ? 'active' : ''}" aria-label="${tab.label}">
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

    // DOMContentLoaded または即時実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderBottomNav);
    } else {
        renderBottomNav();
    }
})();
