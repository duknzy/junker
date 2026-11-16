import { ArrowLeft, ArrowRight, Check, Eye, Loader2, RotateCcw, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Markdown } from '@/core/ui/Markdown';
import { useToast } from '@/core/ui/Toast';
import { updateDrillResults } from '@/data/repo';
import type { DrillResult, DrillSession } from '@/data/types';

interface DrillRunnerProps {
  session: DrillSession;
  onAbort: () => void;
  onRestart: () => void;
  restartLabel?: string;
  summaryTitle?: string;
}

export function DrillRunner({
  session,
  onAbort,
  onRestart,
  restartLabel = 'もう一度作る',
  summaryTitle = 'おつかれさまでした',
}: DrillRunnerProps) {
  const [results, setResults] = useState<DrillResult[]>(session.results ?? []);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(
    Boolean(session.completedAt) ||
      (session.results?.length ?? 0) >= session.questions.length,
  );
  const { toast } = useToast();
  const navigate = useNavigate();

  const index = results.length;
  const question = session.questions[index];
  const correctCount = results.filter((result) => result === 'correct').length;

  async function handleAnswer(correct: boolean) {
    if (busy) return;
    setBusy(true);
    try {
      const nextResults: DrillResult[] = [
        ...results,
        correct ? 'correct' : 'wrong',
      ];
      const finished = nextResults.length >= session.questions.length;
      await updateDrillResults(
        session.id,
        nextResults,
        finished ? new Date().toISOString() : undefined,
      );
      setResults(nextResults);
      setRevealed(false);
      if (finished) setDone(true);
    } catch (error) {
      toast(
        error instanceof Error ? error.message : '記録に失敗しました。',
        'error',
      );
    } finally {
      setBusy(false);
    }
  }

  if (!done && question) {
    return (
      <>
        <div className="mb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={onAbort}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
          >
            <ArrowLeft size={14} />
            中断
          </button>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300"
              style={{
                width: `${Math.round((index / session.questions.length) * 100)}%`,
              }}
            />
          </div>
          <span className="shrink-0 text-xs tabular-nums text-muted">
            {index + 1} / {session.questions.length}
          </span>
        </div>

        <Card className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{session.subject}</Badge>
            <Badge tone="neutral">{question.unit}</Badge>
            {session.level ? <Badge tone="neutral">{session.level}</Badge> : null}
            {session.demo ? <Badge tone="warning">デモ</Badge> : null}
          </div>

          <div className="mt-5">
            <Markdown>{question.question}</Markdown>
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
                <Markdown>{question.answer}</Markdown>
              </div>

              <div className="mt-3 rounded-[10px] bg-surface-2 p-4">
                <p className="mb-1.5 text-xs font-semibold text-muted">解法のポイント</p>
                <Markdown>{question.explanation}</Markdown>
              </div>

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
      </>
    );
  }

  return (
    <div>
      <Card className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
          <Check size={22} />
        </div>
        <h1 className="text-lg font-semibold">{summaryTitle}</h1>
        <p className="mt-1.5 text-sm text-muted">{session.title}</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
          <Badge tone="neutral">{session.subject}</Badge>
          {session.level ? <Badge tone="neutral">{session.level}</Badge> : null}
          {session.demo ? <Badge tone="warning">デモ</Badge> : null}
        </div>
        <p className="mt-5 text-3xl font-semibold tabular-nums">
          {correctCount}
          <span className="ml-1 text-sm font-normal text-muted">
            / {session.questions.length} 問正解
          </span>
        </p>
        <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
          <Button variant="secondary" onClick={() => navigate('/practice')}>
            演習へ戻る
          </Button>
          <Button onClick={onRestart}>
            <RotateCcw size={15} />
            {restartLabel}
          </Button>
        </div>
      </Card>

      {results.some((result) => result === 'wrong') ? (
        <Card className="mt-4 p-5">
          <h2 className="text-sm font-semibold">間違えた問題</h2>
          <p className="mt-1 text-xs text-muted">
            解説を読み直して、必要なら誤答ノートに登録しておきましょう。
          </p>
          <ul className="mt-4 space-y-4">
            {session.questions.map((item, itemIndex) => {
              if (results[itemIndex] !== 'wrong') return null;
              return (
                <li
                  key={`${item.question}-${itemIndex}`}
                  className="border-t border-border pt-4 first:border-0 first:pt-0"
                >
                  <p className="text-xs font-medium text-danger">問題 {itemIndex + 1}</p>
                  <div className="mt-1.5">
                    <Markdown>{item.question}</Markdown>
                  </div>
                  <div className="mt-2 rounded-[8px] bg-surface-2 p-3">
                    <p className="text-xs font-semibold text-muted">解答</p>
                    <div className="mt-1">
                      <Markdown>{item.answer}</Markdown>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => navigate('/problems/new')}
          >
            誤答ノートに登録
            <ArrowRight size={15} />
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
