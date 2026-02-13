'use client';

import Link from 'next/link';
import styles from './Header.module.css';
import { useCart } from '../context/CartContext';

export default function Header() {
    const { totalItems } = useCart();

    return (
        <header className={styles.header}>
            <div className={`container ${styles.nav}`}>
                <Link href="/" className={styles.logo}>
                    FunnelMart
                </Link>

                <nav className={styles.links}>
                    <Link href="/" className={styles.link}>
                        Catalog
                    </Link>
                    <Link href="/cart" className={`${styles.link} ${styles.cart}`}>
                        Cart <span className={styles.badge}>{totalItems}</span>
                    </Link>
                    <Link href="/debug" className={styles.link}>
                        Debug
                    </Link>
                </nav>
            </div>
        </header>
    );
}
