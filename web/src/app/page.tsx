// page.tsx on etusivu (reitti "/").
// Tähän kootaan myöhemmin etusivun osiot järjestyksessä:
// Hero, palvelut, liikunta ja hyvinvointi, hinnasto, minusta,
// kalenteri ja Instagram. Itse osiot tehdään omiin komponentteihinsa
// kansioon src/components/sections, jotta tämä tiedosto pysyy lyhyenä.

export default function Home() {
  return (
    <main>
      {/* Väliaikainen otsikko, jotta näkee pohjan toimivan */}
      <h1>Tahkon Amanda</h1>
    </main>
  );
}