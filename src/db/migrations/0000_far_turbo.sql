CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"id_token" text,
	"scope" text
);
--> statement-breakpoint
CREATE TABLE "job_postings" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_title" text NOT NULL,
	"hiring_organization" text NOT NULL,
	"date_posted" date NOT NULL,
	"employment_type" text NOT NULL,
	"address_region" text NOT NULL,
	"address_locality" text NOT NULL,
	"street_address" text,
	"comp_time_unit" text NOT NULL,
	"min_comp_value" integer NOT NULL,
	"max_comp_value" integer,
	"work_hours" integer,
	"start_time" date,
	"vacancies" integer,
	"description" text NOT NULL,
	"email" text NOT NULL,
	"language" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"valid_through" text NOT NULL,
	"post_asylum" boolean DEFAULT true NOT NULL,
	"post_disabled" boolean DEFAULT true NOT NULL,
	"post_indigenous" boolean DEFAULT true NOT NULL,
	"post_newcomers" boolean DEFAULT true NOT NULL,
	"post_youth" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"expires_at" timestamp NOT NULL,
	"user_agent" text,
	"ip_address" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_mailing" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"temp_password" text,
	"newly_created" boolean DEFAULT true NOT NULL,
	"opted_out" boolean DEFAULT false NOT NULL,
	"activated" boolean DEFAULT false NOT NULL,
	"ignore" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_mailing" ADD CONSTRAINT "user_mailing_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;