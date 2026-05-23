/* global React, BottleSVG, ProductCard */
const { useState: useStateHome, useEffect: useEffectHome, useRef: useRefHome } = React;

function Home({ onNav, onQuickAdd }) {
  return (
    <main>
      <HeroEditorial onNav={onNav} />
      <CategoryTiles onNav={onNav} />
      <SkinConcernFinder onNav={onNav} />
      <BestsellersGrid onNav={onNav} onQuickAdd={onQuickAdd} />
      <EditorialSplit onNav={onNav} />
      <BrandsStrip onNav={onNav} />
      <ReviewsBlock />
      <Newsletter />
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero — editorial campaign with subtle text overlay
// ─────────────────────────────────────────────────────────────
function HeroEditorial({ onNav }) {
  return (
    <section className="hero-section" style={{ position: 'relative', background: 'var(--bg-sunken)', overflow: 'hidden' }}>
      <div className="hero-grid" style={{ position: 'relative', minHeight: 'min(720px, 78vh)', display: 'grid', gridTemplateColumns: '1.1fr 1fr' }}>
        {/* Left: editorial text */}
        <div className="hero-text">
          <div className="eyebrow" style={{ marginBottom: 24 }}>Lente collectie · 2026</div>
          <h1 className="hero-h1" style={{ lineHeight: 0.95, marginBottom: 28, letterSpacing: '-0.02em' }}>
            Skincare met<br />
            <em style={{ fontStyle: 'italic', color: 'var(--accent-deep)' }}>kennis</em>,<br />
            geuren met<br />
            <em style={{ fontStyle: 'italic', color: 'var(--accent-deep)' }}>karakter</em>.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--ink-3)', maxWidth: 440, marginBottom: 40 }}>
            Authentieke producten van de merken die je vertrouwt — La Roche-Posay, Vichy, SkinCeuticals, Hugo Boss. Tot 35% korting deze week.
          </p>
          <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
            <button className="btn btn-lg" onClick={() => onNav('plp', 'skincare')}>Shop huidverzorging</button>
            <button className="btn btn-lg btn-outline" onClick={() => onNav('plp', 'parfum')}>Shop parfum</button>
          </div>

          {/* Mini trust stack */}
          <div className="row" style={{ gap: 24, marginTop: 56, color: 'var(--ink-3)', fontSize: 12, flexWrap: 'wrap' }}>
            <div className="row-tight" style={{ gap: 8 }}>
              <div className="stars">★★★★★</div>
              <span><strong style={{ color: 'var(--ink)' }}>4.8</strong> · 1.247 reviews</span>
            </div>
            <div>Trustpilot · ★ 4.7</div>
          </div>
        </div>

        {/* Right: editorial image placeholder */}
        <div style={{ position: 'relative', background: 'linear-gradient(140deg, #efe4d2 0%, #d4b896 50%, #8b6f47 100%)' }}>
          {/* Floating product silhouette */}
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
            <div style={{ width: '55%', maxWidth: 420, aspectRatio: '3/4', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, transform: 'rotate(-8deg)', filter: 'drop-shadow(0 30px 60px rgba(40,20,0,0.3))' }}>
                <BottleSVG shape="flacon" tint="#c9a05a" brand="" />
              </div>
              <div style={{ position: 'absolute', bottom: '-10%', left: '-20%', width: '55%', transform: 'rotate(12deg)', opacity: 0.7, filter: 'drop-shadow(0 20px 40px rgba(40,20,0,0.25))' }}>
                <BottleSVG shape="jar" tint="#a07c4e" brand="" />
              </div>
              <div style={{ position: 'absolute', top: '5%', right: '-22%', width: '40%', transform: 'rotate(8deg)', opacity: 0.8, filter: 'drop-shadow(0 20px 40px rgba(40,20,0,0.25))' }}>
                <BottleSVG shape="dropper" tint="#6b5535" brand="" />
              </div>
            </div>
          </div>
          {/* corner label */}
          <div style={{ position: 'absolute', top: 32, right: 32, color: 'rgba(255,255,255,0.85)' }}>
            <div className="mono" style={{ marginBottom: 4 }}>Editorial · 01</div>
            <div className="mono">SS · 26</div>
          </div>
          <div style={{ position: 'absolute', bottom: 32, right: 32, padding: '12px 20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)', cursor: 'pointer' }}
               onClick={() => onNav('plp', 'sale')}>
            <div className="mono" style={{ color: 'var(--sale)' }}>Sale · Bekijk alle aanbiedingen →</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Category tiles
// ─────────────────────────────────────────────────────────────
function CategoryTiles({ onNav }) {
  const tiles = [
    { id: "parfum", label: "Parfum", count: "20 producten", tint1: "#7a1840", tint2: "#3a0e22", shape: "flacon" },
    { id: "skincare", label: "Huidverzorging", count: "44 producten", tint1: "#dceaf3", tint2: "#1d8ed4", shape: "dropper" },
    { id: "zonbescherming", label: "Zonbescherming", count: "8 producten", tint1: "#fcd5a0", tint2: "#ef7d27", shape: "tube" },
    { id: "haar", label: "Haar", count: "2 producten", tint1: "#e3d0b8", tint2: "#a07c4e", shape: "flacon" },
    { id: "sale", label: "Sale −35%", count: "Aanbiedingen", tint1: "#fbecf0", tint2: "#8b1e3f", shape: "jar" },
  ];

  return (
    <section className="section">
      <div className="container-wide">
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Shop per categorie</div>
            <h2>Ontdek alles wat we doen</h2>
          </div>
          <a onClick={() => onNav('plp', 'skincare')} style={{ cursor: 'pointer', fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 4 }}>Alle categorieën →</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {tiles.map(t => (
            <div key={t.id} onClick={() => onNav('plp', t.id)}
                 style={{ position: 'relative', aspectRatio: '4/5', background: `linear-gradient(160deg, ${t.tint1} 0%, ${t.tint2} 100%)`, cursor: 'pointer', overflow: 'hidden', transition: 'transform .3s ease' }}
                 onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.01)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                <div style={{ width: '55%', height: '70%', opacity: 0.4, filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.2))' }}>
                  <BottleSVG shape={t.shape} tint={t.tint2} brand="" />
                </div>
              </div>
              <div style={{ position: 'absolute', inset: 'auto 0 0 0', padding: 20, color: 'white' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, lineHeight: 1.1 }}>{t.label}</div>
                <div style={{ fontSize: 11, marginTop: 4, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Skin concern finder — mini "what are you looking for" quiz
// ─────────────────────────────────────────────────────────────
function SkinConcernFinder({ onNav }) {
  const [selected, setSelected] = useStateHome(null);
  const concerns = window.SKIN_CONCERNS;

  const findResults = (cid) => {
    setSelected(cid);
    // soft-jump to PLP filtered
    setTimeout(() => onNav('plp', 'skincare', null, cid), 400);
  };

  return (
    <section style={{ background: 'var(--bg-sunken)', padding: '80px 0' }}>
      <div className="container-wide">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Vind jouw routine</div>
            <h2 style={{ fontSize: 'clamp(36px, 4vw, 56px)', marginBottom: 16 }}>Wat is jouw <em style={{ fontStyle: 'italic', color: 'var(--accent-deep)' }}>huidprobleem</em>?</h2>
            <p style={{ color: 'var(--ink-3)', fontSize: 15, lineHeight: 1.55, marginBottom: 20 }}>
              Kies wat het meest van toepassing is — we tonen producten die dermatologisch getest en bewezen zijn.
            </p>
            <a style={{ fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 4, cursor: 'pointer' }}>Doe de uitgebreide skin-quiz →</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {concerns.map(c => (
              <button key={c.id} onClick={() => findResults(c.id)}
                style={{
                  padding: '24px 16px',
                  background: selected === c.id ? 'var(--ink)' : 'var(--bg-elev)',
                  color: selected === c.id ? 'white' : 'var(--ink)',
                  border: '1px solid var(--border)',
                  borderRadius: 0,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  alignItems: 'flex-start',
                  minHeight: 120
                }}
                onMouseEnter={e => { if (selected !== c.id) e.currentTarget.style.background = 'white'; }}
                onMouseLeave={e => { if (selected !== c.id) e.currentTarget.style.background = 'var(--bg-elev)'; }}>
                <span style={{ fontSize: 28, fontFamily: 'var(--font-display)', color: selected === c.id ? 'var(--accent-soft)' : 'var(--accent)' }}>{c.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Bestsellers grid (with tabs)
// ─────────────────────────────────────────────────────────────
function BestsellersGrid({ onNav, onQuickAdd }) {
  const [tab, setTab] = useStateHome('all');
  const tabs = [
    { id: 'all', label: 'Alle bestsellers' },
    { id: 'parfum', label: 'Parfum' },
    { id: 'skincare', label: 'Skincare' },
  ];

  const items = window.PRODUCTS.filter(p => p.bestseller && (tab === 'all' || p.category === tab)).slice(0, 8);

  return (
    <section className="section">
      <div className="container-wide">
        <div className="section-head" style={{ marginBottom: 28 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Wat anderen kopen</div>
            <h2>Bestsellers deze week</h2>
          </div>
          <div className="row" style={{ gap: 8 }}>
            {tabs.map(t => (
              <button key={t.id} className={`chip ${tab === t.id ? 'chip-active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
          {items.map(p => (
            <ProductCard key={p.id} product={p}
              onClick={() => onNav('pdp', null, p.id)}
              onQuickAdd={onQuickAdd} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Editorial split — story for one brand/product
// ─────────────────────────────────────────────────────────────
function EditorialSplit({ onNav }) {
  return (
    <section style={{ padding: '80px 0', background: 'var(--bg-sunken)' }}>
      <div className="container-wide">
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 0, alignItems: 'stretch', minHeight: 600 }}>
          <div style={{ position: 'relative', background: 'linear-gradient(150deg, #efe6d6 0%, #c9a96e 100%)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
              <div style={{ width: '50%', maxWidth: 320, filter: 'drop-shadow(0 30px 60px rgba(40,20,0,0.25))' }}>
                <BottleSVG shape="dropper" tint="#a8324a" brand="LA ROCHE" />
              </div>
            </div>
            <div style={{ position: 'absolute', top: 32, left: 32 }}>
              <div className="mono">Verhaal · La Roche-Posay</div>
            </div>
          </div>
          <div className="editorial-split-text" style={{ background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="eyebrow" style={{ marginBottom: 24, color: 'var(--accent-deep)' }}>Dermatologisch · Bewezen</div>
            <h2 style={{ fontSize: 'clamp(36px, 4vw, 56px)', marginBottom: 24 }}>
              Retinol B3 — <em style={{ fontStyle: 'italic' }}>de gouden standaard</em> voor een egale teint
            </h2>
            <p style={{ color: 'var(--ink-3)', fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
              Aanbevolen door dermatologen wereldwijd. Klinisch bewezen om fijne lijntjes te verminderen en pigmentvlekken zichtbaar te vervagen in 8 weken.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {["0,3% pure retinol + 4% niacinamide","Getest op gevoelige huid","Vrij van parabenen en parfum"].map(b => (
                <li key={b} className="row" style={{ gap: 10, fontSize: 14 }}>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--accent-soft)', display: 'grid', placeItems: 'center', color: 'var(--accent-deep)', fontSize: 10 }}>✓</span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="row" style={{ gap: 16, marginBottom: 24, alignItems: 'baseline' }}>
              <div style={{ fontSize: 32, fontFamily: 'var(--font-display)' }}>€37,72</div>
              <div className="strike text-faint" style={{ fontSize: 16 }}>€45,45</div>
              <div className="badge badge-sale">−17%</div>
            </div>
            <div className="row" style={{ gap: 12 }}>
              <button className="btn btn-lg" onClick={() => onNav('pdp', null, 's01')}>Bekijk dit product</button>
              <button className="btn btn-lg btn-outline" onClick={() => onNav('brand', null, null, null, 'la-roche-posay')}>Shop La Roche-Posay</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Brands strip
// ─────────────────────────────────────────────────────────────
function BrandsStrip({ onNav }) {
  const brands = window.BRANDS;
  return (
    <section className="section-sm">
      <div className="container-wide">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="eyebrow">Originele producten van</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, alignItems: 'stretch' }}>
          {brands.map(b => (
            <button key={b.id} onClick={() => onNav('brand', null, null, null, b.id)}
              style={{
                padding: '28px 12px',
                background: 'var(--bg-elev)',
                border: '1px solid var(--border)',
                borderRadius: 0,
                cursor: 'pointer',
                transition: 'all .15s ease',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.06em',
                color: 'var(--ink)',
                minHeight: 80
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-elev)'; e.currentTarget.style.color = 'var(--ink)'; }}>
              {b.wordmark}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Reviews block
// ─────────────────────────────────────────────────────────────
function ReviewsBlock() {
  const reviews = [
    { name: "Lisa V.", verified: true, rating: 5, text: "Snelle levering en het product is 100% origineel. Echt veel goedkoper dan bij Douglas of ICI Paris. Ik bestel hier blijvend.", product: "La Roche-Posay Retinol B3", days: "2 dagen geleden" },
    { name: "Mohammed K.", verified: true, rating: 5, text: "Ik was eerst sceptisch over de prijzen maar de doos kwam keurig verpakt aan. Hugo Boss Bottled — zelfde geur als bij de boetiek.", product: "Boss Bottled Eau de Parfum", days: "5 dagen geleden" },
    { name: "Anouk de B.", verified: true, rating: 4, text: "Goede deal op Vichy Mineral 89. Mijn moeder gebruikt hetzelfde dus we bestellen samen — gratis verzending was meegenomen.", product: "Vichy Minéral 89", days: "1 week geleden" },
  ];

  return (
    <section className="section">
      <div className="container-wide">
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Vertrouwd door 12.000+ klanten</div>
            <h2>Wat onze klanten zeggen</h2>
          </div>
          <div className="row" style={{ gap: 16 }}>
            <div className="row-tight">
              <div className="stars" style={{ fontSize: 16 }}>★★★★★</div>
              <span style={{ marginLeft: 8, fontSize: 14 }}><strong>4.8</strong> · 1.247 reviews</span>
            </div>
            <div className="divider-vert" style={{ height: 24 }} />
            <div style={{ fontSize: 13 }}>★ Trustpilot · 4.7</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ padding: 28, background: 'var(--bg-elev)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                <div className="mono text-faint" style={{ textTransform: 'none', letterSpacing: 0 }}>{r.days}</div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, color: 'var(--ink-2)' }}>"{r.text}"</p>
              <div style={{ marginTop: 'auto' }}>
                <div className="row-tight" style={{ fontSize: 13, fontWeight: 500 }}>
                  {r.name}
                  {r.verified && (
                    <span style={{ marginLeft: 8, color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3 5 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z" /></svg>
                      Geverifieerd
                    </span>
                  )}
                </div>
                <div className="text-faint" style={{ fontSize: 11, marginTop: 2 }}>Over: {r.product}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Newsletter
// ─────────────────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useStateHome("");
  const [submitted, setSubmitted] = useStateHome(false);

  return (
    <section style={{ background: 'var(--accent-soft)', padding: '80px 0' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: 720, padding: '0 var(--pad-x)' }}>
        <div className="eyebrow" style={{ marginBottom: 16, color: 'var(--accent-deep)' }}>De nieuwsbrief</div>
        <h2 style={{ fontSize: 'clamp(36px, 4vw, 56px)', marginBottom: 20 }}>10% korting<br/>op je eerste bestelling</h2>
        <p style={{ color: 'var(--ink-3)', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
          Wekelijks de beste deals, nieuwe drops en huidverzorging tips — geen spam.
        </p>
        {submitted ? (
          <div style={{ padding: 20, background: 'var(--bg-elev)', display: 'inline-block' }}>
            <div className="row-tight" style={{ gap: 12, color: 'var(--success)' }}>
              <span style={{ fontSize: 22 }}>✓</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 500, color: 'var(--ink)' }}>Yes, je staat erop!</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>Check je inbox voor de kortingscode.</div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} style={{ display: 'flex', maxWidth: 480, margin: '0 auto', gap: 0 }}>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="jouw@email.nl" style={{ flex: 1, padding: '16px 18px', fontSize: 15, borderRight: 0 }} />
            <button type="submit" className="btn btn-lg" style={{ borderRadius: 0 }}>Aanmelden</button>
          </form>
        )}
        <div style={{ fontSize: 11, marginTop: 12, color: 'var(--ink-3)' }}>Geen zorgen — je kunt je altijd weer uitschrijven.</div>
      </div>
    </section>
  );
}

window.Home = Home;
