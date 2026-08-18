export type DestinationView = "list" | "grid";

export const destinationViewStorageKey = "visit-libya-destination-view";

export function parseDestinationView(value: string | null): DestinationView {
  return value === "grid" ? "grid" : "list";
}
