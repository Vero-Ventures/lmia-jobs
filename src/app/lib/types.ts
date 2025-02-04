import type {
  EmploymentType,
  Language,
  PaymentType,
  Province,
} from "@/app/lib/constants";

export type JobPosting = {
  userId: string | null;
  jobBankId: string | null;
  email: string;
  title: string;
  orgName: string;
  province: Province;
  city: string;
  address: string;
  startDate: Date;
  vacancies: number | null;
  employmentType: EmploymentType;
  workHours: string | null;
  maxWorkHours: string | null;
  paymentType: PaymentType;
  minPayValue: string;
  maxPayValue: string | null;
  description: string;
  language: Language;
  hidden: boolean;
  paymentConfirmed: boolean;
  expiresAt: Date;
};
