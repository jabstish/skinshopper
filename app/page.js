import Link from 'next/link';
import { getProductsByCollection, normalizeProduct } from '@/lib/shopify';
import ProductCard from '@/components/ProductCard';
import NewsletterSection from '@/components/NewsletterSection';
import CategoryTiles from '@/components/CategoryTiles';
import BrandsStrip from '@/components/BrandsStrip';
import SkinConcernFinder from '@/components/SkinConcernFinder';
import EditorialSplit from '@/components/EditorialSplit';

export const revalidate = 120;

const REVIEWS = [
  { name: 'Lisa V.', rating: 5, text: 'Snelle levering en het product is 100% origineel. Echt veel goedkoper dan bij Douglas. Ik bestel hier blijvend.', product: 'La Roche-Posay Retinol B3', days: '2 dagen geleden' },
  { name: 'Mohammed K.', rating: 5, text: 'Ik was eerst sceptisch over de prijzen maar de doos kwam keurig verpakt aan. Hugo Boss Bottled — zelfde geur als bij de boetiek.', product: 'Boss Bottled Eau de Parfum', days: '5 dagen geleden' },
  { name: 'Anouk de B.', rating: 4, text: 'Goede deal op Vichy Mineral 89. Mijn moeder gebruikt hetzelfde dus we bestellen samen — gratis verzending was meegenomen.', product: 'Vichy Minéral 89', days: '1 week geleden' },
];

export default async function HomePage() {
  const col = await getProductsByCollection('frontpage', 8).catch(() => null);
  const products = (col?.products?.edges?.map((e) => normalizeProduct(e.node)) ?? []).slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', background: 'var(--bg-sunken)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', minHeight: 'min(720px, 78vh)' }}>
          <div className="hero-text">
            <div className="eyebrow" style={{ marginBottom: 24 }}>Lente collectie · 2026</div>
            <h1 className="hero-h1" style={{ lineHeight: 0.95, marginBottom: 28, letterSpacing: '-0.02em' }}>
              Skincare met<br />
              <em style={{ fontStyle: 'italic', color: 'var(--accent-deep)' }}>kennis</em>,<br />
              geuren met<br />
              <em style={{ fontStyle: 'italic', color: 'var(--accent-deep)' }}>karakter</em>.
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--ink-3)', maxWidth: 440, marginBottom: 40 }}>
              Authentieke producten van de merken die je vertrouwt — La Roche-Posay, Vichy, SkinCeuticals, Hugo Boss. Tot 35% korting deze week.
            </p>
            <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
              <Link href="/shop/huidverzorging" className="btn btn-lg">Shop huidverzorging</Link>
              <Link href="/shop/parfum" className="btn btn-lg btn-outline">Shop parfum</Link>
            </div>
            <div className="row" style={{ gap: 24, marginTop: 56, color: 'var(--ink-3)', fontSize: 12, flexWrap: 'wrap' }}>
              <div className="row-tight" style={{ gap: 8 }}>
                <div className="stars">★★★★★</div>
                <span><strong style={{ color: 'var(--ink)' }}>4.8</strong> · 1.247 reviews</span>
              </div>
              <div>Trustpilot · ★ 4.7</div>
            </div>
          </div>

          <div style={{ position: 'relative', background: 'linear-gradient(140deg, #efe4d2 0%, #d4b896 50%, #8b6f47 100%)', minHeight: 400 }}>
            <div style={{ position: 'absolute', top: 32, right: 32, color: 'rgba(255,255,255,0.85)' }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Editorial · 01</div>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' }}>SS · 26</div>
            </div>
            <Link href="/shop/sale" style={{ position: 'absolute', bottom: 32, right: 32, padding: '12px 20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sale)' }}>Sale · Bekijk alle aanbiedingen →</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="section">
        <div className="container-wide">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Shop per categorie</div>
              <h2>Ontdek alles wat we doen</h2>
            </div>
            <Link href="/shop/huidverzorging" style={{ fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 4 }}>Alle categorieën →</Link>
          </div>
          <CategoryTiles />
        </div>
      </section>

      {/* Skin concern finder */}
      <SkinConcernFinder />

      {/* Bestsellers */}
      {products.length > 0 && (
        <section className="section">
          <div className="container-wide">
            <div className="section-head" style={{ marginBottom: 32 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 12 }}>Wat anderen kopen</div>
                <h2>Bestsellers deze week</h2>
              </div>
              <Link href="/shop/huidverzorging" style={{ fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 4 }}>Bekijk alles →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Editorial split — La Roche-Posay feature */}
      <EditorialSplit />

      <BrandsStrip />

      {/* Reviews */}
      <section className="section">
        <div className="container-wide">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Vertrouwd door 12.000+ klanten</div>
              <h2>Wat onze klanten zeggen</h2>
            </div>
            <div className="row" style={{ gap: 16 }}>
              <div className="stars" style={{ fontSize: 16 }}>★★★★★</div>
              <span style={{ fontSize: 14 }}><strong>4.8</strong> · 1.247 reviews</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ padding: 28, background: 'var(--bg-elev)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <div className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{r.days}</div>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, color: 'var(--ink-2)' }}>"{r.text}"</p>
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.name} <span style={{ color: 'var(--success)', fontSize: 11 }}>✓ Geverifieerd</span></div>
                  <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>Over: {r.product}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
