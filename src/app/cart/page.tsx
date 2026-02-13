'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAnalytics } from '../context/AnalyticsContext';
import styles from './Cart.module.css';

export default function CartPage() {
  const { items, updateQuantity, totalValue, totalItems } = useCart();
  const { track } = useAnalytics();

  const handleCheckoutStart = () => {
    track('checkout_start', {
      cart_value: totalValue,
      items_count: totalItems
    });
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Your Cart is Empty</h1>
        <p style={{ marginBottom: '2rem', opacity: 0.7 }}>Looks like you haven&apos;t added anything yet.</p>
        <Link href="/" className="btn">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={`container ${styles.container}`}>
      <h1 style={{ marginBottom: '2rem' }}>Your Cart</h1>

      <div className={styles.list}>
        {items.map(item => (
          <div key={item.id} className={styles.item}>
            <div className={styles.image}>{item.image}</div>
            <div className={styles.info}>
              <h3>{item.name}</h3>
              <p style={{ color: 'var(--secondary)' }}>${item.price.toFixed(2)}</p>
            </div>
            <div className={styles.controls}>
              <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, -1)}>&minus;</button>
              <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
              <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <div>
          <p style={{ opacity: 0.7, marginBottom: '0.25rem' }}>Total ({totalItems} items)</p>
          <p className={styles.total}>${totalValue.toFixed(2)}</p>
        </div>
        <Link href="/checkout" className="btn" onClick={handleCheckoutStart}>
          Start Checkout
        </Link>
      </div>
    </div>
  );
}
// Note: Fixed a small CSS variable usage in inline style if needed, 
// actually used var(--secondary) in backticks or just string.
// I'll make sure it's valid.
