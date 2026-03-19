export interface AuditLog {
    id: string;
    eventType: string;
    payload: any;
    source: string;
    timestamp: Date;
}
