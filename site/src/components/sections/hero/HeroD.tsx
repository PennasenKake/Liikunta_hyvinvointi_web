// HeroD.tsx: hero-versio D ("Liikettä ja lepoa Pohjois-Savossa").
// Teksti vasemmalla, tausta koko leveydeltä: taustavideo (site.heroVideo), tai jos sitä ei ole,
// Amandan omat kuvat vaihtuvat ristiinhäivytyksellä (sama CSS kuin Hero C:ssä, index.css).
// Toisin kuin Hero C:ssä, kuvia ei peitetä hunnulla: vain tekstin puoli häivytetään,
// jotta kuvat näkyvät aitoina eivätkä näytä kuvapankkikuvilta.
//
// Mobiilissa kuva on kaistana ylhäällä ja teksti sen alla (teksti ei koskaan ole kuvan päällä).
//
// Saavutettavuus:
// - Pysäytyspainike (WCAG 2.2.2): yli 5 s jatkuvan liikkeen voi pysäyttää.
// - prefers-reduced-motion: liike pois automaattisesti (kuvat: index.css, video: pysäytetään alla).
// - Kuvat ja video ovat koristeita (alt=""), koska sama asia kerrotaan tekstissä.

import { useEffect, useRef, useState } from "react";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";
import { withBase } from "@/lib/paths";
import NextClass from "./NextClass";

// TODO(Amanda): koulutus ja kokemusvuodet (docs/sisalto.md). Hakasulkeissa = paikkamerkki.
const trust = ["[Koulutus, esim. liikunnanohjaaja]", "[X] vuotta ohjaajana", site.areas.join(" · ")];

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-accent">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function HeroD() {
  // paused = onko taustan liike pysäytetty. Alkutila false: sama palvelimella ja selaimessa.
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const video = site.heroVideo;

  // Video seuraa pysäytyspainiketta. Vähennetty liike: video pysäytetään heti alussa,
  // jolloin näkyy vain pysäytyskuva (poster).
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduce) el.pause();
    else el.play().catch(() => {}); // Selain voi estää automaattisen toiston: kuva näkyy silti
  }, [paused]);

  return (
    <section
      id="top"
      aria-labelledby="hero-otsikko"
      className={`relative flex flex-col overflow-hidden bg-surface lg:min-h-[calc(100svh-6.5rem)] lg:justify-center short:min-h-0 ${paused ? "hero-paused" : ""}`}
    >
      {/* Tausta. Mobiilissa kaista ylhäällä (h-64), työpöydällä koko osion takana. */}
      <div aria-hidden="true" className="relative h-64 overflow-hidden sm:h-80 lg:absolute lg:inset-0 lg:h-auto short:hidden">
        {video ? (
          // muted + playsInline: ehto automaattiselle toistolle puhelimissa. preload="metadata":
          // videota ei ladata kokonaan ennen kuin sitä toistetaan.
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            poster={withBase(video.poster)}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={withBase(video.webm)} type="video/webm" />
            <source src={withBase(video.mp4)} type="video/mp4" />
          </video>
        ) : (
          <>
            <img className="hero-kb object-[50%_62%]" src={photos.joogasali.src} alt="" fetchPriority="high" decoding="async" />
            <img className="hero-kb object-[50%_60%]" src={photos.ulkotreeni.src} alt="" loading="lazy" decoding="async" />
            <img className="hero-kb object-[50%_55%]" src={photos.aanimaljat.src} alt="" loading="lazy" decoding="async" />
          </>
        )}
        {/* Häivytys: mobiilissa kuvan alareuna sulautuu taustaan, työpöydällä vasen puoli
            (teksti) on lähes läpinäkymätön ja oikea puoli näyttää kuvan sellaisenaan. */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent from-55% to-surface lg:bg-[linear-gradient(90deg,rgba(251,250,254,0.97)_0%,rgba(251,250,254,0.93)_34%,rgba(251,250,254,0.55)_52%,rgba(251,250,254,0)_70%)]" />
      </div>

      {/* Sisältö. pb-24: pikalinkkikortit nousevat osion alareunan päälle (QuickLinks -mt-16). */}
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-24 sm:px-8 lg:py-20 lg:pb-24 short:py-6 short:pb-20">
        <div className="-mt-8 max-w-xl lg:mt-0 short:mt-0">
          <p className="mb-2 font-serif text-[22px] italic text-accent">Hei, olen Amanda</p>
          <h1 id="hero-otsikko" className="mb-4 font-serif text-[clamp(2.5rem,5.5vw,4rem)] font-bold leading-[1.02] short:text-4xl">
            {/* nowrap: yhdysmerkki ei saa katkaista nimeä kahdelle riville */}
            Liikettä ja lepoa <span className="whitespace-nowrap">Pohjois-Savossa</span>
          </h1>
          <p className="mb-7 max-w-[46ch] text-lg leading-relaxed text-ink-soft sm:text-xl short:mb-4 short:text-base">
            Vesijumppaa, joogaa, HIIT-tunteja ja äänimaljarentoutusta Tahkolla, Siilinjärvellä, Kuopiossa ja Rautavaaralla.
          </p>

          {/* Kaksi eri tehtävää: tunnit (pää) ja puhelu (mobiilissa yksi napautus) */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row short:mb-4">
            <a
              href={withBase("/#kalenteri")}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-[17px] font-semibold text-white shadow-[0_10px_24px_rgba(78,49,146,0.25)] transition hover:opacity-90"
            >
              Katso tulevat tunnit <span aria-hidden="true">→</span>
            </a>
            <a
              href={site.phoneHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-white px-7 text-[17px] font-semibold text-accent transition hover:bg-lilac-soft"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
              </svg>
              <span className="sr-only">Soita: </span>
              {site.phone}
            </a>
          </div>

          <NextClass />

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-ink-soft short:hidden">
            {trust.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pysäytyspainike: aria-pressed kertoo ruudunlukijalle tilan.
          Oikeassa yläkulmassa, koska alareunan päälle nousevat pikalinkkikortit peittäisivät sen. */}
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? "Käynnistä taustan liike" : "Pysäytä taustan liike"}
        className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-border bg-white/90 text-accent transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:hidden short:hidden"
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
