// Footer.tsx: sivun alatunniste.
// Yhteystiedot, toiminta-alueet, kumppanit ja yrityksen tiedot (suunnitelman kohta 3).
// id="yhteystiedot": valikon Yhteystiedot-linkki vierittää tänne.
// Värit samat kuin yläpalkissa, jolloin sivu alkaa ja päättyy logon väreihin.

import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer id="yhteystiedot" className="bg-linear-to-r from-royal to-accent px-6 pb-8 pt-16 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Yläosa: esittely, yhteystiedot ja alueet. Kapealla näytöllä allekkain. */}
        <div className="flex flex-wrap justify-between gap-12">
          <div className="flex min-w-0 grow basis-72 flex-col gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.svg"
                alt=""
                width={72}
                height={72}
                unoptimized
                className="size-18 rounded-full ring-[3px] ring-white"
              />
              <span className="font-serif text-3xl font-bold">{site.name}</span>
            </div>
            <p className="max-w-sm text-lg leading-relaxed text-sky">
              Soita tai laita viestiä, niin katsotaan yhdessä sinulle sopiva tunti.
            </p>
          </div>

          {/* <address> on semanttinen elementti yhteystiedoille. not-italic: selaimen oletuskursiivi pois. */}
          <address className="flex flex-col gap-2.5 not-italic">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-[0.08em] text-sky">Yhteystiedot</h2>
            <a href={site.phoneHref} className="text-lg underline-offset-4 hover:underline">{site.phone}</a>
            {/* break-all: pitkä sähköpostiosoite rivittyy kapealla näytöllä eikä aiheuta vaakavieritystä */}
            <a href={`mailto:${site.email}`} className="break-all text-lg underline-offset-4 hover:underline">
              {site.email}
            </a>
            {site.instagram.url ? (
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="text-lg underline-offset-4 hover:underline">
                Instagram @{site.instagram.handle}
              </a>
            ) : (
              <span className="text-lg text-sky">Instagram @{site.instagram.handle}</span>
            )}
          </address>

          <div className="flex flex-col gap-2.5">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-[0.08em] text-sky">Toiminta-alue</h2>
            <ul className="text-lg leading-loose">
              {site.areas.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Kumppanit. TODO(Amanda): logot ja käyttölupa. Ilman logoa näytetään nimi. */}
        <div className="mt-14 border-t border-white/20 pt-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-sky">Yhteistyössä</h2>
          {/* w-36 mobiilissa: kaksi logoa mahtuu riville */}
          <ul className="flex flex-wrap gap-3">
            {site.partners.map((p) => (
              <li key={p.name} className="flex h-16 w-36 items-center sm:w-40 justify-center rounded-lg bg-white px-4 text-center text-sm font-semibold text-ink">
                {p.logo ? (
                  <Image src={p.logo} alt={p.name} width={140} height={48} className="max-h-12 w-auto object-contain" />
                ) : (
                  p.name
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Alarivi: tekijänoikeus, Y-tunnus ja tietosuojaseloste */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm text-sky">
          <p>
            © {site.copyrightYear} {site.name} · Y-tunnus {site.businessId}
          </p>
          <div className="flex gap-6">
            <Link href="/tietosuoja" className="underline-offset-4 hover:text-white hover:underline">Tietosuojaseloste</Link>
            <a href="#top" className="underline-offset-4 hover:text-white hover:underline">Takaisin ylös ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
