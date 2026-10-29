// Hero.tsx: etusivun yläosa (otsikko, esittely, painikkeet ja Tahko-kuvitus).
// Server Component: ei tilaa eikä tapahtumia, joten selaimeen ei lähetetä JS:ää.

import Image from "next/image";
import ButtonLink from "@/components/ui/ButtonLink";
import NextClassCard, { type ClassInfo } from "./NextClassCard";
import { site } from "@/lib/site";
import { withBase } from "@/lib/paths";

// Hero saa seuraavan tunnin propsina. null = ei tulevia tunteja, jolloin korttia ei näytetä.
type Props = {
  nextClass: ClassInfo | null;
};

export default function Hero({ nextClass }: Props) {
  return (
    // id="top": sivun alun ankkuri (esim. "Takaisin ylös" -linkille Footerissa).
    // overflow-hidden estää kuvitusta aiheuttamasta vaakavieritystä kapeilla näytöillä.
    // Työpöydällä Hero täyttää ensimmäisen näkymän yläpalkin (6,5 rem) alapuolelta:
    // flex-col + kuvituksen flex-1, jolloin kuvitus saa kaiken tekstin jälkeen jäävän tilan
    // ja koko Tahko-maisema näkyy heti ilman vieritystä.
    <section
      id="top"
      className="flex flex-col overflow-hidden bg-sky-soft pt-10 lg:min-h-[calc(100svh-6.5rem)] lg:pt-8"
    >
      {/* relative + z-10: tekstisisältö pysyy kuvituksen päällä,
          kun kuvitus nostetaan negatiivisella marginaalilla ylös */}
      {/* max-w-7xl: leveämpi kuin muut osiot, jolloin teksti asettuu vasemmalle ja kuvitukselle jää tilaa */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-wrap items-start justify-between gap-x-14 gap-y-10 px-6 lg:px-10">
        {/* Vasen palsta: tekstit ja painikkeet.
            basis-[460px] grow: palsta haluaa 460 px, mutta saa kasvaa. min-w-0 estää ylivuodon. */}
        <div className="flex min-w-0 grow basis-[460px] flex-col gap-4">
          <p className="font-serif text-2xl italic text-accent">{site.tagline}</p>

          {/* clamp(min, ihanteellinen, max): otsikko skaalautuu näytön leveyden mukaan
              40 px:n ja 72 px:n välillä ilman erillisiä mediakyselyitä. */}
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-none tracking-tight">
            Liikuntaa ja rentoutusta Tahkon maisemissa
          </h1>

          <p className="max-w-[600px] text-lg leading-relaxed text-ink-soft">
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

      {/* Tahko-kuvitus. -mt nostaa kuvituksen tekstin alle, jolloin taivas jää tekstin
          taakse ja vuori "nousee" sisällön alta.
          Korkeus: mobiilissa kiinteä, työpöydällä flex-1 = loput näkymän korkeudesta
          (vähintään 340 px, jotta lyhyelläkin näytöllä maisema erottuu). */}
      <div className="relative -mt-6 h-[300px] sm:-mt-16 sm:h-[380px] lg:-mt-24 lg:h-auto lg:min-h-[340px] lg:flex-1">
        <Image
          src={withBase("/tahko-hero.svg")}
          alt="" // Koriste: sisältö on jo tekstissä, joten ruudunlukija ohittaa kuvan
          fill // Täyttää kääreen koon: leveys ja korkeus tulevat kääreestä
          sizes="100vw"
          priority // Näkyy heti sivun avautuessa, joten ladataan ensimmäisenä
          unoptimized // SVG on jo vektori, joten Next.js:n kuvaoptimointia ei tarvita
          // Kuvitus on leveä (2400 × 700), ja maisema jatkuu reunoille.
          // object-cover + object-bottom: leveällä näytöllä kuva skaalataan leveyden mukaan
          // ja taivasta rajataan ylhäältä, kapealla näytöllä reunoja rajataan sivuilta.
          // Kummassakin tapauksessa vuori, rinteet, torni ja kylä pysyvät näkyvissä.
          className="object-cover object-bottom"
        />
      </div>
    </section>
  );
}