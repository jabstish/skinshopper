import { getProductsByCollection, getProducts, normalizeProduct } from '@/lib/shopify';
import { NextResponse } from 'next/server';

const FALLBACK = {
  huidverzorging: ['la-roche-posay', 'vichy', 'skinceuticals', 'serum'],
};

async function fetchFromCollection(handle) {
  const col = await getProductsByCollection(handle, 8).catch(() => null);
  return col?.products?.edges?.map((e) => e.node) ?? [];
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('collection');
  const limit = parseInt(searchParams.get('limit') ?? '4', 10);

  if (!handle) return NextResponse.json({ products: [] });

  try {
    let raws = [];

    if (handle === 'sale') {
      // Fetch products and filter for ones on sale
      const all = await getProducts(40, '').catch(() => []);
      raws = all.filter((p) => {
        const price = parseFloat(p.priceRange.minVariantPrice.amount);
        const cmp = parseFloat(p.compareAtPriceRange?.minVariantPrice?.amount ?? 0);
        return cmp > price;
      });
    } else {
      raws = await fetchFromCollection(handle);
      if (raws.length === 0 && FALLBACK[handle]) {
        const lists = await Promise.all(FALLBACK[handle].map(fetchFromCollection));
        const merged = lists.flat();
        const seen = new Set();
        raws = merged.filter((p) => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });
      }
    }

    const products = raws.map(normalizeProduct).slice(0, limit);
    return NextResponse.json({ products }, { headers: { 'Cache-Control': 's-maxage=120, stale-while-revalidate' } });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
