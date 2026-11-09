// WhyMove.tsx: "Miksi liikkua, ja miksi myös levätä?" -osio.
// Kertoo, miksi liikunta ja palautuminen ovat tärkeitä hyvinvoinnille (suunnitelman kohta 7).
//
// Rakenne: otsikko ja johdanto, kuvakaruselli (sama tyyli kuin Instagram-osiossa)
// ja neljä hyötykorttia. Karuselli näyttää tunneilta ja tiloista useamman kuvan
// ilman, että osio venyy pitkäksi: kävijä selaa kuvia sivuttain.

import SectionHeading from "@/components/ui/SectionHeading";
import InstagramCarousel from "./InstagramCarousel";
import { galleryPosts } from "@/lib/gallery";

// Neljä hyötyä. Data komponentin yläpuolella, jotta tekstejä on helppo muokata.
const benefits = [
  { title: "Mieli", text: "Liikunta purkaa stressiä ja kohentaa mielialaa, usein jo saman päivän aikana." },
  { title: "Uni", text: "Liikkuva päivä syventää unta, ja hyvin nukuttu yö palauttaa kehon ja mielen." },
  { title: "Keho", text: "Lihaskunto, liikkuvuus ja tasapaino pitävät arjen kevyenä ja ehkäisevät kipuja." },
  { title: "Lepo", text: "Rentoutus ja venyttely auttavat palautumaan, jolloin treenistä on enemmän hyötyä." },
];

// Ruudunlukijan tekstit galleriakarusellille
const galleryLabels = {
  list: "Kuvia tunneilta, vieritä sivuttain",
  prev: "Edelliset kuvat",
  next: "Seuraavat kuvat",
};

export default function WhyMove() {
  return (
    <section id="miksi-liikkua" aria-labelledby="miksi-liikkua-otsikko" className="bg-sky px-6 py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <div data-reveal className="max-w-2xl">
          <SectionHeading
            id="miksi-liikkua-otsikko"
            eyebrow="Liikunta & hyvinvointi"
            title="Miksi liikkua, ja miksi myös levätä?"
            intro="Hyvä olo syntyy kahdesta asiasta: liikkeestä ja palautumisesta. Siksi tunneillani hikoillaan, mutta myös pysähdytään."
          />
        </div>

        {/* Kuvagalleria: sama karuselli kuin Instagram-osiossa (pyyhkäisy, nuolet, näppäimistö) */}
        <div data-reveal="fade">
          <InstagramCarousel posts={galleryPosts} labels={galleryLabels} />
        </div>

        {/* Hyötykortit: 1 sarake mobiilissa, 2 tabletilla, 4 työpöydällä.
            gap-px + taustaväri luo ohuet erotinviivat korttien väliin. */}
        <ul className="grid gap-px overflow-hidden rounded-2xl bg-sky-line sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <li key={b.title} data-reveal className="flex flex-col gap-2.5 bg-sky-soft p-7">
              <h3 className="font-serif text-[26px] font-bold">{b.title}</h3>
              <p className="leading-relaxed text-ink-soft">{b.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
