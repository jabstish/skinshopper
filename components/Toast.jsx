'use client';
import { useCart } from '@/context/CartContext';

export default function Toast() {
  const { toast, setToast, setCartOpen } = useCart();
  if (!toast) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: 'var(--ink)', color: 'white', padding: '14px 22px',
      fontSize: 13, letterSpacing: '0.02em', boxShadow: 'var(--shadow-lg)',
      zIndex: 200, animation: 'fadeIn .3s ease', display: 'flex', alignItems: 'center', gap: 16,
      whiteSpace: 'nowrap',
    }}>
      <span>{toast}</span>
      <button onClick={() => { setToast(null); setCartOpen(true); }}
        style={{ background: 'transparent', border: '1px solid #555', color: 'white', padding: '6px 12px', fontSize: 11, cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        Bekijk mandje
      </button>
    </div>
  );
}
