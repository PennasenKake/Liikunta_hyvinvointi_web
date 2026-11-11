// HeroB.tsx: hero-versio B ("Liikunta & hyvinvointi").
// Vaalea tausta, teksti vasemmalla. Oikealla kahvakuulat ja järvimaiseman äänimalja,
// jotka sulautuvat toisiinsa liukuvasti. Häivytys tehdään CSS-maskilla (mask-image):
// kuvan reuna muuttuu läpinäkyväksi, jolloin alla oleva tausta tai toinen kuva näkyy läpi.

import Image from "@/components/ui/Image";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";
import { withBase } from "@/lib/paths";

// Maskit: kahvakuulat häivytetään molemmista reunoista, äänimalja vain vasemmasta.
const fadeBoth = "[mask-image:linear-gradient(to_right,transparent_0,#000_25%,#000_65%,transparent_100%)]";
const fadeLeft = "[mask-image:linear-gradient(to_right,transparent_0,#000_80px)]";

export default function HeroB() {
  return (
    <section id="top" aria-label="Esittely" className="flex flex-wrap overflow-hidden bg-sky-soft lg:min-h-[calc(100svh-6.5rem)]">
      {/* Tekstipalsta: oma vaalea alueensa, ei kuvien päällä */}
      <div className="relative z-10 flex min-w-0 grow basis-[420px] flex-col justify-center gap-6 px-6 py-14 lg:px-[5vw]">
        <p className="text-[13px] uppercase tracking-[0.16em] text-sky-ink">{site.areas.join(" · ")}</p>
        <h1 className="font-serif font-semibold leading-[0.92]">
          <span className="block text-[clamp(3.75rem,7vw,6.25rem)] text-accent">Liikunta</span>
          <span className="block text-[clamp(2.6rem,5vw,4.1rem)] font-medium italic">&amp; hyvinvointi</span>
        </h1>
        <p className="max-w-[460px] text-lg leading-relaxed text-ink-soft">
          Ryhmäliikuntaa ja personal trainingia, ja treenin vastapainoksi äänimaljojen rauhoittavaa sointia.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href={withBase("/#liikunta")} className="inline-flex min-h-11 items-center rounded-md bg-accent px-6 font-semibold text-white transition hover:opacity-90">
            Liikuntapalvelut
          </a>
          <a href={withBase("/#hyvinvointi")} className="inline-flex min-h-11 items-center rounded-md border-[1.5px] border-accent bg-white px-6 font-semibold text-accent transition hover:bg-lilac-soft">
            Hyvinvointipalvelut
          </a>
        </div>
      </div>

      {/* Kuvapalsta: kuvat päällekkäin. Äänimalja oikealla, kahvakuulat sen päällä vasemmalla. */}
      <div className="relative min-h-[380px] min-w-0 grow-[1.3] basis-[480px]">
        <div className={`absolute inset-y-0 right-0 w-[58%] ${fadeLeft}`}>
          <Image src={photos.aanimaljatJarvi.src} srcSet={photos.aanimaljatJarvi.srcSet} alt={photos.aanimaljatJarvi.alt} fill priority sizes="35vw" className="object-cover object-[0%_55%]" />
        </div>
        <div className={`absolute inset-y-0 left-0 w-1/2 ${fadeBoth}`}>
          <Image src={photos.kahvakuulat.src} srcSet={photos.kahvakuulat.srcSet} alt={photos.kahvakuulat.alt} fill priority sizes="30vw" className="object-cover object-[50%_70%]" />
        </div>
      </div>
    </section>
  );
}
