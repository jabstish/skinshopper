'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/lib/shopify';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { title, handle, price, compareAtPrice, onSale, savings, isBestseller, isNew, stock, variantId, image, imageAlt, currencyCode } = product;

  const lowStock = stock > 0 && stock <= 5;
  const wishlisted = isWishlisted(product.id);

  return (
    <article className="product-card">
      <Link href={`/product/${handle}`} style={{ display: 'contents' }}>
        <div className="product-card-media">
          {image ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw"
              style={{ objectFit: 'contain', padding: 16 }}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: '#fff' }}>
              <span style={{ fontSize: 32, opacity: 0.3 }}>🧴</span>
            </div>
          )}
          <div className="product-card-badges">
            {onSale && <span className="badge badge-sale">−{savings}%</span>}
            {isBestseller && !onSale && <span className="badge badge-bestseller">Bestseller</span>}
            {isNew && !onSale && !isBestseller && <span className="badge badge-new">Nieuw</span>}
          </div>
        </div>
      </Link>

      <div className="product-card-body">
        <div className="product-card-brand">{product.vendor}</div>
        <Link href={`/product/${handle}`}>
          <div className="product-card-name">{title}</div>
        </Link>
        <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <div className="product-card-prices">
              <span className={onSale ? 'product-card-price-sale' : ''}>
                {formatPrice(price, currencyCode)}
              </span>
              {onSale && (
                <span className="product-card-price-old">{formatPrice(compareAtPrice, currencyCode)}</span>
              )}
            </div>
          </div>
          {lowStock && (
            <div className="text-sale" style={{ fontSize: 11, fontWeight: 500 }}>Nog {stock}</div>
          )}
        </div>
      </div>

      {/* Wishlist heart */}
      <button
        aria-label={wishlisted ? 'Verwijder uit verlanglijst' : 'Voeg toe aan verlanglijst'}
        onClick={(e) => { e.preventDefault(); toggle(product); }}
        style={{
          position: 'absolute',
          top: 10, right: 10,
          width: 32, height: 32,
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid var(--border)',
          borderRadius: '50%',
          display: 'grid', placeItems: 'center',
          cursor: 'pointer',
          transition: 'all .2s ease',
          color: wishlisted ? 'var(--sale)' : 'var(--ink-3)',
          zIndex: 2,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* Quick-add */}
      <button
        className="quick-add"
        aria-label="Voeg toe aan winkelmand"
        onClick={(e) => { e.preventDefault(); addToCart(variantId, title); }}
        style={{
          position: 'absolute',
          inset: 'auto 12px 60px auto',
          width: 36, height: 36,
          background: 'var(--bg-elev)', border: '1px solid var(--border)',
          borderRadius: '50%', display: 'grid', placeItems: 'center',
          cursor: 'pointer', transition: 'all .2s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = 'white'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-elev)'; e.currentTarget.style.color = 'inherit'; }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </button>
    </article>
  );
}
