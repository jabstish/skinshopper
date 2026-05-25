const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_URL = `https://${DOMAIN}/api/2024-10/graphql.json`;

// Shopify geeft checkoutUrl terug met wisselend domein.
// We vervangen de hostname altijd met skinshopper.nl zodat de gebruiker
// op het eigen domein blijft. Vercel proxiet /checkout/** naar Shopify.
const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN || 'skinshopper.nl';

function fixCheckoutUrl(url) {
  if (!url) return url;
  try {
    const u = new URL(url);
    u.hostname = SITE_DOMAIN;
    u.port = '';
    u.protocol = 'https:';
    return u.toString();
  } catch {
    return url;
  }
}

async function shopifyFetch({ query, variables = {}, cache = 'no-store', revalidate }) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  };

  if (revalidate !== undefined) {
    options.next = { revalidate };
  } else {
    options.cache = cache;
  }

  const res = await fetch(API_URL, options);
  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    tags
    vendor
    availableForSale
    priceRange {
      minVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
    }
    featuredImage { url altText width height }
    variants(first: 5) {
      edges {
        node {
          id
          title
          availableForSale
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
        }
      }
    }
    collections(first: 10) {
      edges { node { handle title } }
    }
  }
`;

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    cost {
      totalAmount { amount currencyCode }
      subtotalAmount { amount currencyCode }
    }
    lines(first: 30) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount { amount currencyCode }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                title
                handle
                featuredImage { url altText }
              }
              price { amount currencyCode }
              selectedOptions { name value }
            }
          }
        }
      }
    }
  }
`;

export async function getProductsByCollection(handle, first = 100) {
  const data = await shopifyFetch({
    revalidate: 120,
    query: `
      ${PRODUCT_FRAGMENT}
      query GetCollection($handle: String!, $first: Int!) {
        collection(handle: $handle) {
          id title handle description
          products(first: $first) {
            edges { node { ...ProductFields } }
          }
        }
      }
    `,
    variables: { handle, first },
  });
  return data.collection;
}

export async function getProduct(handle) {
  const data = await shopifyFetch({
    revalidate: 120,
    query: `
      ${PRODUCT_FRAGMENT}
      query GetProduct($handle: String!) {
        product(handle: $handle) {
          ...ProductFields
          description
          descriptionHtml
          images(first: 10) {
            edges { node { url altText width height } }
          }
        }
      }
    `,
    variables: { handle },
  });
  return data.product;
}

export async function getProducts(first = 50, queryStr = '') {
  const data = await shopifyFetch({
    revalidate: 120,
    query: `
      ${PRODUCT_FRAGMENT}
      query GetProducts($first: Int!, $query: String!) {
        products(first: $first, query: $query) {
          edges { node { ...ProductFields } }
        }
      }
    `,
    variables: { first, query: queryStr },
  });
  return data.products.edges.map((e) => e.node);
}

export async function searchProducts(q, first = 20) {
  return getProducts(first, q);
}

// ── Cart mutations ──────────────────────────────────────────────

export async function createCart(lines = []) {
  const data = await shopifyFetch({
    query: `
      ${CART_FRAGMENT}
      mutation CartCreate($lines: [CartLineInput!]) {
        cartCreate(input: { lines: $lines }) {
          cart { ...CartFields }
          userErrors { field message }
        }
      }
    `,
    variables: { lines },
  });
  const cart = data.cartCreate.cart;
  if (cart) cart.checkoutUrl = fixCheckoutUrl(cart.checkoutUrl);
  return cart;
}

export async function addLinesToCart(cartId, lines) {
  const data = await shopifyFetch({
    query: `
      ${CART_FRAGMENT}
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
        }
      }
    `,
    variables: { cartId, lines },
  });
  const cart = data.cartLinesAdd.cart;
  if (cart) cart.checkoutUrl = fixCheckoutUrl(cart.checkoutUrl);
  return cart;
}

export async function updateCartLine(cartId, lineId, quantity) {
  const data = await shopifyFetch({
    query: `
      ${CART_FRAGMENT}
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart { ...CartFields }
        }
      }
    `,
    variables: { cartId, lines: [{ id: lineId, quantity }] },
  });
  const cart = data.cartLinesUpdate.cart;
  if (cart) cart.checkoutUrl = fixCheckoutUrl(cart.checkoutUrl);
  return cart;
}

export async function removeCartLines(cartId, lineIds) {
  const data = await shopifyFetch({
    query: `
      ${CART_FRAGMENT}
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { ...CartFields }
        }
      }
    `,
    variables: { cartId, lineIds },
  });
  const cart = data.cartLinesRemove.cart;
  if (cart) cart.checkoutUrl = fixCheckoutUrl(cart.checkoutUrl);
  return cart;
}

export async function fetchCart(cartId) {
  const data = await shopifyFetch({
    query: `
      ${CART_FRAGMENT}
      query GetCart($cartId: ID!) {
        cart(id: $cartId) { ...CartFields }
      }
    `,
    variables: { cartId },
  });
  const cart = data.cart;
  if (cart) cart.checkoutUrl = fixCheckoutUrl(cart.checkoutUrl);
  return cart;
}

// ── Helpers ─────────────────────────────────────────────────────

export function formatPrice(amount, currency = 'EUR') {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(parseFloat(amount));
}

const BRAND_HANDLES = new Set(['hugo-boss', 'calvin-klein', 'la-roche-posay', 'vichy', 'skinceuticals', 'lancaster', 'gucci']);

// Fallback: detect brand from product title when collection membership isn't available
const TITLE_BRAND_MAP = [
  { keywords: ['hugo boss', 'boss bottled', 'boss the scent', 'boss man', 'boss alive', 'boss nuit', 'boss ma vie'], brand: 'Hugo Boss', handle: 'hugo-boss' },
  { keywords: ['calvin klein', 'ck one', 'ck everyone', 'ck be', 'eternity', 'euphoria', 'obsession', 'contradiction', 'ck2'], brand: 'Calvin Klein', handle: 'calvin-klein' },
  { keywords: ['gucci'], brand: 'Gucci', handle: 'gucci' },
  { keywords: ['la roche-posay', 'la roche posay', 'effaclar', 'toleriane', 'anthelios', 'cicaplast', 'rosaliac', 'lipikar', 'iso-urea', 'retinol b3', 'hyalu b5', 'pigmentclar'], brand: 'La Roche-Posay', handle: 'la-roche-posay' },
  { keywords: ['vichy', 'mineral 89', 'minéral 89', 'liftactiv', 'neovadiol', 'normaderm', 'aqualia', 'slow âge'], brand: 'Vichy', handle: 'vichy' },
  { keywords: ['skinceuticals', 'skinceutical', 'c e ferulic', 'phloretin', 'hydrating b5', 'triple lipid', 'h.a. intensifier'], brand: 'SkinCeuticals', handle: 'skinceuticals' },
  { keywords: ['lancaster'], brand: 'Lancaster', handle: 'lancaster' },
];

export function normalizeProduct(p) {
  const price = parseFloat(p.priceRange.minVariantPrice.amount);
  const compareAt = parseFloat(p.compareAtPriceRange?.minVariantPrice?.amount ?? 0);
  const onSale = compareAt > price;
  const savings = onSale ? Math.round((1 - price / compareAt) * 100) : 0;
  const firstVariant = p.variants?.edges?.[0]?.node;

  // 1. Try to derive brand from Shopify collections
  const productCollections = p.collections?.edges?.map((e) => e.node) ?? [];
  const brandCollection = productCollections.find((c) => BRAND_HANDLES.has(c.handle));
  let brandName = brandCollection?.title;
  let brandHandle = brandCollection?.handle ?? null;

  // 2. Fallback: keyword match on product title
  if (!brandName) {
    const titleLower = p.title.toLowerCase();
    const matched = TITLE_BRAND_MAP.find(({ keywords }) => keywords.some((k) => titleLower.includes(k)));
    if (matched) {
      brandName = matched.brand;
      brandHandle = matched.handle;
    } else {
      brandName = p.vendor;
    }
  }

  return {
    ...p,
    price,
    compareAtPrice: onSale ? compareAt : null,
    onSale,
    savings,
    isBestseller: p.tags?.includes('bestseller'),
    isNew: p.tags?.includes('new'),
    stock: 99,
    variantId: firstVariant?.id,
    image: p.featuredImage?.url ?? null,
    imageAlt: p.featuredImage?.altText ?? p.title,
    currencyCode: p.priceRange.minVariantPrice.currencyCode,
    vendor: brandName,
    brandHandle,
    productCollections,
  };
}

export const COLLECTION_MAP = {
  parfum: 'parfum',
  huidverzorging: 'huidverzorging',
  zonbescherming: 'zonnebrand-creme',
  haar: 'serum',
  sale: null,
};

export const BRAND_COLLECTIONS = [
  { handle: 'hugo-boss', name: 'Hugo Boss', wordmark: 'HUGO BOSS', category: 'parfum' },
  { handle: 'calvin-klein', name: 'Calvin Klein', wordmark: 'Calvin Klein', category: 'parfum' },
  { handle: 'la-roche-posay', name: 'La Roche-Posay', wordmark: 'LA ROCHE-POSAY', category: 'skincare' },
  { handle: 'vichy', name: 'Vichy', wordmark: 'VICHY', category: 'skincare' },
  { handle: 'skinceuticals', name: 'SkinCeuticals', wordmark: 'SkinCeuticals', category: 'skincare' },
  { handle: 'lancaster', name: 'Lancaster', wordmark: 'LANCASTER', category: 'skincare' },
  { handle: 'gucci', name: 'Gucci', wordmark: 'GUCCI', category: 'parfum' },
];
