// calendar.test.ts: kalenterin apufunktioiden yksikkötestit (Vitest, npm test).
import { describe, expect, it } from "vitest";
import { filterUpcoming, formProvider, googleCalendarUrl, cancelHref, serviceHref, signupHref, signupLabel, toIcs, type CalendarEvent } from "./calendar";

const e: CalendarEvent = {
  id: "t1",
  title: "Yin jooga",
  start: "2026-11-18T17:30:00+02:00",
  end: "2026-11-18T18:45:00+02:00",
  location: "Sali, Siilinjärvi",
  description: "Ota alusta mukaan; vesipullo, pyyhe.\nTervetuloa!",
};

describe("filterUpcoming", () => {
  it("piilottaa päättyneet, mutta näyttää käynnissä olevan tunnin", () => {
    const during = new Date("2026-11-18T18:00:00+02:00").getTime();
    const after = new Date("2026-11-18T18:46:00+02:00").getTime();
    expect(filterUpcoming([e], during)).toHaveLength(1);
    expect(filterUpcoming([e], after)).toHaveLength(0);
  });
});

describe("toIcs", () => {
  const ics = toIcs(e, "https://tahkonamanda.fi/", "20261110T120000Z");
  it("on iCalendar-muotoa CRLF-rivinvaihdoin ja UTC-ajoin", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics).toContain("DTSTART:20261118T153000Z");
    expect(ics).toContain("DTEND:20261118T164500Z");
    expect(ics).toContain("UID:t1@tahkonamanda.fi");
  });
  it("koodaa erikoismerkit ja taittaa pitkät rivit", () => {
    expect(ics.replace(/\r\n /g, "")).toContain("DESCRIPTION:Ota alusta mukaan\\; vesipullo\\, pyyhe.\\nTervetuloa!");
    for (const line of ics.split("\r\n")) expect(line.length).toBeLessThanOrEqual(75);
  });
});

describe("formProvider", () => {
  it("tunnistaa lomakepalvelun tietosuojatekstiä varten", () => {
    expect(formProvider("https://forms.cloud.microsoft/r/SCYtDm1Ypb")?.company).toBe("Microsoft");
    expect(formProvider("https://forms.office.com/r/abc")?.name).toBe("Microsoft Forms");
    expect(formProvider("https://docs.google.com/forms/d/e/x/viewform")?.name).toBe("Google Forms");
    expect(formProvider("https://example.com/lomake")?.name).toBe("verkkolomake");
    expect(formProvider(null)).toBeNull();
  });
});

describe("linkit", () => {
  it("Google-kalenterin linkki sisältää ajat UTC:nä", () => {
    expect(googleCalendarUrl(e)).toContain("dates=20261118T153000Z%2F20261118T164500Z");
  });
  it("ilmoittautuminen on valmiiksi täytetty sähköposti", () => {
    const href = signupHref(e, null, null);
    expect(href).toMatch(/^mailto:[^?]+\?subject=/);
    expect(decodeURIComponent(href)).toContain("Yin jooga");
    expect(signupHref(e, "https://forms.example/x", null)).toBe("https://forms.example/x");
    // Valmiiksi täytetty Forms-linkki: tunti lomakkeen vaihtoehdon muodossa
    expect(signupLabel(e)).toBe("Yin jooga ke 18.11. klo 17.30");
    expect(signupHref(e, "https://forms.example/x", "https://forms.example/x?r1={tunti}")).toBe(
      `https://forms.example/x?r1=${encodeURIComponent("Yin jooga ke 18.11. klo 17.30")}`,
    );
  });
  it("peruutus on valmis sähköposti, jossa tunti samassa muodossa kuin lomakkeessa", () => {
    const url = new URL(cancelHref(e));
    expect(url.protocol).toBe("mailto:");
    expect(url.searchParams.get("subject")).toBe("Peruutus: Yin jooga ke 18.11. klo 17.30");
    expect(url.searchParams.get("body")).toContain("perun ilmoittautumiseni tunnille Yin jooga ke 18.11. klo 17.30");
  });
  it("tunnin nimi löytää samannimisen palvelun", () => {
    expect(serviceHref("vesijumppa")).toBe("/#vesijumppa");
    expect(serviceHref("Tuntematon tunti")).toBeNull();
  });
});
