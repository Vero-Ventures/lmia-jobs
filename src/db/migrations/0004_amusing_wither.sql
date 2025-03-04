CREATE TABLE "invite_template" (
	"id" text PRIMARY KEY DEFAULT 'template_num' NOT NULL,
	"template_num" text NOT NULL,
	CONSTRAINT "invite_template_template_num_unique" UNIQUE("template_num")
);
