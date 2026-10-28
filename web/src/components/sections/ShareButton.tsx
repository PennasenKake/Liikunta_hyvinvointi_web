// ShareButton.tsx: tapahtuman jakopainike.
// Client Component, koska käyttää selaimen rajapintoja (navigator.share, clipboard).
//
// Puhelimessa avautuu käyttöjärjestelmän jakovalikko (WhatsApp, viestit jne.).
// Jos selain ei tue jakamista (useimmat työpöytäselaimet), linkki kopioidaan leikepöydälle.
"use client";

import { useState } from "react";

type Props = {
  title: string; // Esim. "Vesijumppa"
  text: string;  // Esim. "ti 3.11. klo 18.00 · Tahko"
};

export default function ShareButton({ title, text }: Props) {
  // copied = näytetäänkö "Kopioitu"-ilmoitus hetken ajan
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}/#kalenteri`;
    const data = { title: `${title} – Tahkon Amanda`, text, url };

    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(`${data.title}\n${text}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Ilmoitus katoaa kahden sekunnin päästä
      }
    } catch {
      // Käyttäjä sulki jakovalikon: ei virhettä näytettävänä
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={share}
        aria-label={`Jaa tapahtuma: ${title}`}
        className="inline-flex size-11 items-center justify-center rounded-md bg-sky text-ink transition hover:bg-sky-strong"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
        </svg>
      </button>
      {/* aria-live: ruudunlukija ilmoittaa kopioinnin, vaikka fokus ei siirry */}
      <span aria-live="polite" className="sr-only">{copied ? "Linkki kopioitu leikepöydälle" : ""}</span>
      {copied && <span className="text-sm font-medium text-accent">Kopioitu</span>}
    </>
  );
}
