const SHOPIFY_STORE = 'dzwtmd-0z.myshopify.com';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
    ],
  },
  async rewrites() {
    return [
      // Shopify checkout, account, orders — blijven op eigen domein
      {
        source: '/checkout/:path*',
        destination: `https://${SHOPIFY_STORE}/checkout/:path*`,
      },
      {
        source: '/cart/:path*',
        destination: `https://${SHOPIFY_STORE}/cart/:path*`,
      },
      {
        source: '/account/:path*',
        destination: `https://${SHOPIFY_STORE}/account/:path*`,
      },
      {
        source: '/orders/:path*',
        destination: `https://${SHOPIFY_STORE}/orders/:path*`,
      },
      {
        source: '/payments/:path*',
        destination: `https://${SHOPIFY_STORE}/payments/:path*`,
      },
    ];
  },
};

export default nextConfig;
