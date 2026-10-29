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
    for (const id of ["palvelut", "hinnasto", "minusta", "kalenteri", "instagram", "yhteystiedot"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }

    // Puhelinnumero on klikattava tel:-linkki
    await expect(page.locator(`a[href="${site.phoneHref}"]`).first()).toBeVisible();

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
