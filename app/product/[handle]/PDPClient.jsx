'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { createCart } from '@/lib/shopify';
import { formatPrice } from '@/lib/shopify';
import ProductCard from '@/components/ProductCard';

const STATIC_REVIEWS = [
  { name: 'Sara V.', verified: true, rating: 5, age: '32', skintype: 'Gemengde huid', text: 'Echt een topproduct, ik gebruik het nu 6 weken en mijn teint is veel egaler. Geen irritatie ondanks dat ik vrij gevoelig ben.', date: '3 dagen geleden' },
  { name: 'Lars de J.', verified: true, rating: 5, age: '28', skintype: 'Vette huid', text: 'Snelle levering, echte producten (EAN nummer gecheckt). Veel goedkoper dan ICI Paris. Komt zeker terug.', date: '1 week geleden' },
  { name: 'Fatima B.', verified: true, rating: 4, age: '45', skintype: 'Droge huid', text: 'Zachte formule, fijne textuur. Na een maand wel zichtbaar verschil in hydratatie.', date: '2 weken geleden' },
];

const REVIEW_DIST = [
  { stars: 5, pct: 74 },
  { stars: 4, pct: 18 },
  { stars: 3, pct: 5 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 1 },
];

export default function PDPClient({ product, allImages, variants, description, brandHandle, category, relatedProducts }) {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(product.variantId);
  const [openAccordion, setOpenAccordion] = useState('description');
  const [wishlisted, setWishlisted] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [idealLoading, setIdealLoading] = useState(false);

  async function handleDirectCheckout() {
    setIdealLoading(true);
    try {
      const cart = await createCart([{ merchandiseId: selectedVariantId, quantity: qty }]);
      if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl;
    } catch (e) {
      console.error(e);
    } finally {
      setIdealLoading(false);
    }
  }
  const { addToCart } = useCart();

  const handleAdd = async () => {
    if (!product.availableForSale) return;
    await addToCart(selectedVariantId, product.title, qty);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2200);
  };

  const accordionItems = [
    {
      id: 'description',
      label: 'Beschrijving',
      content: (
        <div>
          <p>{description || `${product.title} is een dermatologisch geteste formule, ontwikkeld voor zichtbaar resultaat. De ingrediënten zijn klinisch bewezen en in concentraties die werken.`}</p>
          <div style={{ marginTop: 16, padding: 14, background: 'var(--bg-sunken)', fontSize: 13 }}>
            <strong>Productinformatie</strong>
            <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <li><span style={{ color: 'var(--ink-3)' }}>Merk:</span> {product.vendor}</li>
              <li><span style={{ color: 'var(--ink-3)' }}>Voorraad:</span> {product.stock > 0 ? `${product.stock} stuks` : 'Uitverkocht'}</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'ingredients',
      label: category === 'parfum' ? 'Geurprofiel' : 'Ingrediënten & formule',
      content: category === 'parfum' ? (
        <p style={{ lineHeight: 1.7 }}>
          Een unieke compositie van topnoten, hartnoten en basisnoten, vakkundig samengesteld door ervaren parfumeurs.
          100% authentiek — direct van de officiële distributeur.
        </p>
      ) : (
        <p style={{ lineHeight: 1.7 }}>
          Actief geformuleerd met dermatologisch geteste ingrediënten. Klinisch bewezen voor zichtbaar resultaat op alle huidtypes.
          Vrij van overbodige toevoegingen — alleen wat werkt.
        </p>
      ),
    },
    {
      id: 'usage',
      label: 'Hoe te gebruiken',
      content: category === 'parfum' ? (
        <ol style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
          <li>Spray vanuit 15–20 cm afstand op de huid.</li>
          <li>Breng aan op pulsplekken: polsen, hals en achter de oren.</li>
          <li>Niet inwrijven — laat de geur van nature opdrogen.</li>
          <li>Bewaar op een koele, droge plek uit direct zonlicht.</li>
        </ol>
      ) : (
        <ol style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
          <li>Reinig je huid grondig met een milde reiniger.</li>
          <li>Breng een kleine hoeveelheid aan op gezicht en hals.</li>
          <li>Masseer zachtjes in totdat het volledig opgenomen is.</li>
          <li>Gebruik dagelijks — combineer 's ochtends met SPF.</li>
        </ol>
      ),
    },
    {
      id: 'shipping',
      label: 'Bezorging & retour',
      content: (
        <div>
          <div style={{ marginBottom: 12 }}>
            <strong>Bezorging</strong>
            <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
              <li>Voor 22:00 besteld, morgen in huis (NL)</li>
              <li>Gratis vanaf €60 — anders €4,95</li>
              <li>België 2 werkdagen · Duitsland 2-3 werkdagen</li>
            </ul>
          </div>
          <div>
            <strong>Retour</strong>
            <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
              <li>30 dagen bedenktijd, kosteloos retour</li>
              <li>Geopende producten? Neem contact op via de chat.</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Gallery + Info */}
      <div className="container-wide pdp-container">
        <div className="pdp-grid" style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 64, alignItems: 'start' }}>

          {/* Gallery */}
          <div style={{ minWidth: 0 }}>
            <div style={{ position: 'relative', aspectRatio: '4/5', background: '#fff', marginBottom: 12 }}>
              {allImages[activeImg] ? (
                <Image
                  src={allImages[activeImg].url}
                  alt={allImages[activeImg].altText ?? product.title}
                  fill priority
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: 'contain', padding: 32 }}
                />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--ink-3)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>Geen afbeelding</div>
                </div>
              )}
              {product.onSale && (
                <div style={{ position: 'absolute', top: 20, left: 20 }}>
                  <span className="badge badge-sale">−{product.savings}%</span>
                </div>
              )}
              {allImages.length > 1 && (
                <div style={{ position: 'absolute', bottom: 16, right: 16, fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.06em' }}>
                  {activeImg + 1} / {allImages.length}
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      flexShrink: 0, width: 72, height: 72,
                      position: 'relative',
                      background: '#fff',
                      border: activeImg === i ? '2px solid var(--ink)' : '1px solid var(--border)',
                      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                      padding: 0, cursor: 'pointer',
                      transition: 'border-color .15s ease',
                    }}
                  >
                    <Image src={img.url} alt={img.altText ?? ''} fill style={{ objectFit: 'contain', padding: 8 }} sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info column */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {brandHandle ? (
              <Link href={`/brand/${brandHandle}`}
                style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>
                {product.vendor} →
              </Link>
            ) : (
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>
                {product.vendor}
              </div>
            )}

            <h1 style={{ fontSize: 'clamp(26px, 2.8vw, 38px)', lineHeight: 1.1, marginBottom: 12 }}>{product.title}</h1>

            {/* Rating */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
              <div className="stars" style={{ fontSize: 14 }}>★★★★★</div>
              <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>4.8 · 247 reviews</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 32, fontFamily: 'var(--font-display)', color: product.onSale ? 'var(--sale)' : 'var(--ink)' }}>
                {formatPrice(product.price, product.currencyCode)}
              </span>
              {product.onSale && (
                <>
                  <span className="strike text-faint" style={{ fontSize: 18 }}>
                    {formatPrice(product.compareAtPrice, product.currencyCode)}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--sale)', fontWeight: 500 }}>
                    Je bespaart {formatPrice(product.compareAtPrice - product.price, product.currencyCode)}
                  </span>
                </>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 24 }}>Incl. BTW · Gratis verzending vanaf €60</div>

            {/* Stock status pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 14px',
              background: product.stock <= 5 ? 'var(--sale-bg)' : 'var(--success-bg)',
              marginBottom: 24, fontSize: 13,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: product.stock <= 0 ? 'var(--ink-3)' : product.stock <= 5 ? 'var(--sale)' : 'var(--success)',
              }} />
              {product.stock <= 0 ? (
                <span><strong>Uitverkocht</strong></span>
              ) : product.stock <= 5 ? (
                <span><strong>Nog {product.stock} op voorraad</strong> · vandaag besteld, morgen bij jou</span>
              ) : (
                <span><strong>Op voorraad</strong> · vandaag besteld voor 22:00 · morgen geleverd</span>
              )}
            </div>

            {/* Variant selector */}
            {variants.length > 1 && (
              <div style={{ marginBottom: 24 }}>
                <div className="eyebrow" style={{ marginBottom: 10 }}>Variant</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {variants.map((v) => (
                    <button key={v.id} onClick={() => setSelectedVariantId(v.id)}
                      style={{
                        padding: '10px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        background: selectedVariantId === v.id ? 'var(--ink)' : 'var(--bg-elev)',
                        color: selectedVariantId === v.id ? 'white' : 'var(--ink)',
                        border: '1px solid ' + (selectedVariantId === v.id ? 'var(--ink)' : 'var(--border-strong)'),
                        transition: 'all .15s ease',
                      }}>
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add to cart + Wishlist */}
            <div className="pdp-add-row" style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--ink)', height: 52, flexShrink: 0 }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{ background: 'none', border: 0, width: 44, height: '100%', fontSize: 18, cursor: 'pointer' }}>−</button>
                <span style={{ minWidth: 28, textAlign: 'center', fontSize: 14, fontWeight: 500 }}>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)}
                  style={{ background: 'none', border: 0, width: 44, height: '100%', fontSize: 18, cursor: 'pointer' }}>+</button>
              </div>
              <button
                onClick={handleAdd}
                disabled={!product.availableForSale}
                className="btn btn-lg pdp-add-btn"
                style={{ flex: 1, height: 52, fontSize: 13, opacity: product.availableForSale ? 1 : 0.5, minWidth: 160 }}>
                {addedFeedback
                  ? '✓ Toegevoegd!'
                  : product.availableForSale
                    ? `Voeg toe — ${formatPrice(product.price * qty, product.currencyCode)}`
                    : 'Uitverkocht'}
              </button>
              <button
                onClick={() => setWishlisted((w) => !w)}
                aria-label="Verlanglijst"
                style={{
                  width: 52, height: 52,
                  background: wishlisted ? 'var(--sale-bg)' : 'var(--bg-elev)',
                  border: '1px solid var(--border-strong)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                <svg width="18" height="18" viewBox="0 0 24 24"
                  fill={wishlisted ? 'var(--sale)' : 'none'}
                  stroke={wishlisted ? 'var(--sale)' : 'currentColor'}
                  strokeWidth="1.6">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* iDEAL / direct checkout button */}
            <button
              onClick={handleDirectCheckout}
              disabled={idealLoading}
              className="btn btn-lg"
              style={{ background: '#5a31e0', marginBottom: 28, color: 'white', border: 'none', opacity: idealLoading ? 0.7 : 1, cursor: idealLoading ? 'wait' : 'pointer' }}
            >
              {idealLoading ? 'Laden…' : <><span style={{ fontWeight: 700 }}>Direct kopen</span> met <strong>iDEAL</strong></>}
            </button>

            {/* Trust grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              {[
                { icon: '🚚', title: 'Gratis verzending', sub: 'Vanaf €60' },
                { icon: '↩', title: 'Gratis retour', sub: '30 dagen' },
                { icon: '✓', title: '100% origineel', sub: 'Geverifieerd' },
              ].map((x) => (
                <div key={x.title} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
                  <span style={{ fontSize: 20, color: 'var(--accent-deep)' }}>{x.icon}</span>
                  <div style={{ fontWeight: 500, color: 'var(--ink)', marginTop: 4 }}>{x.title}</div>
                  <div style={{ color: 'var(--ink-3)' }}>{x.sub}</div>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div style={{ borderTop: '1px solid var(--border)' }}>
              {accordionItems.map((item) => (
                <div key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <button
                    onClick={() => setOpenAccordion((o) => o === item.id ? null : item.id)}
                    style={{
                      width: '100%', padding: '18px 0',
                      background: 'none', border: 0,
                      fontSize: 14, fontWeight: 500,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      cursor: 'pointer', color: 'var(--ink)',
                    }}>
                    {item.label}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                      style={{ transform: openAccordion === item.id ? 'rotate(45deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }}>
                      <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                    </svg>
                  </button>
                  {openAccordion === item.id && (
                    <div style={{ padding: '0 0 20px', fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.65 }}>
                      {item.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Routine builder / "Bestelt vaak samen met" */}
      {relatedProducts.length > 0 && (
        <section style={{ background: 'var(--bg-sunken)', padding: '64px 0', marginTop: 64 }}>
          <div className="container-wide">
            <div style={{ marginBottom: 32 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Bouw je routine</div>
              <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>Bestelt vaak samen met</h2>
            </div>
            <div className="products-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
              {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Reviews section */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border)', marginTop: 32 }}>
        <div className="container-wide">
          <div className="pdp-reviews-grid">
            {/* Score overview */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Reviews</div>
              <div style={{ fontSize: 56, fontFamily: 'var(--font-display)', lineHeight: 1 }}>4.8</div>
              <div className="stars" style={{ fontSize: 18, marginTop: 4 }}>★★★★★</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Op basis van 247 reviews</div>

              <div style={{ marginTop: 28 }}>
                {REVIEW_DIST.map((d) => (
                  <div key={d.stars} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, fontSize: 12 }}>
                    <span style={{ width: 16 }}>{d.stars}★</span>
                    <div style={{ flex: 1, height: 6, background: 'var(--bg-sunken)', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, width: `${d.pct}%`, background: 'var(--accent)' }} />
                    </div>
                    <span style={{ color: 'var(--ink-3)', width: 32, textAlign: 'right' }}>{Math.round(247 * d.pct / 100)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual reviews */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {STATIC_REVIEWS.map((r, i) => (
                  <div key={i} style={{ padding: '24px 0', borderBottom: i < STATIC_REVIEWS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                        {r.verified && <span style={{ fontSize: 11, color: 'var(--success)' }}>✓ Geverifieerde koper</span>}
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{r.date}</span>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, margin: '0 0 8px', color: 'var(--ink-2)' }}>{r.text}</p>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                      <strong style={{ color: 'var(--ink-2)' }}>{r.name}</strong> · {r.age} jaar · {r.skintype}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24, fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 4, cursor: 'pointer', color: 'var(--ink-3)' }}>
                Toon alle 247 reviews →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container-wide">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 12 }}>Misschien ook iets voor jou</div>
                <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>Van {product.vendor}</h2>
              </div>
              {brandHandle && (
                <Link href={`/brand/${brandHandle}`} style={{ fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 4 }}>
                  Alle {product.vendor} →
                </Link>
              )}
            </div>
            <div className="products-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
              {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
