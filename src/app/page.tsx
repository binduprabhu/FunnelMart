import { PRODUCTS } from './lib/products';
import ProductCard from './components/ProductCard';

export default function Catalog() {
  return (
    <div className="container">
      <section style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Welcome to FunnelMart</h1>
        <p style={{ opacity: 0.7 }}>Experience the future of e-commerce analytics.</p>
      </section>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        {PRODUCTS.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
