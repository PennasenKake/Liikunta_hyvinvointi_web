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

  // Navigaation linkit. href viittaa etusivun osioiden id-arvoihin (#palvelut jne.).
  nav: [
    { label: "Palvelut", href: "#palvelut" },
    { label: "Liikunta & hyvinvointi", href: "#hyvinvointi" },
    { label: "Hinnasto", href: "#hinnasto" },
    { label: "Minusta", href: "#minusta" },
  ],
} as const; // "as const" tekee arvoista vain luku -muotoisia ja tarkentaa tyypit