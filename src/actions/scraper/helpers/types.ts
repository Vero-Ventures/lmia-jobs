export type UserData = {
  email: string;
};

export type JobPostData = {
  postId: string;
  email: string;
  title: string;
  orgName: string;
  province: string;
  city: string;
  address: string | null;
  startDate: string;
  vacancies: number;
  employmentType: string;
  workHours: string;
  maxWorkHours: string | null;
  paymentType: string;
  minPayValue: string;
  maxPayValue: string | null;
  description: string;
  language: string;
};
