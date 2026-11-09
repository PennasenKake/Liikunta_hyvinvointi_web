// paths.ts: sivuston sisäiset polut, jotka toimivat myös alipolussa.
//
// GitHub Pages julkaisee projektin osoitteeseen pennasenkake.github.io/Liikunta_hyvinvointi_web/,
// eli sivusto ei ole verkkotunnuksen juuressa. Vite lisää alipolun (base) itse
// skripteihin ja tyyleihin, mutta EI JSX:n <a>-linkkeihin eikä kuvien src-polkuihin.
// withBase() lisää sen niihin.
//
// import.meta.env.BASE_URL tulee vite.config.ts:n base-asetuksesta: tavallisesti "/",
// GitHub Pages -buildissa "/Liikunta_hyvinvointi_web/". Lopun kauttaviiva poistetaan.

export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

// "/logo.svg" → "/Liikunta_hyvinvointi_web/logo.svg". Ulkoiset osoitteet ja ankkurit (#top) ennallaan.
export function withBase(path: string): string {
  if (!BASE_PATH || !path.startsWith("/") || path.startsWith("//")) return path;
  return `${BASE_PATH}${path}`;
}
