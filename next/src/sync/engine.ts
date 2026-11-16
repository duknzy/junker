import { db } from '../data/db';
import { isFirebaseConfigured } from './config';
import { onLocalChange } from './events';
import { getFirebase } from './firebase';
import { importLegacyProblems } from './legacy';
import {
  mergeSnapshots,
  normalizeSnapshot,
  toFirebaseValue,
} from './merge';
import { applySnapshot, readLocalSnapshot } from './snapshot';

const ENABLED_KEY = 'flora-sync-enabled';
const DISABLED_KEY = 'flora-sync-disabled';
const LAST_SYNC_KEY = 'flora-sync-last-at';
const USER_CACHE_KEY = 'flora-sync-user-cache';
const LEGACY_IMPORTED_PREFIX = 'flora-legacy-imported:';
const DEVICE_KEY = 'flora-device-id';
const PUSH_DELAY_MS = 2500;
const AUTO_SYNC_THROTTLE_MS = 10 * 60 * 1000; // 10分以内は自動再取得をスキップ（ローカルキャッシュ優先）

export type SyncPhase =
  | 'unconfigured'
  | 'disabled'
  | 'signedOut'
  | 'connecting'
  | 'syncing'
  | 'synced'
  | 'offline'
  | 'error';

export interface SyncUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface SyncState {
  phase: SyncPhase;
  user: SyncUser | null;
  lastSyncedAt: string | null;
  pending: boolean;
  legacySyncing: boolean;
  error: string | null;
}

const listeners = new Set<() => void>();

function readStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function readCachedUser(): SyncUser | null {
  const raw = readStorage(USER_CACHE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SyncUser;
    if (parsed && typeof parsed.uid === 'string') return parsed;
  } catch {
    // ignore
  }
  return null;
}

function initialPhase(): SyncPhase {
  if (!isFirebaseConfigured()) return 'unconfigured';
  if (readStorage(DISABLED_KEY) === '1') return 'disabled';
  if (readCachedUser()) return 'synced';
  return 'connecting';
}

let state: SyncState = {
  phase: initialPhase(),
  user: readCachedUser(),
  lastSyncedAt: readStorage(LAST_SYNC_KEY),
  pending: false,
  legacySyncing: false,
  error: null,
};

function setState(patch: Partial<SyncState>): void {
  state = { ...state, ...patch };
  for (const listener of listeners) listener();
}

export function subscribeSync(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSyncState(): SyncState {
  return state;
}

let initialized = false;
let authStarted = false;
let syncing = false;
let syncQueued = false;
let debounceTimer: number | null = null;
let localRevision = 0;

function clearDebounce(): void {
  if (debounceTimer !== null) {
    window.clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}

function schedulePush(delay = PUSH_DELAY_MS): void {
  clearDebounce();
  debounceTimer = window.setTimeout(() => {
    debounceTimer = null;
    void syncNow();
  }, delay);
}

function handleLocalChange(): void {
  localRevision += 1;
  if (!state.user) return;
  setState({ pending: true });
  schedulePush();
}

function handleOnline(): void {
  if (state.user) {
    void syncNow();
  } else if (state.phase === 'offline') {
    setState({ phase: isFirebaseConfigured() ? 'disabled' : 'unconfigured' });
  }
}

function handleOffline(): void {
  if (state.user) setState({ phase: 'offline' });
}

function isRecentlySynced(): boolean {
  const last = state.lastSyncedAt;
  if (!last) return false;
  const elapsed = Date.now() - new Date(last).getTime();
  return Number.isFinite(elapsed) && elapsed >= 0 && elapsed < AUTO_SYNC_THROTTLE_MS;
}

function handleVisibility(): void {
  if (
    document.visibilityState === 'visible' &&
    state.user &&
    navigator.onLine &&
    (state.pending || !isRecentlySynced())
  ) {
    void syncNow();
  }
}

/**
 * アプリ起動時に一度だけ呼ぶ。
 * 以前にログインしていれば Firebase Auth の復元を待って自動同期する。
 */
export function initSync(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  onLocalChange(handleLocalChange);
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  document.addEventListener('visibilitychange', handleVisibility);

  if (!isFirebaseConfigured()) {
    setState({ phase: 'unconfigured' });
    return;
  }

  if (readStorage(DISABLED_KEY) !== '1') {
    void startAuth();
  } else {
    setState({ phase: 'disabled' });
  }
}

function mapUser(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}): SyncUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      },
    );
  });
}

let legacySyncInFlight = false;
const autoImportedUids = new Set<string>();

export async function syncLegacyNow(): Promise<void> {
  const user = state.user;
  if (!user || legacySyncInFlight) return;
  legacySyncInFlight = true;
  setState({ legacySyncing: true });
  try {
    await importLegacyProblems(user.uid);
    try {
      window.localStorage.setItem(
        `${LEGACY_IMPORTED_PREFIX}${user.uid}`,
        new Date().toISOString(),
      );
    } catch {
      // ignore storage errors
    }
    await syncNow();
  } catch {
    // エラー時は通常の syncNow に委ねる
  } finally {
    legacySyncInFlight = false;
    setState({ legacySyncing: false });
  }
}

async function startAuth(): Promise<void> {
  if (authStarted) return;
  authStarted = true;

  try {
    const [{ auth }, { onAuthStateChanged }] = await Promise.all([
      getFirebase(),
      import('firebase/auth'),
    ]);

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const mapped = mapUser(user);
        window.localStorage.setItem(ENABLED_KEY, '1');
        window.localStorage.removeItem(DISABLED_KEY);
        try {
          window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(mapped));
        } catch {
          // ignore
        }

        const alreadyImportedFlag = Boolean(
          readStorage(`${LEGACY_IMPORTED_PREFIX}${user.uid}`),
        );
        const localCount = await db.problems.count().catch(() => 0);
        const hasLocalRealData = localCount > 5;

        if (alreadyImportedFlag || hasLocalRealData) {
          if (!alreadyImportedFlag && hasLocalRealData) {
            try {
              window.localStorage.setItem(
                `${LEGACY_IMPORTED_PREFIX}${user.uid}`,
                new Date().toISOString(),
              );
            } catch {
              // ignore
            }
          }
          // 既にローカル（IndexedDB）にデータがあり、直近10分以内に同期済みなら通信をスキップして即座に表示
          if (hasLocalRealData && isRecentlySynced() && !state.pending) {
            setState({
              user: mapped,
              phase: navigator.onLine ? 'synced' : 'offline',
              error: null,
            });
            return;
          }
          setState({
            user: mapped,
            phase: navigator.onLine ? 'syncing' : 'offline',
            error: null,
          });
          void syncNow();
        } else if (!autoImportedUids.has(user.uid)) {
          autoImportedUids.add(user.uid);
          setState({
            user: mapped,
            phase: navigator.onLine ? 'syncing' : 'offline',
            error: null,
          });
          void syncLegacyNow();
        }
      } else {
        window.localStorage.removeItem(USER_CACHE_KEY);
        setState({
          user: null,
          phase: isFirebaseConfigured() ? 'signedOut' : 'unconfigured',
          pending: false,
          legacySyncing: false,
        });
      }
    });
  } catch (error) {
    authStarted = false;
    setState({ phase: 'error', error: errorMessage(error) });
  }
}

export async function enableSyncForDev(): Promise<void> {
  window.localStorage.setItem(ENABLED_KEY, '1');
  window.localStorage.removeItem(DISABLED_KEY);
  await startAuth();
}

export async function signInWithGoogle(): Promise<void> {
  if (!isFirebaseConfigured()) {
    setState({
      phase: 'unconfigured',
      error: 'Firebase の設定がありません。',
    });
    return;
  }

  window.localStorage.setItem(ENABLED_KEY, '1');
  window.localStorage.removeItem(DISABLED_KEY);
  setState({ phase: 'connecting', error: null });

  try {
    await startAuth();
    const [{ auth }, { GoogleAuthProvider, signInWithPopup }] =
      await Promise.all([getFirebase(), import('firebase/auth')]);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await withTimeout(
      signInWithPopup(auth, provider),
      120_000,
      'ログインがタイムアウトしました。もう一度お試しください。',
    );
  } catch (error) {
    window.localStorage.removeItem(ENABLED_KEY);
    setState({
      phase: 'signedOut',
      user: null,
      pending: false,
      error: errorMessage(error),
    });
    throw error;
  }
}

export async function signOutFromGoogle(): Promise<void> {
  window.localStorage.removeItem(ENABLED_KEY);
  window.localStorage.setItem(DISABLED_KEY, '1');
  clearDebounce();

  try {
    const [{ auth }, { signOut }] = await Promise.all([
      getFirebase(),
      import('firebase/auth'),
    ]);
    await signOut(auth);
  } catch (error) {
    setState({ error: errorMessage(error) });
  } finally {
    setState({
      user: null,
      phase: isFirebaseConfigured() ? 'disabled' : 'unconfigured',
      pending: false,
      error: null,
    });
  }
}

function deviceId(): string {
  const existing = readStorage(DEVICE_KEY);
  if (existing) return existing;

  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  window.localStorage.setItem(DEVICE_KEY, id);
  return id;
}

/**
 * ローカルとリモートをマージして両方へ書き戻す。
 * RTDB の transaction を使うので、同時に別端末が更新しても
 * 片方の変更を丸ごと上書きしない。
 */
export async function syncNow(): Promise<void> {
  const user = state.user;
  if (!user) return;

  if (!navigator.onLine) {
    setState({ phase: 'offline' });
    return;
  }

  if (syncing) {
    syncQueued = true;
    return;
  }

  syncing = true;
  syncQueued = false;
  const revisionAtStart = localRevision;
  setState({ phase: 'syncing', error: null });

  try {
    const local = await readLocalSnapshot(deviceId());
    const [{ database }, { ref, runTransaction }] = await Promise.all([
      getFirebase(),
      import('firebase/database'),
    ]);

    const now = new Date().toISOString();
    const result = await runTransaction(
      ref(database, `users/${user.uid}/floraNext`),
      (remoteValue) => {
        const remote = normalizeSnapshot(remoteValue);
        return toFirebaseValue(mergeSnapshots(local, remote, now));
      },
    );

    if (!result.committed) {
      throw new Error('同期が中断されました。もう一度お試しください。');
    }

    const committed = normalizeSnapshot(result.snapshot.val());
    if (committed) await applySnapshot(committed, local);

    window.localStorage.setItem(LAST_SYNC_KEY, now);
    const changedDuringSync = localRevision !== revisionAtStart;
    setState({
      phase: 'synced',
      lastSyncedAt: now,
      pending: changedDuringSync,
      error: null,
    });

    if (changedDuringSync) schedulePush(600);
  } catch (error) {
    setState({
      phase: navigator.onLine ? 'error' : 'offline',
      error: errorMessage(error),
    });
  } finally {
    syncing = false;
    if (syncQueued) {
      syncQueued = false;
      void syncNow();
    }
  }
}

/** 実行中の同期が終わるまで待つ（クラウド削除との競合を避ける）。 */
async function waitForIdleSync(): Promise<void> {
  while (syncing) {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 100);
    });
  }
}

/**
 * クラウド上のスナップショットだけを削除する（ローカルは残す）。
 * 「すべて削除」でクラウド側も消すために使う。
 */
export async function deleteCloudData(): Promise<void> {
  const user = state.user;
  if (!user) return;

  clearDebounce();
  await waitForIdleSync();
  const [{ database }, { ref, remove }] = await Promise.all([
    getFirebase(),
    import('firebase/database'),
  ]);
  await remove(ref(database, `users/${user.uid}/floraNext`));
  window.localStorage.removeItem(LAST_SYNC_KEY);
  setState({ lastSyncedAt: null, pending: false });
}

export function errorMessage(error: unknown): string {
  const code =
    error && typeof error === 'object' && 'code' in error
      ? String((error as { code: unknown }).code)
      : '';

  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'ログインがキャンセルされました。';
    case 'auth/popup-blocked':
      return 'ポップアップがブロックされました。ブラウザの設定を確認してください。';
    case 'auth/unauthorized-domain':
      return 'このドメインは Firebase Authentication で許可されていません。Firebase コンソールの「承認済みドメイン」に追加してください。';
    case 'auth/operation-not-allowed':
      return 'Firebase で Google ログインが有効になっていません。Authentication の設定を確認してください。';
    case 'auth/network-request-failed':
      return 'ネットワークに接続できません。';
    case 'PERMISSION_DENIED':
      return 'Realtime Database のルールで拒否されました。Firebase の Security Rules を確認してください。';
    case 'DISCONNECTED':
      return 'ネットワークに接続できません。';
    default:
      break;
  }

  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('permission_denied') || message.includes('PERMISSION_DENIED')) {
    return 'Realtime Database のルールで拒否されました。Firebase の Security Rules を確認してください。';
  }
  return message || '同期に失敗しました。';
}
