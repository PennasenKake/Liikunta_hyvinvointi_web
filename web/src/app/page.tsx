// Väliaikainen testisivu teeman tarkistamiseen.
// Korvataan oikeilla osioilla seuraavissa vaiheissa.
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      {/* font-serif = Cormorant Garamond, italic = kursiivi */}
      <p className="font-serif text-2xl italic text-accent">Liikunta · Hyvinvointi</p>

      <h1 className="font-serif text-6xl font-semibold">
        Liikuntaa ja rentoutusta Tahkon maisemissa
      </h1>

      {/* font-sans (Jost) tulee bodysta automaattisesti */}
      <p className="text-lg text-muted">
        Leipäteksti Jost-fontilla ja toissijaisella värillä.
      </p>

      {/* Värinäytteet: jokainen ruutu käyttää teeman väriä */}
      <div className="flex flex-wrap gap-3">
        <div className="size-16 rounded bg-accent" />
        <div className="size-16 rounded bg-lilac" />
        <div className="size-16 rounded bg-lilac-soft" />
        <div className="size-16 rounded bg-sky" />
        <div className="size-16 rounded bg-sky-soft" />
        <div className="size-16 rounded border border-border bg-surface" />
      </div>

      <a href="#" className="inline-block rounded-md bg-accent px-7 py-4 font-semibold text-white">
        Katso tulevat tunnit
      </a>
    </main>
  );
}