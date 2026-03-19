import Redis from 'ioredis';

const redis = new Redis('redis://localhost:6379');
const CHANNEL = 'user:sync';
const envelope = {
    eventId: 'evt_' + Math.random().toString(36).substring(7),
    aggregateType: 'user',
    aggregateId: 'usr_12345',
    eventType: 'UserRegistered',
    payload: { email: 'test@example.com' },
    timestamp: new Date().toISOString()
};

async function run() {
    await redis.publish(CHANNEL, JSON.stringify(envelope));
    console.log('Published test event to', CHANNEL);
    redis.disconnect();
}
run();
