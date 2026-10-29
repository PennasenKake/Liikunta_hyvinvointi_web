// LegalPage.tsx: lakisivujen yhteinen runko (käyttöehdot, tietosuoja, evästeet, saavutettavuus).
// Otsikko, päivityspäivä ja tekstisisältö samalla tyylillä joka sivulla.
// Tekstin tyylit annetaan kerralla kääreelle ([&_h2]: jne.), joten sivuilla voi käyttää
// tavallista HTML:ää (h2, p, ul, li, a) ilman toistuvia luokkia.

import Link from "next/link";

type Props = {
  eyebrow: string;  // Pieni yläotsikko, esim. "Ehdot"
  title: string;    // Sivun pääotsikko (h1)
  updated: string;  // Päivityspäivä näkyvänä tekstinä, esim. "29.10.2026"
  children: React.ReactNode;
};

export default function LegalPage({ eyebrow, title, updated, children }: Props) {
  return (
    <main className="bg-surface px-6 pb-24 pt-14">
      <article className="mx-auto max-w-3xl">
        <p className="font-serif text-2xl italic text-accent">{eyebrow}</p>
        <h1 className="mt-2 font-serif text-[clamp(2.5rem,6vw,3.5rem)] font-semibold leading-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted">Päivitetty {updated}</p>

        {/* Leipätekstin tyylit: otsikot, kappaleet, listat ja linkit */}
        <div
          className="mt-10 text-[17px] leading-relaxed text-ink-soft
            [&_a]:font-semibold [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4
            [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-[28px] [&_h2]:font-semibold [&_h2]:text-ink
            [&_li]:mt-1.5 [&_p+p]:mt-4 [&_strong]:text-ink
            [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6"
        >
          {children}
        </div>

        <p className="mt-14 border-t border-line pt-6">
          <Link href="/" className="font-semibold text-accent underline-offset-4 hover:underline">
            ← Takaisin etusivulle
          </Link>
        </p>
      </article>
    </main>
  );
}
