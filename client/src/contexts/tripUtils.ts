export function reorderStops(stops: string[], stopId: string, targetStopId: string) {
  const fromIndex = stops.indexOf(stopId);
  const targetIndex = stops.indexOf(targetStopId);
  if (fromIndex < 0 || targetIndex < 0 || fromIndex === targetIndex) return stops;

  const next = [...stops];
  next.splice(fromIndex, 1);
  next.splice(targetIndex, 0, stopId);
  return next;
}
