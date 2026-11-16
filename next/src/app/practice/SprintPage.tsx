import { useLiveQuery } from 'dexie-react-hooks';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Flame,
  Loader2,
  Play,
  RotateCcw,
  Timer,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/core/lib/cn';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Input } from '@/core/ui/Field';
import { PageHeader } from '@/core/ui/PageHeader';
import { useToast } from '@/core/ui/Toast';
import {
  getSprintBest,
  listSprintRecords,
  saveSprintRecord,
} from '@/data/repo';
import type {
  SprintAnswerLog,
  SprintPresetId,
  SprintRecord,
} from '@/data/types';
import {
  getSprintPreset,
  SPRINT_DURATIONS,
  SPRINT_PRESETS,
  type SprintQuestion,
} from '@/features/sprint/generators';

type Phase = 'setup' | 'running' | 'result';

function formatClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function SprintPage() {
  const [presetId, setPresetId] = useState<SprintPresetId>('arithmetic');
  const [durationSec, setDurationSec] = useState<number>(SPRINT_DURATIONS[0]);
  const [phase, setPhase] = useState<Phase>('setup');
  const [question, setQuestion] = useState<SprintQuestion | null>(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    answer: string;
  } | null>(null);
  const [answers, setAnswers] = useState<SprintAnswerLog[]>([]);
  const [remainingMs, setRemainingMs] = useState(SPRINT_DURATIONS[0] * 1000);
  const [result, setResult] = useState<SprintRecord | null>(null);
  const [bestBefore, setBestBefore] = useState(0);
  const [isRecord, setIsRecord] = useState(false);

  const startRef = useRef(0);
  const questionStartRef = useRef(0);
  const phaseRef = useRef<Phase>('setup');
  const presetRef = useRef<SprintPresetId>('arithmetic');
  const durationRef = useRef<number>(SPRINT_DURATIONS[0]);
  const answersRef = useRef<SprintAnswerLog[]>([]);
  const advanceRef = useRef<number | null>(null);
  const finishRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  const preset = getSprintPreset(presetId);
  const history = useLiveQuery(() => listSprintRecords(8), []);
  const best = useLiveQuery(
    async () => (await getSprintBest(presetId, durationSec)) ?? null,
    [presetId, durationSec],
  );

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (phase === 'running' && !feedback) {
      inputRef.current?.focus();
    }
  }, [phase, feedback, question]);

  useEffect(
    () => () => {
      if (advanceRef.current !== null) {
        window.clearTimeout(advanceRef.current);
      }
    },
    [],
  );

  const finish = useCallback(async () => {
    if (finishRef.current) return;
    finishRef.current = true;

    if (advanceRef.current !== null) {
      window.clearTimeout(advanceRef.current);
      advanceRef.current = null;
    }

    phaseRef.current = 'result';
    setPhase('result');
    setFeedback(null);

    const activePreset = getSprintPreset(presetRef.current);
    const logs = answersRef.current;
    const duration = durationRef.current;

    let previousBest = 0;
    try {
      previousBest = (await getSprintBest(activePreset.id, duration))?.correct ?? 0;
    } catch {
      previousBest = 0;
    }

    setBestBefore(previousBest);

    if (logs.length === 0) {
      setIsRecord(false);
      setResult({
        id: 'unsaved',
        preset: activePreset.id,
        presetLabel: activePreset.label,
        durationSec: duration,
        total: 0,
        correct: 0,
        answers: [],
        createdAt: new Date().toISOString(),
      });
      return;
    }

    const correct = logs.filter((answer) => answer.correct).length;

    try {
      const saved = await saveSprintRecord({
        preset: activePreset.id,
        presetLabel: activePreset.label,
        durationSec: duration,
        answers: logs,
      });
      setIsRecord(saved.correct > previousBest);
      setResult(saved);
    } catch (error) {
      setIsRecord(correct > previousBest);
      setResult({
        id: 'unsaved',
        preset: activePreset.id,
        presetLabel: activePreset.label,
        durationSec: duration,
        total: logs.length,
        correct,
        answers: logs,
        createdAt: new Date().toISOString(),
      });
      toast(
        error instanceof Error
          ? error.message
          : '記録の保存に失敗しました。',
        'error',
      );
    }
  }, [toast]);

  useEffect(() => {
    if (phase !== 'running') return;
    const tick = () => {
      const left = durationRef.current * 1000 - (Date.now() - startRef.current);
      if (left <= 0) {
        setRemainingMs(0);
        void finish();
        return;
      }
      setRemainingMs(left);
    };
    tick();
    const timer = window.setInterval(tick, 100);
    return () => window.clearInterval(timer);
  }, [phase, finish]);

  const start = useCallback(() => {
    const activePreset = getSprintPreset(presetId);
    presetRef.current = presetId;
    durationRef.current = durationSec;
    answersRef.current = [];
    finishRef.current = false;

    if (advanceRef.current !== null) {
      window.clearTimeout(advanceRef.current);
      advanceRef.current = null;
    }

    startRef.current = Date.now();
    questionStartRef.current = Date.now();

    setAnswers([]);
    setFeedback(null);
    setInput('');
    setResult(null);
    setIsRecord(false);
    setRemainingMs(durationSec * 1000);
    setQuestion(activePreset.generate());
    phaseRef.current = 'running';
    setPhase('running');
  }, [presetId, durationSec]);

  function submit() {
    if (phaseRef.current !== 'running' || !question || feedback) return;
    const given = input.trim();
    if (!given) return;

    const correct = question.validate(given);
    const log: SprintAnswerLog = {
      prompt: question.prompt,
      answer: question.answer,
      given,
      correct,
      durationMs: Date.now() - questionStartRef.current,
    };
    const next = [...answersRef.current, log];
    answersRef.current = next;
    setAnswers(next);
    setFeedback({ correct, answer: question.answer });
    setInput('');

    advanceRef.current = window.setTimeout(() => {
      advanceRef.current = null;
      if (phaseRef.current !== 'running') return;
      setFeedback(null);
      setQuestion(getSprintPreset(presetRef.current).generate());
      questionStartRef.current = Date.now();
    }, 700);
  }

  const correctCount = answers.filter((answer) => answer.correct).length;
  const progress =
    durationSec > 0 ? Math.max(0, Math.min(1, remainingMs / (durationSec * 1000))) : 0;

  if (phase === 'setup') {
    return (
      <div className="mx-auto max-w-3xl">
        <Link
          to="/practice"
          className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
        >
          <ArrowLeft size={14} />
          演習へ戻る
        </Link>

        <PageHeader
          eyebrow="演習"
          title="計算スプリント"
          description="時間内に何問解けるか挑戦します。答えを入れて Enter で次の問題へ。"
        />

        <Card className="p-5">
          <p className="mb-2 text-[0.78rem] font-medium text-muted">種目</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {SPRINT_PRESETS.map((item) => {
              const selected = item.id === presetId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPresetId(item.id)}
                  className={cn(
                    'flex items-start gap-2.5 rounded-[10px] border px-3 py-3 text-left transition-colors',
                    selected
                      ? 'border-accent bg-accent-soft/50'
                      : 'border-border hover:bg-surface-2/60',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                      selected
                        ? 'border-accent bg-accent text-[var(--accent-contrast)]'
                        : 'border-border',
                    )}
                  >
                    {selected ? <Check size={10} /> : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                      {item.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-4">
            <div>
              <p className="mb-1.5 text-[0.78rem] font-medium text-muted">時間</p>
              <div className="flex gap-1 rounded-[10px] border border-border p-1">
                {SPRINT_DURATIONS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDurationSec(value)}
                    className={cn(
                      'h-8 rounded-[7px] px-4 text-sm transition-colors',
                      durationSec === value
                        ? 'bg-accent-soft font-medium text-accent-ink'
                        : 'text-muted hover:text-ink',
                    )}
                  >
                    {value}秒
                  </button>
                ))}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              {best ? (
                <div className="text-right">
                  <p className="text-[0.68rem] font-medium uppercase tracking-[0.08em] text-muted">
                    自己ベスト
                  </p>
                  <p className="text-sm font-semibold tabular-nums">
                    {best.correct}問 / {durationSec}秒
                  </p>
                </div>
              ) : null}
              <Button size="lg" onClick={start}>
                <Play size={17} />
                スタート
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-4 flex items-start gap-3 rounded-[12px] border border-dashed border-border px-5 py-4">
          <Zap size={17} className="mt-0.5 shrink-0 text-muted" />
          <p className="text-sm leading-relaxed text-muted">
            1問ごとに正誤がすぐ返ります。間違えても止まらず、次の問題へ進みましょう。
            分数は <span className="font-medium text-ink">3/4</span>、因数分解は{' '}
            <span className="font-medium text-ink">(x+2)(x+3)</span> のように入力します。
          </p>
        </div>

        <div className="mt-6">
          <h2 className="mb-2 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-muted">
            最近のスプリント
          </h2>
          {!history ? (
            <div className="h-20 animate-pulse rounded-[11px] bg-surface-2" />
          ) : history.length === 0 ? (
            <p className="rounded-[11px] border border-dashed border-border px-4 py-5 text-sm text-muted">
              まだ記録がありません。まずは60秒から。
            </p>
          ) : (
            <ul className="space-y-1.5">
              {history.map((record) => (
                <li
                  key={record.id}
                  className="flex items-center gap-3 rounded-[10px] border border-border bg-surface px-3.5 py-2.5"
                >
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {record.presetLabel}
                  </span>
                  <span className="shrink-0 text-xs text-muted">
                    {record.durationSec}秒
                  </span>
                  <span className="shrink-0 text-sm font-medium tabular-nums">
                    {record.correct}
                    <span className="text-xs font-normal text-muted">
                      /{record.total}
                    </span>
                  </span>
                  <span className="w-20 shrink-0 text-right text-[0.68rem] text-muted">
                    {formatDate(record.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'running' && question) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => void finish()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
          >
            <ArrowLeft size={14} />
            終了
          </button>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className={cn(
                'h-full rounded-full transition-[width] duration-100',
                remainingMs <= 10_000 ? 'bg-danger' : 'bg-accent',
              )}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span
            className={cn(
              'shrink-0 font-mono text-sm font-semibold tabular-nums',
              remainingMs <= 10_000 ? 'text-danger' : 'text-ink',
            )}
          >
            {formatClock(remainingMs)}
          </span>
        </div>

        <div className="mb-3 flex items-center justify-between text-xs text-muted">
          <Badge tone="neutral">{preset.label}</Badge>
          <span className="tabular-nums">
            正解 {correctCount} / {answers.length} 問
          </span>
        </div>

        <Card className="p-6 sm:p-8">
          <p className="text-center text-3xl font-semibold leading-relaxed tracking-wide sm:text-4xl">
            {question.prompt}
          </p>

          <form
            className="mx-auto mt-8 flex max-w-sm flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={Boolean(feedback)}
              inputMode={preset.inputMode}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder={preset.placeholder}
              aria-label="答え"
              className="h-12 flex-1 text-center text-lg"
            />
            <Button type="submit" size="lg" disabled={Boolean(feedback) || !input.trim()}>
              答える
            </Button>
          </form>

          <div className="mx-auto mt-4 h-10 max-w-sm text-center">
            {feedback ? (
              <p
                className={cn(
                  'inline-flex items-center gap-1.5 text-sm font-medium',
                  feedback.correct ? 'text-accent-ink' : 'text-danger',
                )}
              >
                {feedback.correct ? (
                  <>
                    <Check size={15} /> 正解
                  </>
                ) : (
                  <>
                    <X size={15} /> 答えは {feedback.answer}
                  </>
                )}
              </p>
            ) : (
              <p className="text-xs text-muted">Enter で確定</p>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (phase === 'result' && result) {
    const accuracy =
      result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
    const averageMs =
      result.total > 0
        ? result.answers.reduce((sum, answer) => sum + answer.durationMs, 0) /
          result.total
        : 0;
    const wrongAnswers = result.answers.filter((answer) => !answer.correct);

    return (
      <div className="mx-auto max-w-2xl">
        <Card className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
            {isRecord ? <Trophy size={22} /> : <Flame size={22} />}
          </div>
          <h1 className="text-lg font-semibold">おつかれさまでした</h1>
          <p className="mt-1 text-sm text-muted">
            {result.presetLabel} · {result.durationSec}秒
          </p>

          <p className="mt-5 text-4xl font-semibold tabular-nums">
            {result.correct}
            <span className="ml-1 text-sm font-normal text-muted">
              / {result.total} 問正解
            </span>
          </p>

          {isRecord ? (
            <Badge tone="accent" className="mt-3">
              <Trophy size={12} /> 自己ベスト更新
            </Badge>
          ) : bestBefore > 0 ? (
            <p className="mt-2 text-xs text-muted">自己ベスト {bestBefore}問</p>
          ) : null}

          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-5">
            <div>
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.08em] text-muted">
                正答率
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{accuracy}%</p>
            </div>
            <div>
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.08em] text-muted">
                1問あたり
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {(averageMs / 1000).toFixed(1)}
                <span className="text-xs font-normal text-muted">秒</span>
              </p>
            </div>
            <div>
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.08em] text-muted">
                解いた数
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {result.total}
                <span className="text-xs font-normal text-muted">問</span>
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
            <Button variant="secondary" onClick={() => navigate('/practice')}>
              演習へ戻る
            </Button>
            <Button onClick={start}>
              <RotateCcw size={15} />
              もう一度
            </Button>
          </div>
        </Card>

        {wrongAnswers.length > 0 ? (
          <Card className="mt-4 p-5">
            <div className="flex items-center gap-2">
              <Timer size={15} className="text-muted" />
              <h2 className="text-sm font-semibold">間違えた問題</h2>
              <Badge className="ml-auto">{wrongAnswers.length}問</Badge>
            </div>
            <ul className="mt-3 space-y-2">
              {wrongAnswers.map((answer, index) => (
                <li
                  key={`${answer.prompt}-${index}`}
                  className="rounded-[9px] bg-surface-2 px-3 py-2.5"
                >
                  <p className="text-sm font-medium">{answer.prompt}</p>
                  <p className="mt-1 text-xs text-muted">
                    あなたの答え{' '}
                    <span className="font-medium text-danger">{answer.given || '—'}</span>
                    {' · '}
                    正解 <span className="font-medium text-ink">{answer.answer}</span>
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        <div className="mt-4 flex justify-center">
          <Link
            to="/practice"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
          >
            演習メニュー
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <Loader2 size={20} className="animate-spin text-muted" />
        <p className="text-sm text-muted">記録を保存しています…</p>
      </Card>
    </div>
  );
}
