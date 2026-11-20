// About.tsx: Minusta-osio.
// Sisältö tulee tiedostosta lib/about.ts. Jos valokuvaa ei vielä ole,
// näytetään paikkamerkki samankokoisena, jotta asettelu ei muutu kuvan tullessa.

import LotusMandala from "@/components/ui/LotusMandala";
import Image from "@/components/ui/Image";
import SectionHeading from "@/components/ui/SectionHeading";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { about } from "@/lib/about";
import { withBase } from "@/lib/paths";

export default function About() {
  return (
    // relative isolate overflow-hidden: lootusmandala osion taakse, leikkautuu reunoihin
    <section id="minusta" className="relative isolate overflow-hidden bg-lilac-soft px-6 py-24">
      {/* Lootusmandala vasemmassa alakulmassa puoliksi reunan yli (puhelimessa pieni yläkulmassa) */}
      <LotusMandala className="-right-20 -top-14 w-48 opacity-35 lg:-left-[240px] lg:bottom-0 lg:right-auto lg:top-auto lg:w-[480px] lg:opacity-40" />
      {/* Ruudukko: puhelimessa ja tabletilla otsikko → kuva → teksti allekkain (otsikko kertoo heti,
          kenen kuva on). Työpöydällä (lg) otsikko ja teksti vasemmalla, kuva oikealla koko korkeudelta. */}
      <div className="mx-auto grid max-w-5xl items-center gap-x-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <SectionHeading eyebrow="Minusta" title={about.heading} />
        </div>

        {/* Kuva tai paikkamerkki. Molemmilla sama koko (h-[520px] → mobiilissa matalampi).
            Tabletilla max-w-md estää koko leveyden jättikuvan. */}
        <div data-reveal className="mx-auto mb-10 w-full min-w-0 max-w-md lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:mb-0 lg:max-w-none">
          {about.photo ? (
            <Image
              src={withBase(about.photo.src)}
              alt={about.photo.alt}
              width={640}
              height={800}
              // sizes kertoo selaimelle kuvan näyttöleveyden, jotta se lataa sopivan koon
              sizes="(min-width: 1024px) 420px, 100vw"
              className="h-96 w-full rounded-xl object-cover sm:h-[520px]"
            />
          ) : (
            <PlaceholderImage label="Kuva Amandasta" className="h-96 rounded-xl sm:h-[520px]" />
          )}
        </div>

        <div data-reveal className="min-w-0 lg:col-start-1 lg:row-start-2 lg:self-start">
          <div className="-mt-4 flex flex-col gap-5 max-lg:mt-0">
            {about.paragraphs.map((text) => (
              <p key={text} className="text-lg leading-relaxed text-ink-soft">{text}</p>
            ))}
          </div>

          {/* Koulutukset "tageina" */}
          <ul aria-label="Koulutukset ja sertifikaatit" className="mt-7 flex flex-wrap gap-2">
            {about.certifications.map((c) => (
              <li key={c} className="rounded-md bg-white px-3.5 py-2 text-[15px] font-medium">{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
