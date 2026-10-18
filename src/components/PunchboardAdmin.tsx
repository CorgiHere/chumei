"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  getPunchboardAdminEndpoint,
  PUNCH_GENDER_LABEL,
  PUNCH_SCHOOL_LABEL,
  PUNCHBOARD_DEFAULT_END_AT,
  PUNCHBOARD_DEFAULT_NAME,
  type PunchEntry,
  type PunchGender,
  type PunchSchool,
} from "@/lib/punchboard";
import {
  downloadPunchboardSnapshot,
  formatBackupTime,
  latestPunchboardLocal,
  readPunchboardFile,
  rememberPunchboardLocal,
  type PunchLocalSnapshot,
} from "@/lib/punchboard-local";
import { useSchoolSides } from "./SchoolOrder";

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
  const [backup, setBackup] = useState<PunchLocalSnapshot | null>(null);
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
        applyBoard({
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
      [e.name, e.department, PUNCH_SCHOOL_LABEL[e.school], PUNCH_GENDER_LABEL[e.gender]]
        .join(" ")
        .toLowerCase()
        .includes(q);
    const sortRows = (gender: PunchGender) =>
      board.entries
        .filter((e) => e.gender === gender && match(e))
        .sort((a, b) => b.score - a.score);
    return { male: sortRows("male"), female: sortRows("female") };
  }, [board.entries, query]);

  useEffect(() => {
    if (authed) setBackup(latestPunchboardLocal());
  }, [authed]);

  function applyBoard(data: AdminState) {
    const next = {
      eventName: data.eventName,
      endAt: data.endAt,
      entries: data.entries ?? [],
    };
    setBoard(next);
    setBackup(rememberPunchboardLocal(next));
  }

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
      applyBoard({
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
    const data = (await res.json()) as AdminState;
    applyBoard({
      eventName: data.eventName,
      endAt: data.endAt,
      entries: data.entries ?? [],
    });
    setNotice("已更新。公開榜約十秒內會跟上。本機也已存檔。");
    return true;
  }

  async function restoreSnapshot(snapshot: PunchLocalSnapshot, label: string) {
    if (
      !window.confirm(
        `用${label}覆寫線上榜？目前 ${board.entries.length} 人會被改成備份的 ${snapshot.entries.length} 人。`,
      )
    ) {
      return;
    }
    const ok = await postAction({
      action: "replace",
      eventName: snapshot.eventName,
      endAt: snapshot.endAt,
      entries: snapshot.entries,
    });
    if (ok) setNotice(`已用${label}還原。公開榜約十秒內會跟上。`);
  }

  if (loading) {
    return <p className="text-sm text-muted">檢查登入狀態…</p>;
  }

  if (!authed) {
    return (
      <form onSubmit={login} className="card max-w-md space-y-4 p-6">
        <p className="text-sm text-muted">只有籌委會現場登錄成績。請用 Cloudflare 設定的後台密碼登入。</p>
        <label className="block text-sm font-bold" htmlFor="admin-pass">
          後台密碼
        </label>
        <input
          id="admin-pass"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-2 border-white/20 bg-ink px-3 py-3 text-chalk outline-none focus:border-brand-yellow"
        />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <button type="submit" className="btn-primary">
          進入後台
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <button type="button" className="btn-dark-outline text-sm" onClick={logout}>
          登出
        </button>
      </div>

      <div className="card space-y-3 p-6">
        <h2 className="text-xl font-black">本機即時存檔</h2>
        <p className="text-sm text-muted">
          每次登錄、修改、刪除都會寫進這台電腦的瀏覽器。線上榜被改壞或清空時，可用備份還原。建議現場電腦再按一次下載，另存一份 JSON。
        </p>
        <p className="font-mono-ui text-[12px] tracking-widest text-brand-yellow">
          {backup
            ? `最近存檔 ${formatBackupTime(backup.savedAt)} · ${backup.entries.length} 人`
            : "尚無本機存檔"}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-primary text-sm"
            disabled={!backup}
            onClick={() => backup && downloadPunchboardSnapshot(backup)}
          >
            下載 JSON
          </button>
          <button
            type="button"
            className="btn-dark-outline text-sm"
            disabled={!latestPunchboardLocal()}
            onClick={() => {
              const snap = latestPunchboardLocal();
              if (snap) void restoreSnapshot(snap, "本機備份");
            }}
          >
            還原本機備份
          </button>
          <label className="btn-dark-outline cursor-pointer text-sm">
            匯入 JSON
            <input
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                void readPunchboardFile(file)
                  .then((snap) => restoreSnapshot(snap, "匯入檔"))
                  .catch(() => setError("這個檔案不是有效的榜備份。"));
              }}
            />
          </label>
        </div>
      </div>

      <form
        className="card space-y-4 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void postAction({
            action: "saveMeta",
            eventName: board.eventName,
            endAt: board.endAt,
          });
        }}
      >
        <h2 className="text-xl font-black">活動設定</h2>
        <label className="block text-sm font-bold" htmlFor="event-name">
          活動名稱
        </label>
        <input
          id="event-name"
          value={board.eventName}
          onChange={(e) => setBoard((b) => ({ ...b, eventName: e.target.value }))}
          className="w-full border-2 border-white/20 bg-ink px-3 py-3 text-chalk outline-none focus:border-brand-yellow"
        />
        <label className="block text-sm font-bold" htmlFor="event-end">
          結束時間（倒數用）
        </label>
        <input
          id="event-end"
          type="datetime-local"
          value={toLocalInput(board.endAt)}
          onChange={(e) =>
            setBoard((b) => ({ ...b, endAt: fromLocalInput(e.target.value) }))
          }
          className="w-full border-2 border-white/20 bg-ink px-3 py-3 text-chalk outline-none focus:border-brand-yellow"
        />
        <button type="submit" className="btn-primary">
          儲存活動設定
        </button>
      </form>

      <form
        className="card space-y-4 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void postAction({
            action: "upsert",
            entry: {
              id: form.id || undefined,
              name: form.name,
              score: Number(form.score),
              school: form.school,
              department: form.department,
              gender: form.gender,
            },
          }).then((ok) => {
            if (ok) setForm(blankForm);
          });
        }}
      >
        <h2 className="text-xl font-black">{form.id ? "修改成績" : "新增成績"}</h2>
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
              onChange={(e) =>
                setForm((f) => ({ ...f, school: e.target.value as PunchSchool }))
              }
              className={fieldClass}
            >
              <option value={firstCampus.value} data-keep-order>
                {firstCampus.label}
              </option>
              <option value={secondCampus.value} data-keep-order>
                {secondCampus.label}
              </option>
              <option value="OTHER">其他</option>
            </select>
          </Field>
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
              <option value="male">男性</option>
              <option value="female">女性</option>
            </select>
          </Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-primary">
            {form.id ? "更新這筆" : "登錄成績"}
          </button>
          {form.id ? (
            <button type="button" className="btn-dark-outline" onClick={() => setForm(blankForm)}>
              取消編輯
            </button>
          ) : null}
        </div>
      </form>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {notice ? <p className="text-sm text-brand-yellow">{notice}</p> : null}

      <div>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-xl font-black">已登錄 {board.entries.length} 人</h2>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜尋"
            className="w-full max-w-xs border-2 border-white/20 bg-ink px-3 py-2 text-sm text-chalk outline-none focus:border-brand-yellow"
          />
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <EntryTable
            title="男性"
            rows={filteredByGender.male}
            onEdit={(row) =>
              setForm({
                id: row.id,
                name: row.name,
                score: String(row.score),
                school: row.school,
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
            title="女性"
            rows={filteredByGender.female}
            onEdit={(row) =>
              setForm({
                id: row.id,
                name: row.name,
                score: String(row.score),
                school: row.school,
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
  );
}

const fieldClass =
  "w-full border-2 border-white/20 bg-ink px-3 py-3 text-chalk outline-none focus:border-brand-yellow";

const actionBtn =
  "inline-flex min-h-11 items-center justify-center px-3 font-mono-ui text-xs font-bold tracking-widest";

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
      <h3 className="mb-3 border-b-2 border-brand-yellow pb-2 text-lg font-black">
        {title}
        <span className="ml-2 font-mono-ui text-[11px] font-normal tracking-widest text-muted">
          {rows.length} 人
        </span>
      </h3>
      <div className="overflow-x-auto border border-white/10">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-dark-gray font-mono-ui text-[11px] tracking-widest text-brand-yellow">
            <tr>
              <th className="px-3 py-3">分數</th>
              <th className="px-3 py-3">姓名</th>
              <th className="px-3 py-3">學校</th>
              <th className="px-3 py-3">系所</th>
              <th className="px-3 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-muted">
                  目前沒有成績。
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="font-num px-3 py-3 font-bold">{row.score}</td>
                  <td className="px-3 py-3 font-black">{row.name}</td>
                  <td className="px-3 py-3">{PUNCH_SCHOOL_LABEL[row.school]}</td>
                  <td className="px-3 py-3">{row.department}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={`${actionBtn} border-2 border-brand-yellow text-brand-yellow`}
                        onClick={() => onEdit(row)}
                      >
                        修改
                      </button>
                      <button
                        type="button"
                        className={`${actionBtn} border-2 border-white/35 text-chalk`}
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
      <label className="mb-1 block text-sm font-bold" htmlFor={htmlFor}>
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
