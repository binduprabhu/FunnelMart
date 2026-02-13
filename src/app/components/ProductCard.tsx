import Link from 'next/link';
import { Product } from '../lib/products';
import styles from './ProductCard.module.css';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className={`card ${styles.card}`}>
            <div className={styles.image}>{product.image}</div>
            <div className={styles.info}>
                <span className={styles.category}>{product.category}</span>
                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.price}>${product.price.toFixed(2)}</p>
            </div>
            <div className={styles.footer}>
                <Link href={`/product/${product.id}`} className="btn btn-secondary" style={{ width: '100%' }}>
                    View Details
                </Link>
            </div>
        </div>
    );
}
