// lotus.test.ts: hengitysrytmin yksikkötestit (Vitest, npm test).
import { describe, expect, it } from "vitest";
import { BREATHS, breathState } from "./lotus";

describe("breathState", () => {
  it("alkaa nuppuna ja päättyy auki", () => {
    expect(breathState(0).phase).toBe("alku");
    expect(breathState(0).p).toBeLessThan(0.2);
    expect(breathState(1)).toMatchObject({ phase: "loppu", p: 1, breath: BREATHS });
  });

  it("käy läpi kolme hengitystä: sisään sulkeutuu, ulos avautuu", () => {
    const seen: string[] = [];
    let prev = "";
    for (let s = 0; s <= 1; s += 0.002) {
      const { phase, breath } = breathState(s);
      const key = `${phase}${breath}`;
      if (key !== prev) seen.push(key);
      prev = key;
    }
    expect(seen).toEqual(["alku0", "sisaan1", "ulos1", "sisaan2", "ulos2", "sisaan3", "ulos3", "loppu3"]);
  });

  it("kukka on kiinni sisäänhengityksen lopussa ja auki uloshengityksen lopussa", () => {
    const inEnd = breathState(0.12 + 0.26 * 0.419);
    const outEnd = breathState(0.12 + 0.26 * 0.999);
    expect(inEnd.phase).toBe("sisaan");
    expect(inEnd.p).toBeLessThan(0.2);
    expect(outEnd.p).toBeGreaterThan(0.95);
  });

  it("liike on jatkuva (ei hyppäyksiä vaiheiden rajoilla)", () => {
    let prev = breathState(0).p;
    for (let s = 0.001; s <= 1; s += 0.001) {
      const p = breathState(s).p;
      expect(Math.abs(p - prev)).toBeLessThan(0.05);
      prev = p;
    }
  });
});
