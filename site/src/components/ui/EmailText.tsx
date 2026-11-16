// EmailText.tsx: sähköpostiosoite tekstinä niin, että kapealla näytöllä rivi katkeaa
// @-merkin kohdalta eikä keskeltä sanaa (<wbr> = sallittu katkaisukohta, ei näy tekstissä).
export default function EmailText({ email }: { email: string }) {
  const [user, domain] = email.split("@");
  return (
    <>
      {user}
      <wbr />@{domain}
    </>
  );
}
