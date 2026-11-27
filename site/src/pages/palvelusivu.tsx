// palvelusivu.tsx: palvelujen omat sivut /liikunta/, /hyvinvointi/ ja /valmennus/.
// Sama pohja kaikille kolmelle: sisältö tulee services.ts:stä, joten uusi palvelu tai muuttunut
// teksti päivittyy sivulle ilman muutoksia tähän tiedostoon.
//
// Rakenne ja tyylit samaa perhettä kuin etusivu:
// 1. Yläosa (osan oma sävy): murupolku, otsikko, johdanto, toimintakehotteet ja kuva, jonka
//    takana lootusmandala. Vuoristosiluetti (TahkoLine) vaihtaa taustan seuraavaan osioon.
// 2. Palvelut kortteina. Liikunnassa tasoittain (Kevyemmät, Tehokkaammat). Ryhmätunnin kortti
//    näyttää seuraavan tunnin Tulevat tunnit -datasta. Jokaisella kortilla on id (#vesijumppa),
//    johon yläpalkin alavalikko ja tuntilistan palvelulinkit osoittavat.
// 3. Valmennuksessa "Näin aloitetaan" -vaiheet.
// 4. Kutsu yhteydenottoon (sininen kortti kuten alatunnisteessa) ja "Tutustu myös" -kortit.
// Osiot liukuvat esiin vieritettäessä (data-reveal, App.tsx), ellei kävijä ole rajoittanut liikettä.
//
// TODO(Amanda): "Sopii"-tekstit ja valmennuksen vaiheet ovat luonnoksia (docs/sisalto.md).

import { useEffect, useState } from "react";
import ButtonLink from "@/components/ui/ButtonLink";
import Image from "@/components/ui/Image";
import Link from "@/components/ui/Link";
import LotusMandala from "@/components/ui/LotusMandala";
import ServiceIcon from "@/components/ui/ServiceIcon";
import TahkoLine from "@/components/ui/TahkoLine";
import { categoryStyles } from "@/components/sections/Services";
import { filterUpcoming, formatShort, getUpcomingEvents, type CalendarEvent } from "@/lib/calendar";
import { bookingHref, contactHref, quoteHref } from "@/lib/contact";
import { breadcrumbJsonLd, jsonLdString } from "@/lib/seo";
import { site } from "@/lib/site";
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

const h2 = "font-serif text-[clamp(2rem,4.4vw,2.75rem)] font-semibold leading-tight";

// Tulevat tunnit palvelun nimen mukaan (esim. "Vesijumppa"). Ensimmäinen piirto käyttää buildin
// hetkeä kuten esirenderöity HTML, selaimessa päättyneet tunnit poistetaan heti (vrt. NextClass).
function useNextByTitle(): Map<string, CalendarEvent> {
  const build = (events: CalendarEvent[]) => {
    const m = new Map<string, CalendarEvent>();
    for (const e of events) {
      const key = e.title.trim().toLowerCase();
      if (!e.full && !m.has(key)) m.set(key, e);
    }
    return m;
  };
  const [next, setNext] = useState(() => build(getUpcomingEvents(50)));
  useEffect(() => {
    // Selaimen kello on ulkoinen järjestelmä, jota ei voi lukea renderöinnissä (hydraatio rikkoutuisi)
    // oxlint-disable-next-line react/set-state-in-effect
    setNext(build(filterUpcoming(getUpcomingEvents(50), Date.now())));
  }, []);
  return next;
}

function ServiceCard({ s, iconTone, next }: { s: Service; iconTone: string; next?: CalendarEvent }) {
  return (
    // scroll-mt: ankkurilinkki (/liikunta/#vesijumppa) jättää tilaa yläpalkille.
    // target: kortti korostuu hetkeksi, kun kävijä tulee sen linkistä.
    <li
      id={serviceId(s.title)}
      data-reveal
      className="group/kortti flex scroll-mt-28 flex-col rounded-3xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(34,29,74,0.05)] transition target:border-accent target:ring-4 target:ring-lilac hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-14px_rgba(34,29,74,0.25)] motion-reduce:transition-none lg:p-7"
    >
      <div className="flex items-center gap-4">
        <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl transition group-hover/kortti:rotate-[-4deg] motion-reduce:transition-none ${iconTone}`}>
          <ServiceIcon name={s.icon} className="size-7" />
        </span>
        <h3 className="min-w-0 break-words font-serif text-[28px] font-semibold leading-tight hyphens-auto">{s.title}</h3>
      </div>
      <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">{s.description}</p>
      <p className="mt-3 text-[15px] text-muted">
        <span className="font-semibold text-ink">Sopii: </span>
        {s.suitsFor.charAt(0).toLowerCase() + s.suitsFor.slice(1)}
      </p>

      {/* Alarivi: ryhmätunnilla seuraava tunti kalenterista, yksilöpalvelulla ajanvaraus */}
      <div className="mt-auto pt-5">
        <div className="border-t border-line pt-4 text-[15px]">
          {s.booking === "yksilo" ? (
            <a href={bookingHref} className="inline-flex min-h-11 items-center font-semibold text-accent underline-offset-4 hover:underline">
              Varaa aika <span aria-hidden="true" className="ml-1">→</span>
            </a>
          ) : next ? (
            <Link
              href={`/#tunti-${next.id}`}
              className="flex min-h-11 items-center gap-3 rounded-xl text-ink transition hover:text-accent"
            >
              <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-[#2e9e6b]" />
              <span className="min-w-0">
                <span className="font-semibold">Seuraava: </span>
                {formatShort(next.start)}
                {next.location && <span className="text-muted"> · {next.location}</span>}
              </span>
              <span aria-hidden="true" className="ml-auto font-semibold text-accent">→</span>
            </Link>
          ) : (
            <Link href="/#kalenteri" className="inline-flex min-h-11 items-center font-semibold text-accent underline-offset-4 hover:underline">
              Katso tulevat tunnit <span aria-hidden="true" className="ml-1">→</span>
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}

function CategoryPage({ cat }: { cat: ServiceCategory }) {
  const style = categoryStyles[cat.id];
  const groups = servicesByLevel(cat);
  const others = serviceCategories.filter((c) => c.id !== cat.id);
  const isCoaching = cat.id === "valmennus";
  const next = useNextByTitle();
  const groupCount = cat.services.filter((s) => s.booking === "ryhma").length;

  return (
    <main id="sisalto" tabIndex={-1} className="outline-none">
      {/* Murupolku Googlelle: Etusivu › Liikunta */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd(cat.label, cat.path)) }} />

      {/* 1. YLÄOSA */}
      <section aria-labelledby="sivu-otsikko" className={`relative isolate overflow-hidden px-6 pb-12 pt-10 lg:pb-16 lg:pt-14 ${style.hero}`}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div>
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
            <p className="mt-4 font-serif text-2xl italic text-accent">{cat.label}</p>
            <h1 id="sivu-otsikko" className="mt-1 font-serif text-[clamp(2.6rem,6vw,4.2rem)] font-bold leading-[1.02]">
              {cat.heading}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft lg:text-xl">{cat.intro}</p>
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
            {/* Lyhyet faktat: määrä ja alueet (sama tyyli kuin heron luottamusrivi) */}
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-muted">
              <li className="flex items-center gap-2">
                <Check />
                {isCoaching ? "Yksilöllinen ohjelma" : `${groupCount} tuntityyppiä`}
              </li>
              <li className="flex items-center gap-2">
                <Check />
                {site.areas.join(" · ")}
              </li>
            </ul>
          </div>

          {/* Kuva mandalan päällä (puhelimessa matalampi, ettei johdanto ja palvelut jää kauas toisistaan).
              Mandala on koriste: piiloon suuren kontrastin tilassa. */}
          <div className="relative isolate mx-auto w-full max-w-[420px]">
            <LotusMandala className="-left-[48%] -top-[30%] w-[196%] opacity-75" />
            <div className="overflow-hidden rounded-[2.5rem] bg-white/60 shadow-[0_24px_50px_-24px_rgba(34,29,74,0.55)] ring-8 ring-white/70">
              <Image
                src={style.photo.src}
                srcSet={style.photo.srcSet}
                sizes="(min-width: 1024px) 420px, 90vw"
                alt={style.photo.alt}
                width={style.photo.width}
                height={style.photo.height}
                priority
                className="aspect-[4/3] w-full object-cover lg:aspect-[4/5]"
              />
            </div>
          </div>
        </div>
      </section>
      <TahkoLine id={`${cat.id}-sivu`} from={style.line} to="surface" shape="harju" />

      {/* 2. PALVELUT */}
      <div className="relative isolate overflow-hidden bg-surface px-6 pb-20 pt-10 lg:pb-24">
        <LotusMandala className="-right-28 top-24 hidden w-[440px] opacity-25 lg:block xl:-right-[200px] xl:w-[520px]" />
        <div className="mx-auto max-w-6xl">
          {groups.map((g) => (
            <section
              key={g.level ?? "kaikki"}
              aria-labelledby={g.level ? `taso-${g.level}` : undefined}
              aria-label={g.level ? undefined : `${cat.label}: palvelut`}
              className="mb-16 last:mb-0"
            >
              {g.level && (
                <div data-reveal className="mb-7 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 id={`taso-${g.level}`} className={h2}>
                      {levels[g.level].label}
                    </h2>
                    <p className="mt-1 text-[17px] text-muted">{levels[g.level].text}</p>
                  </div>
                  <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${style.chip}`}>
                    {g.services.length} {g.services.length === 1 ? "tunti" : "tuntia"}
                  </span>
                </div>
              )}
              <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
                {g.services.map((s) => (
                  <ServiceCard key={s.title} s={s} iconTone={style.icon} next={next.get(s.title.toLowerCase())} />
                ))}
              </ul>
            </section>
          ))}

          {/* 3. VALMENNUKSEN VAIHEET: numerot yhdistää ohut viiva (työpöydällä vaakasuunnassa) */}
          {isCoaching && (
            <section aria-labelledby="aloitus" className="mt-20">
              <h2 id="aloitus" data-reveal className={`${h2} mb-8`}>
                Näin aloitetaan
              </h2>
              <ol className="relative grid grid-cols-1 gap-5 md:grid-cols-3">
                <span aria-hidden="true" className="absolute left-12 right-12 top-[52px] hidden h-px bg-border md:block" />
                {steps.map((st, i) => (
                  <li key={st.title} data-reveal className="relative rounded-3xl border border-line bg-white p-6 lg:p-7">
                    <span
                      aria-hidden="true"
                      className="relative flex size-14 items-center justify-center rounded-full bg-accent font-serif text-[28px] font-bold text-white ring-8 ring-surface"
                    >
                      {i + 1}
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">{st.title}</h3>
                    <p className="mt-1 leading-relaxed text-muted">{st.text}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* 4. KUTSU: sama sininen liukuväri kuin yläpalkissa ja alatunnisteessa */}
          <section
            aria-labelledby="kysy"
            data-reveal
            className="relative isolate mt-20 overflow-hidden rounded-[2rem] bg-linear-to-r from-royal to-accent px-7 py-10 text-white sm:px-12 lg:py-12"
          >
            <LotusMandala className="-right-24 -top-24 w-80 opacity-30 sm:-right-16" />
            <div className="max-w-xl">
              <h2 id="kysy" className="font-serif text-[clamp(2rem,4vw,2.6rem)] font-semibold leading-tight">
                {isCoaching ? "Kerro tavoitteesi" : "Etkö tiedä, mistä aloittaa?"}
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-sky">
                {isCoaching
                  ? "Lähetä viesti, niin sovitaan tutustumisaika. Vastaan ohjausten välissä."
                  : "Kerro vähän itsestäsi, niin ehdotan sopivan tunnin. Kaikilla tunneilla liikkeistä on kevyempiä versioita."}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={isCoaching ? bookingHref : contactHref}
                  className="inline-flex min-h-12 items-center rounded-md bg-white px-6 font-semibold text-accent transition hover:bg-lilac"
                >
                  Lähetä viesti
                </a>
                <Link
                  href={isCoaching ? "/#hinnasto" : "/#kalenteri"}
                  className="inline-flex min-h-12 items-center rounded-md border border-white/50 px-6 font-semibold text-white transition hover:bg-white/10"
                >
                  {isCoaching ? "Hinnasto" : "Tulevat tunnit"}
                </Link>
              </div>
            </div>
          </section>

          {/* 5. TUTUSTU MYÖS: kävijä ei jää umpikujaan, ja hakukone löytää sivut toistensa kautta */}
          <section aria-labelledby="muut-palvelut" className="mt-20">
            <h2 id="muut-palvelut" data-reveal className={`${h2} mb-7`}>
              Tutustu myös
            </h2>
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
              {others.map((o) => {
                const os = categoryStyles[o.id];
                return (
                  <li key={o.id} data-reveal>
                    <Link
                      href={o.path}
                      className={`group flex h-full items-center gap-5 overflow-hidden rounded-3xl p-4 pr-6 transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-16px_rgba(34,29,74,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transition-none ${os.box}`}
                    >
                      <Image
                        src={os.photo.src}
                        srcSet={os.photo.srcSet}
                        sizes="128px"
                        alt=""
                        width={os.photo.width}
                        height={os.photo.height}
                        className="size-28 shrink-0 rounded-2xl object-cover sm:size-32"
                      />
                      <span className="flex min-w-0 flex-col gap-1.5">
                        <span className="font-serif text-[32px] font-bold leading-none">{o.label}</span>
                        <span className="text-[16px] leading-relaxed text-ink-soft">{o.card}</span>
                        <span className={`font-semibold ${os.link}`}>
                          {o.cardLink}{" "}
                          <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1 motion-reduce:transition-none">
                            →
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4 text-accent">
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

// Reitit (routes.tsx) tarvitsevat parametrittoman komponentin jokaiselle sivulle
const byId = (id: ServiceCategory["id"]) => serviceCategories.find((c) => c.id === id)!;
export const LiikuntaPage = () => <CategoryPage cat={byId("liikunta")} />;
export const HyvinvointiPage = () => <CategoryPage cat={byId("hyvinvointi")} />;
export const ValmennusPage = () => <CategoryPage cat={byId("valmennus")} />;
