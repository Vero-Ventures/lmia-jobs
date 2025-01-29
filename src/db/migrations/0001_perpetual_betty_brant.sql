ALTER TABLE "job_posting" ALTER COLUMN "hidden" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "public"."job_posting" ALTER COLUMN "payment_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."payment_type";--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('Hourly', 'Salary');--> statement-breakpoint
ALTER TABLE "public"."job_posting" ALTER COLUMN "payment_type" SET DATA TYPE "public"."payment_type" USING "payment_type"::"public"."payment_type";