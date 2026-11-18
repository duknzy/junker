import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import './index.css';
import { App } from './App';
import { ThemeProvider } from './core/theme';
import { ToastProvider } from './core/ui/Toast';
import { initSync } from './sync/engine';

initSync();

/**
 * PWA 用サービスワーカー。
 * - インストール済みアプリをオフラインでも起動できるようにする
 * - 更新時のみ一度だけリロードして最新版を反映する
 */
function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  const scope = import.meta.env.BASE_URL;
  const hadController = Boolean(navigator.serviceWorker.controller);

  navigator.serviceWorker
    .register(`${scope}flora-sw.js`, { scope })
    .catch((error) => {
      console.warn('[flora] service worker registration failed', error);
    });

  if (!hadController) return;

  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });
}

window.addEventListener('load', registerServiceWorker, { once: true });

if (
  import.meta.env.DEV &&
  import.meta.env.VITE_FIREBASE_USE_EMULATOR === '1'
) {
  void import('./sync/dev').then(({ installDevAuth }) => installDevAuth());
}

// GitHub Pages では /junker/ ベースパス。Vite が import.meta.env.BASE_URL を注入する。
const basename = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
