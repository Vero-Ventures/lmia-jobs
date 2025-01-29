CREATE TYPE "public"."employment_type" AS ENUM('Full Time', 'Part Time');--> statement-breakpoint
CREATE TYPE "public"."job_board" AS ENUM('accessible', 'asylum', 'indigenous', 'newcomers', 'youth');--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('English', 'French', 'English and French');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('Salary', 'Hourly');--> statement-breakpoint
CREATE TYPE "public"."province" AS ENUM('AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'ON', 'PE', 'QC', 'SK', 'NT', 'NU', 'YT');--> statement-breakpoint
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
CREATE TABLE "job_board_posting" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_board" "job_board" NOT NULL,
	"job_posting_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_posting" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"email" text NOT NULL,
	"title" text NOT NULL,
	"org_name" text NOT NULL,
	"province" "province" NOT NULL,
	"city" text NOT NULL,
	"address" text,
	"start_date" date,
	"vacancies" integer,
	"employment_type" "employment_type" NOT NULL,
	"work_hours" integer,
	"payment_type" "payment_type" NOT NULL,
	"min_pay_value" integer NOT NULL,
	"max_pay_value" integer,
	"description" text NOT NULL,
	"language" "language" NOT NULL,
	"hidden" boolean,
	"payment_confirmed" boolean NOT NULL,
	"expires_at" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
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
CREATE TABLE "stripe_customer" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"stripe_id" text NOT NULL,
	CONSTRAINT "stripe_customer_userId_unique" UNIQUE("user_id"),
	CONSTRAINT "stripe_customer_stripeId_unique" UNIQUE("stripe_id")
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
	"activated" boolean DEFAULT false NOT NULL,
	"opted_out" boolean DEFAULT false NOT NULL,
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
ALTER TABLE "job_board_posting" ADD CONSTRAINT "job_board_posting_job_posting_id_job_posting_id_fk" FOREIGN KEY ("job_posting_id") REFERENCES "public"."job_posting"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_posting" ADD CONSTRAINT "job_posting_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stripe_customer" ADD CONSTRAINT "stripe_customer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_mailing" ADD CONSTRAINT "user_mailing_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;