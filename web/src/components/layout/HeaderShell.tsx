// HeaderShell.tsx: yläpalkin vierityskäyttäytyminen.
// Client Component, joka käärii palvelimella renderöidyn sisällön (children).
// Näin vain vierityslogiikka on selaimen JavaScriptiä, ei koko yläpalkki.
//
// Toiminta (kuten fitis.fi):
// 1. Sivun yläreunassa palkki on täysikokoinen.
// 2. Kun sivua vieritetään, palkki pienenee (data-scrolled).
// 3. Alas vieritettäessä palkki liukuu piiloon, jotta sisältö saa koko näytön (data-hidden).
// 4. Heti kun vieritetään ylöspäin, palkki palaa näkyviin.
//
// Tila välitetään lapsielementeille data-attribuutteina. Header.tsx käyttää niitä
// Tailwindin group-data-variantilla, esim. group-data-[scrolled=true]/header:size-12.
"use client";

import { useEffect, useRef, useState } from "react";

const SHRINK_AFTER = 24; // px: tämän jälkeen palkki pienenee
const HIDE_AFTER = 240;  // px: palkkia ei piiloteta ihan sivun alussa (Hero näkyy vielä)
const MIN_DELTA = 6;     // px: pientä tärinää (esim. kosketusnäytön liike) ei tulkita suunnanvaihdoksi

export default function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    // requestAnimationFrame: tila päivitetään korkeintaan kerran ruudunpäivitystä kohden,
    // vaikka scroll-tapahtumia tulisi kymmeniä sekunnissa (suorituskyky).
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > SHRINK_AFTER);

      const delta = y - lastY;
      if (y < HIDE_AFTER) {
        setHidden(false);
      } else if (Math.abs(delta) > MIN_DELTA) {
        // Näppäimistökäyttäjä: jos fokus on palkissa (esim. alavalikossa), palkkia ei piiloteta
        const focusInside = headerRef.current?.contains(document.activeElement) ?? false;
        setHidden(delta > 0 && !focusInside);
      }
      if (Math.abs(delta) > MIN_DELTA) lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update(); // Oikea tila heti, jos sivu ladataan keskeltä (esim. /#hinnasto)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* fixed: palkki on sivun päällä eikä vie tilaa sisällön virrasta, joten sen pieneneminen
          ei siirrä sisältöä (ei hyppimistä). Piilotus: liu'utus ylös oman korkeuden verran.
          onFocus: kun näppäimistöllä siirrytään palkkiin, se tulee aina näkyviin. */}
      <header
        ref={headerRef}
        data-scrolled={scrolled}
        data-hidden={hidden}
        onFocus={() => setHidden(false)}
        className="group/header fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-linear-to-r from-royal to-accent text-white shadow-[0_4px_20px_rgba(26,68,174,0.25)] transition-transform duration-300 ease-out motion-reduce:transition-none data-[hidden=true]:-translate-y-full"
      >
        {children}
      </header>
      {/* Välike täysikokoisen palkin korkuinen (84 px mobiili, 104 px työpöytä),
          jotta sivun alku ei jää fixed-palkin alle. */}
      <div aria-hidden="true" className="h-21 lg:h-26" />
    </>
  );
}
