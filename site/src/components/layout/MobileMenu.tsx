// MobileMenu.tsx: hampurilaisvalikko pienille näytöille.
// Interaktiivinen komponentti: tarvitsee tilan (auki/kiinni), klikkaukset ja näppäimistötapahtumat.
//
// Toiminta (kuten fitis.fi):
// - Valikko aukeaa yläpalkin alle, ja muu sivu tummuu taustalla.
// - Liikunta ja Hyvinvointi -kohdissa on nuoli, josta aukeaa palvelulista.
// - Sulkeutuu: rastista, Esc-näppäimestä, tummennetun taustan klikkauksesta tai linkin valinnasta.
// - Sivun vieritys on estetty, kun valikko on auki, jottei tausta liiku sormen alla.

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
          // menu-in (index.css): paneeli liukuu pehmeästi esiin. Vähennetty liike: ilman animaatiota.
          className="menu-in absolute inset-x-0 top-full max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/10 bg-white text-ink shadow-xl"
        >
          <ul className="px-6 py-3 text-lg font-medium">
            {items.map((item) => {
              const isOpen = expanded === item.href;
              const subId = `alavalikko-${item.href.replace(/\W/g, "")}`;
              return (
                <li key={item.href} className="border-b border-line last:border-0">
                  {/* Rivi: hover (hiiri) ja active (kosketus) korostavat koko rivin.
                      -mx-3 + px-3: korostus ulottuu hieman tekstin ohi, mutta teksti pysyy linjassa.
                      Auki olevan alavalikon rivi pysyy korostettuna (data-open). */}
                  <div
                    data-open={isOpen}
                    className="group/row relative -mx-3 flex items-center justify-between rounded-xl px-3 transition-colors duration-200 hover:bg-lilac-soft active:bg-lilac data-[open=true]:bg-lilac-soft motion-reduce:transition-none"
                  >
                    {/* Violetti merkkiviiva vasemmassa reunassa: kasvaa esiin hoverissa ja auki olevalla rivillä */}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 scale-y-0 rounded-full bg-accent transition-transform duration-200 group-hover/row:scale-y-100 group-data-[open=true]/row:scale-y-100 motion-reduce:transition-none"
                    />
                    <a
                      href={withBase(item.href)}
                      onClick={close}
                      className="block grow rounded-lg py-3.5 focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      {/* Teksti liukuu hieman oikealle ja muuttuu violetiksi: kevyt vihje, ei hyppää */}
                      <span className="inline-block transition duration-200 group-hover/row:translate-x-1.5 group-hover/row:text-accent group-data-[open=true]/row:text-accent motion-reduce:transition-none">
                        {item.label}
                      </span>
                    </a>
                    {item.children && (
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : item.href)}
                        aria-expanded={isOpen}
                        aria-controls={subId}
                        aria-label={`${item.label}: näytä palvelut`}
                        className="flex size-12 items-center justify-center rounded-full text-accent transition-colors duration-200 hover:bg-white active:bg-lilac-strong focus-visible:outline-2 focus-visible:outline-accent motion-reduce:transition-none"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                             className={`size-5 transition-transform duration-300 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}>
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Alavalikko: palvelut kuvakkeineen. Hover: valkoinen pohja, kuvake ympyrässä,
                      ja nuoli tulee esiin oikealle: "tästä pääset palveluun". */}
                  {item.children && isOpen && (
                    <ul id={subId} className="menu-in mb-3 mt-1 rounded-xl bg-lilac-soft p-2 text-base">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <a
                            href={withBase(child.href)}
                            onClick={close}
                            className="group/sub flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-white hover:text-accent active:bg-white focus-visible:outline-2 focus-visible:outline-accent motion-reduce:transition-none"
                          >
                            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-accent transition-colors duration-200 group-hover/sub:bg-lilac motion-reduce:transition-none">
                              <ServiceIcon name={child.icon} className="size-4.5" />
                            </span>
                            <span className="grow">{child.label}</span>
                            <span
                              aria-hidden="true"
                              className="-translate-x-1 text-accent opacity-0 transition duration-200 group-hover/sub:translate-x-0 group-hover/sub:opacity-100 motion-reduce:transition-none"
                            >
                              →
                            </span>
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
