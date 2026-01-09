import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { hasCorePrefs, usePreferences } from "@/state/preferences";

export function useRequireCorePrefs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { prefs } = usePreferences();

  const ensureCore = useCallback(
    (nextOverride?: string) => {
      if (hasCorePrefs(prefs)) return true;
      const next = nextOverride ?? `${location.pathname}${location.search}`;
      const params = new URLSearchParams({
        mode: "core",
        next,
      });
      navigate(`/onboarding?${params.toString()}`, { replace: true });
      return false;
    },
    [prefs, location.pathname, location.search, navigate],
  );

  return { ensureCore };
}
