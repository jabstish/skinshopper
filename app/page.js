import Link from 'next/link';
import { getProductsByCollection, normalizeProduct } from '@/lib/shopify';
import ProductCard from '@/components/ProductCard';
import NewsletterSection from '@/components/NewsletterSection';
import CategoryTiles from '@/components/CategoryTiles';
import BrandsStrip from '@/components/BrandsStrip';
import SkinConcernFinder from '@/components/SkinConcernFinder';
import EditorialSplit from '@/components/EditorialSplit';

export const metadata = {
  title: 'SKINSHOPPER — Parfum & Huidverzorging | Origineel, Goedkoper',
  description: 'Koop authentieke parfum en huidverzorging van La Roche-Posay, Vichy, Hugo Boss en meer. Tot 35% goedkoper dan de adviesprijs. Gratis verzending vanaf €60. Voor 22:00 besteld, morgen in huis.',
  openGraph: {
    title: 'SKINSHOPPER — Parfum & Huidverzorging',
    description: 'Authentieke parfum en huidverzorging van de merken die je kent. Tot 35% korting, gratis verzending vanaf €60.',
    type: 'website',
  },
};

export const revalidate = 120;

const REVIEWS = [
  { name: 'Lisa V.', rating: 5, text: 'Snelle levering en het product is 100% origineel. Echt veel goedkoper dan bij Douglas. Ik bestel hier blijvend.', product: 'La Roche-Posay Retinol B3', days: '2 dagen geleden' },
  { name: 'Mohammed K.', rating: 5, text: 'Ik was eerst sceptisch over de prijzen maar de doos kwam keurig verpakt aan. Hugo Boss Bottled — zelfde geur als bij de boetiek.', product: 'Boss Bottled Eau de Parfum', days: '5 dagen geleden' },
  { name: 'Anouk de B.', rating: 4, text: 'Goede deal op Vichy Mineral 89. Mijn moeder gebruikt hetzelfde dus we bestellen samen — gratis verzending was meegenomen.', product: 'Vichy Minéral 89', days: '1 week geleden' },
];

async function getCategoryImage(handle) {
  const col = await getProductsByCollection(handle, 1).catch(() => null);
  return col?.products?.edges?.[0]?.node?.featuredImage?.url ?? null;
}

export default async function HomePage() {
  const [frontpage, parfumCol, huidCol, sunCol, saleCol, parfumImg, skincareImg, sunImg, saleImg] = await Promise.all([
    getProductsByCollection('frontpage', 4).catch(() => null),
    getProductsByCollection('parfum', 1).catch(() => null),
    getProductsByCollection('huidverzorging', 1).catch(() => null),
    getProductsByCollection('zonnebrand-creme', 1).catch(() => null),
    getProductsByCollection('sale', 1).catch(() => null),
    getCategoryImage('parfum'),
    getCategoryImage('la-roche-posay'),
    getCategoryImage('zonnebrand-creme'),
    getCategoryImage('skinceuticals'),
  ]);

  // 1 product per categorie + aanvullen vanuit frontpage
  const perCategory = [parfumCol, huidCol, sunCol, saleCol]
    .map((col) => col?.products?.edges?.[0]?.node)
    .filter(Boolean)
    .map(normalizeProduct);
  const frontpageProducts = (frontpage?.products?.edges?.map((e) => normalizeProduct(e.node)) ?? []);
  // Merge: per-category first, fill remainder from frontpage (no duplicates)
  const seen = new Set(perCategory.map((p) => p.id));
  const products = [
    ...perCategory,
    ...frontpageProducts.filter((p) => !seen.has(p.id)),
  ].slice(0, 4);

  const categoryImages = {
    parfum: parfumImg,
    'la-roche-posay': skincareImg,
    'zonnebrand-creme': sunImg,
    sale: saleImg,
  };

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', background: 'var(--bg-sunken)', overflow: 'hidden' }}>
        <div className="hero-split" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', minHeight: 'min(720px, 78vh)' }}>
          <div className="hero-text">
            <div className="eyebrow" style={{ marginBottom: 24 }}>Lente collectie · 2026</div>
            <h1 className="hero-h1" style={{ lineHeight: 0.95, marginBottom: 28, letterSpacing: '-0.02em' }}>
              Skincare met<br />
              <em style={{ fontStyle: 'italic', color: 'var(--accent-deep)' }}>kennis</em>,<br />
              geuren met<br />
              <em style={{ fontStyle: 'italic', color: 'var(--accent-deep)' }}>karakter</em>.
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--ink-3)', maxWidth: 440, marginBottom: 28 }}>
              Authentieke producten van de merken die je vertrouwt — La Roche-Posay, Vichy, SkinCeuticals, Hugo Boss.
            </p>

            {/* Sale badge */}
            <Link href="/shop/sale" className="hero-sale-badge" style={{ textDecoration: 'none', marginBottom: 28 }}>
              <span style={{ fontSize: 18 }}>🔥</span>
              <span>Tot 35% korting deze week</span>
              <span style={{ opacity: 0.75, fontWeight: 400 }}>→ Bekijk sale</span>
            </Link>

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

          <div className="hero-panel-right" style={{ position: 'relative', overflow: 'hidden', minHeight: 400 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.pexels.com/photos/19170038/pexels-photo-19170038.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
              alt="Gucci Bloom parfum"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
            <Link href="/shop/sale" style={{ position: 'absolute', bottom: 32, right: 32, padding: '12px 20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sale)' }}>Sale · Bekijk alle aanbiedingen →</div>
            </Link>
          </div>
        </div>
      </section>

      <BrandsStrip />

      {/* Bestsellers — 3e sectie, 1 product per categorie */}
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
            <div className="products-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

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
          <CategoryTiles images={categoryImages} />
        </div>
      </section>

      {/* Skin concern finder */}
      <SkinConcernFinder />

      {/* Editorial split */}
      <EditorialSplit />

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
          <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
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
