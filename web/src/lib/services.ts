// services.ts: Tahkon Amandan palvelut.
// Data on erillään komponenteista: kun palvelu lisätään tai teksti muuttuu,
// muutos tehdään vain tänne. Myöhemmin data haetaan Sanitysta.

export type Service = {
  title: string;
  description: string;
};

export type ServiceCategory = {
  id: "liikunta" | "hyvinvointi"; // Sallitut arvot rajattu: kirjoitusvirhe huomataan heti
  label: string;
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "liikunta",
    label: "Liikunta",
    services: [
      { title: "Vesijumppa", description: "Vedessä liikkuminen on nivelille ystävällistä, ja veden vastus tekee pienestäkin liikkeestä tehokkaan. Sopii kaikille kuntotasosta riippumatta." },
      { title: "Keppijumppa", description: "Kepin avulla avataan hartioita ja rintarankaa. Rauhallinen tunti, jossa liikkuvuus ja ryhti paranevat." },
      { title: "HIIT", description: "Lyhyitä, kovatehoisia jaksoja ja palautuksia. Paljon tehoa lyhyessä ajassa, ja jokainen tekee omalla tasollaan." },
      { title: "Circuit", description: "Kiertoharjoittelua, jossa vaihdetaan pisteeltä toiselle. Lihaskuntoa ja hikeä vaihtelevasti." },
      { title: "Tehotreeni", description: "Koko kehon lihaskuntotunti, jossa tehdään perusliikkeet huolella ja nostetaan sykettä." },
      { title: "RVP", description: "Reidet, vatsa ja pakarat. Vahva keskivartalo ja alakroppa näkyvät ryhdissä ja arjen jaksamisessa." },
      { title: "Tanssilliset tunnit", description: "Musiikkia ja helppoja askelsarjoja. Tärkeintä on liikkumisen ilo, ei täydelliset liikkeet." },
      { title: "Personal Training", description: "Ohjelma tehdään sinun tavoitteidesi, lähtötasosi ja aikataulusi mukaan, ja kuljen mukana koko matkan." },
    ],
  },
  {
    id: "hyvinvointi",
    label: "Hyvinvointi",
    services: [
      { title: "Äänimaljarentoutus", description: "Äänimaljojen soinnit ja värähtely auttavat kehoa ja mieltä rauhoittumaan. Sinä lepäät makuulla, minä soitan." },
      { title: "Kristallimaljarentoutus", description: "Kristallimaljojen kirkas, pitkään soiva ääni. Hetki, jossa saa vain olla." },
      { title: "Yin jooga", description: "Pitkään pidettäviä, rauhallisia asentoja, jotka avaavat kehoa ja opettavat pysähtymään." },
      { title: "Syvävenyttely", description: "Rauhallista venyttelyä, joka parantaa liikkuvuutta ja auttaa palautumaan treenistä." },
      { title: "InBody-mittaukset", description: "Kehonkoostumusmittaus näyttää lihas- ja rasvamassan sekä nestetasapainon. Hyvä lähtöpiste ja tapa seurata kehitystä." },
    ],
  },
];