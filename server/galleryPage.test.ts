import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

describe("gallery page", () => {
  it("يسجل مسار المعرض العام ومساره اللغوي", () => {
    const app = readFileSync(resolve(projectRoot, "client/src/App.tsx"), "utf8");
    expect(app).toContain('path={"/gallery"}');
    expect(app).toContain('path={"/:locale/gallery"}');
  });

  it("يعرض صور الوجهات الموثقة مع التصفية والتكبير والأطلس", () => {
    const gallery = readFileSync(resolve(projectRoot, "client/src/pages/Gallery.tsx"), "utf8");
    expect(gallery).toContain("destinations.flatMap");
    expect(gallery).toContain("requestImageZoom");
    expect(gallery).toContain("atlasImageHref");
    expect(gallery).toContain("gallery-masonry");
  });
});
