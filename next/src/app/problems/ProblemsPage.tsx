import { useLiveQuery } from 'dexie-react-hooks';
import {
  ArchiveRestore,
  ArrowRight,
  BookMarked,
  BookOpen,
  CheckSquare,
  Flag,
  Flame,
  GraduationCap,
  Lightbulb,
  Loader2,
  LogIn,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Star,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '@/core/lib/cn';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { EmptyState } from '@/core/ui/EmptyState';
import { Input } from '@/core/ui/Field';
import { GlassSelect } from '@/core/ui/GlassSelect';
import { Skeleton } from '@/core/ui/Spinner';
import { useToast } from '@/core/ui/Toast';
import {
  computeMarathonProgress,
  resetMarathonProgress,
  setMarathonScope,
  startNextMarathonLap,
  useMarathon,
} from '@/data/marathon';
import {
  bulkDeleteProblems,
  bulkUpdateProblems,
  getCachedProblems,
  getCachedStats,
  getStats,
  listProblems,
} from '@/data/repo';
import { isDue } from '@/data/srs';
import { SUBJECTS } from '@/data/subjects';
import type { Problem } from '@/data/types';
import { ProblemInspectorPane } from '@/features/problem/ProblemInspectorPane';
import { ProblemListItem } from '@/features/problem/ProblemListItem';
import { signInWithGoogle, syncLegacyNow } from '@/sync/engine';
import { useSyncState } from '@/sync/useSync';
import { LessonsPanel } from './LessonsPanel';

type Tab = 'problems' | 'lessons';
type SortMode = 'oldest' | 'newest' | 'errors' | 'insight' | 'due';

const sortOptions: Array<{ value: SortMode; label: string }> = [
  { value: 'oldest', label: '🗓️ 追加日が古い順' },
  { value: 'newest', label: '🆕 追加日が新しい順' },
  { value: 'errors', label: '🔥 誤答数が多い順' },
  { value: 'insight', label: '🧠 気づき更新順' },
  { value: 'due', label: '⚡ 復習優先順' },
];

export function ProblemsPage() {
  const problems = useLiveQuery(() => listProblems(), [], getCachedProblems());
  const stats = useLiveQuery(() => getStats(), [], getCachedStats());
  const marathon = useMarathon();
  const sync = useSyncState();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: Tab = searchParams.get('tab') === 'lessons' ? 'lessons' : 'problems';
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('all');
  const [unit, setUnit] = useState('all');
  const [sortMode, setSortMode] = useState<SortMode>('oldest');
  const [onlyDue, setOnlyDue] = useState(false);
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [onlyInsight, setOnlyInsight] = useState(false);
  const [onlyMarathonUncleared, setOnlyMarathonUncleared] = useState(false);
  const [visibleCount, setVisibleCount] = useState(40);
  const [selectedId, setSelectedId] = useState<string | null>(
    searchParams.get('id'),
  );
  const [busySync, setBusySync] = useState(false);

  // 一括整理モード用ステート
  const [bulkMode, setBulkMode] = useState(false);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [bulkSubject, setBulkSubject] = useState<string>('keep');
  const [bulkUnit, setBulkUnit] = useState<string>('');
  const [busyBulk, setBusyBulk] = useState(false);

  const navigate = useNavigate();

  const handleSelectProblem = useCallback((picked: Problem) => {
    setSelectedId(picked.id);
  }, []);

  const handleToggleCheck = useCallback((id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  function setTab(next: Tab) {
    setSearchParams(next === 'lessons' ? { tab: 'lessons' } : {}, { replace: true });
  }

  async function handleLoginAndImport() {
    setBusySync(true);
    try {
      await signInWithGoogle();
      toast(
        'Googleでログインしました。Firebase上の誤答問題・気づき一覧を自動引き継ぎします。',
        'success',
      );
    } catch {
      toast('ログインに失敗しました。設定画面からもログインできます。', 'error');
    } finally {
      setBusySync(false);
    }
  }

  async function handleResyncLegacy() {
    setBusySync(true);
    try {
      await syncLegacyNow();
      toast('Firebaseから誤答問題・気づき一覧・質問ログを同期しました。', 'success');
    } catch {
      toast('同期に失敗しました。', 'error');
    } finally {
      setBusySync(false);
    }
  }

  const subjects = useMemo(() => {
    if (!problems) return [];
    return Array.from(new Set(problems.map((problem) => problem.subject)));
  }, [problems]);

  const units = useMemo(() => {
    if (!problems) return [];
    const pool =
      subject === 'all'
        ? problems
        : problems.filter((problem) => problem.subject === subject);
    return Array.from(
      new Set(pool.map((problem) => problem.unit).filter(Boolean)),
    );
  }, [problems, subject]);

  const insightTotal = useMemo(() => {
    if (!problems) return 0;
    return problems.filter((p) => Boolean(p.insight?.trim())).length;
  }, [problems]);

  // 全問マラソン進捗（ID集合ベースで不整合ゼロ）
  const marathonProgress = useMemo(() => {
    return computeMarathonProgress(problems ?? [], marathon, selectedId);
  }, [problems, marathon, selectedId]);

  const filtered = useMemo(() => {
    if (!problems) return [];
    const q = query.trim().toLowerCase();
    const retryTargetSet =
      marathon.onlyRetryMode && marathon.retryTargetIds.length > 0
        ? new Set(marathon.retryTargetIds)
        : null;

    const list = problems.filter((problem) => {
      if (subject !== 'all' && problem.subject !== subject) return false;
      if (unit !== 'all' && problem.unit !== unit) return false;
      if (onlyDue && !isDue(problem.nextReviewAt)) return false;
      if (onlyPinned && !problem.pinned) return false;
      if (onlyInsight && !problem.insight?.trim()) return false;
      if (
        onlyMarathonUncleared &&
        marathonProgress.clearedSet.has(problem.id)
      ) {
        return false;
      }
      if (retryTargetSet && !retryTargetSet.has(problem.id)) {
        return false;
      }
      if (!q) return true;
      return [
        problem.shortTitle,
        problem.title,
        problem.unit,
        problem.subject,
        problem.insight ?? '',
        problem.trap,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });

    list.sort((a, b) => {
      if (sortMode === 'oldest') {
        return a.createdAt.localeCompare(b.createdAt);
      }
      if (sortMode === 'newest') {
        return b.createdAt.localeCompare(a.createdAt);
      }
      if (sortMode === 'errors') {
        if (b.errorCount !== a.errorCount) return b.errorCount - a.errorCount;
        return b.createdAt.localeCompare(a.createdAt);
      }
      if (sortMode === 'insight') {
        const aHas = Boolean(a.insight?.trim()) ? 1 : 0;
        const bHas = Boolean(b.insight?.trim()) ? 1 : 0;
        if (bHas !== aHas) return bHas - aHas;
        const aTime = a.insightUpdatedAt || a.updatedAt || a.createdAt;
        const bTime = b.insightUpdatedAt || b.updatedAt || b.createdAt;
        return bTime.localeCompare(aTime);
      }
      return a.nextReviewAt.localeCompare(b.nextReviewAt);
    });

    return list;
  }, [
    problems,
    query,
    subject,
    unit,
    sortMode,
    onlyDue,
    onlyPinned,
    onlyInsight,
    onlyMarathonUncleared,
    marathon.onlyRetryMode,
    marathon.retryTargetIds,
    marathonProgress.clearedSet,
  ]);

  // フィルタ変更時は表示件数を初期値（40件）にリセット
  useEffect(() => {
    setVisibleCount(40);
  }, [
    query,
    subject,
    unit,
    sortMode,
    onlyDue,
    onlyPinned,
    onlyInsight,
    onlyMarathonUncleared,
  ]);

  // 選択中の問題（未選択・フィルタ外の場合は先頭問題を自動選択）
  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !filtered.some((p) => p.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const visibleProblems = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  const selectedProblem = useMemo(() => {
    if (!filtered.length) return null;
    return filtered.find((p) => p.id === selectedId) ?? filtered[0] ?? null;
  }, [filtered, selectedId]);

  // 自己採点後の自動次問送り（マラソン連動）
  const handleProblemReviewed = useCallback(
    (reviewedId: string) => {
      if (!marathon.autoAdvance) return;
      const curIdx = filtered.findIndex((p) => p.id === reviewedId);
      if (curIdx >= 0) {
        for (let i = curIdx + 1; i < filtered.length; i += 1) {
          if (!marathonProgress.clearedSet.has(filtered[i].id)) {
            setSelectedId(filtered[i].id);
            return;
          }
        }
      }
      const next = filtered.find(
        (p) => p.id !== reviewedId && !marathonProgress.clearedSet.has(p.id),
      );
      if (next) {
        setSelectedId(next.id);
      }
    },
    [filtered, marathon.autoAdvance, marathonProgress.clearedSet],
  );

  // 一括操作ハンドラ
  async function handleBulkApplyPatch() {
    const ids = Array.from(checkedIds);
    if (ids.length === 0) return;
    const patch: Partial<Pick<Problem, 'subject' | 'unit'>> = {};
    if (bulkSubject !== 'keep') patch.subject = bulkSubject;
    if (bulkUnit.trim()) patch.unit = bulkUnit.trim();
    if (!patch.subject && !patch.unit) {
      toast('変更する教科または単元名を指定してください。', 'info');
      return;
    }
    setBusyBulk(true);
    try {
      const count = await bulkUpdateProblems(ids, patch);
      toast(`${count} 件の教科・単元を一括更新しました。`, 'success');
      setBulkUnit('');
      setBulkSubject('keep');
      setCheckedIds(new Set());
    } finally {
      setBusyBulk(false);
    }
  }

  async function handleBulkPin(pinned: boolean) {
    const ids = Array.from(checkedIds);
    if (ids.length === 0) return;
    setBusyBulk(true);
    try {
      const count = await bulkUpdateProblems(ids, { pinned });
      toast(
        `${count} 件のピン留めを${pinned ? 'ON' : '解除'}しました。`,
        'success',
      );
      setCheckedIds(new Set());
    } finally {
      setBusyBulk(false);
    }
  }

  async function handleBulkResetErrors() {
    const ids = Array.from(checkedIds);
    if (ids.length === 0) return;
    setBusyBulk(true);
    try {
      const count = await bulkUpdateProblems(ids, { errorCount: 0 });
      toast(`${count} 件の誤答回数を 0 にリセットしました。`, 'success');
      setCheckedIds(new Set());
    } finally {
      setBusyBulk(false);
    }
  }

  async function handleBulkDelete() {
    const ids = Array.from(checkedIds);
    if (ids.length === 0) return;
    if (
      !window.confirm(
        `選択中の ${ids.length} 件の問題を一括削除しますか？この操作は取り消せません。`,
      )
    ) {
      return;
    }
    setBusyBulk(true);
    try {
      const count = await bulkDeleteProblems(ids);
      toast(`${count} 件の問題を一括削除しました。`, 'success');
      setCheckedIds(new Set());
    } finally {
      setBusyBulk(false);
    }
  }

  const isSyncWorking =
    busySync ||
    sync.legacySyncing ||
    sync.phase === 'connecting' ||
    sync.phase === 'syncing';

  const hasOnlyDemoOrEmpty =
    !problems || problems.length === 0 || problems.every((p) => p.demo);

  return (
    <div className="space-y-3">
      {/* 1行スリム・コマンドバー（今日の復習・学習ステータス・モード切替・ショートカット） */}
      <Card className="px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 左側：今日の復習 ＆ 統計バッジ */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 rounded-[9px] border border-accent/35 bg-accent-soft/50 px-3 py-1.5">
              <Zap size={15} className="text-accent-ink" />
              <span className="text-xs font-semibold text-ink">今日の復習</span>
              <span className="text-base font-extrabold tabular-nums text-accent-ink">
                {stats?.due ?? 0}
              </span>
              <span className="text-[0.7rem] text-muted">問</span>
              <Button
                size="sm"
                onClick={() => navigate('/practice/review')}
                disabled={!stats || stats.due === 0}
                className="ml-1 h-7 px-2.5 text-xs"
              >
                開始
                <ArrowRight size={13} />
              </Button>
            </div>

            <div className="hidden items-center gap-3 text-xs text-muted xl:flex">
              <span>
                登録 <strong className="tabular-nums text-ink">{stats?.total ?? 0}</strong> 問
              </span>
              <span aria-hidden>·</span>
              <span>
                🧠 気づき <strong className="tabular-nums text-ink">{insightTotal}</strong> 件
              </span>
              <span aria-hidden>·</span>
              <span>
                今週復習{' '}
                <strong className="tabular-nums text-ink">
                  {stats?.reviewedThisWeek ?? 0}
                </strong>
              </span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Flame size={13} className="text-warning" />
                連続 <strong className="tabular-nums text-ink">{stats?.streak ?? 0}</strong> 日
              </span>
            </div>
          </div>

          {/* 右側：タブ切替・文系数学・同期・問題登録 */}
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center rounded-[9px] border border-border bg-surface-2 p-0.5">
              <button
                type="button"
                onClick={() => setTab('problems')}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1 text-xs font-semibold transition-colors',
                  tab === 'problems'
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-ink',
                )}
              >
                <BookOpen size={13} />
                誤答ノート
              </button>
              <button
                type="button"
                onClick={() => setTab('lessons')}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1 text-xs font-semibold transition-colors',
                  tab === 'lessons'
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-ink',
                )}
              >
                <GraduationCap size={13} />
                授業・AI講義
              </button>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/practice/bunkei')}
            >
              <BookMarked size={14} />
              文系の数学
            </Button>

            {sync.user ? (
              <button
                type="button"
                onClick={handleResyncLegacy}
                disabled={isSyncWorking}
                title="Firebase上の旧Floraデータと同期"
                className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-border bg-surface-2 px-2.5 text-xs font-medium text-muted transition-colors hover:text-ink disabled:opacity-50"
              >
                <RefreshCw
                  size={13}
                  className={cn(isSyncWorking && 'animate-spin text-accent-ink')}
                />
                {sync.legacySyncing ? '引継中…' : '同期'}
              </button>
            ) : null}

            <Button size="sm" onClick={() => navigate('/problems/new')}>
              <Plus size={15} />
              問題を登録
            </Button>
          </div>
        </div>
      </Card>

      {/* 🏁 全問マラソン進捗バー（IDベース完全新設計・不整合ゼロ） */}
      {tab === 'problems' && problems && problems.length > 0 ? (
        <Card className="px-4 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Flag size={14} className="text-accent-ink" />
                <span className="text-xs font-bold text-ink">
                  {marathon.onlyRetryMode
                    ? `🎯 第${marathon.lap}周 弱点再挑戦モード`
                    : `🏁 第${marathon.lap}周 全問マラソン`}
                </span>
                <Badge tone="accent">
                  {marathon.scopeSubject === 'all'
                    ? '全教科'
                    : marathon.scopeSubject}
                </Badge>
              </div>

              {/* 進捗ゲージ */}
              <div className="flex min-w-[200px] flex-1 items-center gap-2.5">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-accent transition-[width] duration-300"
                    style={{ width: `${marathonProgress.percent}%` }}
                  />
                </div>
                <span className="shrink-0 text-xs font-bold tabular-nums text-ink">
                  {marathonProgress.cleared} / {marathonProgress.total} 問 (
                  {marathonProgress.percent}%)
                </span>
              </div>

              {marathonProgress.retry > 0 ? (
                <span className="text-xs font-semibold text-danger">
                  🔄 要再挑戦: {marathonProgress.retry} 問
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {marathonProgress.nextUnclearedProblem ? (
                <Button
                  size="sm"
                  onClick={() => {
                    const next = marathonProgress.nextUnclearedProblem;
                    if (!next) return;
                    setSelectedId(next.id);
                  }}
                  className="h-7 px-2.5 text-xs"
                  title="まだ今周でクリアしていない次の問題を開きます"
                >
                  <Play size={12} />
                  次の未クリア問題へ
                </Button>
              ) : null}

              <button
                type="button"
                onClick={() => setOnlyMarathonUncleared((prev) => !prev)}
                className={cn(
                  'inline-flex h-7 items-center gap-1 rounded-[7px] border px-2 text-xs font-medium transition-colors',
                  onlyMarathonUncleared
                    ? 'border-accent bg-accent-soft text-accent-ink'
                    : 'border-border bg-surface-2 text-muted hover:text-ink',
                )}
              >
                未クリアのみ ({marathonProgress.remaining})
              </button>

              {marathonProgress.retry > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    startNextMarathonLap('retry_only');
                    toast(
                      `間違えた ${marathonProgress.retry} 問だけの集中周回を開始しました！`,
                      'info',
                    );
                  }}
                  className="inline-flex h-7 items-center gap-1 rounded-[7px] border border-danger/40 bg-danger-soft/40 px-2 text-xs font-semibold text-danger hover:bg-danger-soft"
                >
                  🎯 間違えた{marathonProgress.retry}問だけ周回
                </button>
              ) : null}

              {marathonProgress.isCompleted ? (
                <Button
                  size="sm"
                  onClick={() => {
                    const nextLap = marathon.lap + 1;
                    startNextMarathonLap('all');
                    toast(`🎉 第${nextLap}周目を開始しました！`, 'success');
                  }}
                  className="h-7 px-2.5 text-xs"
                >
                  🎉 第{marathon.lap + 1}周目へ進む
                </Button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        `第${marathon.lap}周目のマラソン進捗（クリア済み ${marathonProgress.cleared} 問）をリセットしますか？`,
                      )
                    ) {
                      resetMarathonProgress(false);
                      toast('現在の周回進捗をリセットしました。', 'info');
                    }
                  }}
                  className="inline-flex h-7 items-center gap-1 rounded-[7px] border border-border bg-surface-2 px-2 text-[0.7rem] text-muted hover:text-ink"
                  title="現在の周回進捗を0からやり直す"
                >
                  <RotateCcw size={11} />
                  周回リセット
                </button>
              )}
            </div>
          </div>
        </Card>
      ) : null}

      {/* 未ログイン時または旧データ引き継ぎバナー */}
      {!sync.user ? (
        <Card className="flex flex-col items-start justify-between gap-3 border-accent/35 px-4 py-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold text-ink">
              🔥 Firebase上の誤答問題・気づき一覧を引き継ぐ
            </p>
            <p className="mt-0.5 text-xs text-muted">
              旧Floraと同じGoogleアカウントでログインすると、保存されていた誤答問題（全299件等）・気づきメモ・『文系の数学』進捗を自動で引き継ぎます。
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleLoginAndImport}
            disabled={isSyncWorking}
            className="shrink-0"
          >
            {isSyncWorking ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <LogIn size={14} />
            )}
            Googleでログインして引き継ぐ
          </Button>
        </Card>
      ) : sync.legacySyncing || hasOnlyDemoOrEmpty ? (
        <Card className="flex flex-wrap items-center justify-between gap-3 border-accent/35 px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs text-ink">
            {sync.legacySyncing ? (
              <>
                <Loader2 size={14} className="animate-spin text-accent-ink" />
                <span>
                  Firebase（{sync.user.displayName || sync.user.email}
                  ）から誤答問題・気づき一覧を引き継いでいます…
                </span>
              </>
            ) : (
              <>
                <ArchiveRestore size={14} className="text-accent-ink" />
                <span>
                  ログイン中（{sync.user.displayName || sync.user.email}
                  ）— Firebaseから旧データを再取得できます。
                </span>
              </>
            )}
          </div>
          {!sync.legacySyncing ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleResyncLegacy}
              disabled={isSyncWorking}
            >
              <RefreshCw size={13} />
              旧データを取得
            </Button>
          ) : null}
        </Card>
      ) : null}

      {tab === 'lessons' ? (
        <LessonsPanel />
      ) : !problems ? (
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="space-y-2 lg:col-span-5">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="lg:col-span-7">
            <Skeleton className="h-[460px] w-full" />
          </div>
        </div>
      ) : problems.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="問題がまだありません"
          description="Googleログインで旧Floraの誤答データを引き継ぐか、新しい問題を登録してください。"
          action={
            <Button onClick={() => navigate('/problems/new')}>
              <Plus size={16} />
              問題を登録
            </Button>
          }
        />
      ) : (
        /* 2ペイン・マスター＆詳細レイアウト（左：検索＆問題リスト ／ 右：選択した問題の詳細・解答・気づきメモ・AI質問） */
        <div className="grid items-start gap-4 lg:grid-cols-12">
          {/* 左ペイン：フィルタ＆問題一覧 */}
          <div className="space-y-2.5 lg:col-span-5 xl:col-span-5">
            <Card className="space-y-2.5 p-3.5">
              {/* 教科ピル & 一括整理モード切替 */}
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSubject('all');
                      setUnit('all');
                      setMarathonScope('all');
                    }}
                    className={cn(
                      'rounded-[7px] border px-2 py-1 text-xs font-semibold transition-colors',
                      subject === 'all'
                        ? 'border-accent bg-accent text-white'
                        : 'border-border bg-surface-2 text-muted hover:text-ink',
                    )}
                  >
                    ✨ すべて
                  </button>
                  {subjects.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => {
                        setSubject(sub);
                        setUnit('all');
                        setMarathonScope(sub);
                      }}
                      className={cn(
                        'rounded-[7px] border px-2 py-1 text-xs font-semibold transition-colors',
                        subject === sub
                          ? 'border-accent bg-accent text-white'
                          : 'border-border bg-surface-2 text-muted hover:text-ink',
                      )}
                    >
                      {sub}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBulkMode((prev) => !prev);
                    setCheckedIds(new Set());
                  }}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-[7px] border px-2.5 py-1 text-xs font-semibold transition-colors',
                    bulkMode
                      ? 'border-accent bg-accent text-white'
                      : 'border-border bg-surface-2 text-muted hover:text-ink',
                  )}
                >
                  {bulkMode ? <X size={12} /> : <CheckSquare size={12} />}
                  {bulkMode ? '整理を終了' : '一括整理'}
                </button>
              </div>

              {/* ☑️ 一括整理アクションバー */}
              {bulkMode ? (
                <div className="space-y-2 rounded-[10px] border border-accent/40 bg-accent-soft/20 p-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-accent-ink">
                      ☑️ {checkedIds.size} 件選択中
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setCheckedIds(new Set(filtered.map((p) => p.id)))
                        }
                        className="rounded border border-border bg-surface px-2 py-0.5 text-[0.68rem] font-medium text-ink hover:bg-surface-2"
                      >
                        表示中を全選択 ({filtered.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckedIds(new Set())}
                        className="rounded border border-border bg-surface px-2 py-0.5 text-[0.68rem] font-medium text-muted hover:text-ink"
                      >
                        解除
                      </button>
                    </div>
                  </div>

                  {/* 一括教科・単元変更 */}
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-12">
                    <div className="sm:col-span-4">
                      <GlassSelect
                        size="sm"
                        value={bulkSubject}
                        onChange={setBulkSubject}
                        options={[
                          { value: 'keep', label: '教科変更なし' },
                          ...Array.from(new Set([...SUBJECTS, ...subjects])).map(
                            (s) => ({ value: s, label: s }),
                          ),
                        ]}
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <Input
                        value={bulkUnit}
                        onChange={(e) => setBulkUnit(e.target.value)}
                        placeholder="新しい単元名（任意）"
                        className="h-9 bg-surface text-xs"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Button
                        size="sm"
                        className="h-9 w-full text-xs"
                        disabled={checkedIds.size === 0 || busyBulk}
                        onClick={() => void handleBulkApplyPatch()}
                      >
                        一括変更
                      </Button>
                    </div>
                  </div>

                  {/* 一括ピン留め・誤答リセット・削除 */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 border-t border-border/60 pt-2">
                    <div className="flex flex-wrap items-center gap-1">
                      <button
                        type="button"
                        disabled={checkedIds.size === 0 || busyBulk}
                        onClick={() => void handleBulkPin(true)}
                        className="inline-flex items-center gap-1 rounded-[6px] border border-border bg-surface px-2 py-1 text-[0.68rem] font-medium text-ink hover:bg-surface-2 disabled:opacity-50"
                      >
                        <Star size={11} className="fill-warning text-warning" />
                        ピンON
                      </button>
                      <button
                        type="button"
                        disabled={checkedIds.size === 0 || busyBulk}
                        onClick={() => void handleBulkPin(false)}
                        className="inline-flex items-center gap-1 rounded-[6px] border border-border bg-surface px-2 py-1 text-[0.68rem] font-medium text-muted hover:text-ink disabled:opacity-50"
                      >
                        ピン解除
                      </button>
                      <button
                        type="button"
                        disabled={checkedIds.size === 0 || busyBulk}
                        onClick={() => void handleBulkResetErrors()}
                        className="inline-flex items-center gap-1 rounded-[6px] border border-border bg-surface px-2 py-1 text-[0.68rem] font-medium text-muted hover:text-ink disabled:opacity-50"
                      >
                        誤答0リセット
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={checkedIds.size === 0 || busyBulk}
                      onClick={() => void handleBulkDelete()}
                      className="inline-flex items-center gap-1 rounded-[6px] border border-danger/40 bg-danger-soft/50 px-2.5 py-1 text-[0.68rem] font-bold text-danger hover:bg-danger-soft disabled:opacity-50"
                    >
                      <Trash2 size={11} />
                      一括削除 ({checkedIds.size})
                    </button>
                  </div>
                </div>
              ) : null}

              {/* 検索ボックス */}
              <div className="relative">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="タイトル・問題文・単元・気づきで検索..."
                  className="h-9 bg-surface-2 pl-8 text-xs"
                />
              </div>

              {/* 単元セレクト & 並び替えセレクト */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <GlassSelect
                  size="sm"
                  value={unit}
                  onChange={setUnit}
                  ariaLabel="単元で絞り込み"
                  options={[
                    {
                      value: 'all',
                      label:
                        subject === 'all'
                          ? 'すべての単元'
                          : `${subject} の全単元`,
                    },
                    ...units.map((u) => ({ value: u, label: u })),
                  ]}
                />
                <GlassSelect
                  size="sm"
                  value={sortMode}
                  onChange={(val) => setSortMode(val as SortMode)}
                  ariaLabel="並び替え"
                  options={sortOptions}
                />
              </div>

              {/* 状態クイックフィルタ & 件数表示 */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5">
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setOnlyDue((prev) => !prev)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-[7px] border px-2 py-0.5 text-[0.7rem] font-medium transition-colors',
                      onlyDue
                        ? 'border-warning bg-warning-soft/50 text-ink'
                        : 'border-border bg-surface-2 text-muted hover:text-ink',
                    )}
                  >
                    ⚡ 要復習のみ
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnlyInsight((prev) => !prev)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-[7px] border px-2 py-0.5 text-[0.7rem] font-medium transition-colors',
                      onlyInsight
                        ? 'border-accent bg-accent-soft text-accent-ink'
                        : 'border-border bg-surface-2 text-muted hover:text-ink',
                    )}
                  >
                    <Lightbulb size={11} />
                    気づきあり
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnlyPinned((prev) => !prev)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-[7px] border px-2 py-0.5 text-[0.7rem] font-medium transition-colors',
                      onlyPinned
                        ? 'border-warning bg-warning-soft/50 text-warning'
                        : 'border-border bg-surface-2 text-muted hover:text-ink',
                    )}
                  >
                    <Star
                      size={11}
                      className={onlyPinned ? 'fill-warning text-warning' : ''}
                    />
                    ピン留め
                  </button>
                </div>

                <Badge tone="neutral">
                  <span className="tabular-nums font-bold">{filtered.length}</span> 件
                </Badge>
              </div>
            </Card>

            {filtered.length === 0 ? (
              <EmptyState
                icon={Search}
                title="条件に合う問題がありません"
                description="検索語や教科・単元の絞り込みを変えてみてください。"
              />
            ) : (
              <div
                className="hide-scrollbar max-h-[calc(100dvh-260px)] space-y-2 overflow-y-auto pr-0.5"
                onScroll={(event) => {
                  const el = event.currentTarget;
                  if (
                    visibleCount < filtered.length &&
                    el.scrollTop + el.clientHeight >= el.scrollHeight - 320
                  ) {
                    setVisibleCount((prev) =>
                      Math.min(filtered.length, prev + 40),
                    );
                  }
                }}
              >
                {visibleProblems.map((problem) => (
                  <ProblemListItem
                    key={problem.id}
                    problem={problem}
                    selected={selectedProblem?.id === problem.id}
                    onSelect={handleSelectProblem}
                    bulkMode={bulkMode}
                    checked={checkedIds.has(problem.id)}
                    onToggleCheck={handleToggleCheck}
                    marathonStatus={
                      marathonProgress.clearedSet.has(problem.id)
                        ? 'cleared'
                        : marathonProgress.retrySet.has(problem.id)
                          ? 'retry'
                          : null
                    }
                  />
                ))}
                {visibleCount < filtered.length ? (
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount((prev) =>
                        Math.min(filtered.length, prev + 60),
                      )
                    }
                    className="w-full rounded-[10px] border border-border bg-surface-2 py-2 text-xs font-medium text-muted transition-colors hover:text-ink"
                  >
                    さらに表示（残り {filtered.length - visibleCount} 件）
                  </button>
                ) : null}
              </div>
            )}
          </div>

          {/* 右ペイン：選択した問題の詳細・模範解答・気づきメモ・AI質問・AI解説（スクロール追従） */}
          <div className="hide-scrollbar lg:col-span-7 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)] lg:overflow-y-auto xl:col-span-7">
            <ProblemInspectorPane
              problem={selectedProblem}
              onDeleted={() => {
                setSelectedId(null);
              }}
              onReviewed={handleProblemReviewed}
            />
          </div>
        </div>
      )}
    </div>
  );
}
