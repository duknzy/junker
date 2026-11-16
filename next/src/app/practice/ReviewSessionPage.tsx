import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  Loader2,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { EmptyState } from '@/core/ui/EmptyState';
import { InlineMarkdown, Markdown } from '@/core/ui/Markdown';
import { Skeleton } from '@/core/ui/Spinner';
import { useToast } from '@/core/ui/Toast';
import { dueProblems, recordReview } from '@/data/repo';
import type { Problem } from '@/data/types';

export function ReviewSessionPage() {
  const [queue, setQueue] = useState<Problem[] | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const startedAt = useRef(Date.now());
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    dueProblems().then((problems) => {
      if (alive) setQueue(problems);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!queue) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <EmptyState
          icon={CheckCircle2}
          title="今日の復習は完了しています"
          description="新しく問題を登録するか、明日また戻ってきてください。"
          action={
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => navigate('/practice')}>
                演習へ戻る
              </Button>
              <Button onClick={() => navigate('/problems/new')}>問題を登録</Button>
            </div>
          }
        />
      </div>
    );
  }

  if (index >= queue.length) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
            <Check size={22} />
          </div>
          <h1 className="text-lg font-semibold">おつかれさまでした</h1>
          <p className="mt-1.5 text-sm text-muted">
            {queue.length} 問の復習が終わりました。
          </p>
          <p className="mt-5 text-3xl font-semibold tabular-nums">
            {correctCount}
            <span className="ml-1 text-sm font-normal text-muted">
              / {queue.length} 問正解
            </span>
          </p>
          <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
            <Button variant="secondary" onClick={() => navigate('/practice')}>
              演習へ戻る
            </Button>
            <Button onClick={() => navigate('/')}>今日へ戻る</Button>
          </div>
        </Card>
      </div>
    );
  }

  const problem = queue[index];
  const progress = Math.round((index / queue.length) * 100);

  async function handleAnswer(correct: boolean) {
    if (busy) return;
    setBusy(true);
    try {
      await recordReview(problem.id, correct, 'review', Date.now() - startedAt.current);
      if (correct) setCorrectCount((count) => count + 1);
      setRevealed(false);
      setIndex((current) => current + 1);
    } catch (error) {
      toast(error instanceof Error ? error.message : '記録に失敗しました。', 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center gap-3">
        <Link
          to="/practice"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
        >
          <ArrowLeft size={14} />
          中断
        </Link>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="shrink-0 text-xs tabular-nums text-muted">
          {index + 1} / {queue.length}
        </span>
      </div>

      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral">{problem.subject}</Badge>
          <Badge tone="neutral">{problem.unit}</Badge>
          {problem.errorCount > 0 ? (
            <Badge tone="danger">誤答 {problem.errorCount}回</Badge>
          ) : null}
        </div>

        <h1 className="mt-3 text-base font-semibold leading-snug">{problem.shortTitle}</h1>

        <div className="mt-5">
          <Markdown>{problem.title}</Markdown>
        </div>

        {!revealed ? (
          <Button
            size="lg"
            variant="secondary"
            className="mt-7 w-full"
            onClick={() => setRevealed(true)}
          >
            <Eye size={17} />
            答えを見る
          </Button>
        ) : (
          <div className="mt-6">
            <div className="rounded-[10px] border border-accent/25 bg-accent-soft/40 p-4">
              <p className="mb-2 text-xs font-semibold text-accent-ink">模範解答</p>
              <Markdown>{problem.answer || '（模範解答がありません）'}</Markdown>
            </div>

            {problem.trap ? (
              <div className="mt-3 rounded-[10px] border border-warning/25 bg-warning-soft/50 p-4">
                <p className="mb-1.5 text-xs font-semibold text-warning">罠</p>
                <p className="text-sm leading-relaxed">
                  <InlineMarkdown>{problem.trap}</InlineMarkdown>
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => handleAnswer(false)}
                disabled={busy}
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                不正解
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleAnswer(true)}
                disabled={busy}
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                正解
              </Button>
            </div>
          </div>
        )}
      </Card>

      <p className="mt-4 flex items-center justify-center gap-1 text-xs text-muted">
        正解すると間隔が伸びます
        <ArrowRight size={12} />
        間違えると明日また出題
      </p>
    </div>
  );
}
