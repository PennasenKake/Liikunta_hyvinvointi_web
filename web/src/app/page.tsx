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
const sections = [
  { id: "palvelut", title: "Palvelut" },
  { id: "hyvinvointi", title: "Liikunta & hyvinvointi" },
  { id: "hinnasto", title: "Hinnasto" },
  { id: "minusta", title: "Minusta" },
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