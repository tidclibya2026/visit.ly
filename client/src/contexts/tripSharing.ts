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
