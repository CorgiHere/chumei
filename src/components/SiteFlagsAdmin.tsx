"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSiteFlagsAdminEndpoint } from "@/lib/site-flags";

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

export function SiteFlagsAdmin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [joinFab, setJoinFab] = useState(true);
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
        const data = (await res.json()) as { joinFab?: boolean };
        setJoinFab(data.joinFab !== false);
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
      const data = (await next.json()) as { joinFab?: boolean };
      setJoinFab(data.joinFab !== false);
    }
  }

  async function logout() {
    await adminFetch({ method: "POST", body: JSON.stringify({ action: "logout" }) });
    setAuthed(false);
  }

  async function save(next: boolean) {
    setError("");
    setNotice("");
    setSaving(true);
    setJoinFab(next);
    try {
      const res = await adminFetch({
        method: "POST",
        body: JSON.stringify({ action: "save", joinFab: next }),
      });
      if (res.status === 401) {
        setAuthed(false);
        setError("登入已過期，請再登入一次。");
        return;
      }
      if (!res.ok) {
        setJoinFab(!next);
        setError("儲存失敗，請再試一次。");
        return;
      }
      setNotice(next ? "已顯示加入竹梅按鈕。" : "已隱藏加入竹梅按鈕。");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">檢查登入狀態…</p>;
  }

  if (!authed) {
    return (
      <form onSubmit={login} className="card max-w-md space-y-4 p-6">
        <p className="text-sm text-muted">
          控制全站右下角「加入竹梅」按鈕，以及頁尾／關於頁的加入連結。密碼與拳擊機後台相同。
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
        <h2 className="text-xl font-black">加入竹梅按鈕</h2>
        <button type="button" className="btn-dark-outline text-sm" onClick={logout}>
          登出
        </button>
      </div>
      <p className="text-sm text-muted">
        關閉後，訪客看不到右下角黃色按鈕，頁尾「加入我們」與關於頁的加入圖示也會一起隱藏。表單連結本身還在，只是不主動露出。
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={saving || joinFab}
          className={joinFab ? "btn-primary" : "btn-dark-outline"}
          onClick={() => void save(true)}
        >
          顯示按鈕
        </button>
        <button
          type="button"
          disabled={saving || !joinFab}
          className={!joinFab ? "btn-primary" : "btn-dark-outline"}
          onClick={() => void save(false)}
        >
          隱藏按鈕
        </button>
      </div>
      <p className="font-mono-ui text-[12px] tracking-widest text-brand-yellow">
        現在：{joinFab ? "顯示中" : "已隱藏"}
      </p>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {notice ? <p className="text-sm text-brand-yellow">{notice}</p> : null}
    </div>
  );
}
