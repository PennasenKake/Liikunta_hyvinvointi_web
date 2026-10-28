// site.ts: sivuston perustiedot yhdessä paikassa.
// Kun puhelinnumero tai valikko muuttuu, muutos tehdään vain tänne.
// Myöhemmin nämä tiedot tulevat Sanitysta, ja vain tämän tiedoston
// käyttötapa vaihtuu, ei komponentit.
//
// PAIKKAMERKIT: hakasulkeissa olevat arvot, kuten "[instagram-tunnus]",
// odottavat Amandalta tulevaa tietoa. Lista: docs/sisalto.md.

export const site = {
  name: "Tahkon Amanda",
  tagline: "Liikunta · Hyvinvointi",
  phone: "040 830 5914",          // Näytettävä muoto
  phoneHref: "tel:+358408305914", // Kansainvälinen muoto toimii kaikissa puhelimissa
  email: "amanda.taskinen@outlook.com",
  businessId: "3337574-9",
  areas: ["Tahko", "Siilinjärvi", "Kuopio", "Rautavaara"],

  // Navigaatio suunnitelman mukaan: Liikunta ja Hyvinvointi omina kohtinaan.
  // Linkit alkavat "/"-merkillä, jotta ne toimivat myös muilta sivuilta
  // (404, tietosuojaseloste): selain siirtyy etusivulle ja vierittää osioon.
  // Etusivulla "/#liikunta" ei lataa sivua uudelleen, vaan vain vierittää.
  nav: [
    { label: "Liikunta", href: "/#liikunta" },
    { label: "Hyvinvointi", href: "/#hyvinvointi" },
    { label: "Hinnasto", href: "/#hinnasto" },
    { label: "Minusta", href: "/#minusta" },
  ],

  // Korostettu toimintakehote valikon lopussa. Erillään nav-listasta,
  // koska se tyylitellään painikkeeksi. Yksi paikka Headerille ja MobileMenulle.
  contact: { label: "Yhteystiedot", href: "/#yhteystiedot" },

  // TODO(Amanda): Instagram-tunnus. url: null = linkkiä ei vielä näytetä.
  instagram: {
    handle: "[instagram-tunnus]",
    url: null as string | null, // esim. "https://www.instagram.com/tunnus/"
  },

  // TODO(Amanda): kumppanien logot ja käyttölupa. logo: null = näytetään nimi tekstinä.
  // Logotiedostot tulevat kansioon web/public/kumppanit/ (esim. "/kumppanit/epassi.svg").
  partners: [
    { name: "ePassi", logo: null as string | null },
    { name: "Tahko", logo: null as string | null },
    { name: "Nilsiän Yrittäjät", logo: null as string | null },
  ],

  // Tekijänoikeusvuosi kovakoodattuna: new Date() vaatisi Next.js 16:n
  // Cache Components -tilassa dynaamisen renderöinnin koko sivulle.
  copyrightYear: 2026,
} as const; // "as const" tekee arvoista vain luku -muotoisia ja tarkentaa tyypit
