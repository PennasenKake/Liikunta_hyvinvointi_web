// HeroSlides.tsx: heron vaihtuvat taustakuvat (Hero C ja D).
// Kuvat vaihtuvat ristiinhäivytyksellä ja zoomautuvat hitaasti (index.css: .hero-kb).
//
// Suorituskyky: vain ensimmäinen kuva on sivun HTML:ssä ja ladataan heti (LCP-kuva).
// Muut kuvat lisätään vasta, kun sivu on latautunut, joten ne eivät kilpaile
// ensimmäisen kuvan ja fonttien kanssa kaistasta. Niiden vuoro tulee vasta 6 ja 12 sekunnin kohdalla.
// Vähennetty liike: näytetään vain ensimmäinen kuva, joten muita ei ladata lainkaan.

import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/photos";

type Slide = { photo: Photo; position: string }; // position: Tailwindin object-position-luokka

// Kuvien vuorot sekunteina ensimmäisen kuvan aikajanalla (vastaa index.css:n viiveitä -1s, 5s, 11s)
const OFFSETS = [6, 12];

export default function HeroSlides({ slides }: { slides: Slide[] }) {
  const firstRef = useRef<HTMLImageElement>(null);
  // delays = muiden kuvien animaatioviiveet. null = kuvia ei ole vielä lisätty.
  const [delays, setDelays] = useState<number[] | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = { id: 0 };
    const add = () => {
      // Ensimmäisen kuvan animaatio on jo käynnissä: lasketaan, kuinka pitkällä se on,
      // jotta seuraavat kuvat tulevat esiin täsmälleen oikealla hetkellä.
      const anim = firstRef.current?.getAnimations()[0];
      const t = typeof anim?.currentTime === "number" ? anim.currentTime / 1000 : 0;
      setDelays(OFFSETS.map((o) => o - t));
    };
    const schedule = () => {
      timer.id = window.setTimeout(add, 300); // Pieni tauko latauksen jälkeen: selain ehtii piirtää rauhassa
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      window.clearTimeout(timer.id);
    };
  }, []);

  const [first, ...rest] = slides;
  return (
    <>
      <img
        ref={firstRef}
        className={`hero-kb ${first.position}`}
        src={first.photo.src}
        srcSet={first.photo.srcSet}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        decoding="async"
      />
      {delays &&
        rest.map((s, i) => (
          <img
            key={s.photo.src}
            className={`hero-kb ${s.position}`}
            style={{ animationDelay: `${delays[i]}s` }}
            src={s.photo.src}
            srcSet={s.photo.srcSet}
            sizes="100vw"
            alt=""
            decoding="async"
          />
        ))}
    </>
  );
}
