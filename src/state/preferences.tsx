import * as React from "react";
import { clampNumber, readStorage, writeStorage } from "@/lib/storage";

const STORAGE_KEY = "kind:prefs";
const MIN_BUDGET = 0;
const MAX_BUDGET = 10000;

export type FuneralType = "family" | "general" | "nohall";

export type UserPrefs = {
  completed: boolean;
  region?: string;
  funeralType?: FuneralType;
  budget?: number;
};

type PreferencesContextValue = {
  prefs: UserPrefs;
  setPrefs: (patch: Partial<UserPrefs>) => void;
  complete: () => void;
  skip: () => void;
  reset: () => void;
};

const PreferencesContext = React.createContext<PreferencesContextValue | null>(null);

const isFuneralType = (value: unknown): value is FuneralType =>
  value === "family" || value === "general" || value === "nohall";

const normalizePrefs = (input: unknown): UserPrefs => {
  if (!input || typeof input !== "object") {
    return { completed: false };
  }
  const raw = input as Partial<UserPrefs>;

  const region = typeof raw.region === "string" ? raw.region.trim() || undefined : undefined;
  const funeralType = isFuneralType(raw.funeralType) ? raw.funeralType : undefined;
  const budget =
    typeof raw.budget === "number" && Number.isFinite(raw.budget)
      ? Math.round(clampNumber(raw.budget, MIN_BUDGET, MAX_BUDGET))
      : undefined;

  let completed = raw.completed === true;
  if (completed && (!region || !funeralType)) completed = false;

  return { completed, region, funeralType, budget };
};

export const hasCorePrefs = (prefs: UserPrefs) => Boolean(prefs.region && prefs.funeralType);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefsState] = React.useState<UserPrefs>(() =>
    normalizePrefs(readStorage<UserPrefs>(STORAGE_KEY, { completed: false })),
  );

  React.useEffect(() => {
    writeStorage(STORAGE_KEY, prefs);
  }, [prefs]);

  const setPrefs = React.useCallback((patch: Partial<UserPrefs>) => {
    setPrefsState((prev) => normalizePrefs({ ...prev, ...patch }));
  }, []);

  const complete = React.useCallback(() => {
    setPrefsState((prev) => normalizePrefs({ ...prev, completed: true }));
  }, []);

  const skip = React.useCallback(() => {
    setPrefsState((prev) => normalizePrefs({ ...prev, completed: false }));
  }, []);

  const reset = React.useCallback(() => {
    setPrefsState({ completed: false });
  }, []);

  const value = React.useMemo<PreferencesContextValue>(
    () => ({
      prefs,
      setPrefs,
      complete,
      skip,
      reset,
    }),
    [prefs, setPrefs, complete, skip, reset],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = React.useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return ctx;
}
