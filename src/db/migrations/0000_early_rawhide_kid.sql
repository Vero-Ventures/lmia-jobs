CREATE TABLE "job_postings" (
	"id" serial PRIMARY KEY NOT NULL,
	"address_locality" text NOT NULL,
	"address_region" text NOT NULL,
	"street_address" text,
	"comp_time_unit" text,
	"date_posted" date NOT NULL,
	"description" text NOT NULL,
	"email" text NOT NULL,
	"employment_sub_type" text NOT NULL,
	"employment_type" text,
	"work_hours" text,
	"start_time" date,
	"vacancies" integer,
	"hiring_organization" text NOT NULL,
	"job_page_id" text NOT NULL,
	"job_title" text NOT NULL,
	"language" text NOT NULL,
	"min_comp_value" text NOT NULL,
	"max_comp_value" text,
	"paid" boolean NOT NULL,
	"valid_through" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mailing_list" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mailing_list_email_unique" UNIQUE("email")
);
