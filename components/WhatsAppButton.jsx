'use client';
import { useState, useEffect } from 'react';

const WHATSAPP_NUMBER = '31850602645'; // +31 85 060 2645
const DISPLAY_NUMBER = '+31 85 060 2645';

export default function WhatsAppButton() {
  // Start collapsed zodat SSR en eerste render matchen
  const [collapsed, setCollapsed] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const alreadySeen = sessionStorage.getItem('wa_collapsed');
    if (!alreadySeen) {
      // Eerste keer deze sessie: toon uitgebreid
      setCollapsed(false);
      const timer = setTimeout(() => {
        setCollapsed(true);
        sessionStorage.setItem('wa_collapsed', '1');
      }, 5000);
      return () => clearTimeout(timer);
    }
    // Anders: blijft collapsed (default)
  }, []);

  if (!mounted) return null;

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=Hallo%2C%20ik%20heb%20een%20vraag%20over%20SkinShopper.`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat met ons op WhatsApp"
      className={`whatsapp-fab ${collapsed ? 'whatsapp-fab--collapsed' : 'whatsapp-fab--expanded'}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="26"
        height="26"
        fill="white"
        style={{ flexShrink: 0 }}
      >
        <path d="M16.003 2.667C8.639 2.667 2.667 8.639 2.667 16c0 2.364.638 4.713 1.852 6.771L2.667 29.333l6.771-1.771A13.267 13.267 0 0 0 16.003 29.333c7.364 0 13.33-5.972 13.33-13.333S23.367 2.667 16.003 2.667zm0 24.267a11.027 11.027 0 0 1-5.617-1.534l-.403-.24-4.013 1.051 1.069-3.91-.264-.415A10.933 10.933 0 0 1 5.001 16c0-6.076 4.927-11.003 11.002-11.003 6.076 0 11.003 4.927 11.003 11.003S22.079 26.934 16.003 26.934zm6.03-8.234c-.33-.165-1.953-.964-2.256-1.073-.303-.11-.523-.165-.743.165-.22.33-.852 1.073-1.044 1.293-.193.22-.385.248-.715.083-.33-.165-1.393-.514-2.652-1.638-.98-.874-1.641-1.955-1.834-2.285-.192-.33-.02-.508.145-.672.149-.148.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.027-.578-.083-.165-.743-1.793-1.018-2.454-.268-.644-.54-.556-.743-.566l-.633-.011c-.22 0-.578.082-.88.413-.303.33-1.155 1.129-1.155 2.754s1.183 3.194 1.348 3.414c.165.22 2.327 3.554 5.64 4.983.788.34 1.403.543 1.882.695.79.251 1.51.216 2.078.131.634-.095 1.953-.799 2.228-1.57.275-.771.275-1.432.192-1.57-.082-.138-.302-.22-.633-.385z"/>
      </svg>

      <div className="whatsapp-fab__label">
        <span style={{ fontSize: 11, fontWeight: 700, color: 'white', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
          {DISPLAY_NUMBER}
        </span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: 400, whiteSpace: 'nowrap' }}>
          WhatsApp &amp; bellen
        </span>
      </div>
    </a>
  );
}
