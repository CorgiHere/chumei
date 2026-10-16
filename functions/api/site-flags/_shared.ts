import { json } from "../punchboard/_shared";

export const FLAGS_KEY = "site-flags-v1";
export const PUBLIC_FLAGS_CACHE_KEY = "https://chumei.org/api/site-flags/public-v1";
export const PUBLIC_FLAGS_CACHE_CONTROL =
  "public, max-age=0, s-maxage=10, stale-while-revalidate=5";

export type SiteFlags = {
  joinFab: boolean;
  joinTape: boolean;
  joinSpin: boolean;
  joinFooter: boolean;
  joinAbout: boolean;
  updatedAt: string;
};

export type FlagsEnv = {
  CHUMEI_VOTES?: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
  PUNCHBOARD_ADMIN_SECRET?: string;
};

export function flagOn(value: unknown) {
  return value !== false;
}

export function defaultFlags(): SiteFlags {
  return {
    joinFab: true,
    joinTape: true,
    joinSpin: true,
    joinFooter: true,
    joinAbout: true,
    updatedAt: "",
  };
}

export function publicFlagsPayload(flags: SiteFlags, ready: boolean) {
  return {
    ready,
    joinFab: flags.joinFab,
    joinTape: flags.joinTape,
    joinSpin: flags.joinSpin,
    joinFooter: flags.joinFooter,
    joinAbout: flags.joinAbout,
    updatedAt: flags.updatedAt,
  };
}

export async function readFlags(env: FlagsEnv): Promise<{ flags: SiteFlags; ready: boolean }> {
  if (!env.CHUMEI_VOTES) return { flags: defaultFlags(), ready: false };
  const raw = await env.CHUMEI_VOTES.get(FLAGS_KEY);
  if (!raw) return { flags: defaultFlags(), ready: true };
  try {
    const parsed = JSON.parse(raw) as Partial<SiteFlags>;
    return {
      ready: true,
      flags: {
        joinFab: flagOn(parsed.joinFab),
        joinTape: flagOn(parsed.joinTape),
        joinSpin: flagOn(parsed.joinSpin),
        joinFooter: flagOn(parsed.joinFooter),
        joinAbout: flagOn(parsed.joinAbout),
        updatedAt: String(parsed.updatedAt || ""),
      },
    };
  } catch {
    return { flags: defaultFlags(), ready: true };
  }
}

export async function purgeFlagsCache() {
  try {
    await caches.default.delete(new Request(PUBLIC_FLAGS_CACHE_KEY, { method: "GET" }));
  } catch {
    /* ignore */
  }
}

export function flagsJson(
  request: Request,
  body: unknown,
  status = 200,
  extraHeaders?: Record<string, string>,
) {
  return json(request, body, status, extraHeaders);
}
