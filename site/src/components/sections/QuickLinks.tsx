// QuickLinks.tsx: neljä pikalinkkiä heti Heron alla.
// Kortit nousevat negatiivisella marginaalilla heron alareunan päälle (hero varaa tilan pb-24:llä).
// Palvelut (Liikunta, Hyvinvointi, Valmennus) ovat heti alla omina kortteinaan, joten pikalinkit
// vievät kävijän muihin tärkeisiin kohtiin: tulevat tunnit, hinnasto, hengitysharjoitus ja Amanda.

import { withBase } from "@/lib/paths";

// Kuvakkeet: ohuet viivapiirrokset. aria-hidden, koska teksti kertoo merkityksen.
const icons = {
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8-9 9-8-8z" />
      <circle cx="8.5" cy="8.5" r="1.5" />
    </>
  ),
  breath: <path d="M4 9c3 0 4-2 7-2s4 2 7 2M4 14c3 0 4-2 7-2s4 2 7 2M6 19c2.5 0 3.5-1.5 6-1.5s3.5 1.5 6 1.5" />,
  person: (
    <>
      <circle cx="12" cy="7" r="3.5" />
      <path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </>
  ),
};

// Sävyt tulevat teemasta: text-sky-ink on lisätty index.css:ään.
const links = [
  { title: "Tulevat tunnit", sub: "Ilmoittaudu tunnille", href: "/#kalenteri", icon: icons.calendar, tone: "bg-lilac text-accent" },
  { title: "Hinnasto", sub: "Hinnat ja tarjoukset", href: "/#hinnasto", icon: icons.tag, tone: "bg-sky text-sky-ink" },
  { title: "Hengähdä hetki", sub: "Minuutin harjoitus", href: "/#hengitys", icon: icons.breath, tone: "bg-lilac text-accent" },
  { title: "Minusta", sub: "Kuka ohjaa tunnit", href: "/#minusta", icon: icons.person, tone: "bg-sky text-sky-ink" },
];

export default function QuickLinks() {
  return (
    <section aria-label="Pikalinkit" className="bg-white px-6">
      {/* Ruudukko: 2 × 2 mobiilissa ja tabletilla, 4 rinnakkain lg-leveydestä (1024 px).
          Näin yksikään kortti ei jää yksin riville, ja mobiilissa vieritystä on vähemmän. */}
      <div className="relative mx-auto -mt-16 grid lg:-mt-8 max-w-5xl grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-3.5">
        {links.map((l) => (
          <a
            key={l.title}
            data-reveal
            href={withBase(l.href)}
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
