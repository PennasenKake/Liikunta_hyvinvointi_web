// Hero.tsx: etusivun yläosa. Valitsee näytettävän version asetuksesta site.heroVariant.
// Versiot ovat omissa tiedostoissaan kansiossa hero/, joten uuden version voi lisätä
// koskematta muihin. Vaihto tehdään yhdellä kirjaimella tiedostossa lib/site.ts.

import HeroA from "./hero/HeroA";
import HeroB from "./hero/HeroB";
import HeroC from "./hero/HeroC";
import { site } from "@/lib/site";

// Kirjain → komponentti. Record-tyyppi varmistaa, että jokaiselle sallitulle kirjaimelle on komponentti.
const variants: Record<typeof site.heroVariant, () => React.JSX.Element> = {
  a: HeroA,
  b: HeroB,
  c: HeroC,
};

export default function Hero() {
  const Selected = variants[site.heroVariant];
  return <Selected />;
}
