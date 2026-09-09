type Counts = {
  qingjiao: number;
  jiaoqing: number;
};

type Env = {
  CHUMEI_VOTES?: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
};

type PagesContext = {
  request: Request;
  env: Env;
};

const COUNTS_KEY = "counts-v3";
const VOTER_PREFIX = "voter-v3:";
const IP_PREFIX = "ip-v3:";
const EMPTY: Counts = { qingjiao: 0, jiaoqing: 0 };

function corsOrigin(request: Request) {
  const origin = request.headers.get("Origin");
  if (!origin) return "https://chumei.org";
  try {
    const host = new URL(origin).hostname;
    if (
      host === "chumei.org" ||
      host === "xn--eyqvve1quev2be32g7sbba230jtip1rbz09du88b.xyz" ||
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".github.io") ||
      host.endsWith(".pages.dev")
    ) {
      return origin;
    }
  } catch {
    /* ignore */
  }
  return "https://chumei.org";
}

function json(request: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": corsOrigin(request),
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
    },
  });
}

async function readCounts(env: Env): Promise<{ counts: Counts; ready: boolean }> {
  if (!env.CHUMEI_VOTES) return { counts: { ...EMPTY }, ready: false };
  const raw = await env.CHUMEI_VOTES.get(COUNTS_KEY);
  if (!raw) return { counts: { ...EMPTY }, ready: true };
  try {
    const parsed = JSON.parse(raw) as Partial<Counts>;
    return {
      counts: {
        qingjiao: Number(parsed.qingjiao) || 0,
        jiaoqing: Number(parsed.jiaoqing) || 0,
      },
      ready: true,
    };
  } catch {
    return { counts: { ...EMPTY }, ready: true };
  }
}

export async function onRequestOptions(context: PagesContext) {
  return json(context.request, {});
}

export async function onRequestGet(context: PagesContext) {
  const { counts, ready } = await readCounts(context.env);
  return json(context.request, { ...counts, ready });
}

export async function onRequestPost(context: PagesContext) {
  const { request, env } = context;
  const { counts, ready } = await readCounts(env);
  if (!ready || !env.CHUMEI_VOTES) {
    return json(request, { ...counts, ready: false }, 503);
  }

  let payload: { choice?: string; voter?: string } = {};
  try {
    payload = (await request.json()) as { choice?: string; voter?: string };
  } catch {
    return json(request, { error: "invalid_json", ...counts, ready: true }, 400);
  }

  const choice = payload.choice;
  const voter = payload.voter?.slice(0, 80);
  if (choice !== "qingjiao" && choice !== "jiaoqing") {
    return json(request, { error: "invalid_choice", ...counts, ready: true }, 400);
  }
  if (!voter) {
    return json(request, { error: "missing_voter", ...counts, ready: true }, 400);
  }

  const voterKey = `${VOTER_PREFIX}${voter}`;
  const previous = await env.CHUMEI_VOTES.get(voterKey);
  if (previous === choice) {
    return json(request, {
      ...counts,
      ready: true,
      you: previous,
      alreadyVoted: true,
    });
  }

  if (previous === "qingjiao" || previous === "jiaoqing") {
    counts[previous] = Math.max(0, counts[previous] - 1);
    counts[choice] += 1;
    await env.CHUMEI_VOTES.put(COUNTS_KEY, JSON.stringify(counts));
    await env.CHUMEI_VOTES.put(voterKey, choice);
    return json(request, { ...counts, ready: true, you: choice });
  }

  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const ipKey = `${IP_PREFIX}${ip}:${new Date().toISOString().slice(0, 10)}`;
  const ipCount = Number((await env.CHUMEI_VOTES.get(ipKey)) ?? "0");
  if (ipCount >= 2) {
    return json(request, { error: "rate_limited", ...counts, ready: true }, 429);
  }

  counts[choice] += 1;
  await env.CHUMEI_VOTES.put(COUNTS_KEY, JSON.stringify(counts));
  await env.CHUMEI_VOTES.put(voterKey, choice);
  await env.CHUMEI_VOTES.put(ipKey, String(ipCount + 1));

  return json(request, { ...counts, ready: true, you: choice });
}
