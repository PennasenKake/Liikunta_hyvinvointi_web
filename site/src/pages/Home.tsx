// page.tsx: etusivu (reitti "/").
// Kokoaa osiot järjestykseen. Itse osiot ovat kansiossa components/sections,
// joten tämä tiedosto kertoo yhdellä silmäyksellä sivun rakenteen.

import Hero from "@/components/sections/hero/Hero";
import QuickLinks from "@/components/sections/QuickLinks";
import Services from "@/components/sections/Services";
import WhyMove from "@/components/sections/WhyMove";
import BreathExercise from "@/components/sections/BreathExercise";
import Pricing from "@/components/sections/Pricing";
import About from "@/components/sections/About";
import Calendar from "@/components/sections/Calendar";
import InstagramFeed from "@/components/sections/InstagramFeed";
import TahkoLine from "@/components/ui/TahkoLine";
import { eventsJsonLd, jsonLdString, localBusinessJsonLd, websiteJsonLd } from "@/lib/seo";
import { calendarSource, getUpcomingEvents } from "@/lib/calendar";

export default function Home() {
  return (
    // id="sisalto" + tabIndex={-1}: "Siirry sisältöön" -linkki siirtää fokuksen tänne (App.tsx)
    <main id="sisalto" tabIndex={-1} className="outline-none">
      {/* Rakennetieto (JSON-LD): kertoo Googlelle yrityksen nimen, yhteystiedot, palvelualueet
          ja palvelut. Ei näy sivulla. Testaus: search.google.com/test/rich-results */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(localBusinessJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(websiteJsonLd()) }} />
      {/* Tulevat tunnit tapahtumina (buildin hetken tilanne, päivittyy tunneittaisessa buildissa).
          Vain oikeasta kalenterista: esimerkkitunteja ei saa ilmoittaa Googlelle tapahtumina. */}
      {calendarSource !== "esimerkki" && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(eventsJsonLd(getUpcomingEvents(20))) }} />
      )}
      {/* Järjestys kävijän kysymysten mukaan: mitä (palvelut) → miksi (liike ja lepo, kokeile
          hengitystä) → milloin (tulevat tunnit) → paljonko (hinnasto, tarjous) → kuka (Amanda) → somessa. */}
      <Hero />
      <QuickLinks />
      <Services />
      {/* Vuoristosiluetit osioiden rajoilla: from = yläpuolisen osion väri, to = alapuolisen */}
      <TahkoLine id="palvelut-miksi" from="white" to="sky" shape="huiput" />
      <WhyMove />
      <TahkoLine id="miksi-hengitys" from="sky" to="sand" shape="tahko" />
      {/* Hengähdä hetki: ajastettu hengitysharjoitus (liike → lepo), lopuksi kutsu tunnille */}
      <BreathExercise />
      <TahkoLine id="hengitys-kalenteri" from="sand" to="white" shape="harju" />
      <Calendar />
      <Pricing />
      <TahkoLine id="hinnasto-minusta" from="white" to="lilac-soft" shape="harju" flip />
      <About />
      <TahkoLine id="minusta-instagram" from="lilac-soft" to="surface" shape="huiput" flip />
      <InstagramFeed />
    </main>
  );
}
