import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const publisher = new Redis(redisUrl);

publisher.on("error", (err) => {
    console.error("[Redis Publisher] Connection error:", err.message);
});

publisher.on("connect", () => {
    console.log("[Redis Publisher] Connected");
});

export async function publishUserEvent(userData: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
}): Promise<void> {
    await publisher.publish("user:sync", JSON.stringify(userData));
    console.log(`[Redis Publisher] Published user:sync event for user ${userData.id}`);
}
