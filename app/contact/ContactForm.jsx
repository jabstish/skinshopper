'use client';
import { useState } from 'react';

const SUBJECTS = [
  'Vraag over mijn bestelling',
  'Retour aanmelden',
  'Productinformatie',
  'Klacht',
  'Iets anders',
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/xldnjqgk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid var(--border)',
    background: 'var(--bg-elev)',
    fontSize: 14,
    color: 'var(--ink)',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  };

  if (status === 'success') {
    return (
      <div style={{ padding: '48px 32px', background: 'var(--bg-elev)', border: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
        <h3 style={{ marginBottom: 8 }}>Bericht verstuurd!</h3>
        <p style={{ color: 'var(--ink-3)', fontSize: 15 }}>We reageren binnen 1–2 werkdagen op je bericht.</p>
        <button onClick={() => setStatus('idle')} style={{ marginTop: 24, fontSize: 13, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)' }}>
          Nieuw bericht sturen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Naam *</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={update('name')}
            placeholder="Jouw naam"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>E-mail *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="jouw@email.nl"
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Onderwerp *</label>
        <select
          required
          value={form.subject}
          onChange={update('subject')}
          style={{ ...inputStyle, appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23666\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36 }}
        >
          <option value="">Kies een onderwerp…</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Bericht *</label>
        <textarea
          required
          value={form.message}
          onChange={update('message')}
          placeholder="Beschrijf je vraag zo volledig mogelijk…"
          rows={6}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
        />
      </div>

      {status === 'error' && (
        <p style={{ fontSize: 13, color: 'var(--sale)', margin: 0 }}>
          Er is iets misgegaan. Stuur ons een e-mail op info@skinshopper.nl of bel +31 85 060 2645.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn btn-lg"
        style={{ alignSelf: 'flex-start', opacity: status === 'sending' ? 0.7 : 1 }}
      >
        {status === 'sending' ? 'Versturen…' : 'Verstuur bericht →'}
      </button>
    </form>
  );
}
