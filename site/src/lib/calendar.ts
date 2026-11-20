// calendar.ts: tulevat tunnit ja kalenterin apufunktiot.
//
// Tunnit tulevat tiedostosta src/data/calendar.json, jonka scripts/fetch-calendar.mjs
// tekee ennen buildia: Amandan Google-kalenterista (tuotanto) tai esimerkkitunneista (kehitys).
// Komponentit käyttävät vain tämän tiedoston funktioita, eivätkä tiedä, mistä data tulee.
//
// TODO(Amanda): julkisen tuntikalenterin tunnus (GOOGLE_CALENDAR_ID, GitHubin salaisuudet).

import data from "@/data/calendar.json";
import { site } from "./site";
import { serviceCategories, serviceId } from "./services";
import { withBase } from "./paths";
import { mailtoHref } from "./contact";

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;       // ISO 8601 aikavyöhykkeellä, esim. "2026-11-03T18:00:00+02:00"
  end: string;
  location: string;
  description: string; // Pelkkää tekstiä, voi olla tyhjä
  full?: boolean;      // Excelin Tila "Täynnä": ilmoittautumispainike harmaana
};

type CalendarData = {
  source: "google" | "excel" | "esimerkki"; // excel = Amandan Excel (scripts/fetch-excel.mjs)
  fetchedAt: string;           // Milloin tunnit haettiin (buildin aika)
  subscribeUrl: string | null; // Julkisen kalenterin iCal-osoite (vain oikealla kalenterilla)
  googleAddUrl: string | null; // "Lisää Google-kalenteriin" koko kalenterille
  events: CalendarEvent[];
};

const calendar = data as CalendarData;

// Esimerkkitunnit vai oikea kalenteri (näytetään esim. tilauslinkki vain oikealle kalenterille)
export const calendarSource = calendar.source;
export const calendarFetchedAt = calendar.fetchedAt;

// Tunnit, jotka eivät ole vielä päättyneet hetkellä now
export function filterUpcoming(events: CalendarEvent[], now: number): CalendarEvent[] {
  return events.filter((e) => new Date(e.end).getTime() > now);
}

// Tulevat tunnit. Oletuksena "nyt" on hakuhetki, jolloin esirenderöity HTML ja selaimen
// ensimmäinen piirto ovat samat (hydraatio). Calendar.tsx suodattaa sen jälkeen selaimen
// oikealla kellolla, jos sivu on rakennettu tunteja sitten.
export function getUpcomingEvents(limit = 8, now = new Date(calendar.fetchedAt).getTime()): CalendarEvent[] {
  return filterUpcoming(calendar.events, now).slice(0, limit);
}

// Koko kalenterin tilaus: webcal:// avaa puhelimen ja tietokoneen kalenterisovelluksen suoraan
export function subscribeLinks(): { webcal: string; google: string } | null {
  if (!calendar.subscribeUrl || !calendar.googleAddUrl) return null;
  return { webcal: calendar.subscribeUrl.replace(/^https:/, "webcal:"), google: calendar.googleAddUrl };
}

// Tunnin nimi → palvelun ankkuri (Palvelut-osio), jos samanniminen palvelu löytyy.
// Esim. "Vesijumppa" → "/#vesijumppa". Vertailu ilman isoja kirjaimia.
export function serviceHref(title: string): string | null {
  const t = title.trim().toLowerCase();
  for (const cat of serviceCategories) {
    const match = cat.services.find((s) => s.title.toLowerCase() === t);
    if (match) return `/#${serviceId(match.title)}`;
  }
  return null;
}

// --- Muotoilu -------------------------------------------------------------
// Ajat muotoillaan aina Suomen aikavyöhykkeellä, vaikka palvelin olisi muualla
// (esim. build-palvelin Yhdysvalloissa, jolloin kellonajat olisivat väärin).
const TZ = "Europe/Helsinki";

// Palauttaa päivämäärän osat kalenterikorttia varten: { weekday: "ti", day: "3", month: "marrask." }
export function dateParts(iso: string) {
  const d = new Date(iso);
  const get = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("fi-FI", { timeZone: TZ, ...opts }).format(d);
  return {
    weekday: get({ weekday: "short" }),
    day: get({ day: "numeric" }),
    month: get({ month: "short" }),
  };
}

// Kellonaika muodossa "18.00"
export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("fi-FI", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(
    new Date(iso),
  );
}

// Lyhyt kuvaus jakamiseen ja ilmoittautumiseen, esim. "ti 3.11. klo 18.00"
export function formatShort(iso: string) {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("fi-FI", { timeZone: TZ, weekday: "short", day: "numeric", month: "numeric" }).format(d);
  return `${date} klo ${formatTime(iso)}`;
}

// Tunnin teksti Formsin tuntivalintaan: "Vesijumppa ti 1.12. klo 18.00"
// Peruutus: valmiiksi täytetty sähköposti Amandalle (tunti ja aika valmiina, samassa muodossa kuin
// lomakkeen Tunti-kentässä, jotta Amanda löytää vastauksen helposti). Lomake ei osaa perua.
export function cancelHref(e: CalendarEvent) {
  const label = signupLabel(e);
  return mailtoHref(
    `Peruutus: ${label}`,
    `Hei Amanda,\n\nperun ilmoittautumiseni tunnille ${label}${e.location ? ` (${e.location})` : ""}.\n\nNimi:\n`,
  );
}

export function signupLabel(e: CalendarEvent) {
  return `${e.title} ${formatShort(e.start)}`;
}

// --- Omaan kalenteriin ---------------------------------------------------------

// Google hyväksyy ajat UTC-muodossa YYYYMMDDTHHMMSSZ (esim. 20261103T160000Z). Sama muoto käy iCalendariin.
const toUtcStamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");

export function googleCalendarUrl(e: CalendarEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${e.title} – Tahkon Amanda`,
    dates: `${toUtcStamp(e.start)}/${toUtcStamp(e.end)}`,
    details: e.description || "Lisätiedot: tahkonamanda.fi",
    location: e.location,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

// .ics-tiedosto (Apple-kalenteri, Outlook, Androidin kalenterit). Tiedostot tehdään buildissa
// (scripts/prerender.mjs) kansioon dist/tunnit/, joten lataus toimii myös ilman JavaScriptiä.
export function icsPath(e: CalendarEvent) {
  return withBase(`/tunnit/${e.id}.ics`);
}

// iCalendar-teksti (RFC 5545): erikoismerkit koodataan ja pitkät rivit taitetaan 75 merkkiin
function icsEscape(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}
function fold(line: string) {
  const parts: string[] = [];
  let rest = line;
  while (rest.length > 75) {
    parts.push(rest.slice(0, 75));
    rest = ` ${rest.slice(75)}`;
  }
  parts.push(rest);
  return parts.join("\r\n");
}

export function toIcs(e: CalendarEvent, siteUrl: string, stamp = toUtcStamp(calendar.fetchedAt)) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tahkon Amanda//Tunnit//FI",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.id}@tahkonamanda.fi`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toUtcStamp(e.start)}`,
    `DTEND:${toUtcStamp(e.end)}`,
    `SUMMARY:${icsEscape(`${e.title} – Tahkon Amanda`)}`,
    e.location ? `LOCATION:${icsEscape(e.location)}` : "",
    `DESCRIPTION:${icsEscape(e.description || `Lisätiedot: ${siteUrl}`)}`,
    `URL:${siteUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return `${lines.map(fold).join("\r\n")}\r\n`;
}

// --- Ilmoittautuminen ------------------------------------------------------------

/**
 * Lomakepalvelu osoitteen perusteella. Tietosuoja- ja evästesivu kertovat sen nimellä, joten
 * teksti pysyy oikeana, vaikka lomake vaihtuisi Microsoftista Googleen tai päinvastoin.
 */
export function formProvider(form: string | null = site.signupForm): { name: string; company: string } | null {
  if (!form) return null;
  const host = new URL(form).hostname;
  if (host === "docs.google.com" || host === "forms.gle") return { name: "Google Forms", company: "Google" };
  if (host.endsWith("office.com") || host.endsWith("cloud.microsoft") || host.endsWith("microsoft.com")) {
    return { name: "Microsoft Forms", company: "Microsoft" };
  }
  return { name: "verkkolomake", company: "lomakepalvelun tarjoaja" };
}

// Ensisijaisesti Amandan Forms-lomake (site.signupForm): ilmoittautumiset kertyvät samaan
// Exceliin kuin ennenkin. Jos lomaketta ei ole, valmiiksi täytetty sähköposti.
export function signupHref(e: CalendarEvent, form: string | null = site.signupForm, prefill: string | null = site.signupFormPrefill) {
  // Valmiiksi täytetty linkki: tunnin nimi ja aika lomakkeen tuntivalintaan (Formsin vaihtoehdon teksti)
  if (prefill && prefill.includes("{tunti}")) return prefill.replace("{tunti}", encodeURIComponent(signupLabel(e)));
  if (form) return form;
  const subject = `Ilmoittautuminen: ${e.title} ${formatShort(e.start)}`;
  const body = `Hei Amanda,\n\nilmoittaudun tunnille ${e.title} (${formatShort(e.start)}, ${e.location}).\n\nNimi:\nPuhelin:\n`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
