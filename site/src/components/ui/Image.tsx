// Image.tsx: kevyt <img>-kääre, jolla on samat propsit kuin Next.js:n next/image-komponentilla.
// Näin vanhat komponentit siirtyivät Viteen lähes sellaisinaan.
//
// - fill: kuva täyttää kääreen (kääreellä oltava position: relative ja koko).
// - width/height: selain varaa tilan valmiiksi, jolloin sivu ei hypi kuvan latautuessa (CLS).
// - priority: ensinäkymän kuva ladataan heti ja korkealla prioriteetilla (LCP).
//   Muut kuvat ladataan laiskasti vasta, kun ne ovat tulossa ruudulle.
// - unoptimized: hyväksytään yhteensopivuuden vuoksi, mutta ei tee mitään
//   (Vite tarjoilee kuvat sellaisinaan).

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  unoptimized?: boolean;
  className?: string;
};

export default function Image({ src, alt, width, height, fill, sizes, priority, className = "" }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={fill ? `absolute inset-0 h-full w-full ${className}` : className}
    />
  );
}
