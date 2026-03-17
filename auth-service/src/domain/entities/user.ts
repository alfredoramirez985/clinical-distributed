export interface User {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    role: "admin" | "doctor" | "invited";
    createdAt: Date;
}