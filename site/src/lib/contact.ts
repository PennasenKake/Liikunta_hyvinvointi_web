// contact.ts: valmiiksi täytetyt sähköpostit (mailto) Amandalle.
// Amanda ei ehdi vastata puheluihin ohjausten aikana, joten yhteydenotot ja tarjouspyynnöt
// ohjataan sähköpostiin. Pohja auttaa kävijää kertomaan kerralla kaiken tarvittavan.
// mailto avaa kävijän oman sähköpostiohjelman; osoite näytetään aina myös tekstinä
// (tietokoneella ilman sähköpostiohjelmaa painike ei avaa mitään).
// Myöhemmin: oma lomake (Cloudflare Pages Function), joka lähettää viestin suoraan Amandalle.

import { site } from "./site";

export function mailtoHref(subject: string, body: string) {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Yleinen yhteydenotto (hero ja alatunniste)
export const contactHref = mailtoHref(
  "Yhteydenotto verkkosivuilta",
  "Hei Amanda,\n\n[Kirjoita viestisi tähän]\n\nNimi:\nPuhelin (jos haluat soiton):\n",
);

// Ajanvaraus yksilöpalveluihin (Valmennus-sivun "Varaa tutustumisaika")
export const bookingHref = mailtoHref(
  "Ajanvaraus",
  "Hei Amanda,\n\nhaluaisin varata ajan.\n\nPalvelu (Personal Training / InBody-mittaus / rentoutus):\nToivottu ajankohta:\nPaikkakunta:\n\nNimi:\nPuhelin:\n",
);

// Tarjouspyyntö (hinnasto): yritykset, ryhmät ja yksityistunnit
export const quoteHref = mailtoHref(
  "Tarjouspyyntö",
  "Hei Amanda,\n\npyytäisin tarjousta.\n\nPalvelu (esim. vesijumppa, jooga, äänimaljarentoutus):\nYritys tai ryhmä:\nOsallistujia noin:\nToivottu ajankohta:\nPaikkakunta:\nLisätietoja:\n\nNimi:\nPuhelin:\n",
);
