ALTER TABLE "job_posting" ADD COLUMN "min_work_hours" numeric(4, 1) NOT NULL;--> statement-breakpoint
ALTER TABLE "job_posting" DROP COLUMN "work_hours";