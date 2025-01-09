ALTER TABLE "account" ALTER COLUMN "provider_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "password" text NOT NULL;