export interface Clinic {
    id: string;
    name: string;
    description: string | null;
    latitude: string | null;
    longitude: string | null;
    logoUrl: string | null;
    createdAt: Date;
}
