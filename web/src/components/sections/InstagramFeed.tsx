// InstagramFeed.tsx: Instagram-julkaisut.
// NYT: Amandan omia kuvia (lib/photos.ts) vaakaan vieritettävänä.
// MYÖHEMMIN (vaihe 8): Behold-palvelun syöte, joka päivittää julkaisut automaattisesti.

import SectionHeading from "@/components/ui/SectionHeading";
import Image from "next/image";
import { instagramPreview } from "@/lib/photos";
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
            Kosketusnäytöllä pyyhkäistään, työpöydällä vieritetään vaakasuunnassa.

            Saavutettavuus (WCAG 2.1.1 Näppäimistö): vieritettävän alueen pitää olla
            myös näppäimistöllä käytettävissä.
            - tabIndex={0}: Tab-näppäin pysähtyy alueeseen, ja nuolinäppäimet vierittävät sitä
            - role="region" + aria-label: ruudunlukija kertoo, mihin fokus siirtyi
            - focus-visible: näkyvä fokusrengas vain näppäimistökäytössä, ei hiirellä klikatessa */}
        <div
          role="region"
          aria-label="Instagram-julkaisut, vieritä vaakasuunnassa"
          tabIndex={0}
          className="overflow-x-auto rounded-xl pb-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <ul className="flex snap-x snap-mandatory gap-3.5">
            {instagramPreview.map((photo) => (
              <li key={photo.src} className="w-[min(260px,70vw)] shrink-0 snap-start">
                {/* aspect-4/5: Instagramin pystykuvasuhde. Kuva rajataan siihen (object-cover). */}
                <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-lilac">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="260px" // ruudun leveys on aina enintään 260 px
                    className="object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
