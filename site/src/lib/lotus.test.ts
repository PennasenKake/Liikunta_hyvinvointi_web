// lotus.test.ts: hengitysrytmin (4–7–8) yksikkötestit (Vitest, npm test).
import { describe, expect, it } from "vitest";
import { BREATHS, breathState } from "./lotus";

// Vierityskohta, jossa hengityksen n (1..) vaihe on kohdassa t (0–1 hengityksen sisällä)
const at = (n: number, t: number) => 0.08 + ((1 - 0.08 - 0.07) / BREATHS) * (n - 1 + t);

describe("breathState (4–7–8)", () => {
  it("alkaa nuppuna ja päättyy auki", () => {
    expect(breathState(0).phase).toBe("alku");
    expect(breathState(0).p).toBeLessThan(0.2);
    expect(breathState(1)).toMatchObject({ phase: "loppu", p: 1, breath: BREATHS });
  });

  it("käy läpi neljä hengitystä: sisään, pidätä, ulos", () => {
    const seen: string[] = [];
    let prev = "";
    for (let s = 0; s <= 1; s += 0.001) {
      const { phase, breath } = breathState(s);
      const key = `${phase}${breath}`;
      if (key !== prev) seen.push(key);
      prev = key;
    }
    const expected = ["alku0"];
    for (let n = 1; n <= BREATHS; n++) expected.push(`sisaan${n}`, `pidata${n}`, `ulos${n}`);
    expected.push(`loppu${BREATHS}`);
    expect(seen).toEqual(expected);
  });

  it("vaiheiden pituudet ovat suhteessa 4 : 7 : 8", () => {
    const len = (phase: string) => {
      let n = 0;
      for (let t = 0; t < 1; t += 0.0001) if (breathState(at(1, t)).phase === phase) n++;
      return n;
    };
    const [i, h, o] = [len("sisaan"), len("pidata"), len("ulos")];
    expect(h / i).toBeCloseTo(7 / 4, 1);
    expect(o / i).toBeCloseTo(8 / 4, 1);
  });

  it("kukka on kiinni pidätyksen ajan ja auki uloshengityksen lopussa", () => {
    expect(breathState(at(2, 0.4)).phase).toBe("pidata");
    expect(breathState(at(2, 0.4)).p).toBeLessThan(0.2);
    expect(breathState(at(2, 0.999)).p).toBeGreaterThan(0.95);
  });

  it("liike on jatkuva (ei hyppäyksiä vaiheiden rajoilla)", () => {
    let prev = breathState(0).p;
    for (let s = 0.0005; s <= 1; s += 0.0005) {
      const p = breathState(s).p;
      expect(Math.abs(p - prev)).toBeLessThan(0.05);
      prev = p;
    }
  });
});
