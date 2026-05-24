import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: '#c7c1b5', marginTop: 80 }}>
      <div className="container-wide" style={{ padding: '80px 32px 32px' }}>
        {/* USP strip */}
        <div className="footer-usp-grid" style={{ paddingBottom: 56, borderBottom: '1px solid #2a2622', marginBottom: 56 }}>
          {[
            ['Gratis verzending', 'Vanaf €60 — voor 22:00 besteld, morgen in huis'],
            ['30 dagen retour', 'Niet tevreden? Kosteloos retour'],
            ['100% origineel', 'Geverifieerde leveranciers, echte producten'],
            ['Expert advies', 'Door dermatologen samengesteld assortiment'],
          ].map(([t, s]) => (
            <div key={t}>
              <div style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 6 }}>{t}</div>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>{s}</div>
            </div>
          ))}
        </div>

        <div className="footer-links-grid">
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 900, fontSize: 22, color: 'white', letterSpacing: '0.04em', marginBottom: 12 }}>SKINSHOPPER</div>
            <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 320 }}>
              Premium parfum en huidverzorging van de merken die je kent. Slimme prijzen, eerlijke uitverkoop, snelle levering.
            </p>
          </div>

          {[
            ['Shop', [
              { label: 'Parfum', href: '/shop/parfum' },
              { label: 'Huidverzorging', href: '/shop/huidverzorging' },
              { label: 'Zonbescherming', href: '/shop/zonbescherming' },
              { label: 'Sale', href: '/shop/sale' },
            ]],
            ['Merken', [
              { label: 'Hugo Boss', href: '/brand/hugo-boss' },
              { label: 'Calvin Klein', href: '/brand/calvin-klein' },
              { label: 'La Roche-Posay', href: '/brand/la-roche-posay' },
              { label: 'Vichy', href: '/brand/vichy' },
              { label: 'SkinCeuticals', href: '/brand/skinceuticals' },
            ]],
            ['Info', [
              { label: 'Over ons', href: '/contact' },
              { label: 'Contact', href: '/contact' },
              { label: 'Bezorging', href: '/policies/shipping-policy' },
              { label: 'Retour', href: '/policies/refund-policy' },
              { label: 'Privacy', href: '/policies/privacy-policy' },
            ]],
          ].map(([title, items]) => (
            <div key={title}>
              <div className="eyebrow" style={{ color: 'white', marginBottom: 16 }}>{title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                {items.map((item) => (
                  <Link key={item.label} href={item.href} style={{ color: '#c7c1b5', textDecoration: 'none' }}>{item.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="footer-bottom" style={{ borderTop: '1px solid #2a2622', marginTop: 56, paddingTop: 24 }}>
          <div>© 2026 SkinShopper — Alle rechten voorbehouden</div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/policies/privacy-policy" style={{ color: '#8a857a' }}>Privacy</Link>
            <Link href="/policies/refund-policy" style={{ color: '#8a857a' }}>Retourbeleid</Link>
            <Link href="/policies/shipping-policy" style={{ color: '#8a857a' }}>Verzendbeleid</Link>
            <Link href="/policies/terms-of-service" style={{ color: '#8a857a' }}>Algemene voorwaarden</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
