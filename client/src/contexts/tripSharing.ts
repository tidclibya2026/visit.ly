export function parseSharedStops(value: string | null): string[] {
  if (!value) return [];
  return Array.from(new Set(value.split(",").map((item) => item.trim()).filter(Boolean)));
}

export function buildSharedRouteUrl(currentUrl: string, stops: string[]): string {
  const url = new URL(currentUrl);
  const cleaned = Array.from(new Set(stops.map((item) => item.trim()).filter(Boolean)));
  if (cleaned.length) url.searchParams.set("route", cleaned.join(","));
  else url.searchParams.delete("route");
  return url.toString();
}

export function parseSharedGalleryFavorites(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    return Array.isArray(parsed) ? Array.from(new Set(parsed.filter((item): item is string => typeof item === "string" && item.length <= 120))) : [];
  } catch {
    return [];
  }
}

export function buildSharedGalleryFavoritesUrl(currentUrl: string, favorites: string[]): string {
  const url = new URL(currentUrl);
  const cleaned = Array.from(new Set(favorites.map((item) => item.trim()).filter((item) => item.length <= 120)));
  if (cleaned.length) url.hash = `favorites=${encodeURIComponent(JSON.stringify(cleaned))}`;
  else url.hash = "";
  return url.toString();
}
