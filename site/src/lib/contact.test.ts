// contact.test.ts: valmiiksi täytettyjen sähköpostien muoto.
import { describe, expect, it } from "vitest";
import { contactHref, mailtoHref, quoteHref } from "./contact";
import { site } from "./site";

describe("mailto-linkit", () => {
  it("osoite, otsikko ja runko koodattuina", () => {
    const href = mailtoHref("Ääni & rauha", "Rivi 1\nRivi 2");
    expect(href.startsWith(`mailto:${site.email}?subject=`)).toBe(true);
    const url = new URL(href);
    expect(url.searchParams.get("subject")).toBe("Ääni & rauha");
    expect(url.searchParams.get("body")).toBe("Rivi 1\nRivi 2");
  });

  it("yhteydenotto ja tarjouspyyntö osoittavat Amandalle", () => {
    expect(new URL(contactHref).searchParams.get("subject")).toBe("Yhteydenotto verkkosivuilta");
    expect(new URL(quoteHref).searchParams.get("body")).toContain("Osallistujia noin:");
  });
});
