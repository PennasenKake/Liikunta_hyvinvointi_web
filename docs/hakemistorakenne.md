# Hakemistorakenne

Projektin kansiorakenne ja sen tila. Päivitä tätä, kun tiedostoja lisätään tai siirretään.

**Merkinnät:** ✅ valmis · ⬜ tulossa · 🔒 ei versionhallinnassa (`.gitignore`)

```
Liikunta_hyvinvointi_web/
├── README.md                          ✅ Projektin kuvaus, teknologiat ja käynnistysohjeet
├── .gitignore                         ✅ Juuren säännöt: mockupit, kuvat, sopimus, editorit
├── .gitattributes                     ✅ LF-rivinvaihdot, kuvat binäärisinä
├── LICENSE                            ✅ Kaikki oikeudet pidätetään (koodi nähtävissä portfoliona)
├── .github/workflows/ci.yml           ✅ GitHub Actions: tarkistukset, build ja savutestit jokaisesta pushista
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
│   │   ├── tahko-hero-lapinakyva.svg  ✅ Ilman taivasta (sama kuin site/public/tahko-hero.svg)
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
├── site/                              Sivusto (Vite, React, TypeScript, Tailwind)
│   ├── package.json                   ✅ Skriptit: dev, build, build:pages, check, test, test:e2e
│   ├── index.html                     ✅ HTML-pohja (<!--app-head-->, <!--app-html-->)
│   ├── vite.config.ts                 ✅ Lisäosat (React, Tailwind), base-polku, @-alias, Vitest
│   ├── playwright.config.ts           ✅ Savutestien asetukset (työpöytä + mobiili)
│   ├── .env.example                   ✅ VITE_SITE_URL, VITE_NOINDEX
│   ├── .oxlintrc.json                 ✅ Lint-säännöt
│   ├── scripts/
│   │   ├── prerender.mjs              ✅ Esirenderöinti, 404.html, sitemap.xml, robots.txt
│   │   ├── build-pages.mjs            ✅ GitHub Pages -build (alipolku, noindex, .nojekyll)
│   │   └── serve.mjs                  ✅ Paikallinen staattinen palvelin (testit ja esikatselu)
│   ├── e2e/savutesti.spec.ts          ✅ Playwright-savutestit
│   ├── public/
│   │   ├── kuvat/                     ✅ Sivun valokuvat (pienennetyt)
│   │   ├── logo.svg, tahko-hero.svg   ✅ Logo ja Tahko-kuvitus
│   │   ├── koristeet/                ✅ Lootusmandalan neljä kerrosta (tausta, ulko- ja sisäkehä, keskus)
│   │   └── icon.png, apple-icon.png, opengraph-image.png  ✅ Ikonit ja jakokuva
│   └── src/
│       ├── main.tsx                   ✅ Selain: fontit, tyylit, hydraatio
│       ├── entry-server.tsx           ✅ Build: render(path) ja sivukohtaiset <head>-tagit
│       ├── App.tsx                    ✅ Yhteinen asettelu: ohituslinkki, yläpalkki, alatunniste
│       ├── routes.tsx                 ✅ Sivut, otsikot ja kuvaukset
│       ├── routes.test.ts             ✅ Vitest-yksikkötestit
│       ├── index.css                  ✅ Tailwind-teema, vierityspaljastus, vuoristoviiva, hero C
│       ├── pages/                     ✅ Home, kayttoehdot, tietosuoja, evasteet, saavutettavuus, NotFound
│       ├── components/
│       │   ├── layout/                ✅ Header, HeaderShell, NavDropdown, MobileMenu, Footer
│       │   ├── sections/              ✅ Etusivun osiot (Hero, Palvelut, Miksi liikkua, Hinnasto, Minusta, Kalenteri, Instagram)
│       │   │   └── hero/              ✅ HeroA–D (D käytössä), NextClass
│       │   ├── ui/                    ✅ Image, Link, ButtonLink, TahkoLine, LotusMandala, LegalPage ym.
│       │   └── RevealOnScroll.tsx     ✅ Vierityspaljastus
│       └── lib/                       ✅ site, services, pricing, about, photos, instagram, calendar, seo, paths
```

## Periaatteet

- **`pages/` sisältää vain sivut ja `routes.tsx` niiden tiedot.** Käyttöliittymä on `components/`-kansiossa, joten sivutiedostot pysyvät lyhyinä.
- **`components/` on kolmessa tasossa:** `layout/` näkyy kaikilla sivuilla, `sections/` on etusivun palat ja `ui/` pienet palikat, joita osiot käyttävät.
- **`lib/` erottaa datan näkymästä.** Kun data siirtyy CMS:ään tai Google-kalenteriin, muutos tehdään vain `lib/`-kansioon.
- **`materiaalit/` sisältää alkuperäiset tiedostot, `site/public/` vain sivulla käytettävät.** Kaikki `public/`-kansion tiedostot ovat julkisesti ladattavissa.
