'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');
    const total = searchParams.get('total');

    return (
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
            <h1 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Order Successful!</h1>
            <p style={{ opacity: 0.8, fontSize: '1.25rem', marginBottom: '2rem' }}>
                Thank you for your purchase. Your order has been placed.
            </p>

            <div className="card" style={{ maxWidth: '400px', margin: '0 auto 3rem auto', textAlign: 'left' }}>
                <p style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Order ID:</span>
                    <span style={{ fontWeight: 700 }}>{orderId}</span>
                </p>
                <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Paid:</span>
                    <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>${total}</span>
                </p>
            </div>

            <Link href="/" className="btn">
                Back to Home
            </Link>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>Loading...</div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}
