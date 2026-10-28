// Pricing.tsx: hinnasto.
// Hinnat tulevat tiedostosta lib/pricing.ts. Rivien välissä on pisteviiva,
// joka ohjaa silmän palvelun nimestä sen hintaan (perinteinen hinnaston tyyli).

import SectionHeading from "@/components/ui/SectionHeading";
import { prices, pricingNote } from "@/lib/pricing";

export default function Pricing() {
  return (
    <section id="hinnasto" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading title="Hinnasto" intro={pricingNote} align="center" />

        {/* <dl> eli kuvauslista on semanttisesti oikea nimi–arvo-pareille (palvelu–hinta) */}
        <dl>
          {prices.map((p) => (
            <div key={p.name} className="flex items-baseline gap-4 border-b border-line py-5">
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
      </div>
    </section>
  );
}
