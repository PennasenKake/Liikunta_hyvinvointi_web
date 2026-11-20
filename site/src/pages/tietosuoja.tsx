// tietosuoja/page.tsx: tietosuojaseloste (reitti "/tietosuoja").
// Kansion nimi määrää URL-osoitteen: app/tietosuoja/page.tsx → tahkonamanda.fi/tietosuoja.
// LUONNOS: Amanda tarkistaa kohdat TODO(Amanda) ennen julkaisua. Päivitä, kun uusia palveluita
// kytketään (Instagram-syöte / Behold, CMS, oma yhteydenottolomake). Tuntilista haetaan Amandan
// Excelistä buildissa: siinä on vain aikataulu, ei osallistujien tietoja.
// Lomakepalvelun nimi (Microsoft / Google Forms) tulee site.signupForm-osoitteesta (formProvider).

import Link from "@/components/ui/Link";
import LegalPage from "@/components/ui/LegalPage";
import { formProvider } from "@/lib/calendar";
import { site } from "@/lib/site";


export default function PrivacyPage() {
  const form = formProvider();
  return (
    <LegalPage eyebrow="Tietosuoja" title="Tietosuojaseloste" updated="20.11.2026">
      <h2>1. Rekisterinpitäjä</h2>
      <p>
        {site.name}, Y-tunnus {site.businessId}. Tietosuoja-asiat:{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>2. Mitä tietoja käsittelemme</h2>
      <p>
        Käsittelemme tietoja, joita annat itse ilmoittautuessasi, perumalla ilmoittautumisen tai ottaessasi
        yhteyttä: nimi, puhelinnumero, sähköpostiosoite, viestit sekä varauksen tiedot, kuten tunti, palvelu ja
        ajankohta.
      </p>
      <p>
        Sivustolla näkyvä tuntilista sisältää vain aikataulun (tunti, aika ja paikka). Osallistujien nimiä tai
        muita tietoja ei koskaan julkaista sivustolla.
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
        Tietoja säilytetään vain niin kauan kuin asiakassuhteen hoitaminen edellyttää.
        {/* TODO(Amanda): ilmoittautumisten säilytysaika */}
        {" "}Ilmoittautumiset poistetaan [kauden päätyttyä]. Kirjanpitoaineistoa
        säilytetään lain edellyttämän ajan. Tietoja ei myydä eikä luovuteta muille kuin palvelun tuottamiseen
        tarvittaville tahoille (esimerkiksi kirjanpito) tai viranomaisille lakisääteisestä pyynnöstä.
      </p>

      <h2>5. Evästeet ja seuranta</h2>
      <p>
        Sivusto ei aseta evästeitä eikä käytä analytiikka- tai mainosseurantaa. Sivusto toimii Cloudflaren
        palvelussa, joka käsittelee teknisiä tietoja, kuten IP-osoitetta, sivuston toimittamiseksi ja
        suojaamiseksi palvelunesto- ja muilta hyökkäyksiltä. Lisätietoa:{" "}
        <Link href="/evasteet/">Evästeasetukset</Link>.
      </p>

      <h2>6. Kolmannen osapuolen palvelut</h2>
      <ul>
        {form && (
          <li>
            {/* TODO(Amanda): tarkista lomakkeen kentät */}
            <strong>Ilmoittautumislomake ({form.name}):</strong> Ilmoittaudu-painike avaa lomakkeen uuteen
            välilehteen, ja valitsemasi tunti on siinä valmiiksi täytettynä. Lomakkeeseen antamasi tiedot
            tallentuvat {site.name}n lomakepalveluun ({form.company}), joka käsittelee niitä palvelun tarjoajana.
            Palveluntarjoaja voi käsitellä tietoja myös EU:n ulkopuolella EU:n hyväksymin suojatoimin. Vastauksia
            käytetään vain ilmoittautumisten hoitamiseen.
          </li>
        )}
        <li>
          <strong>Peruutus ja yhteydenotot (sähköposti):</strong> Peru ilmoittautuminen-, Ota yhteyttä- ja
          tarjouspyyntölinkit avaavat oman sähköpostiohjelmasi valmiilla viestipohjalla. Sivusto ei lähetä eikä
          tallenna viestejä, vaan ne kulkevat sähköpostitse suoraan {site.name}lle.
        </li>
        <li>
          <strong>Sivuston palvelin (Cloudflare):</strong> Cloudflare toimittaa sivuston tiedostot kävijän
          selaimeen. Sivusto ei lähetä Cloudflarelle muita kuin edellä mainittuja teknisiä tietoja.
        </li>
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
