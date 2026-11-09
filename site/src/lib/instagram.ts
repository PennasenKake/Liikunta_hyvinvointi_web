// instagram.ts: Instagram-julkaisujen tietomalli ja väliaikaiset julkaisut.
//
// NYT: julkaisut ovat Amandan omia kuvia (lib/photos.ts), koska syötettä ei ole vielä kytketty.
// MYÖHEMMIN (Behold-integraatio): fetchPosts() hakee julkaisut Behold-syötteestä samassa
// muodossa (InstagramPost), joten InstagramFeed-komponenttiin ei tarvitse koskea.
// Silloin lisätään myös kävijän suostumus ennen hakua, kuten GlossTahkon sivustolla
// (kolmannen osapuolen palvelin saa kävijän IP-osoitteen).

import { photos, type Photo } from "./photos";

export type InstagramPost = {
  id: string;
  photo: Photo;            // Kuva ja sen alt-teksti
  caption: string;         // Julkaisun teksti (näytetään kahdella rivillä)
  timestamp: string | null; // ISO-päivämäärä. null = ei näytetä (väliaikaisissa julkaisuissa)
  permalink: string | null; // Linkki julkaisuun. null = kortti ei ole linkki
  kind: "image" | "video" | "album";
};

// Päivämäärä suomalaisessa muodossa, esim. "28.10.2026"
export function formatPostDate(iso: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("fi-FI", { day: "numeric", month: "numeric", year: "numeric" }).format(new Date(iso));
}

// TODO(Amanda): väliaikaiset julkaisut korvautuvat Behold-syötteellä.
// Kuvatekstit kuvaavat kuvaa, eivät ole keksittyjä asiakaskokemuksia.
export const previewPosts: InstagramPost[] = [
  { id: "p1", photo: photos.aanimaljat, caption: "Äänimaljat valmiina rentoutushetkeen.", kind: "image" },
  { id: "p2", photo: photos.vesijumppa, caption: "Vesijumpan välineet odottavat altaan reunalla.", kind: "image" },
  { id: "p3", photo: photos.joogasali, caption: "Yin jooga mäntymetsän keskellä.", kind: "album" },
  { id: "p4", photo: photos.sekuntikello, caption: "Ulkotreeni järven rannalla, kello käy.", kind: "image" },
  { id: "p5", photo: photos.aanimaljatJarvi, caption: "Äänimalja ja järvimaisema terassilla.", kind: "video" },
  { id: "p6", photo: photos.ulkotreeni, caption: "Matto, kello ja vesipullo: treeni voi alkaa.", kind: "image" },
  { id: "p7", photo: photos.inbody, caption: "InBody-mittaus näyttää, mistä keho koostuu.", kind: "image" },
  { id: "p8", photo: photos.joogablokit, caption: "Joogablokit tukevat asentoja.", kind: "image" },
].map((p) => ({ ...p, timestamp: null, permalink: null }) as InstagramPost);
