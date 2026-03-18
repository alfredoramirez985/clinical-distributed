export interface ClinicMember {
    id: string;
    clinicId: string;
    userId: string;
    role: "admin" | "doctor" | "invited";
    createdAt: Date;
}
