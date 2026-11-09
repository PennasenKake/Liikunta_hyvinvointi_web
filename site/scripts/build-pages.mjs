// build-pages.mjs: GitHub Pages -testiversion build (npm run build:pages).
//
// Sama build kuin tavallisesti, mutta:
// - VITE_BASE: sivusto on alipolussa pennasenkake.github.io/Liikunta_hyvinvointi_web/
// - VITE_SITE_URL: canonical-osoitteet ja jakokuva osoittavat testiosoitteeseen
// - VITE_NOINDEX=1: testiversio ei kilpaile tuotantosivun kanssa hakukoneissa
// - .nojekyll: ilman sitä GitHub Pages piilottaisi alaviivalla alkavat tiedostot

import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const env = {
  ...process.env,
  VITE_BASE: "/Liikunta_hyvinvointi_web/",
  VITE_SITE_URL: "https://pennasenkake.github.io/Liikunta_hyvinvointi_web",
  VITE_NOINDEX: "1",
};

// shell: true, jotta "npm" löytyy myös Windowsissa (npm.cmd)
const result = spawnSync("npm", ["run", "build"], { stdio: "inherit", env, shell: true });
if (result.status !== 0) process.exit(result.status ?? 1);

writeFileSync("dist/.nojekyll", "");
console.log("GitHub Pages -build valmis: dist/");
