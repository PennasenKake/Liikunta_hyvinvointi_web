// fetch-excel.mjs: tulevat tunnit Amandan Excel-tiedostosta (OneDrive-jakolinkki) buildin aikana.
// Vaihtoehto Google-kalenterille. fetch-calendar.mjs kutsuu tätä, kun SCHEDULE_EXCEL_URL on asetettu.
//
// Miksi ladataan koko tiedosto eikä käytetä Excelin rajapintaa: Microsoft Graphin Excel-rajapinta
// ei toimi luotettavasti henkilökohtaisella (outlook.com) OneDrivella. Katselulinkillä jaetun
// tiedoston voi ladata ilman kirjautumista, ja .xlsx on zip-paketti, jonka luemme itse.
//
// Tiedoston rakenne (materiaalit/tunnit-pohja.xlsx): välilehti "Tunnit", ensimmäinen rivi otsikot:
//   Päivä | Alkaa | Päättyy | Tunti | Paikka | Lisätieto | Tila
// Tila: tyhjä = ilmoittautuminen auki, "Täynnä" = painike harmaana, "Peruttu" = ei näy sivulla.
//
// Turvallisuus:
// - Linkki on GitHubin salaisuus (SCHEDULE_EXCEL_URL), ei koodissa eikä selaimessa. Sitä ei tulosteta lokiin.
// - Tiedostosta luetaan vain yllä olevat sarakkeet. Ylimääräiset sarakkeet ohitetaan, jottei esim.
//   vahingossa lisätty "Osallistujat"-sarake päädy julkiselle sivulle.
// - Teksti on pelkkää tekstiä (Preact koodaa sen), ja pituudet rajataan.

import { unzipSync, strFromU8 } from "fflate";

export const COLUMNS = { date: "päivä", start: "alkaa", end: "päättyy", title: "tunti", location: "paikka", info: "lisätieto", status: "tila" };
const SHEET_NAME = "tunnit";
const DEFAULT_MINUTES = 60; // Jos loppuaika puuttuu
const TZ = "Europe/Helsinki";

// --- Lataus ----------------------------------------------------------------------

// OneDrive-jakolinkistä ladattavat osoitteet kokeilujärjestyksessä:
// 1. OneDriven jakorajapinta (shares/u!<base64url>), toimii katselulinkille ilman kirjautumista
// 2. sama linkki ?download=1 -lisällä (SharePoint- ja OneDrive for Business -linkit)
// 3. linkki sellaisenaan (suora .xlsx-osoite)
export function downloadCandidates(shareUrl) {
  const url = shareUrl.trim();
  const encoded = Buffer.from(url).toString("base64").replace(/=+$/, "").replace(/\//g, "_").replace(/\+/g, "-");
  const withDownload = url + (url.includes("?") ? "&" : "?") + "download=1";
  return [`https://api.onedrive.com/v1.0/shares/u!${encoded}/root/content`, withDownload, url];
}

// .xlsx on zip: tiedosto alkaa tavuilla "PK". Näin tunnistetaan, ettei saatu kirjautumissivua (HTML).
export function isXlsx(bytes) {
  return bytes.length > 4 && bytes[0] === 0x50 && bytes[1] === 0x4b;
}

export async function downloadWorkbook(shareUrl, { fetchImpl = fetch, log = () => {} } = {}) {
  const tried = [];
  for (const [i, url] of downloadCandidates(shareUrl).entries()) {
    try {
      const res = await fetchImpl(url, { redirect: "follow", headers: { "User-Agent": "tahkonamanda-build" } });
      const bytes = new Uint8Array(await res.arrayBuffer());
      if (res.ok && isXlsx(bytes)) {
        log(`Excel ladattu tavalla ${i + 1}/3 (${Math.round(bytes.length / 1024)} kt)`);
        return bytes;
      }
      tried.push(`tapa ${i + 1}: HTTP ${res.status}${res.ok ? ", ei Excel-tiedosto" : ""}`);
    } catch (err) {
      tried.push(`tapa ${i + 1}: ${err.message}`);
    }
  }
  // Linkkiä ei tulosteta: se on salaisuus
  throw new Error(`Excel-tiedostoa ei saatu ladattua (${tried.join("; ")}). Tarkista, että tiedosto on jaettu katselulinkillä.`);
}

// --- .xlsx-tiedoston luku ---------------------------------------------------------

const decode = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&");

// Solun teksti: kaikki <t>-elementit yhteen (muotoiltu teksti on pilkottu useaan osaan)
const textOf = (xml) => [...xml.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((m) => decode(m[1])).join("");

// Sarakkeen kirjaimet → indeksi: "A" → 0, "AA" → 26
const colIndex = (ref) => [...ref.replace(/\d+/g, "")].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;

// Palauttaa välilehden "Tunnit" (tai ensimmäisen) rivit taulukkona: [[solu, solu, ...], ...]
// Numerot palautetaan lukuina (päivämäärät ja kellonajat ovat Excelissä lukuja), muut tekstinä.
export function readSheet(bytes) {
  const files = unzipSync(bytes, { filter: (f) => f.name.startsWith("xl/") });
  const read = (name) => (files[name] ? strFromU8(files[name]) : "");
  const workbook = read("xl/workbook.xml");
  const date1904 = /date1904="(1|true)"/.test(workbook);

  // Välilehden nimi → tiedosto (workbook.xml + workbook.xml.rels)
  const sheets = [...workbook.matchAll(/<sheet\b[^>]*?name="([^"]*)"[^>]*?r:id="([^"]*)"/g)].map((m) => ({ name: decode(m[1]), rid: m[2] }));
  if (sheets.length === 0) throw new Error("Excel-tiedostossa ei ole välilehtiä");
  const sheet = sheets.find((s) => s.name.trim().toLowerCase() === SHEET_NAME) ?? sheets[0];
  const rels = read("xl/_rels/workbook.xml.rels");
  const target = [...rels.matchAll(/<Relationship\b[^>]*>/g)]
    .map((m) => m[0])
    .find((r) => r.includes(`Id="${sheet.rid}"`))
    ?.match(/Target="([^"]+)"/)?.[1];
  if (!target) throw new Error(`Välilehden "${sheet.name}" tiedostoa ei löydy`);
  const path = target.startsWith("/") ? target.slice(1) : `xl/${target.replace(/^\.\//, "")}`;

  const shared = [...read("xl/sharedStrings.xml").matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => textOf(m[1]));
  const rows = [];
  for (const rowMatch of read(path).matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
    const row = [];
    for (const c of rowMatch[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const attrs = c[1];
      const inner = c[2] ?? "";
      const ref = attrs.match(/r="([A-Z]+\d+)"/)?.[1];
      const type = attrs.match(/t="([^"]+)"/)?.[1];
      const v = inner.match(/<v>([\s\S]*?)<\/v>/)?.[1];
      let value = null;
      if (type === "s") value = shared[Number(v)] ?? "";
      else if (type === "inlineStr") value = textOf(inner);
      else if (type === "str" || type === "e") value = v === undefined ? null : decode(v);
      else if (type === "b") value = v === "1";
      else if (v !== undefined) value = Number(v);
      row[ref ? colIndex(ref) : row.length] = value;
    }
    rows.push(row);
  }
  return { rows, date1904, sheetName: sheet.name };
}

// --- Rivien tulkinta ----------------------------------------------------------------

const pad = (n) => String(n).padStart(2, "0");

// Päivä: Excelin päivämääräluku (1900- tai 1904-järjestelmä) tai teksti "1.12.2026" / "2026-12-01"
export function parseDate(value, date1904 = false) {
  if (typeof value === "number" && value > 0) {
    const base = date1904 ? Date.UTC(1904, 0, 1) : Date.UTC(1899, 11, 30);
    const d = new Date(base + Math.floor(value) * 86_400_000);
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  }
  if (typeof value !== "string") return null;
  const s = value.trim();
  let m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) return valid(+m[3], +m[2], +m[1]);
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return valid(+m[1], +m[2], +m[3]);
  return null;
}
function valid(y, mo, d) {
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d ? `${y}-${pad(mo)}-${pad(d)}` : null;
}

// Kellonaika: Excelin vuorokauden osa (0.75 = 18:00) tai teksti "18:00" / "18.00" / "18"
export function parseTime(value) {
  if (typeof value === "number" && value >= 0) {
    const minutes = Math.round((value % 1) * 1440);
    if (minutes >= 1440) return null;
    return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
  }
  if (typeof value !== "string") return null;
  const m = value.trim().match(/^(\d{1,2})(?:[:.](\d{2}))?$/);
  if (!m || +m[1] > 23 || +(m[2] ?? 0) > 59) return null;
  return `${pad(+m[1])}:${m[2] ?? "00"}`;
}

// Helsingin aikavyöhykkeen siirtymä annettuna päivänä ja kellonaikana ("+02:00" talvella, "+03:00" kesällä)
function helsinkiOffset(ymd, hm) {
  const probe = new Date(`${ymd}T${hm}:00Z`);
  const name = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "longOffset" })
    .formatToParts(probe)
    .find((p) => p.type === "timeZoneName").value;
  return name === "GMT" ? "+00:00" : name.slice(3);
}
const iso = (ymd, hm) => `${ymd}T${hm}:00${helsinkiOffset(ymd, hm)}`;

const clean = (v, max) => (v === null || v === undefined ? "" : String(v)).replace(/\s+/g, " ").trim().slice(0, max);
const slug = (s) =>
  s.toLowerCase().replace(/ä/g, "a").replace(/ö/g, "o").replace(/å/g, "a").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

// Taulukon rivit → tunnit. Palauttaa myös hylätyt rivit syineen (näkyvät buildin lokissa).
// Rivinumerot ovat samat kuin Excelissä (otsikko = rivi 1).
export function rowsToEvents(rows, { date1904 = false, now = new Date(), daysAhead = 60 } = {}) {
  const header = (rows[0] ?? []).map((h) => clean(h, 40).toLowerCase());
  const col = Object.fromEntries(Object.entries(COLUMNS).map(([key, name]) => [key, header.indexOf(name)]));
  const missing = ["date", "start", "title"].filter((k) => col[k] < 0).map((k) => COLUMNS[k]);
  if (missing.length > 0) throw new Error(`Excelistä puuttuu sarake: ${missing.join(", ")} (otsikkorivi: ${header.filter(Boolean).join(", ")})`);

  const events = [];
  const rejected = [];
  const skipped = { past: 0, cancelled: 0 };
  const until = now.getTime() + daysAhead * 86_400_000;
  const get = (row, key) => (col[key] >= 0 ? row[col[key]] : null);

  rows.slice(1).forEach((row, i) => {
    const line = i + 2;
    if (!row || row.every((v) => v === null || v === undefined || v === "")) return; // Tyhjä rivi
    const title = clean(get(row, "title"), 80);
    const ymd = parseDate(get(row, "date"), date1904);
    const start = parseTime(get(row, "start"));
    const endRaw = get(row, "end");
    const status = clean(get(row, "status"), 20).toLowerCase();
    if (!title) return rejected.push({ line, reason: "Tunti puuttuu" });
    if (!ymd) return rejected.push({ line, reason: `Päivä puuttuu tai on väärässä muodossa (${clean(get(row, "date"), 20) || "tyhjä"})` });
    if (!start) return rejected.push({ line, reason: "Alkuaika puuttuu tai on väärässä muodossa" });
    let end = endRaw === null || endRaw === undefined || endRaw === "" ? null : parseTime(endRaw);
    if (endRaw && !end) return rejected.push({ line, reason: "Loppuaika on väärässä muodossa" });
    if (end && end <= start) return rejected.push({ line, reason: `Loppuaika ${end} ei ole alkuajan ${start} jälkeen` });
    if (status === "peruttu") return skipped.cancelled++;

    const startIso = iso(ymd, start);
    let endIso;
    if (end) endIso = iso(ymd, end);
    else {
      const e = new Date(new Date(startIso).getTime() + DEFAULT_MINUTES * 60_000);
      const hm = new Intl.DateTimeFormat("sv-SE", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(e);
      endIso = iso(ymd, hm);
    }
    const endMs = new Date(endIso).getTime();
    if (endMs <= now.getTime() || new Date(startIso).getTime() > until) return skipped.past++;

    events.push({
      id: `excel_${ymd.replace(/-/g, "")}_${start.replace(":", "")}_${slug(title)}`.slice(0, 80),
      title,
      start: startIso,
      end: endIso,
      location: clean(get(row, "location"), 120),
      description: clean(get(row, "info"), 300),
      ...(status === "täynnä" ? { full: true } : {}),
    });
  });

  events.sort((a, b) => a.start.localeCompare(b.start));
  // Sama tunti kahdesti (sama päivä, aika ja nimi): pidetään ensimmäinen, jotta tunnukset pysyvät yksilöllisinä
  const seen = new Set();
  const unique = events.filter((e) => (seen.has(e.id) ? false : seen.add(e.id)));
  const rowCount = rows.slice(1).filter((r) => r && r.some((v) => v !== null && v !== undefined && v !== "")).length;
  return { events: unique, rejected, skipped, duplicates: events.length - unique.length, rowCount };
}

// Koko ketju: lataus → luku → tunnit. Kirjoittaa yhteenvedon lokiin (ei linkkiä).
export async function fetchExcelEvents({ url, now = new Date(), fetchImpl = fetch, log = console.log }) {
  const bytes = await downloadWorkbook(url, { fetchImpl, log });
  const { rows, date1904, sheetName } = readSheet(bytes);
  const result = rowsToEvents(rows, { date1904, now });
  log(`Excel: välilehti "${sheetName}", ${result.rowCount} riviä → ${result.events.length} tulevaa tuntia` +
    ` (menneitä tai yli 60 päivän päässä ${result.skipped.past}, peruttuja ${result.skipped.cancelled}` +
    `${result.duplicates ? `, tuplia ${result.duplicates}` : ""})`);
  for (const r of result.rejected) log(`  Hylätty rivi ${r.line}: ${r.reason}`);
  return result;
}

// Paikallinen tiedosto testaukseen (SCHEDULE_EXCEL_FILE): sama luku ja tarkistus ilman latausta
export async function readExcelFile(path, { now = new Date(), log = console.log } = {}) {
  const { readFile } = await import("node:fs/promises");
  const { rows, date1904, sheetName } = readSheet(new Uint8Array(await readFile(path)));
  const result = rowsToEvents(rows, { date1904, now });
  log(`Excel (paikallinen): välilehti "${sheetName}", ${result.rowCount} riviä → ${result.events.length} tulevaa tuntia`);
  for (const r of result.rejected) log(`  Hylätty rivi ${r.line}: ${r.reason}`);
  return result;
}

// Suora ajo = pelkkä tarkistus (ei kirjoita mitään): node scripts/fetch-excel.mjs
// Käytössä GitHub Actionsin Excel-testissä (.github/workflows/excel-testi.yml) ja paikallisesti.
import { pathToFileURL } from "node:url";
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const url = process.env.SCHEDULE_EXCEL_URL?.trim();
  const file = process.env.SCHEDULE_EXCEL_FILE?.trim();
  const run = url ? fetchExcelEvents({ url }) : file ? readExcelFile(file) : Promise.reject(new Error("Aseta SCHEDULE_EXCEL_URL tai SCHEDULE_EXCEL_FILE"));
  run
    .then(({ events, rejected }) => {
      for (const e of events) console.log(`  ${e.start.slice(0, 16).replace("T", " ")}  ${e.title}  ·  ${e.location}${e.full ? "  [TÄYNNÄ]" : ""}`);
      console.log(rejected.length ? `Valmis: ${rejected.length} riviä hylättiin (ks. yllä).` : "Valmis: kaikki rivit kunnossa.");
    })
    .catch((err) => {
      console.error(`Excel-testi epäonnistui: ${err.message}`);
      process.exit(1);
    });
}
