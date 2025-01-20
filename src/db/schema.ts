import {
  boolean,
  date,
  integer,
  uuid,
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

export const stripeCustomer = pgTable("stripeCustomer", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: text("user_id")
    .unique()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  stripeId: text("stripe_id").notNull().unique(),
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

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const jobPostings = pgTable("job_postings", {
  id: serial("id").primaryKey(),
  jobTitle: text("job_title").notNull(),
  organizationName: text("organization_name").notNull(),
  region: text("region").notNull(),
  city: text("city").notNull(),
  address: text("address"),
  startTime: date("start_time").notNull(),
  vacancies: integer("vacancies"),
  employmentType: text("employment_type").notNull(),
  workHours: integer("work_hours"),
  paymentType: text("payment_type").notNull(),
  minPayValue: integer("min_pay_value").notNull(),
  maxPayValue: integer("max_pay_value"),
  description: text("description").notNull(),
  language: text("language"),
  postAsylum: boolean("post_asylum").notNull(),
  postDisabled: boolean("post_disabled").notNull(),
  postIndigenous: boolean("post_indigenous").notNull(),
  postNewcomers: boolean("post_newcomers").notNull(),
  postYouth: boolean("post_youth").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  expiresAt: date("expires_at").notNull(),
});
