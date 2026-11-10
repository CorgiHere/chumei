import type { ReactNode } from "react";
import { cn, withBasePath } from "@/lib/utils";

type SchoolTone = "nthu" | "nycu";

type SchoolSide = {
  label: string;
  male: number;
  female: number;
  tone: SchoolTone;
};

function art(file: string) {
  return withBasePath(`/images/punchboard/${file}`);
}

function formatScore(n: number) {
  return n.toLocaleString("en-US");
}

function PixelFrame({
  variant,
  className,
  children,
}: {
  variant: "outer" | "inner";
  className?: string;
  children: ReactNode;
}) {
  const outer = variant === "outer";
  return (
    <div
      className={cn("punch-px-frame", className)}
      style={{
        border: outer ? "20px solid transparent" : "8px solid transparent",
        borderImageSource: `url(${art(outer ? "battle-frame.svg" : "battle-panel.svg")})`,
        borderImageSlice: outer ? "20 fill" : "12 fill",
        borderImageRepeat: "stretch",
        backgroundColor: outer ? "#07132D" : "#0B2043",
      }}
    >
      {children}
    </div>
  );
}

function PixelInfoIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="punch-px-foot__icon h-3.5 w-3.5 shrink-0"
      aria-hidden
      shapeRendering="crispEdges"
    >
      <rect x="2" y="0" width="8" height="2" fill="#19E5EA" />
      <rect x="0" y="2" width="2" height="8" fill="#19E5EA" />
      <rect x="10" y="2" width="2" height="8" fill="#19E5EA" />
      <rect x="2" y="10" width="8" height="2" fill="#19E5EA" />
      <rect x="5" y="2" width="2" height="2" fill="#FFFFFF" />
      <rect x="5" y="5" width="2" height="5" fill="#FFFFFF" />
    </svg>
  );
}

function PixelBadge({ tone, label }: { tone: SchoolTone; label: string }) {
  return (
    <span className={cn("punch-px-badge", tone === "nthu" ? "punch-px-badge--nthu" : "punch-px-badge--nycu")}>
      <PixelSchoolMark tone={tone} />
      <span className="whitespace-nowrap text-[15px] leading-none text-white">{label}</span>
    </span>
  );
}

function PixelSchoolMark({ tone }: { tone: SchoolTone }) {
  const fill = tone === "nthu" ? "#F3D9FF" : "#D6E8FF";
  return (
    <svg
      viewBox="0 0 12 12"
      className="punch-px-badge__mark h-5 w-5 shrink-0"
      aria-hidden
      shapeRendering="crispEdges"
    >
      <rect x="1" y="5" width="10" height="6" fill={fill} />
      <rect x="2" y="2" width="8" height="3" fill={fill} />
      <rect x="5" y="0" width="2" height="2" fill={fill} />
      <rect x="3" y="7" width="2" height="2" fill={tone === "nthu" ? "#6B2FA0" : "#163E9A"} />
      <rect x="7" y="7" width="2" height="2" fill={tone === "nthu" ? "#6B2FA0" : "#163E9A"} />
    </svg>
  );
}

function SchoolPanel({ side }: { side: SchoolSide }) {
  return (
    <div className="punch-px-school">
      <PixelBadge tone={side.tone} label={side.label} />
      <p className="punch-px-total">{formatScore(side.male + side.female)}</p>
      <p className="punch-px-split">
        <span className="text-[#FFDE32]">男 {formatScore(side.male)}</span>
        <span className="text-[#A8BEDD]"> | </span>
        <span className="text-[#21E6EF]">女 {formatScore(side.female)}</span>
      </p>
    </div>
  );
}

export function PunchBattleHud({
  arcade,
  left,
  right,
}: {
  arcade: string;
  left: SchoolSide;
  right: SchoolSide;
}) {
  return (
    <PixelFrame variant="outer" className="punch-px-hud mt-5">
      <div className="punch-px-head">
        <p className="min-w-0 truncate text-[15px] leading-none text-white sm:text-[17px]">
          校際總分對決
        </p>
        <p className={cn(arcade, "whitespace-nowrap text-[8px] leading-none text-[#19E5EA] sm:text-[10px]")}>
          TEAM BATTLE
        </p>
      </div>
      <div className="punch-px-fight">
        <SchoolPanel side={left} />
        <p
          className={cn(
            arcade,
            "punch-px-vs text-[16px] leading-none text-[#FFDE32] sm:text-[20px]",
          )}
        >
          VS
        </p>
        <SchoolPanel side={right} />
      </div>
      <p className="punch-px-foot">
        <span>以各組前 10 名積分計算</span>
        <span title="各校男生組與女生組前 10 名分數加總，總分為兩組合計">
          <PixelInfoIcon />
        </span>
      </p>
    </PixelFrame>
  );
}
