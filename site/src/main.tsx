// main.tsx: selaimen käynnistyskoodi.
//
// Buildin jälkeen sivun HTML on jo valmiina (scripts/prerender.mjs), joten React vain
// "herättää" sen (hydrateRoot): kytkee tapahtumankäsittelijät olemassa olevaan HTML:ään.
// Kehityksessä (npm run dev) HTML:ää ei ole, joten sivu rakennetaan tyhjästä (createRoot).
//
// Koodi on kirjoitettu Reactin rajapinnalla, mutta selaimeen menee Preact (vite.config.ts:
// preact()). "react-dom/client" ohjautuu automaattisesti Preactin yhteensopivuuskerrokseen.

import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

// Fontit omina tiedostoina (@fontsource): ei pyyntöjä Googleen, Vite pakkaa ne buildiin.
// Cormorant Garamond ei ole muuttuva fontti, joten käytetyt painot tuodaan erikseen.
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/cormorant-garamond/500-italic.css"; // pienet yläotsikot ja heron kursiivi
import "@fontsource/cormorant-garamond/600-italic.css";
import "@fontsource-variable/jost"; // muuttuva fontti: kaikki painot yhdessä tiedostossa
import "./index.css";

import App from "./App";
import { BASE_PATH } from "./lib/paths";

const root = document.getElementById("root")!;

// Näytettävä sivu. Esirenderöidyssä sivussa se luetaan root-elementin data-path-attribuutista
// (prerender.mjs), jolloin selain herättää täsmälleen saman sivun, joka HTML:ään renderöitiin.
// Esimerkiksi 404-sivu näytetään mille tahansa tuntemattomalle osoitteelle.
// Kehityksessä attribuuttia ei ole, joten sivu päätellään osoitteesta ilman alipolkua.
const path = root.dataset.path ?? (window.location.pathname.slice(BASE_PATH.length) || "/");
const app = (
  <StrictMode>
    <App path={path} />
  </StrictMode>
);

// firstElementChild: esirenderöidyssä sivussa root sisältää elementtejä,
// kehityksessä vain HTML-kommentin <!--app-html-->.
if (root.firstElementChild) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
