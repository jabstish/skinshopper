import { getProductsByCollection, normalizeProduct, BRAND_COLLECTIONS } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BrandClient from './BrandClient';

// Authentic typographic logo per brand
function BrandLogo({ handle, wordmark }) {
  const styles = {
    'hugo-boss': {
      fontFamily: '"Arial Black", Helvetica, sans-serif',
      fontWeight: 900,
      fontSize: 'clamp(28px, 5vw, 52px)',
      letterSpacing: '0.05em',
      color: 'rgba(0,0,0,0.85)',
    },
    'calvin-klein': {
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: 300,
      fontSize: 'clamp(14px, 2.5vw, 22px)',
      letterSpacing: '0.5em',
      color: 'rgba(0,0,0,0.8)',
      textTransform: 'uppercase',
    },
    'la-roche-posay': {
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontWeight: 700,
      fontSize: 'clamp(10px, 1.5vw, 14px)',
      letterSpacing: '0.25em',
      color: 'rgba(0,0,0,0.8)',
      textTransform: 'uppercase',
      lineHeight: 1.8,
      textAlign: 'center',
    },
    'vichy': {
      fontFamily: '"Arial Black", sans-serif',
      fontWeight: 900,
      fontSize: 'clamp(32px, 6vw, 64px)',
      letterSpacing: '0.35em',
      color: 'rgba(0,0,0,0.8)',
    },
    'skinceuticals': {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 'clamp(22px, 4vw, 40px)',
      fontWeight: 500,
      letterSpacing: '0.02em',
      color: 'rgba(0,0,0,0.8)',
    },
    'lancaster': {
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontWeight: 700,
      fontSize: 'clamp(18px, 3vw, 30px)',
      letterSpacing: '0.28em',
      color: 'rgba(0,0,0,0.8)',
      textTransform: 'uppercase',
    },
    'gucci': {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 'clamp(28px, 5vw, 56px)',
      letterSpacing: '0.12em',
      color: 'rgba(0,0,0,0.8)',
    },
  };

  const style = styles[handle] ?? {
    fontFamily: 'var(--font-body)',
    fontWeight: 800,
    fontSize: 'clamp(20px, 3vw, 36px)',
    letterSpacing: '-0.01em',
    color: 'rgba(0,0,0,0.7)',
  };

  // Special multi-line logo for La Roche-Posay
  if (handle === 'la-roche-posay') {
    return (
      <div style={{ textAlign: 'center', padding: '16px 24px' }}>
        <div style={style}>
          LA ROCHE-POSAY
        </div>
        <div style={{ ...style, fontSize: 'clamp(8px, 1vw, 10px)', letterSpacing: '0.3em', marginTop: 4, opacity: 0.6 }}>
          LABORATOIRE DERMATOLOGIQUE
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 32px', textAlign: 'center', ...style }}>
      {wordmark}
    </div>
  );
}

export const revalidate = 120;

const BRAND_DATA = {
  'la-roche-posay': {
    tagline: 'Aanbevolen door dermatologen',
    since: 'Sinds 1975',
    country: 'Frankrijk',
    desc: 'La Roche-Posay ontwikkelt huidverzorging in samenwerking met dermatologen wereldwijd. Hun thermaal water vormt de basis van elk product — klinisch getest, bewezen effectief.',
    story: 'Elk product dat La Roche-Posay lanceert doorloopt jaren van klinisch onderzoek. De samenwerking met meer dan 25.000 dermatologen wereldwijd maakt het merk tot de meest aanbevolen huidverzorgingslijn ter wereld.',
    heroBg: 'linear-gradient(135deg, #f4f9fc 0%, #dceaf3 60%, #b3d4e8 100%)',
  },
  'vichy': {
    tagline: 'Mineralen die de huid voeden',
    since: 'Sinds 1931',
    country: 'Frankrijk',
    desc: 'Vichy combineert vulkanische mineralen uit de bronnen van Vichy met moderne dermatologie. Bekend om Mineral 89 en de Neovadiol-lijn voor de huid na de menopauze.',
    story: 'De bronnen van Vichy leveren mineraalwater met een unieke samenstelling van 15 mineralen en spoorelementen. Dit water vormt de basis van alle Vichy producten — direct van de bron naar jouw huid.',
    heroBg: 'linear-gradient(135deg, #f0f8fc 0%, #c2e0e8 60%, #7fb8c4 100%)',
  },
  'skinceuticals': {
    tagline: 'Klinische skincare, bewezen formules',
    since: 'Sinds 1997',
    country: 'Verenigde Staten',
    desc: 'Door dermatologen ontwikkelde antioxidant serums en actieve formules. Hoog-geconcentreerd en bewezen via klinische studies — het merk dat professionals vertrouwen.',
    story: 'SkinCeuticals werd opgericht op basis van één baanbrekende ontdekking: de optimale combinatie van vitaminen voor maximale antioxidant bescherming. Vandaag worden de formules wereldwijd gebruikt in medische klinieken.',
    heroBg: 'linear-gradient(135deg, #f4f4f0 0%, #d8d2c2 60%, #8a7f6b 100%)',
  },
  'hugo-boss': {
    tagline: 'Vakmanschap in geur',
    since: 'Sinds 1985 (parfums)',
    country: 'Duitsland',
    desc: 'De Hugo Boss parfumcollectie staat voor moderne mannelijkheid en tijdloze elegantie — van BOSS Bottled tot The Scent.',
    story: 'Van het iconische BOSS Bottled tot de moderne The Scent-lijn — Hugo Boss parfums vertellen het verhaal van de zelfverzekerde man. Elke geur is een compositie van de fijnste ingrediënten, vakkundig samengesteld door de beste parfumeurs ter wereld.',
    heroBg: 'linear-gradient(135deg, #f7f3ee 0%, #e3d4c0 60%, #4a3f35 100%)',
  },
  'calvin-klein': {
    tagline: 'Minimalisme als signature',
    since: 'Sinds 1968',
    country: 'Verenigde Staten',
    desc: 'Iconische parfums die de tijdgeest vangen — van CK One tot Eternity. Pure, herkenbare composities die decennialang relevant blijven.',
    story: 'Calvin Klein redefinieert parfumkunst als een statement van vrijheid en individualiteit. CK One werd het eerste unisex parfum dat een generatie definieerde. Die geest van vrijheid en minimalisme ademt in elke nieuwe geur.',
    heroBg: 'linear-gradient(135deg, #f5f5f5 0%, #d4d4d4 60%, #555555 100%)',
  },
  'lancaster': {
    tagline: 'Pionier in zonbescherming',
    since: 'Sinds 1946',
    country: 'Monaco',
    desc: 'Lancaster is de uitvinder van de moderne aftersun en pionier in geavanceerde zonbeschermingstechnologie. Geboren aan de Côte d\'Azur.',
    story: 'Opgericht in Monaco in 1946, combineert Lancaster de glamour van de Rivièra met wetenschappelijke innovatie in zonbescherming. Van de eerste aftersun-formule tot de huidige Total Tan-technologie — Lancaster definieert elk decennium opnieuw.',
    heroBg: 'linear-gradient(135deg, #fff4e8 0%, #fcd5a0 60%, #ee6c1d 100%)',
  },
  'gucci': {
    tagline: 'Luxe in elke noot',
    since: 'Sinds 1921',
    country: 'Italië',
    desc: 'Gucci parfums zijn de geur van Italiaanse luxe — rijke composities die klassieke parfumtradities combineren met het onmiskenbare huis-DNA.',
    story: 'Gucci heeft de kunst van het parfumeren altijd benaderd als het verlengstuk van mode. Elke geur vertelt een verhaal over Italiaanse ambacht, weelderige materialen en de tijdloze stijl die het huis definieerde.',
    heroBg: 'linear-gradient(135deg, #f9f3ec 0%, #d4bc9a 60%, #6b4a2a 100%)',
  },
};

export async function generateMetadata({ params }) {
  const brand = BRAND_COLLECTIONS.find((b) => b.handle === params.handle);
  if (!brand) return { title: 'Merk — SKINSHOPPER' };
  const data = BRAND_DATA[params.handle];
  const category = brand.category === 'parfum' ? 'parfum' : 'huidverzorging';
  const description = data?.desc
    ? data.desc.slice(0, 155)
    : `Koop originele ${brand.name} ${category} bij SkinShopper. 100% authentiek, scherpe prijzen en gratis verzending vanaf €60.`;
  return {
    title: `${brand.name} ${category === 'parfum' ? 'Parfum' : 'Huidverzorging'} kopen — SKINSHOPPER`,
    description,
    openGraph: {
      title: `${brand.name} — SKINSHOPPER`,
      description,
    },
  };
}

export default async function BrandPage({ params }) {
  const brand = BRAND_COLLECTIONS.find((b) => b.handle === params.handle);
  if (!brand) notFound();

  const col = await getProductsByCollection(params.handle, 100).catch(() => null);
  const products = col?.products?.edges?.map((e) => normalizeProduct(e.node)) ?? [];

  const data = BRAND_DATA[params.handle] ?? {
    tagline: brand.name,
    since: '—',
    country: '—',
    desc: `Ontdek het volledige ${brand.name} assortiment — allemaal 100% origineel.`,
    story: `Bij SkinShopper voeren we het volledige ${brand.name} assortiment direct van de officiële distributeur — gegarandeerd authentiek.`,
    heroBg: 'linear-gradient(135deg, #f7f3ee 0%, #e3d4c0 60%, #8b6f47 100%)',
  };

  const categoryHandle = brand.category === 'parfum' ? 'parfum' : 'huidverzorging';

  return (
    <div>
      {/* Brand hero */}
      <section style={{ background: data.heroBg, position: 'relative', overflow: 'hidden' }}>
        <div className="container-wide" style={{ padding: '80px 32px 100px', position: 'relative', zIndex: 2 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--ink-3)', marginBottom: 32 }}>
            <Link href="/" style={{ color: 'var(--ink-3)' }}>Home</Link>
            <span>/</span>
            <Link href={`/shop/${categoryHandle}`} style={{ color: 'var(--ink-3)' }}>
              {brand.category === 'parfum' ? 'Parfum' : 'Huidverzorging'}
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>{brand.name}</span>
          </div>

          <div className="brand-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'end' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Shop het volledige merk</div>
              <h1 style={{
                fontSize: 'clamp(56px, 9vw, 140px)',
                lineHeight: 0.9,
                fontFamily: 'var(--font-body)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: 24,
              }}>
                {brand.wordmark}
              </h1>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 24,
                lineHeight: 1.2,
                fontStyle: 'italic',
                maxWidth: 520,
                marginBottom: 20,
                color: 'var(--ink-2)',
              }}>
                "{data.tagline}"
              </p>
              <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6, maxWidth: 540, marginBottom: 32 }}>
                {data.desc}
              </p>
              <div style={{ display: 'flex', gap: 32, fontSize: 12, color: 'var(--ink-3)', flexWrap: 'wrap' }}>
                <div className="eyebrow">{data.since}</div>
                <div style={{ width: 1, height: 16, background: 'var(--border-strong)', alignSelf: 'center' }} />
                <div className="eyebrow">{data.country}</div>
                <div style={{ width: 1, height: 16, background: 'var(--border-strong)', alignSelf: 'center' }} />
                <div className="eyebrow">{products.length} producten</div>
              </div>
            </div>

            {/* Brand hero image showcase */}
            <div className="brand-hero-logo-box" style={{ position: 'relative', aspectRatio: '4/5', maxHeight: 480, overflow: 'hidden', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.45)' }}>
              {products[0]?.image ? (
                <Image
                  src={products[0].image}
                  alt={products[0].imageAlt || brand.name}
                  fill
                  priority
                  sizes="(max-width: 900px) 0px, 40vw"
                  style={{ objectFit: 'contain', padding: 32 }}
                />
              ) : null}
              {/* Bottom brand wordmark bar */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '40px 24px 24px',
                background: 'linear-gradient(transparent, rgba(255,255,255,0.92) 50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              }}>
                <BrandLogo handle={params.handle} wordmark={brand.wordmark} />
                <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 13, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.04em' }}>
                  {data.tagline}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand stats bar */}
      <section style={{ background: 'var(--bg-elev)', padding: '24px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container-wide">
          <div className="brand-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            {[
              { icon: '✦', title: '100% origineel', sub: 'Direct van leverancier' },
              { icon: '★', title: '4.8 sterren', sub: 'Op basis van 1.200+ reviews' },
              { icon: '%', title: 'Tot 35% korting', sub: 'Vergeleken met adviesprijs' },
              { icon: '☑', title: 'Snelle levering', sub: 'Vandaag besteld, morgen in huis' },
            ].map((item) => (
              <div key={item.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20, color: 'var(--accent-deep)', lineHeight: 1.2 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product grid */}
      <BrandClient
        products={products}
        brandHandle={params.handle}
        brandName={brand.name}
        category={brand.category}
      />

      {/* Brand story */}
      <section style={{ background: 'var(--bg-sunken)', padding: '80px 0' }}>
        <div className="container-wide" style={{ maxWidth: 720 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Het verhaal achter {brand.name}</div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', marginBottom: 20 }}>
            <em style={{ fontStyle: 'italic' }}>{data.tagline}.</em>
          </h2>
          <p style={{ color: 'var(--ink-3)', fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>{data.story}</p>
          <p style={{ color: 'var(--ink-3)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
            Bij SkinShopper voeren we het volledige {brand.name} assortiment direct van de officiële distributeur — gegarandeerd authentiek, met BTW-bonnen.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href={`/shop/${categoryHandle}`} className="btn">
              Alle {brand.category === 'parfum' ? 'parfums' : 'huidverzorging'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
