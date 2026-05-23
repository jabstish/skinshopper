'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import AnnouncementBar from './AnnouncementBar';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  {
    label: 'Parfum',
    href: '/shop/parfum',
    collection: 'parfum',
    subcategories: [
      { label: 'Damesparfum', href: '/shop/parfum' },
      { label: 'Herenparfum', href: '/shop/parfum' },
      { label: 'Unisex', href: '/shop/parfum' },
      { label: 'Aftershave', href: '/shop/parfum' },
    ],
    brands: [
      { name: 'HUGO BOSS', handle: 'hugo-boss', count: 14 },
      { name: 'Calvin Klein', handle: 'calvin-klein', count: 10 },
      { name: 'Gucci', handle: 'gucci', count: 6 },
    ],
    tip: {
      label: 'TIP',
      title: 'Vind jouw signature',
      desc: 'Hoe sterker het percentage geuressence, hoe langer de geur op je huid blijft. Eau de Parfum gaat 6-8u mee, Eau de Toilette 3-4u.',
      link: { text: 'Geur-gids →', href: '/shop/parfum' },
    },
  },
  {
    label: 'Huidverzorging',
    href: '/shop/huidverzorging',
    collection: 'huidverzorging',
    subcategories: [
      { label: 'Reiniger', href: '/shop/huidverzorging' },
      { label: 'Serum', href: '/shop/huidverzorging' },
      { label: 'Dagcrème', href: '/shop/huidverzorging' },
      { label: 'Oogverzorging', href: '/shop/huidverzorging' },
    ],
    brands: [
      { name: 'LA ROCHE-POSAY', handle: 'la-roche-posay', count: 18 },
      { name: 'SkinCeuticals', handle: 'skinceuticals', count: 13 },
      { name: 'Vichy', handle: 'vichy', count: 11 },
      { name: 'Lancaster', handle: 'lancaster', count: 5 },
    ],
    tip: {
      label: 'TIP',
      title: 'Bouw je routine',
      desc: 'Reiniger → serum → dagcrème → SPF. Combineer in deze volgorde voor zichtbaar resultaat in 4 weken.',
      link: { text: 'Huid-quiz →', href: '/shop/huidverzorging' },
    },
  },
  {
    label: 'Zonbescherming',
    href: '/shop/zonbescherming',
    collection: 'zonnebrand-creme',
    subcategories: [
      { label: 'SPF 30', href: '/shop/zonbescherming' },
      { label: 'SPF 50+', href: '/shop/zonbescherming' },
      { label: 'Gezicht', href: '/shop/zonbescherming' },
      { label: 'Aftersun', href: '/shop/zonbescherming' },
    ],
    brands: [
      { name: 'LANCASTER', handle: 'lancaster', count: 5 },
      { name: 'LA ROCHE-POSAY', handle: 'la-roche-posay', count: 18 },
      { name: 'Vichy', handle: 'vichy', count: 11 },
    ],
    tip: {
      label: 'TIP',
      title: 'Bescherm dagelijks',
      desc: 'SPF50 voor gezicht, SPF30 voor lichaam — ook bij bewolking. UV-straling dringt door wolken en glas.',
      link: { text: 'Zon-gids →', href: '/shop/zonbescherming' },
    },
  },
  {
    label: 'Sale',
    href: '/shop/sale',
    sale: true,
    collection: 'sale',
    subcategories: [
      { label: 'Tot −20%', href: '/shop/sale' },
      { label: 'Tot −30%', href: '/shop/sale' },
      { label: 'Tot −35%', href: '/shop/sale' },
      { label: 'Laatste stuks', href: '/shop/sale' },
    ],
    brands: [
      { name: 'HUGO BOSS', handle: 'hugo-boss', count: 10 },
      { name: 'Calvin Klein', handle: 'calvin-klein', count: 6 },
      { name: 'LA ROCHE-POSAY', handle: 'la-roche-posay', count: 7 },
      { name: 'Vichy', handle: 'vichy', count: 3 },
      { name: 'SkinCeuticals', handle: 'skinceuticals', count: 4 },
      { name: 'LANCASTER', handle: 'lancaster', count: 1 },
    ],
    tip: {
      label: 'TIP',
      title: 'Tot 35% korting',
      desc: 'Eerlijke vergelijking — adviesprijs staat altijd naast onze prijs. 100% authentiek, gewoon goedkoper.',
      link: { text: 'Shop alle sale →', href: '/shop/sale' },
    },
  },
];

const MOBILE_LINKS = [
  { label: 'Account', icon: 'user' },
  { label: 'Verlanglijst', icon: 'heart' },
  { label: 'Volg je bestelling', icon: 'package' },
  { label: 'Contact', icon: 'chat' },
];

export default function Header() {
  const { cartCount, setCartOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeNav, setActiveNav] = useState(null);
  const [featuredCache, setFeaturedCache] = useState({});
  const [accountOpen, setAccountOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const closeTimer = useRef(null);
  const searchTimer = useRef(null);

  const openMenu = (item) => {
    clearTimeout(closeTimer.current);
    if (!item.collection) { setActiveNav(null); return; }
    setActiveNav(item.label);
    if (item.collection && !featuredCache[item.collection]) {
      fetch(`/api/featured?collection=${item.collection}&limit=4`)
        .then((r) => r.json())
        .then((d) => setFeaturedCache((prev) => ({ ...prev, [item.collection]: d.products ?? [] })))
        .catch(() => {});
    }
  };

  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveNav(null), 150);
  };
  const cancelClose = () => clearTimeout(closeTimer.current);
  const closeMenu = () => { clearTimeout(closeTimer.current); setActiveNav(null); };

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

  const activeItem = NAV_ITEMS.find((i) => i.label === activeNav);
  const activeProducts = activeItem?.collection ? (featuredCache[activeItem.collection] ?? []) : [];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg)', borderBottom: activeNav ? 'none' : '1px solid var(--border)' }}>
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
        <div className="row" style={{ gap: 18, justifyContent: 'flex-end' }}>
          <button onClick={() => setAccountOpen(true)} className="hide-mobile"
            style={{ background: 'none', border: 0, fontSize: 13, color: 'var(--ink-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
            Account
          </button>
          <button onClick={() => setWishlistOpen(true)}
            style={{ background: 'none', border: 0, padding: 4, color: 'var(--ink-3)', cursor: 'pointer' }} aria-label="Verlanglijst">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button onClick={() => setCartOpen(true)}
            style={{ background: 'none', border: 0, padding: 4, color: 'var(--ink)', position: 'relative', cursor: 'pointer' }} aria-label="Winkelmand">
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
      <nav className="desktop-nav" style={{ borderTop: '1px solid var(--border)', borderBottom: activeNav ? '1px solid var(--border)' : 'none' }}>
        <div className="container-wide" style={{ display: 'flex', justifyContent: 'center', gap: 40, padding: '14px 32px' }}>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.href}
              onMouseEnter={() => openMenu(item)}
              onMouseLeave={scheduleClose}
              style={{ position: 'relative' }}
            >
              <Link href={item.href} onClick={closeMenu}
                style={{
                  fontSize: 13, letterSpacing: '0.04em', fontWeight: 500,
                  color: item.sale ? 'var(--sale)' : activeNav === item.label ? 'var(--ink)' : 'var(--ink-3)',
                  paddingBottom: 4,
                  borderBottom: '1.5px solid ' + (activeNav === item.label ? (item.sale ? 'var(--sale)' : 'var(--ink)') : 'transparent'),
                  transition: 'color .15s ease, border-color .15s ease',
                  display: 'block',
                }}>
                {item.label}
              </Link>
            </div>
          ))}
        </div>
      </nav>

      {/* Mega menu */}
      {activeNav && activeItem?.collection && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'var(--bg)',
            borderTop: '1px solid var(--border)',
            borderBottom: '2px solid var(--border)',
            boxShadow: '0 20px 40px rgba(20,14,4,0.10)',
            zIndex: 49,
          }}>
          <div className="container-wide" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48, padding: '32px 32px 36px' }}>

            {/* Col 1: Featured products */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div className="eyebrow">Uitgelicht</div>
                <Link href={activeItem.href} onClick={closeMenu}
                  style={{ fontSize: 12, textDecoration: 'underline', textUnderlineOffset: 4, color: 'var(--ink-3)' }}>
                  Bekijk alles →
                </Link>
              </div>
              {activeProducts.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {activeProducts.map((p) => (
                    <Link key={p.id} href={`/product/${p.handle}`} onClick={closeMenu}
                      style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ position: 'relative', aspectRatio: '4/5', background: '#fff', marginBottom: 8 }}>
                        {p.image && (
                          <Image src={p.image} alt={p.imageAlt ?? p.title} fill style={{ objectFit: 'contain', padding: 8 }} sizes="140px" />
                        )}
                        {p.onSale && (
                          <div style={{ position: 'absolute', top: 6, left: 6 }}>
                            <span className="badge badge-sale" style={{ fontSize: 10, padding: '3px 6px' }}>−{p.savings}%</span>
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 2 }}>{p.vendor}</div>
                      <div style={{ fontSize: 12, lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.title}</div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: p.onSale ? 'var(--sale)' : 'var(--ink)' }}>
                        {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: p.currencyCode || 'EUR' }).format(p.price)}
                        {p.onSale && (
                          <span style={{ marginLeft: 4, textDecoration: 'line-through', color: 'var(--ink-muted)', fontWeight: 400, fontSize: 11 }}>
                            {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: p.currencyCode || 'EUR' }).format(p.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} style={{ aspectRatio: '4/5', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', opacity: 0.5 }} />
                  ))}
                </div>
              )}
            </div>

            {/* Col 2: Subcategories + Tip */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Shop op categorie</div>
              <div>
                {activeItem.subcategories?.map((sub) => (
                  <Link key={sub.label} href={sub.href} onClick={closeMenu}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 15, color: 'var(--ink)', textDecoration: 'none' }}>
                    {sub.label}
                    <span style={{ color: 'var(--ink-3)', fontSize: 14 }}>→</span>
                  </Link>
                ))}
              </div>
              {activeItem.tip && (
                <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-sunken)' }}>
                  <div className="eyebrow" style={{ marginBottom: 8, color: 'var(--accent-deep)' }}>{activeItem.tip.label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8, lineHeight: 1.15 }}>{activeItem.tip.title}</div>
                  <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.5, marginBottom: 10 }}>{activeItem.tip.desc}</p>
                  <Link href={activeItem.tip.link.href} onClick={closeMenu}
                    style={{ fontSize: 12, textDecoration: 'underline', textUnderlineOffset: 4, color: 'var(--ink)' }}>
                    {activeItem.tip.link.text}
                  </Link>
                </div>
              )}
            </div>

            {/* Col 3: Brands */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div className="eyebrow">Merken</div>
                <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{activeItem.brands?.length} merken</span>
              </div>
              <div>
                {activeItem.brands?.map((b) => (
                  <Link key={b.handle} href={`/brand/${b.handle}`} onClick={closeMenu}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 14, fontWeight: 500, color: 'var(--ink)', textDecoration: 'none' }}>
                    {b.name}
                    <span style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 400 }}>{b.count}</span>
                  </Link>
                ))}
              </div>
              <Link href={activeItem.href} onClick={closeMenu}
                style={{ display: 'inline-block', marginTop: 16, fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 4, color: 'var(--ink)' }}>
                Alle merken bekijken →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div onClick={() => { setSearchOpen(false); setSearchQ(''); setSearchResults([]); }} style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,14,0.4)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--bg)', boxShadow: 'var(--shadow-lg)', padding: '28px 0', maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="container-wide">
              <div className="row" style={{ borderBottom: '2px solid var(--ink)', paddingBottom: 12 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
                <input autoFocus value={searchQ} onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Zoek op product, merk of ingrediënt..."
                  style={{ flex: 1, border: 0, fontSize: 22, fontFamily: 'var(--font-display)', padding: '4px 12px', background: 'transparent', outline: 'none' }} />
                <button onClick={() => { setSearchOpen(false); setSearchQ(''); setSearchResults([]); }}
                  style={{ background: 'none', border: 0, fontSize: 12, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>Sluiten</button>
              </div>
              {searchResults.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <div className="eyebrow" style={{ marginBottom: 16 }}>{searchResults.length} resultaten</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                    {searchResults.map((p) => (
                      <Link key={p.handle} href={`/product/${p.handle}`} onClick={() => { setSearchOpen(false); setSearchQ(''); setSearchResults([]); }}
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
              {searchQ && searchResults.length === 0 && (
                <div style={{ marginTop: 40, textAlign: 'center', color: 'var(--ink-3)', fontSize: 14 }}>
                  Geen resultaten voor "{searchQ}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile nav drawer with accordion */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div onClick={() => setMobileOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,14,0.45)' }} />
          <aside style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 'min(420px, 92vw)', background: 'var(--bg)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: '0.04em' }}>SKINSHOPPER</div>
              <button onClick={() => { setMobileOpen(false); setMobileExpanded(null); }} style={{ background: 'none', border: 0, cursor: 'pointer', padding: 4 }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m4 4 14 14m0-14L4 18" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div style={{ padding: '16px 20px 8px' }}>
              <button onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: 'var(--bg-sunken)', border: 0, cursor: 'pointer', fontSize: 14, color: 'var(--ink-3)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
                Zoek producten, merken...
              </button>
            </div>

            {/* Main nav */}
            <div style={{ flex: 1 }}>
              {NAV_ITEMS.map((item) => {
                const isExpandable = !!item.collection;
                const expanded = mobileExpanded === item.label;
                return (
                  <div key={item.label} style={{ borderBottom: '1px solid var(--border)' }}>
                    {isExpandable ? (
                      <button onClick={() => setMobileExpanded(expanded ? null : item.label)}
                        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'none', border: 0, cursor: 'pointer', fontSize: 16, fontWeight: 500, color: item.sale ? 'var(--sale)' : 'var(--ink)' }}>
                        {item.label}
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"
                          style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                          <path d="m3 5 4 4 4-4" strokeLinecap="round" />
                        </svg>
                      </button>
                    ) : (
                      <Link href={item.href} onClick={() => setMobileOpen(false)}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', fontSize: 16, fontWeight: 500, color: item.sale ? 'var(--sale)' : 'var(--ink)', textDecoration: 'none' }}>
                        {item.label}
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m5 3 4 4-4 4" strokeLinecap="round" /></svg>
                      </Link>
                    )}
                    {expanded && (
                      <div style={{ background: 'var(--bg-sunken)', padding: '16px 20px 20px' }}>
                        <Link href={item.href} onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--bg-elev)', fontSize: 14, fontWeight: 500, color: 'var(--ink)', textDecoration: 'none', marginBottom: 16 }}>
                          Bekijk alle {item.label.toLowerCase()}
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m5 3 4 4-4 4" strokeLinecap="round" /></svg>
                        </Link>
                        {item.subcategories && (
                          <>
                            <div className="eyebrow" style={{ marginBottom: 10 }}>Categorie</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                              {item.subcategories.map((s) => (
                                <Link key={s.label} href={s.href} onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                                  style={{ padding: '10px 12px', fontSize: 14, color: 'var(--ink)', textDecoration: 'none' }}>
                                  {s.label}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                        {item.brands && (
                          <>
                            <div className="eyebrow" style={{ marginBottom: 10 }}>Merken</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {item.brands.map((b) => (
                                <Link key={b.handle} href={`/brand/${b.handle}`} onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                                  style={{ padding: '8px 14px', background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 999, fontSize: 12, fontWeight: 500, color: 'var(--ink)', textDecoration: 'none' }}>
                                  {b.name}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Account links */}
            <div style={{ padding: '8px 0', borderTop: '1px solid var(--border)' }}>
              <button onClick={() => { setMobileOpen(false); setAccountOpen(true); }} style={mobileLinkStyle}>
                <UserIcon /> Account
              </button>
              <button onClick={() => { setMobileOpen(false); setWishlistOpen(true); }} style={mobileLinkStyle}>
                <HeartIcon /> Verlanglijst
              </button>
              <button style={mobileLinkStyle}>
                <PackageIcon /> Volg je bestelling
              </button>
              <button style={mobileLinkStyle}>
                <ChatIcon /> Contact
              </button>
            </div>

            {/* USPs */}
            <div style={{ padding: '20px', background: 'var(--bg-sunken)', borderTop: '1px solid var(--border)', fontSize: 13 }}>
              <div style={{ marginBottom: 8 }}>🚚 Gratis verzending vanaf €60</div>
              <div style={{ marginBottom: 8 }}>↩ 30 dagen kosteloos retour</div>
              <div>✓ 100% originele producten</div>
            </div>
          </aside>
        </div>
      )}

      {/* Account drawer */}
      {accountOpen && (
        <SideDrawer title="Account" onClose={() => setAccountOpen(false)}>
          <div style={{ padding: '32px 0' }}>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 8 }}>Welkom terug</h3>
              <p style={{ fontSize: 14, color: 'var(--ink-3)' }}>Log in om je bestellingen te zien, verlanglijst te beheren en sneller af te rekenen.</p>
            </div>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="E-mailadres" style={{ padding: '14px 16px', border: '1px solid var(--border-strong)', fontSize: 14 }} />
              <input type="password" placeholder="Wachtwoord" style={{ padding: '14px 16px', border: '1px solid var(--border-strong)', fontSize: 14 }} />
              <button className="btn btn-lg" type="submit" style={{ marginTop: 8 }}>Inloggen</button>
            </form>
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)', fontSize: 14, color: 'var(--ink-3)' }}>
              Nog geen account? <span style={{ color: 'var(--ink)', textDecoration: 'underline', cursor: 'pointer' }}>Maak er nu een aan</span>
            </div>
            <div style={{ marginTop: 12, fontSize: 13 }}>
              <span style={{ color: 'var(--ink-3)' }}>Wachtwoord vergeten? </span>
              <span style={{ color: 'var(--ink)', textDecoration: 'underline', cursor: 'pointer' }}>Reset hier</span>
            </div>
          </div>
        </SideDrawer>
      )}

      {/* Wishlist drawer */}
      {wishlistOpen && (
        <SideDrawer title="Verlanglijst" onClose={() => setWishlistOpen(false)}>
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', width: 64, height: 64, alignItems: 'center', justifyContent: 'center', background: 'var(--bg-sunken)', borderRadius: '50%', marginBottom: 20 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.6">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 8 }}>Je verlanglijst is leeg</h3>
            <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 24 }}>Klik op het hartje bij producten om ze hier te bewaren.</p>
            <button onClick={() => setWishlistOpen(false)} className="btn">Begin met shoppen</button>
          </div>
        </SideDrawer>
      )}
    </header>
  );
}

const mobileLinkStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '14px 20px',
  background: 'none',
  border: 0,
  cursor: 'pointer',
  fontSize: 15,
  color: 'var(--ink)',
  textAlign: 'left',
  textDecoration: 'none',
};

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function PackageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function SideDrawer({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,14,0.45)' }} />
      <aside style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: 'min(420px, 100vw)', background: 'var(--bg)',
        boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 0, cursor: 'pointer', padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m4 4 14 14m0-14L4 18" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>{children}</div>
      </aside>
    </div>
  );
}
