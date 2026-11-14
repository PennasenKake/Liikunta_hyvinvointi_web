// BreathScroll.tsx: "Hengähdä hetki" – vieritykseen sidottu hengitysharjoitus.
// Kävijä vierittää hitaasti, ja lootus ohjaa hengitystä: sulkeutuu sisäänhengityksessä,
// avautuu uloshengityksessä. Kolme hengitystä, sitten kutsu tunnille.
//
// Toteutus:
// - Osio on korkea (index.css: .breath-track), ja sen sisällä lootus pysyy paikallaan (sticky).
// - Vierityksen eteneminen 0–1 → lib/lotus.ts:breathState → kukan avautuminen CSS-muuttujaan --p.
//   Terälehtien kulmat lasketaan CSS:ssä muuttujasta, joten React ei piirrä uudelleen joka ruudulla:
//   tila (vaihe ja hengityksen numero) päivittyy vain vaiheen vaihtuessa.
// - Vierityksestä tulee liike, joten kävijä hallitsee sitä itse (ei automaattista animaatiota).
//
// Saavutettavuus ja varatilat:
// - Vähennetty liike tai ei JavaScriptiä: osio on tavallisen korkuinen, lootus valmiiksi auki
//   ja ohjeet näkyvät listana (index.css: .breath-static / .breath-dynamic).
// - Lootus ja vaiheteksti ovat koristetta/ohjausta (aria-hidden); sama ohje on luettavissa tekstinä.

import { useEffect, useRef, useState } from "react";
import { BREATHS, PETAL_BASE, PETALS, beads, breathState, innerRing, outerRing, petalPath, stamens, starPath, type BreathPhase } from "@/lib/lotus";
import { withBase } from "@/lib/paths";

const CUES: Record<BreathPhase, { title: string; sub: string }> = {
  alku: { title: "Pysähdy hetkeksi", sub: "Vieritä hitaasti. Kun kukka sulkeutuu, hengitä sisään. Kun se avautuu, hengitä ulos." },
  sisaan: { title: "Hengitä sisään", sub: "Lootus sulkeutuu" },
  ulos: { title: "Hengitä ulos", sub: "Päästä irti, lootus avautuu" },
  loppu: { title: "Hyvä.", sub: "Tämä on lepoa. Keho tarvitsee sitä yhtä paljon kuin liikettä." },
};

const STARS: [number, number, number, number][] = [
  [300, 330, 6, 0.2], [500, 320, 5, 0.4], [340, 270, 4, 0.6], [462, 262, 4, 0.8],
  [575, 140, 12, 1], [235, 175, 9, 1.1], [620, 610, 10, 1.2], [180, 600, 8, 1.3],
];

// Terälehtiryhmä: jokaisella oma auki- ja kiinni-kulma (CSS-muuttujat --o ja --c)
function Petals({ list, fill }: { list: (typeof PETALS)["back"]; fill: string }) {
  return (
    <>
      {list.map(([open, closed, length, width]) => (
        <path
          key={`${open}-${length}`}
          className="br-petal"
          style={{ "--o": `${open}deg`, "--c": `${closed}deg` } as React.CSSProperties}
          d={petalPath(PETAL_BASE.x, PETAL_BASE.y, length, width)}
          fill={fill}
          stroke="#c99a6a"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      ))}
    </>
  );
}

function Lotus() {
  return (
    <svg viewBox="0 0 800 820" className="block size-full overflow-visible" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="br-kulta" gradientUnits="userSpaceOnUse" x1="120" y1="100" x2="680" y2="720">
          <stop offset="0" stopColor="#8a6524" /><stop offset=".16" stopColor="#e8cb7c" /><stop offset=".26" stopColor="#fff2c4" />
          <stop offset=".38" stopColor="#b08436" /><stop offset=".52" stopColor="#f1d995" /><stop offset=".6" stopColor="#fff5d3" />
          <stop offset=".72" stopColor="#a0762b" /><stop offset=".86" stopColor="#e8cc80" /><stop offset="1" stopColor="#7e5b1e" />
        </linearGradient>
        <radialGradient id="br-hehku" cx="400" cy="470" r="200" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff8e2" /><stop offset=".45" stopColor="#ffefc8" stopOpacity=".55" /><stop offset="1" stopColor="#ffefc8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="br-laikku" cx="400" cy="420" r="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ead9ec" /><stop offset=".6" stopColor="#d8c8e8" stopOpacity=".7" /><stop offset="1" stopColor="#d8c8e8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="br-lehti" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b98ec4" /><stop offset=".45" stopColor="#e3c4dd" /><stop offset="1" stopColor="#fbeef2" /></linearGradient>
        <linearGradient id="br-taka" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9f7ab8" /><stop offset="1" stopColor="#e2cde6" /></linearGradient>
        <linearGradient id="br-etu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9b1d3" /><stop offset=".5" stopColor="#f4e0ec" /><stop offset="1" stopColor="#fff8f6" /></linearGradient>
      </defs>

      {/* Pehmeä laikku taustalla (ei suodinta: kevyt piirtää vierittäessä) */}
      <circle cx="400" cy="420" r="300" fill="url(#br-laikku)" />
      <g className="br-ring-outer" fill="none" stroke="url(#br-kulta)" strokeWidth="1.3">
        <path d={outerRing} />
        <g fill="url(#br-kulta)" stroke="none">
          {beads.map(([x, y]) => <circle key={`${x}`} cx={x.toFixed(1)} cy={y.toFixed(1)} r="2.6" />)}
        </g>
      </g>
      <g className="br-ring-inner" fill="none" stroke="url(#br-kulta)" strokeWidth="1">
        <path d={innerRing} />
        <circle cx="400" cy="410" r="165" strokeWidth="1.4" />
      </g>
      <g className="br-stars">
        {STARS.map(([x, y, r, d]) => (
          <path key={`${x}-${y}`} style={{ "--d": d } as React.CSSProperties} d={starPath(x, y, r)} fill={r > 7 ? "url(#br-kulta)" : "#fffaf0"} />
        ))}
      </g>
      <ellipse className="br-glow" cx="400" cy="470" rx="200" ry="170" fill="url(#br-hehku)" />
      <Petals list={PETALS.back} fill="url(#br-taka)" />
      <Petals list={PETALS.mid} fill="url(#br-lehti)" />
      <g className="br-stamens" stroke="url(#br-kulta)" strokeWidth="2" strokeLinecap="round">
        {stamens.map((s) => (
          <g key={s.x0.toFixed(1)}>
            <path d={`M${s.x0.toFixed(1)} ${s.y0.toFixed(1)} L${s.x1.toFixed(1)} ${s.y1.toFixed(1)}`} />
            <circle cx={s.x1.toFixed(1)} cy={s.y1.toFixed(1)} r="2.4" fill="#f7dc8f" stroke="none" />
          </g>
        ))}
        <ellipse cx="400" cy="472" rx="44" ry="11" fill="#e9c66f" stroke="none" />
      </g>
      <Petals list={PETALS.front} fill="url(#br-etu)" />
      <Petals list={PETALS.lower} fill="url(#br-lehti)" />
    </svg>
  );
}

export default function BreathScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Vaihe ja hengityksen numero: alkutila sama palvelimella ja selaimessa (hydraatio)
  const [cue, setCue] = useState<{ phase: BreathPhase; breath: number }>({ phase: "alku", breath: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    // Vähennetty liike: ei vierityssidonnaista liikettä, lootus jää auki (--p: 1, oletus)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const raf = { frame: 0, last: "" };
    const update = () => {
      raf.frame = 0;
      const r = track.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      const s = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 1;
      const st = breathState(s);
      section.style.setProperty("--p", st.p.toFixed(4));
      section.style.setProperty("--s", s.toFixed(4));
      const key = `${st.phase}${st.breath}`;
      if (key !== raf.last) {
        raf.last = key;
        setCue({ phase: st.phase, breath: st.breath });
      }
    };
    const onScroll = () => {
      if (!raf.frame) raf.frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf.frame);
    };
  }, []);

  const c = CUES[cue.phase];
  // Valmiit hengitykset: täysi pallo. Meneillään oleva: puolihimmeä.
  const done = cue.phase === "loppu" ? BREATHS : Math.max(0, cue.breath - 1);

  return (
    <section
      id="hengitys"
      ref={sectionRef}
      aria-labelledby="hengitys-otsikko"
      className="breath bg-sand"
      style={{ "--p": 1, "--s": 0 } as React.CSSProperties}
    >
      <div ref={trackRef} className="breath-track">
        <div className="breath-sticky mx-auto grid max-w-6xl items-center gap-6 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
          <div className="breath-text order-2 lg:order-1">
            <p className="mb-1 font-serif text-[22px] italic text-accent">Kokeile nyt</p>
            <h2 id="hengitys-otsikko" className="mb-3 font-serif text-[clamp(2.25rem,5vw,3.25rem)] font-bold leading-[1.05]">
              Hengähdä hetki
            </h2>
            <p className="breath-intro mb-6 max-w-[46ch] text-lg leading-relaxed text-ink-soft">
              Vieritä hitaasti ja anna lootuksen ohjata hengitystä. Kun kukka sulkeutuu, hengitä sisään.
              Kun se avautuu, hengitä ulos.
            </p>

            {/* Vierityksen mukana vaihtuva ohje (vain vieritystilassa) */}
            <div className="breath-dynamic" aria-hidden="true">
              <p className="font-serif text-[clamp(2rem,4.4vw,2.75rem)] font-bold leading-tight text-accent">{c.title}</p>
              <p className="mt-1 min-h-[3.2em] max-w-[40ch] text-[17px] text-ink-soft">{c.sub}</p>
              <ol className="mt-4 flex gap-2" aria-label="Hengitykset">
                {Array.from({ length: BREATHS }, (_, i) => (
                  <li
                    key={i}
                    className={`size-2.5 rounded-full border-[1.5px] border-[#b8975a] ${
                      i < done ? "bg-[#b8975a]" : i === cue.breath - 1 ? "bg-[#b8975a]/40" : ""
                    }`}
                  />
                ))}
              </ol>
              <div className="mt-5 h-[3px] w-40 overflow-hidden rounded-full bg-line">
                <span className="block h-full w-[calc(var(--s)*100%)] bg-[#b8975a]" />
              </div>
            </div>

            {/* Sama ohje listana: vähennetty liike ja ilman JavaScriptiä */}
            <ol className="breath-static list-decimal space-y-1.5 pl-5 text-[17px] text-ink-soft marker:font-semibold marker:text-accent">
              <li>Istu mukavasti ja rentouta hartiat.</li>
              <li>Hengitä nenän kautta sisään rauhallisesti, noin neljä sekuntia.</li>
              <li>Hengitä ulos hitaasti, noin kuusi sekuntia, ja päästä irti.</li>
              <li>Toista kolme kertaa.</li>
            </ol>

            <p className={`breath-end mt-6 ${cue.phase === "loppu" ? "is-on" : ""}`}>
              <a
                href={withBase("/#kalenteri")}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-7 text-[17px] font-semibold text-white shadow-[0_10px_24px_rgba(78,49,146,0.25)] transition hover:opacity-90"
              >
                Tule kokemaan koko tunti <span aria-hidden="true">→</span>
              </a>
            </p>
            <p className="mt-4 text-sm text-muted">Jos alkaa huimata, palaa omaan rytmiisi.</p>
          </div>

          <div className="breath-art order-1 mx-auto aspect-[800/820] w-full max-w-[min(560px,40svh)] lg:order-2 lg:max-w-[560px]">
            <Lotus />
          </div>
        </div>
      </div>
    </section>
  );
}
