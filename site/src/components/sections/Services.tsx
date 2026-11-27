// Services.tsx: etusivun Palvelut-osio: kolme korttia, jotka vievät palvelujen omille sivuille
// (Liikunta, Hyvinvointi, Valmennus). Tekstit tulevat services.ts:stä.
//
// Kortit pitävät etusivun lyhyenä: yksityiskohdat, tasojako ja "Sopii"-tekstit ovat omilla sivuillaan
// (pages/palvelusivu.tsx), joissa Amandan teksteille ja kuville on tilaa.
// Koko kortti on yksi linkki, joten kosketusalue on suuri ja näppäimistöllä yksi Tab-pysähdys.

import Image from "@/components/ui/Image";
import Link from "@/components/ui/Link";
import { photos, type Photo } from "@/lib/photos";
import { serviceCategories, type ServiceCategory } from "@/lib/services";

// Osan ilme: sama värikoodi ja kuva etusivun kortissa, palvelusivulla ja "Tutustu myös" -korteissa.
// hero/line = palvelusivun yläosan tausta ja sitä vastaava vuoristosiluetin väri (TahkoLine).
// TODO(Amanda): kuvat vaihdetaan Amandan valitsemiin (lib/photos.ts).
export const categoryStyles: Record<
  ServiceCategory["id"],
  { box: string; hero: string; line: "lilac-soft" | "sky" | "sand"; icon: string; chip: string; link: string; photo: Photo }
> = {
  liikunta: {
    box: "bg-lilac-soft", hero: "bg-lilac-soft", line: "lilac-soft",
    icon: "bg-lilac text-accent", chip: "bg-lilac text-accent", link: "text-accent",
    photo: photos.ulkotreeni,
  },
  hyvinvointi: {
    box: "bg-sky-soft", hero: "bg-sky", line: "sky",
    icon: "bg-sky text-sky-ink", chip: "bg-sky text-sky-ink", link: "text-sky-ink",
    photo: photos.aanimaljat,
  },
  valmennus: {
    box: "bg-sand", hero: "bg-sand", line: "sand",
    icon: "bg-sand text-accent", chip: "bg-sand text-accent", link: "text-accent",
    photo: photos.sekuntikello,
  },
};

export default function Services() {
  return (
    <section id="palvelut" aria-labelledby="palvelut-otsikko" className="bg-white px-6 pb-24 pt-24">
      <div className="mx-auto max-w-6xl">
        <h2 id="palvelut-otsikko" data-reveal className="mb-2.5 font-serif text-[clamp(2.5rem,6vw,3.5rem)] font-semibold leading-tight">
          Palvelut
        </h2>
        <p className="mb-10 max-w-md text-[17px] leading-relaxed text-muted">
          Tunteja eri kuntotasoille. Kysy rohkeasti, jos et tiedä mistä aloittaa.
        </p>

        {/* Puhelimessa kortit allekkain (kuva ylhäällä), tabletilla allekkain vaakakortteina
            (kuva vasemmalla), työpöydällä kolme rinnakkain. Kolme kapeaa saraketta tabletilla
            rivittäisi pitkät nimet ("Kristallimaljarentoutus") hankalasti. */}
        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
          {serviceCategories.map((cat) => {
            const style = categoryStyles[cat.id];
            // Kortin palvelulista: neljä ensimmäistä, loput "…"-merkillä
            const names = cat.services.map((s) => s.title);
            const preview = names.length > 4 ? `${names.slice(0, 4).join(", ")}…` : names.join(", ");
            return (
              <li key={cat.id} id={cat.id} data-reveal className="scroll-mt-28">
                <Link
                  href={cat.path}
                  className={`group flex h-full flex-col overflow-hidden rounded-3xl transition sm:flex-row lg:flex-col hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(34,29,74,0.4)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transition-none ${style.box}`}
                >
                  {/* Kuva: zoomaa hieman hoverissa (ei vähennetyn liikkeen tilassa) */}
                  <span className="relative block shrink-0 overflow-hidden bg-white/50 sm:w-2/5 lg:w-full">
                    <Image
                      src={style.photo.src}
                      srcSet={style.photo.srcSet}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 40vw, 100vw"
                      alt=""
                      width={style.photo.width}
                      height={style.photo.height}
                      className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none sm:absolute sm:inset-0 sm:aspect-auto sm:h-full lg:static lg:aspect-[16/10] lg:h-auto"
                    />
                  </span>
                  <span className="flex grow flex-col gap-3 p-7 lg:p-8">
                    <h3 className="font-serif text-[40px] font-bold leading-none">{cat.label}</h3>
                    <span className="text-[17px] leading-relaxed text-ink-soft">{cat.card}</span>
                    <span className="text-[15px] text-muted">{preview}</span>
                    <span className={`mt-auto pt-2 font-semibold ${style.link}`}>
                      {cat.cardLink}{" "}
                      <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1 motion-reduce:transition-none">
                        →
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
