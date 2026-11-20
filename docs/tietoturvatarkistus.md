# Tietoturvatarkistus ennen julkaisua

Seitsemän kohdan tarkistus sovellettuna tähän sivustoon. Sivusto on staattinen: ei tietokantaa,
kirjautumista, omia lomakkeita eikä maksuja. Ainoa palvelinkoodi on tuotannon Cloudflare-Worker
(`cloudflare/src/index.js`): ajastin ja avaimella suojattu Päivitä nyt -sivu. Siksi osa kohdista ei koske sitä nyt,
mutta ne on kirjattu, jotta tarkistus tehdään uudelleen, kun sivustolle lisätään toimintoja
(oma yhteydenottolomake, CMS, Instagram-syöte).

Tarkistettu: 16.11.2026 (haara `rebuild/vite`), Worker 20.11.2026.

| # | Kohta | Tilanne tällä sivustolla | Tila |
|---|---|---|---|
| 1 | **Salaisuudet** | Ks. taulukot alla. Salaisuudet ovat vain GitHubin salaisuuksissa (ympäristö `tuotanto`, vain main-haara) ja Workerin salaisuuksissa. Git-historiassa ei ole avaimia (`AIza…`, `ghp_`, `github_pat_`) eikä `.env`- tai `.dev.vars`-tiedostoja, ja ne ovat `.gitignore`ssa. | ✅ |
| 2 | **Omistajuus (API-reitit)** | Yksi reitti: `/paivita`. Ilman oikeaa avainta (`PAIVITYS_AVAIN`, vakioaikainen vertailu) vastaus on sama 404 kuin olemattomalle sivulle. GET ei käynnistä mitään, vain painikkeen POST. Reitti voi vain käynnistää tuotantotyönkulun, ei muuttaa tietoja. | ✅ |
| 3 | **Tietokannan säännöt** | Ei tietokantaa. Ilmoittautumiset ovat Amandan lomakkeessa (Microsoft tai Google Forms): tarkista, ettei lomakkeen *Jaa tulokset* -yhteenvetolinkkiä ole jaettu julkisesti. | ⬜ Amanda |
| 4 | **Mass assignment / syötteiden tarkistus** | Sivu ei vastaanota syötteitä. Ulkoinen data (Google-kalenterin tekstit) käsitellään tekstinä: HTML poistetaan (`fetch-calendar.mjs`), Preact koodaa tekstin, rakennetiedon JSON koodataan (`jsonLdString`, yksikkötesti). | ✅ |
| 5 | **Maksut** | Ei maksuja sivustolla. Hinnat ovat vain tietoa (`lib/pricing.ts`). | – |
| 6 | **Pyyntörajat** | Päivitä nyt ei käynnistä uutta ajoa, jos edellinen on jonossa tai käynnissä, ja työnkulun `concurrency` sallii yhden kerrallaan. Muuttumaton ajo ei julkaise. Workersin ilmainen kiintiö (100 000/vrk) estää kustannukset, vaikka avain vuotaisi. | ✅ |
| 7 | **Todista (käyttäjä A / B)** | Ei käyttäjiä. Korvaavat automaattitestit: CSP sallii vain sivun oman inline-skriptin (`headers.test.mjs`), XSS-koodaus (`seo.test.ts`), saavutettavuus ja rakenne (`e2e/`), Workerin väärä avain → 404 ja GET ei käynnistä mitään (`cloudflare/test/`). | ✅ |

## Ympäristömuuttujat

| Muuttuja | Päätyykö selaimeen | Huomio |
|---|---|---|
| `VITE_SITE_URL` | Kyllä | Julkinen osoite, ei salaisuus |
| `VITE_NOINDEX` | Kyllä | Esikatselulippu, ei salaisuus |
| `VITE_GSC_VERIFICATION` | Kyllä | Search Consolen vahvistuskoodi näkyy sivun lähdekoodissa tarkoituksella |
| `GOOGLE_CALENDAR_ID` | Kyllä, osittain | Julkisen kalenterin tunnus näkyy tilauslinkissä. Ei salaisuus, koska kalenteri on julkinen |
| `SCHEDULE_EXCEL_URL` | **Ei** | Excel-tuntilistan jakolinkki, vain GitHubin salaisuuksissa ja buildissa. Ei tulosteta lokiin. Tiedostosta luetaan vain aikataulusarakkeet |
| `CLOUDFLARE_API_TOKEN` | **Ei** | Ympäristö `tuotanto`. Malli *Edit Cloudflare Workers*, rajattu Amandan tiliin ja tahkonamanda.fi:hin |
| `CLOUDFLARE_ACCOUNT_ID` | **Ei** | Ympäristö `tuotanto`. Ei varsinainen salaisuus, mutta pidetään samassa paikassa |
| `GITHUB_TOKEN` (Worker) | **Ei** | Workerin salaisuus. Fine-grained, vain tämä repo, vain *Actions: Read and write*, voimassa 1 vuosi |
| `PAIVITYS_AVAIN` (Worker) | **Ei** | Workerin salaisuus, 24 satunnaista tavua. Amandan kirjanmerkissä. Osoitteen avain ei vuoda: `Referrer-Policy: no-referrer`, `no-store` |
| `GOOGLE_API_KEY` | **Ei** | Vain GitHubin salaisuuksissa ja buildissa. Rajaa Google Cloudissa vain Calendar API:in. Jos avain on joskus ollut koodissa tai chatissa, luo uusi ja poista vanha |

## Muut suojaukset

- **HTTP-otsakkeet** (`site/public/_headers`, Cloudflare Workers): CSP, HSTS, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`. GitHub Pages -testiversiossa nämä eivät ole voimassa.
- **Riippuvuudet:** `npm audit` 0 haavoittuvuutta (16.11.2026). Dependabot ehdottaa päivitykset viikoittain.
- **GitHub Actions:** toiminnot lukittu SHA-tunnisteeseen, `persist-credentials: false`, vähimmät oikeudet.
- **Ulkoiset linkit:** Forms avautuu `rel="noopener noreferrer"` -määreellä.
- **Ei evästeitä eikä seurantaa:** kävijän tietoja ei kerätä sivustolla lainkaan.

## Ennen julkaisua

- [ ] `GOOGLE_API_KEY` rajattu Calendar API:in Google Cloud Consolessa
- [ ] Forms: tulosten jakolinkki ei julkinen, vastaukset vain Amandan tilillä
- [ ] Cloudflare: HTTPS pakotettu, `www` → `tahkonamanda.fi`, otsakkeet voimassa (tarkistus: securityheaders.com)
- [ ] `JULKAISU=1 npm run build` menee läpi (ei paikkamerkkejä, oikea kalenteri)
- [ ] Workerin tarkistukset 1–9 tehty (`docs/tuotanto.md`), `workers_dev` pois, kun oma osoite toimii
- [ ] GitHub-tunnuksen vanhenemismuistutus kalenterissa

## Kun sivustolle lisätään toimintoja

**Oma yhteydenottolomake** (reitti samaan Cloudflare-Workeriin): kohdat 4 ja 6 tulevat voimaan. Tarvitaan tiukka skeema
(nimi, sähköposti, viesti, ei muita kenttiä), roskapostisuoja (Cloudflare Turnstile ja piilokenttä),
pyyntöraja IP-osoitetta kohden ja sähköpostipalvelun avain vain palvelimella. Tietosuojaselosteeseen
lisätään lomakkeen tiedot.

**CMS (esim. Sveltia):** kirjautuminen GitHub-tilillä. Kohta 2: vain Amandalla ja Eerolla kirjoitusoikeus repoon.
