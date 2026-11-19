// seo.ts: hakukoneoptimoinnin yhteiset asetukset ja rakennetieto.
//
// - SITE_URL: sivuston julkinen osoite. metadataBase, sitemap, robots ja rakennetieto
//   tarvitsevat täyden osoitteen (https://...), jotta linkit ja jakokuvat toimivat.
// - NOINDEX: esikatseluversiot (esim. GitHub Pages -testiversio) pidetään pois hakukoneista,
//   jottei Google indeksoi keskeneräistä sivua tai kahta samaa sivustoa.
// - localBusinessJsonLd(): Googlen ymmärtämä kuvaus yrityksestä (schema.org/LocalBusiness).
//   Paikallinen SEO: areaServed kertoo, millä paikkakunnilla palveluita tarjotaan,
//   ja hasOfferCatalog listaa palvelut. Data tulee site.ts:stä ja services.ts:stä,
//   joten rakennetieto pysyy automaattisesti sivun sisällön kanssa samana.

import { site } from "./site";
import { serviceCategories } from "./services";
import { priceValue, prices } from "./pricing";
import type { CalendarEvent } from "./calendar";

// Ympäristömuuttuja VITE_SITE_URL (.env.local tai hostingin asetukset). Oletuksena tuotanto-osoite.
// Lopun kauttaviiva poistetaan, jotta osoitteet eivät tuplaannu ("...fi//tietosuoja").
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://tahkonamanda.fi").replace(/\/$/, "");

// Pelkkä palvelimen osoite ilman alipolkua (GitHub Pages: https://pennasenkake.github.io).
// Täydet osoitteet muodostetaan: SITE_ORIGIN + withBase(polku).
export const SITE_ORIGIN = new URL(SITE_URL).origin;

// VITE_NOINDEX=1 esikatselussa: robots.txt kieltää indeksoinnin ja sivuille tulee noindex
export const NOINDEX = import.meta.env.VITE_NOINDEX === "1";

// Sisällön päivityspäivä sitemapia varten. Kiinteä arvo eikä new Date(): build ei vaihda
// päivämäärää turhaan. Päivitä, kun sisältö muuttuu.
export const CONTENT_UPDATED = "2026-11-16";

// Google Search Consolen vahvistuskoodi (metatagi). Suositus on DNS-vahvistus Cloudflaressa,
// jolloin tätä ei tarvita. Tyhjä = ei tagia.
export const GSC_VERIFICATION = import.meta.env.VITE_GSC_VERIFICATION || "";

// Paikkakunnan tyyppi rakennetiedossa: Tahko on kylä (Kuopiossa), muut ovat kuntia
const areaType = (name: string) => (name === "Tahko" ? "Place" : "City");

// Hinnat, joissa on oikea luku (paikkamerkit ohitetaan). Käytetään rakennetiedossa:
// makesOffer = hinnaston rivit hintoineen, priceRange = halvin–kallein ("15–60 €").
function pricedOffers() {
  return prices
    .map((p) => ({ ...p, value: priceValue(p.price) }))
    .filter((p): p is typeof p & { value: number } => p.value !== null);
}

export function localBusinessJsonLd() {
  const priced = pricedOffers();
  const values = priced.map((p) => p.value);
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
    // Hinnasto hintoineen, kun Amandan hinnat ovat pricing.ts:ssä (paikkamerkkejä ei ilmoiteta)
    ...(priced.length > 0
      ? {
          priceRange: `${Math.min(...values)}–${Math.max(...values)} €`,
          makesOffer: priced.map((p) => ({
            "@type": "Offer",
            name: p.name,
            description: p.detail,
            price: p.value,
            priceCurrency: "EUR",
          })),
        }
      : {}),
    knowsLanguage: "fi",
    // Varaustoiminto: Google voi näyttää ilmoittautumislinkin yrityksen tiedoissa
    ...(site.signupForm
      ? { potentialAction: { "@type": "ReserveAction", target: site.signupForm, name: "Ilmoittaudu tunnille" } }
      : {}),
    // Instagram lisätään, kun oikea osoite on site.ts:ssä (TODO(Amanda))
    ...(site.instagram.url ? { sameAs: [site.instagram.url] } : {}),
  };
}

// Sivusto kokonaisuutena: nimi ja kieli hakukoneille, julkaisijana yritys (@id-viittaus)
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#sivusto`,
    name: site.name,
    url: `${SITE_URL}/`,
    inLanguage: "fi-FI",
    publisher: { "@id": `${SITE_URL}/#yritys` },
  };
}

// Tulevat tunnit tapahtumina (schema.org/Event): Google voi näyttää ne tapahtumahaussa
// ("vesijumppa Kuopio"). Paikka: tunnin paikka-tekstin viimeinen osa on paikkakunta,
// jos se on yksi toiminta-alueista ("Kylpylä, Tahko" → Tahko).
export function eventsJsonLd(events: CalendarEvent[]) {
  return events.map((e) => {
    const parts = e.location.split(",").map((p) => p.trim()).filter(Boolean);
    const locality = parts.length > 0 && (site.areas as readonly string[]).includes(parts[parts.length - 1]) ? parts[parts.length - 1] : undefined;
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: e.title,
      startDate: e.start,
      endDate: e.end,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      ...(e.description ? { description: e.description } : {}),
      location: {
        "@type": "Place",
        name: e.location || site.name,
        address: {
          "@type": "PostalAddress",
          ...(locality ? { addressLocality: locality } : {}),
          addressRegion: "Pohjois-Savo",
          addressCountry: "FI",
        },
      },
      organizer: { "@type": "Organization", "@id": `${SITE_URL}/#yritys`, name: site.name, url: `${SITE_URL}/` },
      url: `${SITE_URL}/#tunti-${e.id}`,
      // Täysi tunti (Excelin Tila "Täynnä") ilmoitetaan Googlelle loppuunmyytynä
      ...(site.signupForm
        ? { offers: { "@type": "Offer", url: site.signupForm, availability: `https://schema.org/${e.full ? "SoldOut" : "InStock"}` } }
        : {}),
    };
  });
}

// Paikkamerkit ("[HINTA]", "[Paikka]") näkyvässä tekstissä. Tuotantobuild pysähtyy, jos niitä
// löytyy: keskeneräinen teksti hakutuloksessa näyttää huolimattomalta (scripts/prerender.mjs).
// Skriptit ja tyylit ohitetaan, jottei esim. JSON-taulukko sekoitu paikkamerkkiin.
export function findPlaceholders(html: string): string[] {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return [...new Set(text.match(/\[[A-Za-zÅÄÖåäö0-9][^[\]<>]{0,60}\]/g) ?? [])];
}

// JSON turvallisesti <script>-tagiin: "<" koodataan, jottei teksti voi sulkea tagia (XSS-suoja)
export function jsonLdString(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
