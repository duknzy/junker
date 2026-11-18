import { useCallback, useSyncExternalStore } from 'react';

/**
 * 「掴んだ極意・気づきメモ」の表示/非表示。
 * 演習中はメモ自体がヒントになってしまうため、端末ごとに設定を保持する。
 */
const STORAGE_KEY = 'flora-hide-insight-memo';
const EVENT_NAME = 'flora:insight-visibility-changed';

function readHidden(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(EVENT_NAME, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(EVENT_NAME, onChange);
    window.removeEventListener('storage', onChange);
  };
}

export function useInsightMemoHidden(): [boolean, (hidden: boolean) => void] {
  const hidden = useSyncExternalStore(subscribe, readHidden, () => false);

  const setHidden = useCallback((next: boolean) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
    } catch {
      // 保存できない環境ではセッション内の状態変化のみ反映する
    }
    window.dispatchEvent(new Event(EVENT_NAME));
  }, []);

  return [hidden, setHidden];
}
