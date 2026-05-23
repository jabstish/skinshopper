'use client';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/shopify';

export default function MiniCart() {
  const { lines, cartOpen, setCartOpen, updateQty, removeItem, cartTotal, checkoutUrl, loading } = useCart();

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(14,14,14,0.45)', zIndex: 98, animation: 'fadeBackdrop .2s ease' }}
        />
      )}

      {/* Drawer */}
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(480px, 100vw)',
        background: 'var(--bg)',
        boxShadow: 'var(--shadow-lg)',
        transform: cartOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .35s cubic-bezier(.5,.1,.2,1)',
        zIndex: 99,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div className="row" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}>
            Winkelmand {lines.length > 0 && <span style={{ fontSize: 14, color: 'var(--ink-3)', fontFamily: 'var(--font-body)' }}>({lines.reduce((s, l) => s + l.quantity, 0)} items)</span>}
          </div>
          <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 0, cursor: 'pointer', padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="m4 4 14 14m0-14L4 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {lines.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink-3)' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🛍</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 8 }}>Je mandje is leeg</div>
              <p style={{ fontSize: 14 }}>Voeg producten toe om verder te gaan.</p>
              <button className="btn" style={{ marginTop: 24 }} onClick={() => setCartOpen(false)}>Verder winkelen</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {lines.map((line) => {
                const { merchandise, quantity, id: lineId, cost } = line;
                const { product, price, title: variantTitle, selectedOptions } = merchandise;
                const showVariant = variantTitle && variantTitle !== 'Default Title';
                return (
                  <div key={lineId} className="row" style={{ gap: 16, alignItems: 'flex-start', paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                    {/* Image */}
                    <div style={{ width: 80, height: 80, background: 'var(--bg-sunken)', flexShrink: 0, position: 'relative' }}>
                      {product.featuredImage?.url && (
                        <Image src={product.featuredImage.url} alt={product.title} fill style={{ objectFit: 'contain', padding: 4 }} sizes="80px" />
                      )}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.35, marginBottom: 4 }}>{product.title}</div>
                      {showVariant && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 8 }}>{variantTitle}</div>}
                      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* Qty controls */}
                        <div className="row-tight" style={{ border: '1px solid var(--border)', width: 'fit-content' }}>
                          <button onClick={() => quantity <= 1 ? removeItem(lineId) : updateQty(lineId, quantity - 1)}
                            style={{ width: 28, height: 28, background: 'none', border: 0, cursor: 'pointer', fontSize: 16 }}>−</button>
                          <span style={{ fontSize: 13, minWidth: 20, textAlign: 'center' }}>{quantity}</span>
                          <button onClick={() => updateQty(lineId, quantity + 1)}
                            style={{ width: 28, height: 28, background: 'none', border: 0, cursor: 'pointer', fontSize: 16 }}>+</button>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>
                          {formatPrice(cost.totalAmount.amount, cost.totalAmount.currencyCode)}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeItem(lineId)} style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--ink-3)', padding: 4, flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="m2 2 10 10m0-10L2 12" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)' }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>Subtotaal</span>
              <span style={{ fontSize: 18, fontFamily: 'var(--font-display)' }}>{cartTotal}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 16, textAlign: 'center' }}>
              Verzendkosten worden berekend bij afrekenen · Gratis vanaf €60
            </div>
            <a href={checkoutUrl} className="btn btn-lg" style={{ width: '100%', display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
              Afrekenen →
            </a>
            <button className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => setCartOpen(false)}>
              Verder winkelen
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
