CREATE TABLE "job_postings" (
	"id" serial PRIMARY KEY NOT NULL,
	"addressLocality" text NOT NULL,
	"addressRegion" text NOT NULL,
	"streetAddress" text,
	"compTimeUnit" text,
	"datePosted" date NOT NULL,
	"description" text NOT NULL,
	"email" text NOT NULL,
	"employmentSubType" text NOT NULL,
	"employmentType" text,
	"workHours" text,
	"startTime" date,
	"vacancies" integer,
	"hiringOrganization" text NOT NULL,
	"jobPageId" text NOT NULL,
	"jobTitle" text NOT NULL,
	"language" text NOT NULL,
	"minCompValue" text NOT NULL,
	"maxCompValue" text,
	"paid" boolean NOT NULL,
	"validThrough" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mailing_list" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mailing_list_email_unique" UNIQUE("email")
);
