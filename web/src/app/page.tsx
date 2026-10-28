// page.tsx: etusivu (reitti "/").
// Kokoaa osiot järjestykseen. Itse osiot ovat kansiossa components/sections,
// joten tämä tiedosto kertoo yhdellä silmäyksellä sivun rakenteen.

import Hero from "@/components/sections/Hero";
import QuickLinks from "@/components/sections/QuickLinks";
import Services from "@/components/sections/Services";
import WhyMove from "@/components/sections/WhyMove";
import Pricing from "@/components/sections/Pricing";
import About from "@/components/sections/About";
import Calendar from "@/components/sections/Calendar";
import InstagramFeed from "@/components/sections/InstagramFeed";
import { formatShort, getUpcomingEvents } from "@/lib/calendar";

// async: Heron "Seuraava tunti" -kortti tarvitsee kalenterin ensimmäisen tapahtuman
export default async function Home() {
  const [next] = await getUpcomingEvents(1);

  // Muunnetaan kalenteritapahtuma kortin muotoon. Jos tunteja ei ole, kortti piilotetaan (null).
  const nextClass = next
    ? { title: next.title, when: formatShort(next.start), place: next.location }
    : null;

  return (
    <main>
      <Hero nextClass={nextClass} />
      <QuickLinks />
      <Services />
      <WhyMove />
      <Pricing />
      <About />
      <Calendar />
      <InstagramFeed />
    </main>
  );
}
