// Calendar.tsx: tulevat tunnit.
// Tunnit tulevat lib/calendar.ts:stä (Amandan Google-kalenteri buildin aikana, tai esimerkkitunnit)
// ja renderöidään HTML:ksi jo buildissa.
//
// Jokaisella tunnilla:
// - Ilmoittaudu: valmiiksi täytetty sähköposti Amandalle
// - Omaan kalenteriin: Google-kalenteri tai .ics-tiedosto (Apple, Outlook, Android)
// - Jaa: puhelimen jakovalikko tai linkin kopiointi
// Lopussa linkit koko kalenterin tilaamiseen (vain oikealla kalenterilla).

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

export default function Calendar() {
  // Ensimmäinen piirto käyttää buildin hetkeä (sama kuin esirenderöidyssä HTML:ssä).
  // Selaimessa suodatetaan heti oikealla kellolla: jos sivu on rakennettu tunteja sitten,
  // jo päättyneet tunnit katoavat listasta.
  const [events, setEvents] = useState<CalendarEvent[]>(() => getUpcomingEvents());
  useEffect(() => {
    // Selaimen kello on ulkoinen järjestelmä, jota ei voi lukea renderöinnissä (hydraatio rikkoutuisi)
    // oxlint-disable-next-line react/set-state-in-effect
    setEvents((list) => filterUpcoming(list, Date.now()));
  }, []);

  const subscribe = subscribeLinks();

  return (
    <section id="kalenteri" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          title="Tulevat tunnit"
          intro="Ilmoittaudu tunnille, lisää se omaan kalenteriisi tai jaa ystävälle."
        />

        {/* Tyhjä tila: jos tunteja ei ole, kerrotaan se selkeästi tyhjän listan sijaan */}
        {events.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-7 text-muted">
            Tulevia tunteja ei ole juuri nyt kalenterissa. Kysy lisää:{" "}
            <a href={site.phoneHref} className="font-semibold text-accent">{site.phone}</a>
          </p>
        ) : (
          <ol className="flex flex-col gap-3.5">
            {events.map((e) => {
              const d = dateParts(e.start);
              const service = serviceHref(e.title);
              return (
                <li
                  key={e.id}
                  id={`tunti-${e.id}`} // Jakolinkki osoittaa suoraan tähän tuntiin
                  data-reveal
                  className="relative flex scroll-mt-28 flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-line bg-surface px-5 py-5 sm:px-6"
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
                    <a href={signupHref(e)} className={`${btn} bg-accent text-white hover:opacity-90`}>
                      Ilmoittaudu
                      <span className="sr-only">: {e.title} {formatShort(e.start)}</span>
                    </a>
                    <AddToCalendar event={e} />
                    <ShareButton
                      title={e.title}
                      text={`${formatShort(e.start)}${e.location ? ` · ${e.location}` : ""}`}
                      anchor={`tunti-${e.id}`}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
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
