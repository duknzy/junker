import { ArrowLeft, Check, GraduationCap, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { LessonPlan } from '@shared/ai-core';
import { generateLessonPlan } from '@/ai/client';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Field, Input, Select, Textarea } from '@/core/ui/Field';
import { PageHeader } from '@/core/ui/PageHeader';
import { useToast } from '@/core/ui/Toast';
import { createLesson } from '@/data/repo';
import { SUBJECTS } from '@/data/subjects';

export function NewLessonPage() {
  const [subject, setSubject] = useState('数学');
  const [unit, setUnit] = useState('');
  const [note, setNote] = useState('');
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [demo, setDemo] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  async function handleGenerate() {
    if (!unit.trim()) {
      toast('単元・テーマを入力してください。', 'error');
      return;
    }

    setGenerating(true);
    setPlan(null);
    try {
      const result = await generateLessonPlan({
        subject,
        unit: unit.trim(),
        note: note.trim() || undefined,
      });

      if (!result.ok || !result.data) {
        toast(result.error ?? '授業の作成に失敗しました。', 'error');
        return;
      }

      setPlan(result.data);
      setDemo(Boolean(result.mock));
      toast(
        result.mock
          ? 'デモモードで授業を作成しました。'
          : '授業プランを作成しました。内容を確認してください。',
        result.mock ? 'info' : 'success',
      );
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!plan) return;
    setSaving(true);
    try {
      const lesson = await createLesson({
        title: plan.title,
        subject: plan.subject || subject,
        unit: plan.unit || unit,
        overview: plan.overview,
        parts: plan.parts,
        demo,
      });
      toast('授業を保存しました。', 'success');
      navigate(`/problems/lessons/${lesson.id}`);
    } catch (error) {
      toast(error instanceof Error ? error.message : '保存に失敗しました。', 'error');
    } finally {
      setSaving(false);
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

      <PageHeader
        eyebrow="授業"
        title="新しい授業"
        description="単元名を入れると、AIが講義と確認クイズを3〜4パートで組み立てます。"
      />

      <div className="space-y-4">
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
            <Field label="単元・テーマ">
              <Input
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                placeholder="例: 二次関数の最大・最小"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') void handleGenerate();
                }}
              />
            </Field>
          </div>

          <Field
            label="つまずいているところ（任意）"
            hint="空でも作成できます。書くと、その点を重点的に扱う授業になります。"
            className="mt-4"
          >
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="例: 平方完成はできるが、定義域があると最大・最小の判断で迷う。"
              className="min-h-24"
            />
          </Field>

          <div className="mt-4 flex justify-end">
            <Button size="lg" onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Sparkles size={17} />
              )}
              {generating ? '作成中…' : plan ? '作り直す' : 'AIで授業を作る'}
            </Button>
          </div>
        </Card>

        {plan ? (
          <Card className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">授業プラン</Badge>
              {demo ? <Badge tone="warning">デモ</Badge> : null}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-accent-ink hover:underline disabled:opacity-50"
              >
                <RefreshCw size={12} />
                作り直す
              </button>
            </div>

            <h2 className="mt-3 text-lg font-semibold leading-snug">{plan.title}</h2>
            <p className="mt-1 text-xs text-muted">
              {plan.subject} · {plan.unit} · {plan.parts.length}パート
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{plan.overview}</p>

            <ol className="mt-4 space-y-2 border-t border-border pt-4">
              {plan.parts.map((part, index) => (
                <li key={`${part.title}-${index}`} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[0.65rem] font-semibold text-accent-ink">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{part.title}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      確認クイズ {part.check.choices.length}択 · ポイント{' '}
                      {part.keyPoints.length}個
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setPlan(null)} disabled={saving}>
                破棄
              </Button>
              <Button size="lg" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {saving ? '保存中…' : 'この授業を始める'}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="flex items-start gap-3 rounded-[12px] border border-dashed border-border px-5 py-6">
            <GraduationCap size={18} className="mt-0.5 shrink-0 text-muted" />
            <p className="text-sm leading-relaxed text-muted">
              授業は「読む → ポイントを確認 → 4択で理解チェック」の繰り返しです。完了したパートは自動で記録されます。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
