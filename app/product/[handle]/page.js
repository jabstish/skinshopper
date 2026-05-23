import { getProduct, getProducts, normalizeProduct, BRAND_COLLECTIONS } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PDPClient from './PDPClient';

export const revalidate = 120;

export async function generateMetadata({ params }) {
  const product = await getProduct(params.handle).catch(() => null);
  if (!product) return { title: 'Product niet gevonden — SkinShopper' };
  return { title: `${product.title} — SkinShopper`, description: product.description?.slice(0, 155) };
}

function vendorToHandle(vendor) {
  if (!vendor) return null;
  const match = BRAND_COLLECTIONS.find((b) => b.name.toLowerCase() === vendor.toLowerCase());
  return match?.handle ?? vendor.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default async function ProductPage({ params }) {
  const raw = await getProduct(params.handle).catch(() => null);
  if (!raw) notFound();

  const product = normalizeProduct(raw);
  const images = raw.images?.edges?.map((e) => e.node) ?? [];
  const allImages = images.length > 0 ? images : (product.image ? [{ url: product.image, altText: product.title }] : []);
  const variants = raw.variants?.edges?.map((e) => e.node) ?? [];

  const brandHandle = vendorToHandle(product.vendor);

  const categoryHandle = BRAND_COLLECTIONS.find(
    (b) => b.handle === brandHandle
  )?.category === 'parfum' ? 'parfum' : 'huidverzorging';

  // Fetch related products from the same vendor
  const relatedProducts = await getProducts(8, `vendor:"${product.vendor}"`)
    .then((prods) =>
      prods
        .filter((p) => p.handle !== params.handle)
        .map(normalizeProduct)
        .slice(0, 4)
    )
    .catch(() => []);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container-wide" style={{ padding: '20px 32px 8px', fontSize: 12, color: 'var(--ink-3)' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: 'var(--ink-3)' }}>Home</Link>
          <span>/</span>
          <Link href={`/shop/${categoryHandle}`} style={{ color: 'var(--ink-3)' }}>
            {categoryHandle === 'parfum' ? 'Parfum' : 'Huidverzorging'}
          </Link>
          <span>/</span>
          {brandHandle && (
            <>
              <Link href={`/brand/${brandHandle}`} style={{ color: 'var(--ink-3)' }}>{product.vendor}</Link>
              <span>/</span>
            </>
          )}
          <span style={{ color: 'var(--ink)' }}>{product.title.slice(0, 60)}</span>
        </div>
      </div>

      <PDPClient
        product={product}
        allImages={allImages}
        variants={variants}
        description={raw.description}
        brandHandle={brandHandle}
        relatedProducts={relatedProducts}
      />
    </div>
  );
}
