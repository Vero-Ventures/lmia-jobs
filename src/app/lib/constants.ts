export const JOB_SITES = {
  admin: {
    title: "Manage Opportunities",
    domain: "manageopportunities.ca",
  },
  accessible: {
    title: "Accessible Opportunities",
    domain: "accessibleopportunities.ca",
  },
  asylum: {
    title: "Asylum Opportunities",
    domain: "asylumopportunities.ca",
  },
  indigenous: {
    title: "Indigenous Opportunities",
    domain: "indigenousopportunities.ca",
  },
  newcomers: {
    title: "Newcomers Opportunities",
    domain: "immigrantopportunities.ca",
  },
  youth: {
    title: "Youth Opportunities",
    domain: "youthopportunities.ca",
  },
};

export const JOB_TYPES = [
  {
    label: "Full Time",
    value: "Full Time",
  },
  {
    label: "Part Time",
    value: "Part Time",
  },
] as const;

export const jobTypeLabels = ["Full Time", "Part Time"] as const;
export type JobType = (typeof jobTypeLabels)[number];

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

export const languages = ["English", "French", "Other"] as const;
export type Language = (typeof languages)[number];

export const PRICE_PER_MONTH = 5;
