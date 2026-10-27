Liikunta_hyvinvointi_web/
├── README.md                        ● Projektin kuvaus ja käynnistysohjeet
├── .gitignore                       ● (luo create-next-app web/-kansioon)
│
├── materiaalit/                     ● Lähdemateriaalit, ei koodia
│   ├── logo/
│   │   └── tahkon-amanda-logo.png
│   ├── kuvitus/
│   │   ├── tahko-hero.svg
│   │   ├── tahko-hero-lapinakyva.svg
│   │   └── tahko-hero.png
│   ├── mockupit/                    Versio B ja referenssikuvat
│   └── kuvat/                       Amandan omat valokuvat
│
├── docs/                            ● Dokumentaatio
│   ├── sisalto.md                   Palvelut, tekstit, hinnat, yhteystiedot
│   ├── sopimus.md                   Laajuus, omistajuus, ylläpito
│   ├── tietoturvatarkistus.md       7 kohdan tarkistus ennen julkaisua
│   └── luovutus.md                  Ohjeet Amandalle sisällön muokkaamiseen
│
├── web/                             ● Next.js-sivusto (React)
│   ├── package.json                 ●
│   ├── next.config.ts               ●
│   ├── tsconfig.json                ●
│   ├── .env.local                   Salaisuudet (API-avaimet), EI Gitiin
│   ├── .env.example                 Mallipohja ilman oikeita arvoja
│   │
│   ├── public/                      ● Staattiset tiedostot sellaisenaan
│   │   ├── logo.png
│   │   └── tahko-hero.svg
│   │
│   └── src/
│       ├── app/                     ● Reitit (App Router)
│       │   ├── layout.tsx           ● Yhteinen runko: fontit, Header, Footer
│       │   ├── page.tsx             ● Etusivu, kokoaa osiot yhteen
│       │   ├── globals.css          ● Tailwind ja värimuuttujat
│       │   ├── tietosuoja/
│       │   │   └── page.tsx         Tietosuojaseloste
│       │   └── api/
│       │       └── revalidate/
│       │           └── route.ts     Sanityn webhook (päivittää sivun)
│       │
│       ├── components/
│       │   ├── layout/
│       │   │   ├── TopBar.tsx       Paikkakunnat + puhelin
│       │   │   ├── Header.tsx       Navigaatio + mobiilivalikko
│       │   │   └── Footer.tsx       Yhteystiedot, alueet, kumppanit
│       │   ├── sections/            Etusivun osiot järjestyksessä
│       │   │   ├── Hero.tsx
│       │   │   ├── QuickLinks.tsx
│       │   │   ├── Services.tsx     Liikunta / Hyvinvointi -välilehdet
│       │   │   ├── WhyMove.tsx      Liikunta & hyvinvointi
│       │   │   ├── Pricing.tsx
│       │   │   ├── About.tsx        Minusta
│       │   │   ├── Calendar.tsx     Tulevat tunnit (Google-kalenteri)
│       │   │   └── InstagramFeed.tsx  Behold-karuselli
│       │   └── ui/                  Pienet uudelleenkäytettävät palat
│       │       ├── Button.tsx
│       │       ├── SectionHeading.tsx
│       │       └── Reveal.tsx       Scroll reveal -animaatio
│       │
│       ├── lib/                     Logiikka ilman käyttöliittymää
│       │   ├── calendar.ts          Google Calendar -haku + "lisää kalenteriin"
│       │   ├── sanity.ts            Sanity-asiakas ja GROQ-kyselyt
│       │   └── site.ts              Vakiot: nimi, Y-tunnus, yhteystiedot
│       │
│       └── types/
│           └── index.ts             Yhteiset TypeScript-tyypit
│
└── studio/                          Sanity Studio (Amandan muokkausnäkymä)
    ├── sanity.config.ts
    └── schemas/
        ├── siteSettings.ts          Yhteystiedot, some, alueet
        ├── hero.ts
        ├── service.ts
        ├── price.ts
        └── about.ts