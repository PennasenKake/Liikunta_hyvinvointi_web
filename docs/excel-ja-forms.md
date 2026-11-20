# Tuntilista Excelistä ja ilmoittautuminen Formsilla

Tulevat tunnit voi hakea sivulle Amandan Excel-tiedostosta Google-kalenterin sijaan, ja ilmoittautuminen
hoidetaan lomakkeella (Microsoft tai Google Forms, tunti esitäytettynä). Tämä ohje kertoo, miten koko ketju **testataan ensin Eeron omilla
tunnuksilla** GitHub Pages -testiversiossa ja vasta sitten otetaan käyttöön Amandan tiedostoilla.

```
Excel (OneDrive, katselulinkki) ──► GitHub Actions: build kerran tunnissa ──► sivun Tulevat tunnit
                                    scripts/fetch-excel.mjs                         │
                                                                   Ilmoittaudu ─────┘
                                                                        ▼
                                                    Forms-lomake ──► Amandan vastaukset    
```

Tuntilista ja ilmoittautumiset ovat eri tiedostoissa. Sivulle tulee vain aikataulu, **ei koskaan
osallistujien nimiä**. Formsin vastaukset jäävät Amandan Microsoft-tilille.

## Mitä koodissa on valmiina

| Osa | Tiedosto |
|---|---|
| Excelin lataus jakolinkistä (kolme tapaa, tunnistaa kirjautumissivun) ja luku ilman Excel-kirjastoa | `site/scripts/fetch-excel.mjs` |
| Lähteen valinta: Excel → Google-kalenteri → esimerkkitunnit | `site/scripts/fetch-calendar.mjs` |
| Tila "Täynnä": harmaa painike, ei nostoa heroon, Googlelle `SoldOut` | `Calendar.tsx`, `NextClass.tsx`, `lib/seo.ts` |
| Valmiiksi täytetty Forms-linkki (valinnainen) | `lib/site.ts` → `signupFormPrefill`, `lib/calendar.ts` |
| Pelkkä tarkistus GitHubissa ilman julkaisua | `.github/workflows/excel-testi.yml` |
| Testipohja ja Amandan pohja | `site/e2e/fixtures/tunnit-testi.xlsx`, `docs/pohjat/tunnit-pohja.xlsx` |
| Yksikkötestit (päivämäärät, aikavyöhyke, Täynnä, Peruttu, virherivit, lataus) | `site/scripts/fetch-excel.test.mjs` |

**Virheet eivät riko sivua:** virheellinen rivi jätetään pois ja kerrotaan lokissa. Jos koko tiedostoa
ei saada ladattua, build pysähtyy, jolloin sivulle jää edellinen toimiva versio, ja GitHub näyttää punaisen rastin.

## Vaihe 1: testitiedostot omalle Microsoft-tilille (Eero)

1. **Excel:** lataa `tunnit-testi.xlsx` OneDriveen (onedrive.live.com → Lataa).
   Siinä on 8 riviä: 6 kelvollista, yksi *Täynnä*, yksi *Peruttu* ja rivi 8 tahallaan virheellisenä.
   Muuta päivämäärät tulevaisuuteen, jos testi tehdään joulukuun jälkeen.
2. **Jakaminen:** tiedoston kohdalla *Jaa* → *Kopioi linkki* → linkin asetuksista
   **Kuka tahansa** ja **Voi tarkastella** (ei muokkausoikeutta). Kopioi linkki talteen.
3. **Forms-testilomake** (forms.office.com → Uusi lomake), nimeksi *Testi: ilmoittautuminen*:
   - Kysymys **Tunti** (**Lyhyt vastaus**, pakollinen), kuvaukseen *Täytetään automaattisesti*.
     Sivu täyttää siihen tunnin muodossa `Vesijumppa ti 1.12. klo 18.00`. Lyhyt vastaus on suositus:
     tunteja ei tarvitse koskaan lisätä lomakkeeseen (ks. *Testatut lomakemuutokset* alla).
   - **Nimi** (Teksti, pakollinen) ja **Puhelin tai sähköposti** (Teksti, pakollinen).
   - Lomakkeen alkuun lyhyt teksti: *Tietojasi käytetään vain ilmoittautumisen hoitamiseen. Tietosuojaseloste: tahkonamanda.fi/tietosuoja*
   - *Asetukset* (… → Asetukset): **Kuka tahansa voi vastata**, **Hae sähköposti-ilmoitus jokaisesta vastauksesta**.
     Jätä *Jaa tulokset* -linkki jakamatta.
   - *Kerää vastauksia* → kopioi lomakkeen linkki.
4. **Valmiiksi täytetty linkki (valinnainen):** Formsin … → *Hae esitäytetty URL-osoite* → valitse
   kysymykseen *Valitse tunti* jokin vaihtoehto → *Hae esitäytetty linkki* → kopioi. Linkin lopussa on
   osa, jossa vaihtoehdon teksti näkyy (esim. `&r1a2b3c=Vesijumppa...`). **Korvaa vaihtoehdon teksti
   merkinnällä `{tunti}`**. Jos tämä ei onnistu henkilökohtaisella tilillä, ohita kohta: painike avaa
   lomakkeen ja kävijä valitsee tunnin itse.

### Google Forms Microsoft Formsin sijaan

Testissä voi käyttää myös Google Formsia (testihaarassa käytössä 20.11.2026). Esitäytetty linkki on muotoa
`…/viewform?usp=pp_url&entry.<tunnus>={tunti}`, jossa tunnus on kysymyksen *Valitse tunti* numero
(Formsin … → *Hae esitäytetty linkki*). Google Forms tukee esitäyttöä luotettavasti myös ilmaisella tilillä.
Jos tuotannossa käytetään Google Formsia, tietosuojaseloste ja evästesivu päivitetään (nyt niissä lukee Microsoft Forms).

## Vaihe 2: asetukset repoon

1. **GitHub → repo → Settings → Secrets and variables → Actions → New repository secret:**
   `SCHEDULE_EXCEL_URL` = vaiheen 1 kohdan 2 jakolinkki.
   Linkki on salaisuus, koska sillä pääsee tiedostoon. Sitä ei laiteta koodiin eikä `VITE_`-muuttujaan.
2. **Forms-linkki** tiedostoon `site/src/lib/site.ts` testihaarassa:
   ```ts
   signupForm: "https://forms.office.com/r/TESTILOMAKE" as string | null,
   signupFormPrefill: "https://forms.office.com/...&r1a2b3c={tunti}" as string | null, // tai null
   ```
   Forms-linkit eivät ole salaisuuksia: ne näkyvät sivulla painikkeissa.

## Vaihe 3: latauksen testi (ei julkaise mitään)

**Actions → Excel-testi → Run workflow** (valitse haara). Lokissa pitää näkyä:

```
Excel ladattu tavalla 1/3 (12 kt)
Excel: välilehti "Tunnit", 8 riviä → 6 tulevaa tuntia (menneitä tai yli 60 päivän päässä 0, peruttuja 1)
  Hylätty rivi 8: Alkuaika puuttuu tai on väärässä muodossa
  2026-12-01 18:00  Vesijumppa  ·  Uimahalli, Tahko
  …
  2026-12-02 19:00  Äänimaljarentoutus  ·  Liikuntasali, Siilinjärvi  [TÄYNNÄ]
```

Jos lataus epäonnistuu kaikilla kolmella tavalla, loki kertoo HTTP-tilakoodit. Tarkista ensin, että
linkki on *Kuka tahansa* -linkki. Jos se on, OneDrive ei salli latausta ilman kirjautumista, ja
siirrytään varasuunnitelmaan (ks. lopusta).

Paikallisesti saman tarkistuksen voi ajaa ilman latausta:

```powershell
cd site
$env:SCHEDULE_EXCEL_FILE="e2e/fixtures/tunnit-testi.xlsx"; node scripts/fetch-excel.mjs
```

## Vaihe 4: demo testiversiossa

**Actions → Pages → Run workflow** (valitse testihaara). Testiversio rakennetaan sinun Excelistäsi ja
julkaistaan osoitteeseen pennasenkake.github.io/Liikunta_hyvinvointi_web (piilossa hakukoneilta).
Sen jälkeen ajastus päivittää sivun kerran tunnissa.

## Vaihe 5: hyväksymistestit

Tee jokainen kohta ja merkitse tulos. Tuotantoon siirrytään vasta, kun kaikki ovat kunnossa.

| # | Testi | Miten | Hyväksytty kun | ✓ |
|---|---|---|---|---|
| 1 | Lataus | Excel-testi (vaihe 3) | 6 tuntia, rivi 8 hylätty, Täynnä merkitty | |
| 2 | Tunnit sivulla | Avaa testiversio | 5 tuntia näkyy, *Näytä kaikki tunnit (6)*, peruttu ei näy | |
| 3 | Muutos näkyy | Muuta Excelissä tunnin kellonaika, aja Pages | Uusi aika sivulla (ajastettuna viimeistään tunnin päästä) | |
| 4 | Täynnä | Kirjoita *Täynnä* yhden tunnin Tila-sarakkeeseen | Painike harmaa "Täynnä", ei heron Seuraava tunti -nostossa | |
| 5 | Virheellinen rivi | Kirjoita päiväksi "huomenna" | Rivi puuttuu sivulta, lokissa syy, build vihreä | |
| 6 | Rikki linkki | Vaihda salaisuuteen väärä linkki, aja Pages | Punainen rasti, sivulla edelleen edellinen versio | |
| 7 | Ilmoittautuminen puhelimella | iPhone (Safari) ja Android (Chrome), ilman Microsoft-kirjautumista | Lomake aukeaa uuteen välilehteen ja vastaus lähtee | |
| 8 | Esitäytetty tunti | Paina tunnin Ilmoittaudu (jos `signupFormPrefill` käytössä) | Oikea tunti valmiiksi valittuna | |
| 9 | Ilmoitus | Lähetä testi-ilmoittautuminen | Sähköposti-ilmoitus tulee | |
| 10 | Yksityisyys | Avaa Formsin linkki kirjautumatta, avaa Excelin linkki | Vastauksia ei näe. Excelissä ei ole nimiä | |
| 11 | Salaisuus | Katso Pages-ajon loki ja sivun lähdekoodi | Excel-linkkiä ei näy kummassakaan | |
| 12 | Saavutettavuus | `npm run test:e2e` | Kaikki testit vihreinä (axe mukana) | |

Kohta 6: palauta oikea linkki heti testin jälkeen.

## Vaihe 6: käyttöönotto Amandan tiedostoilla

1. Amanda lataa `docs/pohjat/tunnit-pohja.xlsx`-pohjan OneDriveensa, täyttää tunnit ja jakaa sen
   *Kuka tahansa, voi tarkastella* -linkillä. Formsiin samat asetukset kuin vaiheessa 1.
2. Vaihda `SCHEDULE_EXCEL_URL`-salaisuus Amandan linkkiin ja `site.ts`:ään Amandan Forms-linkit.
3. Aja Excel-testi ja hyväksymistestit 1–4, 7 ja 9–11 uudelleen.
4. Tuotannossa (Cloudflare) sama salaisuus myös julkaisuautomaation asetuksiin.
   `JULKAISU=1 npm run build` pysähtyy, jos tunnit ovat vielä esimerkkitunteja.
5. Poista tai arkistoi omat testitiedostosi OneDrivesta ja Formsista.

## Testatut lomakemuutokset (Google Forms, 20.11.2026)

| Muutos lomakkeessa | Vaikutus sivun ilmoittautumiseen |
|---|---|
| Tunti-kysymys monivalinnasta lyhyeksi vastaukseksi | Toimii: kysymyksen tunnus säilyy, esitäyttö jatkuu ilman muutoksia sivulle |
| Lyhyt vastaus ja Excelissä muutettu kellonaika | Toimii: lomakkeeseen tulee uusi aika |
| Monivalinta, jonka vaihtoehto ei täsmää Exceliin | **Ei valita mitään, eikä kävijä saa varoitusta.** Siksi lyhyt vastaus |
| Kysymyksen otsikko tai vaihtoehtojen järjestys muuttuu | Ei vaikutusta (linkki käyttää kysymyksen tunnusta) |
| Muutos julkaistuun lomakkeeseen | Näkyy heti |
| Lomakkeesta kopio tai uusi lomake | Uusi osoite: linkki vaihdetaan `site.ts`:ään. Kopio pitää ensin julkaista |
| Kysymys poistetaan ja tehdään uusi | Uusi tunnus: tunti jää täyttämättä, kunnes linkki päivitetään |

## Amandan arki

- Uusi tunti = uusi rivi Exceliin. Peruttu tunti = *Peruttu* Tila-sarakkeeseen. Täysi = *Täynnä*.
- Lomakkeeseen ei kosketa, kun tunteja muutetaan (Tunti-kysymys on lyhyt vastaus).
  **Älä poista Tunti-kysymystä äläkä tee lomakkeesta uutta**: silloin sivun linkki pitää päivittää.
- Forms ei rajoita paikkamäärää itse: kun tunti täyttyy, merkitse Exceliin *Täynnä*.
- Muutokset näkyvät sivulla seuraavassa päivityksessä (tuotannossa 15 minuutin välein, testiversiossa
  GitHubin ajastus, joka voi viivästyä tunteja; käsin: Actions → Pages → Run workflow).
- Ohje on myös Excel-pohjan välilehdellä *Ohje*.

## Varasuunnitelma, jos OneDrive-lataus ei toimi

1. **Google Sheets:** sama pohja Google Sheetsiin, *Tiedosto → Jaa → Julkaise verkossa → CSV*.
   Julkaistu CSV on vakain ja yksinkertaisin vaihtoehto. Lukijaan tarvitaan pieni lisäys (CSV Excelin sijaan).
2. **Google-kalenteri:** valmiina ja testattuna (`docs/kalenteri.md`). Poista `SCHEDULE_EXCEL_URL`,
   niin sivu palaa kalenteriin.
3. **Microsoft Graph kirjautumisella:** varmin OneDrive-tapa, mutta vaatii sovelluksen rekisteröinnin
   ja tunnuksen uusimisen. Vasta, jos 1 ja 2 eivät sovi.
