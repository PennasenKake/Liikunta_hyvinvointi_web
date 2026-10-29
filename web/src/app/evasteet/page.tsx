// evasteet/page.tsx: evästeasetukset (reitti "/evasteet").
// Sivusto ei tällä hetkellä aseta evästeitä, joten asetettavaa ei ole: sivu kertoo sen.
// MYÖHEMMIN (Behold-syöte): tänne tulee painike, joka palauttaa Instagram-valinnan
// (malli: GlossTahkon ConsentSettings), ja alatunnisteen linkki osoittaa siihen.

import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/ui/LegalPage";
import { withBase } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Evästeasetukset", // Pohja layout.tsx:ssä lisää perään " – Tahkon Amanda"
  alternates: { canonical: withBase("/evasteet") }, // Sivun ensisijainen osoite hakukoneille
  description: "Tahkon Amandan sivusto ei aseta evästeitä eikä käytä seurantaa.",
};

export default function CookiesPage() {
  return (
    <LegalPage eyebrow="Evästeet" title="Evästeasetukset" updated="29.10.2026">
      <p>
        <strong>Tämä sivusto ei aseta evästeitä</strong> eikä käytä analytiikka- tai mainosseurantaa. Siksi
        sinulta ei kysytä evästeasetuksia, eikä mitään tarvitse hyväksyä.
      </p>

      <h2>Mitä selaimesi lataa</h2>
      <ul>
        <li>Sivuston omat tiedostot (teksti, kuvat, fontit) sivuston omalta palvelimelta.</li>
        <li>Fontit tulevat sivuston omalta palvelimelta, eivät Googlen palvelimilta.</li>
        <li>Kolmansien osapuolten sisältöjä ei ladata ilman, että painat linkkiä.</li>
      </ul>

      <h2>Jos tämä muuttuu</h2>
      <p>
        Jos sivulle lisätään myöhemmin esimerkiksi Instagram-julkaisujen automaattinen syöte, se ladataan vasta
        luvallasi. Silloin voit muuttaa valintasi tältä sivulta milloin tahansa, ja asiasta kerrotaan
        tarkemmin <Link href="/tietosuoja">tietosuojaselosteessa</Link>.
      </p>
    </LegalPage>
  );
}
