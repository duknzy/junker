import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export const DEFAULT_GLASS_OPACITY = 52;
export const DEFAULT_GLASS_BLUR = 12;

interface ThemeApi {
  mode: ThemeMode;
  resolved: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  /** すりガラスの不透明度（10〜95%、小さいほど薄い/透明） */
  glassOpacity: number;
  setGlassOpacity: (value: number) => void;
  /** すりガラスのぼかし強さ（0〜24px） */
  glassBlur: number;
  setGlassBlur: (value: number) => void;
  resetGlassSettings: () => void;
}

const STORAGE_KEY = 'flora-theme';
const GLASS_OPACITY_KEY = 'flora-glass-opacity';
const GLASS_BLUR_KEY = 'flora-glass-blur';

const ThemeContext = createContext<ThemeApi | null>(null);

function systemPrefersDark(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

function readStoredNumber(
  key: string,
  fallback: number,
  min: number,
  max: number,
): number {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? clamp(Math.round(parsed), min, max) : fallback;
  } catch {
    return fallback;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system'
      ? stored
      : 'system';
  });
  const [systemDark, setSystemDark] = useState(systemPrefersDark);
  const [glassOpacity, setGlassOpacityState] = useState<number>(() =>
    readStoredNumber(GLASS_OPACITY_KEY, DEFAULT_GLASS_OPACITY, 10, 95),
  );
  const [glassBlur, setGlassBlurState] = useState<number>(() =>
    readStoredNumber(GLASS_BLUR_KEY, DEFAULT_GLASS_BLUR, 0, 24),
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const resolved: 'light' | 'dark' =
    mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    document.documentElement.style.colorScheme = resolved;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', resolved === 'dark' ? '#0c0c0d' : '#fafaf9');
  }, [resolved]);

  useEffect(() => {
    const root = document.documentElement;
    const alpha = clamp(glassOpacity / 100, 0.1, 0.95);
    const alpha2 = Number(Math.max(0.06, alpha * 0.65).toFixed(3));
    const softAlpha = Number(Math.min(0.95, Math.max(0.18, alpha * 1.2)).toFixed(3));
    const borderAlpha = Number(Math.min(0.85, Math.max(0.22, alpha * 0.9)).toFixed(3));

    root.style.setProperty('--surface-alpha', alpha.toFixed(3));
    root.style.setProperty('--surface-2-alpha', alpha2.toFixed(3));
    root.style.setProperty('--soft-alpha', softAlpha.toFixed(3));
    root.style.setProperty('--border-alpha', borderAlpha.toFixed(3));
    root.style.setProperty('--glass-blur', `${clamp(glassBlur, 0, 24)}px`);
  }, [glassOpacity, glassBlur]);

  const value = useMemo<ThemeApi>(
    () => ({
      mode,
      resolved,
      setMode: (next) => {
        setModeState(next);
        localStorage.setItem(STORAGE_KEY, next);
      },
      glassOpacity,
      setGlassOpacity: (next) => {
        const clamped = clamp(Math.round(next), 10, 95);
        setGlassOpacityState(clamped);
        localStorage.setItem(GLASS_OPACITY_KEY, String(clamped));
      },
      glassBlur,
      setGlassBlur: (next) => {
        const clamped = clamp(Math.round(next), 0, 24);
        setGlassBlurState(clamped);
        localStorage.setItem(GLASS_BLUR_KEY, String(clamped));
      },
      resetGlassSettings: () => {
        setGlassOpacityState(DEFAULT_GLASS_OPACITY);
        setGlassBlurState(DEFAULT_GLASS_BLUR);
        localStorage.setItem(GLASS_OPACITY_KEY, String(DEFAULT_GLASS_OPACITY));
        localStorage.setItem(GLASS_BLUR_KEY, String(DEFAULT_GLASS_BLUR));
      },
    }),
    [mode, resolved, glassOpacity, glassBlur],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeApi {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
