import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/core/ui/Badge';
import type { Lesson } from '@/data/types';

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const total = lesson.parts.length;
  const done = lesson.completedPartIds.length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const complete = total > 0 && done === total;

  return (
    <Link
      to={`/problems/lessons/${lesson.id}`}
      className="group flex items-center gap-4 rounded-[11px] border border-border bg-surface px-4 py-3.5 transition-colors hover:bg-surface-2/60"
    >
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium">{lesson.title}</span>
          {complete ? <Badge tone="accent">完了</Badge> : null}
          {lesson.demo ? <Badge tone="warning">デモ</Badge> : null}
        </div>
        <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-muted">
          <span className="shrink-0">{lesson.subject}</span>
          <span aria-hidden>·</span>
          <span className="truncate">{lesson.unit}</span>
          <span aria-hidden>·</span>
          <span className="shrink-0">{total}パート</span>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="shrink-0 text-[0.68rem] tabular-nums text-muted">
            {done}/{total}
          </span>
        </div>
      </div>
      <ChevronRight
        size={16}
        className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}
