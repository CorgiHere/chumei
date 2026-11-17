import {
  isDemoEntry,
  json,
  normalizePhone,
  normalizePlayerId,
  phonesFromContact,
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
  const phone = normalizePhone(new URL(context.request.url).searchParams.get("phone") ?? "");
  if (phone.length < 9) {
    return json(context.request, { error: "missing_phone" }, 400, {
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
  const matches = roster.filter((row) => phonesFromContact(row.contact).includes(phone));
  if (matches.length === 0) {
    return json(context.request, { error: "not_found" }, 404, {
      "Cache-Control": "no-store",
    });
  }

  const live = board.entries.filter((entry) => !isDemoEntry(entry));
  const rankedHits = matches.flatMap((registrant) => {
    const hit = rank(live, registrant.gender).find(
      (row) => normalizePlayerId(row.id) === normalizePlayerId(registrant.id),
    );
    return hit && hit.score >= 1 ? [{ registrant, hit }] : [];
  });
  rankedHits.sort((a, b) => b.hit.score - a.hit.score);
  const picked = rankedHits[0];
  if (!picked) {
    return json(context.request, { error: "no_score" }, 404, {
      "Cache-Control": "no-store",
    });
  }

  const { registrant, hit } = picked;
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
