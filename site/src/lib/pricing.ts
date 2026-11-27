// pricing.ts: hinnasto.
// Data on erillään komponentista (Pricing.tsx): kun hinta muuttuu, muutos tehdään vain tänne.
// Myöhemmin hinnat voi siirtää CMS:ään, jolloin Amanda päivittää ne itse.
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
  { name: "Personal training", detail: "[kesto] min", price: "[HINTA] €" },
  { name: "Ääni- tai kristallimaljarentoutus", detail: "[kesto] min", price: "[HINTA] €" },
  { name: "Yin jooga / Syvävenyttely", detail: "Kerta", price: "[HINTA] €" },
  { name: "InBody-mittaus", detail: "Sisältää tulosten läpikäynnin", price: "[HINTA] €" },
];

// Hinta numerona hakukoneiden rakennetietoa varten (lib/seo.ts): "25 €" → 25, "alk. 25,50 €" → 25.5.
// Paikkamerkki tai teksti ilman lukua ("[HINTA] €", "Kysy") → null, jolloin hintaa ei ilmoiteta.
export function priceValue(price: string): number | null {
  const m = price.match(/(\d+(?:[.,]\d{1,2})?)\s*€/);
  return m ? Number(m[1].replace(",", ".")) : null;
}

// Hinnaston alla näytettävä huomautus
export const pricingNote = "Kysy myös yritys- ja ryhmätarjousta.";
