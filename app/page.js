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
      {/* Hero — 3-grid editorial */}
      <section className="hero-section" style={{ background: 'var(--bg)', padding: '36px 0 8px' }}>
        <div className="container-wide">
          <div className="hero-head">
            <div>
              <div className="row-tight" style={{ gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                <span className="badge badge-sale" style={{ fontSize: 11, padding: '5px 10px', letterSpacing: '0.08em' }}>De grote lente sale</span>
                <span className="eyebrow" style={{ color: 'var(--sale)' }}>Tot −35% · op = op</span>
              </div>
              <h1 className="hero-h1" style={{ lineHeight: 0.98, letterSpacing: '-0.02em' }}>
                Alles in de <em style={{ fontStyle: 'italic', color: 'var(--sale)' }}>uitverkoop</em>
              </h1>
            </div>
            <p className="hero-head-p">
              Originele parfums en huidverzorging van topmerken — nu tot <strong>35% goedkoper</strong> dan de adviesprijs. La Roche-Posay, Hugo Boss, Vichy, SkinCeuticals en meer. <strong>Gratis verzending vanaf €60</strong>, vandaag besteld = morgen in huis.
            </p>
          </div>

          <div className="hero-deal-grid">
            <div className="hero-deal-left">
              <Link href="/shop/parfum" className="hero-tile"
                style={{ '--hero-img': 'url("https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?fm=jpg&q=80&w=1400&auto=format&fit=crop")', '--hero-overlay': 'linear-gradient(180deg, rgba(20,8,4,0) 30%, rgba(20,8,4,0.78) 100%)', '--hero-focus': 'center 35%' }}>
                <div className="hero-tile-media" />
                <div className="hero-tile-deal">−35%</div>
                <div className="hero-tile-body">
                  <div className="hero-tile-kicker">Parfum · designer geuren</div>
                  <div className="hero-tile-title">Parfums</div>
                  <div className="hero-tile-sub">Hugo Boss, Calvin Klein &amp; meer — tot 35% onder adviesprijs</div>
                  <span className="hero-tile-cta">Shop parfum
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </div>
              </Link>
            </div>
            <div className="hero-deal-tr">
              <Link href="/shop/huidverzorging" className="hero-tile"
                style={{ '--hero-img': 'url("https://images.unsplash.com/photo-1531895861208-8504b98fe814?fm=jpg&q=80&w=1400&auto=format&fit=crop")', '--hero-overlay': 'linear-gradient(110deg, rgba(20,8,20,0.55) 0%, rgba(20,8,20,0.05) 55%)', '--hero-focus': 'center 40%' }}>
                <div className="hero-tile-media" />
                <div className="hero-tile-deal">−30%</div>
                <div className="hero-tile-body">
                  <div className="hero-tile-kicker">Huidverzorging · dermatologisch</div>
                  <div className="hero-tile-title">Huid</div>
                  <span className="hero-tile-cta">Shop nu
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </div>
              </Link>
            </div>
            <div className="hero-deal-br">
              <Link href="/shop/zonnebrand-creme" className="hero-tile"
                style={{ '--hero-img': 'url("https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?fm=jpg&q=80&w=1400&auto=format&fit=crop")', '--hero-overlay': 'linear-gradient(110deg, rgba(60,24,4,0.6) 0%, rgba(60,24,4,0.05) 55%)', '--hero-focus': 'center 40%' }}>
                <div className="hero-tile-media" />
                <div className="hero-tile-deal">−25%</div>
                <div className="hero-tile-body">
                  <div className="hero-tile-kicker">Zonbescherming · klaar voor de zomer</div>
                  <div className="hero-tile-title">Zon &amp; zomer</div>
                  <span className="hero-tile-cta">Shop nu
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </div>
              </Link>
            </div>
          </div>

          <div className="hero-trust">
            <div className="row-tight" style={{ gap: 8 }}>
              <div className="stars">★★★★★</div>
              <span><strong style={{ color: 'var(--ink)' }}>4.8</strong> · 1.247 reviews</span>
            </div>
            <span className="hero-trust-dot">·</span>
            <span>★ Trustpilot 4.7</span>
            <span className="hero-trust-dot">·</span>
            <span>✓ 100% origineel</span>
            <span className="hero-trust-dot">·</span>
            <span>🚚 Gratis verzending vanaf €60</span>
            <span className="hero-trust-dot">·</span>
            <span>↩ 30 dagen retour</span>
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
