// routes.tsx: sivuston sivut ja niiden metatiedot yhdessä paikassa.
//
// Jokainen reitti esirenderöidään buildissa omaksi HTML-tiedostokseen
// (scripts/prerender.mjs): "/" → index.html, "/kayttoehdot/" → kayttoehdot/index.html.
//
// Uusi sivu: lisää komponentti src/pages/-kansioon ja rivi tähän listaan.
// Sitemap, otsikko, kuvaus ja canonical-osoite päivittyvät silloin automaattisesti.

import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import TermsPage from "@/pages/kayttoehdot";
import PrivacyPage from "@/pages/tietosuoja";
import CookiesPage from "@/pages/evasteet";
import AccessibilityPage from "@/pages/saavutettavuus";

export type Route = {
  path: string;            // Osoite, aina kauttaviivaan päättyvä ("/", "/tietosuoja/")
  title: string;           // <title>: muilla kuin etusivulla perään lisätään " – Tahkon Amanda"
  description: string;     // <meta name="description">: hakutuloksen kuvausteksti
  Page: () => React.JSX.Element;
  noindex?: boolean;       // true = ei hakukoneisiin eikä sitemapiin (404-sivu)
};

// Etusivun otsikossa paikkakunnat: paikallinen haku ("liikunta Siilinjärvi") löytää sivun
export const routes: Route[] = [
  {
    path: "/",
    title: "Tahkon Amanda – Liikunta ja hyvinvointi Tahkolla, Siilinjärvellä, Kuopiossa ja Rautavaaralla",
    description:
      "Vesijumppaa, HIIT:iä, personal trainingia, äänimaljarentoutusta, yin joogaa ja InBody-mittauksia Tahkolla, Siilinjärvellä, Kuopiossa ja Rautavaaralla.",
    Page: Home,
  },
  {
    path: "/kayttoehdot/",
    title: "Käyttöehdot",
    description: "Tahkon Amandan palveluiden ehdot: ajanvaraus, peruutus, osallistuminen ja maksaminen.",
    Page: TermsPage,
  },
  {
    path: "/tietosuoja/",
    title: "Tietosuojaseloste",
    description: "Miten Tahkon Amanda käsittelee henkilötietoja ja mitä sivusto lataa kolmansilta osapuolilta.",
    Page: PrivacyPage,
  },
  {
    path: "/evasteet/",
    title: "Evästeasetukset",
    description: "Tahkon Amandan sivusto ei aseta evästeitä eikä käytä seurantaa.",
    Page: CookiesPage,
  },
  {
    path: "/saavutettavuus/",
    title: "Saavutettavuusseloste",
    description: "Tahkon Amandan sivuston saavutettavuus: WCAG 2.1 AA -tavoite, testaus ja palaute.",
    Page: AccessibilityPage,
  },
];

// 404-sivu: esirenderöidään tiedostoksi 404.html, jonka hosting näyttää tuntemattomille osoitteille
export const notFoundRoute: Route = {
  path: "/404/",
  title: "Sivua ei löytynyt",
  description: "Etsimääsi sivua ei löytynyt. Palaa etusivulle tai tutustu palveluihin.",
  Page: NotFound,
  noindex: true,
};

// Kauttaviiva loppuun, jotta "/tietosuoja" ja "/tietosuoja/" ovat sama sivu
export function normalizePath(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

// Osoitetta vastaava reitti. Tuntematon osoite → 404-sivu.
export function findRoute(path: string): Route {
  const p = normalizePath(path);
  return routes.find((r) => r.path === p) ?? notFoundRoute;
}

// Selaimen <title>: etusivulla sellaisenaan, muilla "Otsikko – Tahkon Amanda"
export function fullTitle(route: Route): string {
  return route.path === "/" ? route.title : `${route.title} – Tahkon Amanda`;
}
