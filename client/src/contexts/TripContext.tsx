/**
 * Design reminder — «دفاتر الرحّالة»: مخطط رحلة شخصي وبسيط، يربط الاستكشاف بالفعل
 * دون إغراق المستخدم في نماذج أو لوحات تحكم ثقيلة.
 */
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type TripContextValue = {
  stops: string[];
  toggleStop: (stopId: string) => void;
  clearStops: () => void;
};

const TripContext = createContext<TripContextValue | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [stops, setStops] = useState<string[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem("turath-libya-trip-stops");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) setStops(parsed.filter((value): value is string => typeof value === "string"));
    } catch {
      window.localStorage.removeItem("turath-libya-trip-stops");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("turath-libya-trip-stops", JSON.stringify(stops));
  }, [stops]);

  const value = useMemo(
    () => ({
      stops,
      toggleStop: (stopId: string) => setStops((current) => current.includes(stopId) ? current.filter((id) => id !== stopId) : [...current, stopId]),
      clearStops: () => setStops([]),
    }),
    [stops],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const value = useContext(TripContext);
  if (!value) throw new Error("useTrip must be used within TripProvider");
  return value;
}
