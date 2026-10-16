"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSiteFlagsAdminEndpoint, type SiteFlagsPayload } from "@/lib/site-flags";

type FlagKey = "joinTape" | "joinSpin" | "joinFab";

const FLAG_ROWS: Array<{ key: FlagKey; title: string; hint: string }> = [
  {
    key: "joinTape",
    title: "封鎖條",
    hint: "進站時整頁拉過的黃色封鎖線動畫。",
  },
  {
    key: "joinSpin",
    title: "按鈕旋轉",
    hint: "右下角按鈕持續晃動、翻轉。關閉後按鈕靜止。",
  },
  {
    key: "joinFab",
    title: "按鈕顯示",
    hint: "右下角「加入竹梅」、頁尾「加入我們」、關於頁加入圖示。",
  },
];

async function adminFetch(init?: RequestInit) {
  return fetch(getSiteFlagsAdminEndpoint(), {
    credentials: "include",
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

function fromPayload(data: Partial<SiteFlagsPayload>) {
  return {
    joinFab: data.joinFab !== false,
    joinTape: data.joinTape !== false,
    joinSpin: data.joinSpin !== false,
  };
}

export function SiteFlagsAdmin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<FlagKey | null>(null);
  const [flags, setFlags] = useState(fromPayload({}));
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

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
        const data = (await res.json()) as Partial<SiteFlagsPayload>;
        setFlags(fromPayload(data));
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
      const data = (await next.json()) as Partial<SiteFlagsPayload>;
      setFlags(fromPayload(data));
    }
  }

  async function logout() {
    await adminFetch({ method: "POST", body: JSON.stringify({ action: "logout" }) });
    setAuthed(false);
  }

  async function save(key: FlagKey, value: boolean) {
    const previous = flags;
    const next = { ...flags, [key]: value };
    setError("");
    setNotice("");
    setSaving(key);
    setFlags(next);
    try {
      const res = await adminFetch({
        method: "POST",
        body: JSON.stringify({ action: "save", ...next }),
      });
      if (res.status === 401) {
        setAuthed(false);
        setError("登入已過期，請再登入一次。");
        setFlags(previous);
        return;
      }
      if (!res.ok) {
        setFlags(previous);
        setError("儲存失敗，請再試一次。");
        return;
      }
      const row = FLAG_ROWS.find((item) => item.key === key);
      setNotice(`已${value ? "開啟" : "關閉"}「${row?.title ?? key}」。`);
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">檢查登入狀態…</p>;
  }

  if (!authed) {
    return (
      <form onSubmit={login} className="card max-w-md space-y-4 p-6">
        <p className="text-sm text-muted">
          分開控制封鎖條動畫、按鈕旋轉、加入竹梅按鈕是否顯示。密碼與拳擊機後台相同。
        </p>
        <label className="block text-sm font-bold" htmlFor="manage-pass">
          後台密碼
        </label>
        <input
          id="manage-pass"
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
    <div className="card max-w-xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-black">加入竹梅效果</h2>
        <button type="button" className="btn-dark-outline text-sm" onClick={logout}>
          登出
        </button>
      </div>
      <p className="text-sm text-muted">三項可分開開關。改完後重新整理前台即可看到。</p>
      <ul className="space-y-5">
        {FLAG_ROWS.map((row) => {
          const on = flags[row.key];
          return (
            <li key={row.key} className="border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
              <p className="text-lg font-black">{row.title}</p>
              <p className="mt-1 text-sm text-muted">{row.hint}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={saving !== null || on}
                  className={on ? "btn-primary" : "btn-dark-outline"}
                  onClick={() => void save(row.key, true)}
                >
                  開啟
                </button>
                <button
                  type="button"
                  disabled={saving !== null || !on}
                  className={!on ? "btn-primary" : "btn-dark-outline"}
                  onClick={() => void save(row.key, false)}
                >
                  關閉
                </button>
              </div>
              <p className="mt-2 font-mono-ui text-[12px] tracking-widest text-brand-yellow">
                現在：{on ? "開" : "關"}
              </p>
            </li>
          );
        })}
      </ul>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {notice ? <p className="text-sm text-brand-yellow">{notice}</p> : null}
    </div>
  );
}
