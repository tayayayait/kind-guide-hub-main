import { readStorage, removeStorage, writeStorage } from "@/lib/storage";

export type CompareCacheType = "ftc" | "mohw";

export type CompareCacheEntry<TPayload = unknown> = {
  type: CompareCacheType;
  title: string;
  payload: TPayload;
  updatedAt: number;
};

const STORAGE_KEY = "kind:compareCache:v1";

type CompareCache = Record<string, CompareCacheEntry>;

export function readCompareCache(): CompareCache {
  return readStorage<CompareCache>(STORAGE_KEY, {});
}

export function writeCompareCache(cache: CompareCache): void {
  writeStorage(STORAGE_KEY, cache);
}

export function clearCompareCache(): void {
  removeStorage(STORAGE_KEY);
}

export function upsertCompareCacheEntry(id: string, entry: CompareCacheEntry): void {
  const cache = readCompareCache();
  cache[id] = entry;
  writeCompareCache(cache);
}

export function removeCompareCacheEntry(id: string): void {
  const cache = readCompareCache();
  if (!(id in cache)) return;
  delete cache[id];
  writeCompareCache(cache);
}

export function getCompareCacheEntry(id: string): CompareCacheEntry | null {
  const cache = readCompareCache();
  return cache[id] ?? null;
}

