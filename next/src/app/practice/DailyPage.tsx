import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { DrillPlan } from '@shared/ai-core';
import { generateDailyDrill } from '@/ai/client';
import { cn } from '@/core/lib/cn';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Field, Input, Select, Textarea } from '@/core/ui/Field';
import { PageHeader } from '@/core/ui/PageHeader';
import { Skeleton } from '@/core/ui/Spinner';
import { useToast } from '@/core/ui/Toast';
import { getTodayDrill, listProblems, saveDrill } from '@/data/repo';
import { SUBJECTS } from '@/data/subjects';
import type { DrillSession } from '@/data/types';
import { DrillRunner } from '@/features/practice/DrillRunner';

type Phase = 'setup' | 'drill';

export function DailyPage() {
  const problems = useLiveQuery(() => listProblems(), []);
  const todayDrill = useLiveQuery(async () => (await getTodayDrill()) ?? null, []);
  const [phase, setPhase] = useState<Phase>('setup');
  const [session, setSession] = useState<DrillSession | null>(null);
  const [subject, setSubject] = useState('数学');
  const [unit, setUnit] = useState('');
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
        title: plan.title || `${subject}のデイリー演習`,
        subject,
        questions: plan.questions.slice(0, count),
        kind: 'daily',
        demo: Boolean(result.mock),
      });

      setSession(saved);
      setPhase('drill');
      toast(
        result.mock ? 'デモ問題で演習を開始します。' : 'デイリー演習を開始します。',
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

  if (todayDrill === undefined || problems === undefined) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
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
          summaryTitle="デイリー演習、おつかれさまでした"
        />
      </div>
    );
  }

  const finishedToday = todayDrill?.completedAt;

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
        title="デイリー演習"
        description="弱点の単元から、AIが5分で終わる短い問題を作ります。"
      />

      {todayDrill ? (
        <Card className="mb-4 border-accent/25 bg-accent-soft/40 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <CheckCircle2 size={18} className="shrink-0 text-accent" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                今日のデイリー: {todayDrill.title}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {finishedToday
                  ? `完了 · ${todayDrill.results.filter((r) => r === 'correct').length} / ${todayDrill.questions.length} 問正解`
                  : `${todayDrill.results.length} / ${todayDrill.questions.length} 問まで進んでいます`}
              </p>
            </div>
            <Button
              variant={finishedToday ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => resume(todayDrill)}
            >
              {finishedToday ? '結果を見る' : '続きから'}
            </Button>
          </div>
        </Card>
      ) : null}

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
          <Field
            label="単元（任意）"
            hint="空の場合は基礎から標準をバランスよく出題します。"
          >
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
            <p className="mb-1.5 text-[0.78rem] font-medium text-muted">問題数</p>
            <div className="flex gap-1 rounded-[10px] border border-border p-1">
              {[3, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCount(value)}
                  className={cn(
                    'h-8 rounded-[7px] px-4 text-sm transition-colors',
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
            placeholder="例: 場合分けが苦手なので、そこを中心に。"
            className="min-h-20"
          />
        </Field>
      </Card>

      <p className="mt-3 px-1 text-xs leading-relaxed text-muted">
        答えは自分で確認して「正解 / 不正解」を記録します。間違えた問題は、あとから誤答ノートへ登録できます。
      </p>
    </div>
  );
}
