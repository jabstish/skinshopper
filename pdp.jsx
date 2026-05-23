/* global React, BottleSVG, ProductCard */
const { useState: useStatePDP, useEffect: useEffectPDP, useMemo: useMemoPDP } = React;

function PDP({ productId, onNav, onAddToCart, recentlyViewed }) {
  const product = window.findProduct(productId);
  if (!product) return <main style={{padding: 80, textAlign:'center'}}>Product niet gevonden</main>;

  const brand = window.findBrand(product.brand);
  const onSale = product.oldPrice && product.oldPrice > product.price;
  const savings = onSale ? (product.oldPrice - product.price).toFixed(2).replace('.', ',') : 0;
  const savingsPct = onSale ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  // PDP state
  const [size, setSize] = useStatePDP(product.size);
  const [qty, setQty] = useStatePDP(1);
  const [activeImg, setActiveImg] = useStatePDP(0);
  const [openAccordion, setOpenAccordion] = useStatePDP('description');
  const [addedFeedback, setAddedFeedback] = useStatePDP(false);

  // Related products (same brand or category)
  const related = useMemoPDP(() => {
    return window.PRODUCTS
      .filter(p => p.id !== product.id && (p.brand === product.brand || p.sub === product.sub))
      .slice(0, 4);
  }, [product]);

  // "Goes well with" — for skincare, suggest a routine builder
  const goesWith = useMemoPDP(() => {
    if (product.category === 'skincare') {
      // suggest different sub categories from same brand
      const otherSubs = ['Reiniger', 'Serum', 'Dagcrème', 'Oogcrème', 'Zonbescherming'].filter(s => s !== product.sub);
      return otherSubs.map(s =>
        window.PRODUCTS.find(p => p.sub === s && p.id !== product.id) ||
        window.PRODUCTS.find(p => p.sub === s)
      ).filter(Boolean).slice(0, 3);
    }
    return window.PRODUCTS.filter(p => p.brand === product.brand && p.id !== product.id).slice(0, 3);
  }, [product]);

  const handleAdd = () => {
    onAddToCart(product, qty);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2200);
  };

  // Available sizes (mock — for skincare just original, for parfum 30/50/100)
  const sizeOptions = useMemoPDP(() => {
    if (product.category === 'parfum') return ['30ml', '50ml', '100ml'].filter(s => true);
    return [product.size];
  }, [product]);

  return (
    <main>
      {/* Breadcrumbs */}
      <div className="container-wide" style={{ padding: '20px 32px 8px', fontSize: 12, color: 'var(--ink-3)' }}>
        <div className="row" style={{ gap: 8, flexWrap: 'nowrap', overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none' }}>
          <a onClick={() => onNav('home')} style={{ cursor: 'pointer', flexShrink: 0 }}>Home</a>
          <span style={{ flexShrink: 0 }}>/</span>
          <a onClick={() => onNav('plp', product.category)} style={{ cursor: 'pointer', flexShrink: 0 }}>{product.category === 'parfum' ? 'Parfum' : 'Huidverzorging'}</a>
          <span style={{ flexShrink: 0 }}>/</span>
          <a onClick={() => onNav('brand', null, null, null, product.brand)} style={{ cursor: 'pointer', flexShrink: 0 }}>{brand?.name}</a>
          <span style={{ flexShrink: 0 }}>/</span>
          <span style={{ color: 'var(--ink)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</span>
        </div>
      </div>

      <div className="container-wide" style={{ padding: '24px 32px 0', display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 64 }}>
        {/* Gallery */}
        <div>
          {/* Main image */}
          <div style={{ aspectRatio: '4/5', background: `linear-gradient(160deg, ${product.tint}12 0%, ${product.tint}28 100%)`, position: 'relative', display: 'grid', placeItems: 'center', marginBottom: 12 }}>
            {onSale && (
              <div style={{ position: 'absolute', top: 20, left: 20 }}>
                <span className="badge badge-sale" style={{ fontSize: 12, padding: '6px 12px' }}>−{savingsPct}% korting</span>
              </div>
            )}
            {product.bestseller && (
              <div style={{ position: 'absolute', top: 20, right: 20 }}>
                <span className="badge badge-bestseller" style={{ fontSize: 11, padding: '6px 10px' }}>Bestseller</span>
              </div>
            )}
            <div style={{ width: '60%', height: '80%', transition: 'transform .4s ease', transform: `scale(${1 + activeImg * 0.05}) rotate(${activeImg * 2 - 3}deg)` }}>
              <BottleSVG shape={product.shape} tint={product.tint} brand={brand?.name} />
            </div>
            <div style={{ position: 'absolute', bottom: 20, right: 20, color: 'var(--ink-3)', fontSize: 11, letterSpacing: '0.06em' }}>
              {activeImg + 1} / 4
            </div>
          </div>
          {/* Horizontal thumbnails */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'nowrap' }}>
            {[0,1,2,3].map(i => (
              <button key={i} onClick={() => setActiveImg(i)}
                style={{
                  flex: 1,
                  aspectRatio: '1',
                  background: `${product.tint}18`,
                  border: activeImg === i ? '2px solid var(--ink)' : '1px solid var(--border)',
                  padding: 0, cursor: 'pointer', display: 'grid', placeItems: 'center',
                  transition: 'border-color .15s ease'
                }}>
                <div style={{ width: '50%', height: '70%' }}>
                  <BottleSVG shape={product.shape} tint={product.tint} brand="" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button onClick={() => onNav('brand', null, null, null, product.brand)}
            style={{ background: 'none', border: 0, padding: 0, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)', cursor: 'pointer', textAlign: 'left', marginBottom: 12 }}>
            {brand?.name} →
          </button>
          <h1 style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.1, marginBottom: 12 }}>{product.name}</h1>
          <div className="row" style={{ gap: 12, marginBottom: 20 }}>
            <div className="stars" style={{ fontSize: 14 }}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5-Math.round(product.rating))}</div>
            <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{product.rating} · {product.reviews} reviews</span>
          </div>

          {/* Price */}
          <div className="row" style={{ alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 32, fontFamily: 'var(--font-display)', color: onSale ? 'var(--sale)' : 'var(--ink)' }}>{window.formatPrice(product.price)}</span>
            {onSale && (
              <>
                <span className="strike text-faint" style={{ fontSize: 18 }}>{window.formatPrice(product.oldPrice)}</span>
                <span style={{ fontSize: 12, color: 'var(--sale)', fontWeight: 500 }}>Je bespaart €{savings}</span>
              </>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 24 }}>
            Incl. BTW · Gratis verzending vanaf €60
          </div>

          {/* Stock */}
          <div className="row" style={{ gap: 8, padding: '12px 14px', background: product.stock <= 5 ? 'var(--sale-bg)' : 'var(--success-bg)', marginBottom: 24, fontSize: 13 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: product.stock <= 5 ? 'var(--sale)' : 'var(--success)', flexShrink: 0 }} />
            {product.stock <= 5 ? (
              <span><strong>Nog {product.stock} op voorraad</strong> · vandaag besteld, morgen bij jou</span>
            ) : (
              <span><strong>Op voorraad</strong> · vandaag besteld voor 22:00 · morgen geleverd</span>
            )}
          </div>

          {/* Size selector */}
          {sizeOptions.length > 1 && (
            <div style={{ marginBottom: 24 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Maat</div>
              <div className="row" style={{ gap: 8 }}>
                {sizeOptions.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    style={{
                      padding: '10px 18px',
                      background: size === s ? 'var(--ink)' : 'var(--bg-elev)',
                      color: size === s ? 'white' : 'var(--ink)',
                      border: '1px solid ' + (size === s ? 'var(--ink)' : 'var(--border-strong)'),
                      fontSize: 13,
                      cursor: 'pointer',
                      fontWeight: 500
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + add */}
          <div className="row" style={{ gap: 12, marginBottom: 12 }}>
            <div className="row-tight" style={{ border: '1px solid var(--ink)', height: 52 }}>
              <button onClick={() => setQty(q => Math.max(1, q-1))} style={{ background: 'none', border: 0, width: 44, height: '100%', fontSize: 18, cursor: 'pointer' }}>−</button>
              <span style={{ minWidth: 28, textAlign: 'center', fontSize: 14, fontWeight: 500 }}>{qty}</span>
              <button onClick={() => setQty(q => q+1)} style={{ background: 'none', border: 0, width: 44, height: '100%', fontSize: 18, cursor: 'pointer' }}>+</button>
            </div>
            <button onClick={handleAdd} className="btn btn-lg" style={{ flex: 1, height: 52, fontSize: 13 }}>
              {addedFeedback ? '✓ Toegevoegd!' : `Voeg toe — ${window.formatPrice(product.price * qty)}`}
            </button>
            <button aria-label="Verlanglijst" style={{ width: 52, height: 52, background: 'var(--bg-elev)', border: '1px solid var(--border-strong)', cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{display:'block', margin:'auto'}}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          {/* Express buy */}
          <button className="btn btn-lg" style={{ background: '#5a31e0', marginBottom: 28 }}>
            <span style={{ fontWeight: 700 }}>Direct kopen</span> met <strong>iDEAL</strong>
          </button>

          {/* Trust grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            {[
              { icon: '🚚', t: 'Gratis verzending', s: 'Vanaf €60' },
              { icon: '↩', t: 'Gratis retour', s: '30 dagen' },
              { icon: '✓', t: '100% origineel', s: 'Geverifieerd' },
            ].map(x => (
              <div key={x.t} className="col" style={{ gap: 2, fontSize: 12 }}>
                <span style={{ fontSize: 18, color: 'var(--accent-deep)' }}>{x.icon}</span>
                <div style={{ fontWeight: 500, color: 'var(--ink)', marginTop: 4 }}>{x.t}</div>
                <div className="text-muted">{x.s}</div>
              </div>
            ))}
          </div>

          {/* Accordion: description, ingredients, usage, shipping */}
          <div style={{ borderTop: '1px solid var(--border)' }}>
            {[
              { id: 'description', label: 'Beschrijving', content: <DescriptionContent product={product} /> },
              { id: 'ingredients', label: 'Belangrijkste ingrediënten', content: <IngredientsContent product={product} /> },
              { id: 'usage', label: 'Hoe te gebruiken', content: <UsageContent product={product} /> },
              { id: 'shipping', label: 'Bezorging & retour', content: <ShippingContent /> },
            ].map(item => (
              <div key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <button onClick={() => setOpenAccordion(o => o === item.id ? null : item.id)}
                  style={{ width: '100%', padding: '18px 0', background: 'none', border: 0, fontSize: 14, fontWeight: 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: 'var(--ink)' }}>
                  {item.label}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                       style={{ transform: openAccordion === item.id ? 'rotate(45deg)' : 'none', transition: 'transform .2s' }}>
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

      {/* Goes well with — routine builder for skincare */}
      {product.category === 'skincare' && goesWith.length > 0 && (
        <RoutineBuilder product={product} suggestions={goesWith} onNav={onNav} onAddToCart={onAddToCart} />
      )}

      {/* Reviews section */}
      <ReviewsSection product={product} />

      {/* Related */}
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container-wide">
          <div className="section-head">
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>Misschien ook iets voor jou</h2>
            <a onClick={() => onNav('brand', null, null, null, product.brand)} style={{ cursor: 'pointer', fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 4 }}>Alle {brand?.name} →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
            {related.map(p => (
              <ProductCard key={p.id} product={p} onClick={() => onNav('pdp', null, p.id)} onAddToCart={onAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {recentlyViewed && recentlyViewed.length > 0 && (
        <section className="section-sm" style={{ paddingTop: 0 }}>
          <div className="container-wide">
            <div className="eyebrow" style={{ marginBottom: 20 }}>Recent bekeken</div>
            <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 8 }}>
              {recentlyViewed.filter(id => id !== productId).slice(0, 6).map(id => {
                const rp = window.findProduct(id);
                if (!rp) return null;
                return (
                  <div key={id} onClick={() => onNav('pdp', null, id)} style={{ minWidth: 180, maxWidth: 180, cursor: 'pointer' }}>
                    <div style={{ aspectRatio: '4/5', background: `${rp.tint}18`, display: 'grid', placeItems: 'center' }}>
                      <div style={{ width: '70%', height: '85%' }}><BottleSVG shape={rp.shape} tint={rp.tint} brand={window.findBrand(rp.brand)?.name} /></div>
                    </div>
                    <div style={{ fontSize: 11, marginTop: 8, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{window.findBrand(rp.brand)?.name}</div>
                    <div style={{ fontSize: 12, marginTop: 4, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{rp.name}</div>
                    <div style={{ fontSize: 13, marginTop: 4, fontWeight: 500 }}>{window.formatPrice(rp.price)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
function DescriptionContent({ product }) {
  const desc = {
    parfum: `Een verfijnde geur die je hele dag meegaat. ${product.name} combineert verzorgde top-tonen met een diepe, blijvende basis. Geschikt voor dagelijks gebruik en perfect als signature scent.`,
    skincare: `${product.name} is een dermatologisch geteste formule, ontwikkeld voor zichtbaar resultaat. De ingrediënten zijn klinisch bewezen en in concentraties die werken — niet meer, niet minder.`,
    haar: `Professionele haarverzorging die in salons gebruikt wordt. ${product.name} versterkt, hydrateert en herstelt het haar van wortel tot punt.`,
  };
  return (
    <div>
      <p>{desc[product.category] || desc.skincare}</p>
      <div style={{ marginTop: 16, padding: 14, background: 'var(--bg-sunken)', fontSize: 13 }}>
        <strong>Productinformatie</strong>
        <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <li><span className="text-muted">Inhoud:</span> {product.size}</li>
          <li><span className="text-muted">Type:</span> {product.sub}</li>
          <li><span className="text-muted">EAN:</span> 87123456{product.id}</li>
          <li><span className="text-muted">Voorraad:</span> {product.stock} stuks</li>
        </ul>
      </div>
    </div>
  );
}

function IngredientsContent({ product }) {
  const known = {
    "Retinol B3 Serum voor een egale teint": [["Retinol", "0,3%", "Vermindert fijne lijntjes en pigmentvlekken"], ["Niacinamide", "4%", "Egaliseert de teint, kalmerend"], ["Glycerine", "—", "Hydraterend, beschermt de huidbarrière"]],
    "Hyalu B5 Suractivated Crème SPF 30": [["Hyaluronzuur", "1.5%", "Diep hydraterend"], ["Vitamine B5", "—", "Herstellend, verzachtend"], ["UV-filters", "SPF30", "Brede UV-A en UV-B bescherming"]],
  };
  const list = known[product.name] || [
    ["Actieve ingrediënten", "—", "Werkzame stof voor zichtbaar resultaat"],
    ["Hydraterende complex", "—", "Houdt de huidbarrière in balans"],
    ["Kalmerende plantextracten", "—", "Verzacht en kalmeert"],
  ];
  return (
    <div>
      {product.category === 'parfum' ? (
        <div>
          <p>Een geurpiramide opgebouwd uit hoofd-, hart- en basisnoten die elkaar versterken.</p>
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[["Topnoten", "Bergamot, mandarijn, peper"], ["Hartnoten", "Lavendel, sage, geranium"], ["Basisnoten", "Sandelhout, vetiver, musk"]].map(([t, s]) => (
              <div key={t} style={{ padding: 14, background: 'var(--bg-sunken)' }}>
                <div className="eyebrow" style={{ marginBottom: 6 }}>{t}</div>
                <div style={{ fontSize: 13 }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px 8px 0', fontWeight: 500, color: 'var(--ink-3)' }}>Ingrediënt</th>
                <th style={{ padding: '8px 12px', fontWeight: 500, color: 'var(--ink-3)' }}>%</th>
                <th style={{ padding: '8px 0', fontWeight: 500, color: 'var(--ink-3)' }}>Functie</th>
              </tr>
            </thead>
            <tbody>
              {list.map(([name, pct, fn]) => (
                <tr key={name} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 12px 12px 0', fontWeight: 500 }}>{name}</td>
                  <td style={{ padding: '12px 12px' }} className="text-muted">{pct}</td>
                  <td style={{ padding: '12px 0' }}>{fn}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <a style={{ display: 'inline-block', marginTop: 12, fontSize: 12, textDecoration: 'underline', cursor: 'pointer' }}>Volledige INCI-lijst →</a>
        </div>
      )}
    </div>
  );
}

function UsageContent({ product }) {
  if (product.category === 'parfum') {
    return (
      <ol style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
        <li>Spray op pulspunten — polsen, nek, achter de oren.</li>
        <li>Niet wrijven — laat opdrogen voor maximale houdbaarheid.</li>
        <li>Bewaar koel en uit direct zonlicht voor langere geurkwaliteit.</li>
      </ol>
    );
  }
  return (
    <ol style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
      <li>Reinig je huid grondig met een milde reiniger.</li>
      <li>Breng een kleine hoeveelheid aan op gezicht en hals.</li>
      <li>Masseer zachtjes in tot het volledig opgenomen is.</li>
      <li>Gebruik dagelijks 's ochtends en/of 's avonds — combineer 's ochtends met SPF.</li>
    </ol>
  );
}

function ShippingContent() {
  return (
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
          <li>Geopende producten retourneren? Neem contact op via de chat.</li>
        </ul>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function RoutineBuilder({ product, suggestions, onNav, onAddToCart }) {
  const [selected, setSelected] = useStatePDP(suggestions.map(s => s.id));
  const items = [product, ...suggestions.filter(s => selected.includes(s.id))];
  const total = items.reduce((sum, p) => sum + p.price, 0);
  const oldTotal = items.reduce((sum, p) => sum + (p.oldPrice || p.price), 0);
  const bundleDiscount = items.length >= 3 ? 0.05 : 0;
  const bundleTotal = total * (1 - bundleDiscount);

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const addAll = () => items.forEach(p => onAddToCart(p, 1));

  return (
    <section style={{ background: 'var(--bg-sunken)', padding: '64px 0', marginTop: 64 }}>
      <div className="container-wide">
        <div className="section-head" style={{ marginBottom: 28 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Bouw je routine</div>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>Bestelt vaak samen met</h2>
          </div>
          {bundleDiscount > 0 && <div className="badge badge-bestseller" style={{ padding: '6px 12px', fontSize: 11 }}>−{Math.round(bundleDiscount * 100)}% bij bundel</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 32, alignItems: 'start' }}>
          {/* Items strip */}
          <div className="row" style={{ gap: 12, flexWrap: 'wrap', alignItems: 'stretch' }}>
            {[product, ...suggestions].map((p, i) => {
              const isCurrent = p.id === product.id;
              const isSel = isCurrent || selected.includes(p.id);
              return (
                <React.Fragment key={p.id}>
                  <div style={{
                    flex: 1, minWidth: 180,
                    background: isSel ? 'white' : 'var(--bg-elev)',
                    border: isSel ? '2px solid var(--accent-deep)' : '1px dashed var(--border-strong)',
                    padding: 16,
                    position: 'relative',
                    cursor: isCurrent ? 'default' : 'pointer',
                    opacity: isSel ? 1 : 0.6,
                    transition: 'all .2s ease'
                  }}
                       onClick={() => !isCurrent && toggle(p.id)}>
                    {isCurrent && <div style={{ position: 'absolute', top: 10, right: 10 }}>
                      <span className="badge" style={{ background: 'var(--accent)', color: 'white', fontSize: 9 }}>Dit product</span>
                    </div>}
                    <div style={{ aspectRatio: '4/5', background: `${p.tint}18`, marginBottom: 12, display: 'grid', placeItems: 'center' }}>
                      <div style={{ width: '70%', height: '85%' }}>
                        <BottleSVG shape={p.shape} tint={p.tint} brand={window.findBrand(p.brand)?.name} />
                      </div>
                    </div>
                    <div className="product-card-brand">{window.findBrand(p.brand)?.name}</div>
                    <div style={{ fontSize: 12, lineHeight: 1.3, marginBottom: 6, minHeight: 32 }}>{p.name.slice(0, 50)}{p.name.length > 50 ? '…' : ''}</div>
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{window.formatPrice(p.price)}</span>
                      {!isCurrent && (
                        <span style={{
                          width: 22, height: 22, borderRadius: '50%',
                          background: isSel ? 'var(--accent)' : 'transparent',
                          color: 'white', display: 'grid', placeItems: 'center',
                          border: isSel ? '2px solid var(--accent)' : '2px solid var(--border-strong)',
                          fontSize: 12
                        }}>{isSel ? '✓' : '+'}</span>
                      )}
                    </div>
                  </div>
                  {i < suggestions.length && (
                    <div style={{ display: 'grid', placeItems: 'center', fontSize: 24, color: 'var(--ink-3)' }}>+</div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Total card */}
          <div style={{ background: 'var(--bg-elev)', padding: 24, border: '1px solid var(--border)' }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Routine totaal</div>
            <div style={{ marginBottom: 8 }}>
              <div className="row" style={{ justifyContent: 'space-between', fontSize: 13 }}>
                <span>{items.length} producten</span>
                <span>{window.formatPrice(total)}</span>
              </div>
              {oldTotal > total && (
                <div className="row" style={{ justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
                  <span>Bespaar (vs. adviesprijs)</span>
                  <span className="text-sale">−{window.formatPrice(oldTotal - total)}</span>
                </div>
              )}
              {bundleDiscount > 0 && (
                <div className="row" style={{ justifyContent: 'space-between', fontSize: 12, color: 'var(--accent-deep)', marginTop: 4 }}>
                  <span>Bundelkorting</span>
                  <span>−{window.formatPrice(total * bundleDiscount)}</span>
                </div>
              )}
            </div>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 500 }}>Totaal</span>
              <span style={{ fontSize: 24, fontFamily: 'var(--font-display)' }}>{window.formatPrice(bundleTotal)}</span>
            </div>
            <button onClick={addAll} className="btn btn-lg" style={{ width: '100%', marginTop: 16 }}>
              Voeg routine toe ({items.length})
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function ReviewsSection({ product }) {
  const dist = [
    { stars: 5, count: Math.round(product.reviews * 0.74) },
    { stars: 4, count: Math.round(product.reviews * 0.18) },
    { stars: 3, count: Math.round(product.reviews * 0.05) },
    { stars: 2, count: Math.round(product.reviews * 0.02) },
    { stars: 1, count: Math.round(product.reviews * 0.01) },
  ];
  const reviews = [
    { name: "Sara V.", verified: true, rating: 5, age: "32", skintype: "Gemengde huid", text: "Echt een topproduct, ik gebruik het nu 6 weken en mijn teint is veel egaler. Geen irritatie ondanks dat ik vrij gevoelig ben.", date: "3 dagen geleden" },
    { name: "Lars de J.", verified: true, rating: 5, age: "28", skintype: "Vette huid", text: "Snelle levering, échte producten (heb het EAN nummer gecheckt). Veel goedkoper dan ICI Paris. Komt zeker terug.", date: "1 week geleden" },
    { name: "Fatima B.", verified: true, rating: 4, age: "45", skintype: "Droge huid", text: "Zachte formule, fijne textuur. Niet zo'n direct effect als ik hoopte maar na een maand wel zichtbaar verschil.", date: "2 weken geleden" },
  ];
  const max = Math.max(...dist.map(d => d.count));

  return (
    <section style={{ padding: '80px 0', borderTop: '1px solid var(--border)', marginTop: 32 }}>
      <div className="container-wide">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Reviews</div>
            <div style={{ fontSize: 56, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{product.rating}</div>
            <div className="stars" style={{ fontSize: 18, marginTop: 4 }}>{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5-Math.round(product.rating))}</div>
            <div className="text-muted" style={{ fontSize: 13, marginTop: 4 }}>Op basis van {product.reviews} reviews</div>
            <button className="btn btn-outline" style={{ marginTop: 24 }}>Schrijf een review</button>
            <div style={{ marginTop: 28 }}>
              {dist.map(d => (
                <div key={d.stars} className="row" style={{ gap: 12, marginBottom: 8, fontSize: 12 }}>
                  <span style={{ width: 16 }}>{d.stars}★</span>
                  <div style={{ flex: 1, height: 6, background: 'var(--bg-sunken)', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, width: `${(d.count / max) * 100}%`, background: 'var(--accent)' }} />
                  </div>
                  <span className="text-muted" style={{ width: 32, textAlign: 'right' }}>{d.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 24 }}>
              <div className="row" style={{ gap: 8 }}>
                {["Alle reviews", "Verified", "Met foto", "5★", "4★"].map((t, i) => (
                  <button key={t} className={`chip ${i === 0 ? 'chip-active' : ''}`}>{t}</button>
                ))}
              </div>
              <select style={{ width: 'auto', padding: '8px 12px', fontSize: 13, background: 'transparent' }}>
                <option>Meest recent</option>
                <option>Hoogste score</option>
                <option>Behulpzaamst</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {reviews.map((r, i) => (
                <div key={i} style={{ padding: '24px 0', borderBottom: i === reviews.length - 1 ? 0 : '1px solid var(--border)' }}>
                  <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
                    <div className="row-tight">
                      <div className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                      {r.verified && <span style={{ marginLeft: 12, fontSize: 11, color: 'var(--success)' }}>✓ Geverifieerde koper</span>}
                    </div>
                    <span className="text-faint" style={{ fontSize: 12 }}>{r.date}</span>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, margin: '0 0 8px', color: 'var(--ink-2)' }}>{r.text}</p>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    <strong style={{ color: 'var(--ink-2)' }}>{r.name}</strong> · {r.age} jaar · {r.skintype}
                  </div>
                </div>
              ))}
            </div>
            <a style={{ display: 'inline-block', marginTop: 24, fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 4, cursor: 'pointer' }}>Toon alle {product.reviews} reviews →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

window.PDP = PDP;
