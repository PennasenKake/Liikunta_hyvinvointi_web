// QuickLinks.tsx: neljä pikalinkkiä heti Heron alla.
// Kortit nousevat negatiivisella marginaalilla Heron kuvituksen päälle.
// Työpöydällä vähemmän (-mt-8), jotta kuvituksen rantakylä jää näkyviin.

import { serviceCategories } from "@/lib/services";

// Kuvakkeet: ohuet viivapiirrokset. aria-hidden, koska teksti kertoo merkityksen.
const icons = {
  group: <path d="M6.5 6.5v11M17.5 6.5v11M3 9.5v5M21 9.5v5M6.5 12h11" />,
  person: (
    <>
      <circle cx="12" cy="7" r="3.5" />
      <path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </>
  ),
  bowl: (
    <>
      <path d="M4 13c0 3.9 3.6 6 8 6s8-2.1 8-6H4z" />
      <path d="M9 9c0-1.5 1-2 1-3.5M14 9c0-1.5 1-2 1-3.5" />
    </>
  ),
  chart: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="3" />
      <path d="M8 8h8M8 12h5M8 16h3" />
    </>
  ),
};

// Ryhmäliikuntatuntien määrä lasketaan datasta, jotta luku pysyy oikeana,
// kun palveluita lisätään (Personal Training on yksilöpalvelu, joten se ei lasketa mukaan).
const groupClassCount =
  serviceCategories.find((c) => c.id === "liikunta")?.services.filter((s) => s.booking === "ryhma").length ?? 0;

// href osoittaa suoraan Palvelut-osion oikeaan palstaan (#liikunta tai #hyvinvointi).
// Sävyt tulevat teemasta: text-sky-ink on lisätty globals.css:ään.
const links = [
  { title: "Ryhmäliikunta", sub: `${groupClassCount} tuntityyppiä`, href: "/#liikunta", icon: icons.group, tone: "bg-lilac text-accent" },
  { title: "Personal Training", sub: "Ohjelma juuri sinulle", href: "/#liikunta", icon: icons.person, tone: "bg-sky text-sky-ink" },
  { title: "Rentoutus & jooga", sub: "Äänimaljat, yin, venyttely", href: "/#hyvinvointi", icon: icons.bowl, tone: "bg-lilac text-accent" },
  { title: "InBody-mittaus", sub: "Kehonkoostumus", href: "/#hyvinvointi", icon: icons.chart, tone: "bg-sky text-sky-ink" },
];

export default function QuickLinks() {
  return (
    <section aria-label="Pikalinkit palveluihin" className="bg-white px-6">
      {/* Ruudukko: 2 × 2 mobiilissa ja tabletilla, 4 rinnakkain lg-leveydestä (1024 px).
          Näin yksikään kortti ei jää yksin riville, ja mobiilissa vieritystä on vähemmän. */}
      <div className="relative mx-auto -mt-16 grid lg:-mt-8 max-w-5xl grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-3.5">
        {links.map((l) => (
          <a
            key={l.title}
            data-reveal
            href={l.href}
            // Mobiilissa kuvake tekstin yläpuolella (flex-col), sm-leveydestä vierekkäin.
            className="flex flex-col items-start gap-3 rounded-2xl border border-line bg-white p-4 shadow-[0_8px_24px_rgba(34,29,74,0.06)] transition hover:border-border sm:flex-row sm:items-center sm:gap-3.5 sm:p-5"
          >
            <span className={`flex size-11 shrink-0 items-center justify-center rounded-full sm:size-12 ${l.tone}`}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {l.icon}
              </svg>
            </span>
            <span>
              <span className="block text-base font-semibold leading-snug sm:text-[17px]">{l.title}</span>
              <span className="text-sm text-muted">{l.sub}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
