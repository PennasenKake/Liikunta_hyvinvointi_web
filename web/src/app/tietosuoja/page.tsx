// tietosuoja/page.tsx: tietosuojaseloste (reitti "/tietosuoja").
// Kansion nimi määrää URL-osoitteen: app/tietosuoja/page.tsx → tahkonamanda.fi/tietosuoja.
// LUONNOS: päivitetään, kun integraatiot (Google-kalenteri, Behold, Sanity) otetaan käyttöön.

import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/ui/LegalPage";
import { withBase } from "@/lib/paths";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tietosuojaseloste", // Pohja layout.tsx:ssä lisää perään " – Tahkon Amanda"
  alternates: { canonical: withBase("/tietosuoja") }, // Sivun ensisijainen osoite hakukoneille
  description: "Miten Tahkon Amanda käsittelee henkilötietoja ja mitä sivusto lataa kolmansilta osapuolilta.",
};

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Tietosuoja" title="Tietosuojaseloste" updated="29.10.2026">
      <h2>1. Rekisterinpitäjä</h2>
      <p>
        {site.name}, Y-tunnus {site.businessId}. Tietosuoja-asiat:{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>2. Mitä tietoja käsittelemme</h2>
      <p>
        Käsittelemme tietoja, joita annat itse yhteydenottojen ja varausten yhteydessä: nimi, puhelinnumero,
        sähköpostiosoite, viestit sekä varauksen tiedot, kuten palvelu ja ajankohta.
      </p>
      <p>
        {/* TODO(Amanda): tarkista, säilytetäänkö mittaustuloksia ja missä muodossa */}
        InBody-mittauksen tulokset ovat terveyteen liittyviä tietoja. Niitä käsitellään vain mittauksen ja siihen
        liittyvän valmennuksen vuoksi ja vain luvallasi, eikä niitä luovuteta eteenpäin.
      </p>

      <h2>3. Käyttötarkoitus ja peruste</h2>
      <ul>
        <li>varausten ja asiakassuhteen hoitaminen (sopimus)</li>
        <li>viestintä asiakkaan kanssa (oikeutettu etu)</li>
        <li>kirjanpito (lakisääteinen velvoite)</li>
        <li>InBody-mittaustulokset (nimenomainen suostumus)</li>
      </ul>

      <h2>4. Säilytys ja luovutus</h2>
      <p>
        Tietoja säilytetään vain niin kauan kuin asiakassuhteen hoitaminen edellyttää. Kirjanpitoaineistoa
        säilytetään lain edellyttämän ajan. Tietoja ei myydä eikä luovuteta muille kuin palvelun tuottamiseen
        tarvittaville tahoille (esimerkiksi kirjanpito) tai viranomaisille lakisääteisestä pyynnöstä.
      </p>

      <h2>5. Evästeet ja seuranta</h2>
      <p>
        Sivusto ei aseta evästeitä eikä käytä analytiikka- tai mainosseurantaa. Sivuston palvelinalusta voi
        käsitellä teknisiä lokitietoja, kuten IP-osoitetta, sivuston toimittamiseksi. Lisätietoa:{" "}
        <Link href="/evasteet">Evästeasetukset</Link>.
      </p>

      <h2>6. Kolmannen osapuolen palvelut</h2>
      <ul>
        <li>
          <strong>Lisää kalenteriin -linkki (Google Kalenteri):</strong> linkki avaa Google Kalenterin uuteen
          välilehteen. Siihen asti tietoja ei lähetetä Googlelle.
        </li>
        <li>
          <strong>Instagram:</strong> Instagram-linkit avaavat Instagramin, ja Metan ehdot koskevat sen jälkeen
          käyttöäsi. Jos julkaisut myöhemmin haetaan sivulle suoraan Instagramista, se tehdään vasta luvallasi.
        </li>
      </ul>

      <h2>7. Oikeutesi</h2>
      <p>
        Sinulla on oikeus pyytää pääsyä tietoihisi, niiden oikaisua tai poistoa, käsittelyn rajoittamista ja
        vastustaa käsittelyä. Suostumukseen perustuvan käsittelyn voit perua milloin tahansa. Pyynnöt:{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>. Voit myös tehdä valituksen tietosuojavaltuutetun
        toimistolle (tietosuoja.fi).
      </p>
    </LegalPage>
  );
}
