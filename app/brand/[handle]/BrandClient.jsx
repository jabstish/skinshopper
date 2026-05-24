'use client';
import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function BrandClient({ products, brandHandle, brandName, category }) {
  const categoryHandle = category === 'parfum' ? 'parfum' : 'huidverzorging';

  return (
    <>
      {/* Product grid section */}
      <section style={{ padding: '32px 0 80px' }}>
        <div className="container-wide">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
              <strong style={{ color: 'var(--ink)' }}>{products.length}</strong> producten
            </div>
            <Link href={`/shop/${categoryHandle}`} style={{ fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 4 }}>
              Bekijk alle {category === 'parfum' ? 'parfums' : 'huidverzorging'} →
            </Link>
          </div>
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 8 }}>Geen producten gevonden</div>
              <p style={{ color: 'var(--ink-3)', fontSize: 14 }}>Producten worden binnenkort toegevoegd.</p>
            </div>
          ) : (
            <div className="brand-products-grid">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
