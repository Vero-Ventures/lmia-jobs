ALTER TABLE "job_postings" ADD COLUMN "stripe_charge_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "job_postings" ADD COLUMN "max_boards" integer DEFAULT 0 NOT NULL;