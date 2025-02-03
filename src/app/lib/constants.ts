export const JOB_BOARD_TITLES: Record<JobBoard, string> = {
  accessible: "Accessible Opportunities",

  asylum: "Asylum Opportunities",

  indigenous: "Indigenous Opportunities",

  newcomers: "Newcomers Opportunities",

  youth: "Youth Opportunities",
};

export const JOB_BOARD_DOMAINS: Record<string, JobBoard | "admin"> = {
  "manageopportunities.ca": "admin",
  "accessibleopportunities.ca": "accessible",
  "asylumopportunities.ca": "asylum",
  "indigenousopportunities.ca": "indigenous",
  "immigrantopportunities.ca": "newcomers",
  "youthopportunities.ca": "youth",
};

export const JOB_BOARDS = [
  "accessible",
  "asylum",
  "indigenous",
  "newcomers",
  "youth",
] as const;

export type JobBoard = (typeof JOB_BOARDS)[number];

export const EMPLOYMENT_TYPES = [
  {
    label: "Full Time",
    value: "Full Time",
  },
  {
    label: "Part Time",
    value: "Part Time",
  },
] as const;

export const employmentTypeLabels = ["Full Time", "Part Time"] as const;
export type EmploymentType = (typeof employmentTypeLabels)[number];

export const PROVINCES = [
  {
    label: "Alberta",
    value: "AB",
  },
  {
    label: "British Columbia",
    value: "BC",
  },
  {
    label: "Manitoba",
    value: "MB",
  },
  {
    label: "New Brunswick",
    value: "NB",
  },
  {
    label: "Newfoundland and Labrador",
    value: "NL",
  },
  {
    label: "Nova Scotia",
    value: "NS",
  },
  {
    label: "Ontario",
    value: "ON",
  },
  {
    label: "Prince Edward Island",
    value: "PE",
  },
  {
    label: "Quebec",
    value: "QC",
  },
  {
    label: "Saskatchewan",
    value: "SK",
  },
  {
    label: "Northwest Territories",
    value: "NT",
  },
  {
    label: "Nunavut",
    value: "NU",
  },
  {
    label: "Yukon",
    value: "YT",
  },
] as const;

export const paymentTypes = ["Hourly", "Salary"] as const;
export type PaymentType = (typeof paymentTypes)[number];

export const provinceValues = [
  "AB",
  "BC",
  "MB",
  "NB",
  "NL",
  "NS",
  "ON",
  "PE",
  "QC",
  "SK",
  "NT",
  "NU",
  "YT",
] as const;

export type Province = (typeof provinceValues)[number];

export const languages = ["English", "French", "English and French"] as const;
export type Language = (typeof languages)[number];

export const PRICE_PER_MONTH = 5;
