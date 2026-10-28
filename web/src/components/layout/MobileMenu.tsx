// MobileMenu.tsx: hampurilaisvalikko pienille näytöille.
// "use client" tekee tästä Client Componentin, koska tarvitsemme
// tilan (auki/kiinni), klikkaukset ja näppäimistötapahtumat.
"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

export default function MobileMenu() {
  // open = onko valikko auki. setOpen päivittää tilan ja piirtää komponentin uudelleen.
  const [open, setOpen] = useState(false);

  // Esc-näppäin sulkee valikon (saavutettavuus: näppäimistökäyttäjät).
  // useEffect ajetaan, kun "open" muuttuu. Kuuntelija lisätään vain, kun valikko on auki,
  // ja paluufunktio poistaa sen, jottei kuuntelijoita kerry muistiin.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Kaikki linkit: navigaatio ja Yhteystiedot (molemmat site.ts:stä)
  const links = [...site.nav, site.contact];

  return (
    // lg:hidden piilottaa koko mobiilivalikon isoilla näytöillä
    <div className="shrink-0 lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        // aria-expanded kertoo ruudunlukijalle, onko valikko auki
        aria-expanded={open}
        // aria-controls kertoo, mitä elementtiä painike ohjaa (id alla)
        aria-controls="mobiilivalikko"
        aria-label={open ? "Sulje valikko" : "Avaa valikko"}
        // size-12 = 48 px kosketusalue. Läpikuultava valkoinen sopii siniseen palkkiin.
        className="flex size-12 items-center justify-center rounded-lg border border-white/40 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {/* Kuvake vaihtuu: kaksi viivaa ↔ rasti */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M8 16h12" />}
        </svg>
      </button>

      {/* Valikko renderöidään vain, kun open on true (ehdollinen renderöinti) */}
      {open && (
        // absolute: valikko asettuu headerin alle muun sisällön päälle.
        // Sama liukuväri kuin palkissa, jotta valikko jatkaa sitä saumattomasti.
        <ul
          id="mobiilivalikko"
          className="absolute inset-x-0 top-full border-b border-white/10 bg-linear-to-r from-royal to-accent px-6 pb-5 text-xl font-medium text-white shadow-lg"
        >
          {links.map((item) => (
            <li key={item.href} className="border-b border-white/15 last:border-0">
              <a
                href={item.href}
                // Linkin klikkaus sulkee valikon, jotta kohdeosio jää näkyviin
                onClick={() => setOpen(false)}
                className="block py-3 focus-visible:outline-2 focus-visible:outline-white"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
