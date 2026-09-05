import { cn } from "@/lib/utils";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  /** Kept for call-site clarity; site is dark-first so chalk is the default. */
  dark?: boolean;
  className?: string;
};

export function PageIntro({
  eyebrow,
  title,
  highlight,
  subtitle,
  dark = true,
  className,
}: PageIntroProps) {
  return (
    <header className={cn("mb-8", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1
        className={cn(
          "display-title text-h1 font-black",
          dark ? "text-chalk" : "text-ink",
        )}
      >
        {highlight ? (
          <>
            {title.replace(highlight, "")}
            <span className="mark">{highlight}</span>
          </>
        ) : (
          title
        )}
      </h1>
      {subtitle && (
        <p className={cn("mt-3 max-w-2xl text-[15px] text-muted")}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
