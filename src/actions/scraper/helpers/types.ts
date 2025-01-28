export type UserData = {
  email: string;
};

export type JobPostData = {
  email: string;
  jobTitle: string;
  organizationName: string;
  address: string | undefined;
  city: string;
  region: string;
  minPayValue: number;
  maxPayValue: number | undefined;
  paymentType: string;
  workHours: string;
  employmentType: string;
  startDate: string;
  vacancies: number;
  language: string;
  description: string;
};
