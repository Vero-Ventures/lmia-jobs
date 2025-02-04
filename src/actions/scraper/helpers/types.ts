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
  address: string | undefined;
  startDate: string;
  vacancies: number;
  employmentType: string;
  workHours: number;
  maxWorkHours: number | undefined;
  paymentType: string;
  minPayValue: number;
  maxPayValue: number | undefined;
  description: string;
  language: string;
};
