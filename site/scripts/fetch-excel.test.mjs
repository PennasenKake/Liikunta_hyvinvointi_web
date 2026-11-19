// fetch-excel.test.mjs: Excel-tuntilistan luvun yksikkötestit (Vitest, npm test).
// Testitiedosto e2e/fixtures/tunnit-testi.xlsx on sama kuin Eerolle annettu testipohja.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { downloadCandidates, downloadWorkbook, isXlsx, parseDate, parseTime, readSheet, rowsToEvents } from "./fetch-excel.mjs";

const NOW = new Date("2026-11-20T12:00:00+02:00");
const header = ["Päivä", "Alkaa", "Päättyy", "Tunti", "Paikka", "Lisätieto", "Tila"];

describe("päivämäärät ja kellonajat", () => {
  it("Excelin päivämääräluku ja suomalainen teksti", () => {
    expect(parseDate(46357)).toBe("2026-12-01"); // Excel: 1.12.2026
    expect(parseDate("1.12.2026")).toBe("2026-12-01");
    expect(parseDate("2026-12-01")).toBe("2026-12-01");
    expect(parseDate("31.2.2026")).toBeNull(); // Ei olemassa
    expect(parseDate("huomenna")).toBeNull();
  });
  it("Excelin vuorokauden osa ja tekstimuodot", () => {
    expect(parseTime(0.75)).toBe("18:00");
    expect(parseTime(0.729166667)).toBe("17:30");
    expect(parseTime("18.00")).toBe("18:00");
    expect(parseTime("9:05")).toBe("09:05");
    expect(parseTime("18")).toBe("18:00");
    expect(parseTime("25:00")).toBeNull();
  });
});

describe("rivit tunneiksi", () => {
  it("tekee tunnin oikealla aikavyöhykkeellä (talvi +02:00, kesä +03:00)", () => {
    const { events } = rowsToEvents([header, ["1.12.2026", "18:00", "18:45", "Vesijumppa", "Uimahalli, Tahko", "", ""]], { now: NOW });
    expect(events[0]).toMatchObject({ title: "Vesijumppa", start: "2026-12-01T18:00:00+02:00", end: "2026-12-01T18:45:00+02:00", location: "Uimahalli, Tahko" });
    const summer = rowsToEvents([header, ["2.6.2027", "18:00", "", "Jooga", "", "", ""]], { now: new Date("2027-05-20T12:00:00Z") });
    expect(summer.events[0].start).toBe("2027-06-02T18:00:00+03:00");
    expect(summer.events[0].end).toBe("2027-06-02T19:00:00+03:00"); // Oletuskesto 60 min
  });

  it("Täynnä, Peruttu ja menneet tunnit", () => {
    const { events, skipped } = rowsToEvents(
      [header,
        ["2.12.2026", "19:00", "20:00", "Äänimaljarentoutus", "", "", "Täynnä"],
        ["3.12.2026", "18:00", "18:45", "HIIT", "", "", "Peruttu"],
        ["1.11.2026", "18:00", "18:45", "Vanha tunti", "", "", ""]],
      { now: NOW },
    );
    expect(events).toHaveLength(1);
    expect(events[0].full).toBe(true);
    expect(skipped).toEqual({ past: 1, cancelled: 1 });
  });

  it("hylkää virheelliset rivit syineen eikä kaada koko listaa", () => {
    const { events, rejected } = rowsToEvents(
      [header,
        ["9.12.2026", null, "18:45", "Yin jooga", "", "", ""],
        ["10.12.2026", "18:00", "17:00", "HIIT", "", "", ""],
        ["", "18:00", "", "", "", "", ""],
        ["11.12.2026", "18:00", "19:00", "Tehotreeni", "", "", ""]],
      { now: NOW },
    );
    expect(events.map((e) => e.title)).toEqual(["Tehotreeni"]);
    expect(rejected.map((r) => r.line)).toEqual([2, 3, 4]);
  });

  it("lukee vain tunnetut sarakkeet (esim. osallistujat eivät päädy sivulle)", () => {
    const { events } = rowsToEvents([[...header, "Osallistujat"], ["1.12.2026", "18:00", "", "Vesijumppa", "", "", "", "Matti, Maija"]], { now: NOW });
    expect(JSON.stringify(events)).not.toContain("Matti");
  });

  it("puuttuva pakollinen sarake kertoo selvästi, mikä puuttuu", () => {
    expect(() => rowsToEvents([["Päivä", "Tunti"]], { now: NOW })).toThrow(/alkaa/);
  });
});

describe("Excel-tiedosto", () => {
  it("lukee testipohjan: 6 tuntia, 1 täynnä, 1 peruttu, rivi 8 hylätty", () => {
    const { rows, date1904 } = readSheet(new Uint8Array(readFileSync("e2e/fixtures/tunnit-testi.xlsx")));
    const { events, rejected, skipped } = rowsToEvents(rows, { date1904, now: NOW });
    expect(events).toHaveLength(6);
    expect(events.filter((e) => e.full).map((e) => e.title)).toEqual(["Äänimaljarentoutus"]);
    expect(skipped.cancelled).toBe(1);
    expect(rejected).toEqual([{ line: 8, reason: "Alkuaika puuttuu tai on väärässä muodossa" }]);
  });
});

describe("lataus", () => {
  it("jakolinkistä tehdään kolme latausosoitetta", () => {
    const c = downloadCandidates("https://1drv.ms/x/s!AbC?e=123");
    expect(c[0]).toMatch(/^https:\/\/api\.onedrive\.com\/v1\.0\/shares\/u![A-Za-z0-9_-]+\/root\/content$/);
    expect(c[1]).toBe("https://1drv.ms/x/s!AbC?e=123&download=1");
  });

  it("hylkää HTML-sivun (esim. kirjautuminen) ja kokeilee seuraavaa tapaa", async () => {
    const xlsx = readFileSync("e2e/fixtures/tunnit-testi.xlsx");
    let calls = 0;
    const fetchImpl = async () => {
      calls++;
      return calls === 1 ? new Response("<html>Kirjaudu</html>", { status: 200 }) : new Response(xlsx, { status: 200 });
    };
    const bytes = await downloadWorkbook("https://1drv.ms/x/s!test", { fetchImpl });
    expect(isXlsx(bytes)).toBe(true);
    expect(calls).toBe(2);
  });

  it("virheilmoitus ei paljasta jakolinkkiä", async () => {
    const fetchImpl = async () => new Response("ei", { status: 403 });
    await expect(downloadWorkbook("https://1drv.ms/x/s!SALAINEN", { fetchImpl })).rejects.toThrow(/^(?!.*SALAINEN).*katselulinkillä/);
  });
});
