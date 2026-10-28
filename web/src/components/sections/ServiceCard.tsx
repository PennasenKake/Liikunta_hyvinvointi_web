// ServiceCard.tsx: yhden palvelun kortti Palvelut-osiossa.
// Komponentilla ei ole omaa tilaa eikä tapahtumia. Koska ServiceTabs on Client Component,
// kortti renderöidään sen osana: HTML tulee valmiina palvelimelta, ja selaimessa
// kortti piirretään uudelleen vain välilehteä vaihdettaessa.
//
// Rakenne: kuvake → nimi → kuvaus → tiedot (<dl>) → toimintolinkki.
// Kortit ovat samankorkuisia, koska tiedot ja linkki työnnetään alas (mt-auto).

import ServiceIcon from "@/components/ui/ServiceIcon";
import { intensityLabels, type Intensity, type Service } from "@/lib/services";

type Props = {
  service: Service;
  tone: "lilac" | "sky"; // Kuvakkeen sävy: Liikunta violetti, Hyvinvointi sininen
};

// Kuvakkeen taustat teemasta. Molemmissa yhdistelmissä kontrasti on yli 4.5:1.
const toneClasses = {
  lilac: "bg-lilac text-accent",
  sky: "bg-sky text-sky-ink",
};

// Tehotaso kolmena pisteenä. Pisteet ovat koriste (aria-hidden):
// ruudunlukija lukee viereisen tekstin, esim. "Kohtalainen".
function IntensityDots({ level }: { level: Intensity }) {
  return (
    <span aria-hidden="true" className="flex gap-1">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`size-2.5 rounded-full ${i <= level ? "bg-accent" : "border border-border bg-white"}`}
        />
      ))}
    </span>
  );
}

export default function ServiceCard({ service: s, tone }: Props) {
  // Ryhmätunnit löytyvät kalenterista, yksilöpalveluista sovitaan aika yhteystiedoilla
  const action =
    s.booking === "ryhma"
      ? { label: "Katso tunnit", href: "/#kalenteri" }
      : { label: "Varaa aika", href: "/#yhteystiedot" };

  return (
    // h-full + flex-col: kortti täyttää ruudukon solun, jolloin rivin kortit ovat yhtä korkeita
    <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition hover:border-border">
      {/* Kuvake otsikon yläpuolella: otsikko saa koko kortin leveyden, jolloin pitkätkin
          yhdyssanat ("Kristallimaljarentoutus") mahtuvat. Selaimet eivät tavuta suomea
          luotettavasti, joten hyphens-auto ja break-words ovat vain varmistus kapeimmille näytöille. */}
      <span className={`mb-4 flex size-12 shrink-0 items-center justify-center rounded-full ${toneClasses[tone]}`}>
        <ServiceIcon name={s.icon} className="size-6" />
      </span>
      <h3 className="mb-2.5 font-serif text-[28px] font-semibold leading-tight break-words hyphens-auto">
        {s.title}
      </h3>

      <p className="mb-5 leading-relaxed text-muted">{s.description}</p>

      {/* Tiedot kuvauslistana (<dl>): ruudunlukija kertoo nimen ja arvon pareittain.
          grid: nimille kiinteä sarake, jolloin arvot ovat samassa linjassa kaikissa korteissa
          (myös niissä, joista tehotaso puuttuu). */}
      <dl className="mt-auto grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-2.5 border-t border-line pt-5 text-[15px]">
        {s.intensity && (
          <>
            <dt className="text-muted">Tehotaso</dt>
            <dd className="flex items-center gap-2.5 font-medium">
              <IntensityDots level={s.intensity} />
              {intensityLabels[s.intensity]}
            </dd>
          </>
        )}

        <dt className="text-muted">Sopii</dt>
        <dd>{s.suitsFor}</dd>

        <dt className="text-muted">Kesto</dt>
        <dd className="font-medium">{s.duration}</dd>

        <dt className="text-muted">Paikat</dt>
        <dd>
          {/* Paikkakunnat pieninä tunnisteina. Lista, jotta ruudunlukija kertoo määrän. */}
          <ul className="flex flex-wrap gap-1.5">
            {s.locations.map((place) => (
              <li key={place} className="rounded-full bg-sky-soft px-2.5 py-0.5 text-sm text-ink-soft">
                {place}
              </li>
            ))}
          </ul>
        </dd>
      </dl>

      {/* Linkin näkyvä teksti on sama kaikissa korteissa, joten aria-label lisää
          ruudunlukijalle palvelun nimen: "Katso tunnit: Vesijumppa". Muuten linkkilista olisi
          pelkkiä samannimisiä linkkejä (WCAG 2.4.4). Nimi alkaa näkyvällä tekstillä, jolloin
          puheohjauksen käyttäjä voi sanoa "klikkaa Katso tunnit" (WCAG 2.5.3). */}
      <a
        href={action.href}
        aria-label={`${action.label}: ${s.title}`}
        className="mt-5 inline-flex min-h-11 items-center gap-1.5 self-start font-semibold text-accent underline-offset-4 hover:underline"
      >
        {action.label}
        <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}
