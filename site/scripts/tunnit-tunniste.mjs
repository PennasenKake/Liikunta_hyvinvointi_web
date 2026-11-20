// tunnit-tunniste.mjs: tiiviste, josta tuotantotyönkulku näkee, onko julkaistavaa.
//
// Cloudflaren ajastin käynnistää tuotantotyönkulun 15 minuutin välein. Useimmiten Amandan
// Excel ei ole muuttunut, eikä sivua kannata rakentaa ja julkaista uudelleen. Työnkulku:
//   1. hakee tunnit (fetch-calendar.mjs → src/data/calendar.json)
//   2. laskee tällä skriptillä tunnisteen = sha256(tunnit + koodin commit)
//   3. vertaa sitä julkaistun sivun tiedostoon /tunnit-tunniste.txt
//   4. rakentaa ja julkaisee vain, jos tunniste on eri (tunnit tai koodi muuttuneet)
//
// Hakuaika (fetchedAt) ei kuulu tunnisteeseen, koska se muuttuu joka ajossa. Kun tunti on
// päättynyt, se putoaa listalta, tunniste muuttuu ja sivu päivittyy itsestään.
// Tunniste ei sisällä mitään salaista: se on pelkkä tiiviste.
//
// Käyttö: node scripts/tunnit-tunniste.mjs   (tulostaa tunnisteen, commit ympäristöstä GITHUB_SHA)

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

/** Tunniste kalenteritiedoston sisällöstä ja koodiversiosta. */
export function tunnitTunniste(calendar, commit = "paikallinen") {
  const { source, subscribeUrl, googleAddUrl, events } = calendar;
  const sisalto = JSON.stringify({ source, subscribeUrl, googleAddUrl, events, commit });
  return createHash("sha256").update(sisalto).digest("hex");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const calendar = JSON.parse(await readFile("src/data/calendar.json", "utf8"));
  console.log(tunnitTunniste(calendar, process.env.GITHUB_SHA));
}
