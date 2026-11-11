// NextClass.tsx: "Seuraava tunti" -nosto heron alla.
// Tunti tulee samasta kalenteridatasta kuin Tulevat tunnit -osio (lib/calendar.ts), joten
// Amandan Google-kalenteriin lisätty tunti näkyy täällä automaattisesti.
// Linkki vie tunnin kohdalle kalenterissa, jossa on ilmoittautuminen ja kalenteriin lisäys.

import { useEffect, useState } from "react";
import { filterUpcoming, formatShort, getUpcomingEvents } from "@/lib/calendar";
import { withBase } from "@/lib/paths";

export default function NextClass() {
  // Ensimmäinen piirto käyttää buildin hetkeä (sama kuin esirenderöidyssä HTML:ssä),
  // selaimessa vaihdetaan heti oikean kellon mukaiseen seuraavaan tuntiin.
  const [event, setEvent] = useState(() => getUpcomingEvents(1)[0] ?? null);
  useEffect(() => {
    // Selaimen kello on ulkoinen järjestelmä, jota ei voi lukea renderöinnissä (hydraatio rikkoutuisi)
    // oxlint-disable-next-line react/set-state-in-effect
    setEvent(filterUpcoming(getUpcomingEvents(10), Date.now())[0] ?? null);
  }, []);

  // Ei tulevia tunteja: nostoa ei näytetä (Tulevat tunnit -osio kertoo tilanteen)
  if (!event) return null;

  return (
    <a
      href={withBase(`/#tunti-${event.id}`)}
      className="flex max-w-[520px] items-center gap-3 rounded-2xl border border-line bg-white py-3 pl-4 pr-3.5 shadow-[0_6px_18px_rgba(34,29,74,0.07)] transition hover:border-border"
    >
      {/* Vihreä "päällä"-pallo. Sykkii vain, jos kävijä ei ole rajoittanut animaatioita. */}
      <span aria-hidden="true" className="relative size-2.5 shrink-0 rounded-full bg-[#2e9e6b]">
        <span className="absolute inset-0 rounded-full bg-[#2e9e6b] opacity-60 motion-safe:animate-ping" />
      </span>
      <span className="min-w-0 text-[15px] leading-snug">
        <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-muted">Seuraava tunti</span>
        {formatShort(event.start)} · <strong>{event.title}</strong>
        {event.location && <span className="text-muted"> · {event.location}</span>}
      </span>
      <span className="ml-auto whitespace-nowrap pl-2 text-[15px] font-semibold text-accent">
        Ilmoittaudu <span aria-hidden="true">→</span>
      </span>
    </a>
  );
}
