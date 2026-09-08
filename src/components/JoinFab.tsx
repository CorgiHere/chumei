import { JoinPoster } from "@/components/JoinPoster";
import { siteConfig } from "@/data/site";

type JoinFabProps = {
  lively?: boolean;
};

export function JoinFab({ lively = true }: JoinFabProps) {
  return (
    <a
      href={siteConfig.joinFormUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={
        lively
          ? "join-fab fixed right-4 z-[60] no-underline bottom-[max(1rem,env(safe-area-inset-bottom))]"
          : "fixed right-4 z-[60] no-underline bottom-[max(1rem,env(safe-area-inset-bottom))]"
      }
    >
      <JoinPoster />
    </a>
  );
}
