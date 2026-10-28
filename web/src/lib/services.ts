// services.ts: Tahkon Amandan palvelut.
// Data on erillään komponenteista: kun palvelu lisätään tai teksti muuttuu,
// muutos tehdään vain tänne. Myöhemmin data haetaan Sanitysta.
//
// TODO(Amanda): kestot, paikkakunnat, tehotasot ja "Sopii:"-tekstit ovat
// arvioita, jotka Amanda tarkistaa. Lista: docs/sisalto.md.

import { site } from "./site";

// Paikkakunta on yksi site.ts:n toiminta-alueista. Tyyppi johdetaan suoraan
// listasta, joten kirjoitusvirhe (esim. "Siilinjarvi") huomataan jo käännöksessä.
export type Area = (typeof site.areas)[number];

// Tehotaso: 1 = kevyt, 2 = kohtalainen, 3 = tehokas.
// Rentoutuksilla ja mittauksilla tasoa ei ole, joten kenttä on valinnainen.
export type Intensity = 1 | 2 | 3;

export const intensityLabels: Record<Intensity, string> = {
  1: "Kevyt",
  2: "Kohtalainen",
  3: "Tehokas",
};

// Kuvakkeen nimi. Piirrokset ovat tiedostossa components/ui/ServiceIcon.tsx.
export type ServiceIconName =
  | "water" | "stick" | "bolt" | "circuit" | "dumbbell" | "core" | "music" | "person"
  | "bowl" | "crystal" | "lotus" | "stretch" | "chart";

export type Service = {
  title: string;
  description: string;
  icon: ServiceIconName;
  intensity?: Intensity;  // Puuttuu = tehotasoa ei näytetä
  suitsFor: string;       // "Sopii:"-rivi, kenelle tunti on tarkoitettu
  duration: string;       // Näytetään sellaisenaan, esim. "45 min"
  locations: Area[];
  // Ryhmätunnit näkyvät kalenterissa ("Katso tunnit"),
  // yksilöpalveluista sovitaan aika suoraan ("Varaa aika").
  booking: "ryhma" | "yksilo";
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
      {
        title: "Vesijumppa",
        description: "Vedessä liikkuminen on nivelille ystävällistä, ja veden vastus tekee pienestäkin liikkeestä tehokkaan. Sopii kaikille kuntotasosta riippumatta.",
        icon: "water", intensity: 1, duration: "45 min", booking: "ryhma",
        suitsFor: "Kaikille, erityisesti niveliä säästävää liikuntaa kaipaaville",
        locations: ["Tahko", "Kuopio"],
      },
      {
        title: "Keppijumppa",
        description: "Kepin avulla avataan hartioita ja rintarankaa. Rauhallinen tunti, jossa liikkuvuus ja ryhti paranevat.",
        icon: "stick", intensity: 1, duration: "60 min", booking: "ryhma",
        suitsFor: "Aloittelijoille ja istumatyön vastapainoksi",
        locations: ["Siilinjärvi", "Rautavaara"],
      },
      {
        title: "HIIT",
        description: "Lyhyitä, kovatehoisia jaksoja ja palautuksia. Paljon tehoa lyhyessä ajassa, ja jokainen tekee omalla tasollaan.",
        icon: "bolt", intensity: 3, duration: "45 min", booking: "ryhma",
        suitsFor: "Sykettä kaipaaville, liikkeistä on helpommat versiot",
        locations: ["Kuopio", "Siilinjärvi"],
      },
      {
        title: "Circuit",
        description: "Kiertoharjoittelua, jossa vaihdetaan pisteeltä toiselle. Lihaskuntoa ja hikeä vaihtelevasti.",
        icon: "circuit", intensity: 3, duration: "45 min", booking: "ryhma",
        suitsFor: "Vaihtelua treeniin kaipaaville, kaikille kuntotasoille",
        locations: ["Kuopio", "Siilinjärvi"],
      },
      {
        title: "Tehotreeni",
        description: "Koko kehon lihaskuntotunti, jossa tehdään perusliikkeet huolella ja nostetaan sykettä.",
        icon: "dumbbell", intensity: 3, duration: "60 min", booking: "ryhma",
        suitsFor: "Lihaskuntoa ja perusliikkeiden hallintaa kaipaaville",
        locations: ["Tahko", "Kuopio"],
      },
      {
        title: "RVP",
        description: "Reidet, vatsa ja pakarat. Vahva keskivartalo ja alakroppa näkyvät ryhdissä ja arjen jaksamisessa.",
        icon: "core", intensity: 2, duration: "45 min", booking: "ryhma",
        suitsFor: "Kaikille kuntotasoille, keskivartalon vahvistamiseen",
        locations: ["Siilinjärvi", "Rautavaara"],
      },
      {
        title: "Tanssilliset tunnit",
        description: "Musiikkia ja helppoja askelsarjoja. Tärkeintä on liikkumisen ilo, ei täydelliset liikkeet.",
        icon: "music", intensity: 2, duration: "60 min", booking: "ryhma",
        suitsFor: "Kaikille musiikista nauttiville, tanssitaustaa ei tarvita",
        locations: ["Tahko", "Rautavaara"],
      },
      {
        title: "Personal Training",
        description: "Ohjelma tehdään sinun tavoitteidesi, lähtötasosi ja aikataulusi mukaan, ja kuljen mukana koko matkan.",
        icon: "person", duration: "Sovitaan yhdessä", booking: "yksilo",
        suitsFor: "Omaan tavoitteeseen, aloittelijasta kokeneeseen",
        locations: ["Tahko", "Siilinjärvi", "Kuopio", "Rautavaara"],
      },
    ],
  },
  {
    id: "hyvinvointi",
    label: "Hyvinvointi",
    services: [
      {
        title: "Äänimaljarentoutus",
        description: "Äänimaljojen soinnit ja värähtely auttavat kehoa ja mieltä rauhoittumaan. Sinä lepäät makuulla, minä soitan.",
        icon: "bowl", duration: "60 min", booking: "ryhma",
        suitsFor: "Kaikille, jotka kaipaavat pysähtymistä arjen keskellä",
        locations: ["Tahko", "Siilinjärvi"],
      },
      {
        title: "Kristallimaljarentoutus",
        description: "Kristallimaljojen kirkas, pitkään soiva ääni. Hetki, jossa saa vain olla.",
        icon: "crystal", duration: "60 min", booking: "ryhma",
        suitsFor: "Rauhoittumista ja hiljentymistä kaipaaville",
        locations: ["Tahko"],
      },
      {
        title: "Yin jooga",
        description: "Pitkään pidettäviä, rauhallisia asentoja, jotka avaavat kehoa ja opettavat pysähtymään.",
        icon: "lotus", intensity: 1, duration: "75 min", booking: "ryhma",
        suitsFor: "Aloittelijoille ja kehonhuoltoa kaipaaville",
        locations: ["Siilinjärvi", "Kuopio"],
      },
      {
        title: "Syvävenyttely",
        description: "Rauhallista venyttelyä, joka parantaa liikkuvuutta ja auttaa palautumaan treenistä.",
        icon: "stretch", intensity: 1, duration: "60 min", booking: "ryhma",
        suitsFor: "Treenistä palautumiseen ja jäykkyyden avaamiseen",
        locations: ["Siilinjärvi", "Rautavaara"],
      },
      {
        title: "InBody-mittaukset",
        description: "Kehonkoostumusmittaus näyttää lihas- ja rasvamassan sekä nestetasapainon. Hyvä lähtöpiste ja tapa seurata kehitystä.",
        icon: "chart", duration: "n. 15 min", booking: "yksilo",
        suitsFor: "Lähtötason selvittämiseen ja kehityksen seurantaan",
        locations: ["Tahko", "Siilinjärvi", "Kuopio", "Rautavaara"],
      },
    ],
  },
];
