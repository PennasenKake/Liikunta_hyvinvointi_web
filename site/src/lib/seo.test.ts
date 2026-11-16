// seo.test.ts: hakukoneiden rakennetiedon ja apufunktioiden yksikkötestit (Vitest, npm test).
// Rakennetiedon voi tarkistaa myös Googlen työkalulla: search.google.com/test/rich-results
import { describe, expect, it } from "vitest";
import { eventsJsonLd, findPlaceholders, jsonLdString, localBusinessJsonLd, websiteJsonLd } from "./seo";
import { priceValue } from "./pricing";
import { site } from "./site";

describe("LocalBusiness-rakennetieto", () => {
  const lb = localBusinessJsonLd();

  it("sisältää paikallisen haun perustiedot", () => {
    expect(lb["@type"]).toBe("LocalBusiness");
    expect(lb.name).toBe(site.name);
    expect(lb.telephone).toMatch(/^\+358\d+$/);
    expect(lb.address.addressCountry).toBe("FI");
  });

  it("kaikki toiminta-alueen paikkakunnat ovat palvelualueena", () => {
    expect(lb.areaServed.map((a) => a.name)).toEqual([...site.areas]);
  });

  it("verkkosivusto viittaa yritykseen samalla tunnisteella (@id)", () => {
    expect(websiteJsonLd().publisher["@id"]).toBe(lb["@id"]);
  });
});

describe("hinnat rakennetietoon", () => {
  it("lukee hinnan eri muodoista", () => {
    expect(priceValue("25 €")).toBe(25);
    expect(priceValue("alk. 25,50 €")).toBe(25.5);
    expect(priceValue("120€")).toBe(120);
  });
  it("paikkamerkkiä tai tekstiä ei tulkita hinnaksi", () => {
    expect(priceValue("[HINTA] €")).toBeNull();
    expect(priceValue("Kysy tarjous")).toBeNull();
  });
});

describe("tapahtumat (Event)", () => {
  it("paikkakunta poimitaan paikan viimeisestä osasta, jos se on toiminta-alueella", () => {
    const [e] = eventsJsonLd([
      { id: "a", title: "Vesijumppa", start: "2026-12-01T18:00:00+02:00", end: "2026-12-01T18:45:00+02:00", location: "Kylpylä, Tahko", description: "" },
    ]);
    expect(e.location.address.addressLocality).toBe("Tahko");
    expect(e.organizer["@id"]).toBe(localBusinessJsonLd()["@id"]);
  });
});

describe("turvallisuus ja laatu", () => {
  it("JSON ei voi sulkea <script>-tagia (XSS)", () => {
    expect(jsonLdString({ x: "</script><script>alert(1)</script>" })).not.toContain("</script>");
  });
  it("paikkamerkit löytyvät näkyvästä tekstistä mutta eivät skripteistä", () => {
    expect(findPlaceholders('<p>[HINTA] €</p><script>const a=["x"]</script>')).toEqual(["[HINTA]"]);
  });
});
