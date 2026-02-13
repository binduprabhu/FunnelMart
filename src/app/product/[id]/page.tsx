'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PRODUCTS } from '../../lib/products';
import styles from '../ProductDetails.module.css';
import { useCart } from '../../context/CartContext';
import { useAnalytics } from '../../context/AnalyticsContext';
import { useEffect } from 'react';

export default function ProductPage({ params }: { params: { id: string } }) {
    const { addToCart } = useCart();
    const { track } = useAnalytics();
    const product = PRODUCTS.find(p => p.id === params.id);

    useEffect(() => {
        if (product) {
            track('product_view', {
                product_id: product.id,
                category: product.category,
                price: product.price
            });
        }
    }, [product, track]);

    if (!product) {
        notFound();
    }

    return (
        <div className="container">
            <Link href="/" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
                &larr; Back to Catalog
            </Link>

            <div className={styles.container}>
                <div className={styles.image}>{product.image}</div>

                <div className={styles.details}>
                    <div>
                        <span className={styles.category}>{product.category}</span>
                        <h1 style={{ margin: '0.5rem 0' }}>{product.name}</h1>
                        <p className={styles.price}>${product.price.toFixed(2)}</p>
                    </div>

                    <p className={styles.description}>{product.description}</p>

                    <div className={styles.actions}>
                        <button
                            className="btn"
                            style={{ flex: 1 }}
                            onClick={() => addToCart(product)}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
