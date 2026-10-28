# Tahkon Amanda – verkkosivusto

[![CI](https://github.com/PennasenKake/Liikunta_hyvinvointi_web/actions/workflows/ci.yml/badge.svg)](https://github.com/PennasenKake/Liikunta_hyvinvointi_web/actions/workflows/ci.yml)

> **EN:** Website for a wellness and fitness business in Tahko, Finland. Built with Next.js 16, TypeScript and Tailwind CSS v4. Accessible (WCAG 2.1 AA), fast and fully custom-designed. Content management via Sanity and class schedule via Google Calendar are in progress.

Responsiivinen verkkosivusto liikunta- ja hyvinvointipalveluita tarjoavalle Tahkon Amandalle.
Toiminta-alue: Tahko, Siilinjärvi, Kuopio ja Rautavaara.

![Tahkon Amandan verkkosivuston etusivu työpöydällä ja puhelimessa](docs/kuvat/esikatselu.jpg)

🔗 **Sivusto:** tahkonamanda.fi *(julkaistaan myöhemmin)*
🔍 **Demo:** *(esikatseluversio tulossa)*

## Teknologiat

| Osa | Teknologia |
|---|---|
| Sovelluskehys | Next.js 16 (App Router, Server Components) |
| Kieli | TypeScript |
| Tyylit | Tailwind CSS v4 |
| Sisällönhallinta | Sanity *(tulossa)* |
| Tapahtumat | Google Calendar API *(tulossa)* |
| Instagram-syöte | Behold *(tulossa)* |

## Ominaisuudet

- [x] Yläpalkki: pienenee ja piiloutuu vieritettäessä, alavalikot palveluihin, mobiilivalikko
- [x] Hero-osio omalla Tahko-kuvituksella
- [x] Palvelut: Liikunta ja Hyvinvointi rinnakkain, mobiilissa avautuvat kuvaukset
- [x] Miksi liikkua, Hinnasto ja Minusta (osin paikkamerkkisisällöllä)
- [x] Tulevat tunnit: lisäys omaan kalenteriin ja jakaminen *(esimerkkidata, Google-kalenteri tulossa)*
- [x] Instagram-karuselli *(väliaikaiset kuvat, Behold-syöte tulossa)*
- [x] Footer: yhteystiedot, alueet, kumppanit, Y-tunnus
- [x] 404-sivu
- [x] Saavutettavuus WCAG 2.1 AA (axe-core: 0 löydöstä)
- [x] Automaattiset savutestit (Playwright) ja CI (GitHub Actions)
- [ ] Scroll reveal -animaatiot
- [ ] Hakukoneoptimointi: Open Graph, rakennetieto, sitemap
- [ ] Sisällön muokkaus kirjautumalla (Sanity Studio)

## Tekniset ratkaisut

**Server Components oletuksena.** Valtaosa sivusta renderöidään palvelimella HTML:ksi, eikä selaimeen lähetetä niille JavaScriptiä. Client Componentteja ovat vain ne osat, joissa on tilaa tai selaimen rajapintoja: yläpalkin vierityslogiikka, alavalikot, mobiilivalikko, palvelurivin avautuminen ja jakopainike. Esimerkiksi yläpalkin sisältö renderöidään palvelimella, ja vain sen vierityskäyttäytyminen ajetaan selaimessa.

**Data erillään näkymästä.** Palvelut, hinnat, kalenteri, kuvat ja yhteystiedot ovat `web/src/lib/`-kansiossa. Komponentit vain näyttävät datan. Kun sisältö siirtyy Sanityyn ja Google-kalenteriin, muutokset tehdään `lib/`-tiedostoihin eikä komponentteihin tarvitse koskea.

**Välimuisti valmiina rajapinnoille.** Kalenterihaku käyttää Next.js 16:n `"use cache"`-direktiiviä. Etusivu on staattinen ja päivittyy välimuistista, joten Google Calendar API:a ei kutsuta jokaisella sivulatauksella.

**Saavutettavuus rakenteessa, ei jälkikäteen.**
- Semanttinen HTML: `<dl>` hinnastossa, `<address>` yhteystiedoissa, `<time>` tapahtumissa
- Alavalikot WAI-ARIA Disclosure -mallilla (hiiri, näppäimistö ja kosketus), näppäimistöllä vieritettävä karuselli
- Näkyvä fokusrengas, kosketusalueet vähintään 44 px, `prefers-reduced-motion`-tuki
- Kaikkien värien kontrasti laskettu: teksti 6,8–9,6:1 (AA vaatii 4,5:1)

**Suorituskyky.** Fontit ladataan `next/font`-työkalulla omalta palvelimelta (ei pyyntöjä Googleen kävijän selaimesta). Kuvat optimoidaan `next/image`-komponentilla, jolloin puhelin lataa noin 90 kt:n WebP-version 500 kt:n alkuperäisen sijaan. Etusivun kokonaiskoko on noin 360 kt.

**Oma visuaalinen identiteetti.** Tahko-kuvitus ja vektorilogo on piirretty SVG:nä: kuvituksessa ovat Tahkovuoren rinteet, Tahkon portaat, Panorama-tuolihissi, Tahkolahti ja ponttonisilta. Värit ja fontit on määritelty yhteen paikkaan Tailwind v4:n `@theme`-lohkoon.

**Aikavyöhykkeet.** Kellonajat muotoillaan aina `Europe/Helsinki`-aikavyöhykkeellä, joten ne näkyvät oikein, vaikka palvelin olisi ulkomailla.

## Hakemistorakenne

```
├── web/           Next.js-sivusto
│   └── src/
│       ├── app/          Reitit (etusivu, 404, tietosuoja)
│       ├── components/   layout/ · sections/ · ui/
│       └── lib/          Data ja apufunktiot
├── materiaalit/   Logo ja kuvitus (lähdetiedostot)
├── docs/          Projektin dokumentaatio
└── studio/        Sanity Studio (tulossa)
```

Tarkempi rakenne ja tiedostojen tila: [docs/hakemistorakenne.md](docs/hakemistorakenne.md).
Asiakkaalta odotettava sisältö: [docs/sisalto.md](docs/sisalto.md).

## Käynnistys paikallisesti

Vaatimukset: Node.js 20.9 tai uudempi.

```bash
cd web
npm install
npm run dev
```

Sivu aukeaa osoitteeseen http://localhost:3000.

| Komento | Tarkoitus |
|---|---|
| `npm run dev` | Kehityspalvelin |
| `npm run check` | Tyyppitarkistus ja ESLint (aja ennen committia) |
| `npm run build` | Tuotantobuild |
| `npm run start` | Tuotantobuildin ajaminen paikallisesti |
| `npm run test:e2e` | Savutestit selaimessa (tekee buildin itse) |

Savutestit ([`web/e2e/`](web/e2e/)) tarkistavat työpöytä- ja mobiiliprofiililla, että etusivu latautuu ilman rikkinäisiä resursseja, navigaatio ja välilehdet toimivat ja olematon osoite palauttaa tilakoodin 404. Ennen ensimmäistä ajoa asenna testiselain: `npx playwright install chromium`.

GitHub Actions ajaa tarkistuksen, buildin ja savutestit automaattisesti jokaisesta pushista ja pull requestista ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)).

## Ympäristömuuttujat

Sivusto toimii toistaiseksi ilman ympäristömuuttujia. Integraatioita varten kopioi
[`web/.env.example`](web/.env.example) tiedostoksi `web/.env.local` ja täytä arvot.
`.env.local` ei koskaan mene versionhallintaan.

## Oikeudet

Koodi on julkisesti nähtävissä portfoliotarkoituksessa.
Logo, tekstit, kuvat ja kuvitukset ovat Tahkon Amandan omaisuutta,
eikä niitä saa käyttää ilman lupaa. Tarkemmin: [LICENSE](LICENSE).

## Tekijä

Eero Korhonen – [github.com/PennasenKake](https://github.com/PennasenKake)
