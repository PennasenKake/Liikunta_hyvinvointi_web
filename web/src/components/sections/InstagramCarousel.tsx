// InstagramCarousel.tsx: Instagram-julkaisujen karuselli (kuten GlossTahkon sivustolla).
// Client Component: nuolipainikkeiden tila riippuu vierityskohdasta.
//
// Toiminta:
// - Sivusuuntainen vieritys, kortit "tarttuvat" paikalleen (scroll-snap).
// - Pyyhkäisy (kosketus), nuolinäppäimet (kun lista on fokuksessa) ja nuolipainikkeet.
// - Nuoli on pois käytöstä reunassa, ja nuolet piiloutuvat, jos kaikki kortit mahtuvat näkyviin.
// - Kapealla näytöllä 1 kortti ja seuraava pilkistää, tabletilla 2, leveällä 3.
"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatPostDate, type InstagramPost } from "@/lib/instagram";

const KIND_LABEL: Record<InstagramPost["kind"], string> = {
  image: "",
  video: "Video",
  album: "Kuvakaruselli",
};

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Yksi kortti: neliökuva, päivämäärä ja kahdelle riville rajattu teksti.
// Linkki vain, jos julkaisulla on osoite (väliaikaisilla julkaisuilla ei ole).
function Tile({ post }: { post: InstagramPost }) {
  const date = formatPostDate(post.timestamp);
  const kind = KIND_LABEL[post.kind];

  const content = (
    <>
      <span className="relative block aspect-square overflow-hidden rounded-2xl border border-line bg-lilac-soft">
        <Image
          src={post.photo.src}
          alt={post.photo.alt}
          fill
          sizes="(min-width: 992px) 360px, (min-width: 640px) 50vw, 80vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        {/* Video- tai karusellimerkki kulmassa. Koriste: tieto on sr-only-tekstissä. */}
        {kind && (
          <span
            aria-hidden="true"
            className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-ink/60 text-xs text-white"
          >
            {post.kind === "video" ? "▶" : "❐"}
          </span>
        )}
      </span>
      <span className="mt-2.5 block">
        {date && <span className="block text-xs tracking-[0.12em] text-muted">{date}</span>}
        <span className="mt-0.5 line-clamp-2 block text-[15px] leading-snug">{post.caption}</span>
      </span>
      {kind && <span className="sr-only"> ({kind})</span>}
    </>
  );

  return (
    // relative: kortin sr-only-tekstit (position: absolute) asemoituvat kortin sisään.
    // Ilman tätä ne karkaisivat vierityslistan ulkopuolelle ja leventäisivät koko sivua.
    <li className="relative shrink-0 grow-0 basis-[78%] snap-start sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]">
      {post.permalink ? (
        <a
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-2xl focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent"
        >
          {content}
          <span className="sr-only"> (avaa Instagramissa, uusi välilehti)</span>
        </a>
      ) : (
        <div className="group">{content}</div>
      )}
    </li>
  );
}

export default function InstagramCarousel({ posts }: { posts: InstagramPost[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  // Ollaanko vierityksen alussa / lopussa (nuolien käytöstä poisto)
  const [edges, setEdges] = useState({ start: true, end: true });

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setEdges({ start: track.scrollLeft <= 4, end: max - track.scrollLeft <= 4 });
  }, []);

  // Päivitetään nuolet vierittäessä ja ikkunan koon muuttuessa.
  // ResizeObserver huomaa myös listan oman koon muutokset (esim. kuvien latautuminen).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    update();
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update, posts]);

  // Vieritys "sivu kerrallaan": kapealla yksi kortti, leveällä kaikki näkyvät kortit
  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    const step = first ? first.getBoundingClientRect().width + 16 : track.clientWidth; // 16 = gap-4
    const count = Math.max(1, Math.floor(track.clientWidth / step));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * step * count, behavior: reduce ? "auto" : "smooth" });
  };

  const noOverflow = edges.start && edges.end;
  const arrow =
    "absolute top-[38%] z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-ink shadow-[0_4px_14px_rgba(34,29,74,0.18)] transition hover:bg-accent hover:text-white disabled:cursor-default disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent sm:inline-flex";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        disabled={edges.start}
        hidden={noOverflow}
        aria-label="Edelliset julkaisut"
        className={`${arrow} left-2`}
      >
        <Chevron direction="left" />
      </button>

      {/* tabIndex={0}: lista on näppäimistöllä vieritettävä (WCAG 2.1.1).
          Vierityspalkki piilotetaan, koska nuolet ja pyyhkäisy korvaavat sen. */}
      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label="Instagram-julkaisut, vieritä sivuttain"
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain rounded-2xl pb-2 pt-1 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((post) => (
          <Tile key={post.id} post={post} />
        ))}
      </ul>

      <button
        type="button"
        onClick={() => scrollByPage(1)}
        disabled={edges.end}
        hidden={noOverflow}
        aria-label="Seuraavat julkaisut"
        className={`${arrow} right-2`}
      >
        <Chevron direction="right" />
      </button>
    </div>
  );
}
