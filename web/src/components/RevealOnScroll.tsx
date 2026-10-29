// RevealOnScroll.tsx: paljastusanimaatio vieritettäessä (sama malli kuin GlossTahkon sivustolla).
// Sisältö liukuu pehmeästi näkyviin, kun se tulee ruudulle.
//
// Käyttö: lisää elementille `data-reveal` (liuku ylös + häivytys) tai `data-reveal="fade"` (vain häivytys).
// Valinnainen `data-delay="300"` kiinnittää viiveen millisekunteina. Muuten samaan aikaan
// ruudulle tulevat porrastetaan automaattisesti. Ulkoasu: globals.css (Paljastus).
//
// Turvallisuusverkot:
// - Ilman JavaScriptiä kaikki näkyy: piilotus vaatii html.has-js -luokan (layout.tsx).
// - Vähennetty liike (prefers-reduced-motion): kaikki näkyy heti.
// - Paljastuksen jälkeen attribuutit poistetaan, jottei siirtymä häiritse elementin omia hover-tehosteita.
// - Sivun vaihtuessa (usePathname) uuden sivun elementit otetaan seurantaan.
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL = {
  rootMargin: "0px 0px -10% 0px", // Paljastus vähän ennen ruudun alareunaa
  staggerMs: 110,                 // Porrastus samaan aikaan tulevien välillä
  maxSteps: 6,                    // Enintään 6 porrasta, ettei viimeinen odota liian kauan
  cleanupAfterMs: 1600,           // Pisin siirtymä (1,2 s) + varaa
};

export default function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-rv])"));
    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window);

    if (reduce) {
      items.forEach((el) => el.setAttribute("data-rv", "now"));
      return;
    }

    const timers: number[] = [];

    // Paljastuksen jälkeen siivotaan attribuutit pois
    const finish = (el: HTMLElement, afterMs: number) => {
      timers.push(
        window.setTimeout(() => {
          el.removeAttribute("data-reveal");
          el.removeAttribute("data-rv");
          el.removeAttribute("data-delay");
          el.style.removeProperty("--rv-delay");
        }, afterMs),
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // Ruudulle tulevat ylhäältä alas ja vasemmalta oikealle, porrastettuna
        entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top ||
              a.boundingClientRect.left - b.boundingClientRect.left,
          )
          .forEach((entry, index) => {
            const el = entry.target as HTMLElement;
            const fixed = Number(el.dataset.delay);
            const delay = Number.isFinite(fixed) && el.dataset.delay ? fixed : Math.min(index, REVEAL.maxSteps) * REVEAL.staggerMs;
            el.style.setProperty("--rv-delay", `${delay}ms`);
            el.setAttribute("data-rv", "in");
            observer.unobserve(el);
            finish(el, delay + REVEAL.cleanupAfterMs);
          });

        // Jo ohitetut (esim. ankkurilinkillä hypätty ohi): näytetään heti ilman animaatiota
        entries
          .filter((e) => !e.isIntersecting && e.boundingClientRect.top < 0)
          .forEach((entry) => {
            const el = entry.target as HTMLElement;
            el.setAttribute("data-rv", "now");
            observer.unobserve(el);
            finish(el, 50);
          });
      },
      { rootMargin: REVEAL.rootMargin },
    );

    items.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [pathname]);

  return null; // Ei omaa näkyvää sisältöä
}
