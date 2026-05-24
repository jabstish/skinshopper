import Link from 'next/link';

const POLICIES = [
  { label: 'Privacybeleid', href: '/policies/privacy-policy' },
  { label: 'Retourbeleid', href: '/policies/refund-policy' },
  { label: 'Verzendbeleid', href: '/policies/shipping-policy' },
  { label: 'Algemene voorwaarden', href: '/policies/terms-of-service' },
];

export default function PolicyLayout({ title, lastUpdated, children }) {
  return (
    <>
      {/* Header */}
      <section style={{ background: 'var(--bg-sunken)', padding: '56px 0 40px', borderBottom: '1px solid var(--border)' }}>
        <div className="container-wide">
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 16, display: 'flex', gap: 8 }}>
            <Link href="/" style={{ color: 'var(--ink-3)' }}>Home</Link>
            <span>/</span>
            <span>{title}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.05, marginBottom: lastUpdated ? 12 : 0 }}>{title}</h1>
          {lastUpdated && <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>Laatst bijgewerkt: {lastUpdated}</p>}
        </div>
      </section>

      <div className="container-wide policy-layout-grid" style={{ padding: '48px 32px 80px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 64, alignItems: 'start' }}>
        {/* Sidebar nav */}
        <aside className="policy-sidebar" style={{ position: 'sticky', top: 120 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Beleid</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {POLICIES.map((p) => (
              <Link key={p.href} href={p.href}
                style={{ fontSize: 14, padding: '8px 12px', color: 'var(--ink-3)', textDecoration: 'none', borderLeft: '2px solid transparent', transition: 'all .15s' }}
                className="policy-nav-link">
                {p.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <article className="policy-content">
          {children}
        </article>
      </div>
    </>
  );
}
