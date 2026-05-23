import { getProductsByCollection, normalizeProduct, BRAND_COLLECTIONS } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export const revalidate = 120;

export async function generateMetadata({ params }) {
  const brand = BRAND_COLLECTIONS.find((b) => b.handle === params.handle);
  return { title: `${brand?.name ?? 'Merk'} — SkinShopper` };
}

export default async function BrandPage({ params }) {
  const brand = BRAND_COLLECTIONS.find((b) => b.handle === params.handle);
  if (!brand) notFound();

  const col = await getProductsByCollection(params.handle, 100).catch(() => null);
  const products = (col?.products?.edges?.map((e) => normalizeProduct(e.node)) ?? []);

  return (
    <div>
      {/* Brand hero */}
      <section style={{ background: 'var(--bg-sunken)', padding: '64px 0' }}>
        <div className="container-wide">
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 24, display: 'flex', gap: 8 }}>
            <Link href="/" style={{ color: 'var(--ink-3)' }}>Home</Link>
            <span>/</span>
            <span>Merken</span>
            <span>/</span>
            <span>{brand.name}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 0.95, marginBottom: 16, fontFamily: 'var(--font-body)', fontWeight: 900, letterSpacing: '0.02em' }}>
            {brand.wordmark}
          </h1>
          <p style={{ color: 'var(--ink-3)', fontSize: 16 }}>
            {products.length} producten · Allemaal 100% origineel
          </p>
        </div>
      </section>

      <div className="container-wide" style={{ padding: '48px 32px 100px' }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: 'var(--ink-3)' }}>Geen producten gevonden voor dit merk.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, rowGap: 48 }}>
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
