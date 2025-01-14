CREATE TABLE "user_mailing" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"newly_created" boolean DEFAULT true NOT NULL,
	"opted_out" boolean DEFAULT false NOT NULL,
	"activated" boolean DEFAULT false NOT NULL,
	"ignore" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mailing_list" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "mailing_list" CASCADE;--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_mailing" ADD CONSTRAINT "user_mailing_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;