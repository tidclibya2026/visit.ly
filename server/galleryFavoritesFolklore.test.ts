import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

describe("gallery favorites and folklore album", () => {
  it("يحفظ مفضلات الجاليري بصورة مستقلة عن مفضلات الوجهات", () => {
    const trip = readFileSync(resolve(projectRoot, "client/src/contexts/TripContext.tsx"), "utf8");
    expect(trip).toContain("visit-libya-gallery-favorites");
    expect(trip).toContain("toggleGalleryFavorite");
  });

  it("يعرض عدادات المواسم والألبومات ومسار ملف الفلكلور", () => {
    const gallery = readFileSync(resolve(projectRoot, "client/src/pages/Gallery.tsx"), "utf8");
    const app = readFileSync(resolve(projectRoot, "client/src/App.tsx"), "utf8");
    expect(gallery).toContain("gallery-season-tabs");
    expect(gallery).toContain("themedAlbums[key].length");
    expect(app).toContain('path={"/albums/folklore"}');
  });
});
