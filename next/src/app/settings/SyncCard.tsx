import {
  Cloud,
  CloudOff,
  Loader2,
  LogIn,
  LogOut,
  RefreshCw,
  TriangleAlert,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { useToast } from '@/core/ui/Toast';
import {
  signInWithGoogle,
  signOutFromGoogle,
  syncNow,
  type SyncState,
} from '@/sync/engine';
import { useSyncState } from '@/sync/useSync';

function formatDateTime(iso: string | null): string {
  if (!iso) return '未同期';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '未同期';
  return `${date.getMonth() + 1}/${date.getDate()} ${String(
    date.getHours(),
  ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function StatusBadge({ state }: { state: SyncState }) {
  if (state.phase === 'connecting' || state.phase === 'syncing') {
    return (
      <Badge tone="accent">
        <Loader2 size={12} className="animate-spin" />
        同期中
      </Badge>
    );
  }
  if (state.phase === 'error') {
    return <Badge tone="danger">エラー</Badge>;
  }
  if (state.phase === 'offline') {
    return (
      <Badge tone="warning">
        <CloudOff size={12} />
        オフライン
      </Badge>
    );
  }
  if (state.pending) {
    return <Badge tone="warning">未同期</Badge>;
  }
  if (state.phase === 'synced') {
    return <Badge tone="accent">同期済み</Badge>;
  }
  return <Badge>未接続</Badge>;
}

export function SyncCard() {
  const state = useSyncState();
  const [busy, setBusy] = useState<'login' | 'logout' | 'sync' | null>(null);
  const { toast } = useToast();

  async function handleLogin() {
    setBusy('login');
    try {
      await signInWithGoogle();
      toast('Google アカウントでログインしました。', 'success');
    } catch {
      // エラーは state.error に表示する
    } finally {
      setBusy(null);
    }
  }

  async function handleLogout() {
    if (
      !window.confirm(
        'この端末のクラウド同期を停止します。ローカルの学習データは削除されません。',
      )
    ) {
      return;
    }
    setBusy('logout');
    try {
      await signOutFromGoogle();
      toast('クラウド同期を停止しました。', 'info');
    } finally {
      setBusy(null);
    }
  }

  async function handleSync() {
    setBusy('sync');
    try {
      await syncNow();
    } finally {
      setBusy(null);
    }
  }

  const signedIn = Boolean(state.user);
  const working = state.phase === 'syncing' || state.phase === 'connecting';

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cloud size={16} className="text-muted" />
          <h2 className="text-sm font-semibold">クラウド同期</h2>
        </div>
        <StatusBadge state={state} />
      </div>

      {state.phase === 'unconfigured' ? (
        <>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Firebase の環境変数が未設定です。クラウド同期を使うには
            <code className="mx-1 text-ink">VITE_FIREBASE_*</code>
            を設定してビルドしてください。
          </p>
          <p className="mt-2 text-xs text-muted">
            詳しくは <code className="text-ink">next/README.md</code> の
            「クラウド同期」を参照してください。
          </p>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            ローカルが正。Google でログインすると、問題・復習履歴・授業・演習を
            クラウドにバックアップし、別の端末とマージします。
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            画像は同期されません。この端末にのみ保存されます。
          </p>

          {signedIn ? (
            <>
              <div className="mt-4 rounded-[10px] bg-surface-2 px-4 py-3">
                <p className="truncate text-sm font-medium">
                  {state.user?.displayName || 'Google アカウント'}
                </p>
                {state.user?.email ? (
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {state.user.email}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-muted">
                  最終同期: {formatDateTime(state.lastSyncedAt)}
                  {state.pending ? ' · 変更は数秒後に自動同期されます' : ''}
                </p>
              </div>

              {state.error ? (
                <div className="mt-3 flex items-start gap-2 rounded-[10px] border border-danger/25 bg-danger-soft/40 px-3 py-2.5 text-xs leading-relaxed text-danger">
                  <TriangleAlert size={14} className="mt-0.5 shrink-0" />
                  <span>{state.error}</span>
                </div>
              ) : null}

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={handleSync}
                  disabled={working || busy !== null}
                >
                  {working || busy === 'sync' ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <RefreshCw size={15} />
                  )}
                  {working ? '同期中…' : '今すぐ同期'}
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={handleLogout}
                  disabled={busy !== null}
                >
                  <LogOut size={15} />
                  ログアウト
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                className="mt-4 w-full sm:w-auto"
                onClick={handleLogin}
                disabled={busy !== null || working}
              >
                {busy === 'login' || working ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LogIn size={16} />
                )}
                {busy === 'login' || working ? '接続中…' : 'Google でログイン'}
              </Button>

              {state.error ? (
                <div className="mt-3 flex items-start gap-2 rounded-[10px] border border-danger/25 bg-danger-soft/40 px-3 py-2.5 text-xs leading-relaxed text-danger">
                  <TriangleAlert size={14} className="mt-0.5 shrink-0" />
                  <span>{state.error}</span>
                </div>
              ) : null}
            </>
          )}
        </>
      )}
    </Card>
  );
}
