import { useCallback, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

function sessionKey() {
  const key = "visit-libya-analytics-session";
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  sessionStorage.setItem(key, created);
  return created;
}

export function useInteractionTracking() {
  const { language } = useLanguage();
  const [key] = useState(() => sessionKey());
  const mutation = trpc.interaction.track.useMutation();
  return useCallback((eventType: "destination_open" | "atlas_marker_select" | "language_switch", destinationId?: string) => {
    mutation.mutate({ eventType, destinationId, language, sessionKey: key });
  }, [key, language, mutation]);
}
