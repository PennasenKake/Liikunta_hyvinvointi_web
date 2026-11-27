// palvelusivu.tsx: palvelujen omat sivut /liikunta/, /hyvinvointi/ ja /valmennus/.
// Sama pohja kaikille kolmelle: sisältö tulee services.ts:stä, joten uusi palvelu tai muuttunut
// teksti päivittyy sivulle ilman muutoksia tähän tiedostoon.
//
// Rakenne:
// 1. Yläosa: murupolku, otsikko, johdanto ja toimintakehotteet (ryhmätunnit: tulevat tunnit,
//    valmennus: ajanvaraus sähköpostilla).
// 2. Palvelut kortteina. Liikunnassa tasoittain (Kevyemmät, Tehokkaammat). Jokaisella kortilla on
//    id (esim. #vesijumppa), johon yläpalkin alavalikko ja tuntilistan palvelulinkit osoittavat.
// 3. Valmennuksessa "Näin aloitetaan" -vaiheet.
// 4. Muut palvelut: linkit kahteen muuhun osaan (sisäiset linkit auttavat myös hakukoneita).
//
// TODO(Amanda): "Sopii"-tekstit ja valmennuksen vaiheet ovat luonnoksia (docs/sisalto.md).

import ButtonLink from "@/components/ui/ButtonLink";
import Link from "@/components/ui/Link";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { categoryTones } from "@/components/sections/Services";
import { bookingHref, quoteHref } from "@/lib/contact";
import { breadcrumbJsonLd, jsonLdString } from "@/lib/seo";
import {
  levels,
  serviceCategories,
  serviceId,
  servicesByLevel,
  type Service,
  type ServiceCategory,
} from "@/lib/services";

// Valmennuksen aloitus kolmessa vaiheessa
const steps = [
  { title: "Yhteydenotto", text: "Lähetä viesti, niin sovitaan tutustumisaika." },
  { title: "Lähtötaso", text: "Keskustellaan tavoitteista, ja halutessasi tehdään InBody-mittaus." },
  { title: "Oma ohjelma ja seuranta", text: "Treenataan yhdessä, ja kehitystä seurataan matkan varrella." },
];

function ServiceCard({ s, iconTone }: { s: Service; iconTone: string }) {
  return (
    // scroll-mt: ankkurilinkki (/liikunta/#vesijumppa) jättää tilaa yläpalkille
    <li id={serviceId(s.title)} className="scroll-mt-28 rounded-2xl border border-line bg-white p-6 lg:p-7">
      <div className="flex items-center gap-4">
        <span className={`flex size-12 shrink-0 items-center justify-center rounded-full ${iconTone}`}>
          <ServiceIcon name={s.icon} className="size-6" />
        </span>
        <h3 className="min-w-0 break-words font-serif text-[28px] font-semibold leading-tight hyphens-auto">{s.title}</h3>
      </div>
      <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">{s.description}</p>
      <p className="mt-3 text-[15px] text-muted">
        <span className="font-semibold text-ink">Sopii: </span>
        {s.suitsFor.charAt(0).toLowerCase() + s.suitsFor.slice(1)}
      </p>
    </li>
  );
}

function CategoryPage({ cat }: { cat: ServiceCategory }) {
  const tone = categoryTones[cat.id];
  const groups = servicesByLevel(cat);
  const others = serviceCategories.filter((c) => c.id !== cat.id);
  const isCoaching = cat.id === "valmennus";

  return (
    <main id="sisalto" tabIndex={-1} className="bg-surface outline-none">
      {/* Murupolku Googlelle: Etusivu › Liikunta */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd(cat.label, cat.path)) }} />

      <section className={`px-6 pb-16 pt-12 lg:pb-20 lg:pt-16 ${tone.box}`}>
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Murupolku" className="text-[15px] text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                  Etusivu
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" className="font-medium text-ink">
                {cat.label}
              </li>
            </ol>
          </nav>
          <p className="mt-6 font-serif text-2xl italic text-accent">{cat.label}</p>
          <h1 className="mt-1 max-w-3xl font-serif text-[clamp(2.6rem,6vw,4.2rem)] font-bold leading-[1.02]">{cat.heading}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft lg:text-xl">{cat.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            {isCoaching ? (
              <>
                <ButtonLink href={bookingHref}>Varaa tutustumisaika</ButtonLink>
                <ButtonLink href="/#hinnasto" variant="secondary">
                  Hinnasto
                </ButtonLink>
              </>
            ) : (
              <>
                <ButtonLink href="/#kalenteri">Katso tulevat tunnit</ButtonLink>
                <ButtonLink href={quoteHref} variant="secondary">
                  Pyydä tarjous ryhmälle
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        {groups.map((g) => (
          <section
            key={g.level ?? "kaikki"}
            aria-labelledby={g.level ? `taso-${g.level}` : undefined}
            aria-label={g.level ? undefined : `${cat.label}: palvelut`}
            className="mb-14 last:mb-0"
          >
            {g.level && (
              <div className="mb-6">
                <h2 id={`taso-${g.level}`} className="font-serif text-[clamp(2rem,4vw,2.6rem)] font-semibold leading-tight">
                  {levels[g.level].label}
                </h2>
                <p className="mt-1 text-[17px] text-muted">{levels[g.level].text}</p>
              </div>
            )}
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {g.services.map((s) => (
                <ServiceCard key={s.title} s={s} iconTone={tone.icon} />
              ))}
            </ul>
          </section>
        ))}

        {isCoaching && (
          <section aria-labelledby="aloitus" className="mt-16">
            <h2 id="aloitus" className="mb-6 font-serif text-[clamp(2rem,4vw,2.6rem)] font-semibold leading-tight">
              Näin aloitetaan
            </h2>
            <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {steps.map((st, i) => (
                <li key={st.title} className="rounded-2xl border border-line bg-white p-6">
                  <span aria-hidden="true" className="font-serif text-[44px] font-bold leading-none text-accent">
                    {i + 1}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold">{st.title}</h3>
                  <p className="mt-1 leading-relaxed text-muted">{st.text}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Muut palvelut: kävijä ei jää umpikujaan, ja hakukone löytää sivut toistensa kautta */}
        <section aria-labelledby="muut-palvelut" className="mt-20">
          <h2 id="muut-palvelut" className="mb-6 font-serif text-[clamp(2rem,4vw,2.6rem)] font-semibold leading-tight">
            Tutustu myös
          </h2>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {others.map((o) => (
              <li key={o.id}>
                <Link
                  href={o.path}
                  className={`group flex h-full flex-col gap-2 rounded-3xl p-7 transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transition-none ${categoryTones[o.id].box}`}
                >
                  <span className="font-serif text-[34px] font-bold leading-none">{o.label}</span>
                  <span className="text-[17px] leading-relaxed text-ink-soft">{o.card}</span>
                  <span className={`mt-auto pt-2 font-semibold ${categoryTones[o.id].link}`}>
                    {o.cardLink} <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

// Reitit (routes.tsx) tarvitsevat parametrittoman komponentin jokaiselle sivulle
const byId = (id: ServiceCategory["id"]) => serviceCategories.find((c) => c.id === id)!;
export const LiikuntaPage = () => <CategoryPage cat={byId("liikunta")} />;
export const HyvinvointiPage = () => <CategoryPage cat={byId("hyvinvointi")} />;
export const ValmennusPage = () => <CategoryPage cat={byId("valmennus")} />;
