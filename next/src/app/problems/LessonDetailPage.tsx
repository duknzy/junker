import { useLiveQuery } from 'dexie-react-hooks';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  GraduationCap,
  Loader2,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { LessonCheck } from '@shared/ai-core';
import { cn } from '@/core/lib/cn';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { EmptyState } from '@/core/ui/EmptyState';
import { InlineMarkdown, Markdown } from '@/core/ui/Markdown';
import { Skeleton } from '@/core/ui/Spinner';
import { useToast } from '@/core/ui/Toast';
import {
  deleteLesson,
  getLesson,
  setLessonLastPart,
  toggleLessonPart,
} from '@/data/repo';

export function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const lesson = useLiveQuery(async () => {
    if (!id) return null;
    return (await getLesson(id)) ?? null;
  }, [id]);

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!lesson || currentId) return;
    setCurrentId(lesson.lastPartId ?? lesson.parts[0]?.id ?? null);
  }, [lesson, currentId]);

  if (lesson === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (lesson === null) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="授業が見つかりません"
        description="削除されたか、URLが正しくない可能性があります。"
        action={
          <Button onClick={() => navigate('/problems?tab=lessons')}>
            授業一覧へ戻る
          </Button>
        }
      />
    );
  }

  const index = Math.max(
    0,
    lesson.parts.findIndex((part) => part.id === currentId),
  );
  const part = lesson.parts[index];
  const done = lesson.completedPartIds.length;
  const total = lesson.parts.length;
  const allDone = total > 0 && done === total;
  const partDone = part ? lesson.completedPartIds.includes(part.id) : false;

  function selectPart(partId: string) {
    setCurrentId(partId);
    if (id) void setLessonLastPart(id, partId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleTogglePart() {
    if (!id || !part) return;
    setBusy(true);
    try {
      const completed = await toggleLessonPart(id, part.id);
      const isDone = completed.includes(part.id);
      toast(
        isDone ? 'パートを完了にしました。' : '完了を取り消しました。',
        isDone ? 'success' : 'info',
      );
    } catch (error) {
      toast(error instanceof Error ? error.message : '更新に失敗しました。', 'error');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!id) return;
    if (!window.confirm('この授業を削除しますか？')) return;
    setBusy(true);
    try {
      await deleteLesson(id);
      toast('授業を削除しました。', 'success');
      navigate('/problems?tab=lessons');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Link
        to="/problems?tab=lessons"
        className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
      >
        <ArrowLeft size={14} />
        授業一覧へ戻る
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{lesson.subject}</Badge>
            <Badge tone="neutral">{lesson.unit}</Badge>
            {lesson.demo ? <Badge tone="warning">デモ</Badge> : null}
            {allDone ? <Badge tone="accent">完了</Badge> : null}
          </div>
          <h1 className="mt-2 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">
            {lesson.title}
          </h1>
          <p className="mt-1.5 text-xs text-muted">
            {done} / {total} パート完了
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={busy}
          aria-label="授業を削除"
        >
          <Trash2 size={14} />
        </Button>
      </div>

      {allDone ? (
        <Card className="mb-5 border-accent/25 bg-accent-soft/40 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" />
            <div>
              <p className="text-sm font-medium">この授業は完了しました</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                確認クイズで間違えたところは、そのまま問題として登録しておくと復習に回せます。
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="ml-auto shrink-0"
              onClick={() => navigate('/problems/new')}
            >
              問題を登録
            </Button>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[15rem_1fr]">
        <nav className="lg:sticky lg:top-8 lg:self-start">
          <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-muted">
            パート
          </p>
          <ol className="space-y-1">
            {lesson.parts.map((item, itemIndex) => {
              const isDone = lesson.completedPartIds.includes(item.id);
              const isCurrent = item.id === part?.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => selectPart(item.id)}
                    className={cn(
                      'flex w-full items-start gap-2 rounded-[9px] px-2.5 py-2 text-left text-sm transition-colors',
                      isCurrent
                        ? 'bg-accent-soft font-medium text-accent-ink'
                        : 'text-muted hover:bg-surface-2 hover:text-ink',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.6rem]',
                        isDone
                          ? 'bg-accent text-[var(--accent-contrast)]'
                          : 'border border-border',
                      )}
                    >
                      {isDone ? <Check size={10} /> : itemIndex + 1}
                    </span>
                    <span className="min-w-0 leading-snug">{item.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-4 px-2.5">
            <p className="text-[0.68rem] leading-relaxed text-muted">{lesson.overview}</p>
          </div>
        </nav>

        {part ? (
          <div className="min-w-0">
            <Card className="p-6">
              <p className="text-xs font-medium text-muted">
                パート {index + 1} / {total}
              </p>
              <h2 className="mt-1 text-lg font-semibold leading-snug">{part.title}</h2>

              <div className="mt-4">
                <Markdown>{part.body}</Markdown>
              </div>

              {part.keyPoints.length > 0 ? (
                <div className="mt-5 rounded-[10px] bg-surface-2 p-4">
                  <p className="mb-2 text-xs font-semibold text-muted">押さえるポイント</p>
                  <ul className="space-y-1.5">
                    {part.keyPoints.map((point) => (
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

              <PartCheck key={part.id} check={part.check} />

              <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center">
                <Button
                  variant="secondary"
                  onClick={() => {
                    const prev = lesson.parts[index - 1];
                    if (prev) selectPart(prev.id);
                  }}
                  disabled={index === 0}
                >
                  <ChevronLeft size={15} />
                  前のパート
                </Button>

                <Button
                  variant={partDone ? 'subtle' : 'primary'}
                  className="sm:ml-auto"
                  onClick={handleTogglePart}
                  disabled={busy}
                >
                  {busy ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : partDone ? (
                    <X size={15} />
                  ) : (
                    <Check size={15} />
                  )}
                  {partDone ? '完了を取り消す' : 'このパートを完了'}
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => {
                    const next = lesson.parts[index + 1];
                    if (next) selectPart(next.id);
                  }}
                  disabled={index >= total - 1}
                >
                  次のパート
                  <ArrowRight size={15} />
                </Button>
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PartCheck({ check }: { check: LessonCheck }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const correct = selected === check.answerIndex;

  return (
    <div className="mt-5 rounded-[10px] border border-border p-4">
      <p className="text-xs font-semibold text-muted">理解チェック</p>
      <p className="mt-2 text-sm font-medium leading-relaxed">
        <InlineMarkdown>{check.question}</InlineMarkdown>
      </p>

      <div className="mt-3 space-y-2">
        {check.choices.map((choice, choiceIndex) => {
          const isCorrect = choiceIndex === check.answerIndex;
          const isSelected = selected === choiceIndex;
          const showCorrect = answered && isCorrect;
          const showWrong = answered && isSelected && !isCorrect;

          return (
            <button
              key={`${choice}-${choiceIndex}`}
              type="button"
              onClick={() => {
                if (!answered) setSelected(choiceIndex);
              }}
              disabled={answered}
              className={cn(
                'flex w-full items-start gap-2.5 rounded-[9px] border px-3 py-2.5 text-left text-sm transition-colors',
                showCorrect
                  ? 'border-accent/50 bg-accent-soft text-accent-ink'
                  : showWrong
                    ? 'border-danger/40 bg-danger-soft text-danger'
                    : answered
                      ? 'border-border bg-surface text-muted'
                      : 'border-border bg-surface hover:bg-surface-2',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.65rem] font-semibold',
                  showCorrect
                    ? 'border-accent bg-accent text-[var(--accent-contrast)]'
                    : showWrong
                      ? 'border-danger bg-danger text-white'
                      : 'border-border text-muted',
                )}
              >
                {showCorrect ? (
                  <Check size={11} />
                ) : showWrong ? (
                  <X size={11} />
                ) : (
                  String.fromCharCode(65 + choiceIndex)
                )}
              </span>
              <span className="min-w-0 leading-relaxed">
                <InlineMarkdown>{choice}</InlineMarkdown>
              </span>
            </button>
          );
        })}
      </div>

      {answered ? (
        <div className="mt-3 rounded-[8px] bg-surface-2 p-3">
          <p className="text-xs font-semibold text-muted">
            {correct ? '正解' : 'もう一度確認'}
          </p>
          <p className="mt-1 text-sm leading-relaxed">
            <InlineMarkdown>{check.explanation}</InlineMarkdown>
          </p>
        </div>
      ) : null}
    </div>
  );
}
