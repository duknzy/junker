import { useLiveQuery } from 'dexie-react-hooks';
import {
  ArrowRight,
  BookMarked,
  Calculator,
  CalendarDays,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { PageHeader } from '@/core/ui/PageHeader';
import { Skeleton } from '@/core/ui/Spinner';
import {
  BUNKEI_MATH_CATALOG,
  BUNKEI_MATH_EXERCISES_CATALOG,
} from '@/data/bunkei';
import {
  dueProblems,
  getLatestSprint,
  getStats,
  getTodayDrill,
  listBunkeiProgress,
  listCustomDrills,
} from '@/data/repo';

export function PracticePage() {
  const stats = useLiveQuery(() => getStats(), []);
  const due = useLiveQuery(() => dueProblems(), []);
  const todayDrill = useLiveQuery(async () => (await getTodayDrill()) ?? null, []);
  const latestSprint = useLiveQuery(
    async () => (await getLatestSprint()) ?? null,
    [],
  );
  const latestCustom = useLiveQuery(
    async () => (await listCustomDrills(1))[0] ?? null,
    [],
  );
  const bunkeiProgress = useLiveQuery(() => listBunkeiProgress(), []);
  const navigate = useNavigate();

  const bunkeiStats = (() => {
    const list = bunkeiProgress ?? [];
    const reidaiCleared = list.filter(
      (item) => item.mode === 'reidai' && item.status === 'cleared',
    ).length;
    const exerciseCleared = list.filter(
      (item) => item.mode === 'exercise' && item.status === 'cleared',
    ).length;
    const mistakeCount = list.filter((item) => item.status === 'mistake').length;
    return { reidaiCleared, exerciseCleared, mistakeCount };
  })();

  return (
    <div>
      <PageHeader
        eyebrow="演習"
        title="演習"
        description="今日の復習から、計算スプリントやカスタム演習まで。まずは復習を片づけましょう。"
      />

      {!stats || !due ? (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="space-y-3">
          <Card className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-accent-soft text-accent-ink">
                  <RotateCcw size={18} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold">今日の復習</h2>
                    <Badge tone={stats.due > 0 ? 'accent' : 'neutral'}>
                      {stats.due}問
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    正解すると次回の間隔が伸び、間違えると明日また出題されます。
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/practice/review')}
                disabled={stats.due === 0}
                className="shrink-0"
              >
                始める
                <ArrowRight size={16} />
              </Button>
            </div>

            {due.length > 0 ? (
              <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
                {due.slice(0, 4).map((problem) => (
                  <li
                    key={problem.id}
                    className="flex items-center gap-2 text-xs text-muted"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span className="truncate">{problem.shortTitle}</span>
                    <span className="ml-auto shrink-0">{problem.subject}</span>
                  </li>
                ))}
                {due.length > 4 ? (
                  <li className="pl-3 text-xs text-muted">ほか {due.length - 4} 問</li>
                ) : null}
              </ul>
            ) : null}
          </Card>

          <Card className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-accent-soft text-accent-ink">
                  <BookMarked size={18} />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold">
                      『文系の数学』重要事項 完全習得編
                    </h2>
                    <Badge tone="accent">
                      例題 {bunkeiStats.reidaiCleared}/{BUNKEI_MATH_CATALOG.length}
                    </Badge>
                    <Badge tone="neutral">
                      演習 {bunkeiStats.exerciseCleared}/{BUNKEI_MATH_EXERCISES_CATALOG.length}
                    </Badge>
                    {bunkeiStats.mistakeCount > 0 ? (
                      <Badge tone="danger">要復習 {bunkeiStats.mistakeCount}</Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    例題158題・演習問題115題（図版つき）。例題と対応する演習問題を行き来しながら、誤答ノートや気づきメモへ直結できます。
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => navigate('/practice/bunkei')}
                className="shrink-0"
              >
                開く
                <ArrowRight size={16} />
              </Button>
            </div>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="flex flex-col justify-between p-5">
              <div>
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-muted" />
                  <h2 className="text-sm font-medium">デイリー演習</h2>
                  {todayDrill?.completedAt ? (
                    <Badge tone="accent" className="ml-auto">
                      完了
                    </Badge>
                  ) : todayDrill ? (
                    <Badge tone="warning" className="ml-auto">
                      途中
                    </Badge>
                  ) : (
                    <Badge className="ml-auto">AI出題</Badge>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {todayDrill
                    ? `${todayDrill.title}（${todayDrill.results.length}/${todayDrill.questions.length}問）`
                    : '弱点の単元から、5分で終わる短い問題を作ります。'}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 self-start"
                onClick={() => navigate('/practice/daily')}
              >
                {todayDrill ? '開く' : '始める'}
                <ArrowRight size={14} />
              </Button>
            </Card>
            <Card className="flex flex-col justify-between p-5">
              <div>
                <div className="flex items-center gap-2">
                  <Calculator size={16} className="text-muted" />
                  <h2 className="text-sm font-medium">計算スプリント</h2>
                  {latestSprint ? (
                    <Badge className="ml-auto">{latestSprint.presetLabel}</Badge>
                  ) : (
                    <Badge className="ml-auto">60秒</Badge>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {latestSprint
                    ? `前回は ${latestSprint.correct}/${latestSprint.total} 問正解（${latestSprint.durationSec}秒）。`
                    : '四則・分数・平方根・因数分解を、時間内に何問解けるか。'}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 self-start"
                onClick={() => navigate('/practice/sprint')}
              >
                {latestSprint ? 'もう一度' : '始める'}
                <ArrowRight size={14} />
              </Button>
            </Card>
            <Card className="flex flex-col justify-between p-5">
              <div>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-muted" />
                  <h2 className="text-sm font-medium">カスタム演習</h2>
                  {latestCustom ? (
                    <Badge className="ml-auto">{latestCustom.level ?? 'AI出題'}</Badge>
                  ) : (
                    <Badge className="ml-auto">AI出題</Badge>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {latestCustom
                    ? `${latestCustom.title}（${latestCustom.results.length}/${latestCustom.questions.length}問）`
                    : '単元・難易度・問題数を決めて、AIに問題を作らせます。'}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 self-start"
                onClick={() => navigate('/practice/custom')}
              >
                {latestCustom ? '開く' : '始める'}
                <ArrowRight size={14} />
              </Button>
            </Card>
            <Card className="flex flex-col justify-between p-5">
              <div>
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.1em] text-muted">
                  学習の記録
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  今週は {stats.reviewedThisWeek} 問復習しました。連続学習は {stats.streak} 日です。
                </p>
              </div>
              <p className="mt-4 text-2xl font-semibold tabular-nums">
                {stats.reviewedToday}
                <span className="ml-1 text-xs font-normal text-muted">問 / 今日</span>
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
