# Tahkon Amanda – sivusto (Vite)

Tahkon Amandan verkkosivusto uudelleenrakennettuna samalla mallilla kuin GlossTahko:
**Vite + React + TypeScript**, ja buildissa jokainen sivu **esirenderöidään valmiiksi HTML:ksi**.
Ulkoasu on sama kuin aiemmassa Next.js-versiossa (`../web/`), jonka tilalle tämä tulee.

## Komennot

| Komento | Mitä tekee |
|---|---|
| `npm run dev` | Kehityspalvelin, http://localhost:5173 |
| `npm run build` | Tuotantobuild kansioon `dist/` (tyypit → selainversio → palvelinversio → esirenderöinti) |
| `npm run build:pages` | Build GitHub Pages -testiversiota varten (alipolku, noindex) |
| `node scripts/serve.mjs` | Tarjoilee `dist/`-kansion kuten oikea hosting (404.html), http://localhost:4173 |
| `npm run check` | Tyyppitarkistus, oxlint ja yksikkötestit |
| `npm run test:e2e` | Playwright-savutestit selaimessa (tekee buildin itse) |

## Rakenne

```
site/
├── index.html               # HTML-pohja: <!--app-head--> ja <!--app-html--> täytetään buildissa
├── scripts/
│   ├── prerender.mjs        # Esirenderöinti, 404.html, sitemap.xml, robots.txt
│   ├── build-pages.mjs      # GitHub Pages -build
│   └── serve.mjs            # Paikallinen staattinen palvelin testeille
├── e2e/                     # Playwright-savutestit
└── src/
    ├── main.tsx             # Selain: fontit, tyylit, hydraatio
    ├── entry-server.tsx     # Build: render(path) ja sivukohtaiset <head>-tagit
    ├── App.tsx              # Yhteinen asettelu (ohituslinkki, yläpalkki, alatunniste)
    ├── routes.tsx           # Sivut, otsikot ja kuvaukset (uusi sivu = rivi tähän)
    ├── pages/               # Etusivu, lakisivut ja 404
    ├── components/          # layout/, sections/ (hero/: versiot A, B ja C), ui/
    └── lib/                 # Sisältö: site, services, pricing, about, photos, calendar, seo
```

## Hero-versio

Etusivun yläosasta on kolme versiota. Valinta tehdään tiedostossa `src/lib/site.ts`:

```ts
heroVariant: "c", // "a" = tumma tekstilaatikko, "b" = sulautuvat kuvat, "c" = liikkuva tausta
```

## Sisällön muokkaus

Tekstit, palvelut, hinnat ja yhteystiedot ovat `src/lib/`-kansiossa. Hakasulkeissa olevat
arvot (esim. `[HINTA] €`) ovat paikkamerkkejä, jotka odottavat tietoa Amandalta.
Lista: `../docs/sisalto.md`.
