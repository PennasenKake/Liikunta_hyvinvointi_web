// ButtonLink.tsx: linkki, joka näyttää painikkeelta.
// Käytetään <a>-tagia eikä <button>-tagia, koska painike vie toiseen paikkaan
// (ankkuri, puhelin) eikä suorita toimintoa. Tämä on saavutettavuuden kannalta oikein.

import { withBase } from "@/lib/paths";

// Kaksi tyyliä: täytetty päätoiminnolle ja reunallinen toissijaiselle.
const variants = {
  primary: "bg-accent text-white hover:opacity-90",
  secondary: "border border-border bg-white text-ink hover:border-accent",
} as const;

// Propsien tyyppi. "keyof typeof variants" = "primary" | "secondary",
// joten TypeScript huomauttaa, jos variantin nimi kirjoitetaan väärin.
type Props = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants; // ? = valinnainen, oletus alla
};

export default function ButtonLink({ href, children, variant = "primary" }: Props) {
  return (
    <a
      href={withBase(href)} // Alipolku GitHub Pagesia varten (lib/paths.ts)
      // Yhteiset luokat kaikille painikkeille + variantin omat luokat.
      // min-h-11 = 44 px, eli kosketusalue on riittävän suuri.
      className={`inline-flex min-h-11 items-center rounded-md px-7 py-4 text-[17px] font-semibold transition ${variants[variant]}`}
    >
      {children}
    </a>
  );
}