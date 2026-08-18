import { describe, expect, it } from "vitest";
import { shouldShowRouteLoader } from "./PageNavigationLoader";

describe("shouldShowRouteLoader", () => {
  it("يعرض مؤشّر التحميل عند تغيير المسار", () => {
    expect(shouldShowRouteLoader("/destinations", "/culture")).toBe(true);
  });

  it("لا يعرض مؤشّر التحميل عند البقاء في المسار نفسه", () => {
    expect(shouldShowRouteLoader("/events", "/events")).toBe(false);
  });
});
