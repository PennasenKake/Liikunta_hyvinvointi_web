// services.ts: Tahkon Amandan palvelut kolmessa osassa: Liikunta, Hyvinvointi ja Valmennus.
// Data on erillään komponenteista: kun palvelu lisätään tai teksti muuttuu,
// muutos tehdään vain tänne. Myöhemmin data voi tulla CMS:stä.
//
// Jokaisella osalla on oma sivunsa (path, esim. /liikunta/), ja etusivun Palvelut-osio näyttää
// niistä kortit. Liikunnan tunnit on jaettu tasoihin (level): kevyemmät ja tehokkaammat.
// TODO(Amanda): tarkista tasojako ja tekstit (docs/sisalto.md).
//
// TODO(Amanda): "Sopii:"-tekstit ovat luonnoksia, jotka Amanda tarkistaa. Lista: docs/sisalto.md.
// Kestoja, paikkakuntia ja tehotasoja ei tallenneta arvioina: ne lisätään vasta,
// kun Amanda on vahvistanut ne (esim. Google-kalenterin tapahtumista).

// Kuvakkeen nimi. Piirrokset ovat tiedostossa components/ui/ServiceIcon.tsx.
export type ServiceIconName =
  | "water" | "stick" | "bolt" | "circuit" | "dumbbell" | "core" | "music" | "person"
  | "bowl" | "crystal" | "lotus" | "stretch" | "chart";

export type Service = {
  title: string;
  description: string;
  icon: ServiceIconName;
  suitsFor: string;       // "Sopii:"-rivi, kenelle tunti on tarkoitettu (ei vielä näkyvissä)
  // Ryhmätunnit näkyvät kalenterissa ("Katso tunnit"),
  // yksilöpalveluista sovitaan aika suoraan ("Varaa aika").
  booking: "ryhma" | "yksilo";
  level?: ServiceLevel;   // Vain Liikunta: kevyempi vai tehokkaampi tunti
};

export type ServiceLevel = "kevyt" | "tehokas";

// Tasojen otsikot ja lyhyet kuvaukset (Liikunta-sivu, yläpalkin ja mobiilivalikon alavalikot)
export const levels: Record<ServiceLevel, { label: string; text: string }> = {
  kevyt: { label: "Kevyemmät", text: "Rauhallinen tahti, sopii aloittajalle ja palautumiseen." },
  tehokas: { label: "Tehokkaammat", text: "Sykettä ja lihaskuntoa, jokainen omalla tasollaan." },
};

export type ServiceCategory = {
  id: "liikunta" | "hyvinvointi" | "valmennus"; // Sallitut arvot rajattu: kirjoitusvirhe huomataan heti
  label: string;
  path: string;      // Oma sivu, esim. "/liikunta/" (routes.tsx)
  heading: string;   // Sivun h1, esim. "Personal training ja InBody-mittaus"
  card: string;      // Etusivun kortin lyhyt teksti
  cardLink: string;  // Etusivun kortin linkkiteksti
  intro: string;     // Sivun johdanto: miksi tämä on tärkeää
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
    path: "/liikunta/",
    heading: "Ryhmäliikunta",
    card: "Ryhmäliikuntaa kahdella tasolla: kevyemmät ja tehokkaammat tunnit.",
    cardLink: "Kaikki liikuntatunnit",
    intro:
      "Liikunta pitää kehon vahvana ja mielen virkeänä. Säännöllinen treeni parantaa unta, jaksamista ja ryhtiä, ja ryhmässä liikkuminen on hauskempaa. Valitse tahti, joka tuntuu hyvältä tänään.",
    services: [
      {
        title: "Vesijumppa",
        description: "Vedessä liikkuminen on nivelille ystävällistä, ja veden vastus tekee pienestäkin liikkeestä tehokkaan. Sopii kaikille kuntotasosta riippumatta.",
        icon: "water", booking: "ryhma", level: "kevyt",
        suitsFor: "Kaikille, erityisesti niveliä säästävää liikuntaa kaipaaville",
      },
      {
        title: "Keppijumppa",
        description: "Kepin avulla avataan hartioita ja rintarankaa. Rauhallinen tunti, jossa liikkuvuus ja ryhti paranevat.",
        icon: "stick", booking: "ryhma", level: "kevyt",
        suitsFor: "Aloittelijoille ja istumatyön vastapainoksi",
      },
      {
        title: "HIIT",
        description: "Lyhyitä, kovatehoisia jaksoja ja palautuksia. Paljon tehoa lyhyessä ajassa, ja jokainen tekee omalla tasollaan.",
        icon: "bolt", booking: "ryhma", level: "tehokas",
        suitsFor: "Sykettä kaipaaville, liikkeistä on helpommat versiot",
      },
      {
        title: "Circuit",
        description: "Kiertoharjoittelua, jossa vaihdetaan pisteeltä toiselle. Lihaskuntoa ja hikeä vaihtelevasti.",
        icon: "circuit", booking: "ryhma", level: "tehokas",
        suitsFor: "Vaihtelua treeniin kaipaaville, kaikille kuntotasoille",
      },
      {
        title: "Tehotreeni",
        description: "Koko kehon lihaskuntotunti, jossa tehdään perusliikkeet huolella ja nostetaan sykettä.",
        icon: "dumbbell", booking: "ryhma", level: "tehokas",
        suitsFor: "Lihaskuntoa ja perusliikkeiden hallintaa kaipaaville",
      },
      {
        title: "RVP",
        description: "Reidet, vatsa ja pakarat. Vahva keskivartalo ja alakroppa näkyvät ryhdissä ja arjen jaksamisessa.",
        icon: "core", booking: "ryhma", level: "tehokas",
        suitsFor: "Kaikille kuntotasoille, keskivartalon vahvistamiseen",
      },
      {
        title: "Tanssilliset tunnit",
        description: "Musiikkia ja helppoja askelsarjoja. Tärkeintä on liikkumisen ilo, ei täydelliset liikkeet.",
        icon: "music", booking: "ryhma", level: "kevyt",
        suitsFor: "Kaikille musiikista nauttiville, tanssitaustaa ei tarvita",
      },
    ],
  },
  {
    id: "hyvinvointi",
    label: "Hyvinvointi",
    path: "/hyvinvointi/",
    heading: "Rentoutus, jooga ja venyttely",
    card: "Rentoutusta, joogaa ja venyttelyä palautumiseen.",
    cardLink: "Hyvinvointipalvelut",
    intro:
      "Palautuminen on osa hyvinvointia. Rauhoittuminen, venyttely ja oman kehon tunteminen auttavat jaksamaan arjessa ja treenissä.",
    services: [
      {
        title: "Äänimaljarentoutus",
        description: "Äänimaljojen soinnit ja värähtely auttavat kehoa ja mieltä rauhoittumaan. Sinä lepäät makuulla, minä soitan.",
        icon: "bowl", booking: "ryhma",
        suitsFor: "Kaikille, jotka kaipaavat pysähtymistä arjen keskellä",
      },
      {
        title: "Kristallimaljarentoutus",
        description: "Kristallimaljojen kirkas, pitkään soiva ääni. Hetki, jossa saa vain olla.",
        icon: "crystal", booking: "ryhma",
        suitsFor: "Rauhoittumista ja hiljentymistä kaipaaville",
      },
      {
        title: "Yin jooga",
        description: "Pitkään pidettäviä, rauhallisia asentoja, jotka avaavat kehoa ja opettavat pysähtymään.",
        icon: "lotus", booking: "ryhma",
        suitsFor: "Aloittelijoille ja kehonhuoltoa kaipaaville",
      },
      {
        title: "Syvävenyttely",
        description: "Rauhallista venyttelyä, joka parantaa liikkuvuutta ja auttaa palautumaan treenistä.",
        icon: "stretch", booking: "ryhma",
        suitsFor: "Treenistä palautumiseen ja jäykkyyden avaamiseen",
      },
    ],
  },
  {
    id: "valmennus",
    label: "Valmennus",
    path: "/valmennus/",
    heading: "Personal training ja InBody-mittaus",
    card: "Personal training ja InBody-mittaus sinun tavoitteisiisi.",
    cardLink: "Tutustu valmennukseen",
    intro:
      "Valmennuksessa keskitytään sinuun: tavoitteisiisi, lähtötasoosi ja arkeesi. InBody-mittaus näyttää, mistä lähdetään ja miten kehitys etenee.",
    services: [
      {
        title: "Personal training",
        description: "Ohjelma tehdään sinun tavoitteidesi, lähtötasosi ja aikataulusi mukaan, ja kuljen mukana koko matkan.",
        icon: "person", booking: "yksilo",
        suitsFor: "Omaan tavoitteeseen, aloittelijasta kokeneeseen",
      },
      {
        title: "InBody-mittaus",
        description: "Kehonkoostumusmittaus näyttää lihas- ja rasvamassan sekä nestetasapainon. Hyvä lähtöpiste ja tapa seurata kehitystä.",
        icon: "chart", booking: "yksilo",
        suitsFor: "Lähtötason selvittämiseen ja kehityksen seurantaan",
      },
    ],
  },
];



// Palvelun osoite omalla sivullaan, esim. "Vesijumppa" → "/liikunta/#vesijumppa".
// Yläpalkin alavalikko ja tuntilistan palvelulinkit käyttävät tätä.
export function serviceHrefFor(cat: ServiceCategory, s: Service): string {
  return `${cat.path}#${serviceId(s.title)}`;
}

// Liikunnan tunnit tasoittain (kevyemmät ensin). Muilla osilla yksi ryhmä ilman otsikkoa.
export function servicesByLevel(cat: ServiceCategory): { level: ServiceLevel | null; services: Service[] }[] {
  if (!cat.services.some((s) => s.level)) return [{ level: null, services: cat.services }];
  return (Object.keys(levels) as ServiceLevel[])
    .map((level) => ({ level, services: cat.services.filter((s) => s.level === level) }))
    .filter((g) => g.services.length > 0);
}
