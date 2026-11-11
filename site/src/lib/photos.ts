// photos.ts: sivuston valokuvat yhdessä paikassa.
// Kuvat ovat kansiossa site/public/kuvat/. Alkuperäiset (täysikokoiset) ovat
// kansiossa materiaalit/kuvat/, joka ei ole versionhallinnassa.
//
// withBase(): alipolku GitHub Pagesia varten (lib/paths.ts).
//
// Jokaisella kuvalla on alt-teksti, joka kertoo ruudunlukijan käyttäjälle,
// mitä kuvassa on. Hyvä alt-teksti kuvaa sisällön, ei sanaa "kuva".
//
// KUVAPANKKIKUVAT: sivusto ei saa näyttää kuvapankista tai tekoälyllä tehdyltä.
// Testivaiheessa paikkamerkkinä saa käyttää kuvapankkikuvaa, mutta silloin kuvalle
// merkitään stock-tieto (lähde ja lisenssi). Tuotantobuild (scripts/prerender.mjs)
// pysähtyy virheeseen, jos sivulla on yksikin stock-merkitty kuva. Testiversio
// (npm run build:pages, noindex) sallii ne.

import { withBase } from "./paths";

export type Photo = {
  src: string;
  alt: string;
  width: number;  // Alkuperäiset mitat: Image-komponentti varaa tilan valmiiksi,
  height: number; // jolloin sivu ei "hypi" kuvan latautuessa (CLS)
  // Vain kuvapankin paikkamerkeille: mistä kuva on ja millä lisenssillä (esim. "Pexels, Pexels License").
  // Korvataan Amandan omalla kuvalla ennen tuotantojulkaisua.
  stock?: { source: string; url: string };
  srcSet?: string; // Kevyet WebP-versiot eri leveyksille (scripts/optimize-images.mjs)
};

// Sama leveyssääntö kuin scripts/optimize-images.mjs:ssä: vakioleveydet, jotka ovat
// alkuperäistä kapeampia, sekä alkuperäinen leveys.
const WIDTHS = [400, 800, 1200, 1600];
export function widthsFor(original: number) {
  return [...WIDTHS.filter((w) => w < original), original];
}

// Kuvan tiedot yhdellä rivillä: polku, srcset ja mitat.
// file = tiedostonimi kansiossa public/kuvat/ (esim. "joogasali.jpg").
function photo(file: string, alt: string, width: number, height: number, extra: Partial<Photo> = {}): Photo {
  const name = file.replace(/\.[^.]+$/, "");
  const srcSet = widthsFor(width)
    .map((w) => `${withBase(`/kuvat/opt/${name}-${w}.webp`)} ${w}w`)
    .join(", ");
  return { src: withBase(`/kuvat/${file}`), alt, width, height, srcSet, ...extra };
}

export const photos = {
  vesijumppa: photo("vesijumppa-allas.jpg", "Vesijumppapainot altaan reunalla", 1440, 1440),
  joogasali: photo("joogasali.jpg", "Joogamatot ja -blokit valmiina salissa, ikkunasta näkyy mäntymetsä", 1200, 1600),
  ulkotreeni: photo("ulkotreeni-kentta.jpg", "Joogamatto, sekuntikello ja vesipullo ulkotreenissä tekonurmella", 1200, 1600),
  sekuntikello: photo("sekuntikello-kentta.jpg", "Sekuntikello kädessä urheilukentällä järven rannalla", 1286, 1286),
  inbody: photo("inbody-mittaus.jpg", "InBody-kehonkoostumusmittari ja tulostettu mittausraportti", 480, 480),
  joogablokit: photo("joogablokit.jpg", "Vaaleanpunaisia ja mintunvihreitä joogablokkeja", 480, 480),
  aanimaljat: photo("aanimaljat.jpg", "Kolme äänimaljaa lampaantaljalla lootuskynttilöiden ja valojen keskellä", 1200, 1600),
  kahvakuulat: photo("kahvakuulat.jpg", "Kahvakuulat telineessä kuntosalilla", 291, 439),
  aanimaljatJarvi: photo("aanimaljat-jarvi.jpg", "Äänimalja kädessä terassilla järvimaiseman edessä", 480, 600),
} satisfies Record<string, Photo>; // satisfies: tarkistaa tyypin, mutta säilyttää avainten nimet automaattitäydennystä varten

// Kuvapankin paikkamerkit (stock-merkityt). Tuotantobuild tarkistaa, että lista on tyhjä.
export const stockPhotos: Photo[] = Object.values(photos as Record<string, Photo>).filter((p) => p.stock);
