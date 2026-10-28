// Header.tsx: sivun yläpalkki (logo ja navigaatio).
// Server Component: sisältö renderöidään palvelimella. Selaimen JavaScriptiä tarvitsevat
// osat ovat omissa Client Componenteissaan:
//   HeaderShell  – pieneneminen ja piiloutuminen vieritettäessä
//   NavDropdown  – työpöydän alavalikot (Liikunta, Hyvinvointi)
//   MobileMenu   – hampurilaisvalikko pienille näytöille
//
// Värit myötäilevät logoa: liukuväri logon tummasta sinisestä (royal)
// brändin violettiin (accent). Teksti on valkoista, kontrasti 8.5–9.6:1 (WCAG AAA).

import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { serviceCategories, serviceId } from "@/lib/services";
import HeaderShell from "./HeaderShell";
import NavDropdown from "./NavDropdown";
import MobileMenu, { type MenuItem } from "./MobileMenu";

// Näkyvä fokusrengas näppäimistökäyttäjille. Selaimen oletusrengas on sininen,
// joten se ei erottuisi sinisestä taustasta: käytetään valkoista.
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

// Valikon rakenne: site.ts:n linkit, joista Liikunta ja Hyvinvointi saavat alavalikoksi
// palvelunsa (services.ts). Uusi palvelu ilmestyy alavalikkoon automaattisesti.
const menu: MenuItem[] = site.nav.map((item) => {
  const category = serviceCategories.find((c) => item.href === `/#${c.id}`);
  return {
    ...item,
    children: category?.services.map((s) => ({
      label: s.title,
      href: `/#${serviceId(s.title)}`,
      icon: s.icon,
    })),
  };
});

export default function Header() {
  return (
    <HeaderShell>
      {/* Korkeus pienenee vieritettäessä: 84 → 64 px mobiilissa, 104 → 72 px työpöydällä.
          group-data-[scrolled=true]/header: HeaderShell asettaa data-scrolled-attribuutin. */}
      <nav
        aria-label="Päävalikko"
        className="mx-auto flex h-21 max-w-6xl items-center justify-between gap-4 px-4 transition-[height] duration-300 motion-reduce:transition-none group-data-[scrolled=true]/header:h-16 sm:px-6 lg:h-26 lg:group-data-[scrolled=true]/header:h-18"
      >
        {/* Logo ja nimi linkkinä etusivulle. href="/" toimii kaikilta sivuilta (myös 404). */}
        <Link href="/" className={`flex min-w-0 items-center gap-3 rounded-full sm:gap-4 ${focusRing}`}>
          {/* Täysi logo teksteineen: 64 px mobiilissa, 80 px työpöydällä, vierittäessä pienempi.
              ring-[3px] ring-white: valkoinen rengas erottaa logon sinisestä palkista.
              unoptimized: SVG on vektori, joten Next.js:n kuvaoptimointia ei tarvita. */}
          <Image
            src="/logo.svg"
            alt="" // Tyhjä alt, koska vieressä on nimi tekstinä: ruudunlukija ei lue samaa kahdesti
            width={80}
            height={80}
            priority
            unoptimized
            className="size-16 shrink-0 rounded-full shadow-[0_4px_14px_rgba(20,10,60,0.45)] ring-[3px] ring-white transition-[width,height] duration-300 motion-reduce:transition-none group-data-[scrolled=true]/header:size-12 lg:size-20 lg:group-data-[scrolled=true]/header:size-14"
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

        {/* Työpöytänavigaatio: piilossa pienillä näytöillä, näkyvissä lg-leveydestä (1024 px). */}
        <ul className="hidden items-center gap-6 font-medium lg:flex">
          {menu.map((item) =>
            item.children ? (
              <NavDropdown
                key={item.href}
                label={item.label}
                href={item.href}
                items={item.children}
                focusRing={focusRing}
              />
            ) : (
              <li key={item.href}>
                {/* Hover: alleviivaus värimuutoksen sijaan, koska valkoinen on jo vaalein sävy */}
                <a
                  href={item.href}
                  className={`rounded-sm underline-offset-8 transition hover:underline ${focusRing}`}
                >
                  {item.label}
                </a>
              </li>
            ),
          )}
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
        <MobileMenu items={[...menu, site.contact]} />
      </nav>
    </HeaderShell>
  );
}
