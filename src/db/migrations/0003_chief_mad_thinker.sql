CREATE TABLE "subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"stripe_id" text NOT NULL,
	CONSTRAINT "subscription_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "subscription_stripe_id_unique" UNIQUE("stripe_id")
);
--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;