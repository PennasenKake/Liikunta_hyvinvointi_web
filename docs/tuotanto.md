# Tuotanto: Cloudflare, ajastin ja Päivitä nyt

Tuotantosivusto (tahkonamanda.fi) toimii Cloudflare Workersissa ilmaisella paketilla. Sama Worker:

1. **tarjoilee sivuston:** valmiit tiedostot `site/dist`, otsakkeet `site/public/_headers`
2. **ajastaa päivityksen:** 15 minuutin välein se käynnistää GitHubin työnkulun `.github/workflows/tuotanto.yml`
3. **tarjoaa Päivitä nyt -sivun:** Amandan kirjanmerkki `/paivita?avain=…` käynnistää saman työnkulun heti

```
Amanda → Excel (OneDrive)
              │  ladataan 15 min välein
Cloudflare-ajastin ──► GitHub Actions: tuotanto.yml
Päivitä nyt ─────────►   1. tunnit Excelistä
push mainiin ────────►   2. tunniste = tunnit + koodin versio
                         3. sama kuin julkaistussa? → loppu (noin 1 min)
                         4. muuten: JULKAISU=1 build → wrangler deploy
                                     │
                         Cloudflare Workers: tahkonamanda.fi
```

Muuttumaton ajo ei julkaise mitään, joten turhia julkaisuja ei synny. Päättynyt tunti putoaa listalta,
jolloin tunniste muuttuu ja sivu päivittyy itsestään.

| Tiedosto | Tehtävä |
|---|---|
| `cloudflare/src/index.js` | Worker: ajastin, Päivitä nyt, 404-ohjaus |
| `cloudflare/wrangler.jsonc` | Workerin asetukset: tiedostot, ajastin, verkkotunnus |
| `cloudflare/scripts/tarkista-dist.mjs` | Estää julkaisun omalta koneelta tai testibuildista |
| `cloudflare/test/index.test.mjs` | Workerin testit (`npm test`, ajetaan CI:ssä) |
| `site/scripts/tunnit-tunniste.mjs` | Julkaisun tarpeen tunnistus |
| `.github/workflows/tuotanto.yml` | Haku, vertailu, build ja julkaisu |

## Kustannukset

0 €. Workersin ilmaisessa paketissa on 100 000 pyyntöä päivässä ja 5 ajastinta. Sivuston tiedostojen
pyyntöjä ei lasketa kiintiöön, vain Päivitä nyt -sivu ja 404-sivut. GitHub Actions on julkisessa
repossa maksuton (noin 96 lyhyttä ajoa vuorokaudessa).

## Käyttöönotto

Tee vaiheet järjestyksessä. Tilit ovat Amandan nimissä, Eero saa niihin hallintaoikeuden.

### 1. Cloudflare-tili ja verkkotunnus

1. Amanda luo tilin osoitteessa dash.cloudflare.com ja kutsuu Eeron jäseneksi (Manage Account → Members, rooli Administrator).
2. **Add a domain** → `tahkonamanda.fi` → Free. Cloudflare näyttää kaksi nimipalvelinta.
3. Vaihda nimipalvelimet verkkotunnuksen välittäjällä (esim. Zoner) Cloudflaren antamiin. Voimaan yleensä tunneissa.
4. Kun verkkotunnus on aktiivinen:
   - SSL/TLS → Overview → **Full (strict)**, Edge Certificates → **Always Use HTTPS** päälle.
   - DNS: lisää `www` (CNAME `tahkonamanda.fi`, Proxied), jotta uudelleenohjaus toimii.
   - Rules → **Redirect Rules** → mallista "Redirect from WWW to root": `www.tahkonamanda.fi/*` → `https://tahkonamanda.fi/${1}`, 301.
   - Security → Bots / AI Crawl Control: hakukoneet ja tekoälyhaut (Search) sallituiksi. Sivu haluaa näkyä myös ChatGPT:n ja muiden vastauksissa.
5. Sähköpostin edelleenohjaus (valinnainen): Email → Email Routing → `amanda@tahkonamanda.fi` → Amandan nykyinen osoite.

### 2. GitHub-tunnus Workerille

GitHub → Settings → Developer settings → **Fine-grained personal access tokens** → Generate:

- Resource owner: PennasenKake, Repository access: **Only select repositories** → `Liikunta_hyvinvointi_web`
- Permissions → Repository → **Actions: Read and write** (ei muita)
- Expiration: 1 vuosi. Lisää kalenteriin muistutus uusia tunnus kuukautta ennen.

Tunnuksella voi vain käynnistää ja lukea tämän repon työnkulkuja. Se ei pääse koodiin eikä muihin repoihin.

### 3. Cloudflare-tunnus GitHubille

Cloudflare → My Profile → API Tokens → Create Token → **Edit Cloudflare Workers** -malli:

- Account Resources: **vain Amandan tili**. Zone Resources: **vain tahkonamanda.fi**.
- Kopioi myös **Account ID** (Workers & Pages -sivun oikeasta reunasta).

### 4. GitHubin asetukset

Settings → **Environments** → New environment `tuotanto`:

- Deployment branches: **Selected branches** → `main`. Salaisuudet eivät silloin ole muiden haarojen käytössä.
- Environment secrets:
  - `CLOUDFLARE_API_TOKEN`: vaiheen 3 tunnus
  - `CLOUDFLARE_ACCOUNT_ID`: vaiheen 3 tilin tunnus
  - `SCHEDULE_EXCEL_URL`: Amandan Excelin jakolinkki
- Environment variables:
  - `TUOTANTO_URL` = `https://tahkonamanda.fi` (ei kauttaviivaa loppuun)

Settings → Secrets and variables → Actions → **Variables** (repon muuttuja, ei ympäristön):

- `TUOTANTO_KAYTOSSA` = `true`, vasta kun vaiheet 1–5 on tehty. Siihen asti tuotantotyönkulku ohitetaan.

### 5. Workerin salaisuudet ja ensimmäinen julkaisu

Omalla koneella, kerran:

```powershell
cd cloudflare
npm ci
npx wrangler login                      # Amandan Cloudflare-tili (tai Eero jäsenenä)
npx wrangler secret put GITHUB_TOKEN    # liitä vaiheen 2 tunnus
node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"
npx wrangler secret put PAIVITYS_AVAIN  # liitä yllä tulostunut avain
```

Salaisuudet säilyvät Workerissa julkaisujen yli. Ensimmäinen `secret put` voi luoda tyhjän Workerin, ja se on normaalia.

Ota oma verkkotunnus käyttöön tiedostossa `cloudflare/wrangler.jsonc` poistamalla `routes`-rivin kommentti.
Commit ja push mainiin. Aseta sitten `TUOTANTO_KAYTOSSA = true` ja käynnistä Actions → Tuotanto →
Run workflow, **pakota** valittuna. Kun sivu toimii omassa osoitteessaan, vaihda `workers_dev` arvoon `false`.

Älä aja `npm run deploy` omalla koneella: se korvaisi koko sivuston paikallisella `dist`-kansiolla.
`tarkista-dist.mjs` estää sen, jos kansio ei ole tuotantotyönkulun tekemä.

### 6. Amandan kirjanmerkki

`https://tahkonamanda.fi/paivita?avain=<PAIVITYS_AVAIN>`

Lähetä linkki Amandalle Signalilla tai tekstiviestillä, ei sähköpostilla. Pyydä häntä tallentamaan se
puhelimen kirjanmerkiksi. Sivu ei käynnistä mitään avattaessa (linkkien esikatselut eivät laukaise
päivitystä), vaan vasta painikkeesta. Jos linkki leviää, vaihda avain (`npx wrangler secret put PAIVITYS_AVAIN`)
ja lähetä uusi linkki. Pahimmillaankin vuotanut avain antaa vain käynnistää päivityksen, joka on jo käynnissä
15 minuutin välein.

## Tarkistus käyttöönoton jälkeen

| # | Testi | Odotettu tulos |
|---|---|---|
| 1 | Actions → Tuotanto → Run workflow, pakota | Vihreä, yhteenvedossa "julkaistaan", sivu toimii osoitteessa |
| 2 | Odota 15 min | Actionsissa uusi ajo "Tuotanto (ajastin)", yhteenveto "ennallaan", kesto noin 1 min |
| 3 | Lisää Exceliin testitunti, odota enintään 20 min | Tunti näkyy sivulla |
| 4 | Merkitse tunti Täynnä, paina Päivitä nyt | "Päivitys käynnistyi", Täynnä näkyy noin 3 minuutissa |
| 5 | Poista testitunti | Katoaa sivulta seuraavassa päivityksessä |
| 6 | `/paivita` ilman avainta tai väärällä | Sivuston 404-sivu |
| 7 | `http://www.tahkonamanda.fi/tietosuoja/` | Ohjaus osoitteeseen `https://tahkonamanda.fi/tietosuoja/` |
| 8 | securityheaders.com | A tai parempi |
| 9 | Workers → tahkonamanda → Logs | Rivit "ajastin: kaynnistetty", ei virheitä |

## Vianetsintä

| Oire | Syy ja korjaus |
|---|---|
| Lokissa `GitHub vastasi 401` | GitHub-tunnus vanhentunut tai väärä: uusi tunnus (vaihe 2) ja `secret put GITHUB_TOKEN` |
| Lokissa `GitHub vastasi 404` | Väärä repo `wrangler.jsonc`:ssä, tai tunnukselta puuttuu oikeus tähän repoon |
| Tuotanto-ajo ohitetaan heti | `TUOTANTO_KAYTOSSA` ei ole `true` (repon muuttuja) |
| Build kaatuu: paikkamerkkejä | `JULKAISU=1`: sivulla on vielä `[HINTA]`-tyyppisiä kohtia. Täydennä sisältö |
| Build kaatuu: esimerkkitunnit | `SCHEDULE_EXCEL_URL` puuttuu ympäristöstä `tuotanto` |
| Tuntien haku kaatuu | Amanda siirsi tai nimesi tiedoston uudelleen: uusi jakolinkki salaisuudeksi. Sivu pysyy edellisessä versiossa |
| Julkaisu joka 15 min, vaikka mikään ei muutu | `TUOTANTO_URL` väärin, tai Cloudflaren bottisuoja estää GitHubin haun `tunnit-tunniste.txt`:stä. Salli polku Security → WAF -poikkeuksella |
| Ajastin ei käynnisty | Workers → tahkonamanda → Settings → Trigger Events: `*/15 * * * *` näkyvissä |

## Testiversio

GitHub Pages -testiversio (pages.yml) toimii ennallaan ja päivittyy kerran tunnissa GitHubin omalla
ajastuksella. Se on noindex-tilassa eikä kilpaile tuotantosivun kanssa.
