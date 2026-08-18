import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("GitHub Pages deployment", () => {
  it("يبني معاينة Pages وينشر مخرجات dist/public", () => {
    const workflow = readFileSync(resolve(root, ".github/workflows/deploy-pages.yml"), "utf8");

    expect(workflow).toContain("pnpm build:pages");
    expect(workflow).toContain("actions/upload-pages-artifact@v3");
    expect(workflow).toContain("actions/deploy-pages@v4");
    expect(workflow).toContain("path: dist/public");
  });

  it("يعدّ pnpm قبل إعداد Node.js ذي ذاكرة pnpm المؤقتة", () => {
    const workflow = readFileSync(resolve(root, ".github/workflows/deploy-pages.yml"), "utf8");

    expect(workflow.indexOf("name: Set up pnpm")).toBeLessThan(workflow.indexOf("name: Set up Node.js"));
    expect(workflow).not.toContain("version: 10.15.1");
  });

  it("يوفر أداة بناء لصفحة البداية ومسار 404 والملفات الثابتة", () => {
    const script = resolve(root, "scripts/build-pages.mjs");
    expect(existsSync(script)).toBe(true);

    const source = readFileSync(script, "utf8");
    expect(source).toContain('VITE_BASE_PATH: "/visit.ly/"');
    expect(source).toContain('"404.html"');
    expect(source).toContain('"/manus-storage/"');
  });

  it("يمرر قاعدة Vite إلى Wouter كي يعمل جذر المستودع على Pages", () => {
    const app = readFileSync(resolve(root, "client/src/App.tsx"), "utf8");

    expect(app).toContain("import.meta.env.BASE_URL");
    expect(app).toContain("<WouterRouter base={routerBase}>");
  });
});
