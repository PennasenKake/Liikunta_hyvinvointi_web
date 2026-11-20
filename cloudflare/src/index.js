// cloudflare/src/index.js: tuotantosivuston Worker (Cloudflare Workers, ilmainen paketti).
//
// Worker tekee kolme asiaa:
//   1. Sivusto: valmiit tiedostot (site/dist) tarjoillaan suoraan Cloudflaren reunalta
//      (assets, wrangler.jsonc). Tämä koodi ei koske niihin, vaan vastaa vain osoitteisiin,
//      joille ei ole tiedostoa, kuten /paivita. Muut ohjataan 404-sivulle.
//   2. Ajastin: 15 minuutin välein käynnistetään GitHubin tuotantotyönkulku
//      (.github/workflows/tuotanto.yml). Työnkulku julkaisee vain, jos Amandan Excel tai koodi
//      on muuttunut (scripts/tunnit-tunniste.mjs), joten useimmat ajot päättyvät minuutissa.
//      GitHubin oma ajastus (schedule) myöhästelee tunteja, Cloudflaren ei.
//   3. "Päivitä nyt": Amandan kirjanmerkki /paivita?avain=… avaa sivun, jonka painike käynnistää
//      saman työnkulun heti. Avain on salaisuus (PAIVITYS_AVAIN). Ilman oikeaa avainta sivu
//      vastaa kuin sitä ei olisi.
//
// Salaisuudet (npx wrangler secret put …, ei koskaan koodiin):
//   GITHUB_TOKEN    fine-grained token: vain tämä repo, oikeus Actions: Read and write
//   PAIVITYS_AVAIN  pitkä satunnainen merkkijono Amandan kirjanmerkkiin
// Ohje: docs/tuotanto.md

const WORKFLOW = "tuotanto.yml";
const GITHUB_API = "https://api.github.com";

// --- GitHub ---------------------------------------------------------------------

function githubHeaders(env) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "tahkonamanda-ajastin", // GitHub hylkää pyynnöt ilman User-Agentia
  };
}

/** Onko tuotantotyönkulku jo jonossa tai käynnissä? Silloin uutta ei käynnistetä. */
export async function workflowRunning(env, fetchFn = fetch) {
  for (const status of ["queued", "in_progress"]) {
    const url = `${GITHUB_API}/repos/${env.GITHUB_REPO}/actions/workflows/${WORKFLOW}/runs?status=${status}&per_page=1`;
    const res = await fetchFn(url, { headers: githubHeaders(env) });
    if (!res.ok) throw new Error(`GitHub vastasi ${res.status} (ajojen haku)`);
    const data = await res.json();
    if (data.total_count > 0) return true;
  }
  return false;
}

/**
 * Käynnistää tuotantotyönkulun (workflow_dispatch). Palauttaa "kaynnistetty" tai
 * "kaynnissa" (edellinen ajo kesken, uutta ei tarvita: se hakee joka tapauksessa tuoreet tunnit).
 */
export async function triggerWorkflow(env, reason, fetchFn = fetch) {
  if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) throw new Error("GITHUB_TOKEN tai GITHUB_REPO puuttuu");
  if (await workflowRunning(env, fetchFn)) return "kaynnissa";
  const url = `${GITHUB_API}/repos/${env.GITHUB_REPO}/actions/workflows/${WORKFLOW}/dispatches`;
  const res = await fetchFn(url, {
    method: "POST",
    headers: { ...githubHeaders(env), "Content-Type": "application/json" },
    body: JSON.stringify({ ref: env.GITHUB_REF || "main", inputs: { syy: reason } }),
  });
  if (res.status !== 204) throw new Error(`GitHub vastasi ${res.status} (käynnistys)`);
  return "kaynnistetty";
}

// --- Päivitä nyt -sivu ----------------------------------------------------------

/** Vakioaikainen vertailu: vastausaika ei paljasta, montako merkkiä avaimesta osui oikein. */
export function keyMatches(given, expected) {
  if (typeof given !== "string" || typeof expected !== "string" || expected.length < 20) return false;
  const a = new TextEncoder().encode(given);
  const b = new TextEncoder().encode(expected);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function page(title, body, status = 200) {
  const html = `<!doctype html>
<html lang="fi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>${title}</title>
<style>
body{font:17px/1.6 system-ui,sans-serif;max-width:28rem;margin:3rem auto;padding:0 1rem;color:#1f2a2e;background:#f7f4ee}
h1{font-size:1.4rem}button{font:inherit;font-weight:600;padding:.8rem 1.4rem;border:0;border-radius:999px;background:#2f5d62;color:#fff;cursor:pointer;min-height:44px}
p.pieni{font-size:.9rem;color:#5b6468}a{color:#2f5d62}
</style></head><body>${body}</body></html>`;
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store", // Avaimellinen sivu ei saa jäädä välimuistiin
      "Referrer-Policy": "no-referrer", // Avain osoitteessa ei vuoda eteenpäin
      "X-Robots-Tag": "noindex, nofollow",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function handleRefresh(request, env) {
  const url = new URL(request.url);

  if (request.method === "GET") {
    const key = url.searchParams.get("avain");
    if (!keyMatches(key, env.PAIVITYS_AVAIN)) return null; // → tavallinen 404
    // GET ei käynnistä mitään: linkkien esikatselut (WhatsApp, sähköposti) avaavat linkin itsekseen.
    return page(
      "Päivitä tunnit",
      `<h1>Päivitä tunnit sivulle</h1>
<p>Tunnit päivittyvät sivulle itsestään 15 minuutin välein. Jos haluat muutoksen näkyviin heti, paina painiketta.</p>
<form method="post" action="/paivita"><input type="hidden" name="avain" value="${escapeHtml(key)}"><button type="submit">Päivitä nyt</button></form>
<p class="pieni">Tallenna tämä sivu kirjanmerkiksi. Älä jaa osoitetta muille.</p>`,
    );
  }

  if (request.method === "POST") {
    const form = await request.formData().catch(() => null);
    const key = form?.get("avain");
    if (!keyMatches(key, env.PAIVITYS_AVAIN)) return null;
    try {
      const result = await triggerWorkflow(env, "Päivitä nyt");
      const text =
        result === "kaynnissa"
          ? "Päivitys on jo käynnissä. Muutokset näkyvät sivulla muutaman minuutin kuluttua."
          : "Päivitys käynnistyi. Muutokset näkyvät sivulla noin 3 minuutin kuluttua.";
      return page("Päivitys käynnistyi", `<h1>Kiitos!</h1><p>${text}</p><p><a href="/">Siirry sivulle</a></p>`);
    } catch (err) {
      console.error(`Päivitä nyt epäonnistui: ${err.message}`);
      return page(
        "Päivitys ei onnistunut",
        `<h1>Päivitys ei käynnistynyt</h1><p>Tunnit päivittyvät silti 15 minuutin välein. Jos ongelma jatkuu, kerro Eerolle.</p>`,
        502,
      );
    }
  }

  return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, POST" } });
}

// --- Workerin käsittelijät ---------------------------------------------------------

export default {
  // Kutsutaan vain osoitteille, joille ei löydy tiedostoa site/dist-kansiosta
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/paivita") {
      const response = await handleRefresh(request, env);
      if (response) return response;
    }
    // Kaikki muu: sivuston oma 404-sivu (not_found_handling, wrangler.jsonc)
    return env.ASSETS.fetch(request);
  },

  // Cloudflaren ajastin (wrangler.jsonc: triggers.crons)
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(
      triggerWorkflow(env, "ajastin")
        .then((result) => console.log(`ajastin: ${result}`))
        .catch((err) => console.error(`ajastin epäonnistui: ${err.message}`)),
    );
  },
};
