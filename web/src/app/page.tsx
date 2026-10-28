import Hero from "@/components/sections/Hero";
import type { ClassInfo } from "@/components/sections/NextClassCard";
import QuickLinks from "@/components/sections/QuickLinks";
import Services from "@/components/sections/Services";

// Väliaikainen esimerkkidata. Korvataan Google-kalenterin haulla
// (lib/calendar.ts) kalenterivaiheessa.
const nextClass: ClassInfo = {
  title: "Vesijumppa",
  when: "ti klo 18.00",
  place: "Tahko",
};

// Vielä rakentamattomat osiot, joilla navigaatiota voi testata.
// Liikunta ja Hyvinvointi ovat nyt Palvelut-osiossa (Services.tsx).
const sections = [
  { id: "hinnasto", title: "Hinnasto" },
  { id: "minusta", title: "Minusta" },
  { id: "kalenteri", title: "Tulevat tunnit" }, // Heron painikkeet osoittavat tänne
  { id: "yhteystiedot", title: "Yhteystiedot" },
];

export default function Home() {
  return (
    <main>
      <Hero nextClass={nextClass} />
      <QuickLinks />
      <Services />
      {sections.map((s) => (
        <section key={s.id} id={s.id} className="min-h-screen border-b border-line p-8">
          <h2 className="font-serif text-5xl font-semibold">{s.title}</h2>
        </section>
      ))}
    </main>
  );
}