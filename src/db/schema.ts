import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const mailingList = pgTable("mailing_list", {
  id: serial().primaryKey(),
  email: text().notNull().unique(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const jobPostings = pgTable("job_postings", {
  id: serial().primaryKey(),
  addressLocality: text().notNull(),
  addressRegion: text().notNull(),
  streetAddress: text(),
  compTimeUnit: text(),
  datePosted: date().notNull(),
  description: text().notNull(),
  email: text().notNull(),
  employmentSubType: text().notNull(),
  employmentType: text(),
  workHours: text(),
  startTime: date(),
  vacancies: integer(),
  hiringOrganization: text().notNull(),
  jobPageId: text().notNull(),
  jobTitle: text().notNull(),
  language: text().notNull(),
  minCompValue: text().notNull(),
  maxCompValue: text(),
  paid: boolean().notNull(),
  validThrough: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const users = pgTable("users", {
  id: serial().primaryKey(),
  email: text().notNull().unique(),
  password: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  newlyCreated: boolean().notNull().default(true),
  optedOut: boolean().notNull().default(false),
  activated: boolean().notNull().default(false),
  ignore: boolean().notNull().default(false),
});
