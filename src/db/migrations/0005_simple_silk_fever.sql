ALTER TABLE "job_postings" ALTER COLUMN "employment_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "job_postings" ADD COLUMN "post_asylum" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "job_postings" ADD COLUMN "post_disabled" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "job_postings" ADD COLUMN "post_indigenous" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "job_postings" ADD COLUMN "post_newcomers" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "job_postings" ADD COLUMN "post_youth" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "job_postings" DROP COLUMN "employment_sub_type";