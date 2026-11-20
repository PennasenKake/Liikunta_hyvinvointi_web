// index.test.mjs: Workerin yksikkötestit (node --test, ei Cloudflare-yhteyttä).
// GitHubin rajapinta korvataan testissä valefetchillä, joten mitään ei oikeasti käynnistetä.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import worker, { keyMatches, triggerWorkflow, workflowRunning } from "../src/index.js";

const AVAIN = "testiavain-joka-on-riittavan-pitka";
const env = { GITHUB_TOKEN: "ghp_testi", GITHUB_REPO: "PennasenKake/Liikunta_hyvinvointi_web", GITHUB_REF: "main", PAIVITYS_AVAIN: AVAIN };

/** Valefetch: kirjaa kutsut ja vastaa annetuilla luvuilla */
function fakeGithub({ queued = 0, inProgress = 0, dispatchStatus = 204, listStatus = 200 } = {}) {
  const calls = [];
  const fn = async (url, init = {}) => {
    calls.push({ url, init });
    if (url.includes("/dispatches")) return new Response(null, { status: dispatchStatus });
    const count = url.includes("status=queued") ? queued : inProgress;
    return new Response(JSON.stringify({ total_count: count }), { status: listStatus });
  };
  return { fn, calls };
}

describe("triggerWorkflow", () => {
  it("käynnistää tuotanto.yml:n main-haarasta syyn kanssa", async () => {
    const gh = fakeGithub();
    assert.equal(await triggerWorkflow(env, "ajastin", gh.fn), "kaynnistetty");
    const dispatch = gh.calls.at(-1);
    assert.match(dispatch.url, /\/repos\/PennasenKake\/Liikunta_hyvinvointi_web\/actions\/workflows\/tuotanto\.yml\/dispatches$/);
    assert.equal(dispatch.init.method, "POST");
    assert.deepEqual(JSON.parse(dispatch.init.body), { ref: "main", inputs: { syy: "ajastin" } });
    assert.equal(dispatch.init.headers.Authorization, "Bearer ghp_testi");
    assert.ok(dispatch.init.headers["User-Agent"]);
  });

  it("ei käynnistä uutta, jos edellinen on jonossa tai käynnissä", async () => {
    for (const tila of [{ queued: 1 }, { inProgress: 1 }]) {
      const gh = fakeGithub(tila);
      assert.equal(await triggerWorkflow(env, "ajastin", gh.fn), "kaynnissa");
      assert.ok(!gh.calls.some((c) => c.url.includes("/dispatches")));
    }
  });

  it("GitHubin virhe ja puuttuva token heittävät virheen (näkyy Workerin lokissa)", async () => {
    await assert.rejects(triggerWorkflow(env, "x", fakeGithub({ dispatchStatus: 403 }).fn), /403/);
    await assert.rejects(workflowRunning(env, fakeGithub({ listStatus: 401 }).fn), /401/);
    await assert.rejects(triggerWorkflow({ ...env, GITHUB_TOKEN: "" }, "x", fakeGithub().fn), /GITHUB_TOKEN/);
  });
});

describe("keyMatches", () => {
  it("vain täsmälleen oikea avain kelpaa", () => {
    assert.equal(keyMatches(AVAIN, AVAIN), true);
    assert.equal(keyMatches(`${AVAIN}x`, AVAIN), false);
    assert.equal(keyMatches(AVAIN.replace(/.$/, "X"), AVAIN), false);
    assert.equal(keyMatches(null, AVAIN), false);
    assert.equal(keyMatches("", ""), false);
  });
  it("liian lyhyt tai puuttuva salaisuus estää kaiken (unohtunut asetus ei avaa sivua)", () => {
    assert.equal(keyMatches("lyhyt", "lyhyt"), false);
    assert.equal(keyMatches("undefined", undefined), false);
  });
});

describe("fetch: /paivita", () => {
  const assets = { fetch: async () => new Response("404-sivu", { status: 404 }) };
  const e = { ...env, ASSETS: assets };

  it("väärä tai puuttuva avain näyttää tavallisen 404-sivun", async () => {
    for (const url of ["https://tahkonamanda.fi/paivita", "https://tahkonamanda.fi/paivita?avain=vaara-avain-1234567890ab"]) {
      const res = await worker.fetch(new Request(url), e);
      assert.equal(res.status, 404);
      assert.equal(await res.text(), "404-sivu");
    }
  });

  it("oikea avain: GET näyttää painikkeen, ei käynnistä mitään, ei välimuistia eikä viittaajaa", async () => {
    const res = await worker.fetch(new Request(`https://tahkonamanda.fi/paivita?avain=${AVAIN}`), e);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /<form method="post" action="\/paivita">/);
    assert.match(html, /Päivitä nyt/);
    assert.equal(res.headers.get("Cache-Control"), "no-store");
    assert.equal(res.headers.get("Referrer-Policy"), "no-referrer");
    assert.match(res.headers.get("X-Robots-Tag"), /noindex/);
  });

  it("POST väärällä avaimella ei käynnistä mitään", async () => {
    const body = new URLSearchParams({ avain: "vaara-avain-1234567890abcdef" });
    const res = await worker.fetch(new Request("https://tahkonamanda.fi/paivita", { method: "POST", body }), e);
    assert.equal(res.status, 404);
  });

  it("POST oikealla avaimella käynnistää päivityksen ja kertoo sen", async () => {
    const gh = fakeGithub();
    const original = globalThis.fetch;
    globalThis.fetch = gh.fn;
    try {
      const body = new URLSearchParams({ avain: AVAIN });
      const res = await worker.fetch(new Request("https://tahkonamanda.fi/paivita", { method: "POST", body }), e);
      assert.equal(res.status, 200);
      assert.match(await res.text(), /Päivitys käynnistyi/);
      assert.deepEqual(JSON.parse(gh.calls.at(-1).init.body).inputs, { syy: "Päivitä nyt" });
    } finally {
      globalThis.fetch = original;
    }
  });

  it("muut osoitteet menevät sivuston 404-sivulle", async () => {
    const res = await worker.fetch(new Request("https://tahkonamanda.fi/ei-ole"), e);
    assert.equal(res.status, 404);
  });
});
