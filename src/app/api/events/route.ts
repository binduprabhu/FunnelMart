import { NextResponse } from 'next/server';
import { producer, connectProducer } from '../../lib/kafka';
import { AnalyticsEvent } from '../../lib/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED_EVENTS = [
    'page_view',
    'product_view',
    'add_to_cart',
    'remove_from_cart',
    'checkout_start',
    'purchase',
    'purchase_failed'
];

function validateEvent(event: Partial<AnalyticsEvent>) {
    const errors: string[] = [];

    if (!event.event_id || !UUID_REGEX.test(event.event_id)) errors.push('invalid_event_id');
    if (!event.event_name || !ALLOWED_EVENTS.includes(event.event_name)) errors.push('invalid_event_name');
    if (!event.event_time || isNaN(Date.parse(event.event_time))) errors.push('invalid_event_time');
    if (!event.user_id || typeof event.user_id !== 'string') errors.push('invalid_user_id');
    if (!event.session_id || typeof event.session_id !== 'string') errors.push('invalid_session_id');
    if (!event.properties || typeof event.properties !== 'object') errors.push('invalid_properties');

    // Per-event required properties
    const p = event.properties || {};
    switch (event.event_name) {
        case 'product_view':
            if (!p.product_id || !p.category || p.price === undefined) errors.push('missing_product_details');
            break;
        case 'add_to_cart':
        case 'remove_from_cart':
            if (!p.product_id || !p.category || p.price === undefined || p.quantity === undefined || p.cart_value === undefined) {
                errors.push('missing_cart_details');
            }
            break;
        case 'checkout_start':
            if (p.cart_value === undefined || p.items_count === undefined) errors.push('missing_checkout_details');
            break;
        case 'purchase':
            if (!p.order_id || p.cart_value === undefined || p.items_count === undefined || !p.payment_method) {
                errors.push('missing_purchase_details');
            }
            break;
        case 'purchase_failed':
            if (p.cart_value === undefined || p.items_count === undefined || !p.payment_method || !p.reason) {
                errors.push('missing_failure_details');
            }
            break;
    }

    // Sanity checks
    if (p.payment_method && !['card', 'paypal'].includes(p.payment_method)) errors.push('invalid_payment_method');
    if (p.cart_value !== undefined && p.cart_value < 0) errors.push('negative_cart_value');
    if ((event.event_name === 'checkout_start' || event.event_name === 'purchase') && p.items_count <= 0) {
        errors.push('invalid_items_count');
    }

    return errors;
}

export async function POST(req: Request) {
    try {
        const event = await req.json();

        // 1. Validate
        const errors = validateEvent(event);
        if (errors.length > 0) {
            console.warn('Event Validation Failed:', errors, event);

            // OPTIONAL: Send to DLQ
            await sendToKafka('ff.dlq', event.user_id, {
                dlq_time: new Date().toISOString(),
                dlq_reason: `validation_failed: ${errors.join(', ')}`,
                original_event: event
            });

            return NextResponse.json({ success: false, errors }, { status: 400 });
        }

        // 2. Normalize
        const normalizedEvent = {
            ...event,
            schema_version: 1,
            received_at: new Date().toISOString()
        };

        // 3. Produce to Kafka (Asynchronous - don't block the response)
        sendToKafka('ff.events', event.user_id, normalizedEvent);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing event:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

async function sendToKafka(topic: string, key: string, value: unknown) {
    try {
        await connectProducer();
        await producer.send({
            topic,
            messages: [{
                key,
                value: JSON.stringify(value)
            }]
        });
    } catch (err) {
        console.error(`Failed to send to Kafka topic ${topic} (connection refused):`, err);
        // We don't throw here to avoid 500 errors in the frontend.
        // The event is still logged locally in the browser's debug tool.
    }
}
