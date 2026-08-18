export type AtlasImageReference = { destinationId: string; destinationTitle: string; photoIndex: number; location: string; coordinates: string };

export function atlasImageLabel(reference: AtlasImageReference) {
  const position = reference.coordinates.replace(/\s+/g, "").replace(/·/g, "-");
  return `VL-${reference.destinationId.toUpperCase()}-${String(reference.photoIndex + 1).padStart(2, "0")}-${position}`;
}

export function atlasImageHref(atlasUrl: string, reference: AtlasImageReference) {
  const [lat = "", lng = ""] = reference.coordinates.match(/-?\d+(?:\.\d+)?/g) ?? [];
  const label = atlasImageLabel(reference);
  return `${atlasUrl}#place=${encodeURIComponent(reference.location)}&label=${encodeURIComponent(label)}&lat=${lat}&lng=${lng}`;
}
