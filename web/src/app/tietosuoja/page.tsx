// tietosuoja/page.tsx: tietosuojaseloste (reitti "/tietosuoja").
// Kansion nimi määrää URL-osoitteen: app/tietosuoja/page.tsx → tahkonamanda.fi/tietosuoja.
//
// PAIKKAMERKKI: varsinainen seloste kirjoitetaan viimeistelyvaiheessa (vaihe 9),
// kun tiedetään, mitä tietoja sivusto käsittelee (yhteydenotot, analytiikka, Instagram-upotus).

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tietosuojaseloste – Tahkon Amanda",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="mb-6 font-serif text-5xl font-semibold">Tietosuojaseloste</h1>
      <p className="text-lg leading-relaxed text-ink-soft">
        [Tietosuojaseloste lisätään ennen sivuston julkaisua.]
      </p>
    </main>
  );
}
