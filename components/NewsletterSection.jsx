'use client';
import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <section style={{ background: 'var(--accent-soft)', padding: '80px 0' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: 720, padding: '0 var(--pad-x)' }}>
        <div className="eyebrow" style={{ marginBottom: 16, color: 'var(--accent-deep)' }}>De nieuwsbrief</div>
        <h2 style={{ fontSize: 'clamp(36px, 4vw, 56px)', marginBottom: 20 }}>10% korting<br />op je eerste bestelling</h2>
        <p style={{ color: 'var(--ink-3)', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>Wekelijks de beste deals, nieuwe drops en huidverzorging tips — geen spam.</p>
        {done ? (
          <div style={{ padding: 20, background: 'var(--bg-elev)', display: 'inline-block' }}>
            <div style={{ color: 'var(--success)', fontSize: 15, fontWeight: 500 }}>✓ Yes, je staat erop! Check je inbox voor de kortingscode.</div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} style={{ display: 'flex', maxWidth: 480, margin: '0 auto' }}>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="jouw@email.nl" style={{ flex: 1, padding: '16px 18px', fontSize: 15, borderRight: 0, borderRadius: 0 }} />
            <button type="submit" className="btn btn-lg" style={{ borderRadius: 0 }}>Aanmelden</button>
          </form>
        )}
        <div style={{ fontSize: 11, marginTop: 12, color: 'var(--ink-3)' }}>Geen zorgen — je kunt je altijd weer uitschrijven.</div>
      </div>
    </section>
  );
}
