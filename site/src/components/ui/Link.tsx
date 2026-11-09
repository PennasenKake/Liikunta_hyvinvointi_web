// Link.tsx: sivuston sisäinen linkki. Tavallinen <a>, johon lisätään alipolku (withBase),
// jotta linkit toimivat myös GitHub Pagesin osoitteessa /Liikunta_hyvinvointi_web/.
// Sivut ovat erillisiä esirenderöityjä HTML-tiedostoja, joten erillistä reitityskirjastoa ei tarvita.

import type { AnchorHTMLAttributes } from "react";
import { withBase } from "@/lib/paths";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function Link({ href, ...rest }: Props) {
  return <a href={withBase(href)} {...rest} />;
}
