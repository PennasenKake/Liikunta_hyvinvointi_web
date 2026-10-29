// TahkoLine.tsx: vuoristosiluetti osioiden välissä.
// Osioiden raja muuttuu vuoren muotoiseksi: siluetin yläpuoli on edellisen osion väriä
// ja alapuoli seuraavan. Harjanteelle piirtyy kiiltävä violetti viiva sitä mukaa,
// kun sivua vieritetään.
//
// Animaatio on pelkkää CSS:ää (globals.css → .tahko-line), ei JavaScriptiä:
// - Vierityssidonnainen: animation-timeline: view() sitoo piirtymisen siluetin
//   etenemiseen ruudulla, joten viiva piirtyy vierityksen tahdissa (ja peruuntuu ylös vieritettäessä).
// - Jos selain ei tue vierityssidonnaisia animaatioita tai kävijä on pyytänyt vähemmän
//   liikettä (prefers-reduced-motion), viiva näkyy heti kokonaan.
// - pathLength="1": viivan pituus normalisoidaan ykköseksi, jolloin piirtymistä ohjataan
//   yhdellä luvulla (stroke-dashoffset 1 → 0) riippumatta muodon todellisesta pituudesta.
//
// Server Component: koriste ilman tilaa, aria-hidden, koska siluetti ei kerro sisältöä.

// Harjanteen muodot 1440 × 120 -alueella (y = 0 ylhäällä).
const RIDGES = {
  // Tahkovuoren profiili: loiva nousu, leveä laki ja pidempi lasku oikealle
  tahko:
    "M0 104 C160 100 260 88 360 70 C450 54 520 34 620 26 C700 20 820 18 900 22 C1000 28 1080 48 1160 64 C1260 84 1340 96 1440 100",
  // Vuoristo: useita huippuja ja satuloita, pehmeästi pyöristetyt kärjet
  huiput:
    "M0 100 C60 92 90 80 130 78 C170 76 180 90 210 86 C250 80 270 52 300 48 C330 44 340 62 370 60 C410 56 440 26 475 24 C510 22 530 50 565 50 C600 50 610 40 645 40 C690 40 720 70 765 68 C810 66 830 32 865 30 C895 28 905 44 935 42 C975 40 1010 14 1045 14 C1080 14 1100 48 1135 52 C1170 56 1190 62 1225 60 C1265 58 1290 38 1325 38 C1365 38 1400 70 1440 78",
  // Harju: matalat, aaltoilevat vaarat (Savon maisema)
  harju:
    "M0 96 C120 80 220 60 320 66 C420 72 480 92 600 84 C720 76 800 40 920 36 C1040 32 1100 70 1200 78 C1300 86 1380 74 1440 70",
} as const;

// Taustavärit teemasta. Tailwindin luokat kirjoitetaan kokonaisina, jotta ne päätyvät CSS:ään.
const BG = { white: "bg-white", sky: "bg-sky", "lilac-soft": "bg-lilac-soft", surface: "bg-surface" } as const;
const FILL = { white: "fill-white", sky: "fill-sky", "lilac-soft": "fill-lilac-soft", surface: "fill-surface" } as const;

type Tone = keyof typeof BG;

type Props = {
  id: string;                     // Yksilöllinen tunniste liukuvärille (useampi siluetti samalla sivulla)
  from: Tone;                     // Yläpuolisen osion taustaväri
  to: Tone;                       // Alapuolisen osion taustaväri
  shape?: keyof typeof RIDGES;
  flip?: boolean;                 // Peilaus vaakasuunnassa vaihtelun vuoksi
};

export default function TahkoLine({ id, from, to, shape = "tahko", flip = false }: Props) {
  const ridge = RIDGES[shape];
  const gradientId = `tahko-kiilto-${id}`;

  return (
    <div aria-hidden="true" className={`${BG[from]} -mb-px leading-none`}>
      {/* slice + xMidYMax: siluetti skaalautuu tasaisesti (viiva ei veny) ja rajautuu
          tarvittaessa reunoilta. Korkeus 56–120 px näytön leveyden mukaan. */}
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="xMidYMax slice"
        className={`block h-[clamp(56px,7vw,120px)] w-full ${flip ? "-scale-x-100" : ""}`}
        focusable="false"
      >
        <defs>
          {/* Sama kiiltävä violetti kuin Hero-kuvituksen ääriviivoissa */}
          <linearGradient id={gradientId} x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#5A36C8" />
            <stop offset="0.22" stopColor="#8E6DEB" />
            <stop offset="0.36" stopColor="#C4B0FF" />
            <stop offset="0.5" stopColor="#6A45D2" />
            <stop offset="0.66" stopColor="#A88BF5" />
            <stop offset="0.8" stopColor="#CAB9FF" />
            <stop offset="1" stopColor="#5A36C8" />
          </linearGradient>
        </defs>
        {/* Seuraavan osion värinen alue harjanteen alapuolella */}
        <path d={`${ridge} L1440 120 L0 120 Z`} className={FILL[to]} />
        {/* Pehmeä hehku harjanteen alla (staattinen) */}
        <path d={ridge} fill="none" stroke="#B79CFF" strokeWidth="7" strokeOpacity="0.28" strokeLinecap="round" />
        {/* Piirtyvä viiva */}
        <path
          d={ridge}
          pathLength={1}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.6"
          strokeLinecap="round"
          className="tahko-line"
        />
      </svg>
    </div>
  );
}
