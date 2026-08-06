import { cn } from "@/lib/utils";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
  className?: string;
};

export function PageIntro({
  eyebrow,
  title,
  subtitle,
  dark = false,
  className,
}: PageIntroProps) {
  return (
    <header className={cn("mb-8", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-2 text-sm font-bold",
            dark ? "text-brand-yellow" : "text-brand-blue",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h1
        className={cn(
          "display-title text-h1 font-black",
          dark && "text-white",
        )}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={cn(
            "mt-3 max-w-2xl text-base md:text-lg",
            dark ? "text-white/70" : "text-muted",
          )}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
