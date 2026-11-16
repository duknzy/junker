import { useRef, useState, type DragEvent } from 'react';
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { ProblemAnalysis } from '@shared/ai-core';
import { analyzeProblem, generateExplanation } from '@/ai/client';
import { cn } from '@/core/lib/cn';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Field, Input, Select, Textarea } from '@/core/ui/Field';
import { PageHeader } from '@/core/ui/PageHeader';
import { Spinner } from '@/core/ui/Spinner';
import { useToast } from '@/core/ui/Toast';
import { createProblem, updateProblem } from '@/data/repo';
import { SUBJECTS } from '@/data/subjects';
import { compressImage, type CompressedImage } from '@/lib/image';

export function NewProblemPage() {
  const [text, setText] = useState('');
  const [subject, setSubject] = useState('数学');
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [draft, setDraft] = useState<ProblemAnalysis | null>(null);
  const [demo, setDemo] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [autoExplain, setAutoExplain] = useState(true);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const remaining = 6 - images.length;
    if (remaining <= 0) {
      toast('画像は最大6枚までです。', 'info');
      return;
    }

    const files = Array.from(fileList).slice(0, remaining);
    const next: CompressedImage[] = [];
    for (const file of files) {
      try {
        next.push(await compressImage(file));
      } catch (error) {
        toast(error instanceof Error ? error.message : '画像の読み込みに失敗しました。', 'error');
      }
    }
    setImages((prev) => [...prev, ...next].slice(0, 6));
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    void handleFiles(event.dataTransfer.files);
  }

  async function handleAnalyze() {
    if (!text.trim() && images.length === 0) {
      toast('問題文または写真のどちらかを入力してください。', 'error');
      return;
    }

    setAnalyzing(true);
    try {
      const result = await analyzeProblem({
        text,
        subject,
        images: images.map((image) => ({
          mimeType: image.mimeType,
          data: image.dataUrl.split(',')[1] ?? '',
        })),
      });

      if (!result.ok || !result.data) {
        toast(result.error ?? 'AI解析に失敗しました。', 'error');
        return;
      }

      const data = result.data;
      setDraft({
        subject: data.subject || subject,
        unit: data.unit || '未分類',
        shortTitle: data.shortTitle || data.title.slice(0, 24) || '登録した問題',
        title: data.title || text,
        answer: data.answer || '',
        trap: data.trap || '',
        strategy: data.strategy || '',
        mnemonic: data.mnemonic || '',
      });
      setDemo(Boolean(result.mock));
      toast(
        result.mock
          ? 'デモモードで解析しました。内容は自由に編集できます。'
          : 'AIが問題を解析しました。内容を確認してください。',
        result.mock ? 'info' : 'success',
      );
    } finally {
      setAnalyzing(false);
    }
  }

  function updateDraft<K extends keyof ProblemAnalysis>(key: K, value: string) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave() {
    if (!draft) return;
    if (!draft.title.trim()) {
      toast('問題文を入力してください。', 'error');
      return;
    }

    setSaving(true);
    try {
      const problem = await createProblem({
        ...draft,
        images: images.map((image) => ({
          blob: image.blob,
          mimeType: image.mimeType,
          width: image.width,
          height: image.height,
        })),
        source: images.length > 0 ? 'photo' : 'manual',
        demo,
      });

      if (autoExplain) {
        setStatus('AIが解説を作成しています…');
        const explanation = await generateExplanation(draft);
        if (explanation.ok && explanation.data) {
          await updateProblem(problem.id, {
            explanation: explanation.data,
            demo: demo || Boolean(explanation.mock),
          });
        } else {
          toast(
            '問題は保存しましたが、解説の生成に失敗しました。詳細画面から再試行できます。',
            'error',
          );
        }
      }

      toast('問題を保存しました。', 'success');
      navigate(`/problems/${problem.id}`);
    } catch (error) {
      toast(error instanceof Error ? error.message : '保存に失敗しました。', 'error');
    } finally {
      setSaving(false);
      setStatus('');
    }
  }

  return (
    <div>
      <Link
        to="/problems"
        className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
      >
        <ArrowLeft size={14} />
        問題一覧へ戻る
      </Link>

      <PageHeader
        eyebrow="問題"
        title="問題を登録"
        description="写真を撮るか、問題文を貼り付けてください。AIが問題を整理し、解説の下書きを作ります。"
      />

      {!draft ? (
        <div className="space-y-4">
          <Card className="p-5">
            <Field label="問題文（任意）">
              <Textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="例: 関数 y = x^2 - 4x + 1 の 0 ≦ x ≦ 3 における最大値と最小値を求めよ。"
                className="min-h-36"
              />
            </Field>

            <div className="mt-4">
              <p className="mb-1.5 text-[0.78rem] font-medium text-muted">
                写真（任意・最大6枚）
              </p>
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={cn(
                  'rounded-[11px] border border-dashed px-4 py-7 text-center transition-colors',
                  dragging
                    ? 'border-accent bg-accent-soft'
                    : 'border-border bg-surface-2/40',
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    void handleFiles(event.target.files);
                    event.target.value = '';
                  }}
                />
                <ImagePlus size={22} className="mx-auto text-muted" strokeWidth={1.6} />
                <p className="mt-2 text-sm text-muted">
                  ここに画像をドロップ、または
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mx-1 font-medium text-accent-ink hover:underline"
                  >
                    ファイルを選択
                  </button>
                </p>
                <p className="mt-1 text-xs text-muted/80">
                  端末内で縮小して保存します。クラウドには送信されません。
                </p>
              </div>

              {images.length > 0 ? (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {images.map((image, index) => (
                    <div
                      key={`${image.dataUrl.slice(-24)}-${index}`}
                      className="group relative overflow-hidden rounded-[9px] border border-border"
                    >
                      <img
                        src={image.dataUrl}
                        alt={`問題画像 ${index + 1}`}
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) => prev.filter((_, i) => i !== index))
                        }
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                        aria-label="画像を削除"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
              <Field label="教科" className="sm:w-44">
                <Select value={subject} onChange={(event) => setSubject(event.target.value)}>
                  {SUBJECTS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </Field>
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={analyzing}
                className="sm:ml-auto"
              >
                {analyzing ? <Loader2 size={17} className="animate-spin" /> : <Sparkles size={17} />}
                {analyzing ? '解析中…' : 'AIで解析する'}
              </Button>
            </div>
          </Card>

          <p className="px-1 text-xs leading-relaxed text-muted">
            AIの解析結果は下書きです。保存前に必ず内容を確認してください。
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">解析結果</Badge>
            {demo ? <Badge tone="warning">デモ</Badge> : null}
            <button
              type="button"
              onClick={() => {
                setDraft(null);
                setDemo(false);
              }}
              className="ml-auto text-xs font-medium text-muted hover:text-ink"
            >
              別の問題を解析する
            </button>
          </div>

          <Card className="p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="短いタイトル">
                <Input
                  value={draft.shortTitle}
                  onChange={(event) => updateDraft('shortTitle', event.target.value)}
                />
              </Field>
              <Field label="単元・分野">
                <Input
                  value={draft.unit}
                  onChange={(event) => updateDraft('unit', event.target.value)}
                />
              </Field>
              <Field label="教科">
                <Select
                  value={draft.subject}
                  onChange={(event) => updateDraft('subject', event.target.value)}
                >
                  {SUBJECTS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="問題文" className="mt-4">
              <Textarea
                value={draft.title}
                onChange={(event) => updateDraft('title', event.target.value)}
                className="min-h-32"
              />
            </Field>

            <Field label="模範解答" className="mt-4">
              <Textarea
                value={draft.answer}
                onChange={(event) => updateDraft('answer', event.target.value)}
                className="min-h-28"
              />
            </Field>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="罠・間違えやすいポイント">
                <Textarea
                  value={draft.trap}
                  onChange={(event) => updateDraft('trap', event.target.value)}
                  className="min-h-24"
                />
              </Field>
              <Field label="定石（型）">
                <Textarea
                  value={draft.strategy}
                  onChange={(event) => updateDraft('strategy', event.target.value)}
                  className="min-h-24"
                />
              </Field>
            </div>

            <Field label="暗記の一言" className="mt-4">
              <Input
                value={draft.mnemonic}
                onChange={(event) => updateDraft('mnemonic', event.target.value)}
                placeholder="例: 平方完成したら、まず軸と定義域を比べる。"
              />
            </Field>

            {images.length > 0 ? (
              <div className="mt-5 border-t border-border pt-4">
                <p className="mb-2 text-[0.78rem] font-medium text-muted">
                  添付画像（{images.length}枚）
                </p>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {images.map((image, index) => (
                    <img
                      key={`${image.dataUrl.slice(-24)}-${index}`}
                      src={image.dataUrl}
                      alt={`添付画像 ${index + 1}`}
                      className="aspect-square w-full rounded-[8px] border border-border object-cover"
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </Card>

          <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-start gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={autoExplain}
                onChange={(event) => setAutoExplain(event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
              />
              <span>
                保存後にAI解説を生成する
                <span className="mt-0.5 block text-xs text-muted">
                  数秒〜十数秒かかることがあります。
                </span>
              </span>
            </label>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setDraft(null)} disabled={saving}>
                <Trash2 size={15} />
                破棄
              </Button>
              <Button size="lg" onClick={handleSave} disabled={saving}>
                {saving ? <Spinner /> : null}
                {saving ? '保存中…' : '保存する'}
              </Button>
            </div>
          </Card>

          {status ? (
            <p className="flex items-center gap-2 px-1 text-xs text-muted">
              <Spinner size={13} />
              {status}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
