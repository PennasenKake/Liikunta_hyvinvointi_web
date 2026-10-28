// site.ts: sivuston perustiedot yhdessä paikassa.
// Kun puhelinnumero tai valikko muuttuu, muutos tehdään vain tänne.
// Myöhemmin nämä tiedot tulevat Sanitysta, ja vain tämän tiedoston
// käyttötapa vaihtuu, ei komponentit.

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
} as const; // "as const" tekee arvoista vain luku -muotoisia ja tarkentaa tyypit
