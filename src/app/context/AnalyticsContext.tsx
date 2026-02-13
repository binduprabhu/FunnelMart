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

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const [userId, setUserId] = useState<string>('');
    const [sessionId, setSessionId] = useState<string>('');
    const [utms, setUtms] = useState<Record<string, string>>({});

    useEffect(() => {
        // 1. User ID (LocalStorage)
        let storedUserId = localStorage.getItem('fm_user_id');
        if (!storedUserId) {
            storedUserId = `anon_${Math.random().toString(36).substring(2, 11)}`;
            localStorage.setItem('fm_user_id', storedUserId);
        }
        setUserId(storedUserId);

        // 2. Session ID (SessionStorage)
        let storedSessionId = sessionStorage.getItem('fm_session_id');
        if (!storedSessionId) {
            storedSessionId = `sess_${Math.random().toString(36).substring(2, 11)}`;
            sessionStorage.setItem('fm_session_id', storedSessionId);
        }
        setSessionId(storedSessionId);

        // 3. UTMs (URL -> SessionStorage)
        const urlParams = new URLSearchParams(window.location.search);
        const newUtms: Record<string, string> = {};
        ['utm_source', 'utm_medium', 'utm_campaign'].forEach(key => {
            const val = urlParams.get(key);
            if (val) newUtms[key] = val;
        });

        let savedUtms = JSON.parse(sessionStorage.getItem('fm_utms') || '{}');
        if (Object.keys(newUtms).length > 0) {
            savedUtms = { ...savedUtms, ...newUtms };
            sessionStorage.setItem('fm_utms', JSON.stringify(savedUtms));
        }
        setUtms(savedUtms);
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const track = async (eventName: AnalyticsEvent['event_name'], properties: Record<string, any> = {}) => {
        const event = {
            event_id: uuidv4(),
            event_name: eventName,
            event_time: new Date().toISOString(),
            user_id: userId,
            session_id: sessionId,
            device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
            country: Intl.DateTimeFormat().resolvedOptions().timeZone,
            utm_source: utms.utm_source || null,
            utm_medium: utms.utm_medium || null,
            utm_campaign: utms.utm_campaign || null,
            app_version: APP_VERSION,
            properties: properties
        };

        // 1. Store in local debug log
        const existingLogs = JSON.parse(localStorage.getItem('fm_events') || '[]');
        localStorage.setItem('fm_events', JSON.stringify([...existingLogs, event]));

        // 2. Send to backend (to be handled in Chunk 2/3)
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
