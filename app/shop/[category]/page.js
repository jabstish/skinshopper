import { getProductsByCollection, getProducts, normalizeProduct } from '@/lib/shopify';
import PLPClient from './PLPClient';
import { notFound } from 'next/navigation';

export const revalidate = 120;

const META = {
  parfum: {
    title: 'Parfum',
    sub: 'Authentieke designer parfums tot 35% onder de adviesprijs',
    collection: 'parfum',
    // Merge Gucci — they live in the gucci collection, not in parfum
    mergeCollections: ['gucci'],
  },
  huidverzorging: {
    title: 'Huidverzorging',
    sub: 'Dermatologisch getest. Door experts samengesteld.',
    collection: 'huidverzorging',
    fallbackCollections: ['la-roche-posay', 'vichy', 'skinceuticals', 'serum'],
  },
  zonbescherming: {
    title: 'Zonbescherming',
    sub: 'SPF30 tot SPF50+, voor lichaam én gezicht.',
    collection: 'zonnebrand-creme',
    mergeCollections: ['lancaster'],
  },
  sale: {
    title: 'Sale',
    sub: 'Tot 35% korting — zolang de voorraad strekt.',
    collection: null,
  },
};

export async function generateMetadata({ params }) {
  const m = META[params.category];
  return { title: `${m?.title ?? 'Producten'} — SkinShopper` };
}

async function fetchCollectionProducts(handle) {
  const col = await getProductsByCollection(handle, 100).catch(() => null);
  return col?.products?.edges?.map((e) => e.node) ?? [];
}

function dedupeById(products) {
  const seen = new Set();
  return products.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
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
      rawProducts = dedupeById(lists.flat());
    }

    // Merge: always add products from extra collections (e.g. Gucci into Parfum)
    if (meta.mergeCollections?.length) {
      const extras = await Promise.all(meta.mergeCollections.map(fetchCollectionProducts));
      rawProducts = dedupeById([...rawProducts, ...extras.flat()]);
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
