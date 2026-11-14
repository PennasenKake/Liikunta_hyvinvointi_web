// lotus.ts: hengitysharjoituksen lootuksen piirto (SVG-polut) ja hengitysrytmi vierityksen mukaan.
// Pelkkiä funktioita: samat polut syntyvät buildissa (esirenderöinti) ja selaimessa.
// Sama piirros kuin lootusmandalassa (public/koristeet/), mutta jokainen terälehti on oma
// elementtinsä, jotta se voi kääntyä auki ja kiinni.

const CX = 400;
const CY = 410;
const f = (n: number) => n.toFixed(1);
const pt = (x: number, y: number) => `${f(x)} ${f(y)}`;
const polar = (r: number, a: number): [number, number] => [CX + r * Math.sin(a), CY - r * Math.cos(a)];

// Terälehti pystyyn tyvestä (bx, by): pituus L ja leveys w
export function petalPath(bx: number, by: number, L: number, w: number) {
  const q = (a: number, s: number) => pt(bx + s * w, by - a * L);
  return `M${pt(bx, by)} C${q(0.38, 1.2)} ${q(0.74, 0.95)} ${pt(bx, by - L)} C${q(0.74, -0.95)} ${q(0.38, -1.2)} ${pt(bx, by)}Z`;
}

// Terävä kaari (ogee) mandalan kehälle kulmien a0 ja a1 väliin
function ogee(a0: number, a1: number, r0: number, r1: number) {
  const am = (a0 + a1) / 2;
  const [p0, p1, tip] = [polar(r0, a0), polar(r0, a1), polar(r1, am)];
  const c0 = polar(r0 + (r1 - r0) * 0.55, a0 - (am - a0) * 0.05);
  const c1 = polar(r0 + (r1 - r0) * 0.55, a1 + (a1 - am) * 0.05);
  const d0 = polar(r0 + (r1 - r0) * 0.85, am - (am - a0) * 0.18);
  const d1 = polar(r0 + (r1 - r0) * 0.85, am + (a1 - am) * 0.18);
  return `M${pt(...p0)} C${pt(...c0)} ${pt(...d0)} ${pt(...tip)} C${pt(...d1)} ${pt(...c1)} ${pt(...p1)}`;
}

export function starPath(cx: number, cy: number, r: number, k = 0.2) {
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const rr = i % 2 ? r * k : r;
    pts.push(pt(cx + rr * Math.sin(a), cy - rr * Math.cos(a)));
  }
  return `M${pts.join(" L")}Z`;
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

export const outerRing = [
  ...range(12).map((i) => ogee((2 * Math.PI * i) / 12, (2 * Math.PI * (i + 1)) / 12, 170, 300)),
  ...range(12).map((i) => ogee((2 * Math.PI * (i + 0.5)) / 12, (2 * Math.PI * (i + 1.5)) / 12, 165, 262)),
].join(" ");
export const innerRing = range(24).map((i) => ogee((2 * Math.PI * i) / 24, (2 * Math.PI * (i + 1)) / 24, 165, 212)).join(" ");
export const beads = range(12).map((i) => polar(312, (2 * Math.PI * (i + 0.5)) / 12));

// Terälehdet: [auki-kulma, kiinni-kulma, pituus, leveys]. Tyvi kohdassa (400, 560).
type Petal = [open: number, closed: number, length: number, width: number];
export const PETALS: Record<"back" | "mid" | "front" | "lower", Petal[]> = {
  back: [[-78, -10, 190, 30], [78, 10, 190, 30], [-58, -7, 205, 32], [58, 7, 205, 32]],
  mid: [[-40, -5, 215, 36], [40, 5, 215, 36], [-20, -3, 225, 36], [20, 3, 225, 36]],
  front: [[-64, -16, 150, 38], [64, 16, 150, 38], [-32, -9, 145, 42], [32, 9, 145, 42], [0, 0, 160, 46]],
  lower: [[-104, -40, 135, 26], [104, 40, 135, 26]],
};
export const PETAL_BASE = { x: 400, y: 560 };

// Heteet kukan keskellä: viivat ja niiden päiden pisteet
export const stamens = range(17).map((i) => {
  const a = ((-64 + (i * 128) / 16) * Math.PI) / 180;
  return { x0: 400 + 40 * Math.sin(a), y0: 470 - 6 * Math.cos(a), x1: 400 + 58 * Math.sin(a), y1: 452 - 30 * Math.cos(a) };
});

// --- Hengitysrytmi ---------------------------------------------------------------
// 4–7–8-hengitys: sisään 4, pidätä 7, ulos 8 (laskien). Vierityksen osuudet vastaavat samaa
// suhdetta, joten rauhallisesti vierittäessä rytmi tuntuu oikealta.
// Vierityksen eteneminen s (0–1) → kukan avautuminen p (0 = nuppu, 1 = auki) ja vaihe.
// Rakenne: johdanto (kukka avautuu), 4 hengitystä (sisään: sulkeutuu, pidätä: pysyy kiinni,
// ulos: avautuu), loppu.

export const BREATHS = 4;
export const RHYTHM = { sisaan: 4, pidata: 7, ulos: 8 } as const;
const INTRO = 0.08;
const OUTRO = 0.07;
const CLOSED = 0.15;
const TOTAL = RHYTHM.sisaan + RHYTHM.pidata + RHYTHM.ulos;
const IN_END = RHYTHM.sisaan / TOTAL;
const HOLD_END = (RHYTHM.sisaan + RHYTHM.pidata) / TOTAL;

export type BreathPhase = "alku" | "sisaan" | "pidata" | "ulos" | "loppu";
export type BreathState = { p: number; phase: BreathPhase; breath: number; phaseProgress: number };

const ease = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2; // pehmeä alku ja loppu kuin hengityksessä
const clamp = (n: number) => Math.min(1, Math.max(0, n));

export function breathState(scroll: number): BreathState {
  const s = clamp(scroll);
  if (s < INTRO) {
    const t = s / INTRO;
    return { p: CLOSED + (1 - CLOSED) * ease(t), phase: "alku", breath: 0, phaseProgress: t };
  }
  if (s >= 1 - OUTRO) return { p: 1, phase: "loppu", breath: BREATHS, phaseProgress: (s - (1 - OUTRO)) / OUTRO };
  const per = (1 - INTRO - OUTRO) / BREATHS;
  const local = (s - INTRO) / per;
  const breath = Math.min(BREATHS - 1, Math.floor(local));
  const t = local - breath;
  if (t < IN_END) {
    const k = t / IN_END;
    return { p: 1 - (1 - CLOSED) * ease(k), phase: "sisaan", breath: breath + 1, phaseProgress: k };
  }
  if (t < HOLD_END) {
    return { p: CLOSED, phase: "pidata", breath: breath + 1, phaseProgress: (t - IN_END) / (HOLD_END - IN_END) };
  }
  const k = (t - HOLD_END) / (1 - HOLD_END);
  return { p: CLOSED + (1 - CLOSED) * ease(k), phase: "ulos", breath: breath + 1, phaseProgress: k };
}
