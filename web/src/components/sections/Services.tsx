// Services.tsx: Palvelut-osio.
// Server Component: hakee datan ja välittää sen Client Componentille (ServiceTabs).
// Kun data myöhemmin tulee Sanitysta, haku tehdään täällä palvelimella,
// eikä selaimen tarvitse ladata sitä erikseen.

import { serviceCategories } from "@/lib/services";
import ServiceTabs from "./ServiceTabs";

export default function Services() {
  return (
    <section id="palvelut" className="bg-white px-6 pb-26 pt-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-2.5 font-serif text-[56px] font-semibold leading-tight">Palvelut</h2>
        <p className="mb-8 max-w-md text-[17px] leading-relaxed text-muted">
          Tunteja eri kuntotasoille. Kysy rohkeasti, jos et tiedä mistä aloittaa.
        </p>
        <ServiceTabs categories={serviceCategories} />
      </div>
    </section>
  );
}