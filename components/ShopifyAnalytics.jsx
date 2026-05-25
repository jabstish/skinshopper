'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SHOP_DOMAIN, trackShopify } from '@/lib/analytics';

// Beheert Shopify analytics cookies + tracked elke page view
export default function ShopifyAnalytics() {
  const pathname = usePathname();
  const prevPath = useRef(null);

  // Shopify cookies instellen (eenmalig)
  useEffect(() => {
    async function setupCookies() {
      try {
        const { useShopifyCookies } = await import('@shopify/hydrogen-react');
        // useShopifyCookies is een hook — we roepen het equivalent aan via de utility
        // Shopify's _shopify_y en _shopify_s cookies worden gezet via hun script
        const script = document.createElement('script');
        script.src = `https://${SHOP_DOMAIN}/cdn/shop/t/1/assets/shopify-analytics.js`;
        script.async = true;
        document.head.appendChild(script);
      } catch (e) {
        // Geen blocker
      }
    }
    setupCookies();
  }, []);

  // Page view bij elke route change
  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    trackShopify('PAGE_VIEW', {
      pageUrl: window.location.href,
      pageTitle: document.title,
    });
  }, [pathname]);

  return null;
}
