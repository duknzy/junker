import {
  BookMarked,
  BookOpen,
  Loader2,
  LogIn,
  NotebookPen,
  RefreshCw,
  Settings,
  Sprout,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { signInWithGoogle, syncLegacyNow } from '@/sync/engine';
import { useSyncState } from '@/sync/useSync';
import { cn } from '../lib/cn';
import { useToast } from '../ui/Toast';

const navItems = [
  { to: '/', label: 'ダッシュボード', icon: BookOpen, end: true },
  { to: '/practice/bunkei', label: '文系の数学', icon: BookMarked, end: false },
  { to: '/practice', label: '演習・復習', icon: Zap, end: true },
  { to: '/notes', label: '気づき・暗記', icon: NotebookPen, end: false },
  { to: '/settings', label: '設定', icon: Settings, end: false },
];

export function AppShell() {
  const location = useLocation();
  const isWideWorkspace =
    location.pathname === '/' ||
    location.pathname === '/problems' ||
    location.pathname.startsWith('/practice/bunkei');
  const sync = useSyncState();
  const { toast } = useToast();
  const [loginBusy, setLoginBusy] = useState(false);

  async function handleQuickLogin() {
    if (loginBusy) return;
    setLoginBusy(true);
    try {
      await signInWithGoogle();
      toast(
        'Googleでログインしました。Firebase上の誤答問題・気づき一覧を自動引き継ぎします。',
        'success',
      );
    } catch {
      // エラーは設定カード・バナー側でも確認可能
    } finally {
      setLoginBusy(false);
    }
  }

  async function handleQuickResync() {
    try {
      await syncLegacyNow();
      toast('Firebaseから最新の誤答・気づきデータを同期しました。', 'success');
    } catch {
      toast('同期に失敗しました。', 'error');
    }
  }

  const isWorking =
    loginBusy ||
    sync.legacySyncing ||
    sync.phase === 'connecting' ||
    sync.phase === 'syncing';

  return (
    <div className="relative min-h-dvh">
      {/* 全画面背景画像（オリジナル画質・フィルターなし） */}
      <div
        className="flora-app-backdrop"
        aria-hidden="true"
        style={{ backgroundImage: `url('${import.meta.env.BASE_URL}images/app-bg.jpg')` }}
      />

      <aside className="flora-glass fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-border bg-surface px-3 py-5 lg:flex">
        <div className="mb-7 flex items-center gap-2.5 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-accent-soft text-accent-ink">
            <Sprout size={18} strokeWidth={2} />
          </span>
          <div className="leading-tight">
            <p className="text-[0.95rem] font-semibold tracking-[-0.01em]">Flora</p>
            <p className="text-[0.65rem] text-muted">学び直しのワークスペース</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-[9px] px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-accent-soft font-medium text-accent-ink'
                    : 'text-muted hover:bg-surface-2 hover:text-ink',
                )
              }
            >
              <item.icon size={17} strokeWidth={1.9} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* 左下アカウント＆Firebase引き継ぎステータス（旧Floraスタイル） */}
        <div className="mt-3 rounded-[10px] border border-border bg-surface-2 p-2.5">
          {sync.user ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/35 bg-accent-soft text-sm leading-none"
                  aria-hidden="true"
                >
                  ⚡
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-xs font-semibold text-ink">
                    {sync.user.displayName || 'Flora User'}
                  </p>
                  <p className="truncate text-[0.65rem] text-muted">
                    {sync.legacySyncing
                      ? '旧データ引継中…'
                      : sync.phase === 'syncing'
                        ? 'クラウド同期中…'
                        : 'Firebase 同期済'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleQuickResync}
                disabled={isWorking}
                title="Firebaseから旧データ・誤答・気づきを再取得"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] text-muted transition-colors hover:bg-surface hover:text-ink disabled:opacity-50"
              >
                <RefreshCw
                  size={13}
                  className={cn(isWorking && 'animate-spin')}
                />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleQuickLogin}
              disabled={isWorking}
              className="flex w-full items-center justify-center gap-1.5 rounded-[8px] bg-accent px-2.5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isWorking ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <LogIn size={14} />
              )}
              {isWorking ? '接続中…' : 'Googleログインで旧データ同期'}
            </button>
          )}
        </div>
      </aside>

      <main className="relative z-10 lg:pl-56">
        <div
          className={cn(
            'mx-auto w-full',
            isWideWorkspace
              ? 'max-w-[1800px] px-3 pb-24 pt-4 sm:px-5 lg:pb-8 lg:pt-5'
              : 'max-w-5xl px-4 pb-28 pt-7 sm:px-6 lg:pb-14 lg:pt-10',
          )}
        >
          <Outlet />
        </div>
      </main>

      <nav className="flora-glass fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[0.65rem] transition-colors',
                  isActive ? 'font-medium text-accent-ink' : 'text-muted',
                )
              }
            >
              <item.icon size={20} strokeWidth={1.8} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
