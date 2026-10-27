// Väliaikaiset tyhjät osiot navigaation testaamiseen.
// Jokaisella on id, johon Headerin linkit viittaavat.
const sections = [
  { id: "palvelut", title: "Palvelut" },
  { id: "hyvinvointi", title: "Liikunta & hyvinvointi" },
  { id: "hinnasto", title: "Hinnasto" },
  { id: "minusta", title: "Minusta" },
  { id: "yhteystiedot", title: "Yhteystiedot" },
];

export default function Home() {
  return (
    // id="top" on logolinkin kohde
    <main id="top">
      {sections.map((s) => (
        // min-h-screen tekee jokaisesta osiosta näytön korkuisen, jotta vieritys näkyy
        <section key={s.id} id={s.id} className="min-h-screen border-b border-line p-8">
          <h2 className="font-serif text-5xl font-semibold">{s.title}</h2>
        </section>
      ))}
    </main>
  );
}