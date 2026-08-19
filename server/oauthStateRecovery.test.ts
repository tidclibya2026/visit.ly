import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

describe("OAuth state recovery", () => {
  it("keeps the nonce mismatch fail-closed but returns the browser to a safe restart route", () => {
    const oauth = readFileSync(resolve(root, "server/_core/oauth.ts"), "utf8");
    expect(oauth).toContain("if (!nonce || nonce !== expectedNonce)");
    expect(oauth).toContain('res.redirect(302, "/admin?auth=restart")');
    expect(oauth).toContain("return;");
  });

  it("explains how to restart a stale login attempt without masking the admin gate", () => {
    const dashboard = readFileSync(resolve(root, "client/src/components/DashboardLayout.tsx"), "utf8");
    expect(dashboard).toContain('get("auth") === "restart"');
    expect(dashboard).toContain("انتهت محاولة الدخول السابقة");
    expect(dashboard).toContain("startLogin();");
  });
});
