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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderBottomNav);
    } else {
        renderBottomNav();
    }
})();
