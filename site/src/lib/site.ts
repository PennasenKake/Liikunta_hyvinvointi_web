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
  // Ilmoittautumislomake (Microsoft Forms). Amanda tekee lomakkeen kuukausi tai sesonkiviikko
  // kerrallaan; kun lomake vaihtuu, vaihdetaan vain tämä linkki. null = ilmoittautuminen sähköpostilla.
  // Vastaukset (osallistujien nimet) jäävät Amandan Formsiin: niitä ei koskaan tuoda sivustolle.
  // TESTIHAARA (testi/excel-forms): Eeron Google Forms -testilomake. Ennen tuotantoa takaisin
  // Amandan lomakkeeseen: "https://forms.cloud.microsoft/r/SCYtDm1Ypb" (docs/excel-ja-forms.md, vaihe 6).
  signupForm: "https://docs.google.com/forms/d/e/1FAIpQLSeqZEI_VXd73HHbgiAS_cojEB6agqF9Gyk4Yiy7CVjLEMMpcA/viewform" as string | null,
  // Valinnainen: Formsin "valmiiksi täytetty linkki", jossa tunnin kohdalla on {tunti}.
  // Painike korvaa sen tunnin tekstillä, esim. "Vesijumppa ti 1.12. klo 18.00", jolloin tunti on
  // lomakkeessa valmiiksi valittuna. Formsin vaihtoehdon pitää olla täsmälleen samaa muotoa.
  // Ohje: docs/excel-ja-forms.md. null = painike avaa signupForm-lomakkeen sellaisenaan.
  // Google Forms: entry.<kysymyksen tunnus> = vaihtoehdon teksti. Tunnus 378321794 = "Valitse tunti".
  // Testattu Chromessa 20.11.2026: "Yin jooga ke 2.12. klo 17.30" tulee valmiiksi valituksi.
  signupFormPrefill:
    "https://docs.google.com/forms/d/e/1FAIpQLSeqZEI_VXd73HHbgiAS_cojEB6agqF9Gyk4Yiy7CVjLEMMpcA/viewform?usp=pp_url&entry.378321794={tunti}" as string | null,
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
    // Yhteystiedot ovat alatunnisteessa (id="yhteystiedot"): puhelin, sähköposti ja alueet
    { label: "Yhteystiedot", href: "/#yhteystiedot" },
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
  // Yhteystiedot-linkki on päävalikossa (nav) ja vie alatunnisteeseen.
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

  // Heron taustavideo. null = video puuttuu, jolloin taustalla vaihtuvat valokuvat.
  // Video lisätään kansioon site/public/video/ kahtena tiedostona (WebM pienempi, MP4 Safarille)
  // sekä pysäytyskuva (poster), joka näkyy heti ja vähennetyn liikkeen asetuksella.
  // Suositus: 10–20 s, ei ääntä, 1280 px leveä, alle 3 Mt. Esim.:
  //   heroVideo: { webm: "/video/hero.webm", mp4: "/video/hero.mp4", poster: "/video/hero-poster.jpg" },
  heroVideo: null as { webm: string; mp4: string; poster: string } | null,
} as const; // "as const" tekee arvoista vain luku -muotoisia ja tarkentaa tyypit
