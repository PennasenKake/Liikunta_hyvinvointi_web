# Hakukoneoptimointi (SEO)

Mitä sivustolla on valmiina, miten sen tarkistaa ja mitä pitää tehdä ennen julkaisua ja sen jälkeen.
Tavoite on paikallinen haku: "vesijumppa Kuopio", "jooga Siilinjärvi", "liikunta Tahko".

## Valmiina koodissa

| Asia | Missä | Miksi |
|---|---|---|
| Jokainen sivu valmiina HTML:nä | `scripts/prerender.mjs` | Google näkee sisällön ilman JavaScriptiä |
| Sivukohtainen otsikko ja kuvaus | `src/routes.tsx` | Hakutuloksen otsikko ja teksti. Testit tarkistavat pituuden ja yksilöllisyyden (`routes.test.ts`) |
| Canonical-osoite | `src/entry-server.tsx` | Sama sivu ei näy hakutuloksissa kahdella osoitteella |
| Open Graph -jakokuva ja -tekstit | `src/entry-server.tsx`, `public/opengraph-image.png` | Esikatselu Facebookissa, WhatsAppissa ja muissa |
| LocalBusiness-rakennetieto | `src/lib/seo.ts` | Yritys, palvelualue (4 paikkakuntaa), palvelut, puhelin, ilmoittautumislinkki ja hinnat, kun ne on syötetty |
| WebSite-rakennetieto | `src/lib/seo.ts` | Sivuston nimi ja kieli hakutulokseen |
| Tunnit tapahtumina (Event) | `src/lib/seo.ts`, `src/pages/Home.tsx` | Google voi näyttää tunnit tapahtumahaussa. Vain oikeasta Google-kalenterista, ei esimerkkitunteja |
| `sitemap.xml` ja `robots.txt` | `scripts/prerender.mjs` | Google löytää kaikki sivut. Kalenteritiedostot (`/tunnit/`) jätetään pois |
| Ikonit 48, 96 ja 192 px ja manifest | `index.html`, `public/icon-*.png`, `scripts/prerender.mjs` | Google näyttää ikonin hakutuloksessa vain, jos se on 48 px:n monikerta |
| Testiversio pois hakukoneista | `VITE_NOINDEX=1` (`npm run build:pages`) | GitHub Pages -versio ei kilpaile oikean sivuston kanssa |
| Paikkamerkkivahti | `scripts/prerender.mjs` | `JULKAISU=1 npm run build` pysähtyy, jos tekstissä on vielä esim. `[HINTA]` |
| Nopeus ja saavutettavuus | Koko sivusto | Sivun nopeus vaikuttaa hakusijoitukseen. Lighthouse: nopeus 91, saavutettavuus 100 |

**Sisältö tekee suurimman työn.** Paikkakunnat ovat otsikossa, kuvauksessa, heron tekstissä ja
rakennetiedossa. Jokaisella palvelulla on oma kuvaus ja oma ankkuri (`/#vesijumppa`), johon voi linkittää.

## Tarkistus

```bash
npm run check          # Yksikkötestit: otsikot, kuvaukset, rakennetieto, hintojen tulkinta
npm run test:e2e       # Selaintestit: robots, sitemap, canonical, otsikkotasot, alt-tekstit, ikonit
```

Verkossa, kun sivu on julkaistu:

- Rakennetieto: [search.google.com/test/rich-results](https://search.google.com/test/rich-results)
- Jakokuva: [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)
- Nopeus: [pagespeed.web.dev](https://pagespeed.web.dev/)

## Ennen julkaisua (tahkonamanda.fi)

1. **Tekstit valmiiksi.** `JULKAISU=1 npm run build` listaa jäljellä olevat paikkamerkit. Hinnat (`src/lib/pricing.ts`)
   menevät rakennetietoon automaattisesti, kun ne ovat muotoa `25 €`.
2. **Tunneille oikea paikka.** Tapahtumat näkyvät Googlessa vain, jos paikassa on paikkakunta
   (esim. "Kylpylä Kunnonpaikka, Siilinjärvi"). Paikkakunnan pitää olla viimeisenä pilkun jälkeen.
3. **Instagram-osoite** `src/lib/site.ts`:ään: se lisätään rakennetietoon (`sameAs`).
4. **Domain Cloudflareen.** Ohjaa `www.tahkonamanda.fi` → `tahkonamanda.fi` (yksi osoite, ei kahta samaa sivua).
5. **Julkaisubuild** ilman `VITE_NOINDEX`-muuttujaa: `VITE_SITE_URL=https://tahkonamanda.fi`.

## Julkaisun jälkeen

1. **Google Search Console:** lisää sivusto, vahvista DNS-tietueella Cloudflaressa (tai metatagilla:
   `VITE_GSC_VERIFICATION`) ja lähetä `https://tahkonamanda.fi/sitemap.xml`.
2. **Google-yritysprofiili (Google Business Profile)** on paikallisessa haussa tärkein yksittäinen asia.
   Amanda luo sen itse palvelualueyrityksenä ilman katuosoitetta: alueet Tahko, Siilinjärvi, Kuopio ja Rautavaara,
   verkkosivuksi tahkonamanda.fi. Kuvia ja arvosteluja kannattaa kerätä profiiliin säännöllisesti.
3. **Bing Webmaster Tools:** tiedot voi tuoda suoraan Search Consolesta.
4. **Linkit sivulle:** Instagram-profiili, Facebook, yhteistyökumppanit (Tahko, Nilsiän Yrittäjät) ja
   paikalliset tapahtumakalenterit. Sama nimi, puhelin ja alue kaikkialla.
5. **Seuranta:** Search Consolesta näkee kuukauden välein, millä hakusanoilla sivu löytyy.

## Ylläpito

- **Sisällön päivitys:** muuta `CONTENT_UPDATED` (`src/lib/seo.ts`), kun tekstit muuttuvat. Päivämäärä menee sitemapiin.
- **Uusi sivu:** lisää rivi `src/routes.tsx`:ään. Sitemap, otsikko, kuvaus ja canonical tulevat automaattisesti,
  ja testit varmistavat, ettei otsikko tai kuvaus ole liian pitkä tai sama kuin toisella sivulla.
- **Palvelusivut:** `/liikunta/`, `/hyvinvointi/` ja `/valmennus/` omine otsikoineen, kuvauksineen ja murupolkuineen (BreadcrumbList). Rakennetiedon palvelukatalogi linkittää niihin.
- **Myöhemmin harkittavaa:** omat sivut yksittäisille palveluille (esim. `/vesijumppa/`), jos haku halutaan
  kohdistaa tarkemmin. Yksi tarkka sivu per palvelu sijoittuu paremmin kuin yksi yleissivu.
