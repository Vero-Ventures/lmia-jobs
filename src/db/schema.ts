import {
  employmentTypeLabels,
  JOB_BOARDS,
  languages,
  paymentTypes,
  provinceValues,
} from "@/app/lib/constants";
import {
  boolean,
  date,
  integer,
  pgEnum,
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

export const languageEnum = pgEnum("language", languages);

export const employmentTypeEnum = pgEnum(
  "employment_type",
  employmentTypeLabels
);

export const paymentTypeEnum = pgEnum("payment_type", paymentTypes);

export const provinceEnum = pgEnum("province", provinceValues);

export const jobPosting = pgTable("job_posting", {
  id: serial("id").primaryKey(),
  jobBankId: text("job_bank_id"),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  title: text("title").notNull(),
  orgName: text("org_name").notNull(),
  province: provinceEnum("province").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  startDate: date({ mode: "date" }).notNull(),
  vacancies: integer("vacancies"),
  employmentType: employmentTypeEnum("").notNull(),
  workHours: integer("work_hours"),
  maxWorkHours: integer("max_work_hours"),
  paymentType: paymentTypeEnum("payment_type").notNull(),
  minPayValue: integer("min_pay_value").notNull(),
  maxPayValue: integer("max_pay_value"),
  description: text("description").notNull(),
  language: languageEnum("language").notNull(),
  hidden: boolean("hidden").notNull(),
  paymentConfirmed: boolean("payment_confirmed").notNull(),
  expiresAt: date({ mode: "date" }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const jobBoardEnum = pgEnum("job_board", JOB_BOARDS);

export const jobBoardPosting = pgTable("job_board_posting", {
  id: serial("id").primaryKey(),
  jobBoard: jobBoardEnum("job_board").notNull(),
  jobPostingId: integer("job_posting_id").references(() => jobPosting.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const stripeCustomer = pgTable("stripe_customer", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .unique()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const userMailing = pgTable("user_mailing", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  newlyCreated: boolean("newly_created").notNull().default(true),
  activated: boolean("activated").notNull().default(false),
  optedOut: boolean("opted_out").notNull().default(false),
  ignore: boolean("ignore").notNull().default(false),
});

export type JobPosting = typeof jobPosting.$inferSelect;
