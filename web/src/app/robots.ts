// robots.ts: tuottaa osoitteen /robots.txt (Next.js:n tiedostokonventio).
// Kertoo hakukoneille, mitä saa indeksoida, ja missä sivukartta on.
// Esikatselussa (NEXT_PUBLIC_NOINDEX=1) indeksointi kielletään kokonaan.

import type { MetadataRoute } from "next";
import { NOINDEX, SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: NOINDEX ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
