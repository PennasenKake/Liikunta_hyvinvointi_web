// kayttoehdot/page.tsx: käyttöehdot (reitti "/kayttoehdot").
// LUONNOS: kohdat TODO(Amanda) tarkistetaan Amandan kanssa ennen julkaisua (docs/sisalto.md).
// Teksti ei ole juridinen neuvonta; lopullinen sisältö on yrittäjän päätös.

import type { Metadata } from "next";
import LegalPage from "@/components/ui/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Käyttöehdot", // Pohja layout.tsx:ssä lisää perään " – Tahkon Amanda"
  alternates: { canonical: "/kayttoehdot" }, // Sivun ensisijainen osoite hakukoneille
  description: "Tahkon Amandan palveluiden ehdot: ajanvaraus, peruutus, osallistuminen ja maksaminen.",
};

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Ehdot" title="Käyttöehdot" updated="29.10.2026">
      <p>
        Kun varaat tunnin tai palvelun Tahkon Amandalta, hyväksyt nämä ehdot. Kysy rohkeasti etukäteen, jos
        jokin jää mietityttämään.
      </p>

      <h2>1. Palveluntarjoaja</h2>
      <p>
        {site.name}, Y-tunnus {site.businessId}. Yhteydenotot: <a href={`mailto:${site.email}`}>{site.email}</a>,
        puh. <a href={site.phoneHref}>{site.phone}</a>.
      </p>

      <h2>2. Palvelut ja hinnat</h2>
      <p>
        Palvelut ja hinnat näkyvät sivuston hinnastossa. Voimassa on aina sivustolla näkyvä hinnasto.
        {/* TODO(Amanda): onko yritys arvonlisäverovelvollinen? Valitse oikea lause. */}
        {" "}[Hinnat sisältävät arvonlisäveron. / Yritys ei ole arvonlisäverovelvollinen.]
      </p>

      <h2>3. Ajanvaraus ja maksaminen</h2>
      <p>
        Ryhmätunneille ilmoittaudutaan ja yksilöpalvelut (Personal Training, InBody-mittaus) varataan puhelimitse,
        sähköpostilla tai Instagram-viestillä. {/* TODO(Amanda): varausjärjestelmä, jos sellainen otetaan käyttöön */}
        Maksutavat: [maksutavat]. Liikuntaedut, kuten ePassi, käyvät niissä palveluissa, joissa ne on mainittu.
      </p>

      <h2>4. Peruutus ja siirto</h2>
      <p>
        {/* TODO(Amanda): peruutusaika ja maksu. Alla yleinen malli. */}
        Varatun yksilöpalvelun voi perua tai siirtää maksutta viimeistään [24] tuntia ennen varattua aikaa.
        Myöhemmin perutusta tai käyttämättä jääneestä ajasta voidaan periä [osa / koko] palvelun hinnasta.
        Jos tunti joudutaan perumaan ohjaajasta johtuvasta syystä, siitä ilmoitetaan mahdollisimman pian, eikä
        perutusta tunnista veloiteta.
      </p>

      <h2>5. Osallistuminen ja terveys</h2>
      <p>
        Osallistut tunneille omalla vastuullasi ja oman kuntosi mukaan. Kerro ohjaajalle ennen tuntia, jos sinulla
        on vamma, sairaus tai muu asia, joka voi vaikuttaa liikkumiseen. Liikkeistä on aina kevyempiä vaihtoehtoja.
        Äänimalja- ja kristallimaljarentoutus sekä InBody-mittaus eivät korvaa lääkärin tai muun terveydenhuollon
        ammattilaisen arviota.
      </p>

      <h2>6. Sivuston sisältö</h2>
      <p>
        Sivuston tekstit, kuvat, logo ja kuvitukset ovat Tahkon Amandan omaisuutta, eikä niitä saa käyttää ilman
        lupaa. Sivuston tietoja päivitetään säännöllisesti, mutta aikatauluissa voi olla muutoksia: ajantasaisen
        tiedon saat aina suoraan ohjaajalta.
      </p>

      <h2>7. Ehtojen muutokset</h2>
      <p>Ehtoja voidaan päivittää. Voimassa on aina tällä sivulla näkyvä versio.</p>
    </LegalPage>
  );
}
