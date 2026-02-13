import dotenv from 'dotenv';
import { Kafka } from 'kafkajs';
import { Pool } from 'pg';

dotenv.config({ path: '.env.local' });

const kafka = new Kafka({
    clientId: 'funnel-mart-consumer',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const consumer = kafka.consumer({ groupId: 'funnel-mart-group' });

async function run() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'ff.events', fromBeginning: true });

    console.log('Consumer connected to Kafka and subscribed to ff.events');

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const value = message.value?.toString();
            if (!value) return;

            try {
                const event = JSON.parse(value);
                const ingestion_time = new Date().toISOString();

                const queryText = `
          INSERT INTO raw_events (
            event_id, event_name, event_time, received_at, ingestion_time, 
            user_id, session_id, device_type, timezone, 
            utm_source, utm_medium, utm_campaign, 
            app_version, properties, schema_version,
            kafka_topic, kafka_partition, kafka_offset
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          ON CONFLICT (event_id) DO NOTHING
        `;

                const values = [
                    event.event_id,
                    event.event_name,
                    event.event_time,
                    event.received_at,
                    ingestion_time,
                    event.user_id,
                    event.session_id,
                    event.device_type,
                    event.country, // timezone stored here
                    event.utm_source,
                    event.utm_medium,
                    event.utm_campaign,
                    event.app_version,
                    JSON.stringify(event.properties),
                    event.schema_version || 1,
                    topic,
                    partition,
                    message.offset
                ];

                await pool.query(queryText, values);
                console.log(`[INGESTED] ${event.event_name} | ${event.event_id}`);

            } catch (err) {
                console.error('Failed to process message:', err);
                // TODO: Could send to DLQ here if parsing failed
            }
        },
    });
}

run().catch(console.error);

process.on('SIGINT', async () => {
    await consumer.disconnect();
    await pool.end();
    process.exit(0);
});
