import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const subscriber = new Redis(redisUrl);

subscriber.on("error", (err) => {
    console.error("[Redis Subscriber] Connection error:", err.message);
});

subscriber.on("connect", () => {
    console.log("[Redis Subscriber] Connected");
});
