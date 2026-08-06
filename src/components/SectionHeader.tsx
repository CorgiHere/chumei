import Link from "next/link";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  index?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  actionLabel?: string;
  dark?: boolean;
  id?: string;
  className?: string;
};

export function SectionHeader({
  index,
  eyebrow,
  title,
  subtitle,
  href,
  actionLabel = "查看全部",
  dark = false,
  id,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between",
        className,
      )}
      id={id}
    >
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          {index && (
            <span
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-black",
                dark
                  ? "bg-brand-blue text-white"
                  : "bg-brand-blue text-white",
              )}
              aria-hidden
            >
              {index}
            </span>
          )}
          {eyebrow && (
            <span
              className={cn(
                "rounded-pill px-3 py-1 text-xs font-bold",
                dark
                  ? "bg-brand-yellow text-black"
                  : "bg-brand-yellow text-black",
              )}
            >
              {eyebrow}
            </span>
          )}
        </div>
        <h2
          className={cn(
            "section-title display-title",
            dark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              "mt-2 max-w-2xl text-base font-medium",
              dark ? "text-white/70" : "text-muted",
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className={cn(
            "text-link shrink-0 self-start md:self-auto",
            dark && "text-brand-yellow",
          )}
        >
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}
