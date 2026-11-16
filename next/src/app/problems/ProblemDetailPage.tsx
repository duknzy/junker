import { useLiveQuery } from 'dexie-react-hooks';
import {
  ArrowLeft,
  BookMarked,
  BookmarkPlus,
  CalendarClock,
  Check,
  ImageIcon,
  Layers,
  Lightbulb,
  Loader2,
  Save,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { generateExplanation } from '@/ai/client';
import { formatDate } from '@/core/lib/date';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { EmptyState } from '@/core/ui/EmptyState';
import { Textarea } from '@/core/ui/Field';
import { InlineMarkdown, Markdown } from '@/core/ui/Markdown';
import { Skeleton } from '@/core/ui/Spinner';
import { StructuredMathContent } from '@/core/ui/StructuredMathContent';
import { useToast } from '@/core/ui/Toast';
import {
  createFlashcard,
  deleteProblem,
  getProblem,
  getProblemImages,
  listFlashcards,
  recordReview,
  toggleProblemPin,
  updateProblem,
} from '@/data/repo';
import { describeNextReview } from '@/data/srs';
import { BlobImage } from '@/features/problem/BlobImage';

type Busy = 'explain' | 'correct' | 'wrong' | 'delete' | 'card' | 'insight' | null;

export function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const problem = useLiveQuery(async () => {
    if (!id) return null;
    return (await getProblem(id)) ?? null;
  }, [id]);
  const images = useLiveQuery(
    async () => (id ? getProblemImages(id) : []),
    [id],
  );
  const existingCard = useLiveQuery(async () => {
    if (!id) return undefined;
    const cards = await listFlashcards();
    return cards.find((card) => card.problemId === id);
  }, [id]);
  const [busy, setBusy] = useState<Busy>(null);
  const [insightDraft, setInsightDraft] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setInsightDraft(problem?.insight ?? '');
  }, [problem?.id, problem?.insight]);

  if (problem === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (problem === null) {
    return (
      <EmptyState
        icon={ImageIcon}
        title="問題が見つかりません"
        description="削除されたか、URLが正しくない可能性があります。"
        action={
          <Button onClick={() => navigate('/problems')}>問題一覧へ戻る</Button>
        }
      />
    );
  }

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
          result.mock ? 'デモ解説を生成しました。' : '解説を生成しました。',
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
      const result = await recordReview(problem.id, correct);
      toast(
        correct
          ? `正解。次回は${describeNextReview(result.nextReviewAt)}です。`
          : '不正解。明日もう一度出題します。',
        correct ? 'success' : 'info',
      );
    } catch (error) {
      toast(error instanceof Error ? error.message : '記録に失敗しました。', 'error');
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete() {
    if (!problem) return;
    if (!window.confirm('この問題を削除しますか？この操作は取り消せません。')) return;
    setBusy('delete');
    try {
      await deleteProblem(problem.id);
      toast('問題を削除しました。', 'success');
      navigate('/problems');
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
      const back = backParts.length > 0 ? backParts.join('\n\n') : problem.answer || problem.title;
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
      toast(error instanceof Error ? error.message : '追加に失敗しました。', 'error');
    } finally {
      setBusy(null);
    }
  }

  async function handleSaveInsight() {
    if (!problem) return;
    setBusy('insight');
    try {
      await updateProblem(problem.id, { insight: insightDraft.trim() });
      toast('気づきメモを保存しました。', 'success');
    } catch (error) {
      toast(error instanceof Error ? error.message : '保存に失敗しました。', 'error');
    } finally {
      setBusy(null);
    }
  }

  async function handleTogglePin() {
    if (!problem) return;
    await toggleProblemPin(problem.id);
  }

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

  const explanation = problem.explanation;

  return (
    <div>
      <Link
        to="/problems"
        className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
      >
        <ArrowLeft size={14} />
        問題一覧へ戻る
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{problem.subject}</Badge>
            <Badge tone="neutral">{problem.unit}</Badge>
            {problem.demo ? <Badge tone="warning">デモ</Badge> : null}
            {problem.errorCount > 0 ? (
              <Badge tone="danger">誤答 {problem.errorCount}回</Badge>
            ) : null}
          </div>
          <h1 className="mt-2 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">
            {problem.shortTitle}
          </h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
            <CalendarClock size={13} />
            次回の復習: {describeNextReview(problem.nextReviewAt)}
            <span aria-hidden>·</span>
            登録 {formatDate(problem.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {bunkeiLink ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(bunkeiLink)}
            >
              <BookMarked size={14} />
              『文系の数学』で開く
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTogglePin}
            aria-label="ピン留め切り替え"
            title="ピン留め"
          >
            <Star
              size={14}
              className={problem.pinned ? 'fill-warning text-warning' : ''}
            />
          </Button>
          {existingCard ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/notes?tab=cards')}
            >
              <Layers size={14} />
              カードを見る
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddCard}
              disabled={busy !== null}
            >
              {busy === 'card' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <BookmarkPlus size={14} />
              )}
              カード化
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleGenerate}
            disabled={busy !== null}
          >
            {busy === 'explain' ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {explanation ? '解説を再生成' : '解説を生成'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={busy !== null}
            aria-label="問題を削除"
          >
            {busy === 'delete' ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          </Button>
        </div>
      </div>

      {images && images.length > 0 ? (
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-[10px] border border-border"
            >
              <BlobImage
                image={image}
                alt={`問題画像 ${index + 1}`}
                className="max-h-[420px] w-full bg-surface-2 object-contain"
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="space-y-4">
        <Card className="p-5">
          <h2 className="mb-2 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-muted">
            問題
          </h2>
          <Markdown>{problem.title}</Markdown>
        </Card>

        <Card className="border-accent/25 bg-accent-soft/40 p-5">
          <h2 className="mb-2 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-accent-ink">
            模範解答
          </h2>
          {problem.answer ? (
            <StructuredMathContent variant="answer">
              {problem.answer}
            </StructuredMathContent>
          ) : (
            <p className="text-sm text-muted">（模範解答がありません）</p>
          )}
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <h2 className="mb-2 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-muted">
              定石
            </h2>
            <p className="text-sm leading-relaxed">
              {problem.strategy ? (
                <InlineMarkdown>{problem.strategy}</InlineMarkdown>
              ) : (
                '（まだ定石がありません）'
              )}
            </p>
          </Card>
          <Card className="border-warning/25 bg-warning-soft/50 p-5">
            <h2 className="mb-2 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-warning">
              罠
            </h2>
            <p className="text-sm leading-relaxed">
              {problem.trap ? (
                <InlineMarkdown>{problem.trap}</InlineMarkdown>
              ) : (
                '（まだ罠の情報がありません）'
              )}
            </p>
          </Card>
        </div>

        {problem.mnemonic ? (
          <Card className="p-5">
            <h2 className="mb-2 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-muted">
              暗記の一言
            </h2>
            <p className="text-[0.95rem] font-medium leading-relaxed">{problem.mnemonic}</p>
          </Card>
        ) : null}

        <Card className="p-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-muted">
              <Lightbulb size={14} className="text-warning" />
              掴んだ極意・気づきメモ
            </h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSaveInsight}
              disabled={busy !== null}
            >
              {busy === 'insight' ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Save size={13} />
              )}
              メモを保存
            </Button>
          </div>
          {problem.insight ? (
            <div className="mb-3 rounded-[10px] bg-surface-2 px-3.5 py-2.5 text-sm leading-relaxed">
              <Markdown>{problem.insight}</Markdown>
            </div>
          ) : null}
          <Textarea
            value={insightDraft}
            onChange={(event) => setInsightDraft(event.target.value)}
            placeholder="この問題で気づいたこと・自分の言葉でまとめた解法の地図を記録（ノート → 気づき一覧にも表示されます）"
            className="min-h-20 text-sm"
          />
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-muted">
              AI解説
            </h2>
            {explanation ? (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={busy !== null}
                className="inline-flex items-center gap-1 text-xs font-medium text-accent-ink hover:underline disabled:opacity-50"
              >
                {busy === 'explain' ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Sparkles size={13} />
                )}
                再生成
              </button>
            ) : null}
          </div>

          {explanation ? (
            <div>
              <p className="mb-4 text-sm leading-relaxed">
                <InlineMarkdown>{explanation.summary}</InlineMarkdown>
              </p>

              <div className="space-y-5">
                {explanation.sections.map((section, index) => (
                  <section key={`${section.title}-${index}`}>
                    <h3 className="mb-1.5 text-sm font-semibold">{section.title}</h3>
                    <Markdown>{section.body}</Markdown>
                  </section>
                ))}
              </div>

              {explanation.keyPoints.length > 0 ? (
                <div className="mt-5 rounded-[10px] bg-surface-2 p-4">
                  <p className="mb-2 text-xs font-semibold text-muted">押さえるポイント</p>
                  <ul className="space-y-1.5">
                    {explanation.keyPoints.map((point) => (
                      <li key={point} className="flex gap-2 text-sm leading-relaxed">
                        <Check size={14} className="mt-1 shrink-0 text-accent" />
                        <span>
                          <InlineMarkdown>{point}</InlineMarkdown>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {explanation.pitfalls.length > 0 ? (
                <div className="mt-3 rounded-[10px] bg-danger-soft/60 p-4">
                  <p className="mb-2 text-xs font-semibold text-danger">間違えやすいポイント</p>
                  <ul className="space-y-1.5">
                    {explanation.pitfalls.map((pitfall) => (
                      <li key={pitfall} className="flex gap-2 text-sm leading-relaxed">
                        <X size={14} className="mt-1 shrink-0 text-danger" />
                        <span>
                          <InlineMarkdown>{pitfall}</InlineMarkdown>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-[10px] border border-dashed border-border px-4 py-8 text-center">
              <p className="text-sm text-muted">
                この問題の解説はまだありません。
              </p>
              <Button className="mt-4" onClick={handleGenerate} disabled={busy !== null}>
                {busy === 'explain' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                解説を生成する
              </Button>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-muted">
            復習の記録
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            解けたかどうかを記録すると、次回の間隔が自動で決まります。
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => handleReview(false)}
              disabled={busy !== null}
            >
              {busy === 'wrong' ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
              不正解だった
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleReview(true)}
              disabled={busy !== null}
            >
              {busy === 'correct' ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              正解だった
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
