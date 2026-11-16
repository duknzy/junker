import { useLiveQuery } from 'dexie-react-hooks';
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  BookmarkCheck,
  BookmarkPlus,
  CalendarClock,
  Check,
  ChevronRight,
  Cloud,
  Eye,
  Layers,
  Lightbulb,
  Loader2,
  MessageSquare,
  NotebookPen,
  Pencil,
  Plus,
  Quote,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '@/core/lib/cn';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { EmptyState } from '@/core/ui/EmptyState';
import { Field, Input, Select, Textarea } from '@/core/ui/Field';
import { GlassSelect } from '@/core/ui/GlassSelect';
import { InlineMarkdown, Markdown } from '@/core/ui/Markdown';
import { PageHeader } from '@/core/ui/PageHeader';
import { Skeleton } from '@/core/ui/Spinner';
import { useToast } from '@/core/ui/Toast';
import {
  createFlashcard,
  createInsightMemo,
  deleteFlashcard,
  deleteProblem,
  deleteQnaLog,
  getCachedInsights,
  getCachedQnaLogs,
  listFlashcards,
  listInsightRecords,
  listQnaLogs,
  recordFlashcardReview,
  toggleProblemPin,
  updateProblem,
} from '@/data/repo';
import { describeNextReview, isDue } from '@/data/srs';
import { SUBJECTS } from '@/data/subjects';
import type { Flashcard, Problem, QnaLog } from '@/data/types';
import { signInWithGoogle, syncLegacyNow } from '@/sync/engine';
import { useSyncState } from '@/sync/useSync';

type Tab = 'insights' | 'cards' | 'qna';

function resolveBunkeiLink(problem: Problem): string | null {
  if (problem.bunkeiId) {
    const mode = problem.bunkeiMode ?? 'reidai';
    return `/practice/bunkei?mode=${mode}&id=${problem.bunkeiId}`;
  }
  const exMatch = /^BUNKEI_MATH_EX_(\d+)$/.exec(problem.id);
  if (exMatch) return `/practice/bunkei?mode=exercise&id=${exMatch[1]}`;
  const reidaiMatch = /^BUNKEI_MATH_(\d+)$/.exec(problem.id);
  if (reidaiMatch) return `/practice/bunkei?mode=reidai&id=${reidaiMatch[1]}`;
  return null;
}

export function NotesPage() {
  const problems = useLiveQuery(
    () => listInsightRecords(),
    [],
    getCachedInsights(),
  );
  const cards = useLiveQuery(() => listFlashcards(), []);
  const qnaLogs = useLiveQuery(() => listQnaLogs(), [], getCachedQnaLogs());
  const sync = useSyncState();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const tab: Tab =
    rawTab === 'cards' ? 'cards' : rawTab === 'qna' ? 'qna' : 'insights';
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('all');
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [expandedQnaId, setExpandedQnaId] = useState<string | null>(null);

  // New flashcard form
  const [showNewForm, setShowNewForm] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [cardSubject, setCardSubject] = useState<string>(SUBJECTS[0]);
  const [cardUnit, setCardUnit] = useState('');
  const [creating, setCreating] = useState(false);

  // New insight form
  const [showNewInsight, setShowNewInsight] = useState(false);
  const [insightSubject, setInsightSubject] = useState<string>(SUBJECTS[0]);
  const [insightUnit, setInsightUnit] = useState('');
  const [insightTitle, setInsightTitle] = useState('');
  const [insightBody, setInsightBody] = useState('');
  const [creatingInsight, setCreatingInsight] = useState(false);

  // Inline edit state for insights
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Review session state
  const [reviewQueue, setReviewQueue] = useState<Flashcard[] | null>(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [reviewBusy, setReviewBusy] = useState(false);

  const { toast } = useToast();

  function setTab(next: Tab) {
    setSearchParams(
      next === 'cards'
        ? { tab: 'cards' }
        : next === 'qna'
          ? { tab: 'qna' }
          : {},
      { replace: true },
    );
  }

  const cardProblemIds = useMemo(() => {
    const set = new Set<string>();
    for (const card of cards ?? []) {
      if (card.problemId) set.add(card.problemId);
    }
    return set;
  }, [cards]);

  const dueCards = useMemo(() => {
    if (!cards) return [];
    const now = new Date();
    return cards
      .filter((card) => isDue(card.nextReviewAt, now))
      .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt));
  }, [cards]);

  const allNotes = useMemo(() => {
    if (!problems) return [];
    return problems.filter(
      (problem) =>
        Boolean(problem.insight?.trim()) ||
        Boolean(problem.mnemonic?.trim()) ||
        Boolean(problem.strategy?.trim()) ||
        Boolean(problem.trap?.trim()),
    );
  }, [problems]);

  const noteSubjects = useMemo(() => {
    return Array.from(new Set(allNotes.map((problem) => problem.subject)));
  }, [allNotes]);

  const notes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allNotes.filter((problem) => {
      if (subject !== 'all' && problem.subject !== subject) return false;
      if (pinnedOnly && !problem.pinned) return false;
      if (!q) return true;
      return [
        problem.shortTitle,
        problem.title,
        problem.insight ?? '',
        problem.mnemonic,
        problem.strategy,
        problem.trap,
        problem.subject,
        problem.unit,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [allNotes, pinnedOnly, query, subject]);

  const cardSubjects = useMemo(() => {
    if (!cards) return [];
    return Array.from(new Set(cards.map((card) => card.subject)));
  }, [cards]);

  const filteredCards = useMemo(() => {
    if (!cards) return [];
    const q = query.trim().toLowerCase();
    return cards.filter((card) => {
      if (subject !== 'all' && card.subject !== subject) return false;
      if (!q) return true;
      return [card.front, card.back, card.subject, card.unit, card.problemTitle ?? '']
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [cards, query, subject]);

  const qnaSubjects = useMemo(() => {
    if (!qnaLogs) return [];
    return Array.from(new Set(qnaLogs.map((log) => log.subject)));
  }, [qnaLogs]);

  const filteredQnaLogs = useMemo(() => {
    if (!qnaLogs) return [];
    const q = query.trim().toLowerCase();
    return qnaLogs.filter((log) => {
      if (subject !== 'all' && log.subject !== subject) return false;
      if (!q) return true;
      return [
        log.shortTitle,
        log.subject,
        log.unit,
        ...log.messages.map((m) => m.content),
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [qnaLogs, query, subject]);

  async function handleDeleteQna(log: QnaLog) {
    if (!window.confirm('この質問アーカイブを削除しますか？')) return;
    try {
      await deleteQnaLog(log.id);
      toast('質問アーカイブを削除しました。', 'info');
    } catch (error) {
      toast(
        error instanceof Error ? error.message : '削除に失敗しました。',
        'error',
      );
    }
  }

  async function handleCreateFromProblem(problem: Problem) {
    if (cardProblemIds.has(problem.id)) return;
    try {
      const backParts = [
        problem.insight,
        problem.mnemonic,
        problem.strategy,
        problem.trap,
      ].filter(Boolean);
      await createFlashcard({
        front: `${problem.shortTitle}の定石・注意点は？`,
        back: backParts.join('\n\n') || problem.answer || problem.title,
        subject: problem.subject,
        unit: problem.unit,
        problemId: problem.id,
        problemTitle: problem.shortTitle,
      });
      toast('暗記カードに追加しました。', 'success');
    } catch (error) {
      toast(error instanceof Error ? error.message : '追加に失敗しました。', 'error');
    }
  }

  async function handleCreateInsight(event: FormEvent) {
    event.preventDefault();
    if (!insightBody.trim()) {
      toast('気づきの内容を入力してください。', 'error');
      return;
    }
    setCreatingInsight(true);
    try {
      await createInsightMemo({
        subject: insightSubject,
        unit: insightUnit.trim() || '気づきメモ',
        title: insightTitle.trim() || insightUnit.trim() || '気づきメモ',
        insight: insightBody.trim(),
      });
      setInsightUnit('');
      setInsightTitle('');
      setInsightBody('');
      setShowNewInsight(false);
      toast('気づきメモを追加しました。', 'success');
    } catch (error) {
      toast(error instanceof Error ? error.message : '追加に失敗しました。', 'error');
    } finally {
      setCreatingInsight(false);
    }
  }

  function startEditingInsight(problem: Problem) {
    setEditingId(problem.id);
    setEditingText(problem.insight ?? problem.mnemonic ?? '');
  }

  async function handleSaveEdit(problem: Problem) {
    setSavingEdit(true);
    try {
      await updateProblem(problem.id, { insight: editingText.trim() });
      setEditingId(null);
      toast('気づきメモを更新しました。', 'success');
    } catch (error) {
      toast(error instanceof Error ? error.message : '更新に失敗しました。', 'error');
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDeleteInsight(problem: Problem) {
    if (!window.confirm('この気づきメモを削除しますか？')) return;
    try {
      if (problem.kind === 'insight') {
        await deleteProblem(problem.id);
      } else {
        await updateProblem(problem.id, {
          insight: '',
          mnemonic: '',
          strategy: '',
          trap: '',
        });
      }
      toast('気づきメモを削除しました。', 'info');
    } catch (error) {
      toast(error instanceof Error ? error.message : '削除に失敗しました。', 'error');
    }
  }

  async function handleCreateCard(event: FormEvent) {
    event.preventDefault();
    if (!front.trim() || !back.trim()) {
      toast('表面と裏面の両方を入力してください。', 'error');
      return;
    }
    setCreating(true);
    try {
      await createFlashcard({
        front,
        back,
        subject: cardSubject,
        unit: cardUnit.trim() || '未分類',
      });
      setFront('');
      setBack('');
      setCardUnit('');
      setShowNewForm(false);
      toast('暗記カードを作成しました。', 'success');
    } catch (error) {
      toast(error instanceof Error ? error.message : '作成に失敗しました。', 'error');
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteCard(card: Flashcard) {
    if (!window.confirm('この暗記カードを削除しますか？')) return;
    try {
      await deleteFlashcard(card.id);
      toast('暗記カードを削除しました。', 'info');
    } catch (error) {
      toast(error instanceof Error ? error.message : '削除に失敗しました。', 'error');
    }
  }

  function startReview(targetCards: Flashcard[]) {
    if (targetCards.length === 0) return;
    setReviewQueue(targetCards);
    setReviewIndex(0);
    setRevealed(false);
    setCorrectCount(0);
  }

  async function handleReviewAnswer(correct: boolean) {
    if (!reviewQueue || reviewBusy) return;
    const current = reviewQueue[reviewIndex];
    if (!current) return;
    setReviewBusy(true);
    try {
      await recordFlashcardReview(current.id, correct);
      if (correct) setCorrectCount((count) => count + 1);
      setRevealed(false);
      setReviewIndex((idx) => idx + 1);
    } catch (error) {
      toast(error instanceof Error ? error.message : '記録に失敗しました。', 'error');
    } finally {
      setReviewBusy(false);
    }
  }

  // Active SRS flashcard review session view
  if (reviewQueue) {
    if (reviewIndex >= reviewQueue.length) {
      return (
        <div className="mx-auto max-w-2xl">
          <Card className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
              <Check size={22} />
            </div>
            <h1 className="text-lg font-semibold">暗記カードの復習が完了しました</h1>
            <p className="mt-1.5 text-sm text-muted">
              {reviewQueue.length} 枚のカードを確認しました。
            </p>
            <p className="mt-5 text-3xl font-semibold tabular-nums">
              {correctCount}
              <span className="ml-1 text-sm font-normal text-muted">
                / {reviewQueue.length} 枚覚えた
              </span>
            </p>
            <div className="mt-7 flex justify-center">
              <Button onClick={() => setReviewQueue(null)}>カード一覧へ戻る</Button>
            </div>
          </Card>
        </div>
      );
    }

    const activeCard = reviewQueue[reviewIndex];
    const progress = Math.round((reviewIndex / reviewQueue.length) * 100);

    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setReviewQueue(null)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
          >
            <ArrowLeft size={14} />
            中断
          </button>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="shrink-0 text-xs tabular-nums text-muted">
            {reviewIndex + 1} / {reviewQueue.length}
          </span>
        </div>

        <Card className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{activeCard.subject}</Badge>
            <Badge tone="neutral">{activeCard.unit}</Badge>
            {activeCard.srs.lapses > 0 ? (
              <Badge tone="warning">再確認 {activeCard.srs.lapses}回</Badge>
            ) : null}
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
            表面（問い）
          </p>
          <div className="mt-2 text-base font-medium leading-relaxed">
            <Markdown>{activeCard.front}</Markdown>
          </div>

          {!revealed ? (
            <Button
              size="lg"
              variant="secondary"
              className="mt-7 w-full"
              onClick={() => setRevealed(true)}
            >
              <Eye size={17} />
              裏面を見る
            </Button>
          ) : (
            <div className="mt-6">
              <div className="rounded-[10px] border border-accent/25 bg-accent-soft/40 p-4">
                <p className="mb-2 text-xs font-semibold text-accent-ink">裏面（答え・定石）</p>
                <Markdown>{activeCard.back}</Markdown>
              </div>

              {activeCard.problemId ? (
                <Link
                  to={`/problems/${activeCard.problemId}`}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent-ink hover:underline"
                >
                  元の問題: {activeCard.problemTitle || '問題を見る'}
                  <ChevronRight size={13} />
                </Link>
              ) : null}

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => handleReviewAnswer(false)}
                  disabled={reviewBusy}
                >
                  {reviewBusy ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <X size={16} />
                  )}
                  まだ（明日もう一度）
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleReviewAnswer(true)}
                  disabled={reviewBusy}
                >
                  {reviewBusy ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  覚えた
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="ノート"
        title={
          tab === 'cards'
            ? '暗記カード'
            : tab === 'qna'
              ? '質問アーカイブ'
              : '気づきと暗記'
        }
        description={
          tab === 'cards'
            ? '定石・公式・用語をカードにして、忘れる前にSRSで反復します。'
            : tab === 'qna'
              ? '各問題でAI講師に質問した会話履歴を検索・復習できます。'
              : '問題を解いて見つけた極意・定石・罠・授業メモをまとめて読み返せます。'
        }
        actions={
          tab === 'cards' ? (
            <Button
              variant={showNewForm ? 'secondary' : 'primary'}
              onClick={() => setShowNewForm((prev) => !prev)}
            >
              {showNewForm ? <X size={16} /> : <Plus size={16} />}
              {showNewForm ? '閉じる' : 'カードを追加'}
            </Button>
          ) : tab === 'insights' ? (
            <Button
              variant={showNewInsight ? 'secondary' : 'primary'}
              onClick={() => setShowNewInsight((prev) => !prev)}
            >
              {showNewInsight ? <X size={16} /> : <Plus size={16} />}
              {showNewInsight ? '閉じる' : '気づきを追加'}
            </Button>
          ) : undefined
        }
      />

      <div className="mb-5 flex gap-1 border-b border-border">
        <button
          type="button"
          onClick={() => setTab('insights')}
          className={cn(
            '-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm transition-colors',
            tab === 'insights'
              ? 'border-accent font-medium text-ink'
              : 'border-transparent text-muted hover:text-ink',
          )}
        >
          <NotebookPen size={15} />
          気づき
          {allNotes.length > 0 ? (
            <span className="ml-0.5 text-xs tabular-nums text-muted">
              ({allNotes.length})
            </span>
          ) : null}
        </button>
        <button
          type="button"
          onClick={() => setTab('cards')}
          className={cn(
            '-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm transition-colors',
            tab === 'cards'
              ? 'border-accent font-medium text-ink'
              : 'border-transparent text-muted hover:text-ink',
          )}
        >
          <Layers size={15} />
          暗記カード
          {dueCards.length > 0 ? (
            <Badge tone="accent" className="ml-1">
              {dueCards.length}
            </Badge>
          ) : cards && cards.length > 0 ? (
            <span className="ml-0.5 text-xs tabular-nums text-muted">({cards.length})</span>
          ) : null}
        </button>
        <button
          type="button"
          onClick={() => setTab('qna')}
          className={cn(
            '-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm transition-colors',
            tab === 'qna'
              ? 'border-accent font-medium text-ink'
              : 'border-transparent text-muted hover:text-ink',
          )}
        >
          <MessageSquare size={15} />
          質問アーカイブ
          {qnaLogs && qnaLogs.length > 0 ? (
            <span className="ml-0.5 text-xs tabular-nums text-muted">
              ({qnaLogs.length})
            </span>
          ) : null}
        </button>
      </div>

      {/* Firebase 気づき・暗記引き継ぎバナー */}
      {!sync.user && sync.phase !== 'unconfigured' ? (
        <Card className="mb-5 flex flex-col justify-between gap-3 border-accent/35 p-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-accent-soft text-accent-ink">
              <Cloud size={17} />
            </div>
            <div>
              <h2 className="text-sm font-semibold">
                Firebase 上の気づき一覧・暗記ポイントを引き継ぐ
              </h2>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">
                Googleアカウントでログインすると、旧Floraに保存していた問題の気づきメモ・授業メモ・文系数学メモを自動で同期します。
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => void signInWithGoogle()}
            disabled={sync.phase === 'connecting'}
            className="shrink-0"
          >
            <Cloud size={14} />
            Googleでログインして同期
          </Button>
        </Card>
      ) : sync.legacySyncing ? (
        <Card className="mb-5 flex items-center gap-3 border-accent/30 p-3.5 text-xs text-muted">
          <RefreshCw size={15} className="animate-spin text-accent-ink" />
          <span>Firebase から旧Floraの気づき一覧・暗記ポイントを取り込み中…</span>
        </Card>
      ) : null}

      {tab === 'insights' ? (
        <div className="space-y-4">
          {showNewInsight ? (
            <Card className="p-5">
              <h2 className="text-sm font-semibold">新しい気づき・極意メモ</h2>
              <form onSubmit={handleCreateInsight} className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="教科">
                    <Select
                      value={insightSubject}
                      onChange={(event) => setInsightSubject(event.target.value)}
                    >
                      {SUBJECTS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="単元（任意）">
                    <Input
                      value={insightUnit}
                      onChange={(event) => setInsightUnit(event.target.value)}
                      placeholder="例: 微分・積分 / ベクトル"
                    />
                  </Field>
                  <Field label="見出し（任意）">
                    <Input
                      value={insightTitle}
                      onChange={(event) => setInsightTitle(event.target.value)}
                      placeholder="例: 接線の本数は接点の個数に帰着"
                    />
                  </Field>
                </div>

                <Field label="気づき・解法の地図">
                  <Textarea
                    value={insightBody}
                    onChange={(event) => setInsightBody(event.target.value)}
                    placeholder="自分の言葉で掴んだポイントや定石を記録（数式 $...$ も使えます）"
                    className="min-h-24"
                    required
                  />
                </Field>

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowNewInsight(false)}
                  >
                    キャンセル
                  </Button>
                  <Button type="submit" disabled={creatingInsight}>
                    {creatingInsight ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Plus size={15} />
                    )}
                    保存する
                  </Button>
                </div>
              </form>
            </Card>
          ) : null}

          {!problems ? (
            <div className="space-y-3">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ) : allNotes.length === 0 ? (
            <EmptyState
              icon={NotebookPen}
              title="まだ気づきがありません"
              description="問題を登録・復習したり、『文系の数学』で気づきメモを書くとここに集まります。旧データ取り込みからも引き継げます。"
              action={
                <Button onClick={() => setShowNewInsight(true)}>
                  <Plus size={16} />
                  最初の気づきを追加
                </Button>
              }
            />
          ) : (
            <>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="極意・定石・暗記・単元で検索"
                    className="pl-9"
                  />
                </div>
                <GlassSelect
                  value={subject}
                  onChange={setSubject}
                  size="md"
                  className="sm:w-44"
                  options={[
                    { value: 'all', label: 'すべての教科' },
                    ...noteSubjects.map((item) => ({ value: item, label: item })),
                  ]}
                />
                {sync.user ? (
                  <button
                    type="button"
                    onClick={() => void syncLegacyNow()}
                    disabled={sync.legacySyncing}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[10px] border border-border bg-surface px-3 text-xs font-medium text-muted transition-colors hover:text-ink disabled:opacity-50"
                    title="Firebaseから旧データの気づきを再取得"
                  >
                    <RefreshCw
                      size={13}
                      className={cn(sync.legacySyncing && 'animate-spin text-accent-ink')}
                    />
                    再取得
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setPinnedOnly((prev) => !prev)}
                  className={cn(
                    'inline-flex h-10 items-center justify-center gap-1.5 rounded-[10px] border px-3 text-xs font-medium transition-colors',
                    pinnedOnly
                      ? 'border-warning bg-warning-soft/60 text-ink'
                      : 'border-border bg-surface text-muted hover:text-ink',
                  )}
                >
                  <Star
                    size={14}
                    className={pinnedOnly ? 'fill-warning text-warning' : ''}
                  />
                  ピン留めのみ
                </button>
              </div>

              {notes.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="条件に合う気づきがありません"
                  description="検索語や教科フィルタを変えてみてください。"
                />
              ) : (
                <div className="space-y-3">
                  {notes.map((problem) => {
                    const hasCard = cardProblemIds.has(problem.id);
                    const bunkeiLink = resolveBunkeiLink(problem);
                    const isEditing = editingId === problem.id;

                    return (
                      <Card key={problem.id} className="p-5">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 text-muted">
                            {problem.insight ? (
                              <Lightbulb size={16} className="text-warning" />
                            ) : (
                              <Quote size={16} />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <Badge tone="neutral">{problem.subject}</Badge>
                                <Badge tone="neutral">{problem.unit}</Badge>
                                {bunkeiLink ? (
                                  <Badge tone="accent">文系の数学</Badge>
                                ) : problem.source === 'lesson' ? (
                                  <Badge tone="neutral">授業メモ</Badge>
                                ) : null}
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => toggleProblemPin(problem.id)}
                                  className="rounded p-1 text-muted hover:bg-surface-2 hover:text-ink"
                                  title="ピン留め"
                                  aria-label="ピン留め"
                                >
                                  <Star
                                    size={14}
                                    className={
                                      problem.pinned ? 'fill-warning text-warning' : ''
                                    }
                                  />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => startEditingInsight(problem)}
                                  className="rounded p-1 text-muted hover:bg-surface-2 hover:text-ink"
                                  title="気づきメモを編集"
                                  aria-label="気づきメモを編集"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteInsight(problem)}
                                  className="rounded p-1 text-muted hover:bg-surface-2 hover:text-danger"
                                  title="削除"
                                  aria-label="削除"
                                >
                                  <Trash2 size={13} />
                                </button>
                                {hasCard ? (
                                  <button
                                    type="button"
                                    onClick={() => setTab('cards')}
                                    className="ml-1 inline-flex items-center gap-1 text-xs font-medium text-accent-ink hover:underline"
                                  >
                                    <BookmarkCheck size={13} />
                                    カード登録済み
                                  </button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCreateFromProblem(problem)}
                                  >
                                    <BookmarkPlus size={13} />
                                    カード化
                                  </Button>
                                )}
                              </div>
                            </div>

                            {isEditing ? (
                              <div className="my-2 space-y-2">
                                <Textarea
                                  value={editingText}
                                  onChange={(event) => setEditingText(event.target.value)}
                                  className="min-h-20 text-sm"
                                  placeholder="気づき・極意メモを入力"
                                />
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingId(null)}
                                  >
                                    キャンセル
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveEdit(problem)}
                                    disabled={savingEdit}
                                  >
                                    {savingEdit ? (
                                      <Loader2 size={13} className="animate-spin" />
                                    ) : (
                                      <Save size={13} />
                                    )}
                                    保存
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                {problem.insight ? (
                                  <div className="rounded-[10px] bg-surface-2 px-3.5 py-2.5 text-sm leading-relaxed">
                                    <Markdown>{problem.insight}</Markdown>
                                  </div>
                                ) : null}

                                {problem.mnemonic &&
                                problem.mnemonic !== problem.insight ? (
                                  <p className="mt-2 whitespace-pre-line text-[0.95rem] font-medium leading-relaxed">
                                    {problem.mnemonic}
                                  </p>
                                ) : null}

                                {problem.strategy ? (
                                  <p className="mt-2 text-sm leading-relaxed text-muted">
                                    定石: <InlineMarkdown>{problem.strategy}</InlineMarkdown>
                                  </p>
                                ) : null}

                                {problem.trap ? (
                                  <p className="mt-2 rounded-[8px] bg-warning-soft/50 px-3 py-2 text-xs leading-relaxed text-warning">
                                    罠: <InlineMarkdown>{problem.trap}</InlineMarkdown>
                                  </p>
                                ) : null}
                              </>
                            )}

                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              {bunkeiLink ? (
                                <Link
                                  to={bunkeiLink}
                                  className="inline-flex items-center gap-1 text-xs font-medium text-accent-ink hover:underline"
                                >
                                  <BookMarked size={13} />
                                  {problem.shortTitle}（文系の数学で開く）
                                  <ChevronRight size={13} />
                                </Link>
                              ) : null}

                              {problem.kind !== 'insight' ? (
                                <Link
                                  to={`/problems/${problem.id}`}
                                  className="inline-flex items-center gap-1 text-xs font-medium text-accent-ink hover:underline"
                                >
                                  {bunkeiLink ? '誤答ノート詳細' : problem.shortTitle}
                                  <ChevronRight size={13} />
                                </Link>
                              ) : !bunkeiLink ? (
                                <span className="text-xs text-muted">
                                  {problem.shortTitle}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      ) : tab === 'cards' ? (
        /* 暗記カードタブ */
        <div className="space-y-4">
          {showNewForm ? (
            <Card className="p-5">
              <h2 className="text-sm font-semibold">新しい暗記カード</h2>
              <form onSubmit={handleCreateCard} className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="教科">
                    <Select
                      value={cardSubject}
                      onChange={(event) => setCardSubject(event.target.value)}
                    >
                      {SUBJECTS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="単元（任意）">
                    <Input
                      value={cardUnit}
                      onChange={(event) => setCardUnit(event.target.value)}
                      placeholder="例: 二次関数 / 力学"
                    />
                  </Field>
                </div>

                <Field label="表面（問い・用語）">
                  <Input
                    value={front}
                    onChange={(event) => setFront(event.target.value)}
                    placeholder="例: 二次関数の最大・最小を確認する手順は？"
                    required
                  />
                </Field>

                <Field label="裏面（答え・定石・ポイント）">
                  <Textarea
                    value={back}
                    onChange={(event) => setBack(event.target.value)}
                    placeholder="例: 平方完成して軸の位置を出し、定義域の内側か外側かと端点の値を確認する。"
                    className="min-h-24"
                    required
                  />
                </Field>

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowNewForm(false)}
                  >
                    キャンセル
                  </Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                    保存する
                  </Button>
                </div>
              </form>
            </Card>
          ) : null}

          <Card className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-accent-soft text-accent-ink">
                <RotateCcw size={17} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold">今日のカード復習</h2>
                  <Badge tone={dueCards.length > 0 ? 'accent' : 'neutral'}>
                    {dueCards.length} 枚
                  </Badge>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {dueCards.length > 0
                    ? '覚えているか確認すると、次回の復習日が自動で伸びます。'
                    : cards && cards.length > 0
                      ? '今日の復習カードはすべて完了しています。全カードをまとめて見直すこともできます。'
                      : '気づきから「カード化」するか、「カードを追加」で暗記カードを作れます。'}
                </p>
              </div>
            </div>

            {dueCards.length > 0 ? (
              <Button onClick={() => startReview(dueCards)} className="shrink-0">
                復習を始める
                <ArrowRight size={15} />
              </Button>
            ) : cards && cards.length > 0 ? (
              <Button
                variant="secondary"
                onClick={() => startReview(cards)}
                className="shrink-0"
              >
                全カードを見直す ({cards.length})
              </Button>
            ) : null}
          </Card>

          {!cards ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : cards.length === 0 ? (
            <EmptyState
              icon={Layers}
              title="暗記カードがまだありません"
              description="「気づき」タブからワンタップでカード化するか、右上の「カードを追加」から作成できます。"
              action={
                <Button onClick={() => setShowNewForm(true)}>
                  <Plus size={16} />
                  最初のカードを作成
                </Button>
              }
            />
          ) : (
            <>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="カードの表面・裏面で検索"
                    className="pl-9"
                  />
                </div>
                <GlassSelect
                  value={subject}
                  onChange={setSubject}
                  size="md"
                  className="sm:w-44"
                  options={[
                    { value: 'all', label: 'すべての教科' },
                    ...cardSubjects.map((item) => ({ value: item, label: item })),
                  ]}
                />
              </div>

              {filteredCards.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="条件に合うカードがありません"
                  description="検索語や教科フィルタを変えてみてください。"
                />
              ) : (
                <div className="space-y-2.5">
                  {filteredCards.map((card) => {
                    const due = isDue(card.nextReviewAt);
                    return (
                      <Card key={card.id} className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge tone="neutral">{card.subject}</Badge>
                            <Badge tone="neutral">{card.unit}</Badge>
                            <Badge tone={due ? 'accent' : 'neutral'}>
                              <CalendarClock size={11} />
                              次回: {describeNextReview(card.nextReviewAt)}
                            </Badge>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteCard(card)}
                            className="rounded p-1 text-muted hover:bg-surface-2 hover:text-danger"
                            aria-label="カードを削除"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <p className="mt-3 text-[0.95rem] font-semibold leading-snug">
                          <InlineMarkdown>{card.front}</InlineMarkdown>
                        </p>
                        <div className="mt-2 rounded-[10px] bg-surface-2 px-3.5 py-2.5 text-sm leading-relaxed text-muted">
                          <Markdown>{card.back}</Markdown>
                        </div>

                        {card.problemId ? (
                          <Link
                            to={`/problems/${card.problemId}`}
                            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent-ink hover:underline"
                          >
                            {card.problemTitle || '元の問題を見る'}
                            <ChevronRight size={13} />
                          </Link>
                        ) : null}
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* 質問アーカイブタブ */
        <div className="space-y-4">
          {!qnaLogs ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : qnaLogs.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="質問アーカイブがまだありません"
              description="ダッシュボード右側の問題詳細パネルにある「💬 AIにこの問題を質問する」から質問すると、ここに自動で記録されます。"
            />
          ) : (
            <>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="質問内容・AI回答・問題タイトル・単元で検索..."
                    className="pl-9"
                  />
                </div>
                <GlassSelect
                  value={subject}
                  onChange={setSubject}
                  size="md"
                  className="sm:w-44"
                  options={[
                    { value: 'all', label: 'すべての教科' },
                    ...qnaSubjects.map((item) => ({ value: item, label: item })),
                  ]}
                />
              </div>

              {filteredQnaLogs.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="条件に合う質問ログがありません"
                  description="検索語や教科フィルタを変えてみてください。"
                />
              ) : (
                <div className="space-y-3">
                  {filteredQnaLogs.map((log) => {
                    const isExpanded = expandedQnaId === log.id;
                    const firstUserMsg =
                      log.messages.find((m) => m.role === 'user')?.content || '';
                    const firstAssistantMsg =
                      log.messages.find((m) => m.role === 'assistant')?.content ||
                      '';
                    const dateLabel = new Date(log.savedAt).toLocaleString(
                      'ja-JP',
                      {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    );

                    return (
                      <Card key={log.id} className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge tone="accent">{log.subject}</Badge>
                            <Badge tone="neutral">{log.unit}</Badge>
                            <span className="text-xs text-muted">
                              🗓️ {dateLabel}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => void handleDeleteQna(log)}
                            className="rounded p-1 text-muted hover:bg-surface-2 hover:text-danger"
                            aria-label="質問ログを削除"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <p className="mt-2.5 text-[0.95rem] font-bold text-ink">
                          📌 <InlineMarkdown>{log.shortTitle}</InlineMarkdown>
                        </p>

                        {!isExpanded ? (
                          <div className="mt-2 space-y-2">
                            {firstUserMsg ? (
                              <p className="truncate text-xs font-medium text-accent-ink">
                                💬 質問: {firstUserMsg}
                              </p>
                            ) : null}
                            {firstAssistantMsg ? (
                              <div className="line-clamp-3 rounded-[10px] bg-surface-2 px-3.5 py-2.5 text-xs leading-relaxed text-muted">
                                <Markdown>{firstAssistantMsg}</Markdown>
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <div className="mt-3 space-y-2.5">
                            {log.messages.map((msg, idx) => (
                              <div
                                key={idx}
                                className={cn(
                                  'rounded-[10px] px-3.5 py-2.5 text-xs leading-relaxed',
                                  msg.role === 'user'
                                    ? 'border border-accent/35 bg-accent-soft/40 text-ink'
                                    : 'border border-border bg-surface-2 text-ink',
                                )}
                              >
                                <p className="mb-1 text-[0.65rem] font-bold text-muted">
                                  {msg.role === 'user'
                                    ? '🙋 あなたの質問'
                                    : '🤖 AI講師の回答'}
                                </p>
                                <Markdown>{msg.content}</Markdown>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedQnaId(isExpanded ? null : log.id)
                            }
                            className="text-xs font-semibold text-accent-ink hover:underline"
                          >
                            {isExpanded
                              ? '▲ 会話を折りたたむ'
                              : `▼ 会話全文を開く（${log.messages.length} 件のメッセージ）`}
                          </button>

                          {log.problemId ? (
                            <Link
                              to={`/?id=${encodeURIComponent(log.problemId)}`}
                              className="inline-flex items-center gap-1 text-xs font-medium text-accent-ink hover:underline"
                            >
                              ダッシュボードでこの問題を開く
                              <ChevronRight size={13} />
                            </Link>
                          ) : null}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
