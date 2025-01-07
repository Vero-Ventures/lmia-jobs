CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"newly_created" boolean DEFAULT true NOT NULL,
	"opted_out" boolean DEFAULT false NOT NULL,
	"activated" boolean DEFAULT false NOT NULL,
	"ignore" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
