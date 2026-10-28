// services.ts: Tahkon Amandan palvelut.
// Data on erillään komponenteista: kun palvelu lisätään tai teksti muuttuu,
// muutos tehdään vain tänne. Myöhemmin data haetaan Sanitysta.
//
// TODO(Amanda): kestot, paikkakunnat, tehotasot ja "Sopii:"-tekstit ovat
// arvioita, jotka Amanda tarkistaa. Lista: docs/sisalto.md.
//
// Palvelut-osio näyttää tällä hetkellä vain kuvakkeen, nimen, tehotason ja kuvauksen.
// Kesto, paikkakunnat ja "Sopii:" säilytetään datassa myöhempää käyttöä varten
// (esim. palvelukohtaiset alasivut tai kalenterin suodatus).

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
  intro: string; // Lyhyt teksti siitä, miksi tämä on tärkeää (näkyy palstan yläosassa)
  services: Service[];
};

// Palvelun ankkuri-id otsikosta: "Äänimaljarentoutus" → "aanimaljarentoutus".
// Käytetään sekä Palvelut-osion listassa (id) että yläpalkin alavalikon linkeissä (/#id),
// joten molemmat pysyvät automaattisesti samoina.
export function serviceId(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-") // Välilyönnit ja muut merkit viivoiksi
    .replace(/^-|-$/g, "");      // Ei viivaa alkuun tai loppuun
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "liikunta",
    label: "Liikunta",
    intro:
      "Liikunta pitää kehon vahvana ja mielen virkeänä. Säännöllinen treeni parantaa unta, jaksamista ja ryhtiä, ja ryhmässä liikkuminen on hauskempaa.",
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
    intro:
      "Palautuminen on osa hyvinvointia. Rauhoittuminen, venyttely ja oman kehon tunteminen auttavat jaksamaan arjessa ja treenissä.",
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
