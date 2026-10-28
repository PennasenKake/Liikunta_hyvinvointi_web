// Header.tsx: sivun yläpalkki (logo ja navigaatio).
// Server Component (ei "use client" -riviä), joten se renderöidään palvelimella
// eikä lähetä selaimeen JavaScriptiä. Vain mobiilivalikko on Client Component.
//
// Värit myötäilevät logoa: liukuväri logon tummasta sinisestä (royal)
// brändin violettiin (accent). Teksti on valkoista, kontrasti 8.5–9.6:1 (WCAG AAA).

import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import MobileMenu from "./MobileMenu";

// Näkyvä fokusrengas näppäimistökäyttäjille. Selaimen oletusrengas on sininen,
// joten se ei erottuisi sinisestä taustasta: käytetään valkoista.
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export default function Header() {
  return (
    // sticky top-0: palkki pysyy ylhäällä vierittäessä. z-50: muiden elementtien päällä.
    // bg-linear-to-r: Tailwind v4:n liukuväri vasemmalta oikealle.
    <header className="sticky top-0 z-50 border-b border-white/10 bg-linear-to-r from-royal to-accent text-white shadow-[0_4px_20px_rgba(26,68,174,0.25)]">
      <nav
        aria-label="Päävalikko"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:py-3"
      >
        {/* Logo ja nimi linkkinä etusivulle. href="/" toimii kaikilta sivuilta (myös 404). */}
        <Link href="/" className={`flex min-w-0 items-center gap-3 rounded-full sm:gap-4 ${focusRing}`}>
          {/* Täysi logo teksteineen. Koko kasvaa näytön mukaan: 64 px mobiilissa, 80 px työpöydällä.
              ring-[3px] ring-white: valkoinen rengas kehystää logon ja erottaa sen sinisestä palkista.
              shadow: tumma varjo nostaa logon irti taustasta.
              unoptimized: SVG on vektori, joten Next.js:n kuvaoptimointia ei tarvita. */}
          <Image
            src="/logo.svg"
            alt="" // Tyhjä alt, koska vieressä on nimi tekstinä: ruudunlukija ei lue samaa kahdesti
            width={80}
            height={80}
            priority
            unoptimized
            className="size-16 shrink-0 rounded-full shadow-[0_4px_14px_rgba(20,10,60,0.45)] ring-[3px] ring-white lg:size-20"
          />
          {/* min-w-0: teksti saa kutistua, jottei palkki vuoda yli kapealla näytöllä */}
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="font-serif text-2xl font-bold lg:text-[28px]">{site.name}</span>
            {/* Tagline piiloon alle 360 px näytöillä, jotta nimi ja valikkopainike mahtuvat */}
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-sky max-[359px]:hidden">
              {site.tagline}
            </span>
          </span>
        </Link>

        {/* Työpöytänavigaatio: piilossa pienillä näytöillä (hidden), näkyvissä lg-leveydestä (1024 px). */}
        <ul className="hidden items-center gap-7 font-medium lg:flex">
          {site.nav.map((item) => (
            <li key={item.href}>
              {/* Hover: alleviivaus värimuutoksen sijaan, koska valkoinen on jo vaalein sävy */}
              <a
                href={item.href}
                className={`rounded-sm underline-offset-8 transition hover:underline ${focusRing}`}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            {/* Toimintakehote käänteisenä: valkoinen painike violetilla tekstillä (kontrasti 9.6:1) */}
            <a
              href={site.contact.href}
              className={`rounded-md bg-white px-5 py-3 font-semibold text-accent transition hover:bg-lilac ${focusRing}`}
            >
              {site.contact.label}
            </a>
          </li>
        </ul>

        {/* Mobiilivalikko näkyy vain alle lg-leveydellä (komponentti piilottaa itsensä) */}
        <MobileMenu />
      </nav>
    </header>
  );
}
