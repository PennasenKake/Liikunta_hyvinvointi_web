// Services.tsx: Palvelut-osio.
// Liikunta ja Hyvinvointi rinnakkain omina palstoinaan (työpöydällä 2 saraketta,
// mobiilissa allekkain). Kummankin palstan alussa on lyhyt "miksi tämä on tärkeää" -teksti.
//
// Server Component: osion rakenne renderöidään palvelimella. Vain yksittäinen
// palvelurivi (ServiceItem) on Client Component, koska mobiilissa kuvaus avautuu klikkaamalla.

import Link from "next/link";
import { serviceCategories } from "@/lib/services";
import ServiceItem from "./ServiceItem";

// Palstojen sävyt: Liikunta violetti, Hyvinvointi sininen (samat kuin pikalinkeissä)
const tones = {
  liikunta: { box: "bg-lilac-soft", icon: "bg-lilac text-accent" },
  hyvinvointi: { box: "bg-sky-soft", icon: "bg-sky text-sky-ink" },
} as const;

export default function Services() {
  return (
    <section id="palvelut" aria-labelledby="palvelut-otsikko" className="bg-white px-6 pb-24 pt-24">
      <div className="mx-auto max-w-6xl">
        <h2 id="palvelut-otsikko" data-reveal className="mb-2.5 font-serif text-[clamp(2.5rem,6vw,3.5rem)] font-semibold leading-tight">
          Palvelut
        </h2>
        <p className="mb-12 max-w-md text-[17px] leading-relaxed text-muted">
          Tunteja eri kuntotasoille. Kysy rohkeasti, jos et tiedä mistä aloittaa.
        </p>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {serviceCategories.map((cat) => (
            // id="liikunta" / "hyvinvointi": yläpalkin ja pikalinkkien ankkurit osuvat suoraan palstaan.
            // aria-labelledby: ruudunlukija ilmoittaa alueen nimen ("Liikunta").
            <div key={cat.id} id={cat.id} role="region" aria-labelledby={`${cat.id}-otsikko`} data-reveal>
              <div className={`mb-4 rounded-2xl p-6 lg:mb-6 ${tones[cat.id].box}`}>
                <h3 id={`${cat.id}-otsikko`} className="mb-2 font-serif text-[38px] font-semibold leading-none">
                  {cat.label}
                </h3>
                <p className="leading-relaxed text-ink-soft">{cat.intro}</p>
              </div>

              <ul>
                {cat.services.map((s) => (
                  <ServiceItem key={s.title} service={s} iconTone={tones[cat.id].icon} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Yhteinen toimintakehote koko osiolle: ryhmätunnit kalenterista,
            yksilöpalveluista (Personal Training, InBody) sovitaan aika suoraan. */}
        <div data-reveal className="mt-10 flex flex-col gap-4 rounded-2xl border border-line p-6 sm:flex-row sm:flex-wrap sm:items-center">
          <p className="grow font-medium">
            Ryhmätunnit näet kalenterista. Personal Trainingista ja InBody-mittauksesta sovitaan aika suoraan.
          </p>
          <div className="flex flex-wrap gap-3">
            {/* Link: Next.js:n linkki etusivun osioon (toimii myös toiselta sivulta) */}
            <Link
              href="/#kalenteri"
              className="inline-flex min-h-12 items-center rounded-md bg-accent px-6 font-semibold text-white transition hover:bg-ink"
            >
              Katso tulevat tunnit
            </Link>
            <Link
              href="/#yhteystiedot"
              className="inline-flex min-h-12 items-center rounded-md border border-border px-6 font-semibold text-accent transition hover:bg-lilac-soft"
            >
              Varaa aika
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
