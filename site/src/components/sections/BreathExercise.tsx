// BreathExercise.tsx: "Hengähdä hetki" – ajastettu 4–7–8-hengitysharjoitus.
// Kävijä painaa Aloita, ja lootus ohjaa hengitystä: sisäänhengitys (4 s) kokoaa terälehdet
// nupuksi, pidätys (7 s) pitää nupun kiinni ja uloshengitys (8 s) avaa kukan. Neljä kierrosta,
// sitten kutsu tunnille.
//
// Tahdissa pysyminen: teksti, laskuri, edistymispalkki ja kukka lasketaan samasta kellosta
// (lib/lotus.ts: breathAt) samassa animaatioruudussa. Kukka liikkuu CSS-muuttujan --p kautta,
// joten React piirtää uudelleen vain kerran sekunnissa (laskurin vaihtuessa).
//
// Saavutettavuus ja varatilat:
// - Ilman JavaScriptiä Aloita-painike on piilossa ja ohje näkyy listana.
// - Vähennetty liike: harjoitus toimii (teksti ja laskuri), mutta kukka ja kehät pysyvät paikallaan.
// - Vaiheen nimi luetaan ruudunlukijalla (aria-live), sekuntilaskuria ei (se olisi liian puhelias).
// - Harjoitus pysähtyy, jos välilehti vaihtuu, ja jatkuu samasta kohdasta palatessa.

import { useEffect, useRef, useState } from "react";
import { BREATHS, PETAL_BASE, PETALS, TOTAL, beads, breathAt, innerRing, outerRing, petalPath, stamens, starPath, type BreathPhase } from "@/lib/lotus";
import { withBase } from "@/lib/paths";

const CUES: Record<Exclude<BreathPhase, "loppu">, { title: string; sub: string }> = {
  valmis: { title: "Valmistaudu", sub: "Istu mukavasti ja puhalla kaikki ilma ulos suun kautta." },
  sisaan: { title: "Hengitä sisään", sub: "Nenän kautta hiljaa. Lootus kokoaa terälehtensä." },
  pidata: { title: "Pidätä", sub: "Lootus lepää kiinni." },
  ulos: { title: "Hengitä ulos", sub: "Suun kautta pitkään huokaisten. Lootus avautuu." },
};

const MINUTES = `${Math.floor(TOTAL / 60)} min ${TOTAL % 60} s`;

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

type Status = "idle" | "running" | "done";
type Cue = { phase: BreathPhase; breath: number; count: number; length: number };

export default function BreathExercise() {
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [cue, setCue] = useState<Cue>({ phase: "valmis", breath: 0, count: 1, length: 3 });

  // Ajastin: käynnissä vain kun status = running
  useEffect(() => {
    const section = sectionRef.current;
    if (status !== "running" || !section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = { start: performance.now(), pausedAt: 0, frame: 0, last: "" };

    const tick = (now: number) => {
      const elapsed = (now - clock.start) / 1000;
      const st = breathAt(elapsed);
      if (!reduce) {
        section.style.setProperty("--p", st.p.toFixed(4));
        section.style.setProperty("--s", (elapsed / TOTAL).toFixed(4));
      }
      section.style.setProperty("--q", st.progress.toFixed(4));
      const key = `${st.phase}${st.breath}${st.count}`;
      if (key !== clock.last) {
        clock.last = key;
        setCue({ phase: st.phase, breath: st.breath, count: st.count, length: st.length });
      }
      if (st.phase === "loppu") {
        setStatus("done");
        return;
      }
      clock.frame = requestAnimationFrame(tick);
    };
    // Välilehti piiloon: tauko. Takaisin: jatketaan samasta kohdasta.
    const onVisibility = () => {
      if (document.hidden) {
        clock.pausedAt = performance.now();
        cancelAnimationFrame(clock.frame);
      } else if (clock.pausedAt) {
        clock.start += performance.now() - clock.pausedAt;
        clock.pausedAt = 0;
        clock.frame = requestAnimationFrame(tick);
      }
    };
    clock.frame = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(clock.frame);
      document.removeEventListener("visibilitychange", onVisibility);
      // Ajastin pysähtyy (Lopeta, loppu tai osio poistuu): kukka takaisin auki.
      // Tässä eikä painikkeessa, jotta viimeinen animaatioruutu ei ehdi sulkea kukkaa uudelleen.
      section.style.setProperty("--p", "1");
      section.style.setProperty("--q", "0");
    };
  }, [status]);

  // Aloitus: osio ruudulle niin, että lootus ja ohje näkyvät yhtä aikaa (puhelimessa allekkain)
  const start = () => setStatus("running");

  // Aloituksen jälkeen (kun harjoitusnäkymä on piirretty): vieritetään niin, että lootus ja
  // ohje näkyvät yhtä aikaa. Kapealla näytöllä lootuksen yläreuna heti yläpalkin alle,
  // leveällä koko osio ruudun keskelle. Lasketaan vasta piirron jälkeen, koska näkymän
  // korkeus muuttuu aloitettaessa (ohjelista vaihtuu laskuriin).
  const artRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (status !== "running") return;
    const section = sectionRef.current;
    const art = artRef.current;
    if (!section || !art) return;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    // Yläpalkin koko korkeus: palkki voi olla juuri piilossa (piiloutuu alas vieritettäessä),
    // mutta palaa näkyviin, kun sivua vieritetään ylöspäin.
    const header = document.querySelector("header")?.offsetHeight ?? 0;
    const target = wide
      ? section.getBoundingClientRect().top + window.scrollY - Math.max(0, (window.innerHeight - section.offsetHeight) / 2)
      : art.getBoundingClientRect().top + window.scrollY - header - 12;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
  }, [status]);

  // Lopetus tai uusi aloitus: kukka takaisin auki
  const reset = (next: Status) => {
    setCue({ phase: "valmis", breath: 0, count: 1, length: 3 });
    if (next === "running") start();
    else setStatus(next);
  };

  const running = status === "running";
  const c = cue.phase === "loppu" ? null : CUES[cue.phase];
  const done = status === "done" ? BREATHS : Math.max(0, cue.breath - 1);
  const btn = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-[17px] font-semibold transition";

  return (
    <section
      id="hengitys"
      ref={sectionRef}
      aria-labelledby="hengitys-otsikko"
      className="breath scroll-mt-16 bg-sand px-5 py-10 sm:px-8 lg:scroll-mt-0 lg:py-24"
      style={{ "--p": 1, "--s": 0, "--q": 0 } as React.CSSProperties}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-4 lg:min-h-[calc(100svh-12rem)] lg:grid-cols-[1fr_1.05fr] lg:gap-12">
        <div className="order-2 lg:order-1">
          <p className={`mb-1 font-serif text-[22px] italic text-accent ${running ? "max-lg:hidden" : ""}`}>Kokeile nyt</p>
          <h2 id="hengitys-otsikko" className="mb-3 font-serif text-[clamp(2.25rem,5vw,3.25rem)] font-bold leading-[1.05]">
            Hengähdä hetki
          </h2>
          {/* Harjoituksen aikana puhelimessa johdanto piiloon: lootus ja ohje mahtuvat yhdelle ruudulle */}
          <p className={`mb-6 max-w-[46ch] text-lg leading-relaxed text-ink-soft ${running ? "max-lg:hidden" : ""}`}>
            Keho tarvitsee liikettä ja lepoa. Tämä rauhoittava 4–7–8-hengitys vie noin minuutin:
            sisään neljä, pidätä seitsemän, ulos kahdeksan.
          </p>

          {running && c ? (
            <div>
              {/* Vaiheen nimi luetaan ruudunlukijalla, laskuri ei */}
              <div aria-live="polite" aria-atomic="true">
                <p className="font-serif text-[clamp(2rem,4.4vw,2.75rem)] font-bold leading-tight text-accent">{c.title}</p>
              </div>
              <div className="mt-1 flex items-end gap-4" aria-hidden="true">
                <span className="font-serif text-[clamp(3.5rem,8vw,5rem)] font-bold leading-none tabular-nums text-ink">{cue.count}</span>
                <span className="pb-2 text-lg text-muted">/ {cue.length}</span>
              </div>
              <p className="mt-2 min-h-[3em] max-w-[40ch] text-[17px] text-ink-soft">{c.sub}</p>
              {/* Vaiheen edistyminen (--q) ja kierrokset */}
              <div className="mt-3 h-1 w-full max-w-xs overflow-hidden rounded-full bg-line" aria-hidden="true">
                <span className="block h-full w-full origin-left scale-x-[var(--q)] bg-[#b8975a]" />
              </div>
              <div className="mt-4 flex items-center gap-4">
                <ol className="flex gap-2" aria-label={`Kierros ${Math.max(1, cue.breath)} / ${BREATHS}`}>
                  {Array.from({ length: BREATHS }, (_, i) => (
                    <li
                      key={i}
                      className={`size-2.5 rounded-full border-[1.5px] border-[#b8975a] ${
                        i < done ? "bg-[#b8975a]" : i === cue.breath - 1 ? "bg-[#b8975a]/40" : ""
                      }`}
                    />
                  ))}
                </ol>
                <button type="button" onClick={() => reset("idle")} className="min-h-11 px-2 text-[15px] font-semibold text-accent underline-offset-4 hover:underline">
                  Lopeta
                </button>
              </div>
            </div>
          ) : status === "done" ? (
            <div aria-live="polite">
              <p className="font-serif text-[clamp(2rem,4.4vw,2.75rem)] font-bold leading-tight text-accent">Hyvä.</p>
              <p className="mt-1 max-w-[40ch] text-[17px] text-ink-soft">Tämä on lepoa. Keho tarvitsee sitä yhtä paljon kuin liikettä.</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href={withBase("/#kalenteri")} className={`${btn} bg-accent text-white shadow-[0_10px_24px_rgba(78,49,146,0.25)] hover:opacity-90`}>
                  Tule kokemaan koko tunti <span aria-hidden="true">→</span>
                </a>
                <button type="button" onClick={() => reset("running")} className={`${btn} border border-border bg-white text-accent hover:bg-lilac-soft`}>
                  Uudelleen
                </button>
              </div>
            </div>
          ) : (
            <div>
              <ol className="list-decimal space-y-1.5 pl-5 text-[17px] text-ink-soft marker:font-semibold marker:text-accent">
                <li>Istu mukavasti ja puhalla kaikki ilma ulos suun kautta.</li>
                <li>Hengitä nenän kautta sisään ja laske neljään.</li>
                <li>Pidätä hengitystä ja laske seitsemään.</li>
                <li>Hengitä suun kautta ulos huokaisten ja laske kahdeksaan.</li>
                <li>Toista neljä kertaa.</li>
              </ol>
              <button
                type="button"
                onClick={start}
                className={`breath-start mt-6 ${btn} bg-accent text-white shadow-[0_10px_24px_rgba(78,49,146,0.25)] hover:opacity-90`}
              >
                Aloita harjoitus <span className="font-normal opacity-80">({MINUTES})</span>
              </button>
            </div>
          )}
          <p className="mt-5 text-sm text-muted">Jos alkaa huimata, palaa omaan rytmiisi.</p>
        </div>

        {/* Harjoituksen aikana kapealla näytöllä pienempi lootus: kukka, laskuri ja ohje mahtuvat ruudulle */}
        <div
          ref={artRef}
          className={`breath-art order-1 mx-auto aspect-[800/820] w-full lg:order-2 lg:max-w-[540px] ${running ? "max-w-[min(420px,33svh)]" : "max-w-[min(520px,40svh)]"}`}
        >
          <Lotus />
        </div>
      </div>
    </section>
  );
}
