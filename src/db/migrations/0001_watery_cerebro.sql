ALTER TABLE "stripe_customer" DROP CONSTRAINT "stripe_customer_userId_unique";--> statement-breakpoint
ALTER TABLE "stripe_customer" ADD CONSTRAINT "stripe_customer_user_id_unique" UNIQUE("user_id");