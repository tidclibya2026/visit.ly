import { describe, expect, it } from "vitest";
import { destinationViewStorageKey, parseDestinationView } from "../client/src/lib/destinationView";

describe("destination view preference", () => {
  it("يعيد نمط القائمة افتراضيًا ولا يقبل إلا الشبكة كبديل محفوظ", () => {
    expect(parseDestinationView(null)).toBe("list");
    expect(parseDestinationView("unknown")).toBe("list");
    expect(parseDestinationView("grid")).toBe("grid");
    expect(destinationViewStorageKey).toBe("visit-libya-destination-view");
  });
});
