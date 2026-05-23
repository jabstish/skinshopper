import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MiniCart from '@/components/MiniCart';
import Toast from '@/components/Toast';

export const metadata = {
  title: 'SkinShopper — Parfum & Huidverzorging',
  description: 'Authentieke parfum en huidverzorging van La Roche-Posay, Vichy, SkinCeuticals, Hugo Boss. Tot 35% korting.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <MiniCart />
          <Toast />
        </CartProvider>
      </body>
    </html>
  );
}
