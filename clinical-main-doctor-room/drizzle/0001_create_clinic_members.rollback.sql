ALTER TABLE "clinic_members" DROP CONSTRAINT IF EXISTS "clinic_members_user_id_users_id_fk";
ALTER TABLE "clinic_members" DROP CONSTRAINT IF EXISTS "clinic_members_clinic_id_clinics_id_fk";
DROP TABLE IF EXISTS "clinic_members";
