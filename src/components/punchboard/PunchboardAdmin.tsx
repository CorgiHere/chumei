"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Press_Start_2P } from "next/font/google";
import localFont from "next/font/local";
import {
  getPunchboardAdminEndpoint,
  normalizePlayerId,
  PUNCH_GENDER_LABEL,
  punchSchoolDisplay,
  PUNCH_SCHOOL_LABEL,
  PUNCHBOARD_DEFAULT_END_AT,
  PUNCHBOARD_DEFAULT_NAME,
  uniqueByPerson,
  type PunchEntry,
  type PunchGender,
  type PunchNameMode,
  type PunchRegistrant,
  type PunchSchool,
} from "@/lib/punchboard";
import { cn, withBasePath } from "@/lib/utils";
import { ArcadeCabinet, PunchBrandLockup } from "./ArcadeCabinet";
import { useSchoolSides } from "../SchoolOrder";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const fusionPixel = localFont({
  src: "../../../public/fonts/fusion-pixel-12px-zh-tw.woff2",
  display: "swap",
});

type AdminState = {
  eventName: string;
  endAt: string;
  entries: PunchEntry[];
  roster: PunchRegistrant[];
};

const blankForm = {
  id: "",
  score: "",
  nameMode: "legal" as PunchNameMode,
};

const blankRegistrant = {
  id: "",
  legalName: "",
  nickname: "",
  nameMode: "legal" as PunchNameMode,
  school: "NTHU" as PunchSchool,
  schoolOther: "",
  department: "",
  gender: "male" as PunchGender,
  contact: "",
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
    roster: [],
  });
  const [form, setForm] = useState(blankForm);
  const [registrantForm, setRegistrantForm] = useState(blankRegistrant);
  const [rosterText, setRosterText] = useState("");
  const [contactId, setContactId] = useState("");
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
          roster: data.roster ?? [],
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
        e.id,
        e.name,
        e.legalName,
        e.nickname,
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

  const lookedUp = useMemo(() => {
    const id = normalizePlayerId(form.id);
    if (!id) return null;
    return board.roster.find((row) => row.id === id) ?? null;
  }, [board.roster, form.id]);

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
        roster: data.roster ?? [],
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
    const data = (await res.json()) as AdminState & { mailed?: string; error?: string };
    if (!res.ok) {
      if (data.error === "not_registered") {
        setError("這個 ID 還沒在報名名單裡，請先登錄報名資料。");
      } else if (data.error === "invalid_registrant") {
        setError("報名資料不完整。ID、本名、學校、性別都要填。");
      } else {
        setError("儲存失敗，請再試一次。");
      }
      return false;
    }
    setBoard({
      eventName: data.eventName,
      endAt: data.endAt,
      entries: data.entries ?? [],
      roster: data.roster ?? [],
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
            只有籌委會現場登錄成績。請先匯入報名名單，再用 ID 對成績。
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
              id: form.id,
              score: Number(form.score),
              nameMode: form.nameMode,
            },
          }).then((ok) => {
            if (ok) setForm(blankForm);
          });
        }}
      >
        <h2 className={cn(pressStart.className, "text-[12px] text-[#ffd54a]")}>SCORE</h2>
        <p className="text-[12px] text-white/70">
          先輸入現場發的 ID。對上報名名單後才能登錄分數。榜上顯示本名或暱稱由選手選。
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="選手 ID" htmlFor="p-id">
            <input
              id="p-id"
              required
              value={form.id}
              onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
              className={fieldClass}
              placeholder="例如 A017"
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
        </div>
        {form.id.trim() ? (
          lookedUp ? (
            <div className="border-2 border-[#2ee0d6]/50 bg-[#06102f] p-4 text-[13px] text-white">
              <p className="text-[#ffd54a]">已報名　ID {lookedUp.id}</p>
              <p className="mt-2">
                本名 {lookedUp.legalName}
                {lookedUp.nickname ? `　暱稱 ${lookedUp.nickname}` : ""}
              </p>
              <p className="mt-1 text-white/75">
                {punchSchoolDisplay(lookedUp)}
                {lookedUp.department ? `　${lookedUp.department}` : ""}
               　{lookedUp.gender === "male" ? "男生組" : "女生組"}
              </p>
            </div>
          ) : (
            <p className="text-[13px] text-[#ff6b6b]">這個 ID 還沒報名，不能登錄成績。</p>
          )
        ) : null}
        <fieldset className="space-y-2">
          <legend className="text-[12px]">榜上顯示</legend>
          <label className="mr-4 inline-flex items-center gap-2 text-[13px]">
            <input
              type="radio"
              name="name-mode"
              checked={form.nameMode === "legal"}
              onChange={() => setForm((f) => ({ ...f, nameMode: "legal" }))}
            />
            本名
            {lookedUp ? `（${lookedUp.legalName}）` : ""}
          </label>
          <label className="inline-flex items-center gap-2 text-[13px]">
            <input
              type="radio"
              name="name-mode"
              checked={form.nameMode === "nick"}
              onChange={() => setForm((f) => ({ ...f, nameMode: "nick" }))}
              disabled={!lookedUp?.nickname}
            />
            暱稱
            {lookedUp?.nickname ? `（${lookedUp.nickname}）` : "（這位沒填暱稱）"}
          </label>
        </fieldset>
        <div className="flex flex-wrap gap-3">
          <button type="submit" className={btnPrimary} disabled={!lookedUp}>
            登錄成績
          </button>
          <button type="button" className={btnGhost} onClick={() => setForm(blankForm)}>
            清空
          </button>
        </div>
      </form>

      <form
        className={panelClass}
        onSubmit={(e) => {
          e.preventDefault();
          void postAction({
            action: "upsertRegistrant",
            registrant: registrantForm,
          }).then((ok) => {
            if (ok) setRegistrantForm(blankRegistrant);
          });
        }}
      >
        <h2 className={cn(pressStart.className, "text-[12px] text-[#ffd54a]")}>ROSTER</h2>
        <p className="text-[12px] text-white/70">
          全報名。表單填完後，在這裡幫每個人編一個 ID。聯絡方式只給籌委會看，前三名點下去才會顯示。
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="ID" htmlFor="r-id">
            <input
              id="r-id"
              required
              value={registrantForm.id}
              onChange={(e) => setRegistrantForm((f) => ({ ...f, id: e.target.value }))}
              className={fieldClass}
            />
          </Field>
          <Field label="本名" htmlFor="r-legal">
            <input
              id="r-legal"
              required
              value={registrantForm.legalName}
              onChange={(e) => setRegistrantForm((f) => ({ ...f, legalName: e.target.value }))}
              className={fieldClass}
            />
          </Field>
          <Field label="暱稱（選填）" htmlFor="r-nick">
            <input
              id="r-nick"
              value={registrantForm.nickname}
              onChange={(e) => setRegistrantForm((f) => ({ ...f, nickname: e.target.value }))}
              className={fieldClass}
            />
          </Field>
          <Field label="聯絡方式" htmlFor="r-contact">
            <input
              id="r-contact"
              value={registrantForm.contact}
              onChange={(e) => setRegistrantForm((f) => ({ ...f, contact: e.target.value }))}
              className={fieldClass}
              placeholder="電話或信箱"
            />
          </Field>
          <Field label="學校" htmlFor="r-school">
            <select
              id="r-school"
              value={registrantForm.school}
              onChange={(e) => {
                const school = e.target.value as PunchSchool;
                setRegistrantForm((f) => ({
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
          {registrantForm.school === "OTHER" ? (
            <Field label="學校名稱" htmlFor="r-school-other">
              <input
                id="r-school-other"
                required
                value={registrantForm.schoolOther}
                onChange={(e) =>
                  setRegistrantForm((f) => ({ ...f, schoolOther: e.target.value }))
                }
                className={fieldClass}
              />
            </Field>
          ) : null}
          <Field label="系所" htmlFor="r-dept">
            <input
              id="r-dept"
              value={registrantForm.department}
              onChange={(e) => setRegistrantForm((f) => ({ ...f, department: e.target.value }))}
              className={fieldClass}
            />
          </Field>
          <Field label="性別榜" htmlFor="r-gender">
            <select
              id="r-gender"
              value={registrantForm.gender}
              onChange={(e) =>
                setRegistrantForm((f) => ({ ...f, gender: e.target.value as PunchGender }))
              }
              className={fieldClass}
            >
              <option value="male">男生組</option>
              <option value="female">女生組</option>
            </select>
          </Field>
        </div>
        <button type="submit" className={btnPrimary}>
          存進報名名單
        </button>
        <label className="block text-[12px]" htmlFor="roster-paste">
          一次貼上（每行：ID 本名 暱稱 學校 性別 系所 聯絡）
        </label>
        <textarea
          id="roster-paste"
          value={rosterText}
          onChange={(e) => setRosterText(e.target.value)}
          className={`${fieldClass} min-h-28 font-mono-ui text-[12px]`}
          placeholder={"A017\t王小明\t小明\t清大\t女\t工科系\t0912..."}
        />
        <button
          type="button"
          className={btnGhost}
          onClick={() => {
            const parsed = parseRosterPaste(rosterText);
            if (parsed.length === 0) {
              setError("貼上的名單讀不到任何一列。");
              return;
            }
            void postAction({
              action: "replaceRoster",
              roster: [...board.roster, ...parsed],
            }).then((ok) => {
              if (ok) {
                setRosterText("");
                setNotice(`已匯入 ${parsed.length} 筆報名。`);
              }
            });
          }}
        >
          匯入貼上的名單
        </button>
        <p className="text-[12px] text-white/55">目前報名 {board.roster.length} 人。</p>
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
            roster={board.roster}
            contactId={contactId}
            onToggleContact={setContactId}
            onEdit={(row) =>
              setForm({
                id: row.id,
                score: String(row.score),
                nameMode: row.nameMode === "nick" ? "nick" : "legal",
              })
            }
            onDelete={(row) => {
              if (window.confirm(`刪除 ${row.name} 的成績？`)) {
                void postAction({ action: "delete", id: row.id });
              }
            }}
          />
          <EntryTable
            title="女生組"
            rows={filteredByGender.female}
            roster={board.roster}
            contactId={contactId}
            onToggleContact={setContactId}
            onEdit={(row) =>
              setForm({
                id: row.id,
                score: String(row.score),
                nameMode: row.nameMode === "nick" ? "nick" : "legal",
              })
            }
            onDelete={(row) => {
              if (window.confirm(`刪除 ${row.name} 的成績？`)) {
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
        className="mx-auto mb-6 w-full max-w-lg object-contain"
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
  roster,
  contactId,
  onToggleContact,
  onEdit,
  onDelete,
}: {
  title: string;
  rows: PunchEntry[];
  roster: PunchRegistrant[];
  contactId: string;
  onToggleContact: (id: string) => void;
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
        <table className="w-full min-w-[560px] text-left text-[12px]">
          <thead className="bg-[#06102f] text-[#ffd54a]">
            <tr>
              <th className="px-3 py-3">名次</th>
              <th className="px-3 py-3">ID</th>
              <th className="px-3 py-3">分數</th>
              <th className="px-3 py-3">顯示名</th>
              <th className="px-3 py-3">校</th>
              <th className="px-3 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-white/45">
                  目前沒有成績。
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                const rank = index + 1;
                const registrant = roster.find((item) => item.id === normalizePlayerId(row.id));
                const showContact = contactId === row.id;
                return (
                  <tr key={row.id} className="border-t-2 border-white/10 hover:bg-[#2ee0d6]/15">
                    <td className="px-3 py-3">{rank}</td>
                    <td className="px-3 py-3">{row.id}</td>
                    <td className={cn(pressStart.className, "px-3 py-3 text-[12px]")}>
                      {row.score}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        className={cn(
                          "text-left",
                          rank <= 3 && "underline decoration-[#ffd54a] underline-offset-4",
                        )}
                        onClick={() => {
                          if (rank > 3) return;
                          onToggleContact(showContact ? "" : row.id);
                        }}
                      >
                        {row.name}
                      </button>
                      {rank <= 3 && showContact ? (
                        <p className="mt-1 text-[12px] text-[#ffd54a]">
                          {registrant?.contact?.trim() || "這位沒填聯絡方式"}
                        </p>
                      ) : rank <= 3 ? (
                        <p className="mt-1 text-[11px] text-white/45">點名字看聯絡方式</p>
                      ) : null}
                    </td>
                    <td className="px-3 py-3">
                      {row.school === "OTHER" ? (
                        <span className="text-white/85">
                          {(row.schoolOther ?? "").trim() || "其他"}
                        </span>
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
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className={`${actionBtn} border-2 border-[#ffd54a] text-[#ffd54a] hover:bg-[#ffd54a] hover:text-[#1a1400]`}
                          onClick={() => onEdit(row)}
                        >
                          改分數
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function parseRosterPaste(text: string): PunchRegistrant[] {
  const rows: PunchRegistrant[] = [];
  for (const line of text.split(/\r?\n/)) {
    const parts = line.split(/[\t,]/).map((part) => part.trim());
    if (parts.filter(Boolean).length < 4) continue;
    const id = parts[0] ?? "";
    const legalName = parts[1] ?? "";
    let nickname = "";
    let schoolRaw = "";
    let genderRaw = "";
    let department = "";
    let contact = "";
    if (parseSchoolToken(parts[2] ?? "") && parseGenderToken(parts[3] ?? "")) {
      schoolRaw = parts[2] ?? "";
      genderRaw = parts[3] ?? "";
      department = parts[4] ?? "";
      contact = parts[5] ?? "";
    } else {
      nickname = parts[2] ?? "";
      schoolRaw = parts[3] ?? "";
      genderRaw = parts[4] ?? "";
      department = parts[5] ?? "";
      contact = parts[6] ?? "";
    }
    const school = parseSchoolToken(schoolRaw);
    const gender = parseGenderToken(genderRaw);
    if (!id || !legalName || !school || !gender) continue;
    rows.push({
      id,
      legalName,
      nickname,
      nameMode: "legal",
      school: school.value,
      schoolOther: school.other,
      department,
      gender,
      contact,
    });
  }
  return rows;
}

function parseSchoolToken(value: string): { value: PunchSchool; other: string } | null {
  const token = value.trim();
  if (!token) return null;
  if (/清|NTHU/i.test(token)) return { value: "NTHU", other: "" };
  if (/交|NYCU|NCTU/i.test(token)) return { value: "NYCU", other: "" };
  if (/其他|OTHER/i.test(token)) return { value: "OTHER", other: "" };
  return { value: "OTHER", other: token.slice(0, 40) };
}

function parseGenderToken(value: string): PunchGender | null {
  const token = value.trim();
  if (/^女|female/i.test(token)) return "female";
  if (/^男|male/i.test(token)) return "male";
  return null;
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
