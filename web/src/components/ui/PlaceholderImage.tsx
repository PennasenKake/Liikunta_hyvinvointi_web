// PlaceholderImage.tsx: paikkamerkki puuttuvalle valokuvalle.
// Näyttää katkoviivakehyksen ja tekstin, joka kertoo mitä kuvaa odotetaan.
// Kun oikea kuva tulee, paikkamerkki vaihdetaan next/image-komponenttiin.

type Props = {
  label: string;      // Mitä kuvaa odotetaan, esim. "Kuva Amandasta"
  className?: string; // Koko ja muoto kutsujalta (korkeus, pyöristys)
};

export default function PlaceholderImage({ label, className = "" }: Props) {
  return (
    // role="img" + aria-label: ruudunlukija kertoo, että tässä on (tuleva) kuva
    <div
      role="img"
      aria-label={label}
      className={`flex items-center justify-center border-2 border-dashed border-border bg-white/70 p-6 text-center font-medium text-muted ${className}`}
    >
      [{label}]
    </div>
  );
}
