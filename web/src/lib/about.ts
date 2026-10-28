// about.ts: Minusta-osion sisältö.
// TODO(Amanda): esittely omin sanoin, koulutukset ja valokuva.
// Hakasulkeissa olevat tekstit ovat paikkamerkkejä.

export const about = {
  heading: "Hei, olen Amanda",
  paragraphs: [
    "[Esittely: tausta, koulutus ja miten päädyit ohjaamaan liikuntaa ja rentoutusta.]",
    "[Millainen ohjaaja olet ja mitä tunneiltasi voi odottaa.]",
  ],
  certifications: ["[Koulutus 1]", "[Koulutus 2]", "[Sertifikaatti]"],

  // photo: null = näytetään paikkamerkki. Kuva tulee kansioon web/public/kuvat/,
  // esim. { src: "/kuvat/amanda.jpg", alt: "Amanda ohjaa vesijumppaa Tahkolla" }.
  photo: null as { src: string; alt: string } | null,
};
