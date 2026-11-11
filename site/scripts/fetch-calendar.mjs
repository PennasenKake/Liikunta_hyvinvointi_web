// fetch-calendar.mjs: hakee tulevat tunnit Amandan Google-kalenterista ennen buildia.
// Ajetaan automaattisesti ennen komentoja dev, build, test ja check (package.json: pre-skriptit).
//
// Tulos: src/data/calendar.json (ei versionhallinnassa). Sivusto lukee tunnit tästä
// tiedostosta (lib/calendar.ts), joten kävijän selain ei koskaan ota yhteyttä Googleen.
//
// Tilat:
// - GOOGLE_CALENDAR_ID ja GOOGLE_API_KEY asetettu (GitHub Actions -salaisuudet):
//   haetaan oikeat tunnit. Jos haku epäonnistuu, skripti päättyy virheeseen, jolloin julkaisu
//   keskeytyy ja sivulla pysyy edellinen, toimiva versio (parempi kuin tyhjä kalenteri).
// - Muuttujia ei ole (kehitys, testit, CI): esimerkkitunnit seuraaville kahdelle viikolle.
//
// API-avain ei koskaan päädy sivuston koodiin: sitä käytetään vain tässä build-vaiheessa.

import { mkdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const OUT = "src/data/calendar.json";
const DAYS_AHEAD = 60;   // Kuinka pitkälle eteenpäin tunteja haetaan
const MAX_EVENTS = 50;   // Enintään näin monta tuntia
const TZ = "Europe/Helsinki";

// --- Apufunktiot (exportattu yksikkötestejä varten) ---------------------------------

// Google-kalenterin kuvaus voi sisältää HTML:ää (<br>, <a>). Sivulle vain pelkkä teksti.
export function plainText(html = "") {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 400); // Pitkä kuvaus katkaistaan: kalenterikortti ei ole oikea paikka romaanille
}

// Google Calendar API:n tapahtuma → sivuston muoto. null = tapahtuma ohitetaan.
// Kokopäivän tapahtumat (esim. "Loma") ohitetaan: tunneilla on aina kellonaika.
export function normalizeEvent(item) {
  if (!item || item.status === "cancelled") return null;
  const start = item.start?.dateTime;
  const end = item.end?.dateTime;
  if (!start || !end || !item.summary) return null;
  return {
    // Tunnus tiedostonimiin ja ankkureihin: vain kirjaimet, numerot ja alaviiva
    id: String(item.id).replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 80),
    title: item.summary.trim(),
    start,
    end,
    location: (item.location ?? "").trim(),
    description: plainText(item.description),
  };
}

// Aikavyöhykkeen siirtymä Helsingissä annettuna päivänä, esim. "+02:00" (talvi) tai "+03:00" (kesä)
function helsinkiOffset(date) {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "longOffset" })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName").value; // "GMT+02:00"
  return name === "GMT" ? "+00:00" : name.slice(3);
}

// Esimerkkitunnit: viikoittainen runko seuraaville 14 päivälle buildin päivästä alkaen,
// jotta kalenterissa on aina tulevia tunteja kehityksessä ja testeissä.
// Paikat ovat paikkamerkkejä ("[Paikka]"), kuten muukin Amandalta odotettava sisältö.
const SAMPLE_WEEK = [
  { weekday: 2, time: "18:00", minutes: 45, title: "Vesijumppa", location: "[Paikka], Tahko" },
  { weekday: 3, time: "17:30", minutes: 75, title: "Yin jooga", location: "[Paikka], Siilinjärvi" },
  { weekday: 3, time: "19:00", minutes: 60, title: "Äänimaljarentoutus", location: "[Paikka], Siilinjärvi" },
  { weekday: 4, time: "18:00", minutes: 45, title: "HIIT", location: "[Paikka], Kuopio" },
  { weekday: 6, time: "10:00", minutes: 60, title: "Keppijumppa", location: "[Paikka], Rautavaara" },
];

export function sampleEvents(now = new Date()) {
  const events = [];
  for (let day = 1; day <= 14; day++) {
    const date = new Date(now.getTime() + day * 86_400_000);
    // Päivä ja viikonpäivä Helsingin ajassa (ei build-palvelimen aikavyöhykkeessä)
    const ymd = new Intl.DateTimeFormat("sv-SE", { timeZone: TZ }).format(date); // "2026-11-11"
    const weekday = new Date(`${ymd}T12:00:00Z`).getUTCDay();
    for (const s of SAMPLE_WEEK.filter((w) => w.weekday === weekday)) {
      const offset = helsinkiOffset(date);
      const start = `${ymd}T${s.time}:00${offset}`;
      const end = new Date(new Date(start).getTime() + s.minutes * 60_000);
      // Loppuaika samassa muodossa (paikallinen aika + siirtymä)
      const endLocal = new Intl.DateTimeFormat("sv-SE", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(end);
      events.push({
        id: `esimerkki_${ymd.replace(/-/g, "")}_${s.time.replace(":", "")}`,
        title: s.title,
        start,
        end: `${ymd}T${endLocal}:00${offset}`,
        location: s.location,
        description: "",
      });
    }
  }
  return events;
}

// Hakee tunnit Google Calendar API:sta (events.list).
// singleEvents=true purkaa toistuvat tunnit (esim. "joka tiistai") yksittäisiksi kerroiksi,
// orderBy=startTime järjestää ne aikajärjestykseen. fields rajaa vastauksen vain tarvittaviin kenttiin.
export async function fetchGoogleEvents({ calendarId, apiKey, now = new Date(), fetchImpl = fetch }) {
  const params = new URLSearchParams({
    key: apiKey,
    singleEvents: "true",
    orderBy: "startTime",
    timeMin: now.toISOString(),
    timeMax: new Date(now.getTime() + DAYS_AHEAD * 86_400_000).toISOString(),
    maxResults: String(MAX_EVENTS),
    fields: "items(id,status,summary,location,description,start,end)",
  });
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`;
  const res = await fetchImpl(url);
  if (!res.ok) {
    // Avainta ei tulosteta lokiin: virheilmoituksessa vain tilakoodi ja Googlen selitys
    const body = await res.text().catch(() => "");
    throw new Error(`Google Calendar API vastasi ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  return (data.items ?? []).map(normalizeEvent).filter(Boolean);
}

// --- Ajo ----------------------------------------------------------------------

async function main() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim();
  const apiKey = process.env.GOOGLE_API_KEY?.trim();
  const now = new Date();

  let result;
  if (calendarId && apiKey) {
    const events = await fetchGoogleEvents({ calendarId, apiKey, now });
    // Tilauslinkki koko kalenteriin: julkisen kalenterin iCal-osoite (tunnus on julkinen tieto,
    // koska kalenteri on julkinen; API-avainta ei tallenneta)
    result = {
      source: "google",
      fetchedAt: now.toISOString(),
      subscribeUrl: `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`,
      googleAddUrl: `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(calendarId)}`,
      events,
    };
    console.log(`kalenteri: ${events.length} tuntia Google-kalenterista`);
  } else {
    result = { source: "esimerkki", fetchedAt: now.toISOString(), subscribeUrl: null, googleAddUrl: null, events: sampleEvents(now) };
    console.log(`kalenteri: esimerkkitunnit (${result.events.length} kpl), GOOGLE_CALENDAR_ID/GOOGLE_API_KEY puuttuu`);
  }

  await mkdir("src/data", { recursive: true });
  await writeFile(OUT, `${JSON.stringify(result, null, 2)}\n`);
}

// Ajetaan vain, kun skripti käynnistetään suoraan (ei kun testit tuovat funktiot)
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((err) => {
    console.error(`kalenterin haku epäonnistui: ${err.message}`);
    process.exit(1); // Julkaisu keskeytyy, edellinen toimiva versio jää näkyviin
  });
}
