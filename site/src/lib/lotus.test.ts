// lotus.test.ts: ajastetun 4–7–8-hengityksen yksikkötestit (Vitest, npm test).
import { describe, expect, it } from "vitest";
import { BREATHS, CLOSED, PREP, TOTAL, breathAt } from "./lotus";

describe("breathAt (4–7–8)", () => {
  it("valmistautuminen 3 s, kukka auki", () => {
    expect(breathAt(0)).toMatchObject({ phase: "valmis", breath: 0, count: 1, p: 1 });
    expect(breathAt(2.5)).toMatchObject({ phase: "valmis", count: 3 });
  });

  it("käy läpi neljä kierrosta: sisään 4, pidätä 7, ulos 8, sitten loppu", () => {
    const seen: string[] = [];
    for (let s = 0; s <= TOTAL + 1; s += 0.05) {
      const { phase, breath } = breathAt(s);
      const key = `${phase}${breath}`;
      if (seen.at(-1) !== key) seen.push(key);
    }
    const expected = ["valmis0"];
    for (let n = 1; n <= BREATHS; n++) expected.push(`sisaan${n}`, `pidata${n}`, `ulos${n}`);
    expected.push(`loppu${BREATHS}`);
    expect(seen).toEqual(expected);
    expect(TOTAL).toBe(PREP + BREATHS * 19);
  });

  it("laskuri vastaa sekunteja: sisään 1–4, pidätä 1–7, ulos 1–8", () => {
    const counts = (from: number, len: number) => Array.from({ length: len }, (_, i) => breathAt(from + i + 0.5).count);
    expect(counts(PREP, 4)).toEqual([1, 2, 3, 4]);
    expect(counts(PREP + 4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(counts(PREP + 11, 8)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("sisäänhengitys sulkee kukan, pidätys pitää kiinni, uloshengitys avaa", () => {
    expect(breathAt(PREP + 0.01).p).toBeGreaterThan(0.99); // sisään alkaa auki
    expect(breathAt(PREP + 3.99).p).toBeLessThan(CLOSED + 0.01); // sisään päättyy nuppuna
    expect(breathAt(PREP + 8).p).toBe(CLOSED); // pidätys
    expect(breathAt(PREP + 18.99).p).toBeGreaterThan(0.99); // ulos päättyy auki
  });

  it("kukan liike on jatkuva (ei hyppäyksiä vaiheiden rajoilla)", () => {
    let prev = breathAt(0).p;
    for (let s = 0.01; s <= TOTAL + 1; s += 0.01) {
      const p = breathAt(s).p;
      expect(Math.abs(p - prev)).toBeLessThan(0.02);
      prev = p;
    }
  });
});
