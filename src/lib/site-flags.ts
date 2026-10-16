export type SiteFlagsPayload = {
  ready: boolean;
  joinFab: boolean;
  updatedAt: string;
};

export function getSiteFlagsEndpoint(): string {
  if (typeof window === "undefined") return "https://chumei.org/api/site-flags/";
  const host = window.location.hostname;
  if (host === "chumei.org" || host.endsWith(".pages.dev")) {
    return "/api/site-flags/";
  }
  return "https://chumei.org/api/site-flags/";
}

/** Admin cookie is same-origin only — use https://chumei.org/manage/ */
export function getSiteFlagsAdminEndpoint(): string {
  return "/api/site-flags/admin/";
}
