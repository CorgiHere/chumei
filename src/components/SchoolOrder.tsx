"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

export type SchoolOrder = "qingjiao" | "jiaoqing";

const STORAGE_KEY = "chumei-school-order";

type SchoolOrderContextValue = {
  order: SchoolOrder;
  setOrder: (order: SchoolOrder) => void;
  toggle: () => void;
};

const SchoolOrderContext = createContext<SchoolOrderContextValue | null>(null);

const ORDER_PAIRS: Array<[string, string]> = [
  ["國立清華大學 × 國立交通大學", "國立交通大學 × 國立清華大學"],
  ["國立清華大學、國立交通大學", "國立交通大學、國立清華大學"],
  ["國立清華大學與國立交通大學", "國立交通大學與國立清華大學"],
  ["國立清華大學／國立交通大學", "國立交通大學／國立清華大學"],
  ["清華大學與交通大學", "交通大學與清華大學"],
  ["清華大學、交通大學", "交通大學、清華大學"],
  ["清華大學／交通大學", "交通大學／清華大學"],
  ["清華大學 × 交通大學", "交通大學 × 清華大學"],
  ["清華大學 vs 交通大學", "交通大學 vs 清華大學"],
  ["清大 NTHU × 交大 NYCU", "交大 NYCU × 清大 NTHU"],
  ["清大／交大、NTHU／NYCU", "交大／清大、NYCU／NTHU"],
  ["清大／交大", "交大／清大"],
  ["清大 × 交大", "交大 × 清大"],
  ["清大 · 交大", "交大 · 清大"],
  ["清大、交大", "交大、清大"],
  ["清大與交大", "交大與清大"],
  ["清大交大", "交大清大"],
  ["清華與交通", "交通與清華"],
  ["NTHU × NYCU", "NYCU × NTHU"],
  ["NTHU／NYCU", "NYCU／NTHU"],
];

function toJiaoqing(text: string) {
  let next = text;
  for (const [from, to] of ORDER_PAIRS) {
    next = next.replaceAll(from, to);
  }
  next = next.replace(
    /清大(\s*)(\d+|—)(\s*[：:]\s*)(\d+|—)(\s*)交大/g,
    "交大$1$4$3$2$5清大",
  );
  return next.replaceAll("清交／交清", "交清／清交").replaceAll("清交", "交清");
}

function applySchoolOrder(order: SchoolOrder) {
  const root = document.body;
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") {
        return NodeFilter.FILTER_REJECT;
      }
      if (parent.closest("[data-keep-order]")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  for (const node of nodes) {
    const original =
      (node as Text & { __chumeiOriginal?: string }).__chumeiOriginal ??
      node.textContent ??
      "";
    (node as Text & { __chumeiOriginal?: string }).__chumeiOriginal = original;
    node.textContent =
      order === "jiaoqing" ? toJiaoqing(original) : original;
  }
}

export function SchoolOrderProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [order, setOrderState] = useState<SchoolOrder>("qingjiao");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "jiaoqing" || saved === "qingjiao") setOrderState(saved);
  }, []);

  const setOrder = useCallback((next: SchoolOrder) => {
    setOrderState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggle = useCallback(() => {
    setOrder(order === "qingjiao" ? "jiaoqing" : "qingjiao");
  }, [order, setOrder]);

  useEffect(() => {
    applySchoolOrder(order);
    const observer = new MutationObserver(() => {
      applySchoolOrder(order);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [order, pathname]);

  const value = useMemo(
    () => ({ order, setOrder, toggle }),
    [order, setOrder, toggle],
  );

  return (
    <SchoolOrderContext.Provider value={value}>
      {children}
    </SchoolOrderContext.Provider>
  );
}

export function useSchoolOrder() {
  const ctx = useContext(SchoolOrderContext);
  if (!ctx) {
    throw new Error("useSchoolOrder must be used within SchoolOrderProvider");
  }
  return ctx;
}

export function useSchoolSides<T>(nthu: T, nycu: T): [T, T] {
  const { order } = useSchoolOrder();
  return order === "jiaoqing" ? [nycu, nthu] : [nthu, nycu];
}

export function SchoolPair({
  nthu,
  nycu,
  between,
  className,
  wrap = true,
}: {
  nthu: ReactNode;
  nycu: ReactNode;
  between?: ReactNode;
  className?: string;
  wrap?: boolean;
}) {
  const [first, second] = useSchoolSides(nthu, nycu);
  if (!wrap) {
    return (
      <>
        {first}
        {between}
        {second}
      </>
    );
  }
  return (
    <span className={className} data-keep-order>
      {first}
      {between}
      {second}
    </span>
  );
}

export function SchoolScoreBar({
  nthuScore,
  nycuScore,
}: {
  nthuScore: number;
  nycuScore: number;
}) {
  const { order } = useSchoolOrder();
  const nycuFirst = order === "jiaoqing";
  const total = nthuScore + nycuScore || 1;
  const nthuPct = Math.round((nthuScore / total) * 100);
  const leftPct = nycuFirst ? 100 - nthuPct : nthuPct;
  return (
    <>
      <div className="mt-5 h-3 overflow-hidden border-2 border-white/20">
        <div
          className={nycuFirst ? "h-full bg-nycu" : "h-full bg-nthu"}
          style={{ width: `${leftPct}%` }}
          data-keep-order
        />
      </div>
      <div className="mt-2 flex justify-between text-xs font-bold">
        <SchoolPair
          className="flex w-full justify-between"
          nthu={
            <span className="text-nthu" data-keep-order>
              清大
            </span>
          }
          nycu={
            <span className="text-nycu" data-keep-order>
              交大
            </span>
          }
        />
      </div>
    </>
  );
}
