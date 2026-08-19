import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(new URL(relativePath, import.meta.url), "utf8");

describe("ألبوم الحِرف ومفضلات الجاليري", () => {
  it("يوفر صفحة حرف مستقلة ومساراتها المحلية", () => {
    const crafts = read("../client/src/pages/CraftsAlbum.tsx");
    const app = read("../client/src/App.tsx");
    expect(crafts).toContain("foodCraftVisualArchive.slice(2)");
    expect(crafts).toContain('section === "حِرف"');
    expect(crafts).toContain("الفخار");
    expect(crafts).toContain("المنسوجات");
    expect(crafts).toContain("الزخارف");
    expect(crafts).toContain("الحُلي");
    expect(app).toContain('"/albums/crafts"');
    expect(app).toContain('"/:locale/albums/crafts"');
  });

  it("يربط المفضلات بمخطط الرحلة ويتيح تصديرها ومشاركتها واستعادتها", () => {
    const gallery = read("../client/src/pages/Gallery.tsx");
    const planner = read("../client/src/pages/TripPlanner.tsx");
    const context = read("../client/src/contexts/TripContext.tsx");
    const sharing = read("../client/src/contexts/tripSharing.ts");
    expect(gallery).toContain("exportFavorites");
    expect(gallery).toContain("shareFavorites");
    expect(gallery).toContain("buildSharedGalleryFavoritesUrl");
    expect(planner).toContain("galleryFavoriteSuggestions");
    expect(planner).toContain("أضف الوجهة");
    expect(planner).toContain("أضف التجربة");
    expect(context).toContain("parseSharedGalleryFavorites");
    expect(context).toContain("visit-libya-gallery-favorites");
    expect(sharing).toContain("buildSharedGalleryFavoritesUrl");
    expect(sharing).toContain("parseSharedGalleryFavorites");
  });
});
