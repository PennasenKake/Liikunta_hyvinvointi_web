// optimize-images.mjs: tekee valokuvista kevyet WebP-versiot eri näyttöleveyksille.
// Ajetaan automaattisesti ennen komentoja dev ja build (package.json: pre-skriptit).
//
// Lähde:  public/kuvat/<nimi>.jpg           (versionhallinnassa, alkuperäinen pienennetty kuva)
// Tulos:  public/kuvat/opt/<nimi>-<leveys>.webp (ei versionhallinnassa, tehdään aina uudelleen tarvittaessa)
//
// Selain valitsee srcset-listasta näytölle sopivimman koon: puhelin lataa 400–800 px kuvan,
// iso näyttö 1200–1600 px. WebP on JPG:tä noin 30–50 % pienempi samalla laadulla.
//
// Leveyksien sääntö on sama kuin lib/photos.ts:n srcSet-funktiossa (WIDTHS). Jos muutat sitä,
// muuta molempia. Selaintesti (e2e) tarkistaa, että jokainen srcset-tiedosto on olemassa.

import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "public/kuvat";
const OUT = "public/kuvat/opt";
const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 66; // WebP-laatu: silmämääräisesti sama kuin alkuperäinen, tiedosto selvästi pienempi

// Leveydet, jotka kuvasta tehdään: vakioleveydet, jotka ovat alkuperäistä kapeampia, sekä alkuperäinen
export function widthsFor(original) {
  return [...WIDTHS.filter((w) => w < original), original];
}

async function newer(src, out) {
  try {
    return (await stat(out)).mtimeMs >= (await stat(src)).mtimeMs;
  } catch {
    return false; // Tulosta ei vielä ole
  }
}

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
let made = 0;
for (const file of files) {
  const src = path.join(SRC, file);
  const name = file.replace(/\.[^.]+$/, "");
  const { width } = await sharp(src).metadata();
  for (const w of widthsFor(width)) {
    const out = path.join(OUT, `${name}-${w}.webp`);
    if (await newer(src, out)) continue; // Ajantasainen: ei tehdä uudelleen (nopea dev-käynnistys)
    await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY, effort: 6 }).toFile(out);
    made++;
  }
}
console.log(`kuvat: ${files.length} kuvaa, ${made} uutta WebP-versiota → ${OUT}/`);
