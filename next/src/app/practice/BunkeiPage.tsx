import { useLiveQuery } from 'dexie-react-hooks';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Lightbulb,
  ListFilter,
  NotebookPen,
  Shuffle,
  Sparkles,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '@/core/lib/cn';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Input, Textarea } from '@/core/ui/Field';
import { GlassSelect } from '@/core/ui/GlassSelect';
import { Markdown } from '@/core/ui/Markdown';
import { StructuredMathContent } from '@/core/ui/StructuredMathContent';
import { useToast } from '@/core/ui/Toast';
import {
  BUNKEI_MATH_CATALOG,
  BUNKEI_MATH_CHAPTERS,
  BUNKEI_MATH_EXERCISES,
  BUNKEI_MATH_EXERCISES_CATALOG,
  BUNKEI_MATH_FIGURES,
  BUNKEI_MATH_PROBLEMS,
  EXERCISE_CHAPTERS,
  EXERCISE_TOTAL,
  formatBunkeiQuestion,
  getBunkeiProblemDbId,
  getBunkeiProgressKey,
  REIDAI_TO_EXERCISES,
  REIDAI_TOTAL,
  sanitizeBunkeiMath,
  type BunkeiFigure,
  type BunkeiMode,
} from '@/data/bunkei';
import {
  getProblem,
  listBunkeiProgress,
  recordBunkeiStatus,
  saveBunkeiInsight,
} from '@/data/repo';
import type { BunkeiProgress } from '@/data/types';

type PickerStatusFilter = 'all' | 'mistake' | 'unlearned' | 'cleared' | 'insight';

function FigureBlock({ figure }: { figure?: BunkeiFigure }) {
  if (!figure?.svg) return null;
  return (
    <figure className="my-4 overflow-x-auto rounded-[10px] border border-border bg-surface-2 p-4 text-ink">
      <div
        className="mx-auto max-w-[540px] [&_svg]:h-auto [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: figure.svg }}
      />
      {figure.caption ? (
        <figcaption className="mt-2 text-center text-xs leading-relaxed text-muted">
          {figure.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function BunkeiPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode: BunkeiMode =
    searchParams.get('mode') === 'exercise' ? 'exercise' : 'reidai';
  const initialId = useMemo(() => {
    const raw = Number(searchParams.get('id'));
    const max = initialMode === 'reidai' ? REIDAI_TOTAL : EXERCISE_TOTAL;
    return Number.isFinite(raw) && raw >= 1 && raw <= max ? Math.round(raw) : 1;
  }, [initialMode, searchParams]);

  const [mode, setMode] = useState<BunkeiMode>(initialMode);
  const [reidaiId, setReidaiId] = useState<number>(
    initialMode === 'reidai' ? initialId : 1,
  );
  const [exerciseId, setExerciseId] = useState<number>(
    initialMode === 'exercise' ? initialId : 1,
  );
  const [revealed, setRevealed] = useState(true);
  const [alwaysReveal, setAlwaysReveal] = useState(true);
  const [mobilePickerOpen, setMobilePickerOpen] = useState(false);
  const [chapterFilter, setChapterFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<PickerStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [insightOpen, setInsightOpen] = useState(false);
  const [insightDraft, setInsightDraft] = useState('');
  const [savingInsight, setSavingInsight] = useState(false);
  const [busyJudge, setBusyJudge] = useState(false);

  const { toast } = useToast();

  const activeId = mode === 'reidai' ? reidaiId : exerciseId;
  const maxCount = mode === 'reidai' ? REIDAI_TOTAL : EXERCISE_TOTAL;

  const progressList = useLiveQuery(() => listBunkeiProgress(), []);
  const linkedProblem = useLiveQuery(
    () => getProblem(getBunkeiProblemDbId(mode, activeId)),
    [mode, activeId],
  );

  const progressMap = useMemo(() => {
    const map = new Map<string, BunkeiProgress>();
    for (const item of progressList ?? []) {
      map.set(item.id, item);
    }
    return map;
  }, [progressList]);

  const currentProgress = progressMap.get(getBunkeiProgressKey(mode, activeId));
  const existingInsight =
    currentProgress?.insight?.trim() ||
    linkedProblem?.insight?.trim() ||
    linkedProblem?.mnemonic?.trim() ||
    '';

  useEffect(() => {
    setInsightDraft(existingInsight);
  }, [existingInsight, mode, activeId]);

  // URLクエリ同期
  useEffect(() => {
    setSearchParams(
      { mode, id: String(activeId) },
      { replace: true },
    );
  }, [mode, activeId, setSearchParams]);

  // Alt + ← / → ショートカット
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!e.altKey) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (activeId < maxCount) selectProblem(mode, activeId + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (activeId > 1) selectProblem(mode, activeId - 1);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, activeId, maxCount, alwaysReveal]);

  function selectProblem(nextMode: BunkeiMode, nextId: number) {
    setMode(nextMode);
    if (nextMode === 'reidai') {
      setReidaiId(nextId);
    } else {
      setExerciseId(nextId);
    }
    if (!alwaysReveal) {
      setRevealed(false);
    }
    setInsightOpen(false);
  }

  function handleSwitchMode(nextMode: BunkeiMode, targetId?: number) {
    if (nextMode !== mode) {
      setChapterFilter('');
    }
    const idToUse =
      targetId ?? (nextMode === 'reidai' ? reidaiId : exerciseId);
    selectProblem(nextMode, idToUse);
  }

  function handleRandom() {
    const pool =
      mode === 'reidai' ? BUNKEI_MATH_CATALOG : BUNKEI_MATH_EXERCISES_CATALOG;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    if (picked) selectProblem(mode, picked.id);
  }

  const modeStats = useMemo(() => {
    let reidaiCleared = 0;
    let reidaiMistake = 0;
    let exCleared = 0;
    let exMistake = 0;
    for (const item of progressList ?? []) {
      if (item.mode === 'reidai') {
        if (item.status === 'cleared') reidaiCleared += 1;
        else if (item.status === 'mistake') reidaiMistake += 1;
      } else if (item.mode === 'exercise') {
        if (item.status === 'cleared') exCleared += 1;
        else if (item.status === 'mistake') exMistake += 1;
      }
    }
    return { reidaiCleared, reidaiMistake, exCleared, exMistake };
  }, [progressList]);

  const currentData =
    mode === 'reidai'
      ? BUNKEI_MATH_PROBLEMS[activeId]
      : BUNKEI_MATH_EXERCISES[activeId];
  const currentCatalog = useMemo(() => {
    const list =
      mode === 'reidai' ? BUNKEI_MATH_CATALOG : BUNKEI_MATH_EXERCISES_CATALOG;
    return list.find((c) => c.id === activeId);
  }, [mode, activeId]);

  const figureSet =
    (mode === 'reidai'
      ? BUNKEI_MATH_FIGURES.reidai[activeId]
      : BUNKEI_MATH_FIGURES.exercise[activeId]) ?? {};

  const crossLinks = useMemo(() => {
    if (mode === 'reidai') {
      const exIds = REIDAI_TO_EXERCISES[activeId] ?? [];
      return exIds.map((id) => ({
        mode: 'exercise' as const,
        id,
        label: `演習問題 ${id} に挑戦`,
      }));
    }
    const targetReidai =
      currentData?.target_reidai ?? currentCatalog?.target_reidai;
    if (targetReidai) {
      return [
        {
          mode: 'reidai' as const,
          id: targetReidai,
          label: `対応例題 ${targetReidai} を復習`,
        },
      ];
    }
    return [];
  }, [mode, activeId, currentData, currentCatalog]);

  const filteredCatalog = useMemo(() => {
    const catalog =
      mode === 'reidai' ? BUNKEI_MATH_CATALOG : BUNKEI_MATH_EXERCISES_CATALOG;
    const q = searchQuery.trim().toLowerCase();
    return catalog.filter((item) => {
      if (chapterFilter && item.chapter !== chapterFilter) return false;
      const prog = progressMap.get(getBunkeiProgressKey(mode, item.id));
      if (statusFilter === 'cleared' && prog?.status !== 'cleared') return false;
      if (statusFilter === 'mistake' && prog?.status !== 'mistake') return false;
      if (statusFilter === 'unlearned' && prog?.status) return false;
      if (statusFilter === 'insight' && !prog?.insight?.trim()) return false;
      if (!q) return true;
      return (
        String(item.id).includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.chapter.toLowerCase().includes(q) ||
        (item.sources ?? []).join(' ').toLowerCase().includes(q)
      );
    });
  }, [mode, chapterFilter, statusFilter, searchQuery, progressMap]);

  async function handleJudgeCleared() {
    if (busyJudge) return;
    setBusyJudge(true);
    try {
      const label = mode === 'reidai' ? `例題 ${activeId}` : `演習問題 ${activeId}`;
      await recordBunkeiStatus(mode, activeId, 'cleared');
      toast(`${label} を「習得済」に記録しました。`, 'success');
      if (activeId < maxCount) {
        selectProblem(mode, activeId + 1);
      }
    } catch (error) {
      toast(
        error instanceof Error ? error.message : '進捗の保存に失敗しました。',
        'error',
      );
    } finally {
      setBusyJudge(false);
    }
  }

  async function handleJudgeMistake() {
    if (busyJudge) return;
    setBusyJudge(true);
    try {
      const label = mode === 'reidai' ? `例題 ${activeId}` : `演習問題 ${activeId}`;
      await recordBunkeiStatus(mode, activeId, 'mistake');
      toast(
        `${label} を誤答ノート（今日の復習）に登録しました。`,
        'info',
      );
    } catch (error) {
      toast(
        error instanceof Error ? error.message : '誤答登録に失敗しました。',
        'error',
      );
    } finally {
      setBusyJudge(false);
    }
  }

  async function handleSaveInsight() {
    setSavingInsight(true);
    try {
      await saveBunkeiInsight(mode, activeId, insightDraft);
      toast('気づきメモを保存しました（ノート ＞ 気づき一覧にも反映されます）。', 'success');
      setInsightOpen(false);
    } catch (error) {
      toast(
        error instanceof Error ? error.message : 'メモの保存に失敗しました。',
        'error',
      );
    } finally {
      setSavingInsight(false);
    }
  }

  const labelPrefix = mode === 'reidai' ? `例題 ${activeId}` : `演習問題 ${activeId}`;
  const titleText = currentData?.title || currentCatalog?.title || labelPrefix;
  const chapterText = currentData?.chapter || currentCatalog?.chapter || '文系の数学';
  const sourcesText =
    currentData?.sources && currentData.sources.length > 0
      ? `出題: ${currentData.sources.join('、')}`
      : '出題: 河合塾';
  const keyPointText =
    mode === 'reidai'
      ? sanitizeBunkeiMath(currentData?.key_point)
      : '';
  const explanationText = sanitizeBunkeiMath(
    mode === 'reidai' ? currentData?.explanation : currentData?.commentary,
  );
  const showExplanationContent = revealed || alwaysReveal;

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[270px_minmax(0,1fr)_minmax(0,1.1fr)] xl:grid-cols-[295px_minmax(0,1fr)_minmax(0,1.15fr)]">
      {/* =====================================================================
          左カラム：問題選択パネル（Floraサイドバーのすぐ隣に配置）
         ===================================================================== */}
      <Card className="p-3.5 sm:p-4 lg:sticky lg:top-5 lg:flex lg:max-h-[calc(100dvh-2.5rem)] lg:flex-col">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted">
              重要事項 完全習得編
            </p>
            <h1 className="text-base font-bold tracking-[-0.01em] text-ink">
              文系の数学・問題選択
            </h1>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobilePickerOpen((prev) => !prev)}
          >
            <ListFilter size={14} />
            {mobilePickerOpen ? '一覧を閉じる' : '一覧を開く'}
            {mobilePickerOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </Button>
        </div>

        {/* 例題 / 演習 切替ボタン */}
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => handleSwitchMode('reidai')}
            className={cn(
              'flex flex-col items-start rounded-[9px] border px-2.5 py-2 text-left transition-colors',
              mode === 'reidai'
                ? 'border-accent bg-accent text-white'
                : 'border-border bg-surface-2 text-ink hover:bg-surface',
            )}
          >
            <span className="flex items-center gap-1 text-xs font-semibold">
              <BookOpen size={13} />
              例題 ({REIDAI_TOTAL})
            </span>
            <span
              className={cn(
                'mt-0.5 text-[0.68rem] tabular-nums',
                mode === 'reidai' ? 'text-white/85' : 'text-muted',
              )}
            >
              習得 {modeStats.reidaiCleared} / {REIDAI_TOTAL}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMode('exercise')}
            className={cn(
              'flex flex-col items-start rounded-[9px] border px-2.5 py-2 text-left transition-colors',
              mode === 'exercise'
                ? 'border-accent bg-accent text-white'
                : 'border-border bg-surface-2 text-ink hover:bg-surface',
            )}
          >
            <span className="flex items-center gap-1 text-xs font-semibold">
              <Sparkles size={13} />
              演習 ({EXERCISE_TOTAL})
            </span>
            <span
              className={cn(
                'mt-0.5 text-[0.68rem] tabular-nums',
                mode === 'exercise' ? 'text-white/85' : 'text-muted',
              )}
            >
              習得 {modeStats.exCleared} / {EXERCISE_TOTAL}
            </span>
          </button>
        </div>

        {/* 前後ナビ・ランダム */}
        <div className="mt-2.5 flex items-center justify-between gap-1 rounded-[9px] border border-border bg-surface-2 px-2 py-1.5">
          <Button
            variant="ghost"
            size="sm"
            disabled={activeId <= 1}
            onClick={() => selectProblem(mode, activeId - 1)}
            title="前の問題 (Alt + ←)"
            className="h-7 px-2"
          >
            <ArrowLeft size={14} />
            前へ
          </Button>
          <span className="text-xs font-bold tabular-nums text-ink">
            No. {activeId} / {maxCount}
          </span>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              disabled={activeId >= maxCount}
              onClick={() => selectProblem(mode, activeId + 1)}
              title="次の問題 (Alt + →)"
              className="h-7 px-2"
            >
              次へ
              <ArrowRight size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRandom}
              title="ランダムに出題"
              className="h-7 px-1.5"
            >
              <Shuffle size={13} />
            </Button>
          </div>
        </div>

        {/* フィルタ & 問題リスト（デスクトップは常時表示、モバイルは開閉） */}
        <div
          className={cn(
            'mt-3 flex-1 flex-col overflow-hidden',
            mobilePickerOpen ? 'flex' : 'hidden lg:flex',
          )}
        >
          <div className="space-y-1.5">
            <GlassSelect
              value={chapterFilter}
              onChange={(val) => setChapterFilter(val)}
              ariaLabel="章で絞り込み"
              options={[
                { value: '', label: `すべての章（全${maxCount}題）` },
                ...(mode === 'reidai'
                  ? BUNKEI_MATH_CHAPTERS.map((ch) => ({
                      value: ch.title,
                      label: `${ch.title}（${ch.range[0]}〜${ch.range[1]}）`,
                    }))
                  : EXERCISE_CHAPTERS.map((ch) => ({
                      value: ch,
                      label: ch,
                    }))),
              ]}
            />

            <GlassSelect
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as PickerStatusFilter)}
              ariaLabel="状態で絞り込み"
              options={[
                { value: 'all', label: 'すべての状態' },
                { value: 'mistake', label: '❌ 要復習（間違えた問題）' },
                { value: 'unlearned', label: '🌱 未着手' },
                { value: 'cleared', label: '✅ 習得済' },
                { value: 'insight', label: '🧠 気づきメモあり' },
              ]}
            />

            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="番号・タイトル・大学名で検索..."
              className="h-8.5 bg-surface-2 text-xs"
            />
          </div>

          <div className="hide-scrollbar mt-2.5 max-h-72 flex-1 divide-y divide-border overflow-y-auto rounded-[9px] border border-border bg-surface-2 lg:max-h-none">
            {filteredCatalog.length === 0 ? (
              <p className="p-4 text-center text-xs text-muted">
                一致する問題がありません。
              </p>
            ) : (
              filteredCatalog.map((item) => {
                const prog = progressMap.get(
                  getBunkeiProgressKey(mode, item.id),
                );
                const isCurrent = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      selectProblem(mode, item.id);
                      setMobilePickerOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 px-3 py-2 text-left transition-colors hover:bg-surface',
                      isCurrent &&
                        'border-l-[3px] border-l-accent bg-accent-soft font-semibold',
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[0.72rem] font-bold tabular-nums text-accent-ink">
                          {mode === 'reidai'
                            ? `例題${item.id}`
                            : `演習${item.id}`}
                        </span>
                        <span className="truncate text-[0.68rem] text-muted">
                          {item.chapter}
                        </span>
                      </div>
                      <p className="truncate text-xs text-ink">{item.title}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {prog?.insight?.trim() ? (
                        <span className="text-xs" title="気づきメモあり">
                          🧠
                        </span>
                      ) : null}
                      {prog?.status === 'cleared' ? (
                        <span className="text-xs" title="習得済">
                          ✅
                        </span>
                      ) : prog?.status === 'mistake' ? (
                        <span className="text-xs" title="要復習">
                          ❌
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </Card>

      {/* =====================================================================
          中央カラム：問題カード（上端から配置）
         ===================================================================== */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2.5 border-b border-border pb-3.5">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge tone="accent">問題 // {labelPrefix}</Badge>
              <Badge tone="neutral">{chapterText}</Badge>
              {currentProgress?.status === 'cleared' ? (
                <Badge tone="accent">✅ 習得済</Badge>
              ) : currentProgress?.status === 'mistake' ? (
                <Badge tone="danger">❌ 要復習</Badge>
              ) : null}
            </div>
            <h2 className="mt-2 text-lg font-bold leading-snug text-ink">
              {titleText}
            </h2>
            <p className="mt-0.5 text-xs text-muted">{sourcesText}</p>
          </div>

          {crossLinks.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {crossLinks.map((link) => (
                <Button
                  key={`${link.mode}_${link.id}`}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSwitchMode(link.mode, link.id)}
                >
                  {link.label}
                  <ArrowRight size={13} />
                </Button>
              ))}
            </div>
          ) : null}
        </div>

        {/* 問題本文 + 図 */}
        <div className="mt-4 rounded-[11px] border border-border bg-surface-2 p-4 sm:p-5">
          {currentData ? (
            <>
              <div className="text-[0.96rem] leading-relaxed">
                <Markdown>{formatBunkeiQuestion(currentData.question)}</Markdown>
              </div>
              <FigureBlock figure={figureSet.question ?? currentData.figure} />
            </>
          ) : (
            <p className="text-sm text-muted">問題データを準備中です。</p>
          )}
        </div>

        {/* 気づき・極意メモのトグル & プレビュー */}
        <div className="mt-4 border-t border-border pt-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setInsightOpen((prev) => !prev)}
            >
              <NotebookPen size={14} />
              {existingInsight
                ? '🧠 気づき・極意メモを編集'
                : '🧠 この問題の「気づき・極意」をメモする'}
            </Button>

            {linkedProblem && linkedProblem.kind !== 'insight' ? (
              <Link
                to={`/problems/${linkedProblem.id}`}
                className="text-xs font-semibold text-accent-ink hover:underline"
              >
                誤答ノートの詳細を見る →
              </Link>
            ) : null}
          </div>

          {!insightOpen && existingInsight ? (
            <div
              onClick={() => setInsightOpen(true)}
              className="mt-2.5 cursor-pointer rounded-[10px] border border-accent/35 bg-accent-soft px-4 py-3 text-sm leading-relaxed transition-colors"
              title="クリックして編集"
            >
              <p className="mb-1 text-xs font-semibold text-accent-ink">
                🧠 記録済みの気づき・極意メモ
              </p>
              <Markdown>{existingInsight}</Markdown>
            </div>
          ) : null}

          {insightOpen ? (
            <div className="mt-2.5 rounded-[10px] border border-border bg-surface-2 p-3.5">
              <p className="mb-2 text-xs font-semibold text-muted">
                🧠 【{labelPrefix}: {titleText}】の気づき・極意メモ（$...$ で数式も使えます）
              </p>
              <Textarea
                value={insightDraft}
                onChange={(e) => setInsightDraft(e.target.value)}
                placeholder="自分が引っかかった箇所、解法の初手、覚えておくべき定石をメモ..."
                className="min-h-24 bg-surface-2"
              />
              <div className="mt-2.5 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setInsightDraft(existingInsight);
                    setInsightOpen(false);
                  }}
                >
                  キャンセル
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveInsight}
                  disabled={savingInsight}
                >
                  保存する
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </Card>

      {/* =====================================================================
          右カラム：解説・模範解答・自己採点カード（上端から配置）
         ===================================================================== */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3.5">
          <div className="flex items-center gap-2">
            <Badge tone="accent">解説 // {labelPrefix}</Badge>
            <h2 className="text-sm font-bold text-ink">
              必勝ポイント・模範解答・解説
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                const next = !alwaysReveal;
                setAlwaysReveal(next);
                if (next) setRevealed(true);
              }}
              className={cn(
                'rounded-[8px] border px-2.5 py-1 text-xs font-medium transition-colors',
                alwaysReveal
                  ? 'border-accent bg-accent-soft text-accent-ink'
                  : 'border-border bg-surface-2 text-muted hover:text-ink',
              )}
              title="問題を切り替えても常に右側に解答・解説を表示します"
            >
              {alwaysReveal ? '常時表示: ON' : '常時表示: OFF'}
            </button>

            {showExplanationContent ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAlwaysReveal(false);
                  setRevealed(false);
                }}
              >
                <EyeOff size={14} />
                隠す
              </Button>
            ) : null}
          </div>
        </div>

        {!showExplanationContent ? (
          <div className="py-12 text-center">
            <p className="mb-4 text-sm text-muted">
              問題を解き終えたら、解答と必勝ポイントを確認しましょう。
            </p>
            <Button size="lg" onClick={() => setRevealed(true)}>
              <Eye size={17} />
              解答・解説を見る
            </Button>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* 上部クイック自己採点バー */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-border bg-surface-2 px-3.5 py-2.5">
              <span className="text-xs font-medium text-muted">
                自己採点:
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="border-danger/40 text-danger hover:bg-danger-soft"
                  onClick={handleJudgeMistake}
                  disabled={busyJudge}
                >
                  <X size={14} />
                  間違えた（誤答登録）
                </Button>
                <Button
                  size="sm"
                  onClick={handleJudgeCleared}
                  disabled={busyJudge}
                >
                  <Check size={14} />
                  解けた（克服して次へ）
                </Button>
              </div>
            </div>

            {/* 必勝ポイント (例題のみ) */}
            {keyPointText ? (
              <div className="rounded-[11px] border border-warning/40 bg-warning-soft p-4">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wide text-warning">
                  <Lightbulb size={15} />
                  文系数学の必勝ポイント・着眼点
                </div>
                <StructuredMathContent variant="keypoint">
                  {keyPointText}
                </StructuredMathContent>
              </div>
            ) : null}

            {/* 模範解答 + 解答図 */}
            {currentData?.answer ? (
              <div className="rounded-[11px] border border-border bg-surface-2 p-4 sm:p-5">
                <div className="mb-3 flex items-center gap-2 border-b border-border pb-2">
                  <span className="inline-block h-3.5 w-1 rounded-full bg-accent" />
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink">
                    模範解答
                  </p>
                </div>
                <StructuredMathContent variant="answer">
                  {sanitizeBunkeiMath(currentData.answer)}
                </StructuredMathContent>
                <FigureBlock figure={figureSet.answer} />
              </div>
            ) : null}

            {/* 解説講義 / 解説・研究 */}
            {explanationText ? (
              <div className="rounded-[11px] border border-border bg-surface-2 p-4 sm:p-5">
                <div className="mb-3 flex items-center gap-2 border-b border-border pb-2">
                  <span className="inline-block h-3.5 w-1 rounded-full bg-warning" />
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink">
                    {mode === 'reidai' ? '解説講義' : '解説・研究'}
                  </p>
                </div>
                <StructuredMathContent variant="explanation">
                  {explanationText}
                </StructuredMathContent>
              </div>
            ) : null}

            {/* 下部自己採点ボタン */}
            <div className="rounded-[11px] border border-border bg-surface-2 p-4">
              <p className="mb-2.5 text-center text-xs font-medium text-muted">
                自己採点して学習記録を残しましょう
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="secondary"
                  size="md"
                  className="flex-1 border-danger/40 text-danger hover:bg-danger-soft"
                  onClick={handleJudgeMistake}
                  disabled={busyJudge}
                >
                  <X size={16} />
                  間違えた（誤答ノートに登録）
                </Button>
                <Button
                  size="md"
                  className="flex-1"
                  onClick={handleJudgeCleared}
                  disabled={busyJudge}
                >
                  <Check size={16} />
                  解けた（克服して次へ）
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
