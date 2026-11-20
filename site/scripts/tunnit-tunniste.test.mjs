// tunnit-tunniste.test.mjs: julkaisun tarpeen tunnistus (Vitest, npm test)
import { describe, expect, it } from "vitest";
import { tunnitTunniste } from "./tunnit-tunniste.mjs";

const pohja = {
  source: "excel",
  fetchedAt: "2026-11-20T10:00:00.000Z",
  subscribeUrl: null,
  googleAddUrl: null,
  events: [{ id: "a", title: "HIIT", start: "2026-12-03T18:00:00+02:00", end: "2026-12-03T19:00:00+02:00", location: "Sali, Tahko" }],
};

describe("tunnitTunniste", () => {
  it("hakuaika ei vaikuta: sama sisältö, sama tunniste (ei turhaa julkaisua)", () => {
    expect(tunnitTunniste({ ...pohja, fetchedAt: "2026-11-20T10:15:00.000Z" }, "abc")).toBe(tunnitTunniste(pohja, "abc"));
  });
  it("muuttunut tunti, Täynnä-tila tai poistunut tunti muuttaa tunnisteen", () => {
    const t = tunnitTunniste(pohja, "abc");
    expect(tunnitTunniste({ ...pohja, events: [{ ...pohja.events[0], full: true }] }, "abc")).not.toBe(t);
    expect(tunnitTunniste({ ...pohja, events: [{ ...pohja.events[0], location: "Uimahalli, Tahko" }] }, "abc")).not.toBe(t);
    expect(tunnitTunniste({ ...pohja, events: [] }, "abc")).not.toBe(t);
  });
  it("uusi koodiversio muuttaa tunnisteen, vaikka tunnit ovat samat", () => {
    expect(tunnitTunniste(pohja, "def")).not.toBe(tunnitTunniste(pohja, "abc"));
  });
  it("tunniste on 64 merkin heksa (ei salaisuuksia)", () => {
    expect(tunnitTunniste(pohja)).toMatch(/^[0-9a-f]{64}$/);
  });
});
