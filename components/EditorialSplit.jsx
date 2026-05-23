import Link from 'next/link';

export default function EditorialSplit() {
  return (
    <section style={{ padding: '80px 0', background: 'var(--bg-sunken)' }}>
      <div className="container-wide">
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 0, alignItems: 'stretch', minHeight: 560 }}>
          {/* Left: visual */}
          <div style={{ position: 'relative', background: 'linear-gradient(150deg, #efe6d6 0%, #c9a96e 100%)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 32, left: 32 }}>
              <div className="eyebrow" style={{ color: 'rgba(100,70,30,0.7)' }}>Verhaal · La Roche-Posay</div>
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{
                  width: 160, height: 220,
                  background: 'rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  margin: '0 auto',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 30px 60px rgba(40,20,0,0.2)',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#6b4a2a', letterSpacing: '0.1em', textAlign: 'center', lineHeight: 1.6 }}>
                    LA ROCHE<br />POSAY<br />
                    <span style={{ fontSize: 11, opacity: 0.7 }}>Retinol B3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: text */}
          <div style={{ background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(32px, 5vw, 72px)' }}>
            <div className="eyebrow" style={{ marginBottom: 24, color: 'var(--accent-deep)' }}>Dermatologisch · Bewezen</div>
            <h2 style={{ fontSize: 'clamp(32px, 3.5vw, 52px)', marginBottom: 24 }}>
              Retinol B3 — <em style={{ fontStyle: 'italic' }}>de gouden standaard</em> voor een egale teint
            </h2>
            <p style={{ color: 'var(--ink-3)', fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
              Aanbevolen door dermatologen wereldwijd. Klinisch bewezen om fijne lijntjes te verminderen
              en pigmentvlekken zichtbaar te vervagen in 8 weken.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                '0,3% pure retinol + 4% niacinamide',
                'Getest op gevoelige huid',
                'Vrij van parabenen en parfum',
              ].map((b) => (
                <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'var(--accent-soft)',
                    display: 'grid', placeItems: 'center',
                    color: 'var(--accent-deep)', fontSize: 10, flexShrink: 0,
                  }}>✓</span>
                  {b}
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/shop/huidverzorging" className="btn btn-lg">Bekijk huidverzorging</Link>
              <Link href="/brand/la-roche-posay" className="btn btn-lg btn-outline">Shop La Roche-Posay</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
