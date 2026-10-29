// MobileMenu.tsx: hampurilaisvalikko pienille näytöille.
// "use client" tekee tästä Client Componentin, koska tarvitsemme
// tilan (auki/kiinni), klikkaukset ja näppäimistötapahtumat.
//
// Toiminta (kuten fitis.fi):
// - Valikko aukeaa yläpalkin alle, ja muu sivu tummuu taustalla.
// - Liikunta ja Hyvinvointi -kohdissa on nuoli, josta aukeaa palvelulista.
// - Sulkeutuu: rastista, Esc-näppäimestä, tummennetun taustan klikkauksesta tai linkin valinnasta.
// - Sivun vieritys on estetty, kun valikko on auki, jottei tausta liiku sormen alla.
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ServiceIcon from "@/components/ui/ServiceIcon";
import type { ServiceIconName } from "@/lib/services";
import { withBase } from "@/lib/paths";

// Valikon kohta. children = alavalikon linkit (vain Liikunnalla ja Hyvinvoinnilla).
export type MenuItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; icon: ServiceIconName }[];
};

export default function MobileMenu({ items }: { items: MenuItem[] }) {
  // open = onko valikko auki. expanded = minkä kohdan alavalikko on auki (href tai null).
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Esc sulkee valikon, ja sivun vieritys estetään valikon ollessa auki.
  // Paluufunktio palauttaa vierityksen ja poistaa kuuntelijan, kun valikko suljetaan.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setExpanded(null);
  };

  return (
    // lg:hidden piilottaa koko mobiilivalikon isoilla näytöillä
    <div className="shrink-0 lg:hidden">
      <button
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
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

      {/* Tummennettu tausta. createPortal piirtää sen suoraan <body>-elementtiin yläpalkin
          ulkopuolelle, jotta se peittää sivun mutta jää palkin (z-50) alle (z-40). */}
      {open &&
        createPortal(
          <div aria-hidden="true" onClick={close} className="fixed inset-0 z-40 bg-ink/50" />,
          document.body,
        )}

      {/* Valikkopaneeli: valkoinen, palkin alla. max-h + overflow: pitkä lista vierii paneelin sisällä. */}
      {open && (
        <div
          id="mobiilivalikko"
          className="absolute inset-x-0 top-full max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/10 bg-white text-ink shadow-xl"
        >
          <ul className="px-6 py-3 text-lg font-medium">
            {items.map((item) => {
              const isOpen = expanded === item.href;
              const subId = `alavalikko-${item.href.replace(/\W/g, "")}`;
              return (
                <li key={item.href} className="border-b border-line last:border-0">
                  <div className="flex items-center justify-between">
                    <a href={withBase(item.href)} onClick={close} className="block grow py-3.5 focus-visible:outline-2 focus-visible:outline-accent">
                      {item.label}
                    </a>
                    {item.children && (
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : item.href)}
                        aria-expanded={isOpen}
                        aria-controls={subId}
                        aria-label={`${item.label}: näytä palvelut`}
                        className="flex size-12 items-center justify-center rounded-md text-accent focus-visible:outline-2 focus-visible:outline-accent"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                             className={`size-5 transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}>
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Alavalikko: palvelut kuvakkeineen, sisennettynä */}
                  {item.children && isOpen && (
                    <ul id={subId} className="mb-3 rounded-xl bg-lilac-soft p-2 text-base">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <a
                            href={withBase(child.href)}
                            onClick={close}
                            className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 focus-visible:outline-2 focus-visible:outline-accent"
                          >
                            <ServiceIcon name={child.icon} className="size-5 shrink-0 text-accent" />
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
