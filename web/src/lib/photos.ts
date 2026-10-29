// photos.ts: sivuston valokuvat yhdessä paikassa.
// Kuvat ovat kansiossa web/public/kuvat/. Alkuperäiset (täysikokoiset) ovat
// kansiossa materiaalit/kuvat/, joka ei ole versionhallinnassa.
//
// Jokaisella kuvalla on alt-teksti, joka kertoo ruudunlukijan käyttäjälle,
// mitä kuvassa on. Hyvä alt-teksti kuvaa sisällön, ei sanaa "kuva".

export type Photo = {
  src: string;
  alt: string;
  width: number;  // Alkuperäiset mitat: next/image varaa tilan valmiiksi,
  height: number; // jolloin sivu ei "hypi" kuvan latautuessa (CLS)
};

export const photos = {
  vesijumppa: { src: "/kuvat/vesijumppa-allas.jpg", alt: "Vesijumppapainot altaan reunalla", width: 1440, height: 1440 },
  joogasali: { src: "/kuvat/joogasali.jpg", alt: "Joogamatot ja -blokit valmiina salissa, ikkunasta näkyy mäntymetsä", width: 1200, height: 1600 },
  ulkotreeni: { src: "/kuvat/ulkotreeni-kentta.jpg", alt: "Joogamatto, sekuntikello ja vesipullo ulkotreenissä tekonurmella", width: 1200, height: 1600 },
  sekuntikello: { src: "/kuvat/sekuntikello-kentta.jpg", alt: "Sekuntikello kädessä urheilukentällä järven rannalla", width: 1286, height: 1286 },
  inbody: { src: "/kuvat/inbody-mittaus.jpg", alt: "InBody-kehonkoostumusmittari ja tulostettu mittausraportti", width: 480, height: 480 },
  joogablokit: { src: "/kuvat/joogablokit.jpg", alt: "Vaaleanpunaisia ja mintunvihreitä joogablokkeja", width: 480, height: 480 },
  aanimaljat: { src: "/kuvat/aanimaljat.jpg", alt: "Kolme äänimaljaa lampaantaljalla lootuskynttilöiden ja valojen keskellä", width: 1200, height: 1600 },
  aanimaljatJarvi: { src: "/kuvat/aanimaljat-jarvi.jpg", alt: "Äänimalja kädessä terassilla järvimaiseman edessä", width: 480, height: 600 },
} satisfies Record<string, Photo>; // satisfies: tarkistaa tyypin, mutta säilyttää avainten nimet automaattitäydennystä varten
