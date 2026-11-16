import { Check } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/core/lib/cn';
import { Badge } from '@/core/ui/Badge';
import { InlineMarkdown } from '@/core/ui/Markdown';
import { isDue } from '@/data/srs';
import type { Problem } from '@/data/types';

function formatShortDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const yy = String(d.getFullYear()).slice(-2);
  return `${yy}/${d.getMonth() + 1}/${d.getDate()}`;
}

function buildMathSafeSnippet(rawTitle: string, maxLen = 68): string {
  if (!rawTitle) return '';
  const oneLine = String(rawTitle)
    .replace(/\\n/g, ' ')
    .replace(/\r?\n/g, ' ')
    .trim();
  if (oneLine.length <= maxLen) return oneLine;
  let body = oneLine.slice(0, maxLen);
  const dollarCount = (body.match(/\$/g) || []).length;
  if (dollarCount % 2 !== 0) {
    const lastDollar = body.lastIndexOf('$');
    if (lastDollar >= 0) {
      body = body.slice(0, lastDollar).trimEnd();
    }
  }
  return `${body}…`;
}

function getSubjectGlyph(subject: string): string {
  if (subject.includes('数学')) return 'f(x)';
  if (subject.includes('物理')) return 'F=ma';
  if (subject.includes('化学')) return 'Chem';
  if (subject.includes('生物')) return 'Bio';
  if (subject.includes('英語')) return 'Eng';
  if (subject.includes('国語')) return '国語';
  if (subject.includes('日本史') || subject.includes('世界史')) return 'Hist';
  if (
    subject.includes('政経') ||
    subject.includes('政治') ||
    subject.includes('公民') ||
    subject.includes('公共')
  ) {
    return 'Civ';
  }
  if (subject.includes('地理')) return 'Geo';
  if (subject.includes('情報')) return 'Info';
  return 'Q';
}

function FastInlineMath({ children }: { children: string }) {
  if (!children) return null;
  if (!children.includes('$') && !children.includes('\\')) {
    return <>{children}</>;
  }
  return <InlineMarkdown>{children}</InlineMarkdown>;
}

export const ProblemListItem = memo(function ProblemListItem({
  problem,
  selected = false,
  onSelect,
  bulkMode = false,
  checked = false,
  onToggleCheck,
  marathonStatus = null,
}: {
  problem: Problem;
  selected?: boolean;
  onSelect?: (problem: Problem) => void;
  bulkMode?: boolean;
  checked?: boolean;
  onToggleCheck?: (id: string) => void;
  marathonStatus?: 'cleared' | 'retry' | null;
}) {
  const due = isDue(problem.nextReviewAt);
  const hasInsight = Boolean(problem.insight?.trim());
  const addedDate = formatShortDate(problem.createdAt);
  const insightDate = hasInsight
    ? formatShortDate(problem.insightUpdatedAt || problem.updatedAt)
    : null;
  const snippet =
    problem.title && problem.title.trim() !== problem.shortTitle.trim()
      ? buildMathSafeSnippet(problem.title, 70)
      : '';
  const errorStr = String(Math.max(0, problem.errorCount ?? 0)).padStart(2, '0');

  return (
    <Link
      to={`/problems/${problem.id}`}
      onClick={(event) => {
        if (bulkMode && onToggleCheck) {
          event.preventDefault();
          onToggleCheck(problem.id);
          return;
        }
        if (!onSelect) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }
        event.preventDefault();
        onSelect(problem);
      }}
      className={cn(
        'flora-glass group flex items-center gap-3 rounded-[12px] border px-3.5 py-3 transition-colors hover:border-accent/60 hover:bg-surface-2/85',
        bulkMode && checked
          ? 'border-accent bg-accent-soft/40 ring-1 ring-accent/60'
          : selected
            ? 'border-accent bg-accent-soft/35 ring-1 ring-accent/50'
            : 'border-border bg-surface',
        problem.errorCount >= 3
          ? 'border-l-[4px] border-l-danger'
          : problem.errorCount >= 1
            ? 'border-l-[4px] border-l-warning'
            : 'border-l-[4px] border-l-accent',
      )}
    >
      {/* 一括選択チェックボックス */}
      {bulkMode ? (
        <span
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors',
            checked
              ? 'border-accent bg-accent text-white'
              : 'border-border bg-surface-2 text-transparent group-hover:border-accent/60',
          )}
          aria-hidden="true"
        >
          <Check size={12} strokeWidth={3} />
        </span>
      ) : null}

      {/* 左サムネイル / 教科アイコン */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[9px] border border-border bg-surface-2">
        {problem.thumbDataUrl ? (
          <img
            src={problem.thumbDataUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="font-mono text-xs font-extrabold italic tracking-tight text-accent-ink">
            {getSubjectGlyph(problem.subject)}
          </span>
        )}
      </div>

      {/* 中央：バッジ・タイトル・問題文プレビュー・日付 */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-1.5">
          <Badge tone="accent">{problem.subject}</Badge>
          {problem.unit && problem.unit !== problem.subject ? (
            <Badge tone="neutral">{problem.unit}</Badge>
          ) : null}
          {marathonStatus === 'cleared' ? (
            <span className="inline-flex items-center gap-0.5 rounded-[5px] bg-accent-soft px-1.5 py-0.5 text-[0.65rem] font-bold text-accent-ink">
              🏁 周回済
            </span>
          ) : marathonStatus === 'retry' ? (
            <span className="inline-flex items-center gap-0.5 rounded-[5px] bg-danger-soft px-1.5 py-0.5 text-[0.65rem] font-bold text-danger">
              🔄 要再挑戦
            </span>
          ) : null}
          {hasInsight ? (
            <span
              className="inline-flex items-center text-xs"
              title="気づきメモあり"
            >
              🧠
            </span>
          ) : null}
          {problem.pinned ? (
            <span
              className="inline-flex items-center text-xs text-warning"
              title="ピン留め"
            >
              ★
            </span>
          ) : null}
          {due ? <Badge tone="warning">要復習</Badge> : null}
          {problem.demo ? <Badge tone="warning">デモ</Badge> : null}
        </div>

        <p className="truncate text-[0.95rem] font-bold text-ink">
          <FastInlineMath>{problem.shortTitle}</FastInlineMath>
        </p>

        {snippet ? (
          <p className="mt-0.5 truncate text-xs text-muted">
            <FastInlineMath>{snippet}</FastInlineMath>
          </p>
        ) : null}

        <div className="mt-1 flex flex-wrap items-center gap-3 text-[0.7rem] text-muted">
          {addedDate ? <span>🗓️ 追加: {addedDate}</span> : null}
          {insightDate ? (
            <span className="font-semibold text-accent-ink">
              🧠 気づき更新: {insightDate}
            </span>
          ) : null}
        </div>
      </div>

      {/* 右：誤答カウント（旧Floraスタイル） */}
      <div className="shrink-0 pl-2 text-center">
        <p
          className={cn(
            'text-xl font-extrabold leading-none tabular-nums',
            problem.errorCount >= 3
              ? 'text-danger'
              : problem.errorCount >= 1
                ? 'text-warning'
                : 'text-ink',
          )}
        >
          {errorStr}
        </p>
        <p className="mt-1 text-[0.65rem] font-semibold text-muted">誤答</p>
      </div>
    </Link>
  );
});
