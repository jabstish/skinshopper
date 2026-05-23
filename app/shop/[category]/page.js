import { getProductsByCollection, getProducts, normalizeProduct } from '@/lib/shopify';
import PLPClient from './PLPClient';
import { notFound } from 'next/navigation';

export const revalidate = 120;

const META = {
  parfum: { title: 'Parfum', sub: 'Authentieke designer parfums tot 35% onder de adviesprijs', collection: 'parfum' },
  huidverzorging: {
    title: 'Huidverzorging',
    sub: 'Dermatologisch getest. Door experts samengesteld.',
    collection: 'huidverzorging',
    fallbackCollections: ['la-roche-posay', 'vichy', 'skinceuticals', 'serum'],
  },
  zonbescherming: { title: 'Zonbescherming', sub: 'SPF30 tot SPF50+, voor lichaam én gezicht.', collection: 'zonnebrand-creme' },
  sale: { title: 'Sale', sub: 'Tot 35% korting — zolang de voorraad strekt.', collection: null },
};

export async function generateMetadata({ params }) {
  const m = META[params.category];
  return { title: `${m?.title ?? 'Producten'} — SkinShopper` };
}

async function fetchCollectionProducts(handle) {
  const col = await getProductsByCollection(handle, 100).catch(() => null);
  return col?.products?.edges?.map((e) => e.node) ?? [];
}

export default async function ShopPage({ params }) {
  const meta = META[params.category];
  if (!meta) notFound();

  let rawProducts = [];
  if (meta.collection) {
    rawProducts = await fetchCollectionProducts(meta.collection);

    // Fallback: if main collection is empty, merge fallback collections
    if (rawProducts.length === 0 && meta.fallbackCollections?.length) {
      const lists = await Promise.all(meta.fallbackCollections.map(fetchCollectionProducts));
      const merged = lists.flat();
      // Dedupe by product id
      const seen = new Set();
      rawProducts = merged.filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
    }
  } else {
    // Sale: fetch all products with a compare-at price
    rawProducts = await getProducts(100, '').catch(() => []);
  }

  const products = rawProducts
    .map(normalizeProduct)
    .filter((p) => (params.category === 'sale' ? p.onSale : true));

  return (
    <PLPClient
      category={params.category}
      title={meta.title}
      sub={meta.sub}
      initialProducts={products}
    />
  );
}
