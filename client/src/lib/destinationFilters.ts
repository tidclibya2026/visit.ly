import type { Destination } from "./content";

export type DestinationSort = "default" | "region" | "category";

export type DestinationFilterState = {
  query: string;
  city: string;
  landmarkType: string;
  region: string;
  category: string;
  sort: DestinationSort;
};

export function filterAndSortDestinations(items: Destination[], filters: DestinationFilterState) {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase("ar");
  const filtered = items.filter((destination) => {
    const searchable = `${destination.title} ${destination.city} ${destination.landmarkType} ${destination.region} ${destination.category} ${destination.description}`.toLocaleLowerCase("ar");
    return (
      (filters.city === "الكل" || destination.city === filters.city) &&
      (filters.landmarkType === "الكل" || destination.landmarkType === filters.landmarkType) &&
      (filters.region === "الكل" || destination.region === filters.region) &&
      (filters.category === "الكل" || destination.category === filters.category) &&
      searchable.includes(normalizedQuery)
    );
  });

  if (filters.sort === "default") return filtered;

  return [...filtered].sort((first, second) => {
    const firstValue = filters.sort === "region" ? first.region : first.category;
    const secondValue = filters.sort === "region" ? second.region : second.category;
    return firstValue.localeCompare(secondValue, "ar") || first.title.localeCompare(second.title, "ar");
  });
}
