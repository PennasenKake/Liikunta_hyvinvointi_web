import type { Metadata } from "next";
// next/font/google lataa Google-fontit buildin aikana ja tarjoilee ne
// sivuston omalta palvelimelta: ei pyyntöjä Googleen kävijän selaimesta.
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Otsikkofontti. Cormorant Garamond ei ole muuttuva fontti,
// joten tarvittavat painot ja tyylit pitää luetella erikseen.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],          // latin sisältää myös ä- ja ö-kirjaimet
  weight: ["500", "600", "700"],
  style: ["normal", "italic"], // kursiivia käytetään pienissä yläotsikoissa
  variable: "--font-cormorant", // fontti tallennetaan CSS-muuttujaan
  display: "swap",              // näytä varafontti, kunnes oma on latautunut
});

// Leipätekstin fontti. Jost on muuttuva fontti, joten painoja ei tarvitse luetella.
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tahkon Amanda – Liikunta ja hyvinvointi",
  description:
    "Ryhmäliikuntaa, personal trainingia ja rentoutusta Tahkolla, Siilinjärvellä, Kuopiossa ja Rautavaaralla.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Fonttien CSS-muuttujat asetetaan <html>-tagiin, jolloin ne ovat
    // käytettävissä koko sivulla. globals.css kytkee ne Tailwindiin.
    <html lang="fi" className={`${cormorant.variable} ${jost.variable}`}>
      {/* Perustyylit koko sivulle: tausta, tekstin väri ja leipätekstin fontti */}
      <body className="bg-surface text-ink font-sans">
        {/* Header näkyy kaikilla sivuilla, koska se on juuriasettelussa */}
        <Header />
        {children}
        {/* Footer näkyy kaikilla sivuilla, kuten Header */}
        <Footer />
      </body>
    </html>
  );
}