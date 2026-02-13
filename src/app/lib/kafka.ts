import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'funnel-mart-producer',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});

export const producer = kafka.producer();

let isConnected = false;

export async function connectProducer() {
    if (isConnected) return;
    await producer.connect();
    isConnected = true;
    console.log('Kafka Producer Connected');
}

export async function disconnectProducer() {
    await producer.disconnect();
    isConnected = false;
    console.log('Kafka Producer Disconnected');
}
