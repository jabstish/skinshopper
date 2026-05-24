'use client';
import { useCart } from '@/context/CartContext';

export default function Toast() {
  const { toast, setToast, setCartOpen } = useCart();
  if (!toast) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 16, left: 16, right: 16,
      background: 'var(--ink)', color: 'white', padding: '14px 16px',
      fontSize: 13, letterSpacing: '0.02em', boxShadow: 'var(--shadow-lg)',
      zIndex: 200, animation: 'fadeIn .3s ease', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: 12,
    }}>
      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{toast}</span>
      <button onClick={() => { setToast(null); setCartOpen(true); }}
        style={{ background: 'transparent', border: '1px solid #555', color: 'white', padding: '6px 12px', fontSize: 11, cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>
        Bekijk mandje
      </button>
    </div>
  );
}
