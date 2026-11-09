// SectionHeading.tsx: osioiden yhteinen otsikkorakenne.
// Yläotsikko (kursiivi), pääotsikko ja ingressi samalla tyylillä joka osiossa.
// Kun otsikkotyyliä muutetaan, muutos tehdään vain tähän tiedostoon.

type Props = {
  eyebrow?: string;            // Pieni yläotsikko, esim. "Liikunta & hyvinvointi"
  title: string;               // Pääotsikko (h2)
  intro?: string;              // Lyhyt ingressi otsikon alla
  align?: "left" | "center";   // Tasaus, oletuksena vasen
  id?: string;                 // Otsikon id, jos osio viittaa siihen aria-labelledby-attribuutilla
};

export default function SectionHeading({ eyebrow, title, intro, align = "left", id }: Props) {
  // Keskitetyssä tasauksessa myös ingressi keskitetään ja sen leveyttä rajataan
  const center = align === "center";

  return (
    <div data-reveal className={`mb-10 flex flex-col gap-3 ${center ? "items-center text-center" : ""}`}>
      {eyebrow && <p className="font-serif text-2xl italic text-accent">{eyebrow}</p>}
      {/* clamp: otsikko skaalautuu 36 px:stä 56 px:iin näytön leveyden mukaan */}
      <h2 id={id} className="font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05]">
        {title}
      </h2>
      {intro && <p className={`max-w-xl text-[17px] leading-relaxed text-muted ${center ? "mx-auto" : ""}`}>{intro}</p>}
    </div>
  );
}
