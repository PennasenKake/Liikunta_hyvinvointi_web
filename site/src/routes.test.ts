// routes.test.ts: reittien ja sivuston datan yksikkötestit (Vitest, npm test).
// Nopeita tarkistuksia ilman selainta: e2e-testit (e2e/) testaavat sivua selaimessa.

import { describe, expect, it } from "vitest";
import { findRoute, fullTitle, normalizePath, notFoundRoute, routes } from "./routes";
import { site } from "./lib/site";
import { serviceCategories, serviceId } from "./lib/services";

describe("reitit", () => {
  it("osoite löytyy kauttaviivan kanssa ja ilman", () => {
    expect(normalizePath("/tietosuoja")).toBe("/tietosuoja/");
    expect(findRoute("/tietosuoja").path).toBe("/tietosuoja/");
    expect(findRoute("/tietosuoja/").path).toBe("/tietosuoja/");
  });

  it("tuntematon osoite johtaa 404-sivulle, jota ei indeksoida", () => {
    const r = findRoute("/vesijumpa");
    expect(r.path).toBe("/404/");
    expect(r.noindex).toBe(true);
  });

  it("jokainen alatunnisteen tietosivulinkki on olemassa oleva reitti", () => {
    for (const item of site.legal) {
      expect(routes.some((r) => r.path === item.href), item.href).toBe(true);
    }
  });

  it("muiden kuin etusivun otsikossa on yrityksen nimi", () => {
    expect(fullTitle(findRoute("/kayttoehdot/"))).toBe("Käyttöehdot – Tahkon Amanda");
    // Etusivulla tärkein ensin (mitä + missä), yrityksen nimi lopussa
    expect(fullTitle(findRoute("/"))).toMatch(/Tahko.*\| Tahkon Amanda$/);
  });

  it("hakukonekuvaukset ovat sopivan mittaisia (Google näyttää noin 160 merkkiä)", () => {
    for (const r of routes) {
      expect(r.description.length, r.path).toBeLessThanOrEqual(170);
      expect(r.description.length, r.path).toBeGreaterThanOrEqual(50); // Liian lyhyt: Google kirjoittaa oman
    }
  });

  it("otsikot ovat yksilöllisiä ja mahtuvat hakutulokseen (noin 70 merkkiä)", () => {
    const titles = routes.map(fullTitle);
    expect(new Set(titles).size).toBe(titles.length);
    for (const t of titles) expect(t.length, t).toBeLessThanOrEqual(70);
  });

  it("kuvaukset ovat yksilöllisiä (sama kuvaus monella sivulla heikentää hakutuloksia)", () => {
    const d = routes.map((r) => r.description);
    expect(new Set(d).size).toBe(d.length);
  });
});

describe("palvelut", () => {
  it("palveluiden tunnisteet (ankkurit) ovat yksilöllisiä", () => {
    const ids = serviceCategories.flatMap((c) => c.services.map((s) => serviceId(s.title)));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("jokaisella palveluosalla on oma sivunsa ja jokainen palvelu kuuluu johonkin osaan", () => {
    for (const c of serviceCategories) {
      expect(findRoute(c.path).Page, c.path).not.toBe(notFoundRoute.Page);
      expect(c.services.length, c.id).toBeGreaterThan(0);
    }
    expect(serviceCategories.map((c) => c.id)).toEqual(["liikunta", "hyvinvointi", "valmennus"]);
  });

  it("liikunnan tunneilla on taso, muilla ei", () => {
    for (const c of serviceCategories) {
      for (const s of c.services) expect(Boolean(s.level), s.title).toBe(c.id === "liikunta");
    }
  });

});

describe("kuvat", () => {
  it("jokaisella kuvalla on alt-teksti ja mitat", async () => {
    const { photos } = await import("./lib/photos");
    for (const [name, p] of Object.entries(photos)) {
      expect(p.alt.length, name).toBeGreaterThan(10);
      expect(p.width * p.height, name).toBeGreaterThan(0);
    }
  });

  it("kuvapankkikuvalla on lähde, jotta se löytyy ja korvataan ennen julkaisua", async () => {
    const { stockPhotos } = await import("./lib/photos");
    for (const p of stockPhotos) {
      expect(p.stock?.source, p.src).toBeTruthy();
      expect(p.stock?.url, p.src).toMatch(/^https:\/\//);
    }
  });
});
