# Hakemistorakenne

Projektin kansiorakenne ja sen tila. Päivitä tätä, kun tiedostoja lisätään tai siirretään.

**Merkinnät:** ✅ valmis · ⬜ tulossa · 🔒 ei versionhallinnassa (`.gitignore`)

```
Liikunta_hyvinvointi_web/
├── README.md                          ✅ Projektin kuvaus, teknologiat ja käynnistysohjeet
├── .gitignore                         ✅ Juuren säännöt: mockupit, kuvat, sopimus, editorit
├── .gitattributes                     ✅ LF-rivinvaihdot, kuvat binäärisinä
├── LICENSE                            ✅ Kaikki oikeudet pidätetään (koodi nähtävissä portfoliona)
├── .github/workflows/ci.yml           ✅ GitHub Actions: check, build ja savutestit jokaisesta pushista
├── .github/workflows/pages.yml        ✅ Testiversion julkaisu GitHub Pagesiin
│
├── materiaalit/                       Lähdemateriaalit, ei sivuston koodia
│   ├── logo/
│   │   ├── tahkon-amanda-logo.svg     ✅ Täysi logo, vektori (päätiedosto)
│   │   ├── tahkon-amanda-logo.png     ✅ 1024 px, läpinäkyvä (some, Canva, tulosteet)
│   │   ├── tahkon-amanda-logo-tausta.svg / .png  ✅ Violetilla neliötaustalla (profiilikuvat)
│   │   ├── logo-merkki.svg            ✅ Ympyrä ja vuoristo ilman tekstejä (favicon)
│   │   └── logo-512.png               ✅ 512 px rasteriversio
│   ├── kuvitus/
│   │   ├── tahko-hero.svg             ✅ Hero-kuvitus taivastaustalla
│   │   ├── tahko-hero-lapinakyva.svg  ✅ Ilman taivasta (sama kuin web/public/tahko-hero.svg)
│   │   └── tahko-hero.png             ✅ 4800 × 1400 px (some, esitykset)
│   ├── mockups/                       🔒 Mockupit ja referenssikuvat (tekijänoikeudet)
│   └── kuvat/                         🔒 Amandan valokuvat alkuperäiskoossa
│
├── docs/                              Dokumentaatio
│   ├── kuvat/esikatselu.jpg           ✅ README:n kuvakaappaus
│   ├── hakemistorakenne.md            ✅ Tämä tiedosto
│   ├── muistiinpanot.md               ✅ Verkkosivuston suunnitelma
│   ├── sisalto.md                     ✅ Palvelut, tekstit, hinnat, yhteystiedot
│   ├── tietoturvatarkistus.md         ⬜ 7 kohdan tarkistus ennen julkaisua
│   ├── luovutus.md                    ⬜ Ohjeet Amandalle sisällön muokkaamiseen
│   └── sopimus.md                     🔒 Laajuus, omistajuus, ylläpito
│
├── web/                               Next.js-sivusto (React, TypeScript, Tailwind)
│   ├── package.json                   ✅ Skriptit: dev, build, start, lint, check, test:e2e
│   ├── playwright.config.ts           ✅ Savutestien asetukset (työpöytä + mobiili)
│   ├── scripts/build-pages.mjs        ✅ Staattinen build GitHub Pagesia varten (npm run build:pages)
│   ├── e2e/
│   │   └── savutesti.spec.ts          ✅ Etusivu, navigaatio, alavalikot, yläpalkki, palvelut, 404, tietosuoja
│   ├── next.config.ts                 ✅
│   ├── tsconfig.json                  ✅
│   ├── eslint.config.mjs              ✅
│   ├── AGENTS.md                      ✅ Next.js:n ohjeet tekoälyavustajille
│   ├── .env.example                   ✅ Ympäristömuuttujien mallipohja
│   ├── .env.local                     🔒 Salaisuudet (API-avaimet)
│   │
│   ├── public/                        Staattiset tiedostot, näkyvät sivulla juuripolusta
│   │   ├── logo.svg                   ✅ Täysi logo (Header), SVGO-optimoitu (56 kt → 22 kt)
│   │   ├── kuvat/                     ✅ Amandan valokuvat pakattuina (8 kpl)
│   │   └── tahko-hero.svg             ✅ Hero-kuvitus läpinäkyvänä
│   │
│   └── src/
│       ├── app/                       Reitit (App Router)
│       │   ├── layout.tsx             ✅ Yhteinen runko: fontit, metatiedot, Header
│       │   ├── page.tsx               ✅ Etusivu, kokoaa osiot yhteen
│       │   ├── not-found.tsx          ✅ 404-sivu
│       │   ├── globals.css            ✅ Tailwind-teema: värit ja fontit
│       │   ├── icon.png               ✅ Favicon (logomerkistä)
│       │   ├── apple-icon.png         ✅ iPhonen kotinäytön kuvake
│       │   ├── robots.ts              ✅ /robots.txt (esikatselussa indeksointi kielletty)
│       │   ├── sitemap.ts             ✅ /sitemap.xml
│       │   ├── opengraph-image.png    ✅ Jakokuva 1200 × 630 (+ .alt.txt)
│       │   ├── kayttoehdot/page.tsx   ✅ Käyttöehdot (luonnos, TODO(Amanda))
│       │   ├── tietosuoja/page.tsx    ✅ Tietosuojaseloste (luonnos)
│       │   ├── evasteet/page.tsx      ✅ Evästeasetukset (sivusto ei aseta evästeitä)
│       │   └── saavutettavuus/page.tsx ✅ Saavutettavuusseloste
│       │
│       ├── components/
│       │   ├── RevealOnScroll.tsx     ✅ Paljastusanimaatio vieritettäessä (data-reveal)
│       │   ├── layout/                Näkyvät jokaisella sivulla
│       │   │   ├── Header.tsx         ✅ Logo ja navigaatio (Server Component)
│       │   │   ├── HeaderShell.tsx    ✅ Pieneneminen ja piiloutuminen vieritettäessä (Client Component)
│       │   │   ├── NavDropdown.tsx    ✅ Työpöydän alavalikot Liikunta/Hyvinvointi (Client Component)
│       │   │   ├── MobileMenu.tsx     ✅ Hampurilaisvalikko alavalikoineen (Client Component)
│       │   │   └── Footer.tsx         ✅ Sivusto, Yhteystiedot, Tietoa ja ehdot, kumppanit
│       │   ├── sections/              Etusivun osiot järjestyksessä
│       │   │   ├── Hero.tsx           ✅ Otsikko, painikkeet, Tahko-kuvitus
│       │   │   ├── NextClassCard.tsx  ✅ "Seuraava tunti" -kortti
│       │   │   ├── QuickLinks.tsx     ✅ Neljä pikalinkkiä
│       │   │   ├── Services.tsx       ✅ Palvelut-osio: Liikunta ja Hyvinvointi rinnakkain (Server Component)
│       │   │   ├── ServiceItem.tsx    ✅ Palvelurivi, mobiilissa avautuva kuvaus (Client Component)
│       │   │   ├── WhyMove.tsx        ✅ Miksi liikkua ja levätä
│       │   │   ├── Pricing.tsx        ✅ Hinnasto
│       │   │   ├── About.tsx          ✅ Minusta
│       │   │   ├── Calendar.tsx       ✅ Tulevat tunnit (esimerkkidata, Google-kalenteri vaiheessa 7)
│       │   │   ├── ShareButton.tsx    ✅ Tapahtuman jakaminen (Client Component)
│       │   │   ├── InstagramFeed.tsx  ✅ Instagram-osio (Behold myöhemmin)
│       │   │   └── InstagramCarousel.tsx ✅ Karuselli: nuolet, pyyhkäisy, scroll-snap (Client Component)
│       │   └── ui/                    Pienet uudelleenkäytettävät palat
│       │       ├── LegalPage.tsx      ✅ Tietosivujen yhteinen runko
│       │       ├── TahkoLine.tsx      ✅ Vuoristosiluetti osioiden välissä, vierityssidonnainen viiva
│       │       ├── ButtonLink.tsx     ✅ Painikkeen näköinen linkki (primary/secondary)
│       │       ├── PlaceholderImage.tsx ✅ Paikkamerkki puuttuvalle valokuvalle
│       │       ├── SectionHeading.tsx ✅ Osioiden yhteinen otsikko
│       │       ├── ServiceIcon.tsx    ✅ Palvelujen viivakuvakkeet (myös alavalikoissa)
│       │
│       └── lib/                       Data ja logiikka ilman käyttöliittymää
│           ├── site.ts                ✅ Nimi, yhteystiedot, Y-tunnus, navigaatio
│           ├── services.ts            ✅ Palvelut, kuvakkeet, kuvaukset ja varaustapa
│           ├── pricing.ts             ✅ Hinnasto
│           ├── about.ts               ✅ Minusta-osion sisältö
│           ├── calendar.ts            ✅ Tapahtumat (esimerkkidata) ja "lisää kalenteriin"
│           ├── photos.ts              ✅ Valokuvien polut, alt-tekstit ja mitat
│           ├── instagram.ts           ✅ Instagram-julkaisujen malli ja väliaikaiset julkaisut
│           ├── seo.ts                 ✅ Sivuston osoite, noindex-tila ja LocalBusiness-rakennetieto
│           ├── paths.ts               ✅ withBase(): alipolku kuviin ja linkkeihin (GitHub Pages)
│           └── sanity.ts              ⬜ Sanity-asiakas ja kyselyt
│
└── studio/                            ⬜ Sanity Studio (Amandan muokkausnäkymä)
    ├── sanity.config.ts
    └── schemas/                       siteSettings, hero, service, price, about
```

## Periaatteet

- **`app/` sisältää vain reitit.** Käyttöliittymä on `components/`-kansiossa, joten sivutiedostot pysyvät lyhyinä.
- **`components/` on kolmessa tasossa:** `layout/` näkyy kaikilla sivuilla, `sections/` on etusivun palat ja `ui/` pienet palikat, joita osiot käyttävät.
- **`lib/` erottaa datan näkymästä.** Kun data siirtyy Sanityyn tai Google-kalenteriin, muutos tehdään vain `lib/`-kansioon.
- **`materiaalit/` sisältää alkuperäiset tiedostot, `web/public/` vain sivulla käytettävät.** Kaikki `public/`-kansion tiedostot ovat julkisesti ladattavissa.
