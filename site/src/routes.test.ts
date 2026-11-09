// routes.test.ts: reittien ja sivuston datan yksikkötestit (Vitest, npm test).
// Nopeita tarkistuksia ilman selainta: e2e-testit (e2e/) testaavat sivua selaimessa.

import { describe, expect, it } from "vitest";
import { findRoute, fullTitle, normalizePath, routes } from "./routes";
import { site } from "./lib/site";
import { serviceCategories, serviceCount, serviceId } from "./lib/services";

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
    expect(fullTitle(findRoute("/"))).toMatch(/^Tahkon Amanda/);
  });

  it("hakukonekuvaukset ovat sopivan mittaisia (Google näyttää noin 160 merkkiä)", () => {
    for (const r of routes) expect(r.description.length, r.path).toBeLessThanOrEqual(170);
  });
});

describe("palvelut", () => {
  it("palveluiden tunnisteet (ankkurit) ovat yksilöllisiä", () => {
    const ids = serviceCategories.flatMap((c) => c.services.map((s) => serviceId(s.title)));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("palvelumäärä lasketaan datasta", () => {
    expect(serviceCount).toBe(serviceCategories.reduce((n, c) => n + c.services.length, 0));
  });

  it("hero-versio on sallittu", () => {
    expect(["a", "b", "c"]).toContain(site.heroVariant);
  });
});
