'use client';

import { useState, useEffect } from 'react';
import styles from './Debug.module.css';
import { AnalyticsEvent } from '../lib/types';

export default function DebugPage() {
    const [events, setEvents] = useState<AnalyticsEvent[]>([]);

    // Simulated internal event list for Chunk 1
    useEffect(() => {
        // In actual implementation, we will fetch from a global store or window object
        const savedEvents = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('fm_events') || '[]') : [];
        setEvents(savedEvents.slice(-20).reverse());
    }, []);

    const clearEvents = () => {
        localStorage.setItem('fm_events', '[]');
        setEvents([]);
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Event Debugger</h1>
                <button className="btn btn-secondary" onClick={clearEvents}>Clear Log</button>
            </div>

            <div className={styles.log}>
                {events.length === 0 ? (
                    <p style={{ opacity: 0.5, textAlign: 'center', padding: '2rem' }}>No events emitted yet.</p>
                ) : (
                    events.map((event, idx) => (
                        <div key={idx} className={styles.eventCard}>
                            <div className={styles.eventHeader}>
                                <span className={styles.eventName}>{event.event_name}</span>
                                <span className={styles.eventTime}>{new Date(event.event_time).toLocaleTimeString()}</span>
                            </div>
                            <pre className={styles.eventBody}>
                                {JSON.stringify(event.properties, null, 2)}
                            </pre>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
