// paths.ts: sivuston sisäiset polut, jotka toimivat myös alipolussa.
//
// GitHub Pages julkaisee projektin osoitteeseen pennasenkake.github.io/Liikunta_hyvinvointi_web/,
// eli sivusto ei ole verkkotunnuksen juuressa. Next.js lisää alipolun (basePath) itse
// <Link>-komponentin linkkeihin, mutta EI tavallisiin <a>-tageihin eikä kuvien src-polkuihin.
// withBase() lisää sen niihin.
//
// Tavallisessa buildissa (kehitys, testit, Netlify) NEXT_PUBLIC_BASE_PATH on tyhjä,
// jolloin withBase() palauttaa polun sellaisenaan.

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// "/logo.svg" → "/Liikunta_hyvinvointi_web/logo.svg". Ulkoiset osoitteet ja ankkurit (#top) ennallaan.
export function withBase(path: string): string {
  if (!BASE_PATH || !path.startsWith("/") || path.startsWith("//")) return path;
  return `${BASE_PATH}${path}`;
}
