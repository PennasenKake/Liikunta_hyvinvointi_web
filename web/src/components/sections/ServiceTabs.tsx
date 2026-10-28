// ServiceTabs.tsx: Liikunta/Hyvinvointi-välilehdet ja palvelulista.
// Client Component, koska valittu välilehti on tilaa ja vaihtuu klikkauksella.
// Toteutus noudattaa WAI-ARIA Tabs -mallia: ruudunlukija tunnistaa välilehdet,
// ja nuolinäppäimet siirtävät valintaa.
//
// Välilehti on sidottu osoitteen #-osaan:
//   /#liikunta    → Liikunta-välilehti auki
//   /#hyvinvointi → Hyvinvointi-välilehti auki
// Näin valikon linkit, pikalinkit ja jaetut linkit avaavat oikean välilehden.
"use client";

import { useEffect, useRef, useState } from "react";
import type { ServiceCategory } from "@/lib/services";
import ServiceCard from "./ServiceCard";

type Props = {
  categories: ServiceCategory[];
};

export default function ServiceTabs({ categories }: Props) {
  // Valitun välilehden indeksi (0 = Liikunta)
  const [active, setActive] = useState(0);

  // Viittaukset välilehtipainikkeisiin, jotta fokus voidaan siirtää nuolinäppäimillä.
  // useRef säilyttää arvon renderöintien välillä aiheuttamatta uutta renderöintiä.
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Synkronoi välilehti osoitteen #-osaan.
  // 1) Heti latautuessa: jaettu linkki tahkonamanda.fi/#hyvinvointi avaa oikean välilehden.
  // 2) hashchange: valikon tai pikalinkin klikkaus vaihtaa välilehteä ilman sivun latausta.
  // Paluufunktio poistaa kuuntelijan, kun komponentti poistuu.
  useEffect(() => {
    const sync = () => {
      const i = categories.findIndex((c) => `#${c.id}` === window.location.hash);
      if (i !== -1) setActive(i); // Muu hash (esim. #hinnasto) ei muuta välilehteä
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [categories]);

  // Välilehden valinta klikkauksella tai nuolinäppäimellä.
  // replaceState päivittää osoitteen #-osan ilman vieritystä ja ilman uutta
  // selainhistorian merkintää. Tärkeä reunatapaus: jos osoite jäisi #liikunta-tilaan
  // käyttäjän valittua Hyvinvoinnin, valikon "Liikunta"-linkki ei laukaisisi
  // hashchange-tapahtumaa (osoite ei muutu), eikä välilehti vaihtuisi takaisin.
  function select(i: number) {
    setActive(i);
    history.replaceState(null, "", `#${categories[i].id}`);
  }

  // Nuoli oikealle/vasemmalle vaihtaa välilehteä. Modulo (%) kiertää
  // viimeisestä ensimmäiseen ja päinvastoin.
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (active + dir + categories.length) % categories.length;
    select(next);
    tabRefs.current[next]?.focus();
  }

  const current = categories[active];

  return (
    <div>
      {/* role="tablist" kertoo ruudunlukijalle, että painikkeet ovat välilehtiä */}
      <div
        role="tablist"
        aria-label="Palveluryhmä"
        onKeyDown={onKeyDown}
        className="mb-8 inline-flex gap-1 rounded-lg bg-lilac-soft p-1"
      >
        {categories.map((cat, i) => {
          const selected = i === active;
          return (
            <button
              key={cat.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${cat.id}`}
              aria-selected={selected}
              aria-controls={`paneeli-${cat.id}`}
              // Vain valittu välilehti on Tab-näppäimellä saavutettava (tabIndex 0),
              // muihin siirrytään nuolilla. Tämä on WAI-ARIA-mallin mukaista.
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
              className={`min-h-11 rounded-md px-5 font-semibold transition ${
                selected ? "bg-accent text-white" : "text-ink hover:bg-lilac"
              }`}
            >
              {cat.label} ({cat.services.length})
            </button>
          );
        })}
      </div>

      {/* Valitun välilehden sisältö. aria-labelledby yhdistää paneelin välilehteensä. */}
      <div role="tabpanel" id={`paneeli-${current.id}`} aria-labelledby={`tab-${current.id}`}>
        {/* Kortit ruudukossa: 1 sarake mobiilissa, 2 tabletilla, 3 työpöydällä.
            Lista (<ul>), jotta ruudunlukija kertoo palvelujen määrän. */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {current.services.map((s) => (
            <li key={s.title}>
              <ServiceCard service={s} tone={current.id === "liikunta" ? "lilac" : "sky"} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
