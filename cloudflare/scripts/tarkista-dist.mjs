// tarkista-dist.mjs: estää vahingossa tehdyn julkaisun omalta koneelta.
//
// Workerin julkaisu korvaa koko sivuston site/dist-kansion sisällöllä. Jos kansio on vanha,
// testiversio (noindex) tai puuttuu, tuotantosivu menisi rikki. Siksi julkaisu sallitaan vain,
// kun dist-kansiossa on tuotantotyönkulun kirjoittama tunnit-tunniste.txt eikä noindex-kieltoa.
import { existsSync, readFileSync } from "node:fs";

const dist = new URL("../../site/dist/", import.meta.url);
const virheet = [];
if (!existsSync(new URL("index.html", dist))) virheet.push("site/dist/index.html puuttuu (aja ensin build)");
if (!existsSync(new URL("tunnit-tunniste.txt", dist))) virheet.push("tunnit-tunniste.txt puuttuu: julkaisu tehdään tuotantotyönkulusta (tuotanto.yml)");
const robots = new URL("robots.txt", dist);
if (existsSync(robots) && /Disallow: \/\s*$/m.test(readFileSync(robots, "utf8"))) virheet.push("robots.txt kieltää indeksoinnin: tämä on testiversio (VITE_NOINDEX=1)");

if (virheet.length) {
  console.error(`Julkaisu pysäytetty:\n- ${virheet.join("\n- ")}\nOhje: docs/tuotanto.md`);
  process.exit(1);
}
console.log("dist tarkistettu: tuotantobuild");
