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
});

test.describe("Navigaatio", () => {
  test("Hinnasto-linkki vierittää hinnastoon", async ({ page, isMobile }) => {
    await page.goto("/");
    await clickNavLink(page, isMobile, "Hinnasto");
    await expect(page).toHaveURL(/#hinnasto$/);
    await expect(page.locator("#hinnasto")).toBeInViewport();
  });

  test("Hyvinvointi-linkki avaa oikean välilehden", async ({ page, isMobile }) => {
    await page.goto("/");
    await clickNavLink(page, isMobile, "Hyvinvointi");
    await expect(page).toHaveURL(/#hyvinvointi$/);
    await expect(page.getByRole("tab", { name: /Hyvinvointi/ })).toHaveAttribute("aria-selected", "true");
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
  test("välilehdet vaihtuvat nuolinäppäimillä (WAI-ARIA)", async ({ page }) => {
    await page.goto("/#liikunta");
    const liikunta = page.getByRole("tab", { name: /Liikunta/ });
    const hyvinvointi = page.getByRole("tab", { name: /Hyvinvointi/ });

    await expect(liikunta).toHaveAttribute("aria-selected", "true");
    await liikunta.focus();
    await page.keyboard.press("ArrowRight");

    // Valinta ja fokus siirtyvät, paneelin sisältö vaihtuu ja osoite päivittyy
    await expect(hyvinvointi).toHaveAttribute("aria-selected", "true");
    await expect(hyvinvointi).toBeFocused();
    await expect(page.getByRole("tabpanel").getByRole("heading", { name: "Yin jooga" })).toBeVisible();
    await expect(page).toHaveURL(/#hyvinvointi$/);
  });

  test("palvelukortit: oikea määrä ja toimivat linkit", async ({ page }) => {
    // Odotetut määrät luetaan datasta, jotta testi ei hajoa, kun palveluita lisätään
    const [liikunta, hyvinvointi] = serviceCategories;
    await page.goto("/#liikunta");
    const panel = page.getByRole("tabpanel");

    // Jokaisella palvelulla on kortti, jossa on otsikko (h3)
    await expect(panel.getByRole("heading", { level: 3 })).toHaveCount(liikunta.services.length);

    // Ryhmätunnin linkki vie kalenteriin, yksilöpalvelun linkki yhteystietoihin.
    // Linkin nimessä on palvelun nimi ruudunlukijaa varten (sr-only).
    await expect(panel.getByRole("link", { name: "Katso tunnit: Vesijumppa" })).toHaveAttribute("href", "/#kalenteri");
    await expect(panel.getByRole("link", { name: "Varaa aika: Personal Training" })).toHaveAttribute(
      "href",
      "/#yhteystiedot",
    );

    await page.getByRole("tab", { name: /Hyvinvointi/ }).click();
    await expect(panel.getByRole("heading", { level: 3 })).toHaveCount(hyvinvointi.services.length);

    // Kortin linkki toimii: kalenteri tulee näkyviin
    await panel.getByRole("link", { name: "Katso tunnit: Yin jooga" }).click();
    await expect(page.locator("#kalenteri")).toBeInViewport();
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

  test("tietosuojasivu latautuu", async ({ page }) => {
    const response = await page.goto("/tietosuoja");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: "Tietosuojaseloste" })).toBeVisible();
  });
});
