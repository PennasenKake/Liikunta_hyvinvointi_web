# Tietoturvatarkistus ennen julkaisua

Seitsemän kohdan tarkistus sovellettuna tähän sivustoon. Sivusto on staattinen: ei palvelinta,
tietokantaa, kirjautumista, omia lomakkeita eikä maksuja. Siksi osa kohdista ei koske sitä nyt,
mutta ne on kirjattu, jotta tarkistus tehdään uudelleen, kun sivustolle lisätään toimintoja
(oma yhteydenottolomake, CMS, Instagram-syöte).

Tarkistettu: 16.11.2026 (haara `rebuild/vite`).

| # | Kohta | Tilanne tällä sivustolla | Tila |
|---|---|---|---|
| 1 | **Salaisuudet** | Ks. taulukko alla. Ainoa salaisuus `GOOGLE_API_KEY` on vain GitHubin salaisuuksissa ja buildissa. Git-historiassa ei ole avaimia (`AIza…`) eikä `.env`-tiedostoja, ja `.env.*` on `.gitignore`ssa. | ✅ |
| 2 | **Omistajuus (API-reitit)** | Ei API-reittejä. Sivusto on valmiita HTML-tiedostoja. | – |
| 3 | **Tietokannan säännöt** | Ei tietokantaa. Ilmoittautumiset ovat Amandan lomakkeessa (Microsoft tai Google Forms): tarkista, ettei lomakkeen *Jaa tulokset* -yhteenvetolinkkiä ole jaettu julkisesti. | ⬜ Amanda |
| 4 | **Mass assignment / syötteiden tarkistus** | Sivu ei vastaanota syötteitä. Ulkoinen data (Google-kalenterin tekstit) käsitellään tekstinä: HTML poistetaan (`fetch-calendar.mjs`), Preact koodaa tekstin, rakennetiedon JSON koodataan (`jsonLdString`, yksikkötesti). | ✅ |
| 5 | **Maksut** | Ei maksuja sivustolla. Hinnat ovat vain tietoa (`lib/pricing.ts`). | – |
| 6 | **Pyyntörajat** | Ei omia rajapintoja. Calendar API -kutsuja noin 24 päivässä buildista, kiintiö 1 000 000. | – |
| 7 | **Todista (käyttäjä A / B)** | Ei käyttäjiä. Korvaavat automaattitestit: CSP sallii vain sivun oman inline-skriptin (`headers.test.mjs`), XSS-koodaus (`seo.test.ts`), saavutettavuus ja rakenne (`e2e/`). | ✅ |

## Ympäristömuuttujat

| Muuttuja | Päätyykö selaimeen | Huomio |
|---|---|---|
| `VITE_SITE_URL` | Kyllä | Julkinen osoite, ei salaisuus |
| `VITE_NOINDEX` | Kyllä | Esikatselulippu, ei salaisuus |
| `VITE_GSC_VERIFICATION` | Kyllä | Search Consolen vahvistuskoodi näkyy sivun lähdekoodissa tarkoituksella |
| `GOOGLE_CALENDAR_ID` | Kyllä, osittain | Julkisen kalenterin tunnus näkyy tilauslinkissä. Ei salaisuus, koska kalenteri on julkinen |
| `SCHEDULE_EXCEL_URL` | **Ei** | Excel-tuntilistan jakolinkki, vain GitHubin salaisuuksissa ja buildissa. Ei tulosteta lokiin. Tiedostosta luetaan vain aikataulusarakkeet |
| `GOOGLE_API_KEY` | **Ei** | Vain GitHubin salaisuuksissa ja buildissa. Rajaa Google Cloudissa vain Calendar API:in. Jos avain on joskus ollut koodissa tai chatissa, luo uusi ja poista vanha |

## Muut suojaukset

- **HTTP-otsakkeet** (`site/public/_headers`, Cloudflare Pages): CSP, HSTS, `X-Frame-Options`, `Referrer-Policy`,
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

## Kun sivustolle lisätään toimintoja

**Oma yhteydenottolomake** (Cloudflare Pages Function): kohdat 4 ja 6 tulevat voimaan. Tarvitaan tiukka skeema
(nimi, sähköposti, viesti, ei muita kenttiä), roskapostisuoja (Cloudflare Turnstile ja piilokenttä),
pyyntöraja IP-osoitetta kohden ja sähköpostipalvelun avain vain palvelimella. Tietosuojaselosteeseen
lisätään lomakkeen tiedot.

**CMS (esim. Sveltia):** kirjautuminen GitHub-tilillä. Kohta 2: vain Amandalla ja Eerolla kirjoitusoikeus repoon.
