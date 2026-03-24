import { db } from "./database";
import { sql } from "drizzle-orm";

export async function setupOutboxTriggers() {
    console.log("[Postgres] Setting up outbox LISTEN/NOTIFY triggers...");
    
    await db.execute(sql`
        CREATE OR REPLACE FUNCTION notify_outbox_event()
        RETURNS TRIGGER AS $$
        BEGIN
            PERFORM pg_notify('new_outbox_event', NEW.id::text);
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    await db.execute(sql`
        DROP TRIGGER IF EXISTS on_outbox_event_insert ON outbox_events;
        CREATE TRIGGER on_outbox_event_insert
        AFTER INSERT ON outbox_events
        FOR EACH ROW EXECUTE FUNCTION notify_outbox_event();
    `);
    
    console.log("[Postgres] Outbox triggers configured successfully.");
}
