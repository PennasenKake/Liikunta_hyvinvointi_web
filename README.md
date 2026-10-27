# Tahkon Amanda – verkkosivusto

> **EN:** Website for a wellness and fitness business in Tahko, Finland. Built with Next.js, TypeScript and Tailwind CSS. Content management via Sanity and class schedule via Google Calendar (in progress).

Responsiivinen verkkosivusto liikunta- ja hyvinvointipalveluita tarjoavalle Tahkon Amandalle.
Toiminta-alue: Tahko, Siilinjärvi, Kuopio ja Rautavaara.

🔗 **Sivusto:** tahkonamanda.fi *(julkaistaan myöhemmin)*

## Teknologiat

| Osa | Teknologia |
|---|---|
| Sovelluskehys | Next.js 16 (App Router), React |
| Kieli | TypeScript |
| Tyylit | Tailwind CSS |
| Sisällönhallinta | Sanity *(tulossa)* |
| Tapahtumat | Google Calendar API *(tulossa)* |
| Instagram-syöte | Behold *(tulossa)* |

## Ominaisuudet

- [x] Yläpalkin navigaatio ja mobiilivalikko
- [x] Hero-osio Tahko-kuvituksella
- [ ] Palvelut: Liikunta ja Hyvinvointi
- [ ] Hinnasto ja Minusta-osio
- [ ] Tulevat tunnit Google-kalenterista, lisäys omaan kalenteriin ja jakaminen
- [ ] Instagram-karuselli
- [ ] Sisällön muokkaus kirjautumalla (Sanity Studio)
- [ ] Saavutettavuus (WCAG AA) ja scroll reveal -animaatiot

## Hakemistorakenne

```
├── web/           Next.js-sivusto
├── materiaalit/   Logo, kuvitus ja kuvat (lähdetiedostot)
├── docs/          Projektin dokumentaatio
└── studio/        Sanity Studio (tulossa)
```

## Käynnistys paikallisesti

Vaatimukset: Node.js 20 tai uudempi.

```bash
cd web
npm install
npm run dev
```

Sivu aukeaa osoitteeseen http://localhost:3000.

## Ympäristömuuttujat

Kopioi `web/.env.example` tiedostoksi `web/.env.local` ja täytä arvot.
`.env.local` ei koskaan mene versionhallintaan.

## Oikeudet

Koodi on julkisesti nähtävissä portfoliotarkoituksessa.
Logo, tekstit, kuvat ja kuvitukset ovat Tahkon Amandan omaisuutta,
eikä niitä saa käyttää ilman lupaa.

## Tekijä

Eero Korhonen – [github.com/PennasenKake](https://github.com/PennasenKake)
