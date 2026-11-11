# Tuntikalenteri

Amanda lisää tunnit omaan Google-kalenteriinsa, ja ne näkyvät sivuston kohdassa **Tulevat tunnit**.
Kävijä voi ilmoittautua tunnille, lisätä sen omaan kalenteriinsa (Google, Apple, Outlook) tai jakaa sen kaverille.

## Miten se toimii

1. GitHub Actions rakentaa sivuston kerran tunnissa (`.github/workflows/pages.yml`, `schedule`).
2. Buildin alussa `site/scripts/fetch-calendar.mjs` hakee seuraavien 60 päivän tunnit Google Calendar API:sta
   ja tallentaa ne tiedostoon `site/src/data/calendar.json` (ei versionhallinnassa).
3. Tunnit renderöidään valmiiksi HTML:ksi, ja jokaiselle tunnille tehdään `.ics`-tiedosto (`dist/tunnit/<tunnus>.ics`).
4. Kävijän selain ei ota yhteyttä Googleen, eikä API-avain päädy sivuston koodiin.

Ilman salaisuuksia (kehitys, testit, CI) sivulla näkyvät **esimerkkitunnit** kahdelle viikolle.
Jos haku epäonnistuu salaisuuksien kanssa, julkaisu keskeytyy ja sivulla pysyy edellinen toimiva versio.

Viive: uusi tunti näkyy sivulla viimeistään noin tunnin kuluttua (GitHubin ajastus voi myöhästyä ruuhkassa).
Heti näkyviin: Actions → Pages → Run workflow.

## Amandan ohje (kerran)

1. Google-kalenteri → **Muut kalenterit → + → Luo uusi kalenteri**. Nimi: *Tahkon Amanda – tunnit*.
   Erillinen kalenteri, jotta henkilökohtaiset menot eivät koskaan näy sivustolla.
2. Kalenterin asetukset → **Käyttöoikeudet** → ✅ *Aseta julkisesti saataville* → *Näytä kaikki tapahtumien tiedot*.
3. Asetukset → **Integroi kalenteri** → kopioi **Kalenterin tunnus** (muotoa `...@group.calendar.google.com`) ja lähetä se Eerolle.

## Tunnin kirjaaminen

| Kenttä | Mitä siihen | Näkyy sivulla |
|---|---|---|
| Otsikko | Tunnin nimi, sama kuin palvelun nimi (esim. `Vesijumppa`) | Nimi; linkki palvelun kuvaukseen, jos nimi täsmää |
| Aika | Alku ja loppu. Toistuva tunti: *Toistuu viikoittain* | Päivä ja kellonaika |
| Sijainti | Paikka ja paikkakunta (esim. `Uimahalli, Tahko`) | Paikka |
| Kuvaus | Lyhyt lisätieto (mitä mukaan, taso, hinta) | 2 riviä, koko teksti kalenteriin lisätessä |

- **Peruttu tunti:** poista se kalenterista (toistuvasta vain kyseinen kerta). Katoaa sivulta seuraavassa päivityksessä.
- **Kokopäivän tapahtumat** (esim. *Loma*) eivät näy sivulla.
- ⚠️ Kalenteri on julkinen: **älä koskaan kirjaa osallistujien nimiä** tapahtumiin.

## Eeron ohje (kerran)

1. [Google Cloud Console](https://console.cloud.google.com/) → uusi projekti (esim. *tahkonamanda*).
2. **APIs & Services → Library → Google Calendar API → Enable**.
3. **Credentials → Create credentials → API key**. Avaimen asetukset:
   **API restrictions → Restrict key → Google Calendar API**. (Application restrictions: None, koska haku tehdään GitHubin palvelimelta.)
4. GitHub-repo → **Settings → Secrets and variables → Actions → New repository secret**:
   - `GOOGLE_CALENDAR_ID` = Amandan kalenterin tunnus
   - `GOOGLE_API_KEY` = API-avain
5. Actions → Pages → Run workflow. Lokissa pitää lukea `kalenteri: N tuntia Google-kalenterista`.

**Hinta:** Calendar API on maksuton tavallisessa käytössä (kiintiö 1 000 000 pyyntöä/päivä/projekti);
sivusto käyttää noin 24 pyyntöä päivässä. Laskutustiliä ei tarvitse eikä kannata lisätä.
Lähde: <https://developers.google.com/calendar/pricing>

**Ajastus pysähtyy**, jos repossa ei ole tapahtunut mitään 60 päivään (GitHubin sääntö).
Silloin: Actions → Pages → *Enable workflow*. Tuotannossa (esim. Cloudflare Pages) ajastus tehdään build-hookilla.

## Ilmoittautuminen

Painike *Ilmoittaudu* avaa valmiiksi täytetyn sähköpostin Amandalle (`lib/calendar.ts`, `signupHref`).
TODO(Amanda): sopiiko sähköposti, vai tekstiviesti, puhelu tai ei ilmoittautumista lainkaan.
