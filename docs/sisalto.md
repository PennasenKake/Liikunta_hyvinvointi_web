# Sisältö ja paikkamerkit

Sivustolla on paikkamerkkejä (hakasulkeissa, esim. `[HINTA] €`) niissä kohdissa,
joihin tarvitaan tietoa Amandalta. Kaikki paikkamerkit ovat `site/src/lib/`-kansiossa,
joten oikeat tiedot vaihdetaan sinne eikä komponentteihin tarvitse koskea.

Koodissa kohdat on merkitty kommentilla `TODO(Amanda)`. Ne löytää haulla:

```powershell
cd site
Select-String -Path src -Pattern "TODO\(Amanda\)" -Recurse   # PowerShell
# tai: grep -rn "TODO(Amanda)" src
```

## Pyydettävät tiedot

| # | Tieto | Missä näkyy | Tiedosto | Tila |
|---|---|---|---|---|
| 1 | **Valokuva Amandasta** | Minusta-osio | `lib/about.ts` → `photo` | ⬜ |
| 2 | **Kuva rentoutustunnilta** | Miksi liikkua -osio | `lib/photos.ts` (äänimaljat) | ✅ |
| 3 | **Minusta-teksti** omin sanoin (2 kappaletta) | Minusta-osio | `lib/about.ts` → `paragraphs` | ⬜ |
| 4 | **Koulutukset ja sertifikaatit** | Minusta-osio | `lib/about.ts` → `certifications` | ⬜ |
| 5 | **Hinnat ja kestot** jokaiselle palvelulle | Hinnasto | `lib/pricing.ts` | ⬜ |
| 6 | **Instagram-tunnus** | Instagram-osio, Footer | `lib/site.ts` → `instagram` | ⬜ |
| 7 | **Google-kalenteri**: julkinen tuntikalenteri ja sen tunnus (ohje: [kalenteri.md](kalenteri.md)) sekä ilmoittautumiskäytäntö | Tulevat tunnit | GitHub-salaisuudet, `lib/calendar.ts` | ⬜ |
| 8 | **Kumppanilogot ja käyttölupa:** ePassi, Tahko, Nilsiän Yrittäjät | Footer | `lib/site.ts` → `partners` | ⬜ |
| 9 | **Palveluiden tiedot:** kestot, paikkakunnat ja tehotasot (poistettu arvioina, lisätään vahvistettuina) sekä "Sopii:"-tekstien tarkistus | Palvelut-osio | `lib/services.ts` | ⬜ |
| 10 | **Käyttöehtojen tiedot:** arvonlisävero, maksutavat, peruutusaika ja -maksu | Käyttöehdot | `pages/kayttoehdot.tsx` | ⬜ |
| 11 | **InBody-tulosten säilytys:** säilytetäänkö ja missä muodossa | Tietosuojaseloste | `pages/tietosuoja.tsx` | ⬜ |
| 12 | **Taustavideo heroon** (vapaaehtoinen): 10–20 s vaakavideo tunnilta tai Tahkon maisemasta, ei ääntä, ei tunnistettavia asiakkaita ilman lupaa | Etusivun yläosa (hero C) | `lib/site.ts` → `heroVideo` | ⬜ |

## Tarkistettavat asiat

| Asia | Huomio | Tila |
|---|---|---|
| RVP | Sivulla tulkittu "reidet, vatsa ja pakarat" | ⬜ |
| Palvelukuvaukset | Luonnokset, Amanda voi korjata omalla äänellään (`lib/services.ts`) | ⬜ |
| Fontit | Suunnitelmassa Lora + Inter, toteutuksessa Cormorant Garamond + Jost (mockup B) | ⬜ |
| Hero | Kolme versiota (A, B, C), Amanda valitsee. Asetus: `lib/site.ts` → `heroVariant` | ⬜ |

## Saadut kuvat

Tunneilta saadut kuvat ovat `lib/photos.ts`-tiedostossa. Käytössä: Miksi liikkua -osio
(äänimaljat) ja Instagram-osion väliaikaiset kuvat.

| Kuva | Tila |
|---|---|
| vesijumppa-allas, joogasali, ulkotreeni-kentta, sekuntikello-kentta, aanimaljat, aanimaljat-jarvi | ✅ Käytössä |
| inbody-mittaus, joogablokit | ✅ Käytössä (pieni koko 480 px, isompi versio olisi parempi) |
| joogablokit-matto | ⚠️ Ei käytössä: näyttää kuvapankkikuvalta, lähde ja käyttöoikeus vahvistettava |

## Kuvien ohjeet

- **Muoto:** JPG tai WebP, vähintään 1600 px leveä. Kuvat pienennetään ennen kuin ne viedään sivulle.
- **Sijainti:** alkuperäiset kansioon `materiaalit/kuvat/` (ei versionhallinnassa), sivulla käytettävät kansioon `site/public/kuvat/`.
- **Lupa:** kuvissa näkyviltä asiakkailta tarvitaan lupa julkaisuun.
- **Alt-teksti:** jokaiselle kuvalle lyhyt kuvaus, esim. "Amanda ohjaa vesijumppaa Tahkolla".
