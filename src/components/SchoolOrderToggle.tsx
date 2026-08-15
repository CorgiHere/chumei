"use client";

import { cn } from "@/lib/utils";
import { useSchoolOrder } from "./SchoolOrder";

export function SchoolOrderToggle({ className }: { className?: string }) {
  const { order, setOrder } = useSchoolOrder();

  return (
    <div
      data-keep-order
      className={cn(
        "inline-flex border-2 border-brand-yellow font-mono-ui text-xs tracking-widest",
        className,
      )}
      role="group"
      aria-label="清交或交清"
    >
      <button
        type="button"
        className={cn(
          "px-2.5 py-1.75",
          order === "qingjiao"
            ? "bg-brand-yellow text-ink"
            : "bg-transparent text-brand-yellow hover:bg-brand-yellow/15",
        )}
        aria-pressed={order === "qingjiao"}
        onClick={() => setOrder("qingjiao")}
      >
        清交
      </button>
      <button
        type="button"
        className={cn(
          "px-2.5 py-1.75",
          order === "jiaoqing"
            ? "bg-brand-yellow text-ink"
            : "bg-transparent text-brand-yellow hover:bg-brand-yellow/15",
        )}
        aria-pressed={order === "jiaoqing"}
        onClick={() => setOrder("jiaoqing")}
      >
        交清
      </button>
    </div>
  );
}
