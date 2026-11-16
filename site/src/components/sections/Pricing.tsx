// Pricing.tsx: hinnasto.
// Hinnat tulevat tiedostosta lib/pricing.ts. Rivien välissä on pisteviiva,
// joka ohjaa silmän palvelun nimestä sen hintaan (perinteinen hinnaston tyyli).

import SectionHeading from "@/components/ui/SectionHeading";
import { prices, pricingNote } from "@/lib/pricing";
import LotusMandala from "@/components/ui/LotusMandala";
import { quoteHref } from "@/lib/contact";
import { site } from "@/lib/site";
import EmailText from "@/components/ui/EmailText";

export default function Pricing() {
  return (
    // relative isolate overflow-hidden: mandalat asettuvat osion taakse ja leikkautuvat sen reunoihin
    <section id="hinnasto" className="relative isolate overflow-hidden bg-white px-6 py-24">
      {/* Lootusmandalat puoliksi reunojen yli, tekstipalstan ulkopuolella (kontrasti pysyy samana).
          Työpöydällä (lg) kaksi sivuilla, puhelimessa ja tabletilla yksi pieni vasemmassa yläkulmassa. */}
      <LotusMandala className="-left-28 -top-20 w-56 opacity-40 lg:-left-[290px] lg:top-20 lg:w-[440px] xl:-left-[270px] xl:top-16 xl:w-[580px] xl:opacity-45" />
      <LotusMandala className="hidden opacity-40 lg:-right-[250px] lg:bottom-10 lg:block lg:w-[380px] xl:-right-[230px] xl:w-[500px] xl:opacity-45" />
      <div className="mx-auto max-w-3xl">
        <SectionHeading title="Hinnasto" intro={pricingNote} align="center" />

        {/* <dl> eli kuvauslista on semanttisesti oikea nimi–arvo-pareille (palvelu–hinta) */}
        <dl>
          {prices.map((p) => (
            <div key={p.name} data-reveal className="flex items-baseline gap-4 border-b border-line py-5">
              <dt className="min-w-0 shrink">
                <span className="block text-[19px] font-semibold">{p.name}</span>
                <span className="mt-1 block text-[15px] text-muted">{p.detail}</span>
              </dt>
              {/* Pisteviiva täyttää välin. Koriste, joten ruudunlukija ohittaa sen.
                  -translate-y-1.5 nostaa viivan tekstin perusviivan tasolle. */}
              <span aria-hidden="true" className="min-w-8 grow -translate-y-1.5 border-b-2 border-dotted border-border" />
              {/* whitespace-nowrap: hinta ei rivity kahdelle riville */}
              <dd className="whitespace-nowrap font-serif text-[30px] font-bold text-accent">{p.price}</dd>
            </div>
          ))}
        </dl>

        {/* Kysy tarjous: valmis sähköpostipohja (kuten Amandan vanhalla sivulla).
            Osoite myös tekstinä, jos painike ei avaa sähköpostiohjelmaa. */}
        <div data-reveal className="mt-12 rounded-2xl border border-border bg-lilac-soft/70 px-6 py-8 text-center sm:px-10">
          <h3 className="font-serif text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-tight">Kysy tarjous</h3>
          <p className="mx-auto mt-2 max-w-[48ch] text-[17px] leading-relaxed text-ink-soft">
            Yritykselle, ryhmälle tai omaan tapahtumaan. Kerro toiveesi, niin vastaan sähköpostilla ohjausten välissä.
          </p>
          <a
            href={quoteHref}
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-[17px] font-semibold text-white shadow-[0_10px_24px_rgba(78,49,146,0.25)] transition hover:opacity-90"
          >
            Pyydä tarjous sähköpostilla <span aria-hidden="true">→</span>
          </a>
          <p className="mt-4 text-[15px] text-muted">
            tai kirjoita osoitteeseen{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-accent underline-offset-4 hover:underline"><EmailText email={site.email} /></a>
          </p>
        </div>
      </div>
    </section>
  );
}
