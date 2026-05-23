/* global React, BottleSVG */
const { useState: useStateCart, useMemo: useMemoCart } = React;

function MiniCart({ open, items, onClose, onUpdateQty, onRemove, onCheckout, onAddToCart }) {
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const oldSubtotal = items.reduce((s, i) => s + (i.product.oldPrice || i.product.price) * i.qty, 0);
  const savings = oldSubtotal - subtotal;
  const freeShipThreshold = 60;
  const remainingForFree = Math.max(0, freeShipThreshold - subtotal);
  const progress = Math.min(100, (subtotal / freeShipThreshold) * 100);

  // Cross-sell: suggest products from same brands as items in cart, then category, excluding what's already in cart
  const crossSell = useMemoCart(() => {
    if (items.length === 0) return [];
    const cartIds = new Set(items.map(i => i.product.id));
    const cartBrands = [...new Set(items.map(i => i.product.brand))];
    const cartCategories = [...new Set(items.map(i => i.product.category))];

    const byBrand = window.PRODUCTS.filter(p => cartBrands.includes(p.brand) && !cartIds.has(p.id));
    const byCategory = window.PRODUCTS.filter(p => cartCategories.includes(p.category) && !cartIds.has(p.id) && !byBrand.find(x => x.id === p.id));

    return [...byBrand, ...byCategory]
      .sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) || b.rating - a.rating)
      .slice(0, 4);
  }, [items]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, pointerEvents: open ? 'auto' : 'none', overflow: 'hidden' }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(14,14,14,0.45)',
        opacity: open ? 1 : 0,
        transition: 'opacity .3s ease'
      }} />
      <aside style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: 'min(480px, 100vw)',
        background: 'var(--bg)',
        boxShadow: 'var(--shadow-lg)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .35s cubic-bezier(.5,.1,.2,1)',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>Jouw mandje</div>
              <div className="text-muted" style={{ fontSize: 12 }}>{items.length} {items.length === 1 ? 'product' : 'producten'}</div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 0, padding: 4, cursor: 'pointer' }} aria-label="Sluiten">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m4 4 14 14m0-14L4 18" strokeLinecap="round" /></svg>
            </button>
          </div>

          {/* Free shipping progress */}
          {items.length > 0 && (
            <div>
              <div style={{ fontSize: 12, marginBottom: 8 }}>
                {remainingForFree > 0 ? (
                  <>Nog <strong>{window.formatPrice(remainingForFree)}</strong> voor <strong>gratis verzending</strong> 🚚</>
                ) : (
                  <span style={{ color: 'var(--success)' }}>🎉 <strong>Yes!</strong> Je krijgt gratis verzending.</span>
                )}
              </div>
              <div style={{ height: 4, background: 'var(--bg-sunken)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: progress >= 100 ? 'var(--success)' : 'var(--accent)', transition: 'width .4s ease' }} />
              </div>
            </div>
          )}
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-3)' }}>
              <div style={{ fontSize: 48, marginBottom: 16, fontFamily: 'var(--font-display)' }}>◯</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8, color: 'var(--ink)' }}>Je mandje is leeg</div>
              <p style={{ fontSize: 14, marginBottom: 24 }}>Tijd om iets moois te vinden.</p>
              <button className="btn" onClick={onClose}>Verder shoppen</button>
            </div>
          ) : (
            <>
              {items.map(item => (
                <CartItem key={item.product.id} item={item} onUpdateQty={onUpdateQty} onRemove={onRemove} />
              ))}

              {/* Cross-sell: related products to add */}
              {crossSell.length > 0 && (
                <div style={{ margin: '8px -24px 0', padding: '20px 24px', background: 'var(--bg-sunken)' }}>
                  <div style={{ marginBottom: 4 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>Vaak samen gekocht</div>
                    <div className="text-muted" style={{ fontSize: 12, marginTop: 2 }}>Maak je routine compleet</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                    {crossSell.map(p => {
                      const brand = window.findBrand(p.brand);
                      const onSale = p.oldPrice && p.oldPrice > p.price;
                      return (
                        <div key={p.id} className="row" style={{ gap: 12, padding: 10, background: 'var(--bg-elev)', alignItems: 'center' }}>
                          <div style={{ width: 56, height: 70, background: `${p.tint}18`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                            <div style={{ width: '70%', height: '85%' }}><BottleSVG shape={p.shape} tint={p.tint} brand="" /></div>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="product-card-brand" style={{ marginBottom: 2, fontSize: 9 }}>{brand?.name}</div>
                            <div style={{ fontSize: 12, lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.name}</div>
                            <div className="row" style={{ gap: 6, alignItems: 'baseline' }}>
                              <span style={{ fontSize: 12, fontWeight: 500, color: onSale ? 'var(--sale)' : 'var(--ink)' }}>{window.formatPrice(p.price)}</span>
                              {onSale && <span className="strike text-faint" style={{ fontSize: 10 }}>{window.formatPrice(p.oldPrice)}</span>}
                            </div>
                          </div>
                          <button onClick={() => onAddToCart?.(p, 1)} aria-label={`Voeg ${p.name} toe`}
                            style={{
                              flexShrink: 0,
                              width: 32, height: 32,
                              borderRadius: '50%',
                              background: 'var(--ink)', color: 'white',
                              border: 0, cursor: 'pointer',
                              display: 'grid', placeItems: 'center'
                            }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
            <div className="row" style={{ justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-3)', marginBottom: 6 }}>
              <span>Subtotaal</span>
              <span>{window.formatPrice(subtotal)}</span>
            </div>
            {savings > 0 && (
              <div className="row" style={{ justifyContent: 'space-between', fontSize: 13, color: 'var(--sale)', marginBottom: 6 }}>
                <span>Korting</span>
                <span>−{window.formatPrice(savings)}</span>
              </div>
            )}
            <div className="row" style={{ justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-3)', marginBottom: 12 }}>
              <span>Verzending</span>
              <span>{remainingForFree === 0 ? <span style={{ color: 'var(--success)' }}>Gratis</span> : '€4,95'}</span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 12, borderTop: '1px solid var(--border)', marginBottom: 14 }}>
              <span style={{ fontWeight: 500 }}>Totaal</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 28 }}>{window.formatPrice(subtotal + (remainingForFree > 0 ? 4.95 : 0))}</span>
            </div>
            <button onClick={onCheckout} className="btn btn-lg" style={{ width: '100%', marginBottom: 8 }}>
              Naar afrekenen
            </button>
            <div className="row" style={{ justifyContent: 'center', gap: 8, fontSize: 11, color: 'var(--ink-3)' }}>
              <span>iDEAL</span>
              <span>·</span>
              <span>Bancontact</span>
              <span>·</span>
              <span>Apple Pay</span>
              <span>·</span>
              <span>Klarna</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function CartItem({ item, onUpdateQty, onRemove }) {
  const p = item.product;
  const brand = window.findBrand(p.brand);
  const onSale = p.oldPrice && p.oldPrice > p.price;
  return (
    <div className="row" style={{ gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
      <div style={{ width: 80, height: 100, background: `${p.tint}18`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <div style={{ width: '70%', height: '85%' }}><BottleSVG shape={p.shape} tint={p.tint} brand="" /></div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="product-card-brand" style={{ marginBottom: 2 }}>{brand?.name}</div>
        <div style={{ fontSize: 13, lineHeight: 1.35, marginBottom: 4 }}>{p.name}</div>
        <div className="text-faint" style={{ fontSize: 11 }}>{p.size}</div>

        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <div className="row-tight" style={{ border: '1px solid var(--border-strong)' }}>
            <button onClick={() => onUpdateQty(p.id, item.qty - 1)} style={{ background: 'none', border: 0, width: 26, height: 26, cursor: 'pointer' }}>−</button>
            <span style={{ minWidth: 20, textAlign: 'center', fontSize: 12 }}>{item.qty}</span>
            <button onClick={() => onUpdateQty(p.id, item.qty + 1)} style={{ background: 'none', border: 0, width: 26, height: 26, cursor: 'pointer' }}>+</button>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: onSale ? 'var(--sale)' : 'var(--ink)' }}>{window.formatPrice(p.price * item.qty)}</div>
            {onSale && <div className="strike text-faint" style={{ fontSize: 11 }}>{window.formatPrice(p.oldPrice * item.qty)}</div>}
          </div>
        </div>
      </div>
      <button onClick={() => onRemove(p.id)} aria-label="Verwijder"
        style={{ background: 'none', border: 0, padding: 4, cursor: 'pointer', color: 'var(--ink-3)' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="m3 3 8 8m0-8-8 8" strokeLinecap="round" /></svg>
      </button>
    </div>
  );
}

window.MiniCart = MiniCart;
