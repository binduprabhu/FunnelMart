export interface AnalyticsEvent {
    event_id: string;
    event_name: 'page_view' | 'product_view' | 'add_to_cart' | 'remove_from_cart' | 'checkout_start' | 'purchase' | 'purchase_failed';
    event_time: string;
    user_id: string;
    session_id: string;
    device_type: string;
    country: string;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    app_version: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: Record<string, any>; // properties can be any JSON-serializable value
    received_at?: string;
    schema_version?: number;
}
