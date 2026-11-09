// fetch-calendar.test.mjs: kalenterin haun yksikkötestit (Vitest, npm test).
import { describe, expect, it } from "vitest";
import { fetchGoogleEvents, normalizeEvent, plainText, sampleEvents } from "./fetch-calendar.mjs";

const item = {
  id: "abc-123_20261117T160000Z",
  status: "confirmed",
  summary: " Vesijumppa ",
  location: "Uimahalli, Tahko",
  description: "Ota <b>uikkarit</b> mukaan.<br>Tervetuloa &amp; nähdään!",
  start: { dateTime: "2026-11-17T18:00:00+02:00" },
  end: { dateTime: "2026-11-17T18:45:00+02:00" },
};

describe("normalizeEvent", () => {
  it("muuttaa Googlen tapahtuman sivuston muotoon", () => {
    expect(normalizeEvent(item)).toEqual({
      id: "abc_123_20261117T160000Z",
      title: "Vesijumppa",
      start: "2026-11-17T18:00:00+02:00",
      end: "2026-11-17T18:45:00+02:00",
      location: "Uimahalli, Tahko",
      description: "Ota uikkarit mukaan.\nTervetuloa & nähdään!",
    });
  });
  it("ohittaa perutut, kokopäivän ja nimettömät tapahtumat", () => {
    expect(normalizeEvent({ ...item, status: "cancelled" })).toBeNull();
    expect(normalizeEvent({ ...item, start: { date: "2026-11-17" }, end: { date: "2026-11-18" } })).toBeNull();
    expect(normalizeEvent({ ...item, summary: "" })).toBeNull();
  });
});

describe("plainText", () => {
  it("poistaa HTML-tagit ja katkaisee pitkän tekstin", () => {
    expect(plainText('<a href="x">Linkki</a><script>x</script>')).toBe("Linkkix");
    expect(plainText("a".repeat(1000))).toHaveLength(400);
    expect(plainText(undefined)).toBe("");
  });
});

describe("sampleEvents", () => {
  it("tekee vain tulevia tunteja kahdelle viikolle, aikajärjestyksessä", () => {
    const now = new Date("2026-11-10T12:00:00Z");
    const events = sampleEvents(now);
    expect(events.length).toBe(10); // 5 tuntia viikossa × 2 viikkoa
    for (const e of events) {
      expect(new Date(e.start).getTime()).toBeGreaterThan(now.getTime());
      expect(new Date(e.end).getTime()).toBeGreaterThan(new Date(e.start).getTime());
    }
    const starts = events.map((e) => new Date(e.start).getTime());
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
  });
  it("käyttää kesäaikaa (+03:00) kesällä", () => {
    const e = sampleEvents(new Date("2026-06-01T12:00:00Z"))[0];
    expect(e.start).toMatch(/\+03:00$/);
  });
});

describe("fetchGoogleEvents", () => {
  it("pyytää toistuvat tunnit yksittäisinä ja aikajärjestyksessä", async () => {
    let called = "";
    const fetchImpl = async (url) => {
      called = url;
      return { ok: true, json: async () => ({ items: [item, { ...item, status: "cancelled" }] }) };
    };
    const events = await fetchGoogleEvents({ calendarId: "a@group.calendar.google.com", apiKey: "k", fetchImpl });
    expect(events).toHaveLength(1);
    expect(called).toContain("calendars/a%40group.calendar.google.com/events");
    expect(called).toContain("singleEvents=true");
    expect(called).toContain("orderBy=startTime");
  });
  it("heittää virheen eikä tulosta avainta", async () => {
    const fetchImpl = async () => ({ ok: false, status: 403, text: async () => "API key not valid" });
    await expect(fetchGoogleEvents({ calendarId: "a", apiKey: "SALAINEN", fetchImpl })).rejects.toThrow(/403/);
    await expect(fetchGoogleEvents({ calendarId: "a", apiKey: "SALAINEN", fetchImpl })).rejects.not.toThrow(/SALAINEN/);
  });
});
