'use client';
import Link from 'next/link';
import { useState, useRef, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import AnnouncementBar from './AnnouncementBar';

const NAV = [
  { label: 'Parfum', href: '/shop/parfum' },
  { label: 'Huidverzorging', href: '/shop/huidverzorging' },
  { label: 'Zonbescherming', href: '/shop/zonbescherming' },
  { label: 'Sale', href: '/shop/sale', sale: true },
];

export default function Header() {
  const { cartCount, setCartOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchTimer = useRef(null);

  const handleSearch = (q) => {
    setSearchQ(q);
    clearTimeout(searchTimer.current);
    if (!q.trim()) { setSearchResults([]); return; }
    searchTimer.current = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSearchResults(data.products ?? []);
    }, 280);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
      <AnnouncementBar />

      <div className="container-wide" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '18px 32px', gap: 24 }}>
        {/* Left */}
        <div className="row" style={{ gap: 16 }}>
          <button className="show-mobile" aria-label="Menu" onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 0, padding: 4, cursor: 'pointer', display: 'none' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
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
        <Link href="/" style={{ textAlign: 'center', display: 'block' }}>
          <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: '0.04em', fontFamily: 'var(--font-body)' }}>SKINSHOPPER</div>
        </Link>

        {/* Right */}
        <div className="row" style={{ gap: 20, justifyContent: 'flex-end' }}>
          <button onClick={() => setCartOpen(true)}
            style={{ background: 'none', border: 0, padding: 4, color: 'var(--ink)', position: 'relative', cursor: 'pointer' }}
            aria-label="Winkelmand">
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

      {/* Desktop nav */}
      <nav className="desktop-nav" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container-wide" style={{ display: 'flex', justifyContent: 'center', gap: 40, padding: '14px 32px' }}>
          <Link href="/" style={{ fontSize: 13, letterSpacing: '0.04em', fontWeight: 500, color: 'var(--ink-3)', paddingBottom: 4, borderBottom: '1.5px solid transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.borderBottomColor = 'var(--ink)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ink-3)'; e.currentTarget.style.borderBottomColor = 'transparent'; }}>
            Home
          </Link>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}
              style={{ fontSize: 13, letterSpacing: '0.04em', fontWeight: 500, color: item.sale ? 'var(--sale)' : 'var(--ink-3)', paddingBottom: 4, borderBottom: '1.5px solid transparent', transition: 'color .15s ease, border-color .15s ease' }}
              onMouseEnter={(e) => { if (!item.sale) { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.borderBottomColor = 'var(--ink)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.color = item.sale ? 'var(--sale)' : 'var(--ink-3)'; e.currentTarget.style.borderBottomColor = 'transparent'; }}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Search overlay */}
      {searchOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, animation: 'fadeBackdrop .2s ease' }}>
          <div onClick={() => { setSearchOpen(false); setSearchQ(''); }} style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,14,0.4)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--bg)', boxShadow: 'var(--shadow-lg)', padding: '28px 0', maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="container-wide">
              <div className="row" style={{ borderBottom: '2px solid var(--ink)', paddingBottom: 12 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
                <input
                  autoFocus
                  value={searchQ}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Zoek op product, merk of ingrediënt..."
                  style={{ flex: 1, border: 0, fontSize: 22, fontFamily: 'var(--font-display)', padding: '4px 12px', background: 'transparent', outline: 'none' }}
                />
                <button onClick={() => { setSearchOpen(false); setSearchQ(''); }}
                  style={{ background: 'none', border: 0, fontSize: 12, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>
                  Sluiten
                </button>
              </div>

              {searchResults.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <div className="eyebrow" style={{ marginBottom: 16 }}>{searchResults.length} resultaten</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                    {searchResults.map((p) => (
                      <Link key={p.handle} href={`/product/${p.handle}`}
                        onClick={() => { setSearchOpen(false); setSearchQ(''); }}
                        style={{ display: 'flex', gap: 12, padding: 12, background: 'var(--bg-sunken)', textDecoration: 'none', color: 'inherit' }}>
                        {p.image && (
                          <div style={{ width: 56, height: 56, background: 'var(--bg-elev)', flexShrink: 0, position: 'relative' }}>
                            <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                          </div>
                        )}
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{p.vendor}</div>
                          <div style={{ fontSize: 13, lineHeight: 1.3 }}>{p.title.slice(0, 50)}</div>
                          <div style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>
                            {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: p.currencyCode || 'EUR' }).format(p.price)}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile nav */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div onClick={() => setMobileOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,14,0.45)' }} />
          <aside style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 'min(380px, 92vw)', background: 'var(--bg)', overflowY: 'auto' }}>
            <div className="row" style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 900, fontSize: 18 }}>SKINSHOPPER</div>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 0, cursor: 'pointer' }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m4 4 14 14m0-14L4 18" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div>
              {[{ label: 'Home', href: '/' }, ...NAV].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  style={{ display: 'block', padding: '16px 20px', borderBottom: '1px solid var(--border)', fontSize: 16, fontWeight: 500, color: item.sale ? 'var(--sale)' : 'var(--ink)', textDecoration: 'none' }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
