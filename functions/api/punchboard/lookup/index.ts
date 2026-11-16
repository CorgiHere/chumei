import {
  findRegistrant,
  isDemoEntry,
  json,
  normalizePlayerId,
  punchDisplayName,
  rank,
  readBoard,
  readRoster,
  type PunchEnv,
} from "../_shared";

type PagesContext = {
  request: Request;
  env: PunchEnv;
};

export async function onRequestOptions(context: PagesContext) {
  return json(context.request, {});
}

export async function onRequestGet(context: PagesContext) {
  const id = normalizePlayerId(new URL(context.request.url).searchParams.get("id") ?? "");
  if (!id) {
    return json(context.request, { error: "missing_id" }, 400, {
      "Cache-Control": "no-store",
    });
  }

  const { board, ready } = await readBoard(context.env);
  if (!ready) {
    return json(context.request, { error: "not_ready" }, 503, {
      "Cache-Control": "no-store",
    });
  }

  const roster = await readRoster(context.env);
  const registrant = findRegistrant(roster, id);
  if (!registrant) {
    return json(context.request, { error: "not_found" }, 404, {
      "Cache-Control": "no-store",
    });
  }

  const live = board.entries.filter((entry) => !isDemoEntry(entry));
  const hit = rank(live, registrant.gender).find(
    (row) => normalizePlayerId(row.id) === id,
  );
  if (!hit || hit.score < 1) {
    return json(context.request, { error: "no_score" }, 404, {
      "Cache-Control": "no-store",
    });
  }

  return json(
    context.request,
    {
      ok: true,
      id: hit.id,
      name: punchDisplayName(hit) || punchDisplayName(registrant),
      score: hit.score,
      school: hit.school,
      schoolOther: hit.schoolOther ?? "",
      department: hit.department,
      gender: hit.gender,
      rank: hit.rank,
      updatedAt: hit.updatedAt,
      legalName: registrant.legalName,
      nickname: registrant.nickname,
      nameMode: hit.nameMode ?? registrant.nameMode,
    },
    200,
    { "Cache-Control": "no-store" },
  );
}
