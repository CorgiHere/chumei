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
                  ? "border-ink bg-brand-yellow text-ink"
                  : "border-ink/20 bg-white hover:border-ink",
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
