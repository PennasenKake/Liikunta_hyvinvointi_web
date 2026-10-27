// QuickLinks.tsx: neljä pikalinkkiä heti Heron alla.
// Kortit nousevat negatiivisella marginaalilla Heron kuvituksen päälle.

// Kuvakkeet: ohuet viivapiirrokset. aria-hidden, koska teksti kertoo merkityksen.
const icons = {
  group: <path d="M6.5 6.5v11M17.5 6.5v11M3 9.5v5M21 9.5v5M6.5 12h11" />,
  person: <><circle cx="12" cy="7" r="3.5" /><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" /></>,
  bowl: <><path d="M4 13c0 3.9 3.6 6 8 6s8-2.1 8-6H4z" /><path d="M9 9c0-1.5 1-2 1-3.5M14 9c0-1.5 1-2 1-3.5" /></>,
  chart: <><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M8 8h8M8 12h5M8 16h3" /></>,
};

const links = [
  { title: "Ryhmäliikunta", sub: "8 tuntityyppiä", icon: icons.group, tone: "bg-lilac text-accent" },
  { title: "Personal Training", sub: "Ohjelma juuri sinulle", icon: icons.person, tone: "bg-sky text-[#2b5c96]" },
  { title: "Rentoutus & jooga", sub: "Äänimaljat, yin, venyttely", icon: icons.bowl, tone: "bg-lilac text-accent" },
  { title: "InBody-mittaus", sub: "Kehonkoostumus", icon: icons.chart, tone: "bg-sky text-[#2b5c96]" },
];

export default function QuickLinks() {
  return (
    <section aria-label="Pikalinkit palveluihin" className="bg-white px-6">
      {/* -mt-16 nostaa kortit Heron kuvituksen päälle, relative pitää ne päällimmäisinä.
          auto-fit + minmax: niin monta 200 px:n saraketta kuin mahtuu, ilman mediakyselyitä. */}
      <div className="relative mx-auto -mt-16 grid max-w-5xl grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
        {links.map((l) => (
          <a
            key={l.title}
            href="#palvelut"
            className="flex items-center gap-3.5 rounded-2xl border border-line bg-white p-5 shadow-[0_8px_24px_rgba(34,29,74,0.06)] transition hover:border-border"
          >
            <span className={`flex size-12 shrink-0 items-center justify-center rounded-full ${l.tone}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {l.icon}
              </svg>
            </span>
            <span>
              <span className="block text-[17px] font-semibold">{l.title}</span>
              <span className="text-sm text-muted">{l.sub}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}