// Calendar.tsx: tulevat tunnit.
// Server Component: tapahtumat haetaan palvelimella (lib/calendar.ts).
// Nyt esimerkkidataa, myöhemmin Google-kalenterista: tähän tiedostoon ei tarvitse koskea.

import SectionHeading from "@/components/ui/SectionHeading";
import ShareButton from "./ShareButton";
import { dateParts, formatShort, formatTime, getUpcomingEvents, googleCalendarUrl } from "@/lib/calendar";
import { site } from "@/lib/site";

export default async function Calendar() {
  // async-komponentti: odotetaan data ennen renderöintiä (toimii vain Server Componentissa)
  const events = await getUpcomingEvents();

  return (
    <section id="kalenteri" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          title="Tulevat tunnit"
          intro="Lisää tunti omaan kalenteriisi tai jaa se ystävälle."
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
              return (
                <li
                  key={e.id}
                  data-reveal
                  className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-line bg-surface px-5 py-5 sm:px-6"
                >
                  {/* Päivämäärälaatta. <time> kertoo koneille (hakukoneet, kalenterit) tarkan ajan. */}
                  <time dateTime={e.start} className="flex w-16 shrink-0 flex-col items-center border-r border-line pr-5">
                    <span className="text-xs font-semibold uppercase text-muted">{d.weekday}</span>
                    <span className="font-serif text-[40px] font-bold leading-none text-accent">{d.day}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">{d.month}</span>
                  </time>

                  {/* basis-40: mahtuu mobiilissa päivämäärälaatan viereen, painikkeet rivittyvät alle */}
                  <div className="min-w-0 grow basis-40">
                    <h3 className="text-[19px] font-semibold">{e.title}</h3>
                    <p className="text-[15px] text-muted">
                      klo {formatTime(e.start)}–{formatTime(e.end)} · {e.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Avaa Google-kalenterin valmiiksi täytetyllä tapahtumalla uudessa välilehdessä.
                        rel="noopener noreferrer": uusi välilehti ei pääse käsiksi tähän sivuun. */}
                    <a
                      href={googleCalendarUrl(e)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center rounded-md bg-lilac px-4 text-[15px] font-semibold transition hover:bg-lilac-strong"
                    >
                      + Kalenteriin
                      <span className="sr-only"> (avautuu uuteen välilehteen)</span>
                    </a>
                    <ShareButton title={e.title} text={`${formatShort(e.start)} · ${e.location}`} />
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
