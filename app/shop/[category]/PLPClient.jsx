'use client';
import { useState, useMemo, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { formatPrice } from '@/lib/shopify';
import { trackShopify } from '@/lib/analytics';

const SCENT_FAMILIES = {
  'Fris': ['fresh', 'aqua', 'sea', 'blue', 'water', 'crystalle', 'ck one', 'ck everyone', 'in motion'],
  'Houtig': ['sandalwood', 'sandelhout', 'cedar', 'vetiver', 'wood', 'sandalwood'],
  'Oriëntaals': ['oriental', 'amber', 'oud', 'spice', 'spicy', 'intense', 'noir', 'night'],
  'Bloemig': ['flower', 'rose', 'jasmine', 'iris', 'lily', 'eternity', 'euphoria', 'flowery', 'flora', 'bloom'],
  'Kruidig': ['herb', 'sage', 'lavendel', 'lavender'],
  'Citrus': ['citrus', 'bergamot', 'lemon', 'orange', 'mandarin', 'lime', 'grapefruit'],
  'Fruitig': ['fruit', 'apple', 'pear', 'peach', 'berry'],
  'Aromatisch': ['aromatic', 'aroma'],
};

const SKIN_CONCERNS = {
  'Anti-aging': ['anti-age', 'retinol', 'lifting', 'liftactiv', 'neovadiol', 'hyalu', 'collagen', 'anti-rimpel', 'rimpel', 'firming'],
  'Acne / Onzuiver': ['acne', 'effaclar', 'blemish', 'onzuiver', 'spot'],
  'Hydratatie': ['hyaluron', 'hydra', 'moistur', 'mineral 89', 'aquatonic', 'b5'],
  'Pigmentvlekken': ['dark spot', 'pigment', 'vitamine c', 'vitamin c', 'c+', 'ce ferulic', 'phloretin', 'brightening'],
  'Gevoelige huid': ['gevoelig', 'sensitive', 'kalmer', 'soothing', 'calming', 'rosaliac', 'toleriane', 'cicaplast'],
  'Doffe huid': ['dull', 'glow', 'radiance', 'shine'],
  'Zonbescherming': ['spf', 'sun beauty', 'sunscreen', 'uv'],
  'Droge huid': ['droog', 'nutritic', 'nourish', ' rich'],
};

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevantie' },
  { value: 'price-asc', label: 'Prijs ↑' },
  { value: 'price-desc', label: 'Prijs ↓' },
  { value: 'sale', label: 'Meeste korting' },
];

function matchesKeywords(text, keywords) {
  const t = text.toLowerCase();
  return keywords.some((k) => t.includes(k.toLowerCase()));
}

export default function PLPClient({ category, title, sub, initialProducts }) {
  const [sort, setSort] = useState('relevance');
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(200);
  const [brands, setBrands] = useState([]);
  const [scents, setScents] = useState([]);
  const [concerns, setConcerns] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const showScents = category === 'parfum';
  const showConcerns = category === 'huidverzorging' || category === 'zonbescherming';

  const availableBrands = useMemo(() => {
    const map = {};
    initialProducts.forEach((p) => { if (p.vendor) map[p.vendor] = (map[p.vendor] || 0) + 1; });
    return Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [initialProducts]);

  const filtered = useMemo(() => {
    let list = initialProducts.filter((p) => {
      if (onSaleOnly && !p.onSale) return false;
      if (p.price > maxPrice) return false;
      if (brands.length && !brands.includes(p.vendor)) return false;
      if (scents.length) {
        const matchScent = scents.some((s) => matchesKeywords(p.title, SCENT_FAMILIES[s] ?? []));
        if (!matchScent) return false;
      }
      if (concerns.length) {
        const matchConcern = concerns.some((c) => matchesKeywords(p.title, SKIN_CONCERNS[c] ?? []));
        if (!matchConcern) return false;
      }
      return true;
    });
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === 'sale') list = [...list].sort((a, b) => (b.savings ?? 0) - (a.savings ?? 0));
    return list;
  }, [initialProducts, sort, onSaleOnly, maxPrice, brands, scents, concerns]);

  const toggle = (setter) => (value) => setter((prev) => (prev.includes(value) ? prev.filter((b) => b !== value) : [...prev, value]));
  const toggleBrand = toggle(setBrands);
  const toggleScent = toggle(setScents);
  const toggleConcern = toggle(setConcerns);

  const activeFilters = (onSaleOnly ? 1 : 0) + (maxPrice < 200 ? 1 : 0) + brands.length + scents.length + concerns.length;
  const clearAll = () => { setOnSaleOnly(false); setMaxPrice(200); setBrands([]); setScents([]); setConcerns([]); };

  const [headerH, setHeaderH] = useState(0);
  useEffect(() => {
    const h = document.querySelector('header')?.offsetHeight ?? 0;
    setHeaderH(h);
  }, []);

  // Collection view tracking
  useEffect(() => {
    trackShopify('COLLECTION_VIEW', {
      pageUrl: window.location.href,
      pageTitle: document.title,
      collectionHandle: category,
    });
  }, [category]);

  const FilterSidebar = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="eyebrow">Filters {activeFilters > 0 && <span style={{ color: 'var(--accent-deep)' }}>({activeFilters})</span>}</div>
        {activeFilters > 0 && (
          <button onClick={clearAll} style={{ background: 'none', border: 0, fontSize: 11, textDecoration: 'underline', cursor: 'pointer', color: 'var(--ink-3)' }}>
            Wis alles
          </button>
        )}
      </div>

      <FilterGroup title="Beschikbaarheid">
        <CheckRow checked={onSaleOnly} onChange={() => setOnSaleOnly((v) => !v)} label="In de uitverkoop" highlight />
      </FilterGroup>

      <FilterGroup title="Prijs">
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
          <span>€0</span>
          <span>tot {formatPrice(maxPrice)}</span>
        </div>
        <input type="range" min="10" max="200" step="5" value={maxPrice}
          onChange={(e) => setMaxPrice(+e.target.value)}
          style={{ width: '100%', accentColor: 'var(--ink)' }} />
      </FilterGroup>

      <FilterGroup title="Merk">
        {availableBrands.map((b) => (
          <CheckRow key={b.name} checked={brands.includes(b.name)} onChange={() => toggleBrand(b.name)} label={b.name} count={b.count} />
        ))}
      </FilterGroup>

      {showScents && (
        <FilterGroup title="Geurfamilie">
          {Object.keys(SCENT_FAMILIES).map((s) => (
            <CheckRow key={s} checked={scents.includes(s)} onChange={() => toggleScent(s)} label={s} />
          ))}
        </FilterGroup>
      )}

      {showConcerns && (
        <FilterGroup title="Huidprobleem">
          {Object.keys(SKIN_CONCERNS).map((c) => (
            <CheckRow key={c} checked={concerns.includes(c)} onChange={() => toggleConcern(c)} label={c} />
          ))}
        </FilterGroup>
      )}
    </>
  );

  return (
    <div>
      {/* Header */}
      <section style={{ background: 'var(--bg-sunken)', padding: '56px 0 40px' }}>
        <div className="container-wide">
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 16, display: 'flex', gap: 8 }}>
            <a href="/" style={{ color: 'var(--ink-3)' }}>Home</a>
            <span>/</span>
            <span>{title}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 80px)', lineHeight: 0.95, marginBottom: 12 }}>{title}</h1>
          <p style={{ color: 'var(--ink-3)', fontSize: 16, maxWidth: 540 }}>{sub}</p>
        </div>
      </section>

      {/* Sticky mobile filter/sort bar — buiten container, kleeft aan nav */}
      <div className="plp-sticky-bar" style={{ position: 'sticky', top: headerH, zIndex: 40, background: 'var(--bg)', borderBottom: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
        <div className="plp-mobile-bar" style={{ padding: '10px 16px' }}>
          <button onClick={() => setMobileFilterOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'var(--bg-elev)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
            Filters {activeFilters > 0 && <span style={{ background: 'var(--ink)', color: 'white', borderRadius: '50%', width: 18, height: 18, display: 'grid', placeItems: 'center', fontSize: 10 }}>{activeFilters}</span>}
          </button>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', flex: 1, paddingBottom: 2 }}>
            {SORT_OPTIONS.map((opt) => (
              <button key={opt.value} onClick={() => setSort(opt.value)}
                style={{ padding: '8px 14px', background: sort === opt.value ? 'var(--ink)' : 'var(--bg-elev)', color: sort === opt.value ? 'white' : 'var(--ink)', border: '1px solid ' + (sort === opt.value ? 'var(--ink)' : 'var(--border)'), borderRadius: 999, fontSize: 12, whiteSpace: 'nowrap', cursor: 'pointer', fontWeight: sort === opt.value ? 500 : 400 }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-wide" style={{ padding: '24px 32px 80px' }}>
        <div className="plp-grid">

          {/* Desktop Filters sidebar */}
          <aside className="plp-sidebar">
            <FilterSidebar />
          </aside>

          {/* Grid */}
          <section>
            <div className="plp-toolbar">
              <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
                <strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong> producten
              </div>
              {/* Sort chips — desktop only, mobile has its own in the bar above */}
              <div className="plp-sort-desktop" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {SORT_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => setSort(opt.value)}
                    style={{ padding: '7px 14px', background: sort === opt.value ? 'var(--ink)' : 'transparent', color: sort === opt.value ? 'white' : 'var(--ink-3)', border: '1px solid ' + (sort === opt.value ? 'var(--ink)' : 'var(--border)'), borderRadius: 999, fontSize: 12, cursor: 'pointer', fontWeight: sort === opt.value ? 500 : 400, transition: 'all .15s ease' }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {activeFilters > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {onSaleOnly && <Chip label="In de uitverkoop" onRemove={() => setOnSaleOnly(false)} />}
                {maxPrice < 200 && <Chip label={`Tot ${formatPrice(maxPrice)}`} onRemove={() => setMaxPrice(200)} />}
                {brands.map((b) => <Chip key={b} label={b} onRemove={() => toggleBrand(b)} />)}
                {scents.map((s) => <Chip key={s} label={s} onRemove={() => toggleScent(s)} />)}
                {concerns.map((c) => <Chip key={c} label={c} onRemove={() => toggleConcern(c)} />)}
              </div>
            )}

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 32px', background: 'var(--bg-elev)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 8 }}>Geen producten gevonden</div>
                <p style={{ color: 'var(--ink-3)', fontSize: 14, marginBottom: 16 }}>Probeer minder filters.</p>
                <button className="btn" onClick={clearAll}>Wis filters</button>
              </div>
            ) : (
              <div className="plp-products-grid">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilterOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div onClick={() => setMobileFilterOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,14,0.45)' }} />
          <aside style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 'min(340px, 90vw)', background: 'var(--bg)', overflowY: 'auto', padding: '0 20px 40px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0 16px', borderBottom: '1px solid var(--border)', marginBottom: 4, position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 2 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>Filters</div>
              <button onClick={() => setMobileFilterOpen(false)} style={{ background: 'none', border: 0, cursor: 'pointer', padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m4 4 14 14m0-14L4 18" strokeLinecap="round" /></svg>
              </button>
            </div>
            <FilterSidebar />
            <div style={{ position: 'sticky', bottom: 0, background: 'var(--bg)', paddingTop: 16, paddingBottom: 8, marginTop: 'auto' }}>
              <button className="btn btn-lg" style={{ width: '100%' }} onClick={() => setMobileFilterOpen(false)}>
                {filtered.length} producten tonen
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderTop: '1px solid var(--border)', padding: '16px 0' }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 0, padding: 0, fontSize: 13, fontWeight: 500, cursor: 'pointer', color: 'var(--ink)' }}>
        {title}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          <path d="m3 5 4 4 4-4" strokeLinecap="round" />
        </svg>
      </button>
      {open && <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>}
    </div>
  );
}

function CheckRow({ checked, onChange, label, count, highlight }) {
  return (
    <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, cursor: 'pointer', padding: '4px 0', color: 'var(--ink-2)' }}>
      <span style={{ width: 16, height: 16, border: `1px solid ${checked ? 'var(--ink)' : 'var(--border-strong)'}`, background: checked ? 'var(--ink)' : 'transparent', display: 'grid', placeItems: 'center', flexShrink: 0, borderRadius: 2 }}>
        {checked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.6"><path d="m2 5 2 2 4-4" strokeLinecap="round" /></svg>}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
      <span style={{ flex: 1, color: highlight ? 'var(--sale)' : 'inherit' }}>{label}</span>
      {count !== undefined && <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{count}</span>}
    </label>
  );
}

function Chip({ label, onRemove }) {
  return (
    <button onClick={onRemove} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'var(--ink)', color: 'white', border: 'none', borderRadius: 999, fontSize: 12, cursor: 'pointer' }}>
      {label}
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m2 2 6 6m0-6-6 6" strokeLinecap="round" /></svg>
    </button>
  );
}
