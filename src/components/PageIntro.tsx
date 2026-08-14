import { cn } from "@/lib/utils";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  dark?: boolean;
  className?: string;
};

export function PageIntro({
  eyebrow,
  title,
  highlight,
  subtitle,
  dark = false,
  className,
}: PageIntroProps) {
  return (
    <header className={cn("mb-8", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className={cn("display-title text-h1 font-black", dark ? "text-chalk" : "text-ink")}>
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
        <p className={cn("mt-3 max-w-2xl text-[15px]", dark ? "text-[#afaca4]" : "text-muted")}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
