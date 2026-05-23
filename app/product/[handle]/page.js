import { getProduct, normalizeProduct, formatPrice } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import Link from 'next/link';

export const revalidate = 120;

export async function generateMetadata({ params }) {
  const product = await getProduct(params.handle).catch(() => null);
  if (!product) return { title: 'Product niet gevonden — SkinShopper' };
  return { title: `${product.title} — SkinShopper`, description: product.description?.slice(0, 155) };
}

export default async function ProductPage({ params }) {
  const raw = await getProduct(params.handle).catch(() => null);
  if (!raw) notFound();

  const product = normalizeProduct(raw);
  const images = raw.images?.edges?.map((e) => e.node) ?? [];
  const allImages = images.length > 0 ? images : (product.image ? [{ url: product.image, altText: product.title }] : []);
  const variants = raw.variants?.edges?.map((e) => e.node) ?? [];

  return (
    <div className="container-wide" style={{ padding: '48px 32px 100px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--ink-3)', marginBottom: 40 }}>
        <Link href="/" style={{ color: 'var(--ink-3)' }}>Home</Link>
        <span>/</span>
        <Link href={`/shop/huidverzorging`} style={{ color: 'var(--ink-3)' }}>{product.vendor}</Link>
        <span>/</span>
        <span style={{ color: 'var(--ink)' }}>{product.title.slice(0, 40)}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
        {/* Images */}
        <div>
          <div style={{ position: 'relative', aspectRatio: '4/5', background: 'var(--bg-sunken)', marginBottom: 12 }}>
            {allImages[0] && (
              <Image
                src={allImages[0].url}
                alt={allImages[0].altText ?? product.title}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: 'contain', padding: 32 }}
              />
            )}
            {product.onSale && (
              <div style={{ position: 'absolute', top: 16, left: 16 }}>
                <span className="badge badge-sale">−{product.savings}%</span>
              </div>
            )}
          </div>
          {allImages.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {allImages.slice(1, 5).map((img, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1', background: 'var(--bg-sunken)' }}>
                  <Image src={img.url} alt={img.altText ?? ''} fill style={{ objectFit: 'contain', padding: 8 }} sizes="120px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="eyebrow" style={{ marginBottom: 12, color: 'var(--ink-3)' }}>{product.vendor}</div>
          <h1 style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.1, marginBottom: 20 }}>{product.title}</h1>

          {/* Price */}
          <div className="row" style={{ gap: 12, marginBottom: 28, alignItems: 'baseline' }}>
            <div style={{ fontSize: 32, fontFamily: 'var(--font-display)', color: product.onSale ? 'var(--sale)' : 'var(--ink)' }}>
              {formatPrice(product.price, product.currencyCode)}
            </div>
            {product.onSale && (
              <>
                <div className="strike text-faint" style={{ fontSize: 18 }}>{formatPrice(product.compareAtPrice, product.currencyCode)}</div>
                <span className="badge badge-sale">−{product.savings}%</span>
              </>
            )}
          </div>

          {/* Variants */}
          {variants.length > 1 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Kies variant:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {variants.map((v) => (
                  <div key={v.id} style={{ padding: '8px 14px', border: '1px solid var(--border-strong)', fontSize: 13, background: 'var(--bg-elev)' }}>
                    {v.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart */}
          <AddToCartButton variantId={product.variantId} title={product.title} available={product.availableForSale} stock={product.stock} />

          {/* USPs */}
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--ink-3)' }}>
            {['🚚 Gratis verzending vanaf €60', '↩ 30 dagen retourrecht', '✓ 100% origineel product', '📦 Voor 22:00 besteld, morgen in huis'].map((u) => (
              <div key={u}>{u}</div>
            ))}
          </div>

          {/* Description */}
          {raw.description && (
            <div style={{ marginTop: 40, paddingTop: 40, borderTop: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: 20, marginBottom: 16 }}>Productomschrijving</h2>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-2)' }}>{raw.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
