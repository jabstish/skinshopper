/* global React, ProductCard */
const { useState: useStatePLP, useMemo: useMemoPLP, useEffect: useEffectPLP } = React;

function PLP({ category, initialConcern, onNav, onQuickAdd }) {
  const cat = window.CATEGORIES.find(c => c.id === category);
  const baseProducts = useMemoPLP(() => {
    if (category === 'sale') {
      return window.PRODUCTS.filter(p => p.oldPrice);
    }
    return window.PRODUCTS.filter(p => p.category === category);
  }, [category]);

  // Filter state
  const [filters, setFilters] = useStatePLP({
    brands: [],
    priceMax: 200,
    onSale: false,
    inStock: false,
    concerns: initialConcern ? [initialConcern] : [],
    scents: [],
  });
  const [sort, setSort] = useStatePLP('relevance');
  const [grid, setGrid] = useStatePLP(4); // 3 or 4 columns
  const [mobileFiltersOpen, setMobileFiltersOpen] = useStatePLP(false);

  useEffectPLP(() => {
    setFilters(f => ({ ...f, concerns: initialConcern ? [initialConcern] : [] }));
  }, [initialConcern, category]);

  // Lock body scroll when mobile filter drawer is open
  useEffectPLP(() => {
    if (mobileFiltersOpen) document.body.classList.add('locked');
    else document.body.classList.remove('locked');
    return () => document.body.classList.remove('locked');
  }, [mobileFiltersOpen]);

  const availableBrands = useMemoPLP(() => {
    const map = {};
    baseProducts.forEach(p => { map[p.brand] = (map[p.brand] || 0) + 1; });
    return Object.entries(map).map(([id, count]) => ({ ...window.findBrand(id), count }));
  }, [baseProducts]);

  // Apply filters
  const filtered = useMemoPLP(() => {
    let list = baseProducts.filter(p => {
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      if (p.price > filters.priceMax) return false;
      if (filters.onSale && !p.oldPrice) return false;
      if (filters.inStock && p.stock <= 0) return false;
      if (filters.concerns.length && (!p.concern || !p.concern.some(c => filters.concerns.includes(c)))) return false;
      if (filters.scents.length && (!p.scent || !p.scent.some(s => filters.scents.includes(s)))) return false;
      return true;
    });

    // Sort
    list = [...list];
    if (sort === 'price-asc') list.sort((a,b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a,b) => b.price - a.price);
    else if (sort === 'sale') list.sort((a,b) => (b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0) - (a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0));
    else if (sort === 'rating') list.sort((a,b) => b.rating - a.rating);
    else if (sort === 'new') list.sort((a,b) => a.id.localeCompare(b.id));

    return list;
  }, [baseProducts, filters, sort]);

  const toggleArr = (key, value) => {
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter(x => x !== value) : [...f[key], value]
    }));
  };

  const clearAll = () => setFilters({ brands: [], priceMax: 200, onSale: false, inStock: false, concerns: [], scents: [] });

  const activeCount = filters.brands.length + filters.concerns.length + filters.scents.length + (filters.onSale ? 1 : 0) + (filters.inStock ? 1 : 0) + (filters.priceMax < 200 ? 1 : 0);

  return (
    <main>
      {/* Hero header */}
      <PLPHeader category={category} cat={cat} count={filtered.length} />

      <div className="container-wide" style={{ padding: '24px 32px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 48 }} className="plp-grid">

          {/* Filters sidebar (desktop) / drawer (mobile) */}
          <div className={`plp-filters-wrap ${mobileFiltersOpen ? 'open' : ''}`}>
            <div className="plp-filters-backdrop" onClick={() => setMobileFiltersOpen(false)} />
            <aside className="plp-filters" style={{ position: 'sticky', top: 140, alignSelf: 'start', maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
            <div className="plp-filters-mobile-head">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>
                Filters {activeCount > 0 && <span style={{ color: 'var(--accent-deep)', fontSize: 14, marginLeft: 4 }}>({activeCount})</span>}
              </div>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Sluiten"
                style={{ background: 'none', border: 0, padding: 4, cursor: 'pointer' }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m4 4 14 14m0-14L4 18" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
              <div className="eyebrow">Filters {activeCount > 0 && <span style={{ marginLeft: 4, color: 'var(--accent-deep)' }}>({activeCount})</span>}</div>
              {activeCount > 0 && <button onClick={clearAll} style={{ background: 'none', border: 0, fontSize: 11, textDecoration: 'underline', cursor: 'pointer', color: 'var(--ink-3)' }}>Wis alles</button>}
            </div>

            <FilterGroup title="Beschikbaarheid">
              <CheckboxRow checked={filters.inStock} onChange={() => setFilters(f => ({ ...f, inStock: !f.inStock }))} label="Op voorraad" />
              <CheckboxRow checked={filters.onSale} onChange={() => setFilters(f => ({ ...f, onSale: !f.onSale }))} label="In de uitverkoop" highlight />
            </FilterGroup>

            <FilterGroup title="Prijs">
              <div className="row" style={{ justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                <span>€0</span>
                <span>tot {window.formatPrice(filters.priceMax)}</span>
              </div>
              <input type="range" min="10" max="200" step="5" value={filters.priceMax}
                onChange={e => setFilters(f => ({ ...f, priceMax: +e.target.value }))}
                style={{ width: '100%', accentColor: 'var(--ink)' }} />
            </FilterGroup>

            <FilterGroup title="Merk">
              {availableBrands.map(b => (
                <CheckboxRow key={b.id} checked={filters.brands.includes(b.id)}
                  onChange={() => toggleArr('brands', b.id)}
                  label={`${b.name}`} count={b.count} />
              ))}
            </FilterGroup>

            {category === 'parfum' && (
              <FilterGroup title="Geurfamilie">
                {window.SCENT_FAMILIES.map(s => (
                  <CheckboxRow key={s.id} checked={filters.scents.includes(s.id)}
                    onChange={() => toggleArr('scents', s.id)}
                    label={s.label} />
                ))}
              </FilterGroup>
            )}

            {category !== 'parfum' && (
              <FilterGroup title="Huidprobleem">
                {window.SKIN_CONCERNS.map(c => (
                  <CheckboxRow key={c.id} checked={filters.concerns.includes(c.id)}
                    onChange={() => toggleArr('concerns', c.id)}
                    label={c.label} />
                ))}
              </FilterGroup>
            )}

            <div className="plp-filters-mobile-foot">
              <button onClick={clearAll} className="btn btn-ghost" style={{ flex: 1 }}>Wis alles</button>
              <button onClick={() => setMobileFiltersOpen(false)} className="btn" style={{ flex: 2 }}>Toon {filtered.length} producten</button>
            </div>
            </aside>
          </div>

          {/* Grid + controls */}
          <section>
            {/* Active filters bar */}
            {activeCount > 0 && (
              <div className="row" style={{ flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {filters.onSale && <ActiveChip label="In de uitverkoop" onRemove={() => setFilters(f => ({ ...f, onSale: false }))} />}
                {filters.inStock && <ActiveChip label="Op voorraad" onRemove={() => setFilters(f => ({ ...f, inStock: false }))} />}
                {filters.priceMax < 200 && <ActiveChip label={`Tot ${window.formatPrice(filters.priceMax)}`} onRemove={() => setFilters(f => ({ ...f, priceMax: 200 }))} />}
                {filters.brands.map(b => <ActiveChip key={b} label={window.findBrand(b)?.name} onRemove={() => toggleArr('brands', b)} />)}
                {filters.concerns.map(c => <ActiveChip key={c} label={window.SKIN_CONCERNS.find(x => x.id === c)?.label || c} onRemove={() => toggleArr('concerns', c)} />)}
                {filters.scents.map(s => <ActiveChip key={s} label={window.SCENT_FAMILIES.find(x => x.id === s)?.label || s} onRemove={() => toggleArr('scents', s)} />)}
              </div>
            )}

            {/* Sort + count + grid toggle */}
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <div className="row" style={{ gap: 12 }}>
                <button className="plp-filter-trigger chip" onClick={() => setMobileFiltersOpen(true)}
                  style={{ background: activeCount > 0 ? 'var(--ink)' : 'var(--bg-elev)', color: activeCount > 0 ? 'white' : 'var(--ink)', borderColor: activeCount > 0 ? 'var(--ink)' : 'var(--border-strong)' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 3h12M3 7h8M5 11h4" strokeLinecap="round" />
                  </svg>
                  Filters{activeCount > 0 && ` (${activeCount})`}
                </button>
                <div className="text-muted" style={{ fontSize: 13 }}>
                  <strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong> producten
                </div>
              </div>
              <div className="row" style={{ gap: 16 }}>
                <select value={sort} onChange={e => setSort(e.target.value)}
                  style={{ width: 'auto', padding: '8px 28px 8px 12px', fontSize: 13, background: 'transparent', border: '1px solid var(--border)' }}>
                  <option value="relevance">Sorteer: Relevantie</option>
                  <option value="price-asc">Prijs: laag → hoog</option>
                  <option value="price-desc">Prijs: hoog → laag</option>
                  <option value="sale">Grootste korting</option>
                  <option value="rating">Best beoordeeld</option>
                  <option value="new">Nieuwste</option>
                </select>
                <div className="row-tight">
                  <button onClick={() => setGrid(3)} aria-label="Groot grid"
                    style={{ background: 'none', border: 0, padding: 4, opacity: grid === 3 ? 1 : 0.4 }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><rect width="9" height="9" /><rect x="11" width="9" height="9" /><rect y="11" width="9" height="9" /><rect x="11" y="11" width="9" height="9" /></svg>
                  </button>
                  <button onClick={() => setGrid(4)} aria-label="Dicht grid"
                    style={{ background: 'none', border: 0, padding: 4, opacity: grid === 4 ? 1 : 0.4 }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><rect width="4" height="4" /><rect x="6" width="4" height="4" /><rect x="12" width="4" height="4" /><rect y="6" width="4" height="4" /><rect x="6" y="6" width="4" height="4" /><rect x="12" y="6" width="4" height="4" /><rect y="12" width="4" height="4" /><rect x="6" y="12" width="4" height="4" /><rect x="12" y="12" width="4" height="4" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <EmptyState onReset={clearAll} />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${grid}, 1fr)`, gap: 28, rowGap: 48 }}>
                {filtered.map((p, idx) => {
                  // Insert editorial cell halfway through (1 per 8 items)
                  const editorialIdx = grid === 4 ? 7 : 5;
                  if (idx === editorialIdx && category !== 'sale') {
                    return (
                      <React.Fragment key={p.id}>
                        <EditorialCell category={category} />
                        <ProductCard product={p} onClick={() => onNav('pdp', null, p.id)} onQuickAdd={onQuickAdd} />
                      </React.Fragment>
                    );
                  }
                  return <ProductCard key={p.id} product={p} onClick={() => onNav('pdp', null, p.id)} onQuickAdd={onQuickAdd} />;
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
function PLPHeader({ category, cat, count }) {
  const meta = {
    parfum: {
      title: "Parfum",
      sub: "Authentieke designer parfums tot 35% onder de adviesprijs",
      lead: "Hugo Boss · Calvin Klein · meer",
    },
    skincare: {
      title: "Huidverzorging",
      sub: "Dermatologisch getest. Door experts samengesteld.",
      lead: "La Roche-Posay · Vichy · SkinCeuticals · meer",
    },
    zonbescherming: {
      title: "Zonbescherming",
      sub: "Bescherming met SPF30 tot SPF50+, voor lichaam én gezicht.",
      lead: "La Roche-Posay · Lancaster · meer",
    },
    haar: { title: "Haar", sub: "Versterkende verzorging voor ieder haartype.", lead: "Vichy Dercos · meer" },
    sale: { title: "Sale", sub: "Tot 35% korting — zolang de voorraad strekt.", lead: "Op alle topmerken" },
  };
  const m = meta[category] || { title: cat?.label || "Producten", sub: "", lead: "" };

  return (
    <section style={{ background: 'var(--bg-sunken)', padding: '56px 0 40px' }}>
      <div className="container-wide">
        <div className="row" style={{ gap: 8, fontSize: 12, color: 'var(--ink-3)', marginBottom: 16 }}>
          <a style={{ cursor: 'pointer' }}>Home</a>
          <span>/</span>
          <span>{m.title}</span>
        </div>
        <div className="row" style={{ alignItems: 'end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 0.95, marginBottom: 12 }}>{m.title}</h1>
            <p style={{ color: 'var(--ink-3)', fontSize: 16, maxWidth: 540, marginBottom: 8 }}>{m.sub}</p>
            <div className="mono">{m.lead}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useStatePLP(defaultOpen);
  return (
    <div style={{ borderTop: '1px solid var(--border)', padding: '16px 0' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 0, padding: 0, fontSize: 13, fontWeight: 500, letterSpacing: '0.02em', cursor: 'pointer', color: 'var(--ink)' }}>
        {title}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          <path d="m3 5 4 4 4-4" strokeLinecap="round" />
        </svg>
      </button>
      {open && <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>}
    </div>
  );
}

function CheckboxRow({ checked, onChange, label, count, highlight }) {
  return (
    <label className="row" style={{ gap: 10, fontSize: 13, cursor: 'pointer', padding: '4px 0', color: 'var(--ink-2)' }}>
      <span style={{
        width: 16, height: 16,
        border: '1px solid ' + (checked ? 'var(--ink)' : 'var(--border-strong)'),
        background: checked ? 'var(--ink)' : 'transparent',
        display: 'grid', placeItems: 'center', flexShrink: 0,
        borderRadius: 2
      }}>
        {checked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.6"><path d="m2 5 2 2 4-4" strokeLinecap="round" /></svg>}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
      <span style={{ flex: 1, color: highlight ? 'var(--sale)' : 'inherit' }}>{label}</span>
      {count !== undefined && <span className="text-faint" style={{ fontSize: 11 }}>{count}</span>}
    </label>
  );
}

function ActiveChip({ label, onRemove }) {
  return (
    <button className="chip" onClick={onRemove}
      style={{ background: 'var(--ink)', color: 'white', borderColor: 'var(--ink)' }}>
      {label}
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m2 2 6 6m0-6-6 6" strokeLinecap="round" /></svg>
    </button>
  );
}

function EmptyState({ onReset }) {
  return (
    <div style={{ padding: '80px 32px', textAlign: 'center', background: 'var(--bg-elev)' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 8 }}>Geen producten gevonden</div>
      <p className="text-muted" style={{ marginBottom: 20 }}>Probeer een minder strenge selectie.</p>
      <button className="btn" onClick={onReset}>Wis filters</button>
    </div>
  );
}

function EditorialCell({ category }) {
  const blurbs = {
    parfum: {
      eyebrow: "Wist je dat",
      title: "Eau de Parfum heeft 15–20% geuressence",
      sub: "Eau de Toilette zit op 5–15%. Hoger percentage = langere houdbaarheid op de huid.",
      cta: "Geur-gids",
      tint: "#7a1840",
    },
    skincare: {
      eyebrow: "Routine-advies",
      title: "Reinigen, behandelen, beschermen",
      sub: "De 3-stappen volgorde die dermatologen aanraden. Begin simpel, bouw langzaam uit.",
      cta: "Lees gids",
      tint: "#1d8ed4",
    },
    zonbescherming: { eyebrow: "Belangrijk", title: "SPF gebruik je elke dag", sub: "Ook in de winter en achter glas. UV-A straling veroudert de huid sneller dan iets anders.", cta: "Meer over SPF", tint: "#ef7d27" },
    haar: { eyebrow: "Tip", title: "Was niet elke dag", sub: "Te vaak wassen verwijdert natuurlijke oliën. 2-3x per week is voor de meeste haartypes ideaal.", cta: "Lees meer", tint: "#a07c4e" },
    sale: { eyebrow: "Sale", title: "Vergelijk altijd de prijs", sub: "Wij tonen de adviesprijs naast onze prijs zodat je ziet wat je echt bespaart.", cta: "Bekijk sale", tint: "#8b1e3f" },
  };
  const b = blurbs[category] || blurbs.skincare;

  return (
    <div style={{
      aspectRatio: '4/5',
      background: `linear-gradient(150deg, ${b.tint}18 0%, ${b.tint}40 100%)`,
      padding: 28,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      color: 'var(--ink)',
    }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 12, color: b.tint }}>{b.eyebrow}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.1, marginBottom: 12 }}>{b.title}</div>
        <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--ink-2)' }}>{b.sub}</p>
      </div>
      <a style={{ fontSize: 12, textDecoration: 'underline', textUnderlineOffset: 4, cursor: 'pointer', fontWeight: 500 }}>{b.cta} →</a>
    </div>
  );
}

window.PLP = PLP;
