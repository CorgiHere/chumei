import { corsOrigin, json, publicPayload, readBoard } from "./_shared";

type PagesContext = {
  request: Request;
  env: Parameters<typeof readBoard>[0];
};

export async function onRequestOptions(context: PagesContext) {
  return json(context.request, {});
}

export async function onRequestGet(context: PagesContext) {
  const { board, ready } = await readBoard(context.env);
  const etag = `"${board.version}-${board.updatedAt}"`;
  if (context.request.headers.get("If-None-Match") === etag) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: etag,
        Vary: "Origin",
        "Access-Control-Allow-Origin": corsOrigin(context.request),
        "Cache-Control": "public, max-age=2, s-maxage=2, stale-while-revalidate=8",
      },
    });
  }
  return json(context.request, publicPayload(board, ready), 200, {
    ETag: etag,
    "Cache-Control": ready
      ? "public, max-age=2, s-maxage=2, stale-while-revalidate=8"
      : "no-store",
  });
}
