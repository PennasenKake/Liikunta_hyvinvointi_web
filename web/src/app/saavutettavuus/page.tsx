// saavutettavuus/page.tsx: saavutettavuusseloste (reitti "/saavutettavuus").
// Pienyrityksellä ei ole lakisääteistä velvoitetta selosteeseen, mutta se kertoo kävijälle,
// miten sivusto on tehty ja mihin voi antaa palautetta. Päivitä, kun sivustoa muutetaan.

import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Saavutettavuusseloste – Tahkon Amanda",
  description: "Tahkon Amandan sivuston saavutettavuus: WCAG 2.1 AA -tavoite, testaus ja palaute.",
};

export default function AccessibilityPage() {
  return (
    <LegalPage eyebrow="Saavutettavuus" title="Saavutettavuusseloste" updated="29.10.2026">
      <p>
        Haluamme, että sivustoa voi käyttää mahdollisimman moni, myös ruudunlukijalla, näppäimistöllä tai
        suurennettuna. Tavoitteena on WCAG 2.1 -ohjeiden AA-taso.
      </p>

      <h2>Mitä on tehty</h2>
      <ul>
        <li>Tekstin ja taustan kontrastit on tarkistettu (vähintään 4,5:1, useimmiten yli 7:1).</li>
        <li>Kaikki toiminnot ovat käytettävissä näppäimistöllä, ja fokus näkyy selvästi.</li>
        <li>Sivun rakenne on merkitty otsikoilla ja alueilla, ja kuvilla on tekstivastineet.</li>
        <li>Animaatiot jätetään pois, jos olet pyytänyt laitteeltasi vähemmän liikettä.</li>
        <li>Sivusto testataan automaattisesti (axe-core ja Playwright) jokaisen muutoksen yhteydessä.</li>
      </ul>

      <h2>Tunnetut puutteet</h2>
      <p>
        {/* TODO: päivitä, kun paikkamerkit on korvattu oikealla sisällöllä */}
        Osa sisällöstä on vielä paikkamerkkejä (esimerkiksi hinnat ja kumppanien logot), ja ne täydennetään ennen
        julkaisua.
      </p>

      <h2>Palaute</h2>
      <p>
        Jos huomaat sivustolla saavutettavuusongelman, kerro siitä: <a href={`mailto:${site.email}`}>{site.email}</a>{" "}
        tai puh. <a href={site.phoneHref}>{site.phone}</a>. Korjaamme puutteen mahdollisimman pian.
      </p>
    </LegalPage>
  );
}
