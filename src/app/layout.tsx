import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import PageTracker from './components/PageTracker';
import { CartProvider } from './context/CartContext';
import { AnalyticsProvider } from './context/AnalyticsContext';

export const metadata: Metadata = {
  title: 'FunnelMart',
  description: 'E-commerce demo for Kafka event generation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider>
          <PageTracker />
          <CartProvider>
            <Header />
            <main style={{ padding: '2rem 0', flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</main>
            <Footer />
          </CartProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
