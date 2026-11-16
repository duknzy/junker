import { ArchiveRestore, Loader2, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { useToast } from '@/core/ui/Toast';
import { errorMessage } from '@/sync/engine';
import {
  fetchLegacyPreview,
  importLegacyProblems,
  type LegacyImportResult,
  type LegacyPreview,
  type LegacyProgress,
} from '@/sync/legacy';
import { useSyncState } from '@/sync/useSync';

type Phase = 'idle' | 'loading' | 'preview' | 'importing' | 'done';

export function LegacyImportCard() {
  const sync = useSyncState();
  const { toast } = useToast();
  const [phase, setPhase] = useState<Phase>('idle');
  const [preview, setPreview] = useState<LegacyPreview | null>(null);
  const [progress, setProgress] = useState<LegacyProgress | null>(null);
  const [result, setResult] = useState<LegacyImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signedIn = Boolean(sync.user);

  async function handlePreview() {
    if (!sync.user) return;
    setPhase('loading');
    setError(null);
    setResult(null);
    try {
      const next = await fetchLegacyPreview(sync.user.uid);
      setPreview(next);
      setPhase('preview');
      if (next.total === 0) {
        toast('旧データは見つかりませんでした。', 'info');
      }
    } catch (caught) {
      setError(errorMessage(caught));
      setPhase('idle');
    }
  }

  async function handleImport() {
    if (!sync.user || !preview || preview.pending === 0) return;
    if (
      !window.confirm(
        `旧Floraのデータ（未取り込み ${preview.pending} 件：誤答ノート・気づきメモ・『文系の数学』進捗）を取り込みます。よろしいですか？`,
      )
    ) {
      return;
    }

    setPhase('importing');
    setError(null);
    setProgress({ done: 0, total: preview.pending, images: 0 });

    try {
      const imported = await importLegacyProblems(sync.user.uid, (next) => {
        setProgress(next);
      });
      setResult(imported);
      setPreview(null);
      setPhase('done');
      toast(
        `誤答 ${imported.imported} 問・気づき ${imported.insightsImported} 件・文系の数学 ${imported.bunkeiImported} 件を取り込みました。`,
        'success',
      );
    } catch (caught) {
      setError(errorMessage(caught));
      setPhase('preview');
    }
  }

  const percent =
    progress && progress.total > 0
      ? Math.round((progress.done / progress.total) * 100)
      : 0;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <ArchiveRestore size={16} className="text-muted" />
          <h2 className="text-sm font-semibold">旧データ取り込み</h2>
        </div>
        <Badge>旧Flora</Badge>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted">
        旧Floraの<strong className="font-medium text-ink">誤答データ</strong>（
        <code className="text-ink">problems</code> / <code className="text-ink">mistakes</code> / 写真）、
        <strong className="font-medium text-ink">気づき一覧</strong>（問題の極意メモ・授業の気づきメモ・文系の数学メモ）、
        および<strong className="font-medium text-ink">『文系の数学』進捗</strong>をまとめてこの端末へ引き継ぎます。
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">
        取り込んだ誤答は今日の復習に追加され、気づきメモは「ノート → 気づき」に集約されます。同じIDのデータが既にある場合は重複作成せず、未設定の気づきメモのみ補完します。
      </p>

      {!signedIn ? (
        <p className="mt-4 rounded-[10px] bg-surface-2 px-3 py-2.5 text-xs leading-relaxed text-muted">
          Googleでログインすると使えます。上の「クラウド同期」からログインしてください。
        </p>
      ) : (
        <>
          {phase === 'idle' ? (
            <Button
              className="mt-4 w-full sm:w-auto"
              onClick={handlePreview}
              disabled={sync.phase === 'connecting' || sync.phase === 'syncing'}
            >
              <ArchiveRestore size={15} />
              旧データを確認
            </Button>
          ) : null}

          {phase === 'loading' ? (
            <Button className="mt-4 w-full sm:w-auto" disabled>
              <Loader2 size={15} className="animate-spin" />
              確認中…
            </Button>
          ) : null}

          {phase === 'preview' && preview ? (
            <>
              <div className="mt-4 rounded-[10px] bg-surface-2 px-4 py-3">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <span>
                    誤答問題 <strong className="tabular-nums">{preview.problemCount}</strong> 問
                  </span>
                  <span>
                    気づきメモ <strong className="tabular-nums">{preview.insightCount}</strong> 件
                  </span>
                  {preview.bunkeiCount > 0 ? (
                    <span>
                      文系の数学{' '}
                      <strong className="tabular-nums">{preview.bunkeiCount}</strong> 件
                    </span>
                  ) : null}
                  {preview.flashcardCount > 0 ? (
                    <span>
                      暗記カード{' '}
                      <strong className="tabular-nums">{preview.flashcardCount}</strong> 枚
                    </span>
                  ) : null}
                  {preview.imageCount > 0 ? (
                    <span>
                      画像 約
                      <strong className="tabular-nums">{preview.imageCount}</strong> 枚
                    </span>
                  ) : null}
                </div>

                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                  <span>
                    未取り込み・更新対象{' '}
                    <strong className="tabular-nums text-ink">{preview.pending}</strong> 件
                  </span>
                  {preview.alreadyImported > 0 ? (
                    <span>
                      取り込み済み{' '}
                      <strong className="tabular-nums">{preview.alreadyImported}</strong> 件
                    </span>
                  ) : null}
                </div>

                {preview.sampleTitles.length > 0 ? (
                  <ul className="mt-2 space-y-0.5 text-xs text-muted">
                    {preview.sampleTitles.map((title, index) => (
                      <li key={index} className="truncate">
                        ・{title}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <p className="mt-2 text-xs text-muted">
                  画像はこの端末にのみ保存され、クラウド同期されません。
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button
                  className="flex-1"
                  onClick={handleImport}
                  disabled={preview.pending === 0}
                >
                  <ArchiveRestore size={15} />
                  {preview.pending === 0
                    ? 'すべて取り込み済み'
                    : `${preview.pending} 件を取り込む`}
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={handlePreview}
                >
                  再確認
                </Button>
              </div>
            </>
          ) : null}

          {phase === 'importing' && progress ? (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <Loader2 size={13} className="animate-spin" />
                  取り込み中…
                </span>
                <span className="tabular-nums">
                  {progress.done} / {progress.total}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-200"
                  style={{ width: `${percent}%` }}
                />
              </div>
              {progress.images > 0 ? (
                <p className="mt-1.5 text-xs text-muted">
                  画像 {progress.images} 枚を保存しました
                </p>
              ) : null}
            </div>
          ) : null}

          {phase === 'done' && result ? (
            <div className="mt-4 rounded-[10px] border border-accent/25 bg-accent-soft/40 px-4 py-3">
              <p className="text-sm font-medium text-accent-ink">
                誤答 {result.imported} 問・気づき {result.insightsImported} 件・文系の数学{' '}
                {result.bunkeiImported} 件
                {result.flashcardsImported > 0
                  ? `・暗記カード ${result.flashcardsImported} 枚`
                  : ''}
                を取り込みました
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                画像 {result.images} 枚
                {result.skipped > 0
                  ? ` · 取り込み済み ${result.skipped} 件をスキップ`
                  : ''}
                {result.missingImages > 0
                  ? ` · 取得できなかった画像 ${result.missingImages} 枚`
                  : ''}
                {result.failed > 0 ? ` · 失敗 ${result.failed} 件` : ''}
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={handlePreview}
              >
                もう一度確認
              </Button>
            </div>
          ) : null}

          {error ? (
            <div className="mt-3 flex items-start gap-2 rounded-[10px] border border-danger/25 bg-danger-soft/40 px-3 py-2.5 text-xs leading-relaxed text-danger">
              <TriangleAlert size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}
        </>
      )}
    </Card>
  );
}
