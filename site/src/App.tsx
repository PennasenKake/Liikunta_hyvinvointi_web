// App.tsx: yhteinen asettelu kaikille sivuille (ohituslinkki, yläpalkki, sisältö, alatunniste).
// Sama komponentti renderöidään buildissa HTML:ksi (entry-server.tsx) ja selaimessa
// "herätetään" eloon (main.tsx). path kertoo, mikä sivu näytetään.

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";
import { findRoute } from "@/routes";

export default function App({ path }: { path: string }) {
  const { Page } = findRoute(path);

  return (
    <>
      {/* Ohituslinkki (WCAG 2.4.1): ensimmäinen Tab-painallus paljastaa sen, ja Enter
          hyppää navigaation yli suoraan sisältöön (<main id="sisalto">).
          sr-only piilottaa sen näkyvistä, focus:not-sr-only tuo sen esiin fokuksessa. */}
      <a
        href="#sisalto"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-5 focus:py-3 focus:font-semibold focus:text-accent focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-accent"
      >
        Siirry sisältöön
      </a>
      <Header />
      <Page />
      <Footer />
      {/* Paljastusanimaatio: seuraa data-reveal-elementtejä */}
      <RevealOnScroll />
    </>
  );
}
