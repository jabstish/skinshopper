import { getProducts, normalizeProduct } from '@/lib/shopify';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';
  if (!q.trim()) return Response.json({ products: [] });

  try {
    const raw = await getProducts(12, q);
    const products = raw.map((p) => {
      const n = normalizeProduct(p);
      return { handle: n.handle, title: n.title, vendor: n.vendor, price: n.price, currencyCode: n.currencyCode, image: n.image };
    });
    return Response.json({ products });
  } catch {
    return Response.json({ products: [] });
  }
}
