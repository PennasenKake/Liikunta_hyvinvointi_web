// Footer.tsx: sivun alatunniste (rakenne kuten GlossTahkon sivustolla).
// Neljä saraketta: brändi, Sivusto, Yhteystiedot ja Tietoa ja ehdot.
// Niiden alla kumppanit ja alarivi (tekijänoikeus, Y-tunnus, huomautus, takaisin ylös).
// id="yhteystiedot": valikon Yhteystiedot-linkki vierittää tänne.
// Värit samat kuin yläpalkissa, jolloin sivu alkaa ja päättyy logon väreihin.

import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { withBase } from "@/lib/paths";

// Sarakkeen otsikko. <h2>, jotta ruudunlukijan otsikkolistassa näkyvät alatunnisteen osat.
function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 font-serif text-xl font-semibold uppercase tracking-[0.16em] text-sky">{children}</h2>
  );
}

// Listan linkki: py-2 kasvattaa kosketusaluetta (vähintään 44 px rivikorkeuden kanssa)
const linkClass = "inline-block py-2 underline-offset-4 hover:underline";

export default function Footer() {
  return (
    <footer id="yhteystiedot" className="bg-linear-to-r from-royal to-accent px-6 pb-6 pt-16 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Mobiili: sarakkeet allekkain. Tabletti: 2 × 2. Leveä: 4 saraketta, brändi leveimpänä. */}
        <div data-reveal="fade" className="grid gap-10 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-[1.4fr_0.8fr_1.3fr_1fr]">
          {/* Brändi: logo, nimi, lyhyt lupaus ja soittopainike */}
          <div>
            <div className="flex items-center gap-4">
              <Image
                src={withBase("/logo.svg")}
                alt=""
                width={64}
                height={64}
                unoptimized
                className="size-16 rounded-full ring-[3px] ring-white"
              />
              <p className="flex flex-col leading-tight">
                <span className="font-serif text-3xl font-bold">{site.name}</span>
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-sky">{site.tagline}</span>
              </p>
            </div>
            <p className="mt-5 max-w-xs leading-relaxed text-sky">
              Liikuntaa ja rentoutusta Tahkolla, Siilinjärvellä, Kuopiossa ja Rautavaaralla.
            </p>
            <a
              href={site.phoneHref}
              className="mt-5 inline-flex min-h-11 items-center rounded-md bg-white px-5 font-semibold text-accent transition hover:bg-lilac"
            >
              Soita {site.phone}
            </a>
          </div>

          {/* Sivusto: etusivun osiot */}
          <nav aria-label="Sivuston osiot">
            <ColumnTitle>Sivusto</ColumnTitle>
            <ul>
              {site.footerNav.map((item) => (
                <li key={item.href}>
                  <a href={withBase(item.href)} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Yhteystiedot. <address> on semanttinen elementti yhteystiedoille. */}
          <div>
            <ColumnTitle>Yhteystiedot</ColumnTitle>
            <address className="not-italic">
              <ul>
                <li>
                  <a href={site.phoneHref} className={linkClass}>
                    {site.phone}
                  </a>
                </li>
                <li>
                  {/* break-all: pitkä osoite rivittyy kapealla näytöllä eikä aiheuta vaakavieritystä */}
                  <a href={`mailto:${site.email}`} className={`${linkClass} break-all`}>
                    {site.email}
                  </a>
                </li>
                <li>
                  {site.instagram.url ? (
                    <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      Instagram @{site.instagram.handle}
                      <span className="sr-only"> (uusi välilehti)</span>
                    </a>
                  ) : (
                    <span className="inline-block py-2 text-sky">Instagram @{site.instagram.handle}</span>
                  )}
                </li>
                <li className="py-2 text-sky">Toiminta-alue: {site.areas.join(", ")}</li>
              </ul>
            </address>
          </div>

          {/* Tietoa ja ehdot: lakisivut. Link: siirtyminen ilman koko sivun latausta. */}
          <nav aria-label="Ehdot ja tietosuoja">
            <ColumnTitle>Tietoa ja ehdot</ColumnTitle>
            <ul>
              {site.legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Kumppanit. TODO(Amanda): logot ja käyttölupa. Ilman logoa näytetään nimi. */}
        <div data-reveal="fade" className="mt-12 border-t border-white/20 pt-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-sky">Yhteistyössä</h2>
          <ul className="flex flex-wrap gap-3">
            {site.partners.map((p) => (
              <li
                key={p.name}
                className="flex h-16 w-36 items-center justify-center rounded-lg bg-white px-4 text-center text-sm font-semibold text-ink sm:w-40"
              >
                {p.logo ? (
                  <Image src={p.logo} alt={p.name} width={140} height={48} className="max-h-12 w-auto object-contain" />
                ) : (
                  p.name
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Alarivi: tekijänoikeus, Y-tunnus, lyhyt tietosuojahuomautus ja takaisin ylös */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-white/20 pt-5 text-sm text-sky">
          <p>
            © {site.copyrightYear} {site.name} · Y-tunnus {site.businessId}
          </p>
          <p className="max-w-xl">Sivusto ei aseta evästeitä eikä käytä seurantaa.</p>
          <a href="#top" className="inline-flex min-h-11 items-center underline-offset-4 hover:text-white hover:underline">
            Takaisin ylös ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
