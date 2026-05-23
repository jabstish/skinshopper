/* global React */
const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────────────────────
// Bottle SVG — stylized product placeholders by shape
// Renders a subtle silhouette in a tinted bg; intentional placeholder look
// ─────────────────────────────────────────────────────────────
function BottleSVG({ shape = "flacon", tint = "#e9d8b8", brand = "" }) {
  const darken = (hex, amt = 0.18) => {
    const h = hex.replace("#", "");
    const r = parseInt(h.substr(0,2),16), g = parseInt(h.substr(2,2),16), b = parseInt(h.substr(4,2),16);
    return `rgb(${Math.round(r*(1-amt))},${Math.round(g*(1-amt))},${Math.round(b*(1-amt))})`;
  };
  const fg = darken(tint, 0.04);
  const stroke = darken(tint, 0.32);
  const labelStroke = darken(tint, 0.5);

  // Determine if tint is light (need darker text) or dark
  const isLight = (() => {
    const h = tint.replace("#","");
    const r = parseInt(h.substr(0,2),16), g = parseInt(h.substr(2,2),16), b = parseInt(h.substr(4,2),16);
    return (0.299*r + 0.587*g + 0.114*b) > 180;
  })();
  const labelFill = isLight ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.85)";
  const labelTxt = isLight ? "#3a2f22" : "#2a1f12";

  const shapes = {
    flacon: (
      <g>
        {/* cap */}
        <rect x="38" y="6" width="24" height="14" rx="1" fill={darken(tint, 0.45)} />
        {/* neck */}
        <rect x="44" y="20" width="12" height="6" fill={stroke} />
        {/* body */}
        <rect x="22" y="26" width="56" height="68" rx="3" fill={fg} stroke={stroke} strokeWidth="0.8" />
        {/* label */}
        <rect x="32" y="52" width="36" height="22" fill={labelFill} stroke={labelStroke} strokeWidth="0.4" />
      </g>
    ),
    spray: (
      <g>
        <rect x="42" y="4" width="16" height="10" rx="1" fill={darken(tint, 0.45)} />
        <rect x="46" y="14" width="8" height="4" fill={stroke} />
        <rect x="28" y="18" width="44" height="78" rx="22" fill={fg} stroke={stroke} strokeWidth="0.8" />
        <rect x="34" y="44" width="32" height="32" fill={labelFill} stroke={labelStroke} strokeWidth="0.4" />
      </g>
    ),
    jar: (
      <g>
        <rect x="20" y="22" width="60" height="14" rx="2" fill={darken(tint, 0.32)} />
        <rect x="22" y="36" width="56" height="56" rx="4" fill={fg} stroke={stroke} strokeWidth="0.8" />
        <rect x="32" y="56" width="36" height="20" fill={labelFill} stroke={labelStroke} strokeWidth="0.4" />
      </g>
    ),
    tube: (
      <g>
        <rect x="40" y="4" width="20" height="10" rx="1" fill={darken(tint, 0.42)} />
        <path d="M 30 14 L 70 14 L 74 94 L 26 94 Z" fill={fg} stroke={stroke} strokeWidth="0.8" />
        <rect x="34" y="34" width="32" height="40" fill={labelFill} stroke={labelStroke} strokeWidth="0.4" />
      </g>
    ),
    dropper: (
      <g>
        <rect x="38" y="2" width="24" height="20" rx="1" fill={darken(tint, 0.5)} />
        <rect x="46" y="22" width="8" height="6" fill={darken(tint, 0.42)} />
        <path d="M 30 28 L 70 28 L 70 92 Q 70 96 66 96 L 34 96 Q 30 96 30 92 Z" fill={fg} stroke={stroke} strokeWidth="0.8" />
        <rect x="34" y="46" width="32" height="38" fill={labelFill} stroke={labelStroke} strokeWidth="0.4" />
      </g>
    ),
    pouch: (
      <g>
        <path d="M 24 12 L 76 12 L 78 96 L 22 96 Z" fill={fg} stroke={stroke} strokeWidth="0.8" />
        <line x1="22" y1="20" x2="78" y2="20" stroke={stroke} strokeWidth="0.6" strokeDasharray="2,1" />
        <rect x="32" y="36" width="36" height="44" fill={labelFill} stroke={labelStroke} strokeWidth="0.4" />
      </g>
    ),
  };

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="bottle-svg" aria-hidden="true">
      {shapes[shape] || shapes.flacon}
      {brand && (
        <text x="50" y="65" textAnchor="middle" fill={labelTxt}
              style={{ font: 'bold 5px DM Sans, sans-serif', letterSpacing: '0.05em' }}>
          {brand.toUpperCase().slice(0, 14)}
        </text>
      )}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// ProductCard
// ─────────────────────────────────────────────────────────────
function ProductCard({ product, onClick, onQuickAdd }) {
  const brand = window.findBrand(product.brand);
  const onSale = product.oldPrice && product.oldPrice > product.price;
  const lowStock = product.stock <= 5;
  const savings = onSale ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <article className="product-card" onClick={() => onClick?.(product)}>
      <div className="product-card-media" style={{ background: `linear-gradient(160deg, ${product.tint}10 0%, ${product.tint}22 100%)` }}>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'grid', placeItems: 'center',
        }}>
          <div style={{ width: '70%', height: '85%' }}>
            <BottleSVG shape={product.shape} tint={product.tint} brand={brand?.name} />
          </div>
        </div>
        <div className="product-card-badges">
          {onSale && <span className="badge badge-sale">−{savings}%</span>}
          {product.bestseller && !onSale && <span className="badge badge-bestseller">Bestseller</span>}
        </div>
        <button className="quick-add" aria-label="Voeg toe aan winkelmand"
          onClick={(e) => { e.stopPropagation(); onQuickAdd?.(product); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="product-card-body">
        <div className="product-card-brand">{brand?.name}</div>
        <div className="product-card-name">{product.name}</div>
        <div className="row" style={{ gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="product-card-prices">
              <span className={onSale ? "product-card-price-sale" : ""}>{window.formatPrice(product.price)}</span>
              {onSale && <span className="product-card-price-old">{window.formatPrice(product.oldPrice)}</span>}
            </div>
            <div className="text-faint" style={{ fontSize: 11, marginTop: 2 }}>{product.size}</div>
          </div>
          {lowStock && (
            <div className="text-sale" style={{ fontSize: 11, fontWeight: 500, textAlign: 'right' }}>
              Nog {product.stock}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────
// MegaMenu — hover panel: featured products (left) + brands (right)
// ─────────────────────────────────────────────────────────────
function MegaMenu({ category, onNav, onMouseEnter, onMouseLeave }) {
  // Featured products + brands per category
  const config = {
    parfum: {
      featuredFilter: (p) => p.category === 'parfum',
      brands: ['hugo-boss', 'calvin-klein'],
      shortcuts: [
        { label: 'Voor hem',  filter: 'Herenparfum' },
        { label: 'Voor haar', filter: 'Damesparfum' },
        { label: 'Unisex',    filter: 'Unisex' },
        { label: 'Aftershave',filter: 'Aftershave' },
      ],
      editorial: { title: 'Vind jouw signature', sub: 'Hoe sterker het percentage geuressence, hoe langer de geur op je huid blijft.', cta: 'Geur-gids →' },
    },
    skincare: {
      featuredFilter: (p) => p.category === 'skincare',
      brands: ['la-roche-posay', 'vichy', 'skinceuticals', 'cerave', 'clarins'],
      shortcuts: [
        { label: 'Serum',     filter: 'Serum' },
        { label: 'Dagcrème',  filter: 'Dagcrème' },
        { label: 'Reiniger',  filter: 'Reiniger' },
        { label: 'Oogcrème',  filter: 'Oogcrème' },
      ],
      editorial: { title: 'Reinigen, behandelen, beschermen', sub: 'De 3-stappen routine die dermatologen aanraden — begin simpel.', cta: 'Routine-gids →' },
    },
    zonbescherming: {
      featuredFilter: (p) => p.sub?.toLowerCase().includes('zonbescherming') || p.sub?.toLowerCase().includes('spf') || p.concern?.includes('zonbescherming'),
      brands: ['la-roche-posay', 'lancaster'],
      shortcuts: [
        { label: 'Gezicht',  filter: 'gezicht' },
        { label: 'Lichaam',  filter: 'lichaam' },
        { label: 'Aftersun', filter: 'aftersun' },
        { label: 'SPF 50+',  filter: 'spf50' },
      ],
      editorial: { title: 'SPF gebruik je elke dag', sub: 'Ook in winter en achter glas. UV-A verouder de huid sneller dan iets anders.', cta: 'Meer over SPF →' },
    },
    haar: {
      featuredFilter: (p) => p.category === 'haar',
      brands: ['vichy'],
      shortcuts: [
        { label: 'Shampoo',       filter: 'Shampoo' },
        { label: 'Conditioner',   filter: 'Conditioner' },
        { label: 'Tegen haaruitval', filter: 'haaruitval' },
      ],
      editorial: { title: 'Was niet elke dag', sub: '2-3x per week is voor de meeste haartypes ideaal — natuurlijke oliën blijven behouden.', cta: 'Lees meer →' },
    },
    sale: {
      featuredFilter: (p) => p.oldPrice && p.oldPrice > p.price,
      brands: ['hugo-boss', 'calvin-klein', 'la-roche-posay', 'vichy', 'skinceuticals', 'lancaster'],
      shortcuts: [
        { label: 'Tot −20%', filter: '20' },
        { label: 'Tot −30%', filter: '30' },
        { label: 'Tot −35%', filter: '35' },
        { label: 'Laatste stuks', filter: 'low' },
      ],
      editorial: { title: 'Tot 35% korting', sub: 'Eerlijke vergelijking — adviesprijs staat altijd naast onze prijs.', cta: 'Shop alle sale →' },
      isSale: true,
    },
  };
  const c = config[category];
  if (!c) return null;

  // Featured: pick top items (bestsellers first, then biggest savings)
  const featured = window.PRODUCTS
    .filter(c.featuredFilter)
    .sort((a, b) => {
      const aSav = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
      const bSav = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
      if (c.isSale) return bSav - aSav;
      return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) || bSav - aSav;
    })
    .slice(0, 4);

  // Brand product counts within this category
  const brandsList = c.brands.map(id => {
    const brand = window.findBrand(id);
    const count = window.PRODUCTS.filter(p => p.brand === id && c.featuredFilter(p)).length;
    return { ...brand, count };
  }).filter(b => b.count > 0);

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
         style={{
           position: 'absolute', left: 0, right: 0, top: '100%',
           background: 'var(--bg)',
           borderTop: '1px solid var(--border)',
           borderBottom: '1px solid var(--border)',
           boxShadow: 'var(--shadow)',
           animation: 'fadeIn .15s ease',
           zIndex: 49,
         }}>
      <div className="container-wide" style={{ padding: '32px 32px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 40 }}>

          {/* LEFT: featured products */}
          <div>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
              <div className="eyebrow">Uitgelicht</div>
              <a onClick={() => onNav('plp', category)} style={{ cursor: 'pointer', fontSize: 12, textDecoration: 'underline', textUnderlineOffset: 3 }}>Bekijk alles →</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {featured.map(p => {
                const brand = window.findBrand(p.brand);
                const onSale = p.oldPrice && p.oldPrice > p.price;
                const savings = onSale ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
                return (
                  <div key={p.id} onClick={() => onNav('pdp', null, p.id)} style={{ cursor: 'pointer' }}>
                    <div style={{ position: 'relative', aspectRatio: '4/5', background: `linear-gradient(160deg, ${p.tint}10 0%, ${p.tint}22 100%)`, marginBottom: 8 }}>
                      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                        <div style={{ width: '70%', height: '85%' }}><BottleSVG shape={p.shape} tint={p.tint} brand={brand?.name} /></div>
                      </div>
                      {onSale && (
                        <span className="badge badge-sale" style={{ position: 'absolute', top: 6, left: 6, fontSize: 9, padding: '3px 6px' }}>−{savings}%</span>
                      )}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 2 }}>{brand?.name}</div>
                    <div style={{ fontSize: 12, lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: 32 }}>{p.name}</div>
                    <div className="row" style={{ gap: 6, fontSize: 12 }}>
                      <span style={{ color: onSale ? 'var(--sale)' : 'var(--ink)', fontWeight: 500 }}>{window.formatPrice(p.price)}</span>
                      {onSale && <span className="strike text-faint" style={{ fontSize: 11 }}>{window.formatPrice(p.oldPrice)}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MIDDLE: shortcuts */}
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>Shop op categorie</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {c.shortcuts.map(s => (
                <a key={s.label} onClick={() => onNav('plp', category)}
                  style={{ cursor: 'pointer', fontSize: 14, padding: '8px 0', color: 'var(--ink-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'color .15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-2)'}>
                  <span>{s.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>→</span>
                </a>
              ))}
            </div>

            {/* Editorial blurb */}
            <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-sunken)' }}>
              <div className="eyebrow" style={{ color: 'var(--accent-deep)', marginBottom: 8 }}>Tip</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, lineHeight: 1.2, marginBottom: 6 }}>{c.editorial.title}</div>
              <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--ink-3)', margin: '0 0 10px' }}>{c.editorial.sub}</p>
              <a style={{ fontSize: 11, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', fontWeight: 500 }}>{c.editorial.cta}</a>
            </div>
          </div>

          {/* RIGHT: brands */}
          <div>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
              <div className="eyebrow">Merken</div>
              <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{brandsList.length} {brandsList.length === 1 ? 'merk' : 'merken'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {brandsList.map((b, i) => (
                <a key={b.id} onClick={() => onNav('brand', null, null, null, b.id)}
                  style={{
                    cursor: 'pointer',
                    padding: '10px 0',
                    borderBottom: i < brandsList.length - 1 ? '1px solid var(--border)' : 0,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    fontSize: 13,
                    color: 'var(--ink)',
                    transition: 'color .15s ease, padding-left .2s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.paddingLeft = '6px'; e.currentTarget.style.color = 'var(--accent-deep)'; }}
                  onMouseLeave={e => { e.currentTarget.style.paddingLeft = '0'; e.currentTarget.style.color = 'var(--ink)'; }}>
                  <span>{b.wordmark}</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 400, letterSpacing: 0 }}>{b.count}</span>
                </a>
              ))}
            </div>
            <a onClick={() => onNav('plp', category)}
               style={{ cursor: 'pointer', fontSize: 12, textDecoration: 'underline', textUnderlineOffset: 3, marginTop: 16, display: 'inline-block' }}>
              Alle merken bekijken →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MobileNav — slide-in drawer with accordion categories
// ─────────────────────────────────────────────────────────────
function MobileNav({ open, onClose, onNav, onOpenSearch, view }) {
  const [expanded, setExpanded] = useState(null);

  // Lock body scroll while open
  useEffect(() => {
    if (open) document.body.classList.add('locked');
    else document.body.classList.remove('locked');
  }, [open]);

  const categories = [
    {
      id: 'parfum', label: 'Parfum',
      shortcuts: [
        { label: 'Damesparfum',   onClick: () => onNav('plp', 'parfum') },
        { label: 'Herenparfum',   onClick: () => onNav('plp', 'parfum') },
        { label: 'Unisex',        onClick: () => onNav('plp', 'parfum') },
        { label: 'Aftershave',    onClick: () => onNav('plp', 'parfum') },
      ],
      brands: ['hugo-boss', 'calvin-klein'],
    },
    {
      id: 'skincare', label: 'Huidverzorging',
      shortcuts: [
        { label: 'Serum',        onClick: () => onNav('plp', 'skincare') },
        { label: 'Dagcrème',     onClick: () => onNav('plp', 'skincare') },
        { label: 'Reiniger',     onClick: () => onNav('plp', 'skincare') },
        { label: 'Oogcrème',     onClick: () => onNav('plp', 'skincare') },
        { label: 'Anti-aging',   onClick: () => onNav('plp', 'skincare', null, 'anti-aging') },
        { label: 'Acne',         onClick: () => onNav('plp', 'skincare', null, 'acne') },
      ],
      brands: ['la-roche-posay', 'vichy', 'skinceuticals', 'cerave', 'clarins'],
    },
    {
      id: 'zonbescherming', label: 'Zonbescherming',
      shortcuts: [
        { label: 'Gezicht SPF',  onClick: () => onNav('plp', 'skincare', null, 'zonbescherming') },
        { label: 'Lichaam SPF',  onClick: () => onNav('plp', 'skincare', null, 'zonbescherming') },
        { label: 'Aftersun',     onClick: () => onNav('plp', 'skincare') },
      ],
      brands: ['la-roche-posay', 'lancaster'],
    },
    {
      id: 'haar', label: 'Haar',
      shortcuts: [
        { label: 'Shampoo',      onClick: () => onNav('plp', 'haar') },
        { label: 'Conditioner',  onClick: () => onNav('plp', 'haar') },
      ],
      brands: ['vichy'],
    },
    {
      id: 'sale', label: 'Sale', sale: true,
      shortcuts: [
        { label: 'Parfum sale',         onClick: () => onNav('plp', 'sale') },
        { label: 'Huidverzorging sale', onClick: () => onNav('plp', 'sale') },
        { label: 'Tot −35%',            onClick: () => onNav('plp', 'sale') },
      ],
      brands: ['hugo-boss', 'calvin-klein', 'la-roche-posay', 'vichy', 'skinceuticals'],
    },
  ];

  return (
    <div className="mobile-nav-root" style={{ position: 'fixed', inset: 0, zIndex: 200, pointerEvents: open ? 'auto' : 'none', overflow: 'hidden' }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(14,14,14,0.45)',
        opacity: open ? 1 : 0,
        transition: 'opacity .3s ease'
      }} />
      <aside style={{
        position: 'absolute', top: 0, left: 0, bottom: 0,
        width: 'min(420px, 92vw)',
        background: 'var(--bg)',
        boxShadow: 'var(--shadow-lg)',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform .35s cubic-bezier(.5,.1,.2,1)',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div className="row" style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: '0.04em' }}>SKINSHOPPER</div>
          <button onClick={onClose} aria-label="Sluiten"
            style={{ background: 'none', border: 0, padding: 4, cursor: 'pointer' }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m4 4 14 14m0-14L4 18" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Search trigger */}
        <button onClick={onOpenSearch}
          style={{
            margin: '14px 20px 0', padding: '12px 14px',
            background: 'var(--bg-sunken)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 10,
            cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: 'var(--ink-3)'
          }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          Zoek producten, merken...
        </button>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {/* Home */}
          <a onClick={() => onNav('home')}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 20px', borderBottom: '1px solid var(--border)',
              fontSize: 16, cursor: 'pointer', fontWeight: 500,
            }}>
            <span>Home</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m5 3 4 4-4 4" strokeLinecap="round" />
            </svg>
          </a>

          {/* Categories accordion */}
          {categories.map(cat => {
            const isOpen = expanded === cat.id;
            const brandsList = cat.brands.map(id => window.findBrand(id)).filter(Boolean);
            return (
              <div key={cat.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <button onClick={() => setExpanded(o => o === cat.id ? null : cat.id)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '16px 20px', background: 'none', border: 0,
                    fontSize: 16, cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'inherit', fontWeight: 500,
                    color: cat.sale ? 'var(--sale)' : 'var(--ink)'
                  }}>
                  <span>{cat.label}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"
                       style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}>
                    <path d="m5 3 4 4-4 4" strokeLinecap="round" />
                  </svg>
                </button>

                {isOpen && (
                  <div style={{ padding: '4px 20px 18px', background: 'var(--bg-sunken)', animation: 'fadeIn .2s ease' }}>
                    {/* Shop all */}
                    <a onClick={() => onNav('plp', cat.id === 'sale' ? 'sale' : cat.id)}
                       style={{ display: 'flex', padding: '10px 0', fontSize: 14, fontWeight: 500, cursor: 'pointer', borderBottom: '1px solid var(--border)', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Bekijk alle {cat.label.toLowerCase()}</span>
                      <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>→</span>
                    </a>

                    {/* Shortcuts */}
                    <div className="eyebrow" style={{ marginTop: 14, marginBottom: 8 }}>Categorie</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      {cat.shortcuts.map(s => (
                        <a key={s.label} onClick={s.onClick}
                          style={{ padding: '8px 0', fontSize: 13, color: 'var(--ink-2)', cursor: 'pointer' }}>
                          {s.label}
                        </a>
                      ))}
                    </div>

                    {/* Brands */}
                    {brandsList.length > 0 && (
                      <>
                        <div className="eyebrow" style={{ marginTop: 16, marginBottom: 8 }}>Merken</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {brandsList.map(b => (
                            <button key={b.id} onClick={() => onNav('brand', null, null, null, b.id)} className="chip"
                              style={{ background: 'var(--bg-elev)' }}>
                              {b.wordmark}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Secondary nav */}
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <a className="row-tight" style={{ gap: 12, fontSize: 14, cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
              <span>Account</span>
            </a>
            <a className="row-tight" style={{ gap: 12, fontSize: 14, cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>Verlanglijst</span>
            </a>
            <a className="row-tight" style={{ gap: 12, fontSize: 14, cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" />
              </svg>
              <span>Volg je bestelling</span>
            </a>
            <a className="row-tight" style={{ gap: 12, fontSize: 14, cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span>Contact</span>
            </a>
          </div>
        </div>

        {/* Footer USPs */}
        <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px', background: 'var(--bg-sunken)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'var(--ink-3)' }}>
            <div className="row-tight" style={{ gap: 8 }}><span>🚚</span><span>Gratis verzending vanaf €60</span></div>
            <div className="row-tight" style={{ gap: 8 }}><span>↩</span><span>30 dagen kosteloos retour</span></div>
            <div className="row-tight" style={{ gap: 8 }}><span>✓</span><span>100% originele producten</span></div>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AnnouncementBar — slim top strip with rotating messages
// ─────────────────────────────────────────────────────────────
function AnnouncementBar() {
  const msgs = [
    "Gratis verzending vanaf €60 — vandaag besteld, morgen in huis",
    "100% originele producten — direct van de leverancier",
    "30 dagen retourrecht — kosteloos",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % msgs.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ background: 'var(--ink)', color: 'white', textAlign: 'center', padding: '10px 16px', fontSize: 12, letterSpacing: '0.04em' }}>
      <span key={idx} style={{ animation: 'fadeIn .4s ease' }}>{msgs[idx]}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Header — sticky, with search, logo, account/wishlist/cart
// ─────────────────────────────────────────────────────────────
function Header({ onNav, cartCount, onCartOpen, view }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const closeTimerRef = useRef(null);

  const openMega = (id) => {
    clearTimeout(closeTimerRef.current);
    setHoveredNav(id);
  };
  const closeMega = () => {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setHoveredNav(null), 120);
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "parfum", label: "Parfum" },
    { id: "skincare", label: "Huidverzorging" },
    { id: "zonbescherming", label: "Zonbescherming" },
    { id: "haar", label: "Haar" },
    { id: "sale", label: "Sale", sale: true },
  ];

  const searchResults = useMemo(() => {
    if (!searchQ.trim()) return [];
    const q = searchQ.toLowerCase();
    return window.PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      window.findBrand(p.brand)?.name.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQ]);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
      <AnnouncementBar />
      <div className="container-wide" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '18px 32px', gap: 24 }}>
        {/* Left: search + mobile menu */}
        <div className="row" style={{ gap: 16 }}>
          <button className="mobile-menu-btn" aria-label="Menu" onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 0, padding: 4, cursor: 'pointer' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
          <button onClick={() => setSearchOpen(true)} className="row-tight"
            style={{ background: 'none', border: 0, padding: 0, color: 'var(--ink-3)', fontSize: 13, cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <span className="hide-mobile" style={{ marginLeft: 6 }}>Zoek producten, merken...</span>
          </button>
        </div>

        {/* Center: logo */}
        <a onClick={() => onNav('home')} style={{ cursor: 'pointer', display: 'block', textAlign: 'center' }}>
          <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: '0.04em', fontFamily: 'var(--font-body)' }}>SKINSHOPPER</div>
        </a>

        {/* Right: account, wishlist, cart */}
        <div className="row" style={{ gap: 20, justifyContent: 'flex-end' }}>
          <a className="row-tight hide-mobile" style={{ fontSize: 13, color: 'var(--ink-3)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
            <span style={{ marginLeft: 6 }}>Account</span>
          </a>
          <button style={{ background: 'none', border: 0, padding: 4, color: 'var(--ink-3)' }} aria-label="Verlanglijst">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button onClick={onCartOpen} style={{ background: 'none', border: 0, padding: 4, color: 'var(--ink)', position: 'relative' }} aria-label="Winkelmand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: -2, right: -4, background: 'var(--ink)', color: 'white', borderRadius: '50%', fontSize: 10, width: 18, height: 18, display: 'grid', placeItems: 'center', fontWeight: 600 }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Nav menu */}
      <nav className="desktop-nav" style={{ borderTop: '1px solid var(--border)', position: 'relative' }} onMouseLeave={closeMega}>
        <div className="container-wide" style={{ display: 'flex', justifyContent: 'center', gap: 40, padding: '14px 32px', flexWrap: 'wrap' }}>
          {navItems.map(item => {
            const hasMega = item.id !== 'home';
            const isHovered = hoveredNav === item.id;
            const isActive = view.category === item.id || (view.page === 'home' && item.id === 'home');
            return (
              <a key={item.id}
                onClick={() => { setHoveredNav(null); onNav(item.id === 'home' ? 'home' : 'plp', item.id === 'home' ? null : item.id); }}
                onMouseEnter={() => hasMega ? openMega(item.id) : closeMega()}
                style={{
                  cursor: 'pointer',
                  fontSize: 13,
                  letterSpacing: '0.04em',
                  fontWeight: 500,
                  color: item.sale ? 'var(--sale)' : ((isActive || isHovered) ? 'var(--ink)' : 'var(--ink-3)'),
                  borderBottom: (isActive || isHovered) ? '1.5px solid var(--ink)' : '1.5px solid transparent',
                  paddingBottom: 4,
                  transition: 'color .15s ease, border-color .15s ease'
                }}>
                {item.label}
              </a>
            );
          })}
        </div>
        {hoveredNav && hoveredNav !== 'home' && (
          <MegaMenu category={hoveredNav}
            onNav={(...args) => { setHoveredNav(null); onNav(...args); }}
            onMouseEnter={() => openMega(hoveredNav)}
            onMouseLeave={closeMega} />
        )}
      </nav>

      {/* Search overlay */}
      {searchOpen && (
        <SearchOverlay
          query={searchQ}
          onQuery={setSearchQ}
          results={searchResults}
          onClose={() => { setSearchOpen(false); setSearchQ(""); }}
          onSelect={(p) => { setSearchOpen(false); setSearchQ(""); onNav('pdp', null, p.id); }}
        />
      )}

      {/* Mobile nav drawer */}
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onNav={(...args) => { setMobileOpen(false); onNav(...args); }}
        onOpenSearch={() => { setMobileOpen(false); setSearchOpen(true); }}
        view={view}
      />
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// Search overlay
// ─────────────────────────────────────────────────────────────
function SearchOverlay({ query, onQuery, results, onClose, onSelect }) {
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const trending = ["La Roche-Posay Retinol", "Hugo Boss Bottled", "Vichy Mineral 89", "SkinCeuticals C E Ferulic", "Zonbrand SPF50"];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, animation: 'fadeBackdrop .2s ease' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,14,0.4)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--bg)', boxShadow: 'var(--shadow-lg)', padding: '28px 0', maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="container-wide">
          <div className="row" style={{ borderBottom: '2px solid var(--ink)', paddingBottom: 12 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input ref={inputRef} value={query} onChange={e => onQuery(e.target.value)}
              placeholder="Zoek op product, merk of ingrediënt..."
              style={{ flex: 1, border: 0, fontSize: 22, fontFamily: 'var(--font-display)', padding: '4px 0', background: 'transparent' }} />
            <button onClick={onClose} style={{ background: 'none', border: 0, fontSize: 12, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sluiten</button>
          </div>

          {query ? (
            <div style={{ marginTop: 24 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>{results.length} resultaten</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {results.map(p => {
                  const brand = window.findBrand(p.brand);
                  return (
                    <div key={p.id} onClick={() => onSelect(p)} className="row" style={{ padding: 12, background: 'var(--bg-sunken)', cursor: 'pointer', gap: 12 }}>
                      <div style={{ width: 60, height: 60, background: `${p.tint}22`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: 40, height: 50 }}><BottleSVG shape={p.shape} tint={p.tint} brand="" /></div>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div className="product-card-brand">{brand?.name}</div>
                        <div style={{ fontSize: 13, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.name}</div>
                        <div style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>{window.formatPrice(p.price)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 12 }}>Populair</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {trending.map(t => (
                    <button key={t} onClick={() => onQuery(t)}
                      style={{ background: 'none', border: 0, textAlign: 'left', padding: 0, fontSize: 14, color: 'var(--ink-2)', cursor: 'pointer' }}>
                      → {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 12 }}>Top bestsellers</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  {window.PRODUCTS.filter(p => p.bestseller).slice(0, 4).map(p => (
                    <div key={p.id} onClick={() => onSelect(p)} style={{ cursor: 'pointer' }}>
                      <div style={{ aspectRatio: '4/5', background: `${p.tint}22`, display: 'grid', placeItems: 'center' }}>
                        <div style={{ width: '70%', height: '85%' }}><BottleSVG shape={p.shape} tint={p.tint} brand={window.findBrand(p.brand)?.name} /></div>
                      </div>
                      <div style={{ fontSize: 11, marginTop: 8, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{window.findBrand(p.brand)?.name}</div>
                      <div style={{ fontSize: 12, marginTop: 2, lineHeight: 1.3 }}>{p.name.slice(0, 40)}{p.name.length > 40 ? '…' : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: '#c7c1b5', marginTop: 80 }}>
      <div className="container-wide" style={{ padding: '80px 32px 32px' }}>
        {/* USP strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, paddingBottom: 56, borderBottom: '1px solid #2a2622', marginBottom: 56 }}>
          {[
            ["Gratis verzending", "Vanaf €60 — voor 22:00 besteld, morgen in huis"],
            ["30 dagen retour", "Niet tevreden? Kosteloos retour"],
            ["100% origineel", "Geverifieerde leveranciers, echte producten"],
            ["Expert advies", "Door dermatologen samengesteld assortiment"],
          ].map(([t, s]) => (
            <div key={t}>
              <div style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 6 }}>{t}</div>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>{s}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 48 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 900, fontSize: 22, color: 'white', letterSpacing: '0.04em', marginBottom: 12 }}>SKINSHOPPER</div>
            <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 320 }}>Premium parfum en huidverzorging van de merken die je kent. Slimme prijzen, eerlijke uitverkoop, snelle levering.</p>
            <div style={{ marginTop: 24 }}>
              <div className="eyebrow" style={{ color: '#c7c1b5', marginBottom: 12 }}>Schrijf je in</div>
              <div className="row" style={{ gap: 0 }}>
                <input type="email" placeholder="Jouw e-mailadres" style={{ background: 'transparent', border: '1px solid #3a3530', borderRight: 0, color: 'white', borderRadius: 0 }} />
                <button className="btn" style={{ background: 'white', color: 'var(--ink)' }}>→</button>
              </div>
              <div style={{ fontSize: 11, marginTop: 8, color: '#8a857a' }}>Krijg 10% korting op je eerste bestelling</div>
            </div>
          </div>
          {[
            ["Shop", ["Parfum", "Huidverzorging", "Zonbescherming", "Haar", "Sale", "Cadeaubon"]],
            ["Klantenservice", ["Contact", "Bezorging", "Retour", "Veelgestelde vragen", "Volg je bestelling", "Cadeau verpakken"]],
            ["Over ons", ["Verhaal", "Merken", "Reviews", "Affiliate", "Vacatures", "Pers"]],
          ].map(([title, items]) => (
            <div key={title}>
              <div className="eyebrow" style={{ color: 'white', marginBottom: 16 }}>{title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                {items.map(item => <a key={item} style={{ cursor: 'pointer' }}>{item}</a>)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #2a2622', marginTop: 56, paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, fontSize: 12, color: '#8a857a' }}>
          <div>© 2026 SkinShopper B.V. — KVK 87654321 · BTW NL004321221B01</div>
          <div className="row" style={{ gap: 20 }}>
            <a>Privacy</a>
            <a>Cookies</a>
            <a>Algemene voorwaarden</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { BottleSVG, ProductCard, Header, Footer, MegaMenu, MobileNav });
