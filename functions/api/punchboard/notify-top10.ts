import { rank, type PunchBoard, type PunchEnv } from "./_shared";

const MAIL_FP_KEY = "punchboard-mail-fp-v1";
const DEFAULT_TO = "chu.mei.committee+punchboard@gmail.com";
const SUBJECT_PREFIX = "[即時榜]";
const SCHOOL = { NTHU: "清大", NYCU: "交大", OTHER: "其他" } as const;

export type MailResult = "sent" | "unchanged" | "skipped" | "failed";

export type MailAttempt = {
  mailed: MailResult;
  mailError?: string;
};

function top10(board: PunchBoard) {
  return {
    male: rank(board.entries, "male").slice(0, 10),
    female: rank(board.entries, "female").slice(0, 10),
  };
}

function fingerprint(board: PunchBoard) {
  const pack = (rows: ReturnType<typeof rank>) =>
    rows
      .map(
        (row) =>
          `${row.rank}\t${row.id}\t${row.name}\t${row.score}\t${row.school}\t${row.schoolOther}\t${row.department}`,
      )
      .join("\n");
  const top = top10(board);
  return `${pack(top.male)}\n--\n${pack(top.female)}`;
}

function formatList(title: string, rows: ReturnType<typeof rank>) {
  if (rows.length === 0) return `${title}\n（尚無成績）\n`;
  const lines = rows.map((row) => {
    const school =
      row.school === "OTHER"
        ? row.schoolOther.trim() || "其他"
        : (SCHOOL[row.school] ?? row.school);
    const dept = row.department ? ` ${row.department}` : "";
    return `${String(row.rank).padStart(2, "0")}. ${row.name}  ${row.score}  ${school}${dept}`;
  });
  return `${title}\n${lines.join("\n")}\n`;
}

function whenTaipei() {
  return new Date().toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    hour12: false,
  });
}

function mailBody(board: PunchBoard) {
  const top = top10(board);
  return [
    `${board.eventName} 即時榜前 10 名已更新`,
    `時間：${whenTaipei()}（台灣）`,
    `線上榜：https://chumei.org/punchboard/`,
    "",
    formatList("【男性】", top.male),
    formatList("【女性】", top.female),
    "此信由官網後台自動寄出。前 10 名沒有變動時不會重寄。",
  ].join("\n");
}

function fullBoardBody(board: PunchBoard) {
  return [
    `${board.eventName} 目前榜單`,
    `時間：${whenTaipei()}（台灣）`,
    `共 ${board.entries.length} 人`,
    `線上榜：https://chumei.org/punchboard/`,
    "",
    formatList("【男性】", rank(board.entries, "male")),
    formatList("【女性】", rank(board.entries, "female")),
    "此信由官網後台手動寄出。",
  ].join("\n");
}

export function parseMailTo(raw: unknown): string | null {
  const email = String(raw ?? "").trim().slice(0, 120);
  if (!email || email.includes("\n") || email.includes(",") || email.includes(" ")) {
    return null;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

async function readError(res: Response) {
  const text = await res.text();
  try {
    const parsed = JSON.parse(text) as { message?: string; error?: string };
    return String(parsed.message || parsed.error || text).slice(0, 240);
  } catch {
    return text.slice(0, 240);
  }
}

async function deliver(
  env: PunchEnv,
  to: string,
  subject: string,
  text: string,
): Promise<{ ok: boolean; error?: string }> {
  const webhook = env.PUNCHBOARD_MAIL_WEBHOOK;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, text }),
    });
    if (res.ok) return { ok: true };
    return { ok: false, error: await readError(res) };
  }
  const key = env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "missing_key" };
  const from = env.PUNCHBOARD_MAIL_FROM || "竹梅賽即時榜 <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      headers: {
        "List-Id": "chumei-punchboard <punchboard.chumei.org>",
      },
      tags: [{ name: "category", value: "punchboard-mail" }],
    }),
  });
  if (res.ok) return { ok: true };
  return { ok: false, error: await readError(res) };
}

export async function notifyTop10IfChanged(
  env: PunchEnv,
  board: PunchBoard,
): Promise<MailResult> {
  try {
    if (!env.RESEND_API_KEY && !env.PUNCHBOARD_MAIL_WEBHOOK) return "skipped";
    if (!env.CHUMEI_VOTES) return "skipped";
    const fp = fingerprint(board);
    const prev = await env.CHUMEI_VOTES.get(MAIL_FP_KEY);
    if (prev === fp) return "unchanged";
    const subject = `${SUBJECT_PREFIX} ${board.eventName} 前10名更新`;
    const to = env.PUNCHBOARD_MAIL_TO || DEFAULT_TO;
    const sent = await deliver(env, to, subject, mailBody(board));
    if (!sent.ok) return "failed";
    await env.CHUMEI_VOTES.put(MAIL_FP_KEY, fp);
    return "sent";
  } catch {
    return "failed";
  }
}

export async function sendCurrentBoard(
  env: PunchEnv,
  board: PunchBoard,
  to: string,
): Promise<MailAttempt> {
  try {
    if (!env.RESEND_API_KEY && !env.PUNCHBOARD_MAIL_WEBHOOK) {
      return { mailed: "skipped" };
    }
    const subject = `${SUBJECT_PREFIX} ${board.eventName} 目前榜單`;
    const sent = await deliver(env, to, subject, fullBoardBody(board));
    if (sent.ok) return { mailed: "sent" };
    return { mailed: "failed", mailError: sent.error };
  } catch {
    return { mailed: "failed", mailError: "network" };
  }
}
