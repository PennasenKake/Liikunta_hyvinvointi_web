// InstagramFeed.tsx: Instagram-osio (kuten GlossTahkon sivustolla).
// Server Component: otsikko ja linkit renderöidään palvelimella, karuselli on oma Client Componentinsa.
//
// NYT: väliaikaiset julkaisut (lib/instagram.ts → previewPosts), ei ulkoisia pyyntöjä.
// MYÖHEMMIN (Behold): julkaisut haetaan syötteestä vasta kävijän luvalla, ja
// alatunnisteen Evästeasetukset-linkki palauttaa valinnan (malli: GlossTahko).

import { previewPosts } from "@/lib/instagram";
import { site } from "@/lib/site";
import InstagramCarousel from "./InstagramCarousel";

export default function InstagramFeed() {
  const { handle, url } = site.instagram;

  return (
    <section id="instagram" aria-labelledby="instagram-otsikko" className="bg-surface px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Pieni keskitetty otsikko, kuten GlossTahkossa: kuvat ovat osion pääosa */}
        <p
          id="instagram-otsikko"
          data-reveal="fade"
          className="mb-6 text-center text-[13px] font-semibold uppercase tracking-[0.25em] text-accent"
        >
          Instagramissa{" "}
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              @{handle}
            </a>
          ) : (
            <span>@{handle}</span>
          )}
        </p>

        <div data-reveal>
          <InstagramCarousel posts={previewPosts} />
        </div>

        {/* Seuraa-painike näytetään, kun oikea osoite on lisätty site.ts:ään (TODO(Amanda)) */}
        {url && (
          <div className="mt-6 flex justify-center">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center rounded-md border border-border bg-white px-6 font-semibold text-accent transition hover:border-accent"
            >
              Seuraa Instagramissa
              <span className="sr-only"> (uusi välilehti)</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
