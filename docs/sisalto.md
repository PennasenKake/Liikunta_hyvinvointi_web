# Sisältö ja paikkamerkit

Sivustolla on paikkamerkkejä (hakasulkeissa, esim. `[HINTA] €`) niissä kohdissa,
joihin tarvitaan tietoa Amandalta. Kaikki paikkamerkit ovat `web/src/lib/`-kansiossa,
joten oikeat tiedot vaihdetaan sinne eikä komponentteihin tarvitse koskea.

Koodissa kohdat on merkitty kommentilla `TODO(Amanda)`. Ne löytää haulla:

```powershell
cd web
Select-String -Path src -Pattern "TODO\(Amanda\)" -Recurse   # PowerShell
# tai: grep -rn "TODO(Amanda)" src
```

## Pyydettävät tiedot

| # | Tieto | Missä näkyy | Tiedosto | Tila |
|---|---|---|---|---|
| 1 | **Valokuva Amandasta** | Minusta-osio | `lib/about.ts` → `photo` | ⬜ |
| 2 | **Kuva rentoutustunnilta** | Miksi liikkua -osio | `components/sections/WhyMove.tsx` | ⬜ |
| 3 | **Minusta-teksti** omin sanoin (2 kappaletta) | Minusta-osio | `lib/about.ts` → `paragraphs` | ⬜ |
| 4 | **Koulutukset ja sertifikaatit** | Minusta-osio | `lib/about.ts` → `certifications` | ⬜ |
| 5 | **Hinnat ja kestot** jokaiselle palvelulle | Hinnasto | `lib/pricing.ts` | ⬜ |
| 6 | **Instagram-tunnus** | Instagram-osio, Footer | `lib/site.ts` → `instagram` | ⬜ |
| 7 | **Google-kalenteri** (tunniste) ja tuntien paikat | Tulevat tunnit, Heron kortti | `lib/calendar.ts` | ⬜ |
| 8 | **Kumppanilogot ja käyttölupa:** ePassi, Tahko, Nilsiän Yrittäjät | Footer | `lib/site.ts` → `partners` | ⬜ |

## Tarkistettavat asiat

| Asia | Huomio | Tila |
|---|---|---|
| RVP | Sivulla tulkittu "reidet, vatsa ja pakarat" | ⬜ |
| Palvelukuvaukset | Luonnokset, Amanda voi korjata omalla äänellään (`lib/services.ts`) | ⬜ |
| Fontit | Suunnitelmassa Lora + Inter, toteutuksessa Cormorant Garamond + Jost (mockup B) | ⬜ |

## Kuvien ohjeet

- **Muoto:** JPG tai WebP, vähintään 1600 px leveä. Next.js pienentää ja optimoi kuvat automaattisesti.
- **Sijainti:** alkuperäiset kansioon `materiaalit/kuvat/` (ei versionhallinnassa), sivulla käytettävät kansioon `web/public/kuvat/`.
- **Lupa:** kuvissa näkyviltä asiakkailta tarvitaan lupa julkaisuun.
- **Alt-teksti:** jokaiselle kuvalle lyhyt kuvaus, esim. "Amanda ohjaa vesijumppaa Tahkolla".
