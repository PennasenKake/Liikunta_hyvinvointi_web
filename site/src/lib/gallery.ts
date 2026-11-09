// gallery.ts: Miksi liikkua -osion kuvagalleria (karuselli).
//
// Kuvat vuorottelevat liikkeen ja levon välillä, kuten osion viesti: "tunneillani hikoillaan,
// mutta myös pysähdytään". Kuvatekstit kuvaavat kuvaa, eivät ole keksittyjä asiakaskokemuksia.
// Karuselli on sama komponentti kuin Instagram-osiossa, joten muoto on InstagramPost.
//
// Uusi kuva: lisää se ensin lib/photos.ts:ään ja sitten riviksi tähän.

import { photos } from "./photos";
import type { InstagramPost } from "./instagram";

const items = [
  { photo: photos.ulkotreeni, caption: "Ulkotreeni: matto, kello ja vesipullo." },
  { photo: photos.aanimaljat, caption: "Äänimaljarentoutus: sinä lepäät, minä soitan." },
  { photo: photos.vesijumppa, caption: "Vesijumppa: nivelille ystävällistä liikettä." },
  { photo: photos.joogasali, caption: "Yin jooga ja syvävenyttely rauhallisessa salissa." },
  { photo: photos.kahvakuulat, caption: "Personal training: ohjelma juuri sinulle." },
  { photo: photos.aanimaljatJarvi, caption: "Rentoutus järven rannalla." },
  { photo: photos.sekuntikello, caption: "Kenttätreeni järven rannalla." },
];

export const galleryPosts: InstagramPost[] = items.map((item, i) => ({
  id: `g${i + 1}`,
  photo: item.photo,
  caption: item.caption,
  timestamp: null,
  permalink: null,
  kind: "image",
}));
