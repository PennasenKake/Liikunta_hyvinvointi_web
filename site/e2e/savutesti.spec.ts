// savutesti.spec.ts: sivuston tärkeimpien toimintojen savutestit.
// Jokainen testi ajetaan kahdesti: työpöytä- ja mobiiliprofiililla (playwright.config.ts).
// Testit etsivät elementit roolin ja näkyvän tekstin perusteella (getByRole),
// kuten käyttäjä tai ruudunlukija ne näkee. Näin testit eivät hajoa, kun
// CSS-luokkia muutetaan, ja ne varmistavat samalla saavutettavuutta.

import { test, expect, type Page } from "@playwright/test";
import { site } from "../src/lib/site";
import { serviceCategories } from "../src/lib/services";

// Avaa navigaation linkin oikealla tavalla laitteen mukaan:
// työpöydällä linkki näkyy suoraan, mobiilissa valikko pitää avata ensin.
async function clickNavLink(page: Page, isMobile: boolean, label: string) {
  const nav = page.getByRole("navigation", { name: "Päävalikko" });
  if (isMobile) {
    await nav.getByRole("button", { name: "Avaa valikko" }).click();
  }
  await nav.getByRole("link", { name: label, exact: true }).click();
}

test.describe("Etusivu", () => {
  test("latautuu ilman virheitä ja rikkinäisiä resursseja", async ({ page }) => {
    // Kerätään selaimen JavaScript-virheet ja epäonnistuneet pyynnöt omalta palvelimelta
    // (esim. puuttuva logo.svg palauttaisi 404). Ulkoiset osoitteet ohitetaan.
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(`JS-virhe: ${err.message}`));
    // Konsolivirheet: esim. hydraatiovirhe, jos esirenderöity HTML ja selaimen React eroavat
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(`Konsoli: ${msg.text()}`);
    });
    page.on("response", (res) => {
      if (res.url().startsWith("http://localhost") && res.status() >= 400) {
        errors.push(`${res.status()} ${res.url()}`);
      }
    });

    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Tahkon Amanda/);

    // Sivulla on täsmälleen yksi pääotsikko (h1), mikä on hyvä SEO- ja saavutettavuuskäytäntö
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

    // Tärkeimmät osiot löytyvät oikeassa järjestyksessä
    const ids = ["palvelut", "miksi-liikkua", "hengitys", "kalenteri", "hinnasto", "minusta", "instagram", "yhteystiedot"];
    for (const id of ids) await expect(page.locator(`#${id}`)).toBeAttached();
    const tops = await Promise.all(ids.map((id) => page.locator(`#${id}`).evaluate((el) => el.getBoundingClientRect().top)));
    expect([...tops].sort((a, b) => a - b)).toEqual(tops);

    // Puhelinnumero on klikattava tel:-linkki (alatunniste), yhteydenotto sähköpostilla (hero)
    await expect(page.locator(`a[href="${site.phoneHref}"]`).first()).toBeAttached();
    const contact = page.locator("#top").getByRole("link", { name: "Ota yhteyttä" });
    await expect(contact).toHaveAttribute("href", new RegExp(`^mailto:${site.email}\\?subject=`));
    await expect(page.locator("#hinnasto").getByRole("link", { name: /Pyydä tarjous/ })).toHaveAttribute("href", /^mailto:.*Tarjouspyynt/);

    await page.waitForLoadState("networkidle"); // Odotetaan, että kuvat ym. ovat latautuneet
    expect(errors).toEqual([]);
  });

  test("sivu ei vieritä vaakasuunnassa", async ({ page }) => {
    // Regressiotesti: karusellin sr-only-tekstit levensivät aiemmin sivua mobiilissa
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("Responsiivisuus", () => {
  // Kapein yleinen puhelin (320 px) ja puhelin vaakatasossa (667 × 375).
  // test.use ei toimi describe-lohkon sisällä eri arvoilla, joten koko asetetaan sivulle itse.
  for (const path of ["/", "/tietosuoja/", "/tata-sivua-ei-ole"]) {
    test(`320 px: ei vaakavieritystä (${path})`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("puhelin vaakatasossa: otsikko ja päätoiminto näkyvät heti", async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
    await expect(page.getByRole("link", { name: /Katso tulevat tunnit/ }).first()).toBeInViewport();
  });
});

test.describe("Yläpalkki hiirellä", () => {
  test("piilotettu palkki tulee esiin, kun hiiri viedään ruudun yläreunaan", async ({ page, isMobile }) => {
    test.skip(isMobile, "Kosketusnäytöillä ei ole hover-tilaa");
    await page.goto("/");
    const header = page.locator("header").first();
    // Vieritys alas piilottaa palkin
    await page.mouse.move(600, 500);
    await page.mouse.wheel(0, 1500);
    await expect(header).toHaveAttribute("data-hidden", "true");
    // Hiiri yläreunaan → palkki esiin
    await page.mouse.move(600, 10);
    await expect(header).toHaveAttribute("data-hidden", "false");
  });
});

test.describe("Saavutettavuus", () => {
  test("Siirry sisältöön -linkki tulee näkyviin Tab-näppäimellä ja vie sisältöön", async ({ page, isMobile }) => {
    test.skip(isMobile, "Ohituslinkki on näppäimistökäyttäjille");
    await page.goto("/");
    await page.keyboard.press("Tab"); // Ensimmäinen Tab: ohituslinkki
    const skip = page.getByRole("link", { name: "Siirry sisältöön" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport(); // Näkyy fokuksessa (ei enää sr-only)

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#sisalto$/);
    await expect(page.locator("main#sisalto")).toBeFocused();
  });

  test("vuoristoviiva näkyy kokonaan, kun kävijä on pyytänyt vähemmän liikettä", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const lines = page.locator(".tahko-line");
    await expect(lines).toHaveCount(5);
    // stroke-dashoffset 0 = viiva piirretty kokonaan heti, ei animaatiota
    for (const offset of await lines.evaluateAll((els) => els.map((el) => getComputedStyle(el).strokeDashoffset))) {
      expect(parseFloat(offset)).toBe(0);
    }
  });

  test("vuoristoviiva piirtyy vierityksen mukana", async ({ page }) => {
    await page.goto("/");
    const line = page.locator(".tahko-line").first();
    const offset = () => line.evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset));
    expect(await offset()).toBeGreaterThan(0.9); // Ruudun alapuolella: ei vielä piirretty
    await line.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, window.innerHeight / 3)); // Siluetti kohti ruudun keskiosaa
    await expect.poll(offset).toBeLessThan(0.5);
  });
});

test.describe("Hakukoneoptimointi", () => {
  test("robots.txt sallii indeksoinnin ja kertoo sivukartan osoitteen", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("Allow: /");
    expect(text).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);
  });

  test("sitemap.xml listaa etusivun ja tietosivut", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    for (const path of ["/", ...site.legal.map((l) => l.href)]) {
      expect(xml).toContain(`${path}</loc>`);
    }
  });

  test("etusivulla on rakennetieto palvelualueineen ja jakokuva", async ({ page }) => {
    await page.goto("/");
    // LocalBusiness-rakennetieto: kelvollinen JSON, kaikki palvelualueet ja palvelut mukana
    const json = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(json ?? "{}");
    expect(data["@type"]).toBe("LocalBusiness");
    expect(data.areaServed.map((a: { name: string }) => a.name)).toEqual(site.areas);
    const services = data.hasOfferCatalog.itemListElement.flatMap((c: { itemListElement: unknown[] }) => c.itemListElement);
    expect(services).toHaveLength(serviceCategories.reduce((n, c) => n + c.services.length, 0));

    // Jakokuva ja canonical täysinä osoitteina (entry-server.tsx: head())
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https?:\/\/.+opengraph-image/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https?:\/\/[^/]+\/?$/);
    // Paikkakunnat taivutettuina, kuten otsikossa luontevasti lukee
    await expect(page).toHaveTitle(/Tahkolla.*Siilinjärvellä.*Kuopiossa.*Rautavaaralla/);
  });

  test("tietosivujen otsikossa on sivun nimi ja yrityksen nimi", async ({ page }) => {
    await page.goto("/kayttoehdot");
    await expect(page).toHaveTitle("Käyttöehdot – Tahkon Amanda");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/kayttoehdot\/$/);
  });
});

test.describe("Miksi liikkua -galleria", () => {
  test("kuvakaruselli näyttää kuvat ja nuolet vierittävät", async ({ page, isMobile }) => {
    await page.goto("/#miksi-liikkua");
    const list = page.getByRole("list", { name: /Kuvia tunneilta/ });
    await expect(list).toBeVisible();
    await expect(list.getByRole("listitem")).toHaveCount(7);
    test.skip(isMobile, "Mobiilissa selataan pyyhkäisemällä, nuolet ovat piilossa");
    const before = await list.evaluate((el) => el.scrollLeft);
    await page.getByRole("button", { name: "Seuraavat kuvat" }).click();
    await expect.poll(() => list.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);
  });
});

test.describe("Kuvat", () => {
  test("jokainen srcset-kuvaversio löytyy (scripts/optimize-images.mjs)", async ({ page, request }) => {
    await page.goto("/");
    const urls = await page.evaluate(() =>
      [...document.querySelectorAll("img[srcset]")].flatMap((img) =>
        img.getAttribute("srcset")!.split(",").map((s) => s.trim().split(" ")[0]),
      ),
    );
    expect(urls.length).toBeGreaterThan(0);
    for (const url of new Set(urls)) {
      const res = await request.get(url);
      expect(res.status(), url).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/webp");
    }
  });
});

test.describe("Hengähdä hetki", () => {
  test("ajastettu 4–7–8: teksti, laskuri ja kukka tahdissa, lopussa kutsu tunnille", async ({ page }) => {
    await page.clock.install(); // Kello hallintaan: rAF ja performance.now etenevät vain käskystä
    await page.goto("/#hengitys");
    const section = page.locator("#hengitys");
    const p = () => section.evaluate((el) => parseFloat(getComputedStyle(el).getPropertyValue("--p")));
    const title = section.locator("[aria-live] p").first();

    await section.getByRole("button", { name: /Aloita harjoitus/ }).click();
    await page.clock.runFor(1000);
    await expect(title).toHaveText("Valmistaudu");

    // Valmistautuminen 3 s + sisään 2,5 s: kukka sulkeutumassa, laskuri 3
    await page.clock.runFor(4500);
    await expect(title).toHaveText("Hengitä sisään");
    await expect(section.getByText("/ 4")).toBeVisible();
    await expect(section.locator(".tabular-nums")).toHaveText("3");
    // Pidätys (3 + 4 + 3 s): nuppu kiinni
    await page.clock.runFor(4500);
    await expect(title).toHaveText("Pidätä");
    expect(await p()).toBeLessThan(0.2);
    // Uloshengityksen loppu (3 + 4 + 7 + 7,9 s): kukka lähes auki
    await page.clock.runFor(11900);
    await expect(title).toHaveText("Hengitä ulos");
    expect(await p()).toBeGreaterThan(0.95);

    // Loput kierrokset
    await page.clock.runFor(60000);
    await expect(page.getByRole("link", { name: /Tule kokemaan koko tunti/ })).toBeVisible();
    await expect(section.getByRole("button", { name: "Uudelleen" })).toBeVisible();
  });

  test("Lopeta palauttaa alkutilaan ja kukan auki", async ({ page }) => {
    await page.clock.install();
    await page.goto("/#hengitys");
    const section = page.locator("#hengitys");
    await section.getByRole("button", { name: /Aloita harjoitus/ }).click();
    await page.clock.runFor(8000);
    await section.getByRole("button", { name: "Lopeta" }).click();
    await expect(section.getByRole("button", { name: /Aloita harjoitus/ })).toBeVisible();
    expect(await section.evaluate((el) => getComputedStyle(el).getPropertyValue("--p").trim())).toBe("1");
  });

  test("vähennetty liike: harjoitus toimii, kukka pysyy paikallaan", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.clock.install();
    await page.goto("/#hengitys");
    const section = page.locator("#hengitys");
    await section.getByRole("button", { name: /Aloita harjoitus/ }).click();
    await page.clock.runFor(10000);
    await expect(section.locator("[aria-live] p").first()).toHaveText("Pidätä");
    expect(await section.evaluate((el) => getComputedStyle(el).getPropertyValue("--p").trim())).toBe("1");
    await context.close();
  });
});

test.describe("Lootusmandala", () => {
  test("koriste ei peitä hinnastoa ja piiloutuu suurella kontrastilla", async ({ page }) => {
    await page.goto("/#hinnasto");
    const mandala = page.locator("#hinnasto .lotus-mandala").first();
    await expect(mandala).toHaveAttribute("aria-hidden", "true");
    // Hinnan päällä ei ole mitään: klikkaus osuu hintaan eikä koristeeseen
    const price = page.locator("#hinnasto dd").first();
    await price.scrollIntoViewIfNeeded();
    const box = (await price.boundingBox())!;
    const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.tagName, [box.x + box.width / 2, box.y + box.height / 2]);
    expect(hit).toBe("DD");
    // Windowsin suuri kontrasti: koriste pois
    await page.emulateMedia({ forcedColors: "active" });
    await expect(mandala).toBeHidden();
  });
});

test.describe("Kalenteri", () => {
  test("tunneilla on ilmoittautuminen, kalenteriin lisäys ja jako", async ({ page, request }) => {
    await page.goto("/#kalenteri");
    const items = page.locator("#kalenteri ol > li");
    expect(await items.count()).toBeGreaterThan(0);
    const first = items.first();

    // Ei päättyneitä tunteja (selain suodattaa omalla kellollaan)
    const ends = await page.locator("#kalenteri time").evaluateAll((els) => els.map((el) => el.getAttribute("datetime")));
    for (const start of ends) expect(new Date(start!).getTime()).toBeGreaterThan(Date.now() - 4 * 3_600_000);

    // Ilmoittautuminen Amandan Forms-lomakkeella uudessa välilehdessä
    const signup = first.getByRole("link", { name: /^Ilmoittaudu/ });
    await expect(signup).toHaveAttribute("href", site.signupForm!);
    await expect(signup).toHaveAttribute("target", "_blank");
    await expect(signup).toHaveAttribute("rel", /noopener/);

    // "+ Kalenteriin" avaa valikon; .ics-tiedosto on olemassa ja oikeaa muotoa
    await first.getByText("+ Kalenteriin").click();
    await expect(first.getByRole("link", { name: /Google-kalenteri/ })).toHaveAttribute("href", /calendar\.google\.com/);
    const ics = await first.getByRole("link", { name: /\.ics/ }).getAttribute("href");
    const res = await request.get(ics!);
    expect(res.status()).toBe(200);
    expect(await res.text()).toMatch(/^BEGIN:VCALENDAR\r\n[\s\S]*BEGIN:VEVENT/);

    await expect(first.getByRole("button", { name: /Jaa/ })).toBeVisible();
  });

  test("aluksi viisi lähintä tuntia, loput Näytä kaikki -painikkeella", async ({ page }) => {
    await page.goto("/#kalenteri");
    const items = page.locator("#kalenteri ol > li");
    const total = await items.count();
    test.skip(total <= 5, "Kalenterissa on enintään viisi tuntia");
    await expect(items.filter({ visible: true })).toHaveCount(5);
    await page.getByRole("button", { name: `Näytä kaikki tunnit (${total})` }).click();
    await expect(items.filter({ visible: true })).toHaveCount(total);
  });

  test("jakolinkki piilossa olevaan tuntiin avaa koko listan", async ({ page }) => {
    await page.goto("/");
    const ids = await page.locator("#kalenteri ol > li").evaluateAll((els) => els.map((el) => el.id));
    test.skip(ids.length <= 5, "Kalenterissa on enintään viisi tuntia");
    await page.goto(`/#${ids.at(-1)}`);
    await expect(page.locator(`#${ids.at(-1)}`)).toBeInViewport();
  });

  test("hero nostaa seuraavan tunnin, joka löytyy kalenterista", async ({ page }) => {
    await page.goto("/");
    const next = page.locator("#top").getByRole("link", { name: /Seuraava tunti/ });
    await expect(next).toBeVisible();
    const href = await next.getAttribute("href");
    const id = href!.split("#")[1];
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  });
});

test.describe("Instagram", () => {
  test("karusellin nuolet vierittävät julkaisuja", async ({ page, isMobile }) => {
    test.skip(isMobile, "Mobiilissa selataan pyyhkäisemällä, nuolet ovat piilossa");
    await page.goto("/#instagram");
    const list = page.getByRole("list", { name: /Instagram-julkaisut/ });
    const prev = page.getByRole("button", { name: "Edelliset julkaisut" });
    const next = page.getByRole("button", { name: "Seuraavat julkaisut" });

    await expect(prev).toBeDisabled(); // Alussa ei voi mennä taaksepäin
    await next.click();
    await expect.poll(() => list.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
    await expect(prev).toBeEnabled();
  });
});

test.describe("Alatunniste ja tietosivut", () => {
  for (const item of site.legal) {
    test(`${item.label}: linkki alatunnisteessa ja sivu latautuu`, async ({ page }) => {
      await page.goto("/");
      const link = page.getByRole("navigation", { name: "Ehdot ja tietosuoja" }).getByRole("link", { name: item.label });
      await expect(link).toHaveAttribute("href", item.href);

      const response = await page.goto(item.href);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1, name: item.label === "Tietosuoja" ? "Tietosuojaseloste" : item.label })).toBeVisible();
    });
  }
});

test.describe("Navigaatio", () => {
  test("Hinnasto-linkki vierittää hinnastoon", async ({ page, isMobile }) => {
    await page.goto("/");
    await clickNavLink(page, isMobile, "Hinnasto");
    await expect(page).toHaveURL(/#hinnasto$/);
    await expect(page.locator("#hinnasto")).toBeInViewport();
  });

  test("Yhteystiedot-linkki vierittää alatunnisteen yhteystietoihin", async ({ page, isMobile }) => {
    await page.goto("/");
    await clickNavLink(page, isMobile, "Yhteystiedot");
    await expect(page).toHaveURL(/#yhteystiedot$/);
    await expect(page.locator("#yhteystiedot")).toBeInViewport();
  });

  test("Hyvinvointi-linkki vierittää Hyvinvointi-palstaan", async ({ page, isMobile }) => {
    await page.goto("/");
    await clickNavLink(page, isMobile, "Hyvinvointi");
    await expect(page).toHaveURL(/#hyvinvointi$/);
    await expect(page.getByRole("heading", { level: 3, name: "Hyvinvointi" })).toBeInViewport();
  });

  test("alavalikon palvelulinkki vie oikeaan palveluun", async ({ page, isMobile }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Päävalikko" });
    if (isMobile) {
      // Mobiili: valikko auki → Liikunnan nuoli → palvelulista
      await nav.getByRole("button", { name: "Avaa valikko" }).click();
      await nav.getByRole("button", { name: "Liikunta: näytä palvelut" }).click();
    } else {
      // Työpöytä: alavalikko aukeaa, kun hiiri viedään Liikunta-kohdan päälle
      await nav.getByRole("link", { name: "Liikunta", exact: true }).hover();
    }
    await nav.getByRole("link", { name: "Vesijumppa" }).click();
    await expect(page).toHaveURL(/#vesijumppa$/);
    await expect(page.locator("#vesijumppa")).toBeInViewport();
  });

  test("yläpalkki piiloutuu alas vieritettäessä ja palaa ylös vieritettäessä", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header").first();
    await expect(header).toHaveAttribute("data-scrolled", "false");

    // Hiiren rulla vierittää kuten käyttäjä (window.scrollTo ei vastaisi oikeaa käyttöä)
    await page.mouse.move(200, 400);
    await page.mouse.wheel(0, 1500);
    await expect(header).toHaveAttribute("data-hidden", "true");
    await expect(header).toHaveAttribute("data-scrolled", "true");
    await expect(header).not.toBeInViewport();

    await page.mouse.wheel(0, -300);
    await expect(header).toHaveAttribute("data-hidden", "false");
    await expect(header).toBeInViewport();
  });

  test("valikon linkki toimii myös toiselta sivulta", async ({ page, isMobile }) => {
    // Linkit ovat muotoa /#hinnasto, joten ne vievät tietosuojasivulta takaisin etusivulle
    await page.goto("/tietosuoja");
    await clickNavLink(page, isMobile, "Hinnasto");
    await expect(page).toHaveURL(/\/#hinnasto$/);
    await expect(page.locator("#hinnasto")).toBeInViewport();
  });

  test("mobiilivalikko aukeaa, sulkeutuu Esc-näppäimellä ja linkin klikkauksesta", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "Hampurilaisvalikko on vain mobiilissa");
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: "Avaa valikko" });
    const menu = page.locator("#mobiilivalikko");

    await menuButton.click();
    await expect(menu).toBeVisible();
    await expect(page.getByRole("button", { name: "Sulje valikko" })).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();

    await menuButton.click();
    await menu.getByRole("link", { name: "Minusta" }).click();
    await expect(menu).toBeHidden();
    await expect(page.locator("#minusta")).toBeInViewport();
  });
});

test.describe("Palvelut", () => {
  test("kaikki palvelut näkyvät oikeissa palstoissa", async ({ page }) => {
    // Odotetut määrät ja nimet luetaan datasta, jotta testi ei hajoa, kun palveluita lisätään
    await page.goto("/");
    for (const cat of serviceCategories) {
      const column = page.getByRole("region", { name: cat.label });
      await expect(column.getByRole("listitem")).toHaveCount(cat.services.length);
      for (const s of cat.services) {
        await expect(column.getByRole("heading", { level: 4, name: s.title })).toBeAttached();
      }
    }
  });

  test("työpöydällä kuvaukset näkyvät heti", async ({ page, isMobile }) => {
    test.skip(isMobile, "Mobiilissa kuvaus avautuu klikkaamalla (oma testi)");
    await page.goto("/#liikunta");
    await expect(page.getByText(/Vedessä liikkuminen on nivelille ystävällistä/)).toBeVisible();
  });

  test("mobiilissa kuvaus avautuu ja sulkeutuu palvelun nimeä napauttamalla", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Työpöydällä kuvaukset näkyvät aina");
    await page.goto("/#liikunta");
    const button = page.getByRole("button", { name: "Vesijumppa", exact: true });
    const description = page.getByText(/Vedessä liikkuminen on nivelille ystävällistä/);

    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(description).toBeHidden();

    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(description).toBeVisible();

    await button.click();
    await expect(description).toBeHidden();
  });
});

test.describe("Virhesivut", () => {
  test("olematon osoite palauttaa tilakoodin 404 ja oman 404-sivun", async ({ page }) => {
    const response = await page.goto("/tata-sivua-ei-ole");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Taisit eksyä polulta" })).toBeVisible();

    // Hakukoneet eivät saa indeksoida 404-sivua
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

    // Etusivulle-painike vie takaisin etusivulle
    await page.getByRole("link", { name: "Etusivulle" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
