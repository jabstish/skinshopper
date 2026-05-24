'use client';
import { useState } from 'react';
import Link from 'next/link';

const CONCERNS = [
  { id: 'droge-huid', icon: '○', label: 'Droge huid' },
  { id: 'acne', icon: '◌', label: 'Acne & onzuiverheden' },
  { id: 'anti-aging', icon: '❋', label: 'Anti-aging' },
  { id: 'pigmentvlekken', icon: '◉', label: 'Pigmentvlekken' },
  { id: 'gevoelig', icon: '◎', label: 'Gevoelige huid' },
  { id: 'roodheid', icon: '◑', label: 'Roodheid' },
  { id: 'porieen', icon: '◈', label: 'Grote poriën' },
  { id: 'ogen', icon: '◐', label: 'Oogomgeving' },
];

export default function SkinConcernFinder() {
  const [selected, setSelected] = useState(null);

  return (
    <section style={{ background: 'var(--bg-sunken)', padding: '80px 0' }}>
      <div className="container-wide">
        <div className="skin-concern-outer">
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Vind jouw routine</div>
            <h2 style={{ fontSize: 'clamp(36px, 4vw, 56px)', marginBottom: 16 }}>
              Wat is jouw{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--accent-deep)' }}>huidprobleem</em>?
            </h2>
            <p style={{ color: 'var(--ink-3)', fontSize: 15, lineHeight: 1.55, marginBottom: 20 }}>
              Kies wat het meest van toepassing is — we tonen producten die dermatologisch getest en bewezen zijn.
            </p>
            <Link href="/shop/huidverzorging" style={{ fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 4 }}>
              Bekijk alle huidverzorging →
            </Link>
          </div>

          <div className="skin-concern-grid">
            {CONCERNS.map((c) => (
              <Link
                key={c.id}
                href="/shop/huidverzorging"
                onClick={() => setSelected(c.id)}
                style={{
                  padding: '24px 16px',
                  background: selected === c.id ? 'var(--ink)' : 'var(--bg-elev)',
                  color: selected === c.id ? 'white' : 'var(--ink)',
                  border: '1px solid var(--border)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  alignItems: 'flex-start',
                  minHeight: 120,
                  textDecoration: 'none',
                  transition: 'all .2s ease',
                }}
              >
                <span style={{
                  fontSize: 28,
                  fontFamily: 'var(--font-display)',
                  color: selected === c.id ? 'rgba(255,255,255,0.7)' : 'var(--accent)',
                }}>{c.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
