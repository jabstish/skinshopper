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

export default function BrandsStrip() {
  return (
    <section style={{ background: 'var(--bg-sunken)', padding: '64px 0' }}>
      <div className="container-wide">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="eyebrow">Originele producten van</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
          {BRAND_COLLECTIONS.map((b) => {
            const style = BRAND_STYLES[b.handle] ?? {};
            return (
              <Link
                key={b.handle}
                href={`/brand/${b.handle}`}
                className="brand-tile"
                style={{
                  padding: '36px 16px',
                  background: 'var(--bg-elev)',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                  color: 'var(--ink)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 100,
                  transition: 'background .15s ease, color .15s ease',
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
