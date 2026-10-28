// WhyMove.tsx: "Miksi liikkua, ja miksi myös levätä?" -osio.
// Kertoo, miksi liikunta ja palautuminen ovat tärkeitä hyvinvoinnille (suunnitelman kohta 7).

import SectionHeading from "@/components/ui/SectionHeading";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

// Neljä hyötyä. Data komponentin yläpuolella, jotta tekstejä on helppo muokata.
const benefits = [
  { title: "Mieli", text: "Liikunta purkaa stressiä ja kohentaa mielialaa, usein jo saman päivän aikana." },
  { title: "Uni", text: "Liikkuva päivä syventää unta, ja hyvin nukuttu yö palauttaa kehon ja mielen." },
  { title: "Keho", text: "Lihaskunto, liikkuvuus ja tasapaino pitävät arjen kevyenä ja ehkäisevät kipuja." },
  { title: "Lepo", text: "Rentoutus ja venyttely auttavat palautumaan, jolloin treenistä on enemmän hyötyä." },
];

export default function WhyMove() {
  return (
    <section id="miksi-liikkua" aria-labelledby="miksi-liikkua-otsikko" className="bg-sky px-6 py-24">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        {/* Kuva ja teksti vierekkäin, kapealla näytöllä allekkain (flex-wrap) */}
        <div className="flex flex-wrap items-center gap-8 rounded-2xl bg-white p-5 sm:gap-10">
          {/* TODO(Amanda): kuva rentoutustunnilta */}
          <PlaceholderImage
            label="Kuva: äänimaljat tai rentoutustunti"
            className="h-64 min-w-0 grow basis-72 rounded-xl sm:h-80"
          />
          <div className="min-w-0 grow basis-80 sm:pr-4">
            <SectionHeading
              id="miksi-liikkua-otsikko"
              eyebrow="Liikunta & hyvinvointi"
              title="Miksi liikkua, ja miksi myös levätä?"
              intro="Hyvä olo syntyy kahdesta asiasta: liikkeestä ja palautumisesta. Siksi tunneillani hikoillaan, mutta myös pysähdytään."
            />
          </div>
        </div>

        {/* Hyötykortit: 1 sarake mobiilissa, 2 tabletilla, 4 työpöydällä.
            gap-px + taustaväri luo ohuet erotinviivat korttien väliin. */}
        <ul className="grid overflow-hidden rounded-2xl bg-[#b9d2ee] gap-px sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <li key={b.title} className="flex flex-col gap-2.5 bg-sky-soft p-7">
              <h3 className="font-serif text-[26px] font-bold">{b.title}</h3>
              <p className="leading-relaxed text-ink-soft">{b.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
