'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ss-wishlist');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  const toggle = (product) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      const next = exists
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, {
            id: product.id,
            handle: product.handle,
            title: product.title,
            vendor: product.vendor,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            onSale: product.onSale,
            savings: product.savings,
            image: product.image,
            imageAlt: product.imageAlt,
            currencyCode: product.currencyCode,
            variantId: product.variantId,
          }];
      try { localStorage.setItem('ss-wishlist', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const isWishlisted = (id) => items.some((p) => p.id === id);
  const count = items.length;

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, count, loaded }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be inside WishlistProvider');
  return ctx;
}
