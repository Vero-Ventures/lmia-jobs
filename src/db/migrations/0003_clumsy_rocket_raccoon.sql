ALTER TABLE "user_mailing" DROP CONSTRAINT "user_mailing_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "job_posting" ALTER COLUMN "start_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_mailing" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user_mailing" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user_mailing" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "user_mailing" ADD CONSTRAINT "user_mailing_email_unique" UNIQUE("email");