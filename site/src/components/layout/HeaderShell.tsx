// HeaderShell.tsx: yläpalkin vierityskäyttäytyminen.
// Interaktiivinen kääre yläpalkin sisällölle (children).
// Näin vain vierityslogiikka on selaimen JavaScriptiä, ei koko yläpalkki.
//
// Toiminta (kuten fitis.fi):
// 1. Sivun yläreunassa palkki on täysikokoinen.
// 2. Kun sivua vieritetään, palkki pienenee (data-scrolled).
// 3. Alas vieritettäessä palkki liukuu piiloon, jotta sisältö saa koko näytön (data-hidden).
// 4. Heti kun vieritetään ylöspäin, palkki palaa näkyviin.
// 5. Hiirellä: kun osoitin viedään ruudun yläreunaan, piilossa oleva palkki tulee esiin,
//    ja se pysyy näkyvissä niin kauan kuin osoitin on palkin päällä. Näin pienennetyn
//    palkin linkkejä voi klikata vierittämättä ylös. Kosketusnäytöillä tätä ei käytetä
//    (ei hover-tilaa), niillä palkki palaa ylöspäin vieritettäessä.
//
// Tila välitetään lapsielementeille data-attribuutteina. Header.tsx käyttää niitä
// Tailwindin group-data-variantilla, esim. group-data-[scrolled=true]/header:size-12.

import { useEffect, useRef, useState } from "react";

const SHRINK_AFTER = 24; // px: tämän jälkeen palkki pienenee
const HIDE_AFTER = 240;  // px: palkkia ei piiloteta ihan sivun alussa (Hero näkyy vielä)
const MIN_DELTA = 6;     // px: pientä tärinää (esim. kosketusnäytön liike) ei tulkita suunnanvaihdoksi
const REVEAL_ZONE = 32;  // px: hiiren osoitin näin lähellä ruudun yläreunaa tuo palkin esiin

export default function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  // Onko hiiren osoitin palkin päällä. useRef eikä useState: arvo luetaan vierityksen
  // käsittelijässä, eikä sen muuttuminen saa piirtää palkkia uudelleen.
  const hoverRef = useRef(false);

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
        // Hiiri: jos osoitin on palkin päällä, palkkia ei piiloteta kesken klikkauksen
        const focusInside = headerRef.current?.contains(document.activeElement) ?? false;
        setHidden(delta > 0 && !focusInside && !hoverRef.current);
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

    // Hiiri ruudun yläreunassa → piilotettu palkki esiin. Vain laitteilla, joissa on
    // tarkka osoitin ja hover (hiiri, kosketuslevy), ei puhelimilla.
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMouseMove = (e: MouseEvent) => {
      if (e.clientY <= REVEAL_ZONE) setHidden(false);
    };

    update(); // Oikea tila heti, jos sivu ladataan keskeltä (esim. /#hinnasto)
    window.addEventListener("scroll", onScroll, { passive: true });
    if (canHover) window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
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
        onMouseEnter={() => {
          hoverRef.current = true;
          setHidden(false);
        }}
        onMouseLeave={() => {
          hoverRef.current = false;
        }}
        className="group/header fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-linear-to-r from-royal to-accent text-white shadow-[0_4px_20px_rgba(26,68,174,0.25)] transition-transform duration-300 ease-out motion-reduce:transition-none data-[hidden=true]:-translate-y-full"
      >
        {children}
      </header>
      {/* Välike täysikokoisen palkin korkuinen (84 px mobiili, 104 px työpöytä,
          64 px matalalla näytöllä), jotta sivun alku ei jää fixed-palkin alle. */}
      <div aria-hidden="true" className="h-21 lg:h-26 short:h-16" />
    </>
  );
}
