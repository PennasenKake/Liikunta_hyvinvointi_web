// NotFound.tsx: oma 404-sivu ("sivua ei löytynyt").
// Esirenderöinti tekee tästä tiedoston 404.html, jonka hosting näyttää, kun osoitetta ei ole olemassa
// (esim. tahkonamanda.fi/vesijumpa), ja palauttaa HTTP-tilakoodin 404.
// Sivu käyttää yhteistä asettelua (App.tsx), joten yläpalkki ja alatunniste näkyvät kuten muuallakin.
// 404-sivulle lisätään noindex-tagi (src/routes.tsx), jottei Google indeksoi sitä.
//
// Ulkoasu:
// - "4 ◯ 4": luvun nolla on lootusmandala. Taustalla suuri, haalea mandalakehä pyörii hitaasti.
// - Kultainen koristenauha erottaa pikalinkit, kuten alatunnisteessa.
// - Yhteydenotto sähköpostilla (Amanda ei ehdi vastata puheluihin ohjausten aikana). Viestipohjaan
//   tulee osoite, jota kävijä yritti avata, joten Amanda näkee, mikä linkki on rikki.
// Koristeet ovat aria-hidden, pyörivät vain ilman vähennetyn liikkeen asetusta ja piiloutuvat
// suuren kontrastin tilassa (.lotus-mandala, index.css).

import { useEffect, useState } from "react";
import ButtonLink from "@/components/ui/ButtonLink";
import EmailText from "@/components/ui/EmailText";
import LotusMandala from "@/components/ui/LotusMandala";
import { mailtoHref } from "@/lib/contact";
import { withBase } from "@/lib/paths";
import { site } from "@/lib/site";

// Suosituimmat kohteet: kävijä pääsee suoraan sinne, minne todennäköisesti oli menossa
const shortcuts = [
  { href: "/#kalenteri", label: "Tulevat tunnit", text: "Ilmoittaudu seuraavalle tunnille" },
  { href: "/#hinnasto", label: "Hinnasto", text: "Hinnat ja tarjouspyynnöt" },
  { href: "/#minusta", label: "Minusta", text: "Kuka olen ja miten ohjaan" },
];

function messageHref(path: string) {
  return mailtoHref(
    "Sivua ei löytynyt",
    `Hei Amanda,\n\netsin sivuiltasi tietoa, mutta päädyin sivulle, jota ei löytynyt${path ? ` (${path})` : ""}.\n\nEtsin:\n\nNimi:\n`,
  );
}

export default function NotFound() {
  // Osoite selviää vasta selaimessa (esirenderöity sivu on sama kaikille osoitteille)
  const [path, setPath] = useState("");
  useEffect(() => setPath(window.location.pathname), []);

  return (
    <main
      id="sisalto"
      tabIndex={-1}
      className="relative isolate overflow-hidden bg-linear-to-b from-sky-soft via-lilac-soft to-surface pb-10 pt-8 outline-none sm:pb-12 sm:pt-14"
    >
      {/* Taustan suuri mandalakehä: haalea, pyörii hitaasti numeron takana */}
      <div aria-hidden="true" className="lotus-mandala pointer-events-none absolute left-1/2 top-[-6rem] -z-10 w-[min(150vw,980px)] -translate-x-1/2 opacity-[0.16] sm:top-[-9rem]">
        <img src={withBase("/koristeet/mandala-ulkokeha.svg")} alt="" width={800} height={820} className="mandala-spin w-full" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-24 -z-10 size-[32rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(221_212_244/0.85),rgb(221_212_244/0))]" />

      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
        {/* 404, jossa nolla on mandala. Ruudunlukija lukee tekstin "Virhe 404". */}
        <p className="sr-only">Virhe 404</p>
        <div aria-hidden="true" className="flex items-center justify-center font-serif text-[clamp(6rem,22vw,11rem)] font-semibold leading-none sm:gap-3">
          <span className="bg-linear-to-b from-royal to-accent bg-clip-text text-transparent">4</span>
          <span className="relative isolate -mx-[0.04em] inline-block aspect-[800/820] w-[1.2em] translate-y-[0.03em]">
            <LotusMandala className="inset-0 w-full" />
          </span>
          <span className="bg-linear-to-b from-royal to-accent bg-clip-text text-transparent">4</span>
        </div>

        <h1 className="mt-4 font-serif text-[clamp(2.2rem,6vw,3.6rem)] font-semibold leading-tight tracking-tight text-ink">
          Taisit eksyä polulta
        </h1>

        <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
          Etsimääsi sivua ei löytynyt. Osoitteessa voi olla kirjoitusvirhe, tai sivu on siirtynyt.
          Hengitä syvään, ja palataan yhdessä oikealle polulle.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
          <ButtonLink href="/">Etusivulle</ButtonLink>
          <ButtonLink href="/#palvelut" variant="secondary">
            Katso palvelut
          </ButtonLink>
        </div>

        {/* Kultainen koristenauha, sama kuin alatunnisteen mandalan reunoilla */}
        <img
          src={withBase("/koristeet/koriste-vaaka.svg")}
          alt=""
          aria-hidden="true"
          width={1600}
          height={120}
          className="lotus-mandala mt-10 h-auto w-full max-w-md opacity-80"
        />

        {/* Pikalinkit kortteina: koko kortti on linkki, kosketusalue on suuri */}
        <nav aria-label="Pikalinkit" className="mt-6 w-full">
          <ul className="grid gap-3 sm:grid-cols-3">
            {shortcuts.map((s) => (
              <li key={s.href}>
                <a
                  href={withBase(s.href)}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white/75 px-4 py-4 text-left backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_10px_30px_-12px_rgb(78_49_146/0.35)] sm:text-center"
                >
                  <span className="font-semibold text-accent">
                    <span aria-hidden="true" className="mr-1.5 text-[13px] text-border transition group-hover:text-accent">✦</span>
                    {s.label}
                  </span>
                  <span className="mt-1 text-[14px] leading-snug text-muted">{s.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Yhteydenotto: viestipohja, jossa on mukana rikkinäinen osoite */}
        <section aria-labelledby="eksyit-otsikko" className="mt-8 w-full rounded-3xl bg-linear-to-r from-royal to-accent px-6 py-7 text-white shadow-[0_18px_40px_-20px_rgb(26_68_174/0.6)] sm:px-10">
          <h2 id="eksyit-otsikko" className="font-serif text-2xl font-semibold">
            Etkö löydä etsimääsi?
          </h2>
          <p className="mx-auto mt-2 max-w-sm leading-relaxed text-sky">
            Lähetä viesti, niin vastaan pian. Viestissä on valmiina osoite, jota yritit avata.
          </p>
          <a
            href={messageHref(path)}
            className="mt-5 inline-flex min-h-11 items-center rounded-md bg-white px-6 py-3 font-semibold text-accent transition hover:bg-lilac"
          >
            Lähetä viesti
          </a>
          <p className="mt-4 text-[15px] text-sky">
            tai kirjoita osoitteeseen{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-white underline underline-offset-4 hover:no-underline">
              <EmailText email={site.email} />
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
