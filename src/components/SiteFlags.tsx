"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { siteConfig } from "@/data/site";
import { getSiteFlagsEndpoint, type SiteFlagsPayload } from "@/lib/site-flags";

type SiteFlagsContextValue = {
  ready: boolean;
  joinFab: boolean;
  joinTape: boolean;
  joinSpin: boolean;
};

const SiteFlagsContext = createContext<SiteFlagsContextValue>({
  ready: false,
  joinFab: false,
  joinTape: false,
  joinSpin: false,
});

function flagOn(value: unknown) {
  return value !== false;
}

export function SiteFlagsProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [joinFab, setJoinFab] = useState(false);
  const [joinTape, setJoinTape] = useState(false);
  const [joinSpin, setJoinSpin] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(getSiteFlagsEndpoint(), {
          cache: "no-cache",
          headers: { Accept: "application/json" },
        });
        if (!alive) return;
        if (!res.ok) {
          setJoinFab(true);
          setJoinTape(true);
          setJoinSpin(true);
          return;
        }
        const data = (await res.json()) as Partial<SiteFlagsPayload>;
        setJoinFab(flagOn(data.joinFab));
        setJoinTape(flagOn(data.joinTape));
        setJoinSpin(flagOn(data.joinSpin));
      } catch {
        if (alive) {
          setJoinFab(true);
          setJoinTape(true);
          setJoinSpin(true);
        }
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <SiteFlagsContext.Provider value={{ ready, joinFab, joinTape, joinSpin }}>
      {children}
    </SiteFlagsContext.Provider>
  );
}

export function useSiteFlags() {
  return useContext(SiteFlagsContext);
}

export function JoinEntryLink({
  className,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { ready, joinFab } = useSiteFlags();
  if (!ready || !joinFab) return null;
  return (
    <a
      href={siteConfig.joinFormUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}
