'use client';
import Link from 'next/link';

const CATEGORIES = [
  { label: 'Parfum', href: '/shop/parfum', tint1: '#7a1840', tint2: '#3a0e22', emoji: '✦' },
  { label: 'Huidverzorging', href: '/shop/huidverzorging', tint1: '#dceaf3', tint2: '#1d8ed4', emoji: '◇' },
  { label: 'Zonbescherming', href: '/shop/zonbescherming', tint1: '#fcd5a0', tint2: '#ef7d27', emoji: '☀' },
  { label: 'Sale −35%', href: '/shop/sale', tint1: '#fbecf0', tint2: '#8b1e3f', emoji: '◐' },
];

export default function CategoryTiles() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {CATEGORIES.map((cat) => (
        <Link key={cat.href} href={cat.href}
          style={{ position: 'relative', aspectRatio: '4/5', background: `linear-gradient(160deg, ${cat.tint1} 0%, ${cat.tint2} 100%)`, overflow: 'hidden', display: 'block', textDecoration: 'none', transition: 'transform .3s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.01)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
            <span style={{ fontSize: 64, opacity: 0.25, color: 'white' }}>{cat.emoji}</span>
          </div>
          <div style={{ position: 'absolute', inset: 'auto 0 0 0', padding: 20, color: 'white' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, lineHeight: 1.1 }}>{cat.label}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
