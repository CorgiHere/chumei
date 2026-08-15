"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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

function toJiaoqing(text: string) {
  return text.replaceAll("清交／交清", "交清／清交").replaceAll("清交", "交清");
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

export function SchoolOrderProvider({ children }: { children: React.ReactNode }) {
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
