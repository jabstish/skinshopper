import { getProductsByCollection, getProducts, normalizeProduct, COLLECTION_MAP } from '@/lib/shopify';
import PLPClient from './PLPClient';
import { notFound } from 'next/navigation';

export const revalidate = 120;

const META = {
  parfum: { title: 'Parfum', sub: 'Authentieke designer parfums tot 35% onder de adviesprijs', collection: 'parfum' },
  huidverzorging: { title: 'Huidverzorging', sub: 'Dermatologisch getest. Door experts samengesteld.', collection: 'huidverzorging' },
  zonbescherming: { title: 'Zonbescherming', sub: 'SPF30 tot SPF50+, voor lichaam én gezicht.', collection: 'zonnebrand-creme' },
  sale: { title: 'Sale', sub: 'Tot 35% korting — zolang de voorraad strekt.', collection: null },
};

export async function generateMetadata({ params }) {
  const m = META[params.category];
  return { title: `${m?.title ?? 'Producten'} — SkinShopper` };
}

export default async function ShopPage({ params }) {
  const meta = META[params.category];
  if (!meta) notFound();

  let rawProducts = [];
  if (meta.collection) {
    const col = await getProductsByCollection(meta.collection, 100).catch(() => null);
    rawProducts = col?.products?.edges?.map((e) => e.node) ?? [];
  } else {
    // Sale: fetch all products with compare at price
    rawProducts = await getProducts(100, 'compare_at_price:>0').catch(() => []);
  }

  const products = rawProducts
    .map(normalizeProduct)
    .filter((p) => params.category === 'sale' ? p.onSale : true);

  return (
    <PLPClient
      category={params.category}
      title={meta.title}
      sub={meta.sub}
      initialProducts={products}
    />
  );
}
