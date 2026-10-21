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

function PixelTrophyIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-7 w-7 shrink-0"
      aria-hidden
      shapeRendering="crispEdges"
    >
      <rect x="5" y="1" width="6" height="2" fill="#FFE27A" />
      <rect x="4" y="3" width="8" height="5" fill="#FFDE32" />
      <rect x="5" y="3" width="6" height="2" fill="#FFF3B0" />
      <rect x="2" y="4" width="2" height="3" fill="#FFDE32" />
      <rect x="12" y="4" width="2" height="3" fill="#FFDE32" />
      <rect x="3" y="7" width="2" height="1" fill="#E0B400" />
      <rect x="11" y="7" width="2" height="1" fill="#E0B400" />
      <rect x="6" y="8" width="4" height="2" fill="#FFDE32" />
      <rect x="7" y="10" width="2" height="2" fill="#E0B400" />
      <rect x="4" y="12" width="8" height="2" fill="#FFDE32" />
      <rect x="3" y="14" width="10" height="1" fill="#E0B400" />
    </svg>
  );
}

function PixelBolt() {
  return (
    <svg
      viewBox="0 0 12 16"
      className="h-4 w-3 shrink-0"
      aria-hidden
      shapeRendering="crispEdges"
    >
      <rect x="6" y="0" width="4" height="2" fill="#19E5EA" />
      <rect x="4" y="2" width="4" height="2" fill="#19E5EA" />
      <rect x="2" y="4" width="6" height="2" fill="#9FF7FA" />
      <rect x="0" y="6" width="8" height="2" fill="#19E5EA" />
      <rect x="4" y="8" width="6" height="2" fill="#19E5EA" />
      <rect x="6" y="10" width="4" height="2" fill="#9FF7FA" />
      <rect x="4" y="12" width="4" height="2" fill="#19E5EA" />
      <rect x="2" y="14" width="4" height="2" fill="#19E5EA" />
    </svg>
  );
}

function PixelInfoIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="h-3.5 w-3.5 shrink-0"
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

function PixelPersonIcon({ gender }: { gender: "male" | "female" }) {
  if (gender === "female") {
    return (
      <svg
        viewBox="0 0 16 16"
        className="h-5 w-5 shrink-0"
        aria-hidden
        shapeRendering="crispEdges"
      >
        <rect x="2" y="3" width="5" height="4" fill="#FF7AD8" />
        <rect x="9" y="3" width="5" height="4" fill="#FF7AD8" />
        <rect x="1" y="4" width="14" height="4" fill="#FF4EC8" />
        <rect x="2" y="8" width="12" height="3" fill="#FF4EC8" />
        <rect x="4" y="11" width="8" height="2" fill="#FF4EC8" />
        <rect x="6" y="13" width="4" height="2" fill="#FF4EC8" />
        <rect x="3" y="4" width="2" height="2" fill="#FFD6F3" />
        <rect x="10" y="4" width="2" height="2" fill="#FFD6F3" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-5 w-5 shrink-0"
      aria-hidden
      shapeRendering="crispEdges"
    >
      <rect x="7" y="0" width="2" height="3" fill="#21E6EF" />
      <rect x="6" y="3" width="4" height="2" fill="#21E6EF" />
      <rect x="0" y="7" width="3" height="2" fill="#21E6EF" />
      <rect x="13" y="7" width="3" height="2" fill="#21E6EF" />
      <rect x="3" y="5" width="10" height="6" fill="#21E6EF" />
      <rect x="5" y="4" width="6" height="8" fill="#21E6EF" />
      <rect x="6" y="11" width="4" height="2" fill="#21E6EF" />
      <rect x="7" y="13" width="2" height="3" fill="#21E6EF" />
      <rect x="6" y="6" width="2" height="2" fill="#9FF7FA" />
    </svg>
  );
}

function PixelSpark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 8 8"
      className={cn("h-2 w-2", className)}
      aria-hidden
      shapeRendering="crispEdges"
    >
      <rect x="3" y="0" width="2" height="2" fill="#FFDE32" />
      <rect x="0" y="3" width="2" height="2" fill="#FFDE32" />
      <rect x="6" y="3" width="2" height="2" fill="#FFDE32" />
      <rect x="3" y="6" width="2" height="2" fill="#FFDE32" />
      <rect x="3" y="3" width="2" height="2" fill="#FFFFFF" />
    </svg>
  );
}

function PixelBadge({ tone, label }: { tone: SchoolTone; label: string }) {
  return (
    <span className={cn("punch-px-badge", tone === "nthu" ? "punch-px-badge--nthu" : "punch-px-badge--nycu")}>
      <PixelSchoolMark tone={tone} />
      <span className="truncate text-[15px] leading-none text-white">{label}</span>
    </span>
  );
}

function PixelSchoolMark({ tone }: { tone: SchoolTone }) {
  const fill = tone === "nthu" ? "#F3D9FF" : "#D6E8FF";
  return (
    <svg
      viewBox="0 0 12 12"
      className="h-5 w-5 shrink-0"
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

function PixelScoreStat({
  gender,
  score,
}: {
  gender: "male" | "female";
  score: number;
}) {
  return (
    <div className="punch-px-stat">
      <p className="flex items-center gap-1 text-[12px] leading-none text-[#A8BEDD]">
        <PixelPersonIcon gender={gender} />
        {gender === "male" ? "男生" : "女生"}
      </p>
      <p
        className={cn(
          "text-[20px] leading-none",
          gender === "male" ? "text-[#FFDE32]" : "text-[#21E6EF]",
        )}
      >
        {formatScore(score)}
      </p>
    </div>
  );
}

function PixelTotalStat({ score }: { score: number }) {
  return (
    <div className="punch-px-stat punch-px-stat--total">
      <p className="text-[12px] leading-none text-[#A8BEDD]">總分</p>
      <p className="text-[24px] leading-none text-white">{formatScore(score)}</p>
    </div>
  );
}

function PixelVersusPanel({
  arcade,
  leftTone,
  rightTone,
}: {
  arcade: string;
  leftTone: SchoolTone;
  rightTone: SchoolTone;
}) {
  return (
    <div className="punch-px-vs">
      <PixelSpark className="punch-px-vs-spark punch-px-vs-spark--tl" />
      <PixelSpark className="punch-px-vs-spark punch-px-vs-spark--tr" />
      <PixelSpark className="punch-px-vs-spark punch-px-vs-spark--bl" />
      <PixelSpark className="punch-px-vs-spark punch-px-vs-spark--br" />
      <div className="flex items-end justify-center gap-0">
        <img
          src={art(leftTone === "nthu" ? "glove-red.svg" : "glove-blue.svg")}
          alt=""
          aria-hidden
          className="h-6 w-7 object-contain"
          style={{ imageRendering: "pixelated" }}
        />
        <img
          src={art(rightTone === "nthu" ? "glove-red.svg" : "glove-blue.svg")}
          alt=""
          aria-hidden
          className="h-6 w-7 -scale-x-100 object-contain"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
      <p className={cn(arcade, "text-[18px] leading-none text-[#FFDE32] drop-shadow-[2px_2px_0_#07132D]")}>VS</p>
    </div>
  );
}

function SchoolPanel({ side }: { side: SchoolSide }) {
  return (
    <PixelFrame variant="inner" className="punch-px-school">
      <PixelBadge tone={side.tone} label={side.label} />
      <PixelTotalStat score={side.male + side.female} />
      <div className="punch-px-genders">
        <PixelScoreStat gender="male" score={side.male} />
        <PixelScoreStat gender="female" score={side.female} />
      </div>
    </PixelFrame>
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
    <PixelFrame variant="outer" className="punch-px-hud mt-6">
      <div className="punch-px-head">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <PixelTrophyIcon />
          <p className="whitespace-nowrap text-[16px] leading-none text-white sm:text-[18px]">校際總分</p>
          <p className={cn(arcade, "whitespace-nowrap text-[8px] leading-none text-[#19E5EA] sm:text-[10px]")}>
            TEAM BATTLE
          </p>
          <PixelBolt />
        </div>
        <p className="flex items-center gap-1 whitespace-nowrap text-[12px] leading-none text-[#A8BEDD]">
          <span>以各組前 10 名積分計算</span>
          <span title="各校男生組與女生組前 10 名分數加總，總分為兩組合計">
            <PixelInfoIcon />
          </span>
        </p>
      </div>
      <div className="punch-px-fight">
        <SchoolPanel side={left} />
        <PixelVersusPanel arcade={arcade} leftTone={left.tone} rightTone={right.tone} />
        <SchoolPanel side={right} />
      </div>
    </PixelFrame>
  );
}
