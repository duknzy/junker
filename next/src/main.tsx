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
