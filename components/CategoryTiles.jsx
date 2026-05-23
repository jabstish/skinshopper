import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  { label: 'Parfum', href: '/shop/parfum', collection: 'parfum', sub: '20 producten', overlay: 'rgba(40,15,30,0.45)' },
  { label: 'Huidverzorging', href: '/shop/huidverzorging', collection: 'la-roche-posay', sub: '47 producten', overlay: 'rgba(15,40,60,0.4)' },
  { label: 'Zonbescherming', href: '/shop/zonbescherming', collection: 'zonnebrand-creme', sub: '5 producten', overlay: 'rgba(80,40,15,0.45)' },
  { label: 'Sale', href: '/shop/sale', collection: 'sale', sub: 'Tot −35%', overlay: 'rgba(60,15,30,0.55)', sale: true },
];

export default function CategoryTiles({ images = {} }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {CATEGORIES.map((cat) => {
        const img = images[cat.collection];
        return (
          <Link
            key={cat.href}
            href={cat.href}
            className="category-tile"
            style={{
              position: 'relative',
              aspectRatio: '4/5',
              overflow: 'hidden',
              display: 'block',
              textDecoration: 'none',
              background: 'var(--bg-sunken)',
            }}
          >
            {img && (
              <Image
                src={img}
                alt={cat.label}
                fill
                sizes="(max-width: 900px) 50vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
            )}
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(180deg, transparent 30%, ${cat.overlay} 100%)`,
            }} />
            <div style={{ position: 'absolute', inset: 'auto 0 0 0', padding: 20, color: 'white' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.1, marginBottom: 6 }}>
                {cat.label}
              </div>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.95 }}>
                {cat.sub}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
