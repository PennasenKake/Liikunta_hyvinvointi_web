// not-found.tsx: oma 404-sivu ("sivua ei löytynyt").
// Esirenderöinti tekee tästä tiedoston 404.html, jonka hosting näyttää, kun osoitetta ei ole olemassa
// (esim. tahkonamanda.fi/vesijumpa), ja palauttaa HTTP-tilakoodin 404.
// Sivu käyttää yhteistä asettelua (App.tsx), joten Header näkyy kuten muuallakin.
// 404-sivulle lisätään noindex-tagi (src/routes.ts), jottei Google indeksoi sitä.

import ButtonLink from "@/components/ui/ButtonLink";
import { site } from "@/lib/site";


export default function NotFound() {
  return (
    // Vaaleansininen tausta, ja alatunnisteen Tahko-piirros näkyy heti alla:
    // kävijä tunnistaa olevansa yhä oikealla sivustolla.
    <main id="sisalto" tabIndex={-1} className="overflow-hidden bg-sky-soft py-20 outline-none">
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

    </main>
  );
}
