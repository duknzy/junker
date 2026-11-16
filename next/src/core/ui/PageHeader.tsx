import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        'mb-6 rounded-[12px] border border-border bg-surface px-5 py-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] backdrop-blur-md',
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-1 text-xs font-medium tracking-wide text-muted">{eyebrow}</p>
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
