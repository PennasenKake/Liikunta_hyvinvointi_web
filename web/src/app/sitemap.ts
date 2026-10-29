// sitemap.ts: tuottaa osoitteen /sitemap.xml (Next.js:n tiedostokonventio).
// Sivukartta listaa sivuston sivut hakukoneille. Se lähetetään Google Search Consoleen
// julkaisun jälkeen, jolloin Google löytää sivut nopeammin.
//
// Etusivun osiot (#liikunta, #hinnasto) eivät ole omia sivuja, joten niitä ei listata.
// Kun palveluille tehdään omat alasivut, ne lisätään tähän (esim. services.ts:stä silmukalla).

import type { MetadataRoute } from "next";
import { CONTENT_UPDATED, SITE_URL } from "@/lib/seo";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Etusivu: tärkein sivu, päivittyy usein (tulevat tunnit)
    { url: `${SITE_URL}/`, lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 1 },
    // Tietosivut: käyttöehdot, tietosuoja, evästeet, saavutettavuus (site.ts → legal)
    ...site.legal.map((item) => ({
      url: `${SITE_URL}${item.href}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
