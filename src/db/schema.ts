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

export const user = pgTable("user", {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
  newlyCreated: boolean().notNull().default(true),
  optedOut: boolean().notNull().default(false),
  activated: boolean().notNull().default(false),
  ignore: boolean().notNull().default(false),
});

export const session = pgTable("session", {
  id: serial().primaryKey(),
  userId: integer()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text().notNull().unique(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
});

export const account = pgTable("account", {
  id: serial().primaryKey(),
  userId: integer()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text().notNull().unique(),
  providerId: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
});

export const verification = pgTable("verification", {
  id: serial().primaryKey(),
  identifier: text().notNull().unique(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
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
