import {
  PUBLIC_FLAGS_CACHE_CONTROL,
  PUBLIC_FLAGS_CACHE_KEY,
  flagsJson,
  publicFlagsPayload,
  readFlags,
  type FlagsEnv,
} from "./_shared";

type PagesContext = {
  request: Request;
  env: FlagsEnv;
  waitUntil?: (promise: Promise<unknown>) => void;
};

const edgeHeaders = {
  "Cache-Control": PUBLIC_FLAGS_CACHE_CONTROL,
  "CDN-Cache-Control": "public, max-age=10, stale-while-revalidate=5",
  "Access-Control-Allow-Origin": "*",
  Vary: "Accept",
};

export async function onRequestOptions(context: PagesContext) {
  return flagsJson(context.request, {});
}

export async function onRequestGet(context: PagesContext) {
  const cache = caches.default;
  const cacheKey = new Request(PUBLIC_FLAGS_CACHE_KEY, { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) {
    const headers = new Headers(cached.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    return new Response(cached.body, { status: cached.status, headers });
  }

  const { flags, ready } = await readFlags(context.env);
  const response = flagsJson(context.request, publicFlagsPayload(flags, ready), 200, {
    ...edgeHeaders,
    ...(ready ? {} : { "Cache-Control": "no-store" }),
  });
  if (ready) {
    const stored = response.clone();
    const headers = new Headers(stored.headers);
    headers.set("Cache-Control", "public, max-age=10");
    context.waitUntil?.(
      cache.put(cacheKey, new Response(stored.body, { status: stored.status, headers })),
    );
  }
  return response;
}
