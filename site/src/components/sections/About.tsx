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
      {/* flex-wrap-reverse: kapealla näytöllä kuva nousee tekstin yläpuolelle */}
      <div className="mx-auto flex max-w-5xl flex-wrap-reverse items-center gap-14">
        <div data-reveal className="min-w-0 grow basis-96">
          <SectionHeading eyebrow="Minusta" title={about.heading} />
          <div className="-mt-4 flex flex-col gap-5">
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

        {/* Kuva tai paikkamerkki. Molemmilla sama koko (h-[520px] → mobiilissa matalampi). */}
        <div data-reveal className="min-w-0 grow basis-72">
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
      </div>
    </section>
  );
}
