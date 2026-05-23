'use client';
import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { formatPrice } from '@/lib/shopify';

export default function PLPClient({ category, title, sub, initialProducts }) {
  const [sort, setSort] = useState('relevance');
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(200);
  const [brands, setBrands] = useState([]);

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
      return true;
    });
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === 'sale') list = [...list].sort((a, b) => (b.savings ?? 0) - (a.savings ?? 0));
    else if (sort === 'rating') list = [...list].sort(() => Math.random() - 0.5);
    return list;
  }, [initialProducts, sort, onSaleOnly, maxPrice, brands]);

  const toggleBrand = (name) => setBrands((prev) => prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]);
  const activeFilters = (onSaleOnly ? 1 : 0) + (maxPrice < 200 ? 1 : 0) + brands.length;
  const clearAll = () => { setOnSaleOnly(false); setMaxPrice(200); setBrands([]); };

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
          <h1 style={{ fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 0.95, marginBottom: 12 }}>{title}</h1>
          <p style={{ color: 'var(--ink-3)', fontSize: 16, maxWidth: 540 }}>{sub}</p>
        </div>
      </section>

      <div className="container-wide" style={{ padding: '24px 32px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 48 }}>

          {/* Filters */}
          <aside style={{ position: 'sticky', top: 140, alignSelf: 'start', maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="eyebrow">Filters {activeFilters > 0 && <span style={{ color: 'var(--accent-deep)' }}>({activeFilters})</span>}</div>
              {activeFilters > 0 && <button onClick={clearAll} style={{ background: 'none', border: 0, fontSize: 11, textDecoration: 'underline', cursor: 'pointer', color: 'var(--ink-3)' }}>Wis alles</button>}
            </div>

            {/* Beschikbaarheid */}
            <FilterGroup title="Beschikbaarheid">
              <CheckRow checked={onSaleOnly} onChange={() => setOnSaleOnly((v) => !v)} label="In de uitverkoop" highlight />
            </FilterGroup>

            {/* Prijs */}
            <FilterGroup title="Prijs">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                <span>€0</span>
                <span>tot {formatPrice(maxPrice)}</span>
              </div>
              <input type="range" min="10" max="200" step="5" value={maxPrice}
                onChange={(e) => setMaxPrice(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--ink)' }} />
            </FilterGroup>

            {/* Merk */}
            <FilterGroup title="Merk">
              {availableBrands.map((b) => (
                <CheckRow key={b.name} checked={brands.includes(b.name)} onChange={() => toggleBrand(b.name)} label={b.name} count={b.count} />
              ))}
            </FilterGroup>
          </aside>

          {/* Grid */}
          <section>
            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
                <strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong> producten
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                style={{ padding: '8px 28px 8px 12px', fontSize: 13, background: 'transparent', border: '1px solid var(--border)', cursor: 'pointer' }}>
                <option value="relevance">Relevantie</option>
                <option value="price-asc">Prijs: laag → hoog</option>
                <option value="price-desc">Prijs: hoog → laag</option>
                <option value="sale">Grootste korting</option>
              </select>
            </div>

            {/* Active filter chips */}
            {activeFilters > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {onSaleOnly && <Chip label="In de uitverkoop" onRemove={() => setOnSaleOnly(false)} />}
                {maxPrice < 200 && <Chip label={`Tot ${formatPrice(maxPrice)}`} onRemove={() => setMaxPrice(200)} />}
                {brands.map((b) => <Chip key={b} label={b} onRemove={() => toggleBrand(b)} />)}
              </div>
            )}

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 32px', background: 'var(--bg-elev)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 8 }}>Geen producten gevonden</div>
                <button className="btn" onClick={clearAll} style={{ marginTop: 16 }}>Wis filters</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, rowGap: 48 }}>
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </section>
        </div>
      </div>
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
