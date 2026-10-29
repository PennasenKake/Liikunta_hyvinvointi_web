import type { Metadata } from "next";
// next/font/google lataa Google-fontit buildin aikana ja tarjoilee ne
// sivuston omalta palvelimelta: ei pyyntöjä Googleen kävijän selaimesta.
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";
import { NOINDEX, SITE_URL } from "@/lib/seo";

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

// Koko sivuston oletusmetatiedot. Yksittäiset sivut täydentävät näitä omilla metatiedoillaan.
export const metadata: Metadata = {
  // metadataBase: suhteelliset osoitteet (jakokuva, canonical) muutetaan täysiksi osoitteiksi
  metadataBase: new URL(SITE_URL),
  title: {
    // Etusivun otsikko: paikkakunnat mukana paikallista hakua varten
    default: "Tahkon Amanda – Liikunta ja hyvinvointi Tahkolla, Siilinjärvellä, Kuopiossa ja Rautavaaralla",
    // Muiden sivujen otsikko: "Käyttöehdot – Tahkon Amanda"
    template: "%s – Tahkon Amanda",
  },
  description:
    "Vesijumppaa, HIIT:iä, personal trainingia, äänimaljarentoutusta, yin joogaa ja InBody-mittauksia Tahkolla, Siilinjärvellä, Kuopiossa ja Rautavaaralla.",
  applicationName: "Tahkon Amanda",
  // Jakaminen somessa ja viestisovelluksissa. Kuva: app/opengraph-image.png (Next.js lisää sen itse).
  openGraph: {
    type: "website",
    locale: "fi_FI",
    siteName: "Tahkon Amanda",
    title: "Tahkon Amanda – Liikunta ja hyvinvointi",
    description: "Ryhmäliikuntaa, personal trainingia ja rentoutusta Tahkolla, Siilinjärvellä, Kuopiossa ja Rautavaaralla.",
  },
  twitter: { card: "summary_large_image" },
  // Esikatselussa (NEXT_PUBLIC_NOINDEX=1) sivut pidetään pois hakukoneista.
  // Tuotannossa ei erillistä tagia: indeksointi on oletus, ja näin 404-sivun automaattinen
  // noindex ei saa rinnalleen ristiriitaista "index, follow" -tagia.
  robots: NOINDEX ? { index: false, follow: false } : undefined,
  formatDetection: { telephone: false }, // Puhelinnumero on jo linkki: ei selaimen omaa tunnistusta
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Fonttien CSS-muuttujat asetetaan <html>-tagiin, jolloin ne ovat
    // käytettävissä koko sivulla. globals.css kytkee ne Tailwindiin.
    // suppressHydrationWarning: <head>-skripti lisää has-js-luokan ennen Reactia,
    // joten luokkalista eroaa tarkoituksella palvelimen HTML:stä.
    // data-scroll-behavior="smooth": Next.js ohittaa globals.css:n pehmeän vierityksen
    // sivulta toiselle siirryttäessä, jolloin uusi sivu alkaa heti ylhäältä.
    <html
      lang="fi"
      className={`${cormorant.variable} ${jost.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* has-js ennen ensimmäistä piirtoa: paljastettavat osat voidaan piilottaa ilman välähdystä.
            Ilman JavaScriptiä luokkaa ei tule, ja kaikki sisältö näkyy normaalisti.
            Tavallinen <script> eikä next/script: beforeInteractive ajetaan vasta Next.js:n
            käynnistyskoodin mukana, jolloin näkyvät osat ehtisivät välähtää ennen piilotusta. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('has-js')" }} />
      </head>
      {/* Perustyylit koko sivulle: tausta, tekstin väri ja leipätekstin fontti */}
      <body className="bg-surface text-ink font-sans">
        {/* Ohituslinkki (WCAG 2.4.1): ensimmäinen Tab-painallus paljastaa sen, ja Enter
            hyppää navigaation yli suoraan sisältöön (<main id="sisalto">).
            sr-only piilottaa sen näkyvistä, focus:not-sr-only tuo sen esiin fokuksessa.
            z-[60]: yläpalkin (z-50) päällä. */}
        <a
          href="#sisalto"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-5 focus:py-3 focus:font-semibold focus:text-accent focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-accent"
        >
          Siirry sisältöön
        </a>
        {/* Header näkyy kaikilla sivuilla, koska se on juuriasettelussa */}
        <Header />
        {children}
        {/* Footer näkyy kaikilla sivuilla, kuten Header */}
        <Footer />
        {/* Paljastusanimaatio: seuraa data-reveal-elementtejä kaikilla sivuilla */}
        <RevealOnScroll />
      </body>
    </html>
  );
}