// not-found.tsx: oma 404-sivu ("sivua ei löytynyt").
// Next.js näyttää tämän automaattisesti, kun osoitetta ei ole olemassa
// (esim. tahkonamanda.fi/vesijumpa), ja palauttaa HTTP-tilakoodin 404.
// Sivu käyttää juuriasettelua (layout.tsx), joten Header näkyy kuten muuallakin.
// Next.js lisää 404-sivulle automaattisesti noindex-tagin, jottei Google indeksoi sitä.

import type { Metadata } from "next";
import Image from "next/image";
import ButtonLink from "@/components/ui/ButtonLink";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sivua ei löytynyt – Tahkon Amanda",
  description: "Etsimääsi sivua ei löytynyt. Palaa etusivulle tai tutustu palveluihin.",
};

export default function NotFound() {
  return (
    // Sama vaaleansininen tausta ja Tahko-kuvitus kuin herossa:
    // kävijä tunnistaa olevansa yhä oikealla sivustolla.
    // min-h: sivu täyttää näytön headerin (n. 6,5 rem) alapuolelta.
    // svh = pienin näkymän korkeus, joka ei hypi mobiiliselaimen osoitepalkin mukana.
    // flex-col + kuvituksen mt-auto: kuvitus asettuu aina sivun alareunaan.
    <main className="flex min-h-[calc(100svh-6.5rem)] flex-col overflow-hidden bg-sky-soft pt-20">
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 text-center">
        {/* Virhekoodi pienenä yläotsikkona: tieto on mukana, mutta ei hallitse sivua */}
        <p className="font-serif text-2xl italic text-accent">404</p>

        <h1 className="font-serif text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-none tracking-tight">
          Taisit eksyä polulta
        </h1>

        <p className="max-w-md text-lg leading-relaxed text-ink-soft">
          Etsimääsi sivua ei löytynyt. Osoitteessa voi olla kirjoitusvirhe, tai sivu on siirtynyt.
        </p>

        {/* Kolme selkeää reittiä eteenpäin: etusivu, palvelut tai suora yhteydenotto */}
        <div className="flex flex-wrap justify-center gap-3.5">
          <ButtonLink href="/">Etusivulle</ButtonLink>
          <ButtonLink href="/#liikunta" variant="secondary">
            Katso palvelut
          </ButtonLink>
        </div>

        <p className="text-[15px] text-muted">
          Voit myös soittaa:{" "}
          <a href={site.phoneHref} className="font-semibold text-accent underline-offset-4 hover:underline">
            {site.phone}
          </a>
        </p>
      </div>

      {/* Sama kuvitus kuin etusivulla, matalampana. Koriste, joten alt on tyhjä.
          mt-auto työntää kuvan alas, ja vähintään 12 (3 rem) väli pitää sen erillään tekstistä. */}
      <Image
        src="/tahko-hero.svg"
        alt=""
        width={2400}
        height={700}
        unoptimized
        className="mt-auto block h-[clamp(220px,30vw,380px)] w-full object-cover object-bottom pt-12"
      />
    </main>
  );
}
