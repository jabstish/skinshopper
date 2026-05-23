'use client';
import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ variantId, title, available, stock }) {
  const { addToCart, loading } = useCart();
  const lowStock = stock > 0 && stock <= 5;
  const outOfStock = !available || stock === 0;

  return (
    <div>
      {lowStock && !outOfStock && (
        <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--sale)', fontWeight: 500 }}>
          Nog maar {stock} op voorraad!
        </div>
      )}
      <button
        className="btn btn-lg"
        style={{ width: '100%', opacity: outOfStock ? 0.5 : 1, cursor: outOfStock ? 'not-allowed' : 'pointer' }}
        disabled={outOfStock || loading}
        onClick={() => addToCart(variantId, title)}
      >
        {outOfStock ? 'Niet op voorraad' : loading ? 'Toevoegen...' : 'Voeg toe aan winkelmand'}
      </button>
    </div>
  );
}
