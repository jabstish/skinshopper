/* global React, ProductCard, BottleSVG */
const { useState: useStateBrand, useMemo: useMemoBrand } = React;

function BrandPage({ brandId, onNav, onQuickAdd }) {
  const brand = window.findBrand(brandId);
  if (!brand) return <main style={{ padding: 80, textAlign: 'center' }}>Merk niet gevonden</main>;

  const brandProducts = window.PRODUCTS.filter(p => p.brand === brandId);
  const [activeConcern, setActiveConcern] = useStateBrand(null);

  // Brand-specific concern bucket
  const concernsInBrand = useMemoBrand(() => {
    const set = new Set();
    brandProducts.forEach(p => p.concern?.forEach(c => set.add(c)));
    return [...set];
  }, [brandProducts]);

  const filtered = activeConcern
    ? brandProducts.filter(p => p.concern?.includes(activeConcern))
    : brandProducts;

  const accent = brand.accent || 'var(--accent)';
  const heroBg = brandId === 'la-roche-posay'
    ? 'linear-gradient(135deg, #f4f9fc 0%, #dceaf3 60%, #b3d4e8 100%)'
    : brandId === 'vichy'
    ? 'linear-gradient(135deg, #f0f8fc 0%, #c2e0e8 60%, #7fb8c4 100%)'
    : brandId === 'skinceuticals'
    ? 'linear-gradient(135deg, #f4f4f0 0%, #d8d2c2 60%, #8a7f6b 100%)'
    : brandId === 'lancaster'
    ? 'linear-gradient(135deg, #fff4e8 0%, #fcd5a0 60%, #ee6c1d 100%)'
    : 'linear-gradient(135deg, #f7f3ee 0%, #e3d4c0 60%, #8b6f47 100%)';

  // Brand story
  const story = {
    "la-roche-posay": { tagline: "Aanbevolen door dermatologen", since: "Sinds 1975", country: "Frankrijk", desc: "La Roche-Posay ontwikkelt huidverzorging in samenwerking met dermatologen wereldwijd. Hun thermaal water vormt de basis van elk product." },
    "vichy": { tagline: "Mineralen die de huid voeden", since: "Sinds 1931", country: "Frankrijk", desc: "Vichy combineert vulkanische mineralen uit de bronnen van Vichy met moderne dermatologie. Bekend om Mineral 89 en Neovadiol." },
    "skinceuticals": { tagline: "Klinische skincare, bewezen formules", since: "Sinds 1997", country: "Verenigde Staten", desc: "Door dermatologen ontwikkelde antioxidant serums en actieve formules. Hoog-geconcentreerd en bewezen via klinische studies." },
    "hugo-boss": { tagline: "Vakmanschap in geur", since: "Sinds 1985 (parfums)", country: "Duitsland", desc: "De Hugo Boss parfumcollectie staat voor moderne mannelijkheid en tijdloze elegantie — van BOSS Bottled tot The Scent." },
    "calvin-klein": { tagline: "Minimalisme als signature", since: "Sinds 1968", country: "Verenigde Staten", desc: "Iconische parfums die de tijdgeest vangen — van CK One tot Eternity. Pure, herkenbare composities." },
    "lancaster": { tagline: "Pionier in zonbescherming", since: "Sinds 1946", country: "Monaco", desc: "Lancaster is de uitvinder van de moderne aftersun en pionier in geavanceerde zonbeschermings-technologie." },
    "cerave": { tagline: "Ontwikkeld met dermatologen", since: "Sinds 2005", country: "Verenigde Staten", desc: "Eenvoudige formules met ceramiden die de huidbarrière herstellen. Toegankelijke prijzen, klinische resultaten." },
    "clarins": { tagline: "Botanische schoonheid uit Parijs", since: "Sinds 1954", country: "Frankrijk", desc: "Plantenwetenschap ontmoet luxe huidverzorging. Klinisch effectief, met respect voor de natuur." },
  };
  const s = story[brandId] || { tagline: brand.name, since: "—", country: "—", desc: "" };

  return (
    <main>
      {/* Brand hero */}
      <section style={{ background: heroBg, padding: '0', position: 'relative', overflow: 'hidden' }}>
        <div className="container-wide" style={{ padding: '80px 32px 100px', position: 'relative', zIndex: 2 }}>
          <div className="row" style={{ gap: 8, fontSize: 12, color: 'var(--ink-3)', marginBottom: 24 }}>
            <a onClick={() => onNav('home')} style={{ cursor: 'pointer' }}>Home</a>
            <span>/</span>
            <a onClick={() => onNav('plp', brand.category === 'parfum' ? 'parfum' : 'skincare')} style={{ cursor: 'pointer' }}>{brand.category === 'parfum' ? 'Parfum' : 'Huidverzorging'}</a>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>{brand.name}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Shop het volledige merk</div>
              <h1 style={{ fontSize: 'clamp(64px, 9vw, 140px)', lineHeight: 0.9, fontFamily: 'var(--font-body)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 24 }}>
                {brand.wordmark}
              </h1>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.2, fontStyle: 'italic', maxWidth: 600, marginBottom: 24, color: 'var(--ink-2)' }}>
                "{s.tagline}"
              </p>
              <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6, maxWidth: 540, marginBottom: 32 }}>
                {s.desc}
              </p>
              <div className="row" style={{ gap: 32, fontSize: 12, color: 'var(--ink-3)' }}>
                <div>
                  <div className="eyebrow">{s.since}</div>
                </div>
                <div className="divider-vert" style={{ height: 24 }} />
                <div className="eyebrow">{s.country}</div>
                <div className="divider-vert" style={{ height: 24 }} />
                <div className="eyebrow">{brandProducts.length} producten</div>
              </div>
            </div>

            {/* Featured product */}
            <div style={{ position: 'relative', aspectRatio: '4/5', maxHeight: 480 }}>
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                <div style={{ width: '60%', height: '80%', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.18))' }}>
                  <BottleSVG shape={brandProducts[0]?.shape || 'flacon'} tint={brandProducts[0]?.tint || '#1d8ed4'} brand={brand.name} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand stats */}
      <section style={{ background: 'var(--bg-elev)', padding: '24px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            {[
              ["✦", "100% origineel", "Geverifieerd direct van leverancier"],
              ["★", `${(brandProducts.reduce((s, p) => s + p.rating, 0) / brandProducts.length).toFixed(1)} sterren`, `Op basis van ${brandProducts.reduce((s, p) => s + p.reviews, 0)}+ reviews`],
              ["%", "Tot 35% korting", "Vergeleken met adviesprijs"],
              ["☑", "Snelle levering", "Vandaag besteld, morgen in huis"],
            ].map(([icon, t, s]) => (
              <div key={t} className="row" style={{ gap: 12 }}>
                <span style={{ fontSize: 22, color: 'var(--accent-deep)' }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{t}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Concern filter pills */}
      {concernsInBrand.length > 0 && (
        <section style={{ padding: '40px 0 24px' }}>
          <div className="container-wide">
            <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
              <span className="eyebrow" style={{ marginRight: 12 }}>Shop op huidprobleem:</span>
              <button className={`chip ${activeConcern === null ? 'chip-active' : ''}`} onClick={() => setActiveConcern(null)}>Alles tonen</button>
              {concernsInBrand.map(c => {
                const concern = window.SKIN_CONCERNS.find(x => x.id === c) || { id: c, label: c };
                return (
                  <button key={c} className={`chip ${activeConcern === c ? 'chip-active' : ''}`} onClick={() => setActiveConcern(c)}>{concern.label}</button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      <section style={{ padding: '32px 0 80px' }}>
        <div className="container-wide">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 24 }}>
            <div className="text-muted" style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong> producten
            </div>
            <a onClick={() => onNav('plp', brand.category === 'parfum' ? 'parfum' : 'skincare')} style={{ cursor: 'pointer', fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 4 }}>
              Bekijk alle {brand.category === 'parfum' ? 'parfums' : 'huidverzorging'} →
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, rowGap: 48 }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} onClick={() => onNav('pdp', null, p.id)} onQuickAdd={onQuickAdd} />)}
          </div>
        </div>
      </section>

      {/* Brand world / story split */}
      <section style={{ background: 'var(--bg-sunken)', padding: '80px 0' }}>
        <div className="container-wide" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Het verhaal achter {brand.name}</div>
            <h2 style={{ fontSize: 'clamp(36px, 4vw, 56px)', marginBottom: 20 }}>
              <em style={{ fontStyle: 'italic' }}>{s.tagline}.</em>
            </h2>
            <p style={{ color: 'var(--ink-3)', fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>{s.desc}</p>
            <p style={{ color: 'var(--ink-3)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
              Bij SkinShopper voeren we het volledige {brand.name} assortiment direct van de officiële distributeur — gegarandeerd authentiek, met BTW-bonnen.
            </p>
            <div className="row" style={{ gap: 12 }}>
              <button className="btn">Alle {brand.name} producten</button>
              <button className="btn btn-ghost">Skin advies →</button>
            </div>
          </div>
          <div style={{ aspectRatio: '1/1.1', background: heroBg, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
              <div style={{ width: '40%', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.25))' }}>
                <BottleSVG shape={brandProducts[1]?.shape || 'jar'} tint={brandProducts[1]?.tint || accent} brand={brand.name} />
              </div>
            </div>
            <div style={{ position: 'absolute', top: 24, left: 24 }}>
              <div className="mono">Editorial · {brand.name}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

window.BrandPage = BrandPage;
