import ContactForm from './ContactForm';
import Link from 'next/link';

export const metadata = {
  title: 'Contact — SKINSHOPPER',
  description: 'Heb je een vraag over je bestelling, een product of iets anders? Neem contact op met SkinShopper. We reageren binnen 1–2 werkdagen.',
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section style={{ background: 'var(--bg-sunken)', padding: '56px 0 40px', borderBottom: '1px solid var(--border)' }}>
        <div className="container-wide">
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 16, display: 'flex', gap: 8 }}>
            <Link href="/" style={{ color: 'var(--ink-3)' }}>Home</Link>
            <span>/</span>
            <span>Contact</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.05, marginBottom: 12 }}>Contact</h1>
          <p style={{ fontSize: 15, color: 'var(--ink-3)', maxWidth: 480 }}>
            Vragen over je bestelling, een product of iets anders? We reageren binnen 1–2 werkdagen.
          </p>
        </div>
      </section>

      <div className="container-wide contact-grid" style={{ padding: '56px 32px 80px', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64 }}>

        {/* Left — info */}
        <div>
          <div className="eyebrow" style={{ marginBottom: 24 }}>Contactgegevens</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>E-mail</div>
              <a href="mailto:info@skinshopper.nl" style={{ fontSize: 15, color: 'var(--ink-2)', textDecoration: 'none' }}>
                info@skinshopper.nl
              </a>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Telefoon / WhatsApp</div>
              <a href="tel:+31850602645" style={{ fontSize: 15, color: 'var(--ink-2)', textDecoration: 'none' }}>
                +31 85 060 2645
              </a>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Reactietijd</div>
              <p style={{ fontSize: 15, color: 'var(--ink-2)', margin: 0 }}>1–2 werkdagen</p>
            </div>

            <div style={{ paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Veelgestelde vragen</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link href="/policies/shipping-policy" style={{ fontSize: 14, color: 'var(--ink-3)', textDecoration: 'none' }}>Hoe lang duurt de levering? →</Link>
                <Link href="/policies/refund-policy" style={{ fontSize: 14, color: 'var(--ink-3)', textDecoration: 'none' }}>Hoe retourneer ik een product? →</Link>
                <Link href="/policies/privacy-policy" style={{ fontSize: 14, color: 'var(--ink-3)', textDecoration: 'none' }}>Privacy en gegevens →</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <ContactForm />
      </div>
    </>
  );
}
