// Image.tsx: kevyt <img>-kääre, joka hoitaa kuvien latausjärjestyksen ja tilanvarauksen.
//
// - fill: kuva täyttää kääreen (kääreellä oltava position: relative ja koko).
// - width/height: selain varaa tilan valmiiksi, jolloin sivu ei hypi kuvan latautuessa (CLS).
// - srcSet + sizes: selain lataa näytön leveyteen sopivan WebP-version (lib/photos.ts).
// - priority: ensinäkymän kuva ladataan heti ja korkealla prioriteetilla (LCP).
//   Muut kuvat ladataan laiskasti vasta, kun ne ovat tulossa ruudulle.

type Props = {
  src: string;
  srcSet?: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export default function Image({ src, srcSet, alt, width, height, fill, sizes, priority, className = "" }: Props) {
  return (
    <img
      src={src}
      srcSet={srcSet}
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
