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
import TahkoLine from "@/components/ui/TahkoLine";
import { jsonLdString, localBusinessJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    // id="sisalto" + tabIndex={-1}: "Siirry sisältöön" -linkki siirtää fokuksen tänne (App.tsx)
    <main id="sisalto" tabIndex={-1} className="outline-none">
      {/* Rakennetieto (JSON-LD): kertoo Googlelle yrityksen nimen, yhteystiedot, palvelualueet
          ja palvelut. Ei näy sivulla. Testaus: search.google.com/test/rich-results */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(localBusinessJsonLd()) }} />
      <Hero />
      <QuickLinks />
      <Services />
      {/* Vuoristosiluetit osioiden rajoilla: from = yläpuolisen osion väri, to = alapuolisen */}
      <TahkoLine id="palvelut-miksi" from="white" to="sky" shape="huiput" />
      <WhyMove />
      <TahkoLine id="miksi-hinnasto" from="sky" to="white" shape="tahko" />
      <Pricing />
      <TahkoLine id="hinnasto-minusta" from="white" to="lilac-soft" shape="harju" flip />
      <About />
      <TahkoLine id="minusta-kalenteri" from="lilac-soft" to="white" shape="huiput" flip />
      <Calendar />
      <InstagramFeed />
    </main>
  );
}
