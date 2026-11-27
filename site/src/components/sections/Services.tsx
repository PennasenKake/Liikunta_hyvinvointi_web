// Services.tsx: etusivun Palvelut-osio: kolme korttia, jotka vievät palvelujen omille sivuille
// (Liikunta, Hyvinvointi, Valmennus). Kaikki tekstit tulevat services.ts:stä.
//
// Kortit pitävät etusivun lyhyenä: yksityiskohdat, tasojako ja "Sopii"-tekstit ovat omilla sivuillaan
// (pages/palvelusivu.tsx), joissa Amandan teksteille ja kuville on tilaa.
// Koko kortti on yksi linkki, joten kosketusalue on suuri ja näppäimistöllä yksi Tab-pysähdys.

import Link from "@/components/ui/Link";
import { serviceCategories } from "@/lib/services";

// Kortin sävy osan mukaan: sama värikoodi kuin palvelusivuilla
export const categoryTones = {
  liikunta: { box: "bg-lilac-soft", icon: "bg-lilac text-accent", link: "text-accent" },
  hyvinvointi: { box: "bg-sky-soft", icon: "bg-sky text-sky-ink", link: "text-sky-ink" },
  valmennus: { box: "bg-sand", icon: "bg-sand text-accent", link: "text-accent" },
} as const;

export default function Services() {
  return (
    <section id="palvelut" aria-labelledby="palvelut-otsikko" className="bg-white px-6 pb-24 pt-24">
      <div className="mx-auto max-w-6xl">
        <h2 id="palvelut-otsikko" data-reveal className="mb-2.5 font-serif text-[clamp(2.5rem,6vw,3.5rem)] font-semibold leading-tight">
          Palvelut
        </h2>
        <p className="mb-10 max-w-md text-[17px] leading-relaxed text-muted">
          Tunteja eri kuntotasoille. Kysy rohkeasti, jos et tiedä mistä aloittaa.
        </p>

        {/* Puhelimessa kortit allekkain, tabletilla ja työpöydällä kolme rinnakkain */}
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
          {serviceCategories.map((cat) => {
            const tone = categoryTones[cat.id];
            // Kortin palvelulista: neljä ensimmäistä, loput "…"-merkillä
            const names = cat.services.map((s) => s.title);
            const preview = names.length > 4 ? `${names.slice(0, 4).join(", ")}…` : names.join(", ");
            return (
              <li key={cat.id} id={cat.id} data-reveal className="scroll-mt-28">
                <Link
                  href={cat.path}
                  className={`group flex h-full min-h-72 flex-col gap-3 rounded-3xl p-7 transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-16px_rgba(34,29,74,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transition-none lg:p-8 ${tone.box}`}
                >
                  <h3 className="font-serif text-[40px] font-bold leading-none">{cat.label}</h3>
                  <p className="text-[17px] leading-relaxed text-ink-soft">{cat.card}</p>
                  <p className="text-[15px] text-muted">{preview}</p>
                  <span className={`mt-auto pt-2 font-semibold ${tone.link}`}>
                    {cat.cardLink}{" "}
                    <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1 motion-reduce:transition-none">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
