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
// 4–7–8-hengitys ajastettuna: sisään 4 s, pidätä 7 s, ulos 8 s. Neljä kierrosta.
// Kukka kuvaa hengitystä: sisäänhengitys kokoaa terälehdet nupuksi, pidätys pitää nupun
// kiinni ja uloshengitys avaa kukan. Ennen ensimmäistä kierrosta 3 s valmistautuminen
// (puhalla ilmat ulos, kukka auki).
// Teksti, laskuri ja kukka lasketaan samasta kellosta (breathAt), joten ne ovat aina tahdissa.

export const BREATHS = 4;
export const PREP = 3;
export const RHYTHM = { sisaan: 4, pidata: 7, ulos: 8 } as const;
export const CLOSED = 0.12;
const CYCLE = RHYTHM.sisaan + RHYTHM.pidata + RHYTHM.ulos;
export const TOTAL = PREP + BREATHS * CYCLE;

export type BreathPhase = "valmis" | "sisaan" | "pidata" | "ulos" | "loppu";
export type BreathState = {
  phase: BreathPhase;
  breath: number; // monesko kierros (1–4), valmistautumisessa 0
  count: number; // laskuri vaiheen sisällä: 1, 2, 3 …
  length: number; // vaiheen pituus sekunteina
  progress: number; // vaiheen eteneminen 0–1
  p: number; // kukan avautuminen: 1 = auki, CLOSED = nuppu
};

const ease = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2; // pehmeä alku ja loppu kuin hengityksessä
const clamp = (n: number) => Math.min(1, Math.max(0, n));

function phaseState(phase: BreathPhase, breath: number, length: number, t: number, p: number): BreathState {
  return { phase, breath, length, progress: clamp(t / length), count: Math.min(length, Math.floor(t) + 1), p };
}

// seconds = aikaa harjoituksen alusta
export function breathAt(seconds: number): BreathState {
  const s = Math.max(0, seconds);
  if (s < PREP) return phaseState("valmis", 0, PREP, s, 1);
  if (s >= TOTAL) return { phase: "loppu", breath: BREATHS, count: 0, length: 0, progress: 1, p: 1 };
  const local = s - PREP;
  const breath = Math.floor(local / CYCLE);
  const t = local - breath * CYCLE;
  if (t < RHYTHM.sisaan) {
    return phaseState("sisaan", breath + 1, RHYTHM.sisaan, t, 1 - (1 - CLOSED) * ease(t / RHYTHM.sisaan));
  }
  if (t < RHYTHM.sisaan + RHYTHM.pidata) {
    return phaseState("pidata", breath + 1, RHYTHM.pidata, t - RHYTHM.sisaan, CLOSED);
  }
  const u = t - RHYTHM.sisaan - RHYTHM.pidata;
  return phaseState("ulos", breath + 1, RHYTHM.ulos, u, CLOSED + (1 - CLOSED) * ease(u / RHYTHM.ulos));
}
