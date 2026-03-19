import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
export const subscriberClient = new Redis(redisUrl);
