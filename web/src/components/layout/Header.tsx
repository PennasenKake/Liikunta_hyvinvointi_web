// Header.tsx: sivun yläpalkki (logo ja navigaatio).
// Server Component (ei "use client" -riviä), joten se renderöidään palvelimella
// eikä lähetä selaimeen JavaScriptiä. Vain mobiilivalikko on Client Component.

import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import MobileMenu from "./MobileMenu";

export default function Header() {
  return (
    // sticky top-0: palkki pysyy ylhäällä vierittäessä.
    // z-50: palkki pysyy muiden elementtien päällä.
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur">
      <nav
        aria-label="Päävalikko"
        className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-6 py-3"
      >
        {/* Logo ja nimi linkkinä sivun alkuun */}
        <Link href="#top" className="flex items-center gap-3.5">
          {/* next/image optimoi kuvan automaattisesti (koko, formaatti, lazy loading).
              priority: logo ladataan heti, koska se näkyy ensimmäisenä. */}
          <Image
            src="/logo.png"
            alt="" // Tyhjä alt, koska vieressä on nimi tekstinä: ruudunlukija ei lue samaa kahdesti
            width={56}
            height={56}
            priority
            className="size-14 rounded-full object-cover"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-2xl font-bold">{site.name}</span>
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
              {site.tagline}
            </span>
          </span>
        </Link>

        {/* Työpöytänavigaatio: piilossa pienillä näytöillä (hidden),
            näkyvissä lg-leveydestä (1024 px) alkaen (lg:flex). */}
        <ul className="hidden items-center gap-8 font-medium lg:flex">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="transition-colors hover:text-accent">
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#yhteystiedot"
              className="rounded-md bg-accent px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            >
              Yhteystiedot
            </a>
          </li>
        </ul>

        {/* Mobiilivalikko näkyy vain alle lg-leveydellä (komponentti piilottaa itsensä) */}
        <MobileMenu />
      </nav>
    </header>
  );
}