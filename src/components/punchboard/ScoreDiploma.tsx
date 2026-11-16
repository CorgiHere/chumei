"use client";

import { useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/data/site";
import {
  copyPng,
  diplomaFileName,
  downloadBlob,
  renderDiplomaBlob,
} from "@/lib/diploma-image";
import { punchSchoolDisplay, type RankedPunchEntry } from "@/lib/punchboard";
import { cn, withBasePath } from "@/lib/utils";

const SHARE_PAGE = `${siteConfig.siteUrl}/punchboard/`;

type ShareApp = "system" | "messenger" | "facebook" | "line" | "threads" | "instagram";

export function ScoreDiploma({
  entry,
  arcadeFamily,
  fusion,
  fusionFamily,
  onClose,
}: {
  entry: RankedPunchEntry;
  arcadeFamily: string;
  fusion: string;
  fusionFamily: string;
  onClose: () => void;
}) {
  const [src, setSrc] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [note, setNote] = useState("");
  const fileName = diplomaFileName(entry.id, String(entry.score));
  const shareText = useMemo(() => {
    const place =
      entry.rank >= 1 && entry.rank <= 10 ? `第 ${entry.rank} 名` : "歷史最高";
    return `${entry.name} 在竹梅賽拳擊機打出 ${entry.score} 分（${place}）`;
  }, [entry.name, entry.rank, entry.score]);
  const canSystemShare = Boolean(
    blob && typeof navigator !== "undefined" && typeof navigator.share === "function",
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (shareOpen) setShareOpen(false);
        else onClose();
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose, shareOpen]);

  useEffect(() => {
    let alive = true;
    const schoolLine = entry.department.trim()
      ? `${punchSchoolDisplay(entry)} | ${entry.department.trim()}`
      : punchSchoolDisplay(entry);
    const hitTime = formatHitTime(entry.updatedAt);
    void renderDiplomaBlob({
      bgSrc: withBasePath("/images/punchboard/diploma-bg.png"),
      score: entry.score.toLocaleString("en-US"),
      rank: entry.rank >= 1 && entry.rank <= 10 ? `#${entry.rank}` : "#?",
      highest: !(entry.rank >= 1 && entry.rank <= 10),
      player: hitTime ? `${entry.name} | ${hitTime}` : entry.name,
      school: schoolLine,
      group: entry.gender === "male" ? "男生組" : "女生組",
      arcadeFamily,
      fusionFamily,
    })
      .then((next) => {
        if (!alive) return;
        setBlob(next);
        setSrc(URL.createObjectURL(next));
      })
      .catch(() => {
        if (alive) setError("獎狀圖產生失敗，請再試一次。");
      });
    return () => {
      alive = false;
    };
  }, [arcadeFamily, entry, fusionFamily]);

  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [src]);

  function save() {
    if (!blob) return;
    downloadBlob(blob, fileName);
    setNote("已下載獎狀圖。");
  }

  async function share(app: ShareApp) {
    if (!blob) return;
    if (app === "system") {
      try {
        const file = new File([blob], fileName, { type: "image/png" });
        const withFile: ShareData = { files: [file], title: "竹梅賽拳擊機獎狀", text: shareText };
        if (navigator.canShare?.(withFile)) {
          await navigator.share(withFile);
          setShareOpen(false);
          return;
        }
        await navigator.share({ title: "竹梅賽拳擊機獎狀", text: `${shareText}\n${SHARE_PAGE}` });
        setShareOpen(false);
        return;
      } catch (err) {
        if ((err as { name?: string }).name === "AbortError") return;
      }
    }
    try {
      await copyPng(blob);
      setNote("獎狀圖已複製，可貼到限時動態或聊天室。");
    } catch {
      setNote("請先下載獎狀圖再貼上。");
    }
    window.open(shareHref(app, shareText), "_blank", "noopener,noreferrer");
    setShareOpen(false);
  }

  return (
    <div
      className={cn(
        fusion,
        "fixed inset-0 z-200 flex items-center justify-center bg-black/92 p-1",
      )}
      role="dialog"
      aria-modal="true"
      aria-label={`${entry.name}的獎狀`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="關閉"
        className="absolute right-3 top-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center border-4 border-white/50 bg-black text-[32px] leading-none text-white"
      >
        ×
      </button>
      <div
        className="relative max-h-[98dvh] w-auto max-w-[min(801px,98vw)]"
        onClick={(event) => event.stopPropagation()}
      >
        {src ? (
          <div className="relative mx-auto w-fit">
            <img
              src={src}
              alt={`${entry.name}的獎狀`}
              className="block h-auto max-h-[90dvh] w-auto max-w-[min(801px,98vw)]"
              draggable={false}
            />
            <button
              type="button"
              className="punch-diploma-hit punch-diploma-hit--save"
              aria-label="下載獎狀圖"
              onClick={save}
            />
            <button
              type="button"
              className="punch-diploma-hit punch-diploma-hit--logo"
              aria-label="分享獎狀"
              onClick={() => setShareOpen(true)}
            />
            {shareOpen ? (
              <div className="punch-diploma-share">
                <p className="punch-diploma-share__title">分享到</p>
                <div className="punch-diploma-share__grid">
                  {canSystemShare ? (
                    <button type="button" onClick={() => void share("system")}>
                      本機 App
                    </button>
                  ) : null}
                  <button type="button" onClick={() => void share("messenger")}>
                    Messenger
                  </button>
                  <button type="button" onClick={() => void share("facebook")}>
                    Facebook
                  </button>
                  <button type="button" onClick={() => void share("line")}>
                    LINE
                  </button>
                  <button type="button" onClick={() => void share("threads")}>
                    Threads
                  </button>
                  <button type="button" onClick={() => void share("instagram")}>
                    Instagram
                  </button>
                </div>
                <button
                  type="button"
                  className="punch-diploma-share__close"
                  onClick={() => setShareOpen(false)}
                >
                  取消
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="px-6 py-16 text-center text-[16px] text-white">
            {error || "獎狀產生中"}
          </p>
        )}
        <p className="mt-2 text-center text-[13px] leading-snug text-[#8aa4c7]">
          點獎狀下載圖片。點上方 Whoscall × Chu Mei LOGO 分享。
        </p>
        {note ? <p className="mt-1 text-center text-[13px] text-[#ffd54a]">{note}</p> : null}
      </div>
    </div>
  );
}

function shareHref(app: ShareApp, text: string) {
  const encodedPage = encodeURIComponent(SHARE_PAGE);
  const encodedText = encodeURIComponent(`${text}\n${SHARE_PAGE}`);
  if (app === "facebook") {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodedPage}`;
  }
  if (app === "messenger") {
    return `https://www.facebook.com/dialog/send?app_id=966242223397117&link=${encodedPage}&redirect_uri=${encodedPage}`;
  }
  if (app === "line") {
    return `https://social-plugins.line.me/lineit/share?url=${encodedPage}`;
  }
  if (app === "threads") {
    return `https://www.threads.net/intent/post?text=${encodedText}`;
  }
  return "https://www.instagram.com/";
}

function formatHitTime(iso: string) {
  const at = new Date(iso);
  if (!Number.isFinite(at.getTime()) || !iso) return "";
  const wall = at.toLocaleString("sv-SE", { timeZone: "Asia/Taipei" });
  const match = wall.match(/\s(\d{2}):(\d{2})(?::\d{2})?$/);
  return match ? `${match[1]}:${match[2]}` : "";
}
