'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAnalytics } from '../context/AnalyticsContext';
import styles from './Checkout.module.css';

export default function CheckoutPage() {
    const { totalValue, totalItems, clearCart } = useCart();
    const { track } = useAnalytics();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
    const [failPurchase, setFailPurchase] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCompletePurchase = async () => {
        setIsProcessing(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsProcessing(false);

        if (failPurchase) {
            track('purchase_failed', {
                cart_value: totalValue,
                items_count: totalItems,
                payment_method: paymentMethod,
                reason: 'simulated_failure'
            });
            alert('Purchase Failed: Simulated error occurred.');
        } else {
            const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

            track('purchase', {
                order_id: orderId,
                cart_value: totalValue,
                items_count: totalItems,
                payment_method: paymentMethod,
                discount: 0
            });

            clearCart();
            router.push(`/order/success?order_id=${orderId}&total=${totalValue.toFixed(2)}`);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <h1 style={{ marginBottom: '2rem' }}>Checkout</h1>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <section>
                    <h3 style={{ marginBottom: '1rem' }}>1. Payment Method</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === 'card'}
                                onChange={() => setPaymentMethod('card')}
                            />
                            <span>Credit Card</span>
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === 'paypal'}
                                onChange={() => setPaymentMethod('paypal')}
                            />
                            <span>PayPal</span>
                        </label>
                    </div>
                </section>

                <section>
                    <h3 style={{ marginBottom: '1rem' }}>2. Simulation Settings</h3>
                    <label className={styles.toggleLabel}>
                        <input
                            type="checkbox"
                            checked={failPurchase}
                            onChange={(e) => setFailPurchase(e.target.checked)}
                        />
                        <span>Fail purchase for realism</span>
                    </label>
                </section>

                <section style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                        <span>Order Total:</span>
                        <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>${totalValue.toFixed(2)}</span>
                    </div>
                    <button
                        className="btn"
                        style={{ width: '100%' }}
                        onClick={handleCompletePurchase}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Complete Purchase'}
                    </button>
                </section>
            </div>
        </div>
    );
}
