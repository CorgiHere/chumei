"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { JoinFab } from "@/components/JoinFab";
import { cn } from "@/lib/utils";

type Tape = {
  id: number;
  top: string;
  left: string;
  rot: number;
  thick: number;
  delay: number;
  origin: "left" | "right";
  yank: 1 | -1;
  z: number;
  variant: "text" | "stripe" | "invert";
};

const TAPE_MS = 1080;
const DELAY_STEP_MS = 32;
const DELAY_BASE_MS = 16;
const TAPE_COPY =
  "封鎖線  CAUTION  竹梅賽  DO NOT CROSS  封鎖線  CAUTION  2027  封鎖線  CAUTION  竹梅賽  DO NOT CROSS  封鎖線  CAUTION  2027  封鎖線  CAUTION  竹梅賽  DO NOT CROSS  ";

const TAPE_LAYOUT: Omit<Tape, "id" | "delay">[] = [
  { top: "6%", left: "50%", rot: -2.4, thick: 40, origin: "left", yank: -1, z: 2, variant: "text" },
  { top: "17%", left: "50%", rot: 1.6, thick: 46, origin: "right", yank: 1, z: 3, variant: "text" },
  { top: "29%", left: "50%", rot: -1.1, thick: 34, origin: "left", yank: -1, z: 2, variant: "stripe" },
  { top: "41%", left: "50%", rot: 2.2, thick: 50, origin: "right", yank: 1, z: 4, variant: "invert" },
  { top: "54%", left: "50%", rot: -1.8, thick: 38, origin: "left", yank: -1, z: 3, variant: "text" },
  { top: "67%", left: "50%", rot: 1.3, thick: 44, origin: "right", yank: 1, z: 2, variant: "stripe" },
  { top: "80%", left: "50%", rot: -2.6, thick: 42, origin: "left", yank: -1, z: 3, variant: "text" },
  { top: "93%", left: "50%", rot: 1.9, thick: 36, origin: "right", yank: 1, z: 2, variant: "text" },
  { top: "50%", left: "7%", rot: 90.8, thick: 36, origin: "left", yank: -1, z: 5, variant: "text" },
  { top: "50%", left: "22%", rot: 88.4, thick: 30, origin: "right", yank: 1, z: 4, variant: "stripe" },
  { top: "50%", left: "38%", rot: 91.6, thick: 42, origin: "left", yank: -1, z: 6, variant: "invert" },
  { top: "50%", left: "55%", rot: 89.2, thick: 32, origin: "right", yank: 1, z: 5, variant: "text" },
  { top: "50%", left: "71%", rot: 92.1, thick: 38, origin: "left", yank: -1, z: 4, variant: "stripe" },
  { top: "50%", left: "86%", rot: 88.7, thick: 34, origin: "right", yank: 1, z: 6, variant: "text" },
  { top: "48%", left: "48%", rot: -36, thick: 40, origin: "left", yank: -1, z: 8, variant: "text" },
  { top: "36%", left: "58%", rot: 28, thick: 36, origin: "right", yank: 1, z: 7, variant: "text" },
  { top: "62%", left: "42%", rot: -54, thick: 32, origin: "left", yank: -1, z: 9, variant: "stripe" },
  { top: "24%", left: "32%", rot: 48, thick: 44, origin: "right", yank: 1, z: 8, variant: "invert" },
  { top: "72%", left: "68%", rot: 22, thick: 38, origin: "left", yank: -1, z: 7, variant: "text" },
  { top: "18%", left: "74%", rot: -24, thick: 30, origin: "right", yank: 1, z: 9, variant: "stripe" },
  { top: "82%", left: "28%", rot: 62, thick: 36, origin: "left", yank: -1, z: 8, variant: "text" },
  { top: "50%", left: "50%", rot: -68, thick: 28, origin: "right", yank: 1, z: 10, variant: "text" },
];

function buildTapes(): Tape[] {
  return TAPE_LAYOUT.map((tape, i) => ({
    ...tape,
    id: i,
    delay: DELAY_BASE_MS + i * DELAY_STEP_MS,
  }));
}

const TOTAL_MS =
  DELAY_BASE_MS + (TAPE_LAYOUT.length - 1) * DELAY_STEP_MS + TAPE_MS + 40;

export function JoinStorm() {
  const [phase, setPhase] = useState<"boot" | "play" | "ready">("boot");
  const [tapes, setTapes] = useState<Tape[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce) {
      setPhase("ready");
      return;
    }

    setTapes(buildTapes());
    setPhase("play");
    document.body.style.overflow = "hidden";

    const doneAt = window.setTimeout(() => {
      document.body.style.overflow = "";
      setPhase("ready");
    }, TOTAL_MS);

    return () => {
      window.clearTimeout(doneAt);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      {phase === "play" && (
        <div className="join-storm" aria-hidden>
          {tapes.map((tape) => {
            const style: CSSProperties & Record<`--${string}`, string> = {
              "--top": tape.top,
              "--left": tape.left,
              "--rot": `${tape.rot}deg`,
              "--thick": `${tape.thick}px`,
              "--delay": `${tape.delay}ms`,
              "--origin": tape.origin,
              "--yank": String(tape.yank),
              "--z": String(tape.z),
            };

            return (
              <div key={tape.id} className="join-storm-tape" style={style}>
                <div
                  className={cn(
                    "join-storm-tape-band",
                    tape.variant === "stripe" && "is-stripe",
                    tape.variant === "invert" && "is-invert",
                  )}
                >
                  {tape.variant !== "stripe" && (
                    <span className="join-storm-tape-copy">{TAPE_COPY}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {phase === "ready" && <JoinFab />}
    </>
  );
}
