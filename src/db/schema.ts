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
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  temporaryPasssword: text(),
  image: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
  newlyCreated: boolean().notNull().default(true),
  optedOut: boolean().notNull().default(false),
  activated: boolean().notNull().default(false),
  ignore: boolean().notNull().default(false),
});

export const session = pgTable("session", {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text().notNull().unique(),
  expiresAt: timestamp().notNull(),
  ipAddress: text(),
  userAgent: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
});

export const account = pgTable("account", {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text().notNull().unique(),
  providerId: text(),
  accessToken: text(),
  refreshToken: text(),
  accessTokenExpiresAt: timestamp(),
  refreshTokenExpiresAt: timestamp(),
  scope: text(),
  idToken: text(),
  password: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp(),
});

export const verification = pgTable("verification", {
  id: text().primaryKey(),
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
