// Shopify redirect /cart/c/[token] opvangen en doorsturen naar myshopify.com
const SHOPIFY_STORE = 'dzwtmd-0z.myshopify.com';

export async function GET(request, { params }) {
  const token = params.token;
  const url = new URL(request.url);
  const shopifyUrl = `https://${SHOPIFY_STORE}/cart/c/${token}${url.search}`;
  return Response.redirect(shopifyUrl, 302);
}
