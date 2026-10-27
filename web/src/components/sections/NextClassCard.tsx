// NextClassCard.tsx: Heron "Seuraava tunti" -kortti.
// Komponentti saa kaiken tiedon propseina eikä tiedä, mistä data tulee.
// Nyt data on kovakoodattu, myöhemmin se haetaan Google-kalenterista
// (lib/calendar.ts) ilman, että tähän tiedostoon tarvitsee koskea.

// Tyyppi kuvaa yhden tunnin tiedot. export, jotta muut tiedostot voivat käyttää sitä.
export type ClassInfo = {
  title: string; // esim. "Vesijumppa"
  when: string;  // esim. "ti 3.11. klo 18.00"
  place: string; // esim. "Tahko"
};

export default function NextClassCard({ title, when, place }: ClassInfo) {
  return (
    // Koko kortti on linkki kalenteriosioon, joten klikkausalue on iso.
    <a
      href="#kalenteri"
      className="mt-3 flex w-full max-w-xs flex-col gap-1.5 rounded-2xl border border-line bg-white px-6 py-5 shadow-[0_10px_30px_rgba(34,29,74,0.08)] transition hover:border-border"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-accent">
        Seuraava tunti
      </span>
      <span className="font-serif text-3xl font-bold leading-tight">{title}</span>
      <span className="text-[15px] text-muted">
        {when} · {place}
      </span>
      {/* aria-hidden: nuoli on koriste, ruudunlukija ohittaa sen */}
      <span className="mt-2 text-[15px] font-semibold text-accent">
        Katso kaikki tunnit <span aria-hidden="true">→</span>
      </span>
    </a>
  );
}