// evasteet/page.tsx: evästeasetukset (reitti "/evasteet").
// Sivusto ei tällä hetkellä aseta evästeitä, joten asetettavaa ei ole: sivu kertoo sen.
// MYÖHEMMIN (Behold-syöte): tänne tulee painike, joka palauttaa Instagram-valinnan
// (malli: GlossTahkon ConsentSettings), ja alatunnisteen linkki osoittaa siihen.

import Link from "@/components/ui/Link";
import LegalPage from "@/components/ui/LegalPage";
import { formProvider } from "@/lib/calendar";


export default function CookiesPage() {
  const form = formProvider();
  return (
    <LegalPage eyebrow="Evästeet" title="Evästeasetukset" updated="20.11.2026">
      <p>
        <strong>Tämä sivusto ei aseta evästeitä</strong> eikä käytä analytiikka- tai mainosseurantaa. Siksi
        sinulta ei kysytä evästeasetuksia, eikä mitään tarvitse hyväksyä.
      </p>

      <h2>Mitä selaimesi lataa</h2>
      <ul>
        <li>Sivuston omat tiedostot (teksti, kuvat, fontit) sivuston omalta palvelimelta.</li>
        <li>Fontit tulevat sivuston omalta palvelimelta, eivät Googlen palvelimilta.</li>
        <li>Kolmansien osapuolten sisältöjä ei ladata ilman, että painat linkkiä.</li>
        {form && (
          <li>
            Ilmoittautumislomake avautuu uuteen välilehteen ({form.name}). Siellä ovat voimassa lomakepalvelun
            ({form.company}) omat evästeet ja ehdot, eivät tämän sivuston.
          </li>
        )}
        <li>Peru ilmoittautuminen- ja yhteydenottolinkit avaavat oman sähköpostiohjelmasi. Evästeitä ei aseteta.</li>
        <li>Lisää kalenteriin avaa Google Kalenterin uuteen välilehteen tai lataa kalenteritiedoston (.ics).</li>
      </ul>

      <h2>Jos tämä muuttuu</h2>
      <p>
        Jos sivulle lisätään myöhemmin esimerkiksi Instagram-julkaisujen automaattinen syöte, se ladataan vasta
        luvallasi. Silloin voit muuttaa valintasi tältä sivulta milloin tahansa, ja asiasta kerrotaan
        tarkemmin <Link href="/tietosuoja/">tietosuojaselosteessa</Link>.
      </p>
    </LegalPage>
  );
}
