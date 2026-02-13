import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <p>FunnelMart Demo &copy; {new Date().getFullYear()} &mdash; Generates Kafka Events</p>
            </div>
        </footer>
    );
}
