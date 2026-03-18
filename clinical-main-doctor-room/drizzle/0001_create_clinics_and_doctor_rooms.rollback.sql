ALTER TABLE "doctor_rooms" DROP CONSTRAINT IF EXISTS "doctor_rooms_clinic_id_clinics_id_fk";
DROP TABLE IF EXISTS "doctor_rooms";
DROP TABLE IF EXISTS "clinics";
