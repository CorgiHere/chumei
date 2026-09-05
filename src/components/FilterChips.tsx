"use client";

import { cn } from "@/lib/utils";

export type FilterOption = {
  id: string;
  label: string;
};

type FilterChipsProps = {
  options: FilterOption[];
  value: string;
  onChange: (id: string) => void;
  label?: string;
  className?: string;
  /** @deprecated Site is dark-first; prop kept for call-site compatibility. */
  dark?: boolean;
};

export function FilterChips({
  options,
  value,
  onChange,
  label,
  className,
}: FilterChipsProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <p className="text-xs font-bold uppercase tracking-wide text-muted">
          {label}
        </p>
      )}
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              aria-pressed={active}
              className={cn(
                "border-2 px-3 py-1.5 font-mono-ui text-xs tracking-[0.08em] font-semibold transition",
                active
                  ? "border-brand-yellow bg-brand-yellow text-ink"
                  : "border-white/20 bg-transparent text-chalk hover:border-brand-yellow",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
