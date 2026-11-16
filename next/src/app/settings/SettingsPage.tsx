import { useLiveQuery } from 'dexie-react-hooks';
import {
  Database,
  Download,
  ExternalLink,
  Monitor,
  Moon,
  RotateCcw,
  Sparkles,
  Sun,
  Trash2,
  Upload,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { checkAIStatus } from '@/ai/client';
import { cn } from '@/core/lib/cn';
import { localDayKey } from '@/core/lib/date';
import {
  DEFAULT_GLASS_BLUR,
  DEFAULT_GLASS_OPACITY,
  useTheme,
  type ThemeMode,
} from '@/core/theme';
import { Badge } from '@/core/ui/Badge';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { PageHeader } from '@/core/ui/PageHeader';
import { useToast } from '@/core/ui/Toast';
import {
  clearAllData,
  countProblems,
  exportData,
  importData,
  type ExportBundle,
} from '@/data/repo';
import { seedDemoData } from '@/data/seed';
import { deleteCloudData } from '@/sync/engine';
import { useSyncState } from '@/sync/useSync';
import { LegacyImportCard } from './LegacyImportCard';
import { SyncCard } from './SyncCard';

const themeOptions: Array<{ value: ThemeMode; label: string; icon: typeof Sun }> = [
  { value: 'light', label: 'ライト', icon: Sun },
  { value: 'dark', label: 'ダーク', icon: Moon },
  { value: 'system', label: '端末に合わせる', icon: Monitor },
];

const glassPresets: Array<{ label: string; opacity: number }> = [
  { label: '極薄', opacity: 22 },
  { label: '薄め', opacity: 36 },
  { label: '標準', opacity: 52 },
  { label: '濃いめ', opacity: 72 },
  { label: 'くっきり', opacity: 88 },
];

export function SettingsPage() {
  const {
    mode,
    setMode,
    glassOpacity,
    setGlassOpacity,
    glassBlur,
    setGlassBlur,
    resetGlassSettings,
  } = useTheme();
  const count = useLiveQuery(() => countProblems(), []);
  const sync = useSyncState();
  const [ai, setAi] = useState<{ ok: boolean; configured: boolean } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAIStatus().then(setAi);
  }, []);

  async function handleExport() {
    setBusy('export');
    try {
      const bundle = await exportData();
      const blob = new Blob([JSON.stringify(bundle, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `flora-backup-${localDayKey()}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast('バックアップを書き出しました。', 'success');
    } catch (error) {
      toast(error instanceof Error ? error.message : '書き出しに失敗しました。', 'error');
    } finally {
      setBusy(null);
    }
  }

  async function handleImport(file: File) {
    setBusy('import');
    try {
      const text = await file.text();
      const bundle = JSON.parse(text) as ExportBundle;
      const cloud = Boolean(sync.user);
      if (
        !window.confirm(
          cloud
            ? '現在のデータをすべて置き換えて取り込みます。クラウド上のバックアップも置き換えます。よろしいですか？'
            : '現在のデータをすべて置き換えて取り込みます。よろしいですか？',
        )
      ) {
        return;
      }
      if (cloud) await deleteCloudData();
      const result = await importData(bundle, { replace: true });
      toast(
        `${result.problems} 件の問題と ${result.images} 枚の画像を取り込みました。`,
        'success',
      );
    } catch (error) {
      toast(
        error instanceof Error ? error.message : '取り込みに失敗しました。',
        'error',
      );
    } finally {
      setBusy(null);
    }
  }

  async function handleSeed() {
    setBusy('seed');
    try {
      const added = await seedDemoData();
      toast(
        added > 0
          ? `サンプル問題を ${added} 件追加しました。`
          : '問題がすでにあるため追加しませんでした。',
        added > 0 ? 'success' : 'info',
      );
    } finally {
      setBusy(null);
    }
  }

  async function handleClear() {
    const cloud = Boolean(sync.user);
    if (
      !window.confirm(
        cloud
          ? 'この端末のすべての問題・画像・復習履歴を削除し、クラウド上のバックアップも削除します。この操作は取り消せません。'
          : 'すべての問題・画像・復習履歴を削除します。この操作は取り消せません。',
      )
    ) {
      return;
    }
    setBusy('clear');
    try {
      if (cloud) await deleteCloudData();
      await clearAllData();
      toast('すべてのデータを削除しました。', 'success');
    } catch (error) {
      toast(
        error instanceof Error ? error.message : '削除に失敗しました。',
        'error',
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="設定"
        title="設定"
        description="表示、AI、同期、データの管理。まずはテーマとバックアップを確認してください。"
      />

      <div className="space-y-4">
        <Card className="p-5">
          <h2 className="text-sm font-semibold">表示</h2>
          <p className="mt-1 text-sm text-muted">
            アプリの明るさと、背景画像に対するすりガラスの薄さ（透過度・ぼかし）を調整できます。
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMode(option.value)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-[10px] border px-2 py-3 text-xs transition-colors',
                  mode === option.value
                    ? 'border-accent bg-accent-soft font-medium text-accent-ink'
                    : 'border-border bg-surface text-muted hover:bg-surface-2',
                )}
              >
                <option.icon size={17} />
                {option.label}
              </button>
            ))}
          </div>

          {/* すりガラスの薄さ（透過度・ぼかし）調整 */}
          <div className="mt-5 space-y-4 border-t border-border pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-semibold text-ink">
                  すりガラスの薄さ（透過度）
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  左に動かすほどすりガラスが薄くなり、背景の海と夕焼けが透けて見えます。
                </p>
              </div>
              {(glassOpacity !== DEFAULT_GLASS_OPACITY ||
                glassBlur !== DEFAULT_GLASS_BLUR) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetGlassSettings}
                  className="h-7 px-2.5 text-xs"
                >
                  <RotateCcw size={13} />
                  初期値に戻す
                </Button>
              )}
            </div>

            {/* プリセットボタン */}
            <div className="flex flex-wrap gap-1.5">
              {glassPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setGlassOpacity(preset.opacity)}
                  className={cn(
                    'rounded-[8px] border px-2.5 py-1 text-xs transition-colors',
                    glassOpacity === preset.opacity
                      ? 'border-accent bg-accent-soft font-semibold text-accent-ink'
                      : 'border-border bg-surface-2 text-muted hover:bg-surface hover:text-ink',
                  )}
                >
                  {preset.label}（{preset.opacity}%）
                </button>
              ))}
            </div>

            {/* 不透明度スライダー */}
            <div className="rounded-[10px] border border-border bg-surface-2 p-3.5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-ink">
                  すりガラスの濃さ: <strong className="tabular-nums">{glassOpacity}%</strong>
                  <span className="ml-1.5 text-muted">
                    （透過度 {100 - glassOpacity}%）
                  </span>
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={95}
                step={1}
                value={glassOpacity}
                onChange={(e) => setGlassOpacity(Number(e.target.value))}
                className="h-2 w-full cursor-pointer accent-accent"
                aria-label="すりガラスの薄さ・不透明度"
              />
              <div className="mt-1 flex justify-between text-[0.7rem] text-muted">
                <span>← 薄い（背景がよく透ける）</span>
                <span>濃い（文字がくっきり読める） →</span>
              </div>
            </div>

            {/* ぼかし（Blur）スライダー */}
            <div className="rounded-[10px] border border-border bg-surface-2 p-3.5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-ink">
                  すりガラスのぼかし強さ: <strong className="tabular-nums">{glassBlur}px</strong>
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={24}
                step={1}
                value={glassBlur}
                onChange={(e) => setGlassBlur(Number(e.target.value))}
                className="h-2 w-full cursor-pointer accent-accent"
                aria-label="すりガラスのぼかし強さ"
              />
              <div className="mt-1 flex justify-between text-[0.7rem] text-muted">
                <span>← クリア（ぼかしなし 0px）</span>
                <span>強いすりガラス（24px） →</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">AI</h2>
              <p className="mt-1 text-sm text-muted">
                AIキーはサーバー側で管理されます。この端末には保存されません。
              </p>
            </div>
            {ai === null ? (
              <Badge>確認中</Badge>
            ) : ai.configured ? (
              <Badge tone="accent">
                <Wifi size={12} />
                接続済み
              </Badge>
            ) : (
              <Badge tone="warning">
                <WifiOff size={12} />
                デモモード
              </Badge>
            )}
          </div>

          <div className="mt-4 rounded-[10px] bg-surface-2 p-4 text-sm leading-relaxed text-muted">
            {ai === null ? (
              'AIサーバーの状態を確認しています…'
            ) : ai.configured ? (
              <>
                サーバーの <code className="text-ink">GEMINI_API_KEY</code> を使って
                <code className="ml-1 text-ink">gemini-4-hydrogen</code> で生成します。
              </>
            ) : (
              <>
                <code className="text-ink">GEMINI_API_KEY</code> が未設定のため、解析と解説は
                デモデータで動作します。ローカルではルートの <code className="text-ink">.env</code>
                に設定してください。
              </>
            )}
          </div>
        </Card>

        <SyncCard />

        <LegacyImportCard />

        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-muted" />
            <h2 className="text-sm font-semibold">データ</h2>
            <span className="ml-auto text-xs text-muted">{count ?? '—'} 問</span>
          </div>
          <p className="mt-1 text-sm text-muted">
            学習データはこの端末（IndexedDB）に保存されます。画像も含めてJSONに書き出せます。
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleExport}
              disabled={busy !== null}
            >
              <Download size={15} />
              バックアップを書き出す
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy !== null}
            >
              <Upload size={15} />
              バックアップから復元
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (file) void handleImport(file);
              }}
            />
          </div>

          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3 sm:flex-row">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={handleSeed}
              disabled={busy !== null}
            >
              <Sparkles size={15} />
              サンプル問題を追加
            </Button>
            <Button
              variant="ghost"
              className="flex-1 text-danger hover:bg-danger-soft hover:text-danger"
              onClick={handleClear}
              disabled={busy !== null}
            >
              <Trash2 size={15} />
              すべて削除
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold">このアプリについて</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Flora の学習ワークスペースです。今日の復習、問題登録、AI解析・解説、AI質問チャット、全問マラソン、ダッシュボード一括整理、文系の数学特訓、暗記カード、クラウド同期までを実装しています。
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-3">
            <p className="text-xs text-muted">Flora 新バージョン 1.0 · ローカル優先 / クラウド同期</p>
            <a
              href="/legacy/index.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface/50 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface/80 hover:text-accent transition-colors"
            >
              <ExternalLink size={13} />
              旧Flora（アーカイブ版）を開く
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
