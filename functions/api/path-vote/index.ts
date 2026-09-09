type Counts = {
  qingjiao: number;
  jiaoqing: number;
};

type Choice = "qingjiao" | "jiaoqing";

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
const IP_CHOICE_PREFIX = "ipchoice-v3:";
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

function clientIp(request: Request) {
  return request.headers.get("CF-Connecting-IP") ?? "unknown";
}

function asChoice(value: string | null): Choice | null {
  return value === "qingjiao" || value === "jiaoqing" ? value : null;
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

async function readIpChoice(env: Env, ip: string): Promise<Choice | null> {
  if (!env.CHUMEI_VOTES) return null;
  return asChoice(await env.CHUMEI_VOTES.get(`${IP_CHOICE_PREFIX}${ip}`));
}

export async function onRequestOptions(context: PagesContext) {
  return json(context.request, {});
}

export async function onRequestGet(context: PagesContext) {
  const { counts, ready } = await readCounts(context.env);
  const you = ready ? await readIpChoice(context.env, clientIp(context.request)) : null;
  return json(context.request, {
    ...counts,
    ready,
    ...(you ? { you } : {}),
  });
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

  const choice = asChoice(payload.choice ?? null);
  const voter = payload.voter?.slice(0, 80);
  if (!choice) {
    return json(request, { error: "invalid_choice", ...counts, ready: true }, 400);
  }
  if (!voter) {
    return json(request, { error: "missing_voter", ...counts, ready: true }, 400);
  }

  const ip = clientIp(request);
  const ipChoiceKey = `${IP_CHOICE_PREFIX}${ip}`;
  const voterKey = `${VOTER_PREFIX}${voter}`;
  const previous = asChoice(await env.CHUMEI_VOTES.get(voterKey));
  const ipPrevious = await readIpChoice(env, ip);

  if (previous === choice) {
    await env.CHUMEI_VOTES.put(ipChoiceKey, choice);
    return json(request, {
      ...counts,
      ready: true,
      you: previous,
      alreadyVoted: true,
    });
  }

  // Same browser/device under a new voter id (other domain) — reuse IP vote, no double count.
  if (!previous && ipPrevious === choice) {
    await env.CHUMEI_VOTES.put(voterKey, choice);
    return json(request, {
      ...counts,
      ready: true,
      you: choice,
      alreadyVoted: true,
    });
  }

  const switchFrom = previous ?? ipPrevious;
  if (switchFrom && switchFrom !== choice) {
    counts[switchFrom] = Math.max(0, counts[switchFrom] - 1);
    counts[choice] += 1;
    await env.CHUMEI_VOTES.put(COUNTS_KEY, JSON.stringify(counts));
    await env.CHUMEI_VOTES.put(voterKey, choice);
    await env.CHUMEI_VOTES.put(ipChoiceKey, choice);
    return json(request, { ...counts, ready: true, you: choice });
  }

  const ipKey = `${IP_PREFIX}${ip}:${new Date().toISOString().slice(0, 10)}`;
  const ipCount = Number((await env.CHUMEI_VOTES.get(ipKey)) ?? "0");

  // Legacy: already voted from the other domain before IP choice was stored.
  if (ipCount >= 1) {
    await env.CHUMEI_VOTES.put(voterKey, choice);
    await env.CHUMEI_VOTES.put(ipChoiceKey, choice);
    return json(request, {
      ...counts,
      ready: true,
      you: choice,
      alreadyVoted: true,
    });
  }

  counts[choice] += 1;
  await env.CHUMEI_VOTES.put(COUNTS_KEY, JSON.stringify(counts));
  await env.CHUMEI_VOTES.put(voterKey, choice);
  await env.CHUMEI_VOTES.put(ipChoiceKey, choice);
  await env.CHUMEI_VOTES.put(ipKey, String(ipCount + 1));

  return json(request, { ...counts, ready: true, you: choice });
}
