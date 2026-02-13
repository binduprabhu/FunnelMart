'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '../context/AnalyticsContext';

export default function PageTracker() {
    const pathname = usePathname();
    const { track } = useAnalytics();
    const prevPathname = useRef<string>('');

    useEffect(() => {
        // Basic page_view logic
        track('page_view', {
            page: pathname,
            referrer: document.referrer || prevPathname.current || ''
        });

        prevPathname.current = pathname;
    }, [pathname, track]);

    return null;
}
