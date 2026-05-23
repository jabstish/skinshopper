'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { createCart, addLinesToCart, updateCartLine, removeCartLines, fetchCart, formatPrice } from '@/lib/shopify';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Load persisted cart on mount
  useEffect(() => {
    const savedId = localStorage.getItem('ss-cart-id');
    if (savedId) {
      fetchCart(savedId)
        .then((c) => { if (c) setCart(c); })
        .catch(() => localStorage.removeItem('ss-cart-id'));
    }
  }, []);

  const saveCart = (c) => {
    setCart(c);
    if (c?.id) localStorage.setItem('ss-cart-id', c.id);
  };

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };

  const addToCart = useCallback(async (variantId, title, qty = 1) => {
    setLoading(true);
    try {
      const lines = [{ merchandiseId: variantId, quantity: qty }];
      let updated;
      if (cart?.id) {
        updated = await addLinesToCart(cart.id, lines);
      } else {
        updated = await createCart(lines);
      }
      saveCart(updated);
      showToast(`✓ ${title.slice(0, 40)}${title.length > 40 ? '…' : ''} toegevoegd`);
      setTimeout(() => setCartOpen(true), 300);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const updateQty = useCallback(async (lineId, quantity) => {
    if (!cart?.id) return;
    setLoading(true);
    try {
      const updated = await updateCartLine(cart.id, lineId, quantity);
      saveCart(updated);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const removeItem = useCallback(async (lineId) => {
    if (!cart?.id) return;
    setLoading(true);
    try {
      const updated = await removeCartLines(cart.id, [lineId]);
      saveCart(updated);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const lines = cart?.lines?.edges?.map((e) => e.node) ?? [];
  const cartCount = lines.reduce((s, l) => s + l.quantity, 0);
  const cartTotal = cart?.cost?.totalAmount
    ? formatPrice(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)
    : '€0,00';
  const checkoutUrl = cart?.checkoutUrl ?? '#';

  return (
    <CartContext.Provider value={{
      lines,
      cartCount,
      cartTotal,
      checkoutUrl,
      cartOpen,
      setCartOpen,
      addToCart,
      updateQty,
      removeItem,
      loading,
      toast,
      setToast,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
