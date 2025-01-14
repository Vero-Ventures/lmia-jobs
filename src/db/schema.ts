import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const userMailing = pgTable("user_mailing", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  tempPassword: text("temp_password"),
  newlyCreated: boolean("newly_created").notNull().default(true),
  optedOut: boolean("opted_out").notNull().default(false),
  activated: boolean("activated").notNull().default(false),
  ignore: boolean("ignore").notNull().default(false),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  idToken: text("id_token"),
  scope: text("scope"),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const jobPostings = pgTable("job_postings", {
  id: serial().primaryKey(),
  jobTitle: text().notNull(),
  hiringOrganization: text().notNull(),
  datePosted: date().notNull(),
  employmentType: text().notNull(),
  addressRegion: text().notNull(),
  addressLocality: text().notNull(),
  streetAddress: text(),
  compTimeUnit: text().notNull(),
  minCompValue: integer().notNull(),
  maxCompValue: integer(),
  workHours: integer(),
  startTime: date(),
  vacancies: integer(),
  description: text().notNull(),
  email: text().notNull(),
  language: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .$onUpdate(() => new Date()),
  validThrough: text().notNull(),
  postAsylum: boolean().notNull().default(true),
  postDisabled: boolean().notNull().default(true),
  postIndigenous: boolean().notNull().default(true),
  postNewcomers: boolean().notNull().default(true),
  postYouth: boolean().notNull().default(true),
});
