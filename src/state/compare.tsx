import * as React from "react";
import { readStorage, writeStorage } from "@/lib/storage";


import { ServiceItem } from "@/data/mockServices";

const STORAGE_KEY = "kind:compareItems";
const DEFAULT_MAX = 3;

type ToggleResult = { ok: true } | { ok: false; reason: "max" };

export type CompareContextValue = {
  items: ServiceItem[];
  max: number;
  isSelected: (id: string) => boolean;
  toggle: (item: ServiceItem) => ToggleResult;
  remove: (id: string) => void;
  clear: () => void;
};


const CompareContext = React.createContext<CompareContextValue | null>(null);


const normalizeItems = (input: unknown, max: number): ServiceItem[] => {
  if (!Array.isArray(input)) return [];
  const result: ServiceItem[] = [];
  const seen = new Set<string>();
  for (const raw of input) {
    if (!raw || typeof raw !== "object" || !raw.id) continue;

    // Validate required fields (basic check)
    if (!raw.title) continue;

    if (seen.has(raw.id)) continue;
    seen.add(raw.id);
    result.push(raw as ServiceItem);
    if (result.length >= max) break;
  }
  return result;
};

export function CompareProvider({
  children,
  max = DEFAULT_MAX,
}: {
  children: React.ReactNode;
  max?: number;
}) {
  const [items, setItemsState] = React.useState<ServiceItem[]>(() =>
    normalizeItems(readStorage<ServiceItem[]>(STORAGE_KEY, []), max),
  );

  React.useEffect(() => {
    setItemsState((prev) => normalizeItems(prev, max));
  }, [max]);

  React.useEffect(() => {
    writeStorage(STORAGE_KEY, items);
  }, [items]);

  const remove = React.useCallback((id: string) => {
    const target = id.trim();
    if (!target) return;
    setItemsState((prev) => prev.filter((item) => item.id !== target));
  }, []);

  const clear = React.useCallback(() => {
    setItemsState([]);
  }, []);

  const isSelected = React.useCallback(
    (id: string) => {
      const target = id.trim();
      if (!target) return false;
      return items.some(item => item.id === target);
    },
    [items],
  );

  const toggle = React.useCallback(
    (newItem: ServiceItem): ToggleResult => {
      if (!newItem || !newItem.id) return { ok: true };

      const exists = items.some(i => i.id === newItem.id);

      if (exists) {
        setItemsState((prev) => prev.filter((item) => item.id !== newItem.id));
        return { ok: true };
      }

      if (items.length >= max) {
        return { ok: false, reason: "max" };
      }

      setItemsState((prev) => [...prev, newItem]);
      return { ok: true };
    },
    [items, max],
  );

  const value = React.useMemo<CompareContextValue>(
    () => ({
      items,
      max,
      isSelected,
      toggle,
      remove,
      clear,
    }),
    [items, max, isSelected, toggle, remove, clear],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}


export function useCompare() {
  const ctx = React.useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return ctx;
}
