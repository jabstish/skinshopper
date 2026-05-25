// Shopify headless analytics helpers
// https://shopify.dev/docs/api/hydrogen-react

export const SHOP_ID = 'gid://shopify/Shop/96569721165';
export const SHOP_DOMAIN = 'dzwtmd-0z.myshopify.com';
export const CURRENCY = 'EUR';

// Stuur een Shopify analytics event (client-side only)
export async function trackShopify(eventName, payload) {
  try {
    const { sendShopifyAnalytics, getClientBrowserParameters } = await import('@shopify/hydrogen-react');
    await sendShopifyAnalytics({
      eventName,
      payload: {
        ...getClientBrowserParameters(),
        shopId: SHOP_ID,
        currency: CURRENCY,
        hasUserConsent: true,
        shopifySalesChannel: 'headless',
        ...payload,
      },
    });
  } catch (e) {
    // Analytics mogen nooit de shop breken
    console.warn('[analytics]', e?.message);
  }
}
