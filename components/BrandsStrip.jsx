import Link from 'next/link';
import { BRAND_COLLECTIONS } from '@/lib/shopify';

const BRAND_STYLES = {
  'hugo-boss': {
    fontFamily: 'Arial Black, Helvetica, sans-serif',
    fontWeight: 900, letterSpacing: '0.02em',
    fontSize: 18, transform: 'scaleY(0.78)',
  },
  'calvin-klein': {
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    fontWeight: 300, letterSpacing: '0.42em',
    fontSize: 13, textTransform: 'uppercase',
  },
  'la-roche-posay': {
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontWeight: 800, letterSpacing: '0.04em',
    fontSize: 11, textTransform: 'uppercase',
  },
  'vichy': {
    fontFamily: 'Arial Black, Helvetica, sans-serif',
    fontWeight: 900, letterSpacing: '0.28em',
    fontSize: 20, textTransform: 'uppercase',
  },
  'skinceuticals': {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic', fontSize: 22, fontWeight: 500,
    letterSpacing: '-0.01em',
  },
  'lancaster': {
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontWeight: 700, letterSpacing: '0.18em',
    fontSize: 15, textTransform: 'uppercase',
  },
  'gucci': {
    fontFamily: 'var(--font-display)',
    fontWeight: 600, letterSpacing: '0.04em',
    fontSize: 24, textTransform: 'uppercase',
  },
};

// Duplicate for seamless loop
const BRANDS_LOOP = [...BRAND_COLLECTIONS, ...BRAND_COLLECTIONS];

export default function BrandsStrip() {
  return (
    <section style={{ background: 'var(--bg-sunken)', padding: '48px 0', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div className="eyebrow">Originele producten van</div>
      </div>

      {/* Marquee wrapper */}
      <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="brands-marquee-track">
          {BRANDS_LOOP.map((b, i) => {
            const style = BRAND_STYLES[b.handle] ?? {};
            return (
              <Link
                key={`${b.handle}-${i}`}
                href={`/brand/${b.handle}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '28px 40px',
                  flexShrink: 0,
                  borderRight: '1px solid var(--border)',
                  color: 'var(--ink)',
                  textDecoration: 'none',
                  transition: 'color .15s ease',
                }}
              >
                <span style={{ ...style, display: 'inline-block', whiteSpace: 'nowrap' }}>
                  {b.wordmark}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
