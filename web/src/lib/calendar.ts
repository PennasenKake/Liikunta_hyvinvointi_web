// calendar.ts: tulevat tunnit ja kalenterin apufunktiot.
//
// NYT: esimerkkitapahtumat kovakoodattuna (MOCK_EVENTS).
// MYÖHEMMIN (vaihe 7): getUpcomingEvents hakee tapahtumat Amandan Google-kalenterista.
// Komponentit kutsuvat vain getUpcomingEvents-funktiota, joten vaihto tehdään
// pelkästään tähän tiedostoon.
//
// TODO(Amanda): Google-kalenterin tunniste, johon tunnit lisätään.

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;    // ISO 8601 aikavyöhykkeellä, esim. "2026-11-03T18:00:00+02:00"
  end: string;
  location: string;
  description?: string;
};

// Esimerkkitapahtumat. Ajat ja paikat ovat paikkamerkkejä.
const MOCK_EVENTS: CalendarEvent[] = [
  { id: "1", title: "Vesijumppa", start: "2026-11-03T18:00:00+02:00", end: "2026-11-03T18:45:00+02:00", location: "[Paikka], Tahko" },
  { id: "2", title: "Yin jooga", start: "2026-11-05T17:30:00+02:00", end: "2026-11-05T18:45:00+02:00", location: "[Paikka], Siilinjärvi" },
  { id: "3", title: "Äänimaljarentoutus", start: "2026-11-05T19:00:00+02:00", end: "2026-11-05T20:00:00+02:00", location: "[Paikka], Siilinjärvi" },
  { id: "4", title: "HIIT", start: "2026-11-10T18:00:00+02:00", end: "2026-11-10T18:45:00+02:00", location: "[Paikka], Kuopio" },
  { id: "5", title: "Keppijumppa", start: "2026-11-12T10:00:00+02:00", end: "2026-11-12T11:00:00+02:00", location: "[Paikka], Rautavaara" },
  { id: "6", title: "Kristallimaljarentoutus", start: "2026-11-19T18:30:00+02:00", end: "2026-11-19T19:30:00+02:00", location: "[Paikka], Tahko" },
];

// Hakee tulevat tapahtumat.
// "use cache" on Next.js 16:n välimuistidirektiivi: tulos tallennetaan, eikä funktiota
// ajeta jokaisella sivulatauksella. Nyt data on vakio, mutta kun haku vaihtuu
// Google-kalenteriin, sama direktiivi estää API-kutsun jokaiselle kävijälle.
export async function getUpcomingEvents(limit = 6): Promise<CalendarEvent[]> {
  "use cache";
  return MOCK_EVENTS.slice(0, limit);
}

// --- Muotoilu -------------------------------------------------------------
// Ajat muotoillaan aina Suomen aikavyöhykkeellä, vaikka palvelin olisi muualla
// (esim. Netlifyn palvelin Yhdysvalloissa, jolloin kellonajat olisivat väärin).
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

// Lyhyt kuvaus Heron korttiin ja jakamiseen, esim. "ti 3.11. klo 18.00"
export function formatShort(iso: string) {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("fi-FI", { timeZone: TZ, weekday: "short", day: "numeric", month: "numeric" }).format(d);
  return `${date} klo ${formatTime(iso)}`;
}

// --- "Lisää Google-kalenteriin" -linkki ---------------------------------------
// Google hyväksyy ajat UTC-muodossa YYYYMMDDTHHMMSSZ (esim. 20261103T160000Z).
const toGoogleDate = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");

export function googleCalendarUrl(e: CalendarEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${e.title} – Tahkon Amanda`,
    dates: `${toGoogleDate(e.start)}/${toGoogleDate(e.end)}`,
    details: e.description ?? "Lisätiedot: tahkonamanda.fi",
    location: e.location,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
