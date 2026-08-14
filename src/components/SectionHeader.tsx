import Link from "next/link";
import { cn, appPath } from "@/lib/utils";

type SectionHeaderProps = {
  index?: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
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
  highlight,
  subtitle,
  href,
  actionLabel = "查看全部",
  dark = false,
  id,
  className,
}: SectionHeaderProps) {
  const renderedTitle = highlight ? (
    <>
      {title.replace(highlight, "")}
          <span className="mark">{highlight}</span>
    </>
  ) : (
    title
  );

  return (
    <div className={cn("band-head mb-9", className)} id={id}>
      {index && (
        <span
          className={cn(
            "mb-2.5 block font-mono-ui text-xs tracking-[0.2em]",
            dark ? "text-brand-yellow" : "text-ink",
          )}
        >
          {index}
        </span>
      )}
      {eyebrow && !index && <p className="eyebrow">{eyebrow}</p>}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2
            className={cn(
              "section-title m-0",
              dark ? "text-chalk" : "text-ink",
            )}
          >
            {renderedTitle}
          </h2>
          {subtitle && (
            <p
              className={cn(
                "mt-3 max-w-[44em] text-[15px]",
                dark ? "text-[#afaca4]" : "text-[#3f3d38]",
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        {href && (
          <Link
            href={appPath(href)}
            className={cn(
              "text-link shrink-0 self-start md:self-auto",
              !dark && "text-ink border-b-brand-yellow",
            )}
          >
            {actionLabel} →
          </Link>
        )}
      </div>
    </div>
  );
}
