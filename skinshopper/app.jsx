/* global React, ReactDOM, Header, Footer, Home, PLP, PDP, BrandPage, MiniCart, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle */

const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "view": "home",
  "mobilePreview": false,
  "accentTone": "warm-tan",
  "showStockUrgency": true
}/*EDITMODE-END*/;

const ACCENTS = {
  "warm-tan":   { accent: "#8b6f47", accentDeep: "#6b5535", accentSoft: "#efe6d6" },
  "oxblood":    { accent: "#8b1e3f", accentDeep: "#5e1029", accentSoft: "#fbecf0" },
  "forest":     { accent: "#3b6b4a", accentDeep: "#264a32", accentSoft: "#e6efe7" },
  "navy":       { accent: "#2e3e6b", accentDeep: "#1a2548", accentSoft: "#e6e9f0" },
};

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Routing
  const [view, setView] = useState({
    page: 'home',
    category: null,
    productId: null,
    concern: null,
    brandId: null,
  });

  // Cart
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Recently viewed
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('skinshopper-recent') || '[]'); } catch { return []; }
  });

  // Apply accent palette
  useEffect(() => {
    const a = ACCENTS[tweaks.accentTone] || ACCENTS["warm-tan"];
    document.documentElement.style.setProperty('--accent', a.accent);
    document.documentElement.style.setProperty('--accent-deep', a.accentDeep);
    document.documentElement.style.setProperty('--accent-soft', a.accentSoft);
  }, [tweaks.accentTone]);

  // Mobile preview mode adds a viewport constraint
  useEffect(() => {
    document.body.style.maxWidth = tweaks.mobilePreview ? '430px' : '';
    document.body.style.margin = tweaks.mobilePreview ? '0 auto' : '';
    document.body.style.boxShadow = tweaks.mobilePreview ? '0 0 60px rgba(0,0,0,0.15)' : '';
    document.body.classList.toggle('mobile-preview', tweaks.mobilePreview);
  }, [tweaks.mobilePreview]);

  // Scroll lock when cart open
  useEffect(() => {
    if (cartOpen) document.body.classList.add('locked');
    else document.body.classList.remove('locked');
  }, [cartOpen]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view.page, view.category, view.productId, view.brandId]);

  // Track recently viewed
  useEffect(() => {
    if (view.page === 'pdp' && view.productId) {
      setRecentlyViewed(prev => {
        const next = [view.productId, ...prev.filter(x => x !== view.productId)].slice(0, 10);
        localStorage.setItem('skinshopper-recent', JSON.stringify(next));
        return next;
      });
    }
  }, [view.page, view.productId]);

  // Nav helper
  const onNav = (page, category = null, productId = null, concern = null, brandId = null) => {
    setView({ page, category, productId, concern, brandId });
    setTweak('view', page);
  };

  // Cart helpers
  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { product, qty }];
    });
    setToastMsg(`✓ ${product.name.slice(0, 40)}${product.name.length > 40 ? '…' : ''} toegevoegd`);
    setTimeout(() => setToastMsg(null), 2400);
  };
  const quickAdd = (product) => {
    addToCart(product, 1);
    // soft-open cart after a brief beat — but only for first add
    setTimeout(() => setCartOpen(true), 250);
  };
  const updateQty = (productId, qty) => {
    if (qty <= 0) return removeItem(productId);
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, qty } : i));
  };
  const removeItem = (productId) => setCart(prev => prev.filter(i => i.product.id !== productId));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <Header onNav={onNav} cartCount={cartCount} onCartOpen={() => setCartOpen(true)} view={view} />

      {view.page === 'home' && <Home onNav={onNav} onQuickAdd={quickAdd} />}
      {view.page === 'plp'  && <PLP category={view.category} initialConcern={view.concern} onNav={onNav} onQuickAdd={quickAdd} />}
      {view.page === 'pdp'  && <PDP productId={view.productId} onNav={onNav} onAddToCart={addToCart} recentlyViewed={recentlyViewed} />}
      {view.page === 'brand'&& <BrandPage brandId={view.brandId} onNav={onNav} onQuickAdd={quickAdd} />}

      <Footer />

      <MiniCart open={cartOpen} items={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQty={updateQty}
        onRemove={removeItem}
        onAddToCart={addToCart}
        onCheckout={() => alert("Checkout flow — niet in scope voor dit prototype. (Volgende stap: Shopify checkout / iDEAL flow.)")} />

      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--ink)', color: 'white', padding: '14px 22px',
          fontSize: 13, letterSpacing: '0.02em', boxShadow: 'var(--shadow-lg)',
          zIndex: 150, animation: 'fadeIn .3s ease', display: 'flex', alignItems: 'center', gap: 16
        }}>
          <span>{toastMsg}</span>
          <button onClick={() => { setToastMsg(null); setCartOpen(true); }} style={{ background: 'transparent', border: '1px solid #555', color: 'white', padding: '6px 12px', fontSize: 11, cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Bekijk mandje
          </button>
        </div>
      )}

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Navigatie">
          <TweakRadio label="Pagina" value={view.page}
            onChange={(v) => {
              const map = {
                'home': () => onNav('home'),
                'plp-parfum': () => onNav('plp', 'parfum'),
                'plp-skincare': () => onNav('plp', 'skincare'),
                'plp-sale': () => onNav('plp', 'sale'),
                'pdp-retinol': () => onNav('pdp', null, 's01'),
                'pdp-boss': () => onNav('pdp', null, 'p04'),
                'pdp-mineral89': () => onNav('pdp', null, 'v07'),
                'brand-lrp': () => onNav('brand', null, null, null, 'la-roche-posay'),
                'brand-vichy': () => onNav('brand', null, null, null, 'vichy'),
                'brand-skinc': () => onNav('brand', null, null, null, 'skinceuticals'),
              };
              (map[v] || map.home)();
            }}
            options={[
              { value: 'home', label: 'Home' },
              { value: 'plp-parfum', label: 'PLP — Parfum' },
              { value: 'plp-skincare', label: 'PLP — Huidverzorging' },
              { value: 'plp-sale', label: 'PLP — Sale' },
              { value: 'pdp-retinol', label: 'PDP — La Roche Retinol B3' },
              { value: 'pdp-boss', label: 'PDP — Boss Bottled' },
              { value: 'pdp-mineral89', label: 'PDP — Vichy Mineral 89' },
              { value: 'brand-lrp', label: 'Brand — La Roche-Posay' },
              { value: 'brand-vichy', label: 'Brand — Vichy' },
              { value: 'brand-skinc', label: 'Brand — SkinCeuticals' },
            ]}
          />
        </TweakSection>

        <TweakSection label="Display">
          <TweakToggle label="Mobiele preview"
            value={tweaks.mobilePreview}
            onChange={(v) => setTweak('mobilePreview', v)} />
        </TweakSection>

        <TweakSection label="Accent kleur">
          <TweakRadio label="Tone"
            value={tweaks.accentTone}
            onChange={(v) => setTweak('accentTone', v)}
            options={[
              { value: 'warm-tan', label: 'Warm tan' },
              { value: 'oxblood',  label: 'Oxblood'  },
              { value: 'forest',   label: 'Forest'   },
              { value: 'navy',     label: 'Navy'     },
            ]}
          />
        </TweakSection>

        <TweakSection label="Cart actions">
          <button onClick={() => setCartOpen(true)} className="btn btn-sm" style={{ width: '100%' }}>Open mini cart ({cartCount})</button>
          <button onClick={() => {
            // seed cart with a few items
            const ids = ['s01', 'v07', 'p04'];
            ids.forEach(id => addToCart(window.findProduct(id), 1));
          }} className="btn btn-sm btn-ghost" style={{ width: '100%', marginTop: 8 }}>Vul mandje met 3 items</button>
          <button onClick={() => setCart([])} className="btn btn-sm btn-ghost" style={{ width: '100%', marginTop: 8 }}>Mandje legen</button>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
