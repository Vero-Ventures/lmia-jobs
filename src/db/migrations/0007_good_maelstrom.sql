ALTER TABLE "job_postings" RENAME COLUMN "hiring_organization" TO "organization_name";--> statement-breakpoint
ALTER TABLE "job_postings" RENAME COLUMN "address_region" TO "region";--> statement-breakpoint
ALTER TABLE "job_postings" RENAME COLUMN "address_locality" TO "city";--> statement-breakpoint
ALTER TABLE "job_postings" RENAME COLUMN "street_address" TO "address";--> statement-breakpoint
ALTER TABLE "job_postings" RENAME COLUMN "comp_time_unit" TO "payment_type";--> statement-breakpoint
ALTER TABLE "job_postings" RENAME COLUMN "min_comp_value" TO "min_pay_value";--> statement-breakpoint
ALTER TABLE "job_postings" RENAME COLUMN "max_comp_value" TO "max_pay_value";--> statement-breakpoint
ALTER TABLE "job_postings" RENAME COLUMN "valid_through" TO "expires_at";--> statement-breakpoint
ALTER TABLE "job_postings" ALTER COLUMN "post_asylum" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "job_postings" ALTER COLUMN "post_disabled" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "job_postings" ALTER COLUMN "post_indigenous" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "job_postings" ALTER COLUMN "post_newcomers" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "job_postings" ALTER COLUMN "post_youth" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "job_postings" DROP COLUMN "date_posted";