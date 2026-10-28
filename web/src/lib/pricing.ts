// pricing.ts: hinnasto.
// Data on erillään komponentista (Pricing.tsx): kun hinta muuttuu, muutos tehdään vain tänne.
// Myöhemmin hinnat haetaan Sanitysta, jolloin Amanda päivittää ne itse.
//
// TODO(Amanda): hinnat ja kestot. "[HINTA]" ja "[kesto]" ovat paikkamerkkejä.

export type PriceItem = {
  name: string;   // Palvelun nimi
  detail: string; // Tarkenne: kesto, sisältö tai yksikkö
  price: string;  // Merkkijono eikä numero, jotta muodot kuten "alk. 25 €" ovat mahdollisia
};

export const prices: PriceItem[] = [
  { name: "Ryhmäliikuntatunti", detail: "Vesijumppa, HIIT, Circuit, RVP ym. · kerta", price: "[HINTA] €" },
  { name: "10 kerran kortti", detail: "Käy kaikille ryhmäliikuntatunneille", price: "[HINTA] €" },
  { name: "Personal Training", detail: "[kesto] min", price: "[HINTA] €" },
  { name: "Ääni- tai kristallimaljarentoutus", detail: "[kesto] min", price: "[HINTA] €" },
  { name: "Yin jooga / Syvävenyttely", detail: "Kerta", price: "[HINTA] €" },
  { name: "InBody-mittaus", detail: "Sisältää tulosten läpikäynnin", price: "[HINTA] €" },
];

// Hinnaston alla näytettävä huomautus
export const pricingNote = "Kysy myös yritys- ja ryhmätarjousta.";
