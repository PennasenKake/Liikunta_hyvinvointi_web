// HeroA.tsx: hero-versio A ("Liiku & rauhoitu").
// Kaksi kuvaa vierekkäin (ulkotreeni ja äänimaljat) ja niiden päällä läpikuultava
// tumma tekstilaatikko. Mobiilissa kuvat ovat ylhäällä ja laatikko niiden alla.

import Image from "@/components/ui/Image";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";
import { withBase } from "@/lib/paths";

export default function HeroA() {
  return (
    <section id="top" aria-label="Esittely" className="relative overflow-hidden bg-ink text-white lg:min-h-[calc(100svh-6.5rem)]">
      {/* Kuvat: mobiilissa kiinteä korkeus, työpöydällä koko heron korkeus */}
      <div className="flex h-[340px] gap-1 lg:absolute lg:inset-0 lg:h-auto">
        <div className="relative min-w-0 flex-[1.5]">
          <Image src={photos.sekuntikello.src} srcSet={photos.sekuntikello.srcSet} alt={photos.sekuntikello.alt} fill priority sizes="60vw" className="object-cover object-[70%_40%]" />
        </div>
        <div className="relative min-w-0 flex-1">
          <Image src={photos.aanimaljat.src} srcSet={photos.aanimaljat.srcSet} alt={photos.aanimaljat.alt} fill priority sizes="40vw" className="object-cover" />
        </div>
      </div>

      {/* Tekstilaatikko: mobiilissa kuvien alla, työpöydällä kuvien päällä vasemmalla.
          Läpikuultava tausta + blur pitää tekstin luettavana kuvan päälläkin. */}
      <div className="relative mx-auto flex max-w-7xl px-4 py-8 lg:min-h-[calc(100svh-6.5rem)] lg:items-center lg:px-10 lg:py-12">
        <div className="flex w-full max-w-[480px] flex-col gap-6 bg-ink/80 p-8 backdrop-blur-sm sm:p-11">
          <p className="text-[13px] uppercase tracking-[0.16em] text-sky">{site.areas.join(" · ")}</p>
          <h1 className="font-serif font-semibold leading-[0.92]">
            <span className="block text-[clamp(4rem,7vw,6.25rem)] text-[#a9c8ee]">Liiku</span>
            <span className="block text-[clamp(2.9rem,5vw,4.6rem)] font-medium italic">&amp; rauhoitu</span>
          </h1>
          <p className="text-lg leading-relaxed text-lilac-soft">
            Ryhmäliikuntaa ja personal trainingia, ja treenin vastapainoksi äänimaljojen rauhoittavaa sointia.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={withBase("/#liikunta")} className="inline-flex min-h-11 items-center rounded-md bg-white px-6 font-semibold text-accent transition hover:bg-lilac">
              Liikuntapalvelut
            </a>
            <a href={withBase("/#hyvinvointi")} className="inline-flex min-h-11 items-center rounded-md border-[1.5px] border-white/80 px-6 font-semibold transition hover:bg-white/10">
              Äänimaljarentoutus
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
