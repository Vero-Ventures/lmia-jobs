export type JobPosting = {
  id: number;
  email: string;
  title: string;
  orgName: string;
  province: string;
  city: string;
  address: string | null;
  startDate: string | null;
  vacancies: number | null;
  employmentType: string;
  workHours: number | null;
  paymentType: string;
  minPayValue: number;
  maxPayValue: number | null;
  description: string;
  language: string;
  hidden: boolean;
  paymentConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
};
