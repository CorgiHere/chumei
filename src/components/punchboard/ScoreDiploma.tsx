"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DownloadIcon,
  FacebookIcon,
  InstagramIcon,
  LineIcon,
  MessengerIcon,
  ShareIcon,
  ThreadsIcon,
} from "@/components/BrandIcons";
import {
  copyPng,
  diplomaFileName,
  downloadBlob,
  renderDiplomaBlob,
} from "@/lib/diploma-image";
import { punchSchoolDisplay, type RankedPunchEntry } from "@/lib/punchboard";
import { cn, withBasePath } from "@/lib/utils";

const SOCIALS = [
  { id: "messenger", label: "Messenger", Icon: MessengerIcon },
  { id: "facebook", label: "Facebook", Icon: FacebookIcon },
  { id: "line", label: "LINE", Icon: LineIcon },
  { id: "threads", label: "Threads", Icon: ThreadsIcon },
  { id: "instagram", label: "Instagram", Icon: InstagramIcon },
] as const;

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
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<"share" | "save" | null>(null);
  const fileName = diplomaFileName(entry.id, String(entry.score));
  const shareText = useMemo(() => {
    const place =
      entry.rank >= 1 && entry.rank <= 10 ? `第 ${entry.rank} 名` : "歷史最高";
    return `${entry.name} 在竹梅賽拳擊機打出 ${entry.score} 分！${place}｜Whoscall × 竹梅賽`;
  }, [entry.name, entry.rank, entry.score]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

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

  async function save() {
    if (!blob || busy) return;
    setBusy("save");
    try {
      const saved = await saveWithPicker(blob, fileName);
      if (saved === "abort") return;
      if (saved === "ok") {
        setNote("已儲存獎狀圖。");
        return;
      }
      downloadBlob(blob, fileName);
      setNote("已下載獎狀圖。");
    } finally {
      setBusy(null);
    }
  }

  async function sharePost() {
    if (!blob || busy) return;
    setBusy("share");
    try {
      const file = new File([blob], fileName, { type: "image/png" });
      const withFile: ShareData = {
        files: [file],
        title: shareText,
        text: shareText,
      };
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share(withFile);
        return;
      }
      await navigator.clipboard.writeText(shareText).catch(() => undefined);
      await copyPng(blob);
      setNote("已複製獎狀圖和貼文，直接貼上即可。");
    } catch (err) {
      if ((err as { name?: string }).name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(shareText);
        await copyPng(blob);
        setNote("已複製獎狀圖和貼文，直接貼上即可。");
      } catch {
        setNote("這個裝置暫時無法分享圖片。");
      }
    } finally {
      setBusy(null);
    }
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
          <img
            src={src}
            alt={`${entry.name}的獎狀`}
            className="mx-auto block h-auto max-h-[78dvh] w-auto max-w-[min(801px,98vw)]"
            draggable={false}
          />
        ) : (
          <p className="px-6 py-16 text-center text-[16px] text-white">
            {error || "獎狀產生中"}
          </p>
        )}
        <div className="punch-diploma-actions">
          <button
            type="button"
            className="punch-diploma-actions__share"
            disabled={!blob || busy !== null}
            onClick={() => void sharePost()}
            aria-label="分享"
          >
            <ShareIcon className="h-6 w-6" />
            <span>{busy === "share" ? "開啟中" : "分享"}</span>
          </button>
          <button
            type="button"
            className="punch-diploma-actions__save"
            disabled={!blob || busy !== null}
            onClick={() => void save()}
            aria-label="下載"
          >
            <DownloadIcon className="h-6 w-6" />
            <span>{busy === "save" ? "下載中" : "下載"}</span>
          </button>
        </div>
        <div className="punch-diploma-social">
          {SOCIALS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              disabled={!blob || busy !== null}
              onClick={() => void sharePost()}
              aria-label={`分享到 ${label}`}
              title={label}
            >
              <Icon className="h-6 w-6" />
            </button>
          ))}
        </div>
        {note ? <p className="mt-2 text-center text-[13px] text-[#ffd54a]">{note}</p> : null}
      </div>
    </div>
  );
}

async function saveWithPicker(blob: Blob, fileName: string) {
  const picker = window as Window & {
    showSaveFilePicker?: (options: {
      suggestedName: string;
      types: Array<{ description: string; accept: Record<string, string[]> }>;
    }) => Promise<{ createWritable: () => Promise<{ write: (data: Blob) => Promise<void>; close: () => Promise<void> }> }>;
  };
  if (typeof picker.showSaveFilePicker !== "function") return "skip";
  try {
    const handle = await picker.showSaveFilePicker({
      suggestedName: fileName,
      types: [{ description: "PNG", accept: { "image/png": [".png"] } }],
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return "ok";
  } catch (err) {
    if ((err as { name?: string }).name === "AbortError") return "abort";
    return "skip";
  }
}

function formatHitTime(iso: string) {
  const at = new Date(iso);
  if (!Number.isFinite(at.getTime()) || !iso) return "";
  const wall = at.toLocaleString("sv-SE", { timeZone: "Asia/Taipei" });
  const match = wall.match(/\s(\d{2}):(\d{2})(?::\d{2})?$/);
  return match ? `${match[1]}:${match[2]}` : "";
}
