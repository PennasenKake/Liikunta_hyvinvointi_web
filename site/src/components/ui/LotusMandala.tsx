// LotusMandala.tsx: lootusmandala-koriste (oma piirros, ei kuvapankkia).
//
// Neljä päällekkäistä SVG-kerrosta (public/koristeet/), jotta kehät voivat pyöriä erikseen:
//   tausta    vesivärisävy ja irtotähdet (paikallaan)
//   ulkokehä  terävät kaaret ja helmet (pyörii hitaasti myötäpäivään)
//   sisäkehä  terälehtirengas ja tähdet (pyörii vielä hitaammin vastapäivään)
//   keskus    tähtitaivas, Tahkon siluetti ja lootus (paikallaan)
// Kaikilla kerroksilla on sama viewBox, joten ne asettuvat täsmälleen päällekkäin.
//
// Saavutettavuus (index.css: .lotus-mandala):
// - Koriste: aria-hidden ja alt="", ruudunlukija ohittaa sen.
// - pointer-events-none ja -z-10: aina tekstin alla, ei estä klikkauksia eikä tekstin valintaa.
// - Pyörintä vain, jos kävijä ei ole rajoittanut animaatioita (prefers-reduced-motion).
// - Suuri kontrasti (prefers-contrast: more, Windowsin forced-colors): koriste piilotetaan.
// Sijoita mandala niin, ettei se ole tekstin alla (esim. puoliksi osion reunan yli).

import { withBase } from "@/lib/paths";

const layers = [
  { name: "tausta", spin: "" },
  { name: "ulkokeha", spin: "mandala-spin" },
  { name: "sisakeha", spin: "mandala-spin-rev" },
  { name: "keskus", spin: "" },
];

export default function LotusMandala({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`lotus-mandala pointer-events-none absolute -z-10 aspect-[800/820] select-none ${className}`}>
      {layers.map((l) => (
        <img
          key={l.name}
          src={withBase(`/koristeet/mandala-${l.name}.svg`)}
          alt=""
          width={800}
          height={820}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 size-full ${l.spin}`}
        />
      ))}
    </div>
  );
}
