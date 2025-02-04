ALTER TABLE "job_posting" ALTER COLUMN "work_hours" SET DATA TYPE numeric(4, 1);--> statement-breakpoint
ALTER TABLE "job_posting" ALTER COLUMN "max_work_hours" SET DATA TYPE numeric(4, 1);--> statement-breakpoint
ALTER TABLE "job_posting" ALTER COLUMN "min_pay_value" SET DATA TYPE numeric(9, 2);--> statement-breakpoint
ALTER TABLE "job_posting" ALTER COLUMN "max_pay_value" SET DATA TYPE numeric(9, 2);