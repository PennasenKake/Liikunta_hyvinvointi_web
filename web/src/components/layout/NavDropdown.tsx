// NavDropdown.tsx: työpöydän valikkokohta, jossa on alavalikko (Liikunta, Hyvinvointi).
// Client Component: alavalikon auki/kiinni-tila.
//
// Toiminta:
// - Hiiri: alavalikko aukeaa, kun osoitin on kohdan päällä (kuten fitis.fi).
// - Näppäimistö ja kosketus: nuolipainike avaa ja sulkee alavalikon (aria-expanded).
//   Itse linkki ("Liikunta") vie suoraan osioon kuten ennenkin.
// - Esc sulkee alavalikon ja palauttaa fokuksen nuolipainikkeeseen.
// - Fokuksen siirtyminen pois alavalikosta sulkee sen.
// Malli: WAI-ARIA Disclosure Navigation Menu.
"use client";

import { useRef, useState } from "react";
import ServiceIcon from "@/components/ui/ServiceIcon";
import type { ServiceIconName } from "@/lib/services";
import { withBase } from "@/lib/paths";

type Props = {
  label: string;
  href: string;
  items: { label: string; href: string; icon: ServiceIconName }[];
  focusRing: string; // Sama fokusrengas kuin muissa palkin linkeissä (Header.tsx)
};

export default function NavDropdown({ label, href, items, focusRing }: Props) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // Pieni viive hiiren poistuessa: alavalikko ei sulkeudu, jos osoitin käy hetken sen ulkopuolella
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const openNow = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <li
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
      // Fokus siirtyi kokonaan pois tästä kohdasta (relatedTarget = uusi fokus) → suljetaan
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <div className="flex items-center gap-0.5">
        <a href={withBase(href)} className={`rounded-sm underline-offset-8 transition hover:underline ${focusRing}`}>
          {label}
        </a>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={`${label}: näytä palvelut`}
          className={`flex size-8 items-center justify-center rounded-sm ${focusRing}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`size-4 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* Alavalikko: valkoinen paneeli palkin alla. pt-3 on "silta": hiiri ei putoa
          linkin ja paneelin väliseen rakoon, jolloin valikko ei sulkeudu kesken. */}
      {open && (
        <div className="absolute left-1/2 top-full z-10 w-72 -translate-x-1/2 pt-3">
          <ul className="rounded-2xl border border-line bg-white p-2 text-ink shadow-[0_16px_40px_rgba(34,29,74,0.18)]">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={withBase(item.href)}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 font-medium transition hover:bg-lilac-soft focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <ServiceIcon name={item.icon} className="size-5 shrink-0 text-accent" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
