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
├── .github/workflows/excel-testi.yml  ✅ Excel-tuntilistan lataustesti käsin (ei julkaise)
├── .github/workflows/tuotanto.yml     ✅ Tuotantojulkaisu Cloudflareen (pois päältä, kunnes TUOTANTO_KAYTOSSA=true)
│
├── cloudflare/                        Tuotannon Cloudflare-Worker (docs/tuotanto.md)
│   ├── src/index.js                   ✅ Ajastin 15 min, Päivitä nyt -sivu, 404-ohjaus
│   ├── wrangler.jsonc                 ✅ Sivuston tiedostot, ajastin, verkkotunnus
│   ├── scripts/tarkista-dist.mjs      ✅ Estää julkaisun omalta koneelta tai testibuildista
│   └── test/index.test.mjs            ✅ Workerin testit (node --test)
│
├── materiaalit/                       Lähdemateriaalit, ei sivuston koodia
│   ├── logo/
│   │   ├── tahkon-amanda-logo.svg     ✅ Täysi logo, vektori (päätiedosto)
│   │   ├── tahkon-amanda-logo.png     ✅ 1024 px, läpinäkyvä (some, Canva, tulosteet)
│   │   ├── tahkon-amanda-logo-tausta.svg / .png  ✅ Violetilla neliötaustalla (profiilikuvat)
│   │   ├── logo-merkki.svg            ✅ Ympyrä ja vuoristo ilman tekstejä (favicon)
│   │   └── logo-512.png               ✅ 512 px rasteriversio
│   ├── mockups/                       🔒 Mockupit ja referenssikuvat (tekijänoikeudet)
│   └── kuvat/                         🔒 Amandan valokuvat alkuperäiskoossa
│
├── docs/                              Dokumentaatio
│   ├── kuvat/esikatselu.jpg           ✅ README:n kuvakaappaus
│   ├── hakemistorakenne.md            ✅ Tämä tiedosto
│   ├── muistiinpanot.md               ✅ Verkkosivuston suunnitelma
│   ├── sisalto.md                     ✅ Palvelut, tekstit, hinnat, yhteystiedot
│   ├── kalenteri.md                   ✅ Tuntikalenterin käyttöönotto ja ylläpito
│   ├── excel-ja-forms.md              ✅ Tuntilista Excelistä ja Forms-ilmoittautuminen: testaus ja käyttöönotto
│   ├── pohjat/tunnit-pohja.xlsx       ✅ Amandan tuntilistapohja
│   ├── seo.md                         ✅ Hakukoneoptimointi: mitä on valmiina, tarkistus, julkaisun muistilista
│   ├── tietoturvatarkistus.md         ✅ 7 kohdan tarkistus ennen julkaisua
│   ├── luovutus.md                    ✅ Ohjeet Amandalle: tunnit, ilmoittautumiset, mitä lähettää Eerolle
│   ├── tuotanto.md                    ✅ Cloudflare-käyttöönotto, ajastin, Päivitä nyt, vianetsintä
│   └── sopimus.md                     🔒 Laajuus, omistajuus, ylläpito
│
├── site/                              Sivusto (Vite, React, TypeScript, Tailwind)
│   ├── package.json                   ✅ Skriptit: dev, build, build:pages, check, test, test:e2e
│   ├── index.html                     ✅ HTML-pohja (<!--app-head-->, <!--app-html-->)
│   ├── vite.config.ts                 ✅ Lisäosat (React, Tailwind), base-polku, @-alias, Vitest
│   ├── playwright.config.ts           ✅ Savutestien asetukset (työpöytä + mobiili)
│   ├── .env.example                   ✅ VITE_SITE_URL, VITE_NOINDEX, VITE_GSC_VERIFICATION, kalenterin avaimet
│   ├── .oxlintrc.json                 ✅ Lint-säännöt
│   ├── scripts/
│   │   ├── prerender.mjs              ✅ Esirenderöinti, 404.html, sitemap.xml, robots.txt, manifest, .ics, paikkamerkkivahti
│   │   ├── fetch-calendar.mjs         ✅ Tulevat tunnit buildissa: Excel, Google-kalenteri tai esimerkkitunnit
│   │   ├── fetch-excel.mjs            ✅ Excel-tuntilistan lataus OneDrivesta ja luku
│   │   ├── optimize-images.mjs        ✅ WebP-kuvaversiot (sharp)
│   │   ├── build-pages.mjs            ✅ GitHub Pages -build (alipolku, noindex, .nojekyll)
│   │   └── serve.mjs                  ✅ Paikallinen staattinen palvelin (testit ja esikatselu)
│   ├── e2e/savutesti.spec.ts          ✅ Playwright-savutestit
│   ├── public/
│   │   ├── kuvat/                     ✅ Sivun valokuvat (pienennetyt)
│   │   ├── logo.svg                   ✅ Logo
│   │   ├── koristeet/                ✅ Lootusmandalan neljä kerrosta (tausta, ulko- ja sisäkehä, keskus)
│   │   ├── _headers                   ✅ Tuotannon HTTP-otsakkeet (CSP, HSTS, välimuisti)
│   │   └── icon-48/96/192.png, icon.png, apple-icon.png, opengraph-image.png  ✅ Ikonit ja jakokuva
│   └── src/
│       ├── main.tsx                   ✅ Selain: fontit, tyylit, hydraatio
│       ├── entry-server.tsx           ✅ Build: render(path) ja sivukohtaiset <head>-tagit
│       ├── App.tsx                    ✅ Yhteinen asettelu: ohituslinkki, yläpalkki, alatunniste
│       ├── routes.tsx                 ✅ Sivut, otsikot ja kuvaukset
│       ├── routes.test.ts             ✅ Vitest: reitit, otsikot ja kuvaukset (pituus, yksilöllisyys)
│       ├── index.css                  ✅ Tailwind-teema, vierityspaljastus, vuoristoviiva, heron kuvat, hengitysharjoitus, lootusmandala
│       ├── pages/                     ✅ Home, kayttoehdot, tietosuoja, evasteet, saavutettavuus, NotFound
│       ├── components/
│       │   ├── layout/                ✅ Header, HeaderShell, NavDropdown, MobileMenu, Footer
│       │   ├── sections/              ✅ Etusivun osiot (Hero, Palvelut, Miksi liikkua, Hengähdä hetki, Kalenteri, Hinnasto, Minusta, Instagram)
│       │   │   └── hero/              ✅ Hero, HeroSlides (vaihtuvat kuvat), NextClass (seuraava tunti)
│       │   ├── ui/                    ✅ Image, Link, ButtonLink, TahkoLine, LotusMandala, EmailText, LegalPage ym.
│       │   └── RevealOnScroll.tsx     ✅ Vierityspaljastus
│       └── lib/                       ✅ site, services, pricing, about, photos, instagram, calendar, contact, lotus, seo, paths
│                                         (+ *.test.ts: kalenteri, yhteydenotto, hengitysrytmi, rakennetieto)
```

## Periaatteet

- **`pages/` sisältää vain sivut ja `routes.tsx` niiden tiedot.** Käyttöliittymä on `components/`-kansiossa, joten sivutiedostot pysyvät lyhyinä.
- **`components/` on kolmessa tasossa:** `layout/` näkyy kaikilla sivuilla, `sections/` on etusivun palat ja `ui/` pienet palikat, joita osiot käyttävät.
- **`lib/` erottaa datan näkymästä.** Kun data siirtyy CMS:ään tai Google-kalenteriin, muutos tehdään vain `lib/`-kansioon.
- **`materiaalit/` sisältää alkuperäiset tiedostot, `site/public/` vain sivulla käytettävät.** Kaikki `public/`-kansion tiedostot ovat julkisesti ladattavissa.
