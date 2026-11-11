// site.ts: sivuston perustiedot yhdessä paikassa.
// Kun puhelinnumero tai valikko muuttuu, muutos tehdään vain tänne.
// Myöhemmin nämä tiedot voi siirtää CMS:ään (esim. Sveltia), ja vain tämän
// tiedoston käyttötapa vaihtuu, ei komponentit.
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

  // Alatunnisteen "Sivusto"-sarake: päävalikon kohdat ja muut etusivun osiot
  footerNav: [
    { label: "Liikunta", href: "/#liikunta" },
    { label: "Hyvinvointi", href: "/#hyvinvointi" },
    { label: "Hinnasto", href: "/#hinnasto" },
    { label: "Minusta", href: "/#minusta" },
    { label: "Tulevat tunnit", href: "/#kalenteri" },
    { label: "Instagram", href: "/#instagram" },
    { label: "Yhteystiedot", href: "/#yhteystiedot" },
  ],

  // Alatunnisteen "Tietoa ja ehdot" -sarake. Jokaisella on oma sivunsa (src/pages/<nimi>.tsx).
  // Lopun kauttaviiva: esirenderöinti tekee jokaisesta sivusta kansion (kayttoehdot/index.html).
  legal: [
    { label: "Käyttöehdot", href: "/kayttoehdot/" },
    { label: "Tietosuoja", href: "/tietosuoja/" },
    { label: "Evästeasetukset", href: "/evasteet/" },
    { label: "Saavutettavuusseloste", href: "/saavutettavuus/" },
  ],

  // Korostettu toimintakehote valikon lopussa. Erillään nav-listasta,
  // koska se tyylitellään painikkeeksi. Yksi paikka Headerille ja MobileMenulle.
  // Vie Tulevat tunnit -osioon, jossa jokaisella tunnilla on Ilmoittaudu-painike.
  // Yhteystiedot löytyvät alatunnisteesta (footerNav) ja heron puhelinpainikkeesta.
  contact: { label: "Ilmoittaudu tunnille", href: "/#kalenteri" },

  // TODO(Amanda): Instagram-tunnus. url: null = linkkiä ei vielä näytetä.
  instagram: {
    handle: "[instagram-tunnus]",
    url: null as string | null, // esim. "https://www.instagram.com/tunnus/"
  },

  // TODO(Amanda): kumppanien logot ja käyttölupa. logo: null = näytetään nimi tekstinä.
  // Logotiedostot tulevat kansioon site/public/kumppanit/ (esim. "/kumppanit/epassi.svg").
  partners: [
    { name: "ePassi", logo: null as string | null },
    { name: "Tahko", logo: null as string | null },
    { name: "Nilsiän Yrittäjät", logo: null as string | null },
  ],

  // Tekijänoikeusvuosi kovakoodattuna: new Date() antaisi buildin vuoden, ja selain
  // voisi hydraatiossa laskea eri vuoden (vuodenvaihteessa), jolloin HTML ei täsmäisi.
  copyrightYear: 2026,

  // Etusivun yläosan (hero) versio. Amanda valitsee kolmesta:
  //   "a" = kaksi kuvaa ja tumma tekstilaatikko ("Liiku & rauhoitu")
  //   "b" = kahvakuulat ja järven äänimalja sulautuvat ("Liikunta & hyvinvointi")
  //   "c" = liikkuva tausta ja keskitetty otsikko ("Liikuntaa, joka tuntuu hyvältä")
  //   "d" = teksti vasemmalla, kuvat/video oikealla ilman huntua ("Liikettä ja lepoa Pohjois-Savossa")
  // Vaihto: muuta kirjain ja julkaise. Komponentit: components/sections/hero/.
  heroVariant: "d" as "a" | "b" | "c" | "d",

  // Hero C:n ja D:n taustavideo. null = video puuttuu, jolloin taustalla vaihtuvat valokuvat.
  // Video lisätään kansioon site/public/video/ kahtena tiedostona (WebM pienempi, MP4 Safarille)
  // sekä pysäytyskuva (poster), joka näkyy heti ja vähennetyn liikkeen asetuksella.
  // Suositus: 10–20 s, ei ääntä, 1280 px leveä, alle 3 Mt. Esim.:
  //   heroVideo: { webm: "/video/hero.webm", mp4: "/video/hero.mp4", poster: "/video/hero-poster.jpg" },
  heroVideo: null as { webm: string; mp4: string; poster: string } | null,
} as const; // "as const" tekee arvoista vain luku -muotoisia ja tarkentaa tyypit
