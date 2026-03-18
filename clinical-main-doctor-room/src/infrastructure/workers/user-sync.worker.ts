import { subscriber } from "../redis/redis";
import type { SyncUserUseCase } from "../../application/use-cases/sync-user.use-case";

const CHANNEL = "user:sync";

export function startUserSyncWorker(syncUserUseCase: SyncUserUseCase): void {
    subscriber.subscribe(CHANNEL, (err) => {
        if (err) {
            console.error(`[UserSyncWorker] Failed to subscribe to ${CHANNEL}:`, err.message);
            return;
        }
        console.log(`[UserSyncWorker] Subscribed to channel "${CHANNEL}"`);
    });

    subscriber.on("message", async (channel, message) => {
        if (channel !== CHANNEL) return;

        try {
            const userData = JSON.parse(message);
            await syncUserUseCase.execute(userData);
        } catch (err) {
            console.error("[UserSyncWorker] Error processing message:", err);
        }
    });
}
