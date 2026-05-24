import Link from 'next/link';
import Image from 'next/image';
import { getProductsByCollection, normalizeProduct } from '@/lib/shopify';

async function getRetinolProduct() {
  try {
    const col = await getProductsByCollection('la-roche-posay', 50);
    const products = col?.products?.edges?.map((e) => normalizeProduct(e.node)) ?? [];
    // Find the Retinol B3 product
    const retinol = products.find((p) =>
      p.title.toLowerCase().includes('retinol b3') ||
      p.title.toLowerCase().includes('retinol') ||
      p.title.toLowerCase().includes('b3 serum')
    );
    // Fallback to first product if Retinol B3 not found
    return retinol ?? products[0] ?? null;
  } catch {
    return null;
  }
}

export default async function EditorialSplit() {
  const product = await getRetinolProduct();

  return (
    <section style={{ padding: '80px 0', background: 'var(--bg-sunken)' }}>
      <div className="container-wide">
        <div className="editorial-split-grid">
          {/* Left: visual */}
          <div style={{ position: 'relative', background: 'linear-gradient(150deg, #efe6d6 0%, #c9a96e 100%)', overflow: 'hidden', minHeight: 400 }}>
            <div style={{ position: 'absolute', top: 32, left: 32, zIndex: 2 }}>
              <div className="eyebrow" style={{ color: 'rgba(100,70,30,0.7)' }}>Verhaal · La Roche-Posay</div>
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
              {product?.image ? (
                <div style={{ width: '55%', maxWidth: 200, aspectRatio: '3/4', position: 'relative', filter: 'drop-shadow(0 30px 50px rgba(40,20,0,0.25))' }}>
                  <Image
                    src={product.image}
                    alt={product.imageAlt || product.title}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="200px"
                  />
                </div>
              ) : (
                <div style={{
                  width: 160, height: 220,
                  background: 'rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  margin: '0 auto',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 30px 60px rgba(40,20,0,0.2)',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#6b4a2a', letterSpacing: '0.1em', textAlign: 'center', lineHeight: 1.6 }}>
                    LA ROCHE<br />POSAY<br />
                    <span style={{ fontSize: 11, opacity: 0.7 }}>Retinol B3</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: text */}
          <div style={{ background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(32px, 5vw, 72px)' }}>
            <div className="eyebrow" style={{ marginBottom: 24, color: 'var(--accent-deep)' }}>Dermatologisch · Bewezen</div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 52px)', marginBottom: 24 }}>
              Retinol B3 — <em style={{ fontStyle: 'italic' }}>de gouden standaard</em> voor een egale teint
            </h2>
            <p style={{ color: 'var(--ink-3)', fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
              Aanbevolen door dermatologen wereldwijd. Klinisch bewezen om fijne lijntjes te verminderen
              en pigmentvlekken zichtbaar te vervagen in 8 weken.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['0,3% pure retinol + 4% niacinamide', 'Getest op gevoelige huid', 'Vrij van parabenen en parfum'].map((b) => (
                <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--accent-soft)', display: 'grid', placeItems: 'center', color: 'var(--accent-deep)', fontSize: 10, flexShrink: 0 }}>✓</span>
                  {b}
                </li>
              ))}
            </ul>

            {/* Linked product snippet */}
            {product && (
              <Link href={`/product/${product.handle}`}
                style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', background: 'var(--bg-sunken)', border: '1px solid var(--border)', textDecoration: 'none', color: 'inherit', marginBottom: 20 }}>
                {product.image && (
                  <div style={{ width: 52, height: 64, position: 'relative', flexShrink: 0, background: 'white', padding: 4 }}>
                    <Image src={product.image} alt={product.title} fill style={{ objectFit: 'contain' }} sizes="52px" />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 3 }}>La Roche-Posay</div>
                  <div style={{ fontSize: 13, lineHeight: 1.3, marginBottom: 5 }}>{product.title}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: product.onSale ? 'var(--sale)' : 'var(--ink)' }}>
                      {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: product.currencyCode || 'EUR' }).format(product.price)}
                    </span>
                    {product.onSale && (
                      <span style={{ fontSize: 12, color: 'var(--ink-muted)', textDecoration: 'line-through' }}>
                        {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: product.currencyCode || 'EUR' }).format(product.compareAtPrice)}
                      </span>
                    )}
                    {product.onSale && <span className="badge badge-sale" style={{ fontSize: 10 }}>−{product.savings}%</span>}
                  </div>
                </div>
                <span style={{ color: 'var(--ink-3)', fontSize: 18 }}>→</span>
              </Link>
            )}

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/shop/huidverzorging" className="btn btn-lg">Bekijk huidverzorging</Link>
              <Link href="/brand/la-roche-posay" className="btn btn-lg btn-outline">Shop La Roche-Posay</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
