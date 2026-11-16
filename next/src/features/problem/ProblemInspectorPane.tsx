import { useLiveQuery } from 'dexie-react-hooks';
import {
  BookMarked,
  BookmarkPlus,
  CalendarClock,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  FastForward,
  Layers,
  Lightbulb,
  Loader2,
  MessageSquarePlus,
  Pencil,
  Pin,
  Save,
  Send,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { askProblemQuestion, generateExplanation } from '@/ai/client';
import { cn } from '@/core/lib/cn';
import { formatDate } from '@/core/lib/date';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Input, Textarea } from '@/core/ui/Field';
import { GlassSelect } from '@/core/ui/GlassSelect';
import { InlineMarkdown, Markdown } from '@/core/ui/Markdown';
import { StructuredMathContent } from '@/core/ui/StructuredMathContent';
import { useToast } from '@/core/ui/Toast';
import {
  recordMarathonStep,
  toggleMarathonAutoAdvance,
  useMarathon,
} from '@/data/marathon';
import {
  createFlashcard,
  deleteProblem,
  getProblemImages,
  getQnaLogsByProblem,
  listFlashcards,
  recordReview,
  saveQnaLog,
  toggleProblemPin,
  updateProblem,
} from '@/data/repo';
import { describeNextReview } from '@/data/srs';
import { SUBJECTS } from '@/data/subjects';
import type { Problem, QnaMessage } from '@/data/types';
import { BlobImage } from './BlobImage';

type Busy =
  | 'explain'
  | 'correct'
  | 'wrong'
  | 'delete'
  | 'card'
  | 'insight'
  | 'edit'
  | 'qna'
  | null;

const QUICK_QUESTIONS = [
  '最初の一手をどう見抜けばいい？',
  '模範解答の式変形の理由を詳しく教えて',
  '別解や検算・見直しの方法はある？',
];

export function ProblemInspectorPane({
  problem,
  onDeleted,
  onReviewed,
}: {
  problem: Problem | null;
  onDeleted?: (deletedId: string) => void;
  onReviewed?: (problemId: string, correct: boolean) => void;
}) {
  const marathon = useMarathon();
  const images = useLiveQuery(
    async () => (problem ? getProblemImages(problem.id) : []),
    [problem?.id],
  );
  const existingCard = useLiveQuery(async () => {
    if (!problem) return undefined;
    const cards = await listFlashcards();
    return cards.find((card) => card.problemId === problem.id);
  }, [problem?.id]);
  const problemQnaLogs = useLiveQuery(
    async () => (problem ? getQnaLogsByProblem(problem.id) : []),
    [problem?.id],
  );

  const [busy, setBusy] = useState<Busy>(null);
  const [insightDraft, setInsightDraft] = useState('');
  const [editingInsight, setEditingInsight] = useState(false);
  const [alwaysShowAnswer, setAlwaysShowAnswer] = useState(true);
  const [showAnswer, setShowAnswer] = useState(true);

  // 問題本体の編集モード
  const [editingProblem, setEditingProblem] = useState(false);
  const [editShortTitle, setEditShortTitle] = useState('');
  const [editSubject, setEditSubject] = useState('数学');
  const [editUnit, setEditUnit] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editStrategy, setEditStrategy] = useState('');
  const [editTrap, setEditTrap] = useState('');
  const [editErrorCount, setEditErrorCount] = useState('0');

  // AI質問チャット
  const [qnaMessages, setQnaMessages] = useState<QnaMessage[]>([]);
  const [activeQnaId, setActiveQnaId] = useState<string | undefined>(undefined);
  const [qnaInput, setQnaInput] = useState('');

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setInsightDraft(problem?.insight ?? '');
    setEditingInsight(false);
    setEditingProblem(false);
    setShowAnswer(alwaysShowAnswer);
    setQnaInput('');
  }, [problem?.id, problem?.insight, alwaysShowAnswer]);

  // 既存の質問ログがあれば最新のスレッドを復元
  useEffect(() => {
    if (!problemQnaLogs || problemQnaLogs.length === 0) {
      setQnaMessages([]);
      setActiveQnaId(undefined);
      return;
    }
    const latest = problemQnaLogs[problemQnaLogs.length - 1];
    setQnaMessages(latest.messages);
    setActiveQnaId(latest.id);
  }, [problemQnaLogs]);

  function openEditProblem() {
    if (!problem) return;
    setEditShortTitle(problem.shortTitle);
    setEditSubject(problem.subject || '数学');
    setEditUnit(problem.unit || '');
    setEditTitle(problem.title || '');
    setEditAnswer(problem.answer || '');
    setEditStrategy(problem.strategy || '');
    setEditTrap(problem.trap || '');
    setEditErrorCount(String(problem.errorCount ?? 0));
    setEditingProblem(true);
  }

  async function handleSaveProblemEdit(event: FormEvent) {
    event.preventDefault();
    if (!problem) return;
    setBusy('edit');
    try {
      const nextErr = Math.max(0, Math.floor(Number(editErrorCount) || 0));
      await updateProblem(problem.id, {
        shortTitle: editShortTitle.trim() || problem.shortTitle,
        subject: editSubject.trim() || problem.subject,
        unit: editUnit.trim() || '未分類',
        title: editTitle.trim() || editShortTitle.trim(),
        answer: editAnswer.trim(),
        strategy: editStrategy.trim(),
        trap: editTrap.trim(),
        errorCount: nextErr,
      });
      setEditingProblem(false);
      toast('問題データを更新しました。', 'success');
    } catch (error) {
      toast(
        error instanceof Error ? error.message : '更新に失敗しました。',
        'error',
      );
    } finally {
      setBusy(null);
    }
  }

  if (!problem) {
    return (
      <Card className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
        <p className="text-sm font-medium text-ink">
          左のリストから問題を選択してください
        </p>
        <p className="mt-1 text-xs text-muted">
          クリックした問題の問題文・写真・模範解答・気づきメモ・AI質問チャットがここに表示されます。
        </p>
      </Card>
    );
  }

  const isMarathonCleared = marathon.clearedIds.includes(problem.id);
  const isMarathonRetry =
    !isMarathonCleared && marathon.retryIds.includes(problem.id);

  const bunkeiLink = (() => {
    if (problem.bunkeiId) {
      const mode = problem.bunkeiMode ?? 'reidai';
      return `/practice/bunkei?mode=${mode}&id=${problem.bunkeiId}`;
    }
    const exMatch = /^BUNKEI_MATH_EX_(\d+)$/.exec(problem.id);
    if (exMatch) return `/practice/bunkei?mode=exercise&id=${exMatch[1]}`;
    const reidaiMatch = /^BUNKEI_MATH_(\d+)$/.exec(problem.id);
    if (reidaiMatch) return `/practice/bunkei?mode=reidai&id=${reidaiMatch[1]}`;
    return null;
  })();

  async function handleGenerate() {
    if (!problem) return;
    setBusy('explain');
    try {
      const result = await generateExplanation(problem);
      if (result.ok && result.data) {
        await updateProblem(problem.id, {
          explanation: result.data,
          demo: Boolean(result.mock),
        });
        toast(
          result.mock ? 'デモ解説を生成しました。' : 'AI解説を生成しました。',
          'success',
        );
      } else {
        toast(result.error ?? '解説の生成に失敗しました。', 'error');
      }
    } finally {
      setBusy(null);
    }
  }

  async function handleReview(correct: boolean) {
    if (!problem) return;
    setBusy(correct ? 'correct' : 'wrong');
    try {
      const targetId = problem.id;
      const result = await recordReview(targetId, correct);
      recordMarathonStep(targetId, correct);
      toast(
        correct
          ? `🏁 周回クリア！次回は${describeNextReview(result.nextReviewAt)}です。`
          : '🔄 要再挑戦として記録しました（誤答+1 / 明日再出題）。',
        correct ? 'success' : 'info',
      );
      onReviewed?.(targetId, correct);
    } catch (error) {
      toast(
        error instanceof Error ? error.message : '記録に失敗しました。',
        'error',
      );
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete() {
    if (!problem) return;
    if (!window.confirm('この問題を削除しますか？この操作は取り消せません。')) return;
    setBusy('delete');
    try {
      const targetId = problem.id;
      await deleteProblem(targetId);
      toast('問題を削除しました。', 'success');
      onDeleted?.(targetId);
    } finally {
      setBusy(null);
    }
  }

  async function handleAddCard() {
    if (!problem || existingCard) return;
    setBusy('card');
    try {
      const backParts = [
        problem.insight,
        problem.mnemonic,
        problem.strategy,
        problem.trap,
      ].filter(Boolean);
      const back =
        backParts.length > 0
          ? backParts.join('\n\n')
          : problem.answer || problem.title;
      await createFlashcard({
        front: `${problem.shortTitle}の定石・注意点は？`,
        back,
        subject: problem.subject,
        unit: problem.unit,
        problemId: problem.id,
        problemTitle: problem.shortTitle,
      });
      toast('暗記カードに追加しました。', 'success');
    } catch (error) {
      toast(
        error instanceof Error ? error.message : '追加に失敗しました。',
        'error',
      );
    } finally {
      setBusy(null);
    }
  }

  async function handleSaveInsight() {
    if (!problem) return;
    setBusy('insight');
    try {
      await updateProblem(problem.id, {
        insight: insightDraft.trim(),
        insightUpdatedAt: new Date().toISOString(),
      });
      setEditingInsight(false);
      toast('気づきメモを保存しました。', 'success');
    } catch (error) {
      toast(
        error instanceof Error ? error.message : '保存に失敗しました。',
        'error',
      );
    } finally {
      setBusy(null);
    }
  }

  async function handleAskQuestion(rawQuestion?: string) {
    if (!problem || busy === 'qna') return;
    const text = (rawQuestion ?? qnaInput).trim();
    if (!text) return;

    const now = new Date().toISOString();
    const nextUserMsg: QnaMessage = {
      role: 'user',
      content: text,
      createdAt: now,
    };
    const updatedHistory = [...qnaMessages, nextUserMsg];
    setQnaMessages(updatedHistory);
    if (!rawQuestion) setQnaInput('');
    setBusy('qna');

    try {
      const res = await askProblemQuestion({
        problem,
        messages: updatedHistory.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const replyText =
        res.ok && res.data?.reply
          ? res.data.reply
          : `申し訳ありません。回答の生成に失敗しました（${res.error || 'エラー'}）。`;

      const assistantMsg: QnaMessage = {
        role: 'assistant',
        content: replyText,
        createdAt: new Date().toISOString(),
      };
      const finalMessages = [...updatedHistory, assistantMsg];
      setQnaMessages(finalMessages);

      const saved = await saveQnaLog({
        id: activeQnaId,
        problemId: problem.id,
        shortTitle: problem.shortTitle,
        subject: problem.subject,
        unit: problem.unit,
        messages: finalMessages,
      });
      setActiveQnaId(saved.id);
    } catch (error) {
      toast(
        error instanceof Error ? error.message : 'AI質問の送信に失敗しました。',
        'error',
      );
    } finally {
      setBusy(null);
    }
  }

  const explanation = problem.explanation;
  const answerVisible = alwaysShowAnswer || showAnswer;

  return (
    <Card className="flex flex-col gap-4 p-5">
      {/* ヘッダー：バッジ＆アクションボタン */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3.5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone="accent">{problem.subject}</Badge>
            {problem.unit ? <Badge tone="neutral">{problem.unit}</Badge> : null}
            {problem.errorCount > 0 ? (
              <Badge tone={problem.errorCount >= 3 ? 'danger' : 'warning'}>
                誤答 {problem.errorCount}回
              </Badge>
            ) : null}
            {isMarathonCleared ? (
              <Badge tone="accent">🏁 第{marathon.lap}周クリア済</Badge>
            ) : isMarathonRetry ? (
              <Badge tone="danger">🔄 第{marathon.lap}周 要再挑戦</Badge>
            ) : null}
          </div>

          <h2 className="mt-2 text-lg font-bold leading-snug tracking-[-0.01em] text-ink">
            <InlineMarkdown>{problem.shortTitle}</InlineMarkdown>
          </h2>

          <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <CalendarClock size={12} />
              次回: {describeNextReview(problem.nextReviewAt)}
            </span>
            <span aria-hidden>·</span>
            <span>追加: {formatDate(problem.createdAt)}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {bunkeiLink ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(bunkeiLink)}
              title="『文系の数学』ページで開く"
            >
              <BookMarked size={13} />
              文系数学
            </Button>
          ) : null}
          <button
            type="button"
            onClick={() =>
              editingProblem ? setEditingProblem(false) : openEditProblem()
            }
            className={cn(
              'inline-flex h-8 items-center gap-1 rounded-[8px] border px-2.5 text-xs font-medium transition-colors',
              editingProblem
                ? 'border-accent bg-accent-soft text-accent-ink'
                : 'border-border bg-surface-2 text-muted hover:text-ink',
            )}
            title="問題のタイトル・単元・本文・解答を編集"
          >
            <Pencil size={12} />
            編集
          </button>
          <button
            type="button"
            onClick={() => void toggleProblemPin(problem.id)}
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-[8px] border transition-colors',
              problem.pinned
                ? 'border-warning/50 bg-warning-soft/50 text-warning'
                : 'border-border bg-surface-2 text-muted hover:text-ink',
            )}
            title="ピン留め切り替え"
          >
            <Star
              size={14}
              className={problem.pinned ? 'fill-warning text-warning' : ''}
            />
          </button>
          {existingCard ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/notes?tab=cards')}
            >
              <Layers size={13} />
              カード済
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddCard}
              disabled={busy !== null}
            >
              {busy === 'card' ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <BookmarkPlus size={13} />
              )}
              カード化
            </Button>
          )}
          <button
            type="button"
            onClick={() => navigate(`/problems/${problem.id}`)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-border bg-surface-2 text-muted transition-colors hover:text-ink"
            title="単独ページで大きく開く"
          >
            <ExternalLink size={13} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy !== null}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-border bg-surface-2 text-muted transition-colors hover:border-danger/40 hover:text-danger disabled:opacity-50"
            title="問題を削除"
          >
            {busy === 'delete' ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
          </button>
        </div>
      </div>

      {/* インライン問題編集フォーム */}
      {editingProblem ? (
        <form
          onSubmit={handleSaveProblemEdit}
          className="space-y-3 rounded-[12px] border border-accent/40 bg-surface-2 p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-accent-ink">
              ✏️ 問題データの編集
            </p>
            <button
              type="button"
              onClick={() => setEditingProblem(false)}
              className="text-xs text-muted hover:text-ink"
            >
              閉じる
            </button>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[0.7rem] font-semibold text-muted">
                教科
              </label>
              <GlassSelect
                size="sm"
                value={editSubject}
                onChange={setEditSubject}
                options={Array.from(new Set([...SUBJECTS, editSubject])).map(
                  (s) => ({ value: s, label: s }),
                )}
              />
            </div>
            <div>
              <label className="mb-1 block text-[0.7rem] font-semibold text-muted">
                単元
              </label>
              <Input
                value={editUnit}
                onChange={(e) => setEditUnit(e.target.value)}
                className="h-9 text-xs"
                placeholder="例: 数学II 図形と方程式"
              />
            </div>
            <div>
              <label className="mb-1 block text-[0.7rem] font-semibold text-muted">
                誤答回数
              </label>
              <Input
                type="number"
                min={0}
                value={editErrorCount}
                onChange={(e) => setEditErrorCount(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[0.7rem] font-semibold text-muted">
              タイトル（一覧用）
            </label>
            <Input
              value={editShortTitle}
              onChange={(e) => setEditShortTitle(e.target.value)}
              className="h-9 text-xs"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-[0.7rem] font-semibold text-muted">
              問題文（LaTeX数式 $...$ 対応）
            </label>
            <Textarea
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="min-h-20 text-xs"
            />
          </div>

          <div>
            <label className="mb-1 block text-[0.7rem] font-semibold text-muted">
              模範解答
            </label>
            <Textarea
              value={editAnswer}
              onChange={(e) => setEditAnswer(e.target.value)}
              className="min-h-24 text-xs"
            />
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[0.7rem] font-semibold text-muted">
                定石
              </label>
              <Textarea
                value={editStrategy}
                onChange={(e) => setEditStrategy(e.target.value)}
                className="min-h-16 text-xs"
              />
            </div>
            <div>
              <label className="mb-1 block text-[0.7rem] font-semibold text-muted">
                罠・注意点
              </label>
              <Textarea
                value={editTrap}
                onChange={(e) => setEditTrap(e.target.value)}
                className="min-h-16 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditingProblem(false)}
            >
              キャンセル
            </Button>
            <Button type="submit" size="sm" disabled={busy === 'edit'}>
              {busy === 'edit' ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Save size={13} />
              )}
              変更を保存
            </Button>
          </div>
        </form>
      ) : null}

      {/* クイック自己採点＆マラソン連動＆解答表示切替バー */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-border bg-surface-2 px-3 py-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-muted">自己採点:</span>
          <button
            type="button"
            onClick={() => void handleReview(false)}
            disabled={busy !== null}
            className="inline-flex items-center gap-1 rounded-[7px] border border-danger/40 bg-danger-soft/40 px-2.5 py-1 text-xs font-semibold text-danger transition-colors hover:bg-danger-soft disabled:opacity-50"
          >
            {busy === 'wrong' ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <X size={12} />
            )}
            間違えた
          </button>
          <button
            type="button"
            onClick={() => void handleReview(true)}
            disabled={busy !== null}
            className="inline-flex items-center gap-1 rounded-[7px] bg-accent px-2.5 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy === 'correct' ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Check size={12} />
            )}
            解けた（周回クリア）
          </button>

          <button
            type="button"
            onClick={() => toggleMarathonAutoAdvance()}
            className={cn(
              'inline-flex items-center gap-1 rounded-[7px] border px-2 py-1 text-[0.68rem] font-medium transition-colors',
              marathon.autoAdvance
                ? 'border-accent/40 bg-accent-soft/50 text-accent-ink'
                : 'border-border bg-surface text-muted hover:text-ink',
            )}
            title="自己採点した直後に、自動で次の未クリア問題へ移動します"
          >
            <FastForward size={11} />
            自動次問: {marathon.autoAdvance ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setAlwaysShowAnswer((prev) => !prev)}
            className={cn(
              'inline-flex items-center gap-1 rounded-[7px] border px-2 py-1 text-[0.7rem] font-medium transition-colors',
              alwaysShowAnswer
                ? 'border-accent/50 bg-accent-soft text-accent-ink'
                : 'border-border bg-surface text-muted hover:text-ink',
            )}
          >
            <Pin size={11} />
            解答常時表示: {alwaysShowAnswer ? 'ON' : 'OFF'}
          </button>
          {!alwaysShowAnswer ? (
            <button
              type="button"
              onClick={() => setShowAnswer((prev) => !prev)}
              className="inline-flex items-center gap-1 rounded-[7px] border border-border bg-surface px-2 py-1 text-[0.7rem] font-medium text-ink"
            >
              {showAnswer ? <EyeOff size={11} /> : <Eye size={11} />}
              {showAnswer ? '隠す' : '解答を見る'}
            </button>
          ) : null}
        </div>
      </div>

      {/* 問題画像（ある場合） */}
      {images && images.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-[10px] border border-border bg-surface-2"
            >
              <BlobImage
                image={image}
                alt={`問題画像 ${index + 1}`}
                className="max-h-[340px] w-full object-contain"
              />
            </div>
          ))}
        </div>
      ) : problem.thumbDataUrl ? (
        <div className="overflow-hidden rounded-[10px] border border-border bg-surface-2">
          <img
            src={problem.thumbDataUrl}
            alt="問題サムネイル"
            className="max-h-[260px] w-full object-contain"
          />
        </div>
      ) : null}

      {/* 問題文 */}
      <div className="rounded-[12px] border border-border bg-surface-2/70 p-4">
        <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-muted">
          問題文
        </p>
        <div className="text-[0.95rem] leading-[1.85]">
          <Markdown>{problem.title || problem.shortTitle}</Markdown>
        </div>
      </div>

      {/* 掴んだ極意・気づきメモ（インライン編集対応） */}
      <div className="rounded-[12px] border border-accent/30 bg-accent-soft/25 p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-accent-ink">
            <Lightbulb size={14} className="text-warning" />
            🧠 掴んだ極意・気づきメモ
          </p>
          {!editingInsight ? (
            <button
              type="button"
              onClick={() => setEditingInsight(true)}
              className="text-xs font-medium text-accent-ink hover:underline"
            >
              {problem.insight ? '編集する' : '＋ メモを書く'}
            </button>
          ) : null}
        </div>

        {editingInsight ? (
          <div className="space-y-2">
            <Textarea
              value={insightDraft}
              onChange={(event) => setInsightDraft(event.target.value)}
              placeholder="この問題で気づいたこと・自分の言葉でまとめた解法の地図を記録（数式 $...$ も使えます）"
              className="min-h-20 text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setInsightDraft(problem.insight ?? '');
                  setEditingInsight(false);
                }}
              >
                キャンセル
              </Button>
              <Button
                size="sm"
                onClick={handleSaveInsight}
                disabled={busy === 'insight'}
              >
                {busy === 'insight' ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Save size={13} />
                )}
                保存する
              </Button>
            </div>
          </div>
        ) : problem.insight ? (
          <div className="text-sm leading-relaxed text-ink">
            <Markdown>{problem.insight}</Markdown>
          </div>
        ) : (
          <p className="text-xs text-muted">
            まだ気づきメモがありません。「＋ メモを書く」から重要な着眼点を残せます。
          </p>
        )}
      </div>

      {/* 模範解答・定石・罠・AI解説・AI質問チャット */}
      {!answerVisible ? (
        <Button
          size="lg"
          className="w-full"
          onClick={() => setShowAnswer(true)}
        >
          <Eye size={16} />
          模範解答・解説を表示する
        </Button>
      ) : (
        <div className="space-y-3.5">
          {problem.answer ? (
            <div className="rounded-[12px] border border-border bg-surface-2/60 p-4">
              <p className="mb-2 text-xs font-bold text-accent-ink">模範解答</p>
              <StructuredMathContent variant="answer">
                {problem.answer}
              </StructuredMathContent>
            </div>
          ) : null}

          {problem.strategy || problem.trap || problem.mnemonic ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {problem.strategy ? (
                <div className="rounded-[10px] border border-border bg-surface-2 p-3.5">
                  <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted">
                    定石
                  </p>
                  <p className="text-xs leading-relaxed">
                    <InlineMarkdown>{problem.strategy}</InlineMarkdown>
                  </p>
                </div>
              ) : null}
              {problem.trap ? (
                <div className="rounded-[10px] border border-warning/30 bg-warning-soft/40 p-3.5">
                  <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-warning">
                    罠・注意点
                  </p>
                  <p className="text-xs leading-relaxed">
                    <InlineMarkdown>{problem.trap}</InlineMarkdown>
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* 💬 AI質問チャット（質問アーカイブ自動保存連動） */}
          <div className="rounded-[12px] border border-border bg-surface-2/60 p-4">
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-xs font-bold text-ink">
                <MessageSquarePlus size={14} className="text-accent-ink" />
                💬 AIにこの問題を質問する
              </p>
              <Link
                to="/notes?tab=qna"
                className="text-[0.7rem] font-medium text-accent-ink hover:underline"
              >
                質問アーカイブ一覧を見る →
              </Link>
            </div>

            {/* クイック質問チップ */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={busy === 'qna'}
                  onClick={() => void handleAskQuestion(q)}
                  className="rounded-full border border-border bg-surface px-2.5 py-1 text-[0.7rem] text-muted transition-colors hover:border-accent/50 hover:text-ink disabled:opacity-50"
                >
                  💡 {q}
                </button>
              ))}
            </div>

            {/* 会話履歴 */}
            {qnaMessages.length > 0 ? (
              <div className="mb-3 max-h-80 space-y-2.5 overflow-y-auto pr-1">
                {qnaMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'rounded-[10px] px-3.5 py-2.5 text-xs leading-relaxed',
                      msg.role === 'user'
                        ? 'ml-6 border border-accent/35 bg-accent-soft/45 text-ink'
                        : 'mr-2 border border-border bg-surface text-ink',
                    )}
                  >
                    <p className="mb-1 text-[0.65rem] font-bold text-muted">
                      {msg.role === 'user' ? '🙋 あなたの質問' : '🤖 AI講師の回答'}
                    </p>
                    <Markdown>{msg.content}</Markdown>
                  </div>
                ))}
              </div>
            ) : null}

            {/* 質問入力フォーム */}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void handleAskQuestion();
              }}
              className="flex gap-2"
            >
              <Input
                value={qnaInput}
                onChange={(event) => setQnaInput(event.target.value)}
                placeholder="わからない式変形や疑問点を入力して質問（自動で質問アーカイブに保存されます）"
                className="h-9 flex-1 bg-surface text-xs"
                disabled={busy === 'qna'}
              />
              <Button
                type="submit"
                size="sm"
                disabled={busy === 'qna' || !qnaInput.trim()}
                className="shrink-0"
              >
                {busy === 'qna' ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Send size={13} />
                )}
                質問
              </Button>
            </form>
          </div>

          {/* AI解説 */}
          <div className="rounded-[12px] border border-border bg-surface-2/50 p-4">
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-muted">AI構造化解説</p>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={busy !== null}
                className="inline-flex items-center gap-1 text-xs font-medium text-accent-ink hover:underline disabled:opacity-50"
              >
                {busy === 'explain' ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Sparkles size={12} />
                )}
                {explanation ? 'AI解説を再生成' : 'AI解説を生成'}
              </button>
            </div>

            {explanation ? (
              <div className="space-y-3 text-sm">
                <p className="leading-relaxed">
                  <InlineMarkdown>{explanation.summary}</InlineMarkdown>
                </p>
                {explanation.sections.map((section, index) => (
                  <div
                    key={`${section.title}-${index}`}
                    className="rounded-[9px] bg-surface p-3"
                  >
                    <p className="mb-1 text-xs font-semibold text-accent-ink">
                      {section.title}
                    </p>
                    <Markdown>{section.body}</Markdown>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">
                右上の「AI解説を生成」を押すと、解法のステップと間違えやすいポイントを自動生成します。
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
