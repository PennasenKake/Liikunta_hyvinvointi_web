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

  // Kaikki linkit: navigaatio ja Yhteystiedot
  const links = [...site.nav, { label: "Yhteystiedot", href: "#yhteystiedot" }];

  return (
    // lg:hidden piilottaa koko mobiilivalikon isoilla näytöillä
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        // aria-expanded kertoo ruudunlukijalle, onko valikko auki
        aria-expanded={open}
        // aria-controls kertoo, mitä elementtiä painike ohjaa (id alla)
        aria-controls="mobiilivalikko"
        aria-label={open ? "Sulje valikko" : "Avaa valikko"}
        // size-12 = 48 px, eli kosketusalue on riittävän iso sormelle (vähintään 44 px)
        className="flex size-12 items-center justify-center rounded-lg border border-border bg-white"
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
        // inset-x-0: täysi leveys, top-full: alkaa heti headerin alapuolelta.
        <ul
          id="mobiilivalikko"
          className="absolute inset-x-0 top-full border-b border-line bg-surface px-6 pb-5 text-xl font-medium shadow-lg"
        >
          {links.map((item) => (
            <li key={item.href} className="border-b border-line last:border-0">
              <a
                href={item.href}
                // Linkin klikkaus sulkee valikon, jotta kohdeosio jää näkyviin
                onClick={() => setOpen(false)}
                className="block py-3"
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