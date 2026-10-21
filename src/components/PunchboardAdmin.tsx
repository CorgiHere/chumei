"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Press_Start_2P } from "next/font/google";
import localFont from "next/font/local";
import {
  getPunchboardAdminEndpoint,
  PUNCH_GENDER_LABEL,
  punchSchoolDisplay,
  PUNCH_SCHOOL_LABEL,
  PUNCHBOARD_DEFAULT_END_AT,
  PUNCHBOARD_DEFAULT_NAME,
  uniqueByPerson,
  type PunchEntry,
  type PunchGender,
  type PunchSchool,
} from "@/lib/punchboard";
import { cn, withBasePath } from "@/lib/utils";
import { ArcadeCabinet, PunchBrandLockup } from "./ArcadeCabinet";
import { useSchoolSides } from "./SchoolOrder";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const fusionPixel = localFont({
  src: "../../public/fonts/fusion-pixel-12px-zh-tw.woff2",
  display: "swap",
});

type AdminState = {
  eventName: string;
  endAt: string;
  entries: PunchEntry[];
};

const blankForm = {
  id: "",
  name: "",
  score: "",
  school: "NTHU" as PunchSchool,
  schoolOther: "",
  department: "",
  gender: "male" as PunchGender,
};

async function adminFetch(init?: RequestInit) {
  return fetch(getPunchboardAdminEndpoint(), {
    credentials: "include",
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

export function PunchboardAdmin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [board, setBoard] = useState<AdminState>({
    eventName: PUNCHBOARD_DEFAULT_NAME,
    endAt: PUNCHBOARD_DEFAULT_END_AT,
    entries: [],
  });
  const [form, setForm] = useState(blankForm);
  const [query, setQuery] = useState("");
  const [mailTo, setMailTo] = useState("chu.mei.committee+punchboard@gmail.com");
  const [mailing, setMailing] = useState(false);
  const [firstCampus, secondCampus] = useSchoolSides(
    { value: "NTHU" as PunchSchool, label: "清大" },
    { value: "NYCU" as PunchSchool, label: "交大" },
  );

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    (async () => {
      try {
        const res = await adminFetch({ signal: controller.signal });
        if (cancelled) return;
        if (res.status === 401) {
          setAuthed(false);
          return;
        }
        if (res.status === 503) {
          setError("後台密碼尚未在 Cloudflare 設定 PUNCHBOARD_ADMIN_SECRET。");
          return;
        }
        if (!res.ok) {
          setError("無法連到後台 API。請在 chumei.org 開啟此頁。");
          return;
        }
        const data = (await res.json()) as AdminState & { ok?: boolean };
        setBoard({
          eventName: data.eventName,
          endAt: data.endAt,
          entries: data.entries ?? [],
        });
        setAuthed(true);
      } catch {
        setError("無法連到後台 API。請在 chumei.org 開啟此頁。");
      } finally {
        window.clearTimeout(timeout);
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  const filteredByGender = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (e: PunchEntry) =>
      !q ||
      [
        e.name,
        e.department,
        e.schoolOther,
        PUNCH_SCHOOL_LABEL[e.school],
        punchSchoolDisplay(e),
        PUNCH_GENDER_LABEL[e.gender],
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    const sortRows = (gender: PunchGender) =>
      uniqueByPerson(board.entries)
        .filter((e) => e.gender === gender && match(e))
        .sort((a, b) => b.score - a.score);
    return { male: sortRows("male"), female: sortRows("female") };
  }, [board.entries, query]);

  async function login(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await adminFetch({
      method: "POST",
      body: JSON.stringify({ action: "login", password }),
    });
    if (!res.ok) {
      setError(res.status === 503 ? "後台尚未設定密碼。" : "密碼不對。");
      return;
    }
    setPassword("");
    setAuthed(true);
    const next = await adminFetch();
    if (next.ok) {
      const data = (await next.json()) as AdminState;
      setBoard({
        eventName: data.eventName,
        endAt: data.endAt,
        entries: data.entries ?? [],
      });
    }
  }

  async function logout() {
    await adminFetch({ method: "POST", body: JSON.stringify({ action: "logout" }) });
    setAuthed(false);
    setForm(blankForm);
  }

  async function postAction(body: unknown) {
    setError("");
    setNotice("");
    const res = await adminFetch({ method: "POST", body: JSON.stringify(body) });
    if (res.status === 401) {
      setAuthed(false);
      setError("登入已過期，請再登入一次。");
      return false;
    }
    if (!res.ok) {
      setError("儲存失敗，請再試一次。");
      return false;
    }
    const data = (await res.json()) as AdminState & { mailed?: string };
    setBoard({
      eventName: data.eventName,
      endAt: data.endAt,
      entries: data.entries ?? [],
    });
    if (data.mailed === "sent") {
      setNotice("已更新，並把前 10 名寄到 chu.mei.committee+punchboard@gmail.com。");
    } else if (data.mailed === "unchanged") {
      setNotice("已更新。前 10 名沒變，未重寄信。");
    } else if (data.mailed === "failed") {
      setError("成績已存，但寄信失敗。請檢查 Cloudflare 的 RESEND_API_KEY。");
    } else if (data.mailed === "skipped") {
      setNotice("已更新。尚未設定寄信，前 10 名不會寄到信箱。");
    } else {
      setNotice("已更新。公開榜約十秒內會跟上。");
    }
    return true;
  }

  async function sendBoardMail(e: FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setMailing(true);
    try {
      const res = await adminFetch({
        method: "POST",
        body: JSON.stringify({ action: "mail", to: mailTo }),
      });
      if (res.status === 401) {
        setAuthed(false);
        setError("登入已過期，請再登入一次。");
        return;
      }
      const data = (await res.json()) as {
        mailed?: string;
        mailedTo?: string;
        error?: string;
        mailError?: string;
      };
      if (data.error === "invalid_email" || res.status === 400) {
        setError("請填正確的信箱。");
        return;
      }
      if (data.mailed === "sent") {
        setNotice(`已把目前榜單寄到 ${data.mailedTo ?? mailTo}。請也看垃圾郵件。`);
        return;
      }
      if (data.mailed === "skipped") {
        setError("尚未設定 RESEND_API_KEY，無法寄信。");
        return;
      }
      const hint = data.mailError ? `（${data.mailError}）` : "";
      setError(
        `寄信失敗${hint}。要寄到籌委會信箱，請在 Resend 驗證網域，並在 Cloudflare 加 Secret PUNCHBOARD_MAIL_FROM（例如 竹梅賽即時榜 <board@mail.chumei.org>），再重新部署。測試可先改寄 Resend 註冊信箱。`,
      );
    } catch {
      setError("寄信失敗，請再試一次。");
    } finally {
      setMailing(false);
    }
  }

  if (loading) {
    return (
      <AdminFrame>
        <p className="text-[#ffd54a]">檢查登入狀態…</p>
      </AdminFrame>
    );
  }

  if (!authed) {
    return (
      <AdminFrame>
        <form onSubmit={login} className={panelClass}>
          <p className={cn(pressStart.className, "text-[10px] text-[#ffd54a]")}>ADMIN</p>
          <p className="text-[12px] text-white/70">
            只有籌委會現場登錄成績。請用 Cloudflare 設定的後台密碼登入。
          </p>
          <label className="block text-[12px]" htmlFor="admin-pass">
            後台密碼
          </label>
          <input
            id="admin-pass"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
          {error ? <p className="text-[12px] text-[#ff6b6b]">{error}</p> : null}
          <button type="submit" className={btnPrimary}>
            進入後台
          </button>
        </form>
      </AdminFrame>
    );
  }

  return (
    <AdminFrame>
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <button type="button" className={btnGhost} onClick={logout}>
          登出
        </button>
      </div>
      <p className="text-[12px] text-white/55">
        男生組或女生組前 10 名有變動時，會寄到 chu.mei.committee+punchboard@gmail.com。沒變就不會重寄。成績一定會先存，寄信失敗不影響榜單。
      </p>

      <form className={panelClass} onSubmit={sendBoardMail}>
        <h2 className={cn(pressStart.className, "text-[12px] text-[#ffd54a]")}>MAIL</h2>
        <p className="text-[12px] text-white/70">
          把此刻的男女排名寄到指定信箱，用來測試寄信。不會改榜。
        </p>
        <label className="block text-[12px]" htmlFor="mail-to">
          收件信箱
        </label>
        <input
          id="mail-to"
          type="email"
          required
          value={mailTo}
          onChange={(e) => setMailTo(e.target.value)}
          className={fieldClass}
        />
        <button type="submit" className={btnPrimary} disabled={mailing}>
          {mailing ? "寄送中…" : "寄出榜單"}
        </button>
        {error ? <p className="text-[12px] text-[#ff6b6b]">{error}</p> : null}
        {notice ? <p className="text-[12px] text-[#ffd54a]">{notice}</p> : null}
      </form>

      <form
        className={panelClass}
        onSubmit={(e) => {
          e.preventDefault();
          void postAction({
            action: "saveMeta",
            eventName: board.eventName,
            endAt: board.endAt,
          });
        }}
      >
        <h2 className={cn(pressStart.className, "text-[12px] text-[#ffd54a]")}>EVENT</h2>
        <label className="block text-[12px]" htmlFor="event-name">
          活動名稱
        </label>
        <input
          id="event-name"
          value={board.eventName}
          onChange={(e) => setBoard((b) => ({ ...b, eventName: e.target.value }))}
          className={fieldClass}
        />
        <label className="block text-[12px]" htmlFor="event-end">
          結束時間（倒數用）
        </label>
        <input
          id="event-end"
          type="datetime-local"
          value={toLocalInput(board.endAt)}
          onChange={(e) =>
            setBoard((b) => ({ ...b, endAt: fromLocalInput(e.target.value) }))
          }
          className={fieldClass}
        />
        <button type="submit" className={btnPrimary}>
          儲存活動設定
        </button>
      </form>

      <form
        className={panelClass}
        onSubmit={(e) => {
          e.preventDefault();
          void postAction({
            action: "upsert",
            entry: {
              id: form.id || undefined,
              name: form.name,
              score: Number(form.score),
              school: form.school,
              schoolOther: form.schoolOther,
              department: form.department,
              gender: form.gender,
            },
          }).then((ok) => {
            if (ok) setForm(blankForm);
          });
        }}
      >
        <h2 className={cn(pressStart.className, "text-[12px] text-[#ffd54a]")}>
          {form.id ? "EDIT" : "NEW"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="姓名" htmlFor="p-name">
            <input
              id="p-name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={fieldClass}
            />
          </Field>
          <Field label="分數" htmlFor="p-score">
            <input
              id="p-score"
              required
              inputMode="numeric"
              value={form.score}
              onChange={(e) => setForm((f) => ({ ...f, score: e.target.value }))}
              className={fieldClass}
            />
          </Field>
          <Field label="學校" htmlFor="p-school">
            <select
              id="p-school"
              value={form.school}
              onChange={(e) => {
                const school = e.target.value as PunchSchool;
                setForm((f) => ({
                  ...f,
                  school,
                  schoolOther: school === "OTHER" ? f.schoolOther : "",
                }));
              }}
              className={fieldClass}
            >
              <option value={firstCampus.value} data-keep-order>
                {firstCampus.label}
              </option>
              <option value={secondCampus.value} data-keep-order>
                {secondCampus.label}
              </option>
              <option value="OTHER">其他（自行輸入）</option>
            </select>
          </Field>
          {form.school === "OTHER" ? (
            <Field label="學校名稱" htmlFor="p-school-other">
              <input
                id="p-school-other"
                required
                value={form.schoolOther}
                placeholder="例如：台科大"
                onChange={(e) => setForm((f) => ({ ...f, schoolOther: e.target.value }))}
                className={fieldClass}
              />
            </Field>
          ) : null}
          <Field label="系所" htmlFor="p-dept">
            <input
              id="p-dept"
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              className={fieldClass}
            />
          </Field>
          <Field label="性別榜" htmlFor="p-gender">
            <select
              id="p-gender"
              value={form.gender}
              onChange={(e) =>
                setForm((f) => ({ ...f, gender: e.target.value as PunchGender }))
              }
              className={fieldClass}
            >
              <option value="male">男生組</option>
              <option value="female">女生組</option>
            </select>
          </Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="submit" className={btnPrimary}>
            {form.id ? "更新這筆" : "登錄成績"}
          </button>
          {form.id ? (
            <button type="button" className={btnGhost} onClick={() => setForm(blankForm)}>
              取消編輯
            </button>
          ) : null}
        </div>
      </form>

      {error ? <p className="text-[12px] text-[#ff6b6b]">{error}</p> : null}
      {notice ? <p className="text-[12px] text-[#ffd54a]">{notice}</p> : null}

      <div>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className={cn(pressStart.className, "text-[12px] text-[#ffd54a]")}>
            {board.entries.length} PLAYERS
          </h2>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜尋"
            className={`${fieldClass} max-w-xs py-2`}
          />
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <EntryTable
            title="男生組"
            rows={filteredByGender.male}
            onEdit={(row) =>
              setForm({
                id: row.id,
                name: row.name,
                score: String(row.score),
                school: row.school,
                schoolOther: row.schoolOther ?? "",
                department: row.department,
                gender: row.gender,
              })
            }
            onDelete={(row) => {
              if (window.confirm(`刪除 ${row.name}？`)) {
                void postAction({ action: "delete", id: row.id });
              }
            }}
          />
          <EntryTable
            title="女生組"
            rows={filteredByGender.female}
            onEdit={(row) =>
              setForm({
                id: row.id,
                name: row.name,
                score: String(row.score),
                school: row.school,
                schoolOther: row.schoolOther ?? "",
                department: row.department,
                gender: row.gender,
              })
            }
            onDelete={(row) => {
              if (window.confirm(`刪除 ${row.name}？`)) {
                void postAction({ action: "delete", id: row.id });
              }
            }}
          />
        </div>
      </div>
    </div>
    </AdminFrame>
  );
}

function AdminFrame({ children }: { children: React.ReactNode }) {
  return (
    <ArcadeCabinet
      className="max-w-[1520px]"
      innerClassName={cn(fusionPixel.className, "px-5 py-6 lg:px-10")}
    >
      <div className="mb-6">
        <PunchBrandLockup />
      </div>
      <img
        src={withBasePath("/images/activities/whoscall-openflat-banner.png")}
        alt="詐騙來電，Whoscall 開扁"
        className="mx-auto mb-6 max-w-md w-full"
        style={{ imageRendering: "pixelated" }}
      />
      {children}
    </ArcadeCabinet>
  );
}

const panelClass = "space-y-4 border-4 border-[#2ee0d6]/35 p-5";
const fieldClass =
  "w-full rounded-none border-2 border-white/25 bg-[#06102f] px-3 py-3 text-white outline-none focus:border-[#ffd54a]";
const btnPrimary =
  "cursor-pointer border-4 border-[#c9a000] bg-[#ffd000] px-4 py-3 text-[#1a1400] hover:bg-[#ffe34d] disabled:opacity-60";
const btnGhost =
  "cursor-pointer border-4 border-[#2ee0d6] px-4 py-3 text-[#9ff6f2] hover:bg-[#2ee0d6] hover:text-[#06203a]";
const actionBtn =
  "inline-flex min-h-11 cursor-pointer items-center justify-center px-3 text-[12px]";

function EntryTable({
  title,
  rows,
  onEdit,
  onDelete,
}: {
  title: string;
  rows: PunchEntry[];
  onEdit: (row: PunchEntry) => void;
  onDelete: (row: PunchEntry) => void;
}) {
  return (
    <section>
      <h3 className="mb-3 border-b-4 border-[#ffd54a] pb-2 text-[16px]">
        {title}
        <span className="ml-2 text-[12px] text-white/45">{rows.length} 人</span>
      </h3>
      <div className="overflow-x-auto border-4 border-white/15">
        <table className="w-full min-w-[520px] text-left text-[12px]">
          <thead className="bg-[#06102f] text-[#ffd54a]">
            <tr>
              <th className="px-3 py-3">分數</th>
              <th className="px-3 py-3">姓名</th>
              <th className="px-3 py-3">校</th>
              <th className="px-3 py-3">系所</th>
              <th className="px-3 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-white/45">
                  目前沒有成績。
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t-2 border-white/10 hover:bg-[#2ee0d6]/15">
                  <td className={cn(pressStart.className, "px-3 py-3 text-[12px]")}>{row.score}</td>
                  <td className="px-3 py-3">{row.name}</td>
                  <td className="px-3 py-3">
                    {row.school === "OTHER" ? (
                      <span className="text-white/85">{(row.schoolOther ?? "").trim() || "其他"}</span>
                    ) : (
                      <span
                        className={cn(
                          "inline-flex size-7 items-center justify-center text-white",
                          row.school === "NTHU" ? "bg-nthu" : "bg-nycu",
                        )}
                      >
                        {row.school === "NTHU" ? "清" : "交"}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">{row.department}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={`${actionBtn} border-2 border-[#ffd54a] text-[#ffd54a] hover:bg-[#ffd54a] hover:text-[#1a1400]`}
                        onClick={() => onEdit(row)}
                      >
                        修改
                      </button>
                      <button
                        type="button"
                        className={`${actionBtn} border-2 border-white/35 text-white hover:bg-white hover:text-[#07133f]`}
                        onClick={() => onDelete(row)}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-[12px]" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

function toLocalInput(iso: string) {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value: string) {
  if (!value) return PUNCHBOARD_DEFAULT_END_AT;
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return PUNCHBOARD_DEFAULT_END_AT;
  return d.toISOString();
}
