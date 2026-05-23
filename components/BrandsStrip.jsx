'use client';
import Link from 'next/link';
import { BRAND_COLLECTIONS } from '@/lib/shopify';

export default function BrandsStrip() {
  return (
    <section className="section-sm" style={{ background: 'var(--bg-sunken)' }}>
      <div className="container-wide">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="eyebrow">Originele producten van</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
          {BRAND_COLLECTIONS.map((b) => (
            <Link key={b.handle} href={`/brand/${b.handle}`}
              style={{ padding: '28px 12px', background: 'var(--bg-elev)', border: '1px solid var(--border)', textAlign: 'center', fontWeight: 700, fontSize: 13, letterSpacing: '0.06em', color: 'var(--ink)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80, transition: 'all .15s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-elev)'; e.currentTarget.style.color = 'var(--ink)'; }}>
              {b.wordmark}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
