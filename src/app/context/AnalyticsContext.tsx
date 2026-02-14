'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AnalyticsEvent } from '../lib/types';

interface AnalyticsContextType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    track: (eventName: AnalyticsEvent['event_name'], properties?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

const APP_VERSION = '0.1.0';

const getOrCreateUserId = (): string => {
    if (typeof window === 'undefined') return 'server_side';
    let id = localStorage.getItem('ff_user_id');
    if (!id || id.trim() === '') {
        id = `anon_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('ff_user_id', id);
    }
    return id;
};

const getOrCreateSessionId = (): string => {
    if (typeof window === 'undefined') return 'server_side';
    let id = sessionStorage.getItem('ff_session_id');
    if (!id || id.trim() === '') {
        id = `sess_${Math.random().toString(36).substring(2, 15)}`;
        sessionStorage.setItem('ff_session_id', id);
    }
    return id;
};

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const [, setUserId] = useState<string>('');
    const [, setSessionId] = useState<string>('');
    const [utms, setUtms] = useState<Record<string, string>>({});

    useEffect(() => {
        setUserId(getOrCreateUserId());
        setSessionId(getOrCreateSessionId());

        const urlParams = new URLSearchParams(window.location.search);
        const newUtms: Record<string, string> = {};
        ['utm_source', 'utm_medium', 'utm_campaign'].forEach(key => {
            const val = urlParams.get(key);
            if (val) newUtms[key] = val;
        });

        let savedUtms = JSON.parse(sessionStorage.getItem('ff_utms') || '{}');
        if (Object.keys(newUtms).length > 0) {
            savedUtms = { ...savedUtms, ...newUtms };
            sessionStorage.setItem('ff_utms', JSON.stringify(savedUtms));
        }
        setUtms(savedUtms);
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const track = async (eventName: AnalyticsEvent['event_name'], properties: Record<string, any> = {}) => {
        const uId = getOrCreateUserId();
        const sId = getOrCreateSessionId();

        if (!uId || !sId) {
            console.error('[Analytics Safeguard] Aborted event emission due to missing IDs:', { eventName, uId, sId });
            return;
        }

        const event: AnalyticsEvent = {
            event_id: uuidv4(),
            event_name: eventName,
            event_time: new Date().toISOString(),
            user_id: uId,
            session_id: sId,
            device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
            country: Intl.DateTimeFormat().resolvedOptions().timeZone,
            utm_source: utms.utm_source || null,
            utm_medium: utms.utm_medium || null,
            utm_campaign: utms.utm_campaign || null,
            app_version: APP_VERSION,
            properties: properties
        };

        const existingLogs = JSON.parse(localStorage.getItem('fm_events') || '[]');
        localStorage.setItem('fm_events', JSON.stringify([...existingLogs.slice(-49), event]));

        try {
            await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
            });
        } catch (err) {
            console.error('Failed to emit event to Kafka:', err);
        }
    };

    return (
        <AnalyticsContext.Provider value={{ track }}>
            {children}
        </AnalyticsContext.Provider>
    );
}

export function useAnalytics() {
    const context = useContext(AnalyticsContext);
    if (context === undefined) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
}
