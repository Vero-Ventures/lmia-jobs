import type {
  EmploymentType,
  Language,
  PaymentType,
  Province,
} from "@/app/lib/constants";

export type JobPosting = {
  userId: string;
  email: string;
  title: string;
  orgName: string;
  province: Province;
  city: string;
  address: string | null;
  startDate: Date;
  vacancies: number | null;
  employmentType: EmploymentType;
  workHours: number | null;
  paymentType: PaymentType;
  minPayValue: number;
  maxPayValue: number | null;
  description: string;
  language: Language;
  hidden: boolean;
  paymentConfirmed: boolean;
  expiresAt: Date;
};
