import {
  PUBLIC_CACHE_CONTROL,
  PUBLIC_CACHE_KEY,
  PUBLIC_CDN_CACHE_CONTROL,
  json,
  publicPayload,
  seedBoardIfEmpty,
  type PunchEnv,
} from "./_shared";

type PagesContext = {
  request: Request;
  env: PunchEnv;
  waitUntil?: (promise: Promise<unknown>) => void;
};

const edgeHeaders = {
  "Cache-Control": PUBLIC_CACHE_CONTROL,
  "CDN-Cache-Control": PUBLIC_CDN_CACHE_CONTROL,
  "Cloudflare-CDN-Cache-Control": PUBLIC_CDN_CACHE_CONTROL,
  "Access-Control-Allow-Origin": "*",
  Vary: "Accept",
};

export async function onRequestOptions(context: PagesContext) {
  return json(context.request, {});
}

export async function onRequestGet(context: PagesContext) {
  const cache = caches.default;
  const cacheKey = new Request(PUBLIC_CACHE_KEY, { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) {
    const headers = new Headers(cached.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Cache-Control", PUBLIC_CACHE_CONTROL);
    return new Response(cached.body, { status: cached.status, headers });
  }

  const { board, ready } = await seedBoardIfEmpty(context.env);
  const payload = publicPayload(board, ready);
  const etag = `"${board.version}-${board.updatedAt}"`;
  if (context.request.headers.get("If-None-Match") === etag) {
    return new Response(null, {
      status: 304,
      headers: { ETag: etag, ...edgeHeaders },
    });
  }

  const response = json(context.request, payload, 200, {
    ETag: etag,
    ...edgeHeaders,
  });
  if (ready) {
    const stored = response.clone();
    const headers = new Headers(stored.headers);
    headers.set("Cache-Control", "public, max-age=5");
    context.waitUntil?.(
      cache.put(cacheKey, new Response(stored.body, { status: stored.status, headers })),
    );
  }
  return response;
}
