// HeroC.tsx: hero-versio C ("Liikuntaa, joka tuntuu hyvältä").
// Idea FeelHobbyn sivulta: liikkuva taustakuva ja keskitetty otsikko.
// Tausta: kolme kuvaa vaihtuu ristiinhäivytyksellä ja zoomautuu hitaasti (CSS, index.css).
// Kuvien päällä vaalea violetti-sininen huntu, joka on keskellä tiivein, jotta teksti erottuu.
//
// Saavutettavuus:
// - Pysäytyspainike (WCAG 2.2.2): yli 5 s jatkuvan liikkeen voi pysäyttää.
// - prefers-reduced-motion: liike pois automaattisesti (index.css).
// - Kuvat ovat koristeita (alt=""), koska sama asia kerrotaan tekstissä.

import { useState } from "react";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";
import { withBase } from "@/lib/paths";
import { serviceCount } from "@/lib/services";

export default function HeroC() {
  // paused = onko taustan liike pysäytetty. Alkutila false: sama palvelimella ja selaimessa.
  const [paused, setPaused] = useState(false);

  return (
    <section
      id="top"
      aria-label="Esittely"
      className={`relative flex min-h-[640px] items-center overflow-hidden bg-lilac-soft lg:min-h-[calc(100svh-6.5rem)] ${paused ? "hero-paused" : ""}`}
    >
      {/* Liikkuvat taustakuvat. Ensimmäinen ladataan heti (eager), muut laiskasti. */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <img className="hero-kb object-[50%_60%]" src={photos.ulkotreeni.src} alt="" fetchPriority="high" decoding="async" />
        <img className="hero-kb object-[50%_55%]" src={photos.joogasali.src} alt="" loading="lazy" decoding="async" />
        <img className="hero-kb object-[50%_55%]" src={photos.aanimaljat.src} alt="" loading="lazy" decoding="async" />
        {/* Huntu: säteittäinen liukuväri, keskellä lähes läpinäkymätön (teksti), reunoilla kuvat näkyvät */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_62%_70%_at_50%_50%,rgba(244,248,253,0.92)_0%,rgba(241,237,250,0.84)_60%,rgba(220,234,248,0.7)_100%)] max-sm:bg-[radial-gradient(ellipse_90%_60%_at_50%_45%,rgba(244,248,253,0.92)_0%,rgba(241,237,250,0.84)_60%,rgba(220,234,248,0.72)_100%)]" />
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-5 py-16 text-center">
        <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/85 px-4 py-2 text-xs tracking-[0.08em] text-sky-ink sm:text-[13px]">
          <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
          {site.areas.join(" · ")}
        </p>
        <h1 className="font-serif text-[clamp(3.5rem,8vw,6.25rem)] font-semibold leading-[0.95]">
          Liikuntaa, joka <br className="max-sm:hidden" />
          tuntuu <span className="italic text-accent">hyvältä</span>
        </h1>
        <p className="max-w-[680px] text-lg leading-relaxed text-ink-soft sm:text-xl">
          Ryhmätunteja, personal trainingia ja äänimaljojen rauhaa. Sinun tahtiisi.
        </p>
        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <a
            href={withBase("/#kalenteri")}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-8 text-[17px] font-semibold text-white shadow-[0_10px_24px_rgba(78,49,146,0.25)] transition hover:opacity-90"
          >
            Löydä sopiva tunti <span aria-hidden="true">&nbsp;→</span>
          </a>
          <a
            href={withBase("/#liikunta")}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-white px-8 text-[17px] font-semibold text-accent transition hover:bg-lilac-soft"
          >
            Katso palvelut
          </a>
        </div>
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[15px] text-ink-soft">
          <li><strong className="text-accent">{serviceCount}</strong> palvelua</li>
          <li><strong className="text-accent">{site.areas.length}</strong> paikkakuntaa</li>
          <li>Ryhmässä tai <strong className="text-accent">1:1</strong></li>
        </ul>
      </div>

      {/* Pysäytyspainike: aria-pressed kertoo ruudunlukijalle tilan */}
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? "Käynnistä taustan liike" : "Pysäytä taustan liike"}
        className="absolute bottom-5 right-5 grid size-11 place-items-center rounded-full border border-border bg-white/90 text-accent transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:hidden"
      >
        {paused ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l13 8-13 8z" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
        )}
      </button>
    </section>
  );
}
