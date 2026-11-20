// Calendar.tsx: tulevat tunnit.
// Tunnit tulevat lib/calendar.ts:stä (Amandan Google-kalenteri buildin aikana, tai esimerkkitunnit)
// ja renderöidään HTML:ksi jo buildissa.
//
// Jokaisella tunnilla:
// - Ilmoittaudu: valmiiksi täytetty sähköposti Amandalle
// - Omaan kalenteriin: Google-kalenteri tai .ics-tiedosto (Apple, Outlook, Android)
// - Jaa: puhelimen jakovalikko tai linkin kopiointi
// Lopussa linkit koko kalenterin tilaamiseen (vain oikealla kalenterilla).

import { contactHref } from "@/lib/contact";
import LotusMandala from "@/components/ui/LotusMandala";
import { useEffect, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import ShareButton from "./ShareButton";
import {
  dateParts,
  filterUpcoming,
  formatShort,
  formatTime,
  getUpcomingEvents,
  googleCalendarUrl,
  icsPath,
  serviceHref,
  signupHref,
  cancelHref,
  subscribeLinks,
  type CalendarEvent,
} from "@/lib/calendar";
import { site } from "@/lib/site";
import { withBase } from "@/lib/paths";

// Yhteiset painikeluokat. min-h-11 = 44 px kosketusalue.
const btn = "inline-flex min-h-11 items-center rounded-md px-4 text-[15px] font-semibold transition";

// "Omaan kalenteriin" -valinta: <details> avautuu ilman JavaScriptiäkin ja on näppäimistöllä
// käytettävä (Enter/välilyönti). Valikko on painikkeen alla: mobiilissa kortin levyinen
// (kapealla näytöllä painikkeen levyinen valikko menisi ruudun yli), isommilla painikkeen kokoinen.
function AddToCalendar({ event }: { event: CalendarEvent }) {
  return (
    <details className="group/cal sm:relative">
      <summary className={`${btn} cursor-pointer list-none bg-lilac hover:bg-lilac-strong [&::-webkit-details-marker]:hidden`}>
        + Kalenteriin
        <span className="sr-only">: {event.title}</span>
      </summary>
      <ul className="absolute inset-x-4 z-20 mt-2 rounded-xl sm:inset-x-auto sm:right-0 sm:w-60 border border-line bg-white p-1.5 shadow-[0_10px_30px_rgba(34,29,74,0.14)]">
        <li>
          <a
            href={googleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer" // Uusi välilehti ei pääse käsiksi tähän sivuun
            className="flex min-h-11 items-center rounded-lg px-3 text-[15px] hover:bg-lilac-soft"
          >
            Google-kalenteri
            <span className="sr-only"> (avautuu uuteen välilehteen)</span>
          </a>
        </li>
        <li>
          <a href={icsPath(event)} download className="flex min-h-11 items-center rounded-lg px-3 text-[15px] hover:bg-lilac-soft">
            Apple, Outlook tai muu (.ics)
          </a>
        </li>
      </ul>
    </details>
  );
}

const VISIBLE = 5; // Montako tuntia näytetään ennen "Näytä kaikki" -painiketta

export default function Calendar() {
  // Ensimmäinen piirto käyttää buildin hetkeä (sama kuin esirenderöidyssä HTML:ssä).
  // Selaimessa suodatetaan heti oikealla kellolla: jos sivu on rakennettu tunteja sitten,
  // jo päättyneet tunnit katoavat listasta.
  const [events, setEvents] = useState<CalendarEvent[]>(() => getUpcomingEvents());
  // Puhelimessa kymmenen tunnin lista on pitkä: aluksi näytetään lähimmät, loput painikkeella.
  // Ilman JavaScriptiä kaikki näkyvät (index.css: .cal-extra piilotetaan vain has-js-tilassa).
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    // Selaimen kello on ulkoinen järjestelmä, jota ei voi lukea renderöinnissä (hydraatio rikkoutuisi)
    // oxlint-disable-next-line react/set-state-in-effect
    setEvents((list) => filterUpcoming(list, Date.now()));
  }, []);

  // Jakolinkki (#tunti-…) voi osoittaa piilossa olevaan tuntiin: avataan koko lista ja vieritetään.
  // Sekä sivun avautuessa että kun osoitteen #-osa vaihtuu samalla sivulla.
  useEffect(() => {
    const reveal = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!id.startsWith("tunti-")) return;
      if (document.getElementById(id)?.classList.contains("cal-extra")) {
        setShowAll(true);
        requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
      }
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);

  const subscribe = subscribeLinks();
  const form = site.signupForm;

  return (
    // relative isolate overflow-hidden: lootusmandala osion taakse, leikkautuu reunoihin
    <section id="kalenteri" className="relative isolate overflow-hidden bg-white px-6 py-24">
      {/* Lootusmandala oikeassa yläkulmassa, tekstipalstan ulkopuolella (puhelimessa pieni kulmassa) */}
      <LotusMandala className="-right-24 -top-16 w-52 opacity-35 lg:-right-[220px] lg:top-10 lg:w-[460px] lg:opacity-40" />
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          title="Tulevat tunnit"
          intro={
            form
              ? "Ilmoittaudu tunnille lomakkeella. Voit myös lisätä tunnin omaan kalenteriisi tai jakaa sen ystävälle."
              : "Ilmoittaudu tunnille, lisää se omaan kalenteriisi tai jaa ystävälle."
          }
        />

        {/* Tyhjä tila: jos tunteja ei ole, kerrotaan se selkeästi tyhjän listan sijaan */}
        {events.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-7 text-muted">
            Tulevia tunteja ei ole juuri nyt kalenterissa.{" "}
            <a href={contactHref} className="font-semibold text-accent underline-offset-4 hover:underline">Kysy lisää sähköpostilla</a>
          </p>
        ) : (
          <ol className="flex flex-col gap-3.5">
            {events.map((e, i) => {
              const d = dateParts(e.start);
              const service = serviceHref(e.title);
              return (
                <li
                  key={e.id}
                  id={`tunti-${e.id}`} // Jakolinkki osoittaa suoraan tähän tuntiin
                  data-reveal
                  className={`${!showAll && i >= VISIBLE ? "cal-extra " : ""}relative flex scroll-mt-28 flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-line bg-surface px-5 py-5 sm:px-6`}
                >
                  {/* Päivämäärälaatta. <time> kertoo koneille (hakukoneet, kalenterit) tarkan ajan. */}
                  <time dateTime={e.start} className="flex w-16 shrink-0 flex-col items-center border-r border-line pr-5">
                    <span className="text-xs font-semibold uppercase text-muted">{d.weekday}</span>
                    <span className="font-serif text-[40px] font-bold leading-none text-accent">{d.day}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">{d.month}</span>
                  </time>

                  {/* basis-40: mahtuu mobiilissa päivämäärälaatan viereen, painikkeet rivittyvät alle */}
                  <div className="min-w-0 grow basis-40">
                    <h3 className="text-[19px] font-semibold">
                      {/* Tunnin nimi linkkinä palvelun kuvaukseen, jos samanniminen palvelu löytyy */}
                      {service ? (
                        <a href={withBase(service)} className="underline-offset-4 hover:text-accent hover:underline">
                          {e.title}
                        </a>
                      ) : (
                        e.title
                      )}
                    </h3>
                    <p className="text-[15px] text-muted">
                      klo {formatTime(e.start)}–{formatTime(e.end)}
                      {e.location && ` · ${e.location}`}
                    </p>
                    {e.description && (
                      <p className="mt-1 line-clamp-2 whitespace-pre-line text-[15px] text-ink-soft">{e.description}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Täysi tunti (Excelin Tila "Täynnä"): ei linkkiä, harmaa merkintä. Kalenteriin lisäys ja jako
                        toimivat edelleen, jos kävijä haluaa tulla katsomaan tai kysyä peruutuspaikkaa. */}
                    {e.full ? (
                      <span className={`${btn} cursor-default bg-line text-muted`}>
                        Täynnä<span className="sr-only">: {e.title} {formatShort(e.start)}</span>
                      </span>
                    ) : (
                      /* Forms avautuu uuteen välilehteen, jotta tuntilista jää auki taustalle */
                      <a
                        href={signupHref(e)}
                        {...(form ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className={`${btn} bg-accent text-white hover:opacity-90`}
                      >
                        Ilmoittaudu
                        <span className="sr-only">: {e.title} {formatShort(e.start)}{form && " (lomake avautuu uuteen välilehteen)"}</span>
                      </a>
                    )}
                    <AddToCalendar event={e} />
                    <ShareButton
                      title={e.title}
                      text={`${formatShort(e.start)}${e.location ? ` · ${e.location}` : ""}`}
                      anchor={`tunti-${e.id}`}
                    />
                    {/* Peruutus sähköpostilla (lomake ei osaa perua). Pieni tekstilinkki, koska harvoin tarvittu.
                        Näkyy myös täydellä tunnilla: ilmoittautuneet voivat perua. */}
                    <a
                      href={cancelHref(e)}
                      className="inline-flex min-h-11 items-center px-1 text-[14px] text-muted underline underline-offset-4 hover:text-accent"
                    >
                      Peru ilmoittautuminen<span className="sr-only">: {e.title} {formatShort(e.start)}</span>
                    </a>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        {!showAll && events.length > VISIBLE && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="cal-more mt-4 inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-white px-6 font-semibold text-accent transition hover:bg-lilac-soft"
          >
            Näytä kaikki tunnit ({events.length})
          </button>
        )}

        {/* Koko kalenterin tilaus: kävijän kalenteri päivittää uudet tunnit itse */}
        {subscribe && (
          <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] text-muted">
            Haluatko kaikki tunnit omaan kalenteriisi?
            <a href={subscribe.webcal} className="font-semibold text-accent underline-offset-4 hover:underline">
              Tilaa kalenteri
            </a>
            <a
              href={subscribe.google}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent underline-offset-4 hover:underline"
            >
              Lisää Google-kalenteriin
              <span className="sr-only"> (avautuu uuteen välilehteen)</span>
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
