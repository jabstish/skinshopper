'use client';
import { useState, useEffect } from 'react';

const MSGS = [
  'Gratis verzending vanaf €60 — vandaag besteld, morgen in huis',
  '100% originele producten — direct van de leverancier',
  '30 dagen retourrecht — kosteloos',
];

export default function AnnouncementBar() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % MSGS.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ background: 'var(--ink)', color: 'white', textAlign: 'center', padding: '10px 16px', fontSize: 12, letterSpacing: '0.04em' }}>
      <span key={idx} style={{ animation: 'fadeIn .4s ease' }}>{MSGS[idx]}</span>
    </div>
  );
}
