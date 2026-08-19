/**
 * Design reminder — «دفاتر الرحّالة»: مخطط رحلة شخصي وبسيط، يربط الاستكشاف بالفعل
 * دون إغراق المستخدم في نماذج أو لوحات تحكم ثقيلة.
 */
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { reorderStops } from "./tripUtils";
import { parseSharedGalleryFavorites, parseSharedStops } from "./tripSharing";

type TripContextValue = {
  stops: string[];
  toggleStop: (stopId: string) => void;
  moveStop: (stopId: string, targetStopId: string) => void;
  clearStops: () => void;
  favorites: string[];
  toggleFavorite: (destinationId: string) => void;
  clearFavorites: () => void;
  galleryFavorites: string[];
  toggleGalleryFavorite: (galleryItemId: string) => void;
  clearGalleryFavorites: () => void;
};

const TripContext = createContext<TripContextValue | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [stops, setStops] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [galleryFavorites, setGalleryFavorites] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    const sharedStops = parseSharedStops(new URLSearchParams(window.location.search).get("route"));
    const saved = window.localStorage.getItem("turath-libya-trip-stops");
    if (sharedStops.length) setStops(sharedStops);
    else if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setStops(parsed.filter((value): value is string => typeof value === "string"));
      } catch {
        window.localStorage.removeItem("turath-libya-trip-stops");
      }
    }
    const savedDestinationFavorites = window.localStorage.getItem("visit-libya-favorites");
    if (savedDestinationFavorites) {
      try {
        const parsed = JSON.parse(savedDestinationFavorites);
        if (Array.isArray(parsed)) setFavorites(parsed.filter((value): value is string => typeof value === "string"));
      } catch {
        window.localStorage.removeItem("visit-libya-favorites");
      }
    }
    const savedGallery = window.localStorage.getItem("visit-libya-gallery-favorites");
    const sharedGallery = parseSharedGalleryFavorites(new URLSearchParams(window.location.hash.replace(/^#/, "")).get("favorites"));
    let localGallery: string[] = [];
    if (savedGallery) {
      try {
        const parsed = JSON.parse(savedGallery);
        if (Array.isArray(parsed)) localGallery = parsed.filter((value): value is string => typeof value === "string");
      } catch {
        window.localStorage.removeItem("visit-libya-gallery-favorites");
      }
    }
    setGalleryFavorites(Array.from(new Set([...localGallery, ...sharedGallery])));
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem("turath-libya-trip-stops", JSON.stringify(stops));
  }, [stops, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem("visit-libya-favorites", JSON.stringify(favorites));
  }, [favorites, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem("visit-libya-gallery-favorites", JSON.stringify(galleryFavorites));
  }, [galleryFavorites, storageReady]);

  const value = useMemo(
    () => ({
      stops,
      toggleStop: (stopId: string) => setStops((current) => current.includes(stopId) ? current.filter((id) => id !== stopId) : [...current, stopId]),
      moveStop: (stopId: string, targetStopId: string) => setStops((current) => reorderStops(current, stopId, targetStopId)),
      clearStops: () => setStops([]),
      favorites,
      toggleFavorite: (destinationId: string) => setFavorites((current) => current.includes(destinationId) ? current.filter((id) => id !== destinationId) : [...current, destinationId]),
      clearFavorites: () => setFavorites([]),
      galleryFavorites,
      toggleGalleryFavorite: (galleryItemId: string) => setGalleryFavorites((current) => current.includes(galleryItemId) ? current.filter((id) => id !== galleryItemId) : [...current, galleryItemId]),
      clearGalleryFavorites: () => setGalleryFavorites([]),
    }),
    [stops, favorites, galleryFavorites],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const value = useContext(TripContext);
  if (!value) throw new Error("useTrip must be used within TripProvider");
  return value;
}
