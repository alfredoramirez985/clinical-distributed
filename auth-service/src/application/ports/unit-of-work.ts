import type { UserRepository } from "../../domain/repositories/user.repository";
import type { OutboxRepository } from "../../infrastructure/repositories/outbox.repository";

export interface EventPublisher {
    publish(aggregateType: string, aggregateId: string, eventType: string, payload: Record<string, unknown>): void;
}

export interface Repositories {
    userRepo: UserRepository;
    outboxRepo: OutboxRepository;
    events: EventPublisher;
}

export interface UnitOfWork {
    execute<T>(work: (repos: Repositories) => Promise<T>): Promise<T>;
}
