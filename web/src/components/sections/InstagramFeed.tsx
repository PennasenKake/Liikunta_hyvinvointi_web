// InstagramFeed.tsx: Instagram-julkaisut.
// NYT: kuusi paikkamerkkiruutua vaakaan vieritettävänä.
// MYÖHEMMIN (vaihe 8): Behold-palvelun syöte, joka päivittää julkaisut automaattisesti.

import SectionHeading from "@/components/ui/SectionHeading";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { site } from "@/lib/site";

export default function InstagramFeed() {
  const { handle, url } = site.instagram;

  return (
    <section id="instagram" className="bg-surface px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Instagramissa" title={`@${handle}`} />
          {/* Linkki näytetään vasta, kun oikea osoite on lisätty site.ts:ään */}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-10 inline-flex min-h-11 items-center rounded-md border border-border bg-white px-5 font-semibold transition hover:border-accent"
            >
              Seuraa Instagramissa
            </a>
          )}
        </div>

        {/* Vaakavieritys: scroll-snap pysäyttää vierityksen aina ruudun alkuun.
            Kosketusnäytöllä pyyhkäistään, työpöydällä vieritetään vaakasuunnassa. */}
        <ul
          aria-label="Instagram-julkaisut"
          className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-3"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <li key={n} className="w-[min(260px,70vw)] shrink-0 snap-start">
              <PlaceholderImage label={`Instagram-julkaisu ${n}`} className="aspect-4/5 rounded-xl" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
