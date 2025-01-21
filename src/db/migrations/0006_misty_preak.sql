ALTER TABLE "subscription" RENAME TO "stripeCustomer";--> statement-breakpoint
ALTER TABLE "stripeCustomer" DROP CONSTRAINT "subscription_user_id_unique";--> statement-breakpoint
ALTER TABLE "stripeCustomer" DROP CONSTRAINT "subscription_stripe_id_unique";--> statement-breakpoint
ALTER TABLE "stripeCustomer" DROP CONSTRAINT "subscription_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "stripeCustomer" ADD CONSTRAINT "stripeCustomer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stripeCustomer" ADD CONSTRAINT "stripeCustomer_user_id_unique" UNIQUE("user_id");--> statement-breakpoint
ALTER TABLE "stripeCustomer" ADD CONSTRAINT "stripeCustomer_stripe_id_unique" UNIQUE("stripe_id");