# Hakemistorakenne

Projektin kansiorakenne ja sen tila. Päivitä tätä, kun tiedostoja lisätään tai siirretään.

**Merkinnät:** ✅ valmis · ⬜ tulossa · 🔒 ei versionhallinnassa (`.gitignore`)

```
Liikunta_hyvinvointi_web/
├── README.md                          ✅ Projektin kuvaus, teknologiat ja käynnistysohjeet
├── .gitignore                         ✅ Juuren säännöt: mockupit, kuvat, sopimus, editorit
├── .gitattributes                     ✅ LF-rivinvaihdot, kuvat binäärisinä
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
│   │   └── tahko-hero.png             ✅ 2880 × 1400 px (some, esitykset)
│   ├── mockups/                       🔒 Mockupit ja referenssikuvat (tekijänoikeudet)
│   └── kuvat/                         🔒 Amandan valokuvat alkuperäiskoossa
│
├── docs/                              Dokumentaatio
│   ├── hakemistorakenne.md            ✅ Tämä tiedosto
│   ├── muistiinpanot.md               ✅ Verkkosivuston suunnitelma
│   ├── sisalto.md                     ✅ Palvelut, tekstit, hinnat, yhteystiedot
│   ├── tietoturvatarkistus.md         ⬜ 7 kohdan tarkistus ennen julkaisua
│   ├── luovutus.md                    ⬜ Ohjeet Amandalle sisällön muokkaamiseen
│   └── sopimus.md                     🔒 Laajuus, omistajuus, ylläpito
│
├── web/                               Next.js-sivusto (React, TypeScript, Tailwind)
│   ├── package.json                   ✅ Skriptit: dev, build, start, lint, check
│   ├── next.config.ts                 ✅
│   ├── tsconfig.json                  ✅
│   ├── eslint.config.mjs              ✅
│   ├── AGENTS.md                      ✅ Next.js:n ohjeet tekoälyavustajille
│   ├── .env.example                   ⬜ Ympäristömuuttujien mallipohja
│   ├── .env.local                     🔒 Salaisuudet (API-avaimet)
│   │
│   ├── public/                        Staattiset tiedostot, näkyvät sivulla juuripolusta
│   │   ├── logo.svg                   ✅ Täysi logo (Header)
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
│       │   └── tietosuoja/
│       │       └── page.tsx           ✅ Tietosuojaseloste (paikkamerkki)
│       │
│       ├── components/
│       │   ├── layout/                Näkyvät jokaisella sivulla
│       │   │   ├── Header.tsx         ✅ Logo ja navigaatio (Server Component)
│       │   │   ├── MobileMenu.tsx     ✅ Hampurilaisvalikko (Client Component)
│       │   │   └── Footer.tsx         ✅ Yhteystiedot, alueet, kumppanit, Y-tunnus
│       │   ├── sections/              Etusivun osiot järjestyksessä
│       │   │   ├── Hero.tsx           ✅ Otsikko, painikkeet, Tahko-kuvitus
│       │   │   ├── NextClassCard.tsx  ✅ "Seuraava tunti" -kortti
│       │   │   ├── QuickLinks.tsx     ✅ Neljä pikalinkkiä
│       │   │   ├── Services.tsx       ✅ Palvelut-osio (Server Component)
│       │   │   ├── ServiceTabs.tsx    ✅ Liikunta/Hyvinvointi-välilehdet (Client Component)
│       │   │   ├── WhyMove.tsx        ✅ Miksi liikkua ja levätä
│       │   │   ├── Pricing.tsx        ✅ Hinnasto
│       │   │   ├── About.tsx          ✅ Minusta
│       │   │   ├── Calendar.tsx       ✅ Tulevat tunnit (esimerkkidata, Google-kalenteri vaiheessa 7)
│       │   │   ├── ShareButton.tsx    ✅ Tapahtuman jakaminen (Client Component)
│       │   │   └── InstagramFeed.tsx  ✅ Paikkamerkit (Behold vaiheessa 8)
│       │   └── ui/                    Pienet uudelleenkäytettävät palat
│       │       ├── ButtonLink.tsx     ✅ Painikkeen näköinen linkki (primary/secondary)
│       │       ├── PlaceholderImage.tsx ✅ Paikkamerkki puuttuvalle valokuvalle
│       │       ├── SectionHeading.tsx ✅ Osioiden yhteinen otsikko
│       │       └── Reveal.tsx         ⬜ Scroll reveal -animaatio
│       │
│       └── lib/                       Data ja logiikka ilman käyttöliittymää
│           ├── site.ts                ✅ Nimi, yhteystiedot, Y-tunnus, navigaatio
│           ├── services.ts            ✅ Palvelut kategorioittain
│           ├── pricing.ts             ✅ Hinnasto
│           ├── about.ts               ✅ Minusta-osion sisältö
│           ├── calendar.ts            ✅ Tapahtumat (esimerkkidata) ja "lisää kalenteriin"
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
