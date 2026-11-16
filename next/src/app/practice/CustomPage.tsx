import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { DrillPlan } from '@shared/ai-core';
import { generateDailyDrill } from '@/ai/client';
import { cn } from '@/core/lib/cn';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Field, Input, Select, Textarea } from '@/core/ui/Field';
import { PageHeader } from '@/core/ui/PageHeader';
import { useToast } from '@/core/ui/Toast';
import { listCustomDrills, listProblems, saveDrill } from '@/data/repo';
import { SUBJECTS } from '@/data/subjects';
import type { DrillLevel, DrillSession } from '@/data/types';
import { DrillRunner } from '@/features/practice/DrillRunner';

type Phase = 'setup' | 'drill';

const LEVELS: DrillLevel[] = ['基礎', '標準', '応用'];
const COUNTS = [3, 5, 10];

function formatDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function CustomPage() {
  const problems = useLiveQuery(() => listProblems(), []);
  const history = useLiveQuery(() => listCustomDrills(6), []);
  const [phase, setPhase] = useState<Phase>('setup');
  const [session, setSession] = useState<DrillSession | null>(null);
  const [subject, setSubject] = useState('数学');
  const [unit, setUnit] = useState('');
  const [level, setLevel] = useState<DrillLevel>('標準');
  const [count, setCount] = useState(5);
  const [note, setNote] = useState('');
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const unitOptions = useMemo(() => {
    if (!problems) return [];
    const units = Array.from(new Set(problems.map((problem) => problem.unit))).filter(
      (value) => value && value !== '未分類',
    );
    return units.slice(0, 6);
  }, [problems]);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const result = await generateDailyDrill({
        subject,
        unit: unit.trim() || undefined,
        count,
        level,
        note: note.trim() || undefined,
      });

      if (!result.ok || !result.data) {
        toast(result.error ?? '演習の作成に失敗しました。', 'error');
        return;
      }

      const plan = result.data as DrillPlan;
      if (!plan.questions?.length) {
        toast('問題が生成されませんでした。もう一度お試しください。', 'error');
        return;
      }

      const saved = await saveDrill({
        title: plan.title || `${subject}のカスタム演習`,
        subject,
        questions: plan.questions.slice(0, count),
        kind: 'custom',
        level,
        demo: Boolean(result.mock),
      });

      setSession(saved);
      setPhase('drill');
      toast(
        result.mock ? 'デモ問題で演習を開始します。' : 'カスタム演習を開始します。',
        result.mock ? 'info' : 'success',
      );
    } catch (error) {
      toast(error instanceof Error ? error.message : '演習の作成に失敗しました。', 'error');
    } finally {
      setGenerating(false);
    }
  }

  function resume(target: DrillSession) {
    setSession(target);
    setPhase('drill');
  }

  if (phase === 'drill' && session) {
    return (
      <div className="mx-auto max-w-3xl">
        <DrillRunner
          key={session.id}
          session={session}
          onAbort={() => setPhase('setup')}
          onRestart={() => {
            setSession(null);
            setPhase('setup');
          }}
          summaryTitle="カスタム演習、おつかれさまでした"
        />
      </div>
    );
  }

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
        title="カスタム演習"
        description="単元・難易度・問題数を決めて、AIに問題を作らせます。"
      />

      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
          <Field label="教科">
            <Select
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            >
              {SUBJECTS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="単元（任意）" hint="空の場合は教科全体から出題します。">
            <Input
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              placeholder="例: 二次関数、力学"
            />
          </Field>
        </div>

        {unitOptions.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {unitOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setUnit(option)}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-xs transition-colors',
                  unit === option
                    ? 'border-accent bg-accent-soft text-accent-ink'
                    : 'border-border text-muted hover:bg-surface-2',
                )}
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div>
            <p className="mb-1.5 text-[0.78rem] font-medium text-muted">難易度</p>
            <div className="flex gap-1 rounded-[10px] border border-border p-1">
              {LEVELS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLevel(value)}
                  className={cn(
                    'h-8 rounded-[7px] px-4 text-sm transition-colors',
                    level === value
                      ? 'bg-accent-soft font-medium text-accent-ink'
                      : 'text-muted hover:text-ink',
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[0.78rem] font-medium text-muted">問題数</p>
            <div className="flex gap-1 rounded-[10px] border border-border p-1">
              {COUNTS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCount(value)}
                  className={cn(
                    'h-8 rounded-[7px] px-3.5 text-sm transition-colors',
                    count === value
                      ? 'bg-accent-soft font-medium text-accent-ink'
                      : 'text-muted hover:text-ink',
                  )}
                >
                  {value}問
                </button>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            className="sm:ml-auto"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Sparkles size={17} />
            )}
            {generating ? '作成中…' : 'AIで出題する'}
          </Button>
        </div>

        <Field label="メモ（任意）" className="mt-4">
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="例: 共通テスト形式で、誘導なしの問題を中心に。"
            className="min-h-20"
          />
        </Field>
      </Card>

      <p className="mt-3 px-1 text-xs leading-relaxed text-muted">
        答えは自分で確認して「正解 / 不正解」を記録します。作った演習は履歴に残り、あとから続きを開けます。
      </p>

      <div className="mt-6">
        <h2 className="mb-2 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-muted">
          カスタム演習の履歴
        </h2>
        {!history ? (
          <div className="h-20 animate-pulse rounded-[11px] bg-surface-2" />
        ) : history.length === 0 ? (
          <p className="rounded-[11px] border border-dashed border-border px-4 py-5 text-sm text-muted">
            まだ履歴がありません。条件を決めて最初の演習を作りましょう。
          </p>
        ) : (
          <ul className="space-y-1.5">
            {history.map((record) => {
              const answered = record.results.length;
              const correct = record.results.filter((r) => r === 'correct').length;
              const complete = Boolean(record.completedAt);
              return (
                <li key={record.id}>
                  <button
                    type="button"
                    onClick={() => resume(record)}
                    className="flex w-full items-center gap-3 rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-left transition-colors hover:bg-surface-2/60"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{record.title}</span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                        <span>{record.subject}</span>
                        {record.level ? (
                          <>
                            <span aria-hidden>·</span>
                            <span>{record.level}</span>
                          </>
                        ) : null}
                        <span aria-hidden>·</span>
                        <span>{formatDate(record.createdAt)}</span>
                      </span>
                    </span>
                    {complete ? (
                      <Badge tone="accent">
                        {correct}/{record.questions.length}
                      </Badge>
                    ) : (
                      <Badge tone="warning">
                        {answered}/{record.questions.length}
                      </Badge>
                    )}
                    <ArrowRight size={14} className="shrink-0 text-muted" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
