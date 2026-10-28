// Hero.tsx: etusivun yläosa (otsikko, esittely, painikkeet ja Tahko-kuvitus).
// Server Component: ei tilaa eikä tapahtumia, joten selaimeen ei lähetetä JS:ää.

import Image from "next/image";
import ButtonLink from "@/components/ui/ButtonLink";
import NextClassCard, { type ClassInfo } from "./NextClassCard";
import { site } from "@/lib/site";

// Hero saa seuraavan tunnin propsina. null = ei tulevia tunteja, jolloin korttia ei näytetä.
type Props = {
  nextClass: ClassInfo | null;
};

export default function Hero({ nextClass }: Props) {
  return (
    // id="top": sivun alun ankkuri (esim. "Takaisin ylös" -linkille Footerissa).
    // overflow-hidden estää kuvitusta aiheuttamasta vaakavieritystä kapeilla näytöillä.
    <section id="top" className="overflow-hidden bg-sky-soft pt-16">
      {/* relative + z-10: tekstisisältö pysyy kuvituksen päällä,
          kun kuvitus nostetaan negatiivisella marginaalilla ylös */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-x-14 gap-y-10 px-6">
        {/* Vasen palsta: tekstit ja painikkeet.
            basis-[460px] grow: palsta haluaa 460 px, mutta saa kasvaa. min-w-0 estää ylivuodon. */}
        <div className="flex min-w-0 grow basis-[460px] flex-col gap-6">
          <p className="font-serif text-2xl italic text-accent">{site.tagline}</p>

          {/* clamp(min, ihanteellinen, max): otsikko skaalautuu näytön leveyden mukaan
              42 px:n ja 80 px:n välillä ilman erillisiä mediakyselyitä. */}
          <h1 className="font-serif text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-none tracking-tight">
            Liikuntaa ja rentoutusta Tahkon maisemissa
          </h1>

          <p className="max-w-[540px] text-lg leading-relaxed text-ink-soft">
            Olen Amanda. Ohjaan ryhmäliikuntaa, personal trainingia ja rauhoittavia
            hyvinvointihetkiä Tahkolla, Siilinjärvellä, Kuopiossa ja Rautavaaralla.
          </p>

          <div className="flex flex-wrap gap-3.5">
            <ButtonLink href="#kalenteri">Katso tulevat tunnit</ButtonLink>
            <ButtonLink href={site.phoneHref} variant="secondary">
              Soita {site.phone}
            </ButtonLink>
          </div>
        </div>

        {/* Ehdollinen renderöinti: kortti näytetään vain, jos tuleva tunti on olemassa */}
        {nextClass && <NextClassCard {...nextClass} />}
      </div>

      {/* Tahko-kuvitus. -mt nostaa kuvituksen tekstin alle, jolloin vuori
          "nousee" sisällön taakse. Isommilla näytöillä nostetaan enemmän. */}
      <Image
        src="/tahko-hero.svg"
        alt="" // Koriste: sisältö on jo tekstissä, joten ruudunlukija ohittaa kuvan
        width={1440}
        height={700}
        priority // Näkyy heti sivun avautuessa, joten ladataan ensimmäisenä
        unoptimized // SVG on jo vektori, joten Next.js:n kuvaoptimointia ei tarvita
        // object-cover + object-bottom: kapeilla näytöillä rajataan taivasta pois,
        // jolloin vuori, järvi ja kylä pysyvät näkyvissä.
        // Maksimikorkeus 460 px, jotta pikalinkit näkyvät työpöydällä ilman vieritystä
        className="-mt-6 block h-[clamp(280px,34vw,460px)] w-full object-cover object-bottom sm:-mt-20 lg:-mt-28"
      />
    </section>
  );
}