ALTER TABLE "stripe_customer" DROP CONSTRAINT "stripe_customer_stripeId_unique";--> statement-breakpoint
ALTER TABLE "stripe_customer" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "stripe_customer" DROP COLUMN "stripe_id";