'use client';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/shopify';

const FREE_SHIP_THRESHOLD = 60;

export default function MiniCart() {
  const { lines, cartOpen, setCartOpen, updateQty, removeItem, checkoutUrl } = useCart();

  const subtotal = lines.reduce((s, line) => s + parseFloat(line.cost.totalAmount.amount), 0);
  const currency = lines[0]?.cost.totalAmount.currencyCode ?? 'EUR';
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);
  const shippingCost = remaining === 0 ? 0 : 4.95;
  const totalWithShipping = subtotal + shippingCost;

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(14,14,14,0.45)', zIndex: 98 }}
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
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: lines.length > 0 ? 14 : 0 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>Jouw mandje</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
                {lines.reduce((s, l) => s + l.quantity, 0)} {lines.reduce((s, l) => s + l.quantity, 0) === 1 ? 'product' : 'producten'}
              </div>
            </div>
            <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 0, cursor: 'pointer', padding: 4, marginTop: 2 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m4 4 14 14m0-14L4 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Free shipping progress bar */}
          {lines.length > 0 && (
            <div>
              <div style={{ fontSize: 12, marginBottom: 8 }}>
                {remaining > 0 ? (
                  <>Nog <strong>{formatPrice(remaining, currency)}</strong> voor <strong>gratis verzending</strong> 🚚</>
                ) : (
                  <span style={{ color: 'var(--success)' }}>🎉 <strong>Yes!</strong> Je krijgt gratis verzending.</span>
                )}
              </div>
              <div style={{ height: 4, background: 'var(--bg-sunken)', overflow: 'hidden' }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: progress >= 100 ? 'var(--success)' : 'var(--accent)',
                  transition: 'width .4s ease',
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 24px' }}>
          {lines.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink-3)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 8, color: 'var(--ink)' }}>Je mandje is leeg</div>
              <p style={{ fontSize: 14, marginBottom: 24 }}>Tijd om iets moois te vinden.</p>
              <button className="btn" onClick={() => setCartOpen(false)}>Verder shoppen</button>
            </div>
          ) : (
            lines.map((line) => {
              const { merchandise, quantity, id: lineId, cost } = line;
              const { product, title: variantTitle } = merchandise;
              const showVariant = variantTitle && variantTitle !== 'Default Title';
              return (
                <div key={lineId} style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
                  <div style={{ width: 80, height: 100, background: 'var(--bg-sunken)', flexShrink: 0, position: 'relative' }}>
                    {product.featuredImage?.url && (
                      <Image src={product.featuredImage.url} alt={product.title} fill style={{ objectFit: 'contain', padding: 4 }} sizes="80px" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.35, marginBottom: 4 }}>{product.title}</div>
                    {showVariant && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 8 }}>{variantTitle}</div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-strong)' }}>
                        <button
                          onClick={() => quantity <= 1 ? removeItem(lineId) : updateQty(lineId, quantity - 1)}
                          style={{ background: 'none', border: 0, width: 28, height: 28, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>−</button>
                        <span style={{ fontSize: 13, minWidth: 20, textAlign: 'center' }}>{quantity}</span>
                        <button
                          onClick={() => updateQty(lineId, quantity + 1)}
                          style={{ background: 'none', border: 0, width: 28, height: 28, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>+</button>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        {formatPrice(cost.totalAmount.amount, cost.totalAmount.currencyCode)}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeItem(lineId)}
                    style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--ink-3)', padding: 4, flexShrink: 0, marginTop: 2 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="m2 2 10 10m0-10L2 12" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-3)', marginBottom: 6 }}>
              <span>Subtotaal</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-3)', marginBottom: 12 }}>
              <span>Verzending</span>
              <span>
                {shippingCost === 0
                  ? <span style={{ color: 'var(--success)', fontWeight: 500 }}>Gratis</span>
                  : formatPrice(shippingCost, currency)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 12, borderTop: '1px solid var(--border)', marginBottom: 14 }}>
              <span style={{ fontWeight: 500 }}>Totaal</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 28 }}>
                {formatPrice(totalWithShipping, currency)}
              </span>
            </div>
            <a href={checkoutUrl} className="btn btn-lg"
              style={{ width: '100%', display: 'flex', justifyContent: 'center', textDecoration: 'none', marginBottom: 10 }}>
              Naar afrekenen →
            </a>
            {/* Payment methods */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, fontSize: 11, color: 'var(--ink-3)', marginBottom: 10 }}>
              <span>iDEAL</span>
              <span>·</span>
              <span>Bancontact</span>
              <span>·</span>
              <span>Apple Pay</span>
              <span>·</span>
              <span>Klarna</span>
            </div>
            <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setCartOpen(false)}>
              Verder winkelen
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
