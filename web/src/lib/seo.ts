// seo.ts: hakukoneoptimoinnin yhteiset asetukset ja rakennetieto.
//
// - SITE_URL: sivuston julkinen osoite. metadataBase, sitemap, robots ja rakennetieto
//   tarvitsevat täyden osoitteen (https://...), jotta linkit ja jakokuvat toimivat.
// - NOINDEX: esikatseluversiot (esim. Netlifyn testiosoite) pidetään pois hakukoneista,
//   jottei Google indeksoi keskeneräistä sivua tai kahta samaa sivustoa.
// - localBusinessJsonLd(): Googlen ymmärtämä kuvaus yrityksestä (schema.org/LocalBusiness).
//   Paikallinen SEO: areaServed kertoo, millä paikkakunnilla palveluita tarjotaan,
//   ja hasOfferCatalog listaa palvelut. Data tulee site.ts:stä ja services.ts:stä,
//   joten rakennetieto pysyy automaattisesti sivun sisällön kanssa samana.

import { site } from "./site";
import { serviceCategories } from "./services";

// Ympäristömuuttuja (.env.local / Netlifyn asetukset). Oletuksena tuotanto-osoite.
// Lopun kauttaviiva poistetaan, jotta osoitteet eivät tuplaannu ("...fi//tietosuoja").
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://tahkonamanda.fi").replace(/\/$/, "");

// NEXT_PUBLIC_NOINDEX=1 esikatselussa: robots.txt kieltää indeksoinnin ja sivuille tulee noindex
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX === "1";

// Sisällön päivityspäivä sitemapia varten. Kiinteä arvo eikä new Date(): build ei vaihda
// päivämäärää turhaan, ja Cache Components -tila pysyy staattisena. Päivitä, kun sisältö muuttuu.
export const CONTENT_UPDATED = "2026-10-29";

// Paikkakunnan tyyppi rakennetiedossa: Tahko on kylä (Kuopiossa), muut ovat kuntia
const areaType = (name: string) => (name === "Tahko" ? "Place" : "City");

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#yritys`,
    name: site.name,
    description:
      "Ryhmäliikuntaa, personal trainingia, äänimaljarentoutusta, joogaa ja InBody-mittauksia Tahkolla, Siilinjärvellä, Kuopiossa ja Rautavaaralla.",
    url: SITE_URL,
    telephone: site.phoneHref.replace("tel:", ""), // Kansainvälinen muoto +358...
    email: site.email,
    taxID: site.businessId, // Y-tunnus
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}/opengraph-image.png`,
    // Palvelualueyritys: ei katuosoitetta, vain maakunta ja maa
    address: { "@type": "PostalAddress", addressRegion: "Pohjois-Savo", addressCountry: "FI" },
    areaServed: site.areas.map((name) => ({
      "@type": areaType(name),
      name,
      containedInPlace: { "@type": "AdministrativeArea", name: "Pohjois-Savo" },
    })),
    // Palvelut kategorioittain (Liikunta, Hyvinvointi)
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Palvelut",
      itemListElement: serviceCategories.map((cat) => ({
        "@type": "OfferCatalog",
        name: cat.label,
        itemListElement: cat.services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.title, description: s.description },
        })),
      })),
    },
    // Instagram lisätään, kun oikea osoite on site.ts:ssä (TODO(Amanda))
    ...(site.instagram.url ? { sameAs: [site.instagram.url] } : {}),
  };
}

// JSON turvallisesti <script>-tagiin: "<" koodataan, jottei teksti voi sulkea tagia (XSS-suoja)
export function jsonLdString(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
