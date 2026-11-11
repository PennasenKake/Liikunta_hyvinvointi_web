// headers.test.mjs: tietoturvaotsakkeiden yksikkötesti (Vitest, npm test).
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

const headers = readFileSync("public/_headers", "utf-8");

describe("public/_headers", () => {
  it("CSP sallii index.html:n inline-skriptin (tiiviste täsmää)", () => {
    const html = readFileSync("index.html", "utf-8");
    // Suoritettavat inline-skriptit: ei src-attribuuttia (JSON-LD on erillinen tietolohko)
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    expect(scripts.length).toBeGreaterThan(0);
    for (const s of scripts) {
      const hash = createHash("sha256").update(s).digest("base64");
      expect(headers).toContain(`'sha256-${hash}'`);
    }
  });

  it("perusotsakkeet ovat mukana", () => {
    for (const h of ["Content-Security-Policy", "Strict-Transport-Security", "X-Content-Type-Options: nosniff", "frame-ancestors 'none'", "object-src 'none'"]) {
      expect(headers).toContain(h);
    }
    expect(headers).not.toContain("'unsafe-eval'");
  });
});
