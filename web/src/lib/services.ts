// services.ts: Tahkon Amandan palvelut.
// Data on erillään komponenteista: kun palvelu lisätään tai teksti muuttuu,
// muutos tehdään vain tänne. Myöhemmin data haetaan Sanitysta.
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
        icon: "water", booking: "ryhma",
        suitsFor: "Kaikille, erityisesti niveliä säästävää liikuntaa kaipaaville",
      },
      {
        title: "Keppijumppa",
        description: "Kepin avulla avataan hartioita ja rintarankaa. Rauhallinen tunti, jossa liikkuvuus ja ryhti paranevat.",
        icon: "stick", booking: "ryhma",
        suitsFor: "Aloittelijoille ja istumatyön vastapainoksi",
      },
      {
        title: "HIIT",
        description: "Lyhyitä, kovatehoisia jaksoja ja palautuksia. Paljon tehoa lyhyessä ajassa, ja jokainen tekee omalla tasollaan.",
        icon: "bolt", booking: "ryhma",
        suitsFor: "Sykettä kaipaaville, liikkeistä on helpommat versiot",
      },
      {
        title: "Circuit",
        description: "Kiertoharjoittelua, jossa vaihdetaan pisteeltä toiselle. Lihaskuntoa ja hikeä vaihtelevasti.",
        icon: "circuit", booking: "ryhma",
        suitsFor: "Vaihtelua treeniin kaipaaville, kaikille kuntotasoille",
      },
      {
        title: "Tehotreeni",
        description: "Koko kehon lihaskuntotunti, jossa tehdään perusliikkeet huolella ja nostetaan sykettä.",
        icon: "dumbbell", booking: "ryhma",
        suitsFor: "Lihaskuntoa ja perusliikkeiden hallintaa kaipaaville",
      },
      {
        title: "RVP",
        description: "Reidet, vatsa ja pakarat. Vahva keskivartalo ja alakroppa näkyvät ryhdissä ja arjen jaksamisessa.",
        icon: "core", booking: "ryhma",
        suitsFor: "Kaikille kuntotasoille, keskivartalon vahvistamiseen",
      },
      {
        title: "Tanssilliset tunnit",
        description: "Musiikkia ja helppoja askelsarjoja. Tärkeintä on liikkumisen ilo, ei täydelliset liikkeet.",
        icon: "music", booking: "ryhma",
        suitsFor: "Kaikille musiikista nauttiville, tanssitaustaa ei tarvita",
      },
      {
        title: "Personal Training",
        description: "Ohjelma tehdään sinun tavoitteidesi, lähtötasosi ja aikataulusi mukaan, ja kuljen mukana koko matkan.",
        icon: "person", booking: "yksilo",
        suitsFor: "Omaan tavoitteeseen, aloittelijasta kokeneeseen",
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
      {
        title: "InBody-mittaukset",
        description: "Kehonkoostumusmittaus näyttää lihas- ja rasvamassan sekä nestetasapainon. Hyvä lähtöpiste ja tapa seurata kehitystä.",
        icon: "chart", booking: "yksilo",
        suitsFor: "Lähtötason selvittämiseen ja kehityksen seurantaan",
      },
    ],
  },
];
