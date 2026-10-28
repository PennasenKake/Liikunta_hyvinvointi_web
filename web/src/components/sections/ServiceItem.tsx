// ServiceItem.tsx: yksi palvelurivi Palvelut-osiossa.
// Client Component, koska mobiilissa kuvaus avautuu ja sulkeutuu klikkaamalla (tila).
//
// Näkymät:
// - Mobiili (alle 1024 px): kuvake ja nimi painikkeena. Klikkaus näyttää tehotason ja kuvauksen.
//   Näin 13 palvelun lista mahtuu puhelimessa parille ruudulle.
// - Työpöytä (lg): kaikki tiedot näkyvät aina, eikä painiketta tarvita.
//
// Rivillä on id (esim. "vesijumppa"), johon yläpalkin alavalikon linkit osoittavat.
// Jos osoitteessa on rivin id (/#vesijumppa), rivi avautuu automaattisesti myös mobiilissa.
"use client";

import { useEffect, useId, useState } from "react";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { intensityLabels, serviceId, type Intensity, type Service } from "@/lib/services";

type Props = {
  service: Service;
  iconTone: string; // Kuvakkeen taustan ja värin Tailwind-luokat palstan mukaan
};

// Tehotaso kolmena pisteenä ja tekstinä. Pisteet ovat koriste (aria-hidden),
// ruudunlukija lukee tekstin, esim. "Tehotaso: Kohtalainen".
function IntensityLine({ level }: { level: Intensity }) {
  return (
    <p className="flex items-center gap-2 text-sm text-muted">
      <span className="sr-only">Tehotaso:</span>
      <span aria-hidden="true" className="inline-flex gap-1">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`size-2 rounded-full ${i <= level ? "bg-accent" : "border border-border bg-white"}`}
          />
        ))}
      </span>
      {intensityLabels[level]}
    </p>
  );
}

export default function ServiceItem({ service: s, iconTone }: Props) {
  const [open, setOpen] = useState(false);
  const id = serviceId(s.title);
  const panelId = useId(); // Yksilöllinen id aria-controls-viittausta varten

  // Avaa rivin, kun osoite osoittaa siihen (alavalikon linkki tai jaettu linkki).
  // hashchange: linkin klikkaus samalla sivulla ei lataa sivua uudelleen.
  useEffect(() => {
    const sync = () => {
      if (window.location.hash === `#${id}`) setOpen(true);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [id]);

  const icon = (
    <span className={`flex size-11 shrink-0 items-center justify-center rounded-full ${iconTone}`}>
      <ServiceIcon name={s.icon} className="size-5.5" />
    </span>
  );

  return (
    // scroll-mt: ankkurilinkki jättää tilaa yläpalkille
    <li id={id} className="scroll-mt-28 border-b border-line last:border-0">
      {/* MOBIILI: koko rivi on painike. aria-expanded kertoo ruudunlukijalle tilan. */}
      <h4 className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-h-16 w-full items-center gap-4 py-3 text-left"
        >
          {icon}
          <span className="grow font-serif text-[24px] font-semibold leading-tight">{s.title}</span>
          {/* Nuoli kääntyy auki-tilassa. motion-reduce: ei animaatiota, jos käyttäjä on sen kieltänyt. */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`size-5 shrink-0 text-accent transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </h4>

      {/* TYÖPÖYTÄ: kuvake ja otsikko vierekkäin, tiedot aina näkyvissä */}
      <div className="flex gap-4 lg:py-5">
        <span className="hidden lg:flex">{icon}</span>
        {/* Mobiilissa piilossa kunnes avataan (hidden), työpöydällä aina näkyvissä (lg:block).
            pl-15: mobiilissa teksti alkaa nimen kohdalta, kuvakkeen oikealta puolelta. */}
        <div id={panelId} className={`min-w-0 pb-5 pl-15 lg:block lg:pb-0 lg:pl-0 ${open ? "block" : "hidden"}`}>
          <h4 className="hidden font-serif text-[24px] font-semibold leading-tight lg:block">{s.title}</h4>
          {s.intensity && (
            <div className="mb-1.5 lg:mt-1">
              <IntensityLine level={s.intensity} />
            </div>
          )}
          <p className="leading-relaxed text-muted">{s.description}</p>
        </div>
      </div>
    </li>
  );
}
