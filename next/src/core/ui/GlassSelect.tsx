import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';

export interface GlassSelectOption {
  value: string;
  label: string;
}

export function GlassSelect({
  value,
  onChange,
  options,
  className,
  size = 'sm',
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: GlassSelectOption[];
  className?: string;
  size?: 'sm' | 'md';
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected =
    options.find((opt) => opt.value === value) ?? options[0] ?? { value: '', label: '' };

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-[9px] border border-border bg-surface-2 text-left text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-ring',
          size === 'sm' ? 'h-8.5 px-2.5 text-xs' : 'h-10 px-3 text-sm',
        )}
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown
          size={size === 'sm' ? 14 : 15}
          className={cn(
            'shrink-0 text-muted transition-transform duration-150',
            open && 'rotate-180',
          )}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          className="hide-scrollbar absolute left-0 right-0 z-50 mt-1 max-h-64 min-w-[180px] overflow-y-auto rounded-[10px] border border-border bg-[#ffffff]/92 p-1 text-ink shadow-[0_12px_32px_rgba(0,0,0,0.22)] backdrop-blur-xl dark:bg-[#161924]/94"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-2 rounded-[7px] px-2.5 py-1.5 text-left text-xs transition-colors',
                  isSelected
                    ? 'bg-accent-soft font-semibold text-accent-ink'
                    : 'text-ink hover:bg-surface-2',
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected ? (
                  <Check size={13} className="shrink-0 text-accent-ink" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
