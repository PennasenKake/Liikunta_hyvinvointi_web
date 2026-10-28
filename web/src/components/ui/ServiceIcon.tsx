// ServiceIcon.tsx: palvelukorttien kuvakkeet.
// Ohuet viivapiirrokset samalla tyylillä kuin QuickLinks-osion kuvakkeet:
// 24 × 24 ruudukko, pyöristetyt päät, väri tulee tekstin väristä (currentColor).
// Omat piirrokset kuvakekirjaston sijaan: ei uutta riippuvuutta, ja ilme pysyy yhtenäisenä.

import type { ServiceIconName } from "@/lib/services";

const paths: Record<ServiceIconName, React.ReactNode> = {
  // Vesijumppa: kolme aaltoa
  water: <path d="M3 8c1.5 0 1.5-1.5 3-1.5S7.5 8 9 8s1.5-1.5 3-1.5S13.5 8 15 8s1.5-1.5 3-1.5S19.5 8 21 8M3 13c1.5 0 1.5-1.5 3-1.5s1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5M3 18c1.5 0 1.5-1.5 3-1.5s1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5" />,
  // Keppijumppa: vino keppi ja kädensijat
  stick: <path d="M4 20 20 4M6.5 14.5l3 3M14.5 6.5l3 3" />,
  // HIIT: salama
  bolt: <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3z" />,
  // Circuit: kiertävät nuolet
  circuit: (
    <>
      <path d="M20 12a8 8 0 0 1-13.7 5.6M4 12a8 8 0 0 1 13.7-5.6" />
      <path d="M18 3v3.6h-3.6M6 21v-3.6h3.6" />
    </>
  ),
  // Tehotreeni: käsipaino
  dumbbell: <path d="M7 12h10M4.5 8v8M7 6.5v11M17 6.5v11M19.5 8v8" />,
  // RVP: keskivartalo (tähtäin)
  core: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
    </>
  ),
  // Tanssilliset tunnit: nuotti
  music: (
    <>
      <path d="M9 18V5.5l11-2V16" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16" r="2.5" />
    </>
  ),
  // Personal Training: henkilö
  person: (
    <>
      <circle cx="12" cy="7" r="3.5" />
      <path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </>
  ),
  // Äänimaljarentoutus: malja ja ääniaallot
  bowl: (
    <>
      <path d="M4 13c0 3.9 3.6 6 8 6s8-2.1 8-6H4z" />
      <path d="M9 9c0-1.5 1-2 1-3.5M14 9c0-1.5 1-2 1-3.5" />
    </>
  ),
  // Kristallimaljarentoutus: kide
  crystal: <path d="M12 3 6 9l6 12 6-12-6-6zM6 9h12M12 3v18" />,
  // Yin jooga: lootuksenkukka
  lotus: <path d="M12 5c1.8 2.3 1.8 6.7 0 9-1.8-2.3-1.8-6.7 0-9zM12 14c-2.8-.3-5.5-2.2-6.5-5.5 2.6.2 4.8 1.7 6.5 4M12 14c2.8-.3 5.5-2.2 6.5-5.5-2.6.2-4.8 1.7-6.5 4M5 17.5c2 1.2 4.4 1.8 7 1.8s5-.6 7-1.8" />,
  // Syvävenyttely: venyttelevä hahmo
  stretch: (
    <>
      <circle cx="15" cy="5" r="2" />
      <path d="M4 20h7l2-6 5 6M13 14l-1-5-6 2M12 9l6 1" />
    </>
  ),
  // InBody-mittaukset: raportti
  chart: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="3" />
      <path d="M8 8h8M8 12h5M8 16h3" />
    </>
  ),
};

type Props = {
  name: ServiceIconName;
  className?: string;
};

export default function ServiceIcon({ name, className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true" // Koriste: palvelun nimi kertoo merkityksen
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
