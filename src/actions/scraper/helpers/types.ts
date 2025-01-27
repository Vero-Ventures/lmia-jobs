export type UserData = {
  email: string;
};

export type JobPostData = {
  postId: string;
  email: string;
  jobTitle: string;
  organizationName: string;
  address: string | undefined;
  city: string;
  region: string;
  minPayValue: string;
  maxPayValue: string | undefined;
  paymentType: string;
  workHours: string;
  employmentType: string;
  startDate: string;
  vacancies: string;
  language: string;
  description: string;
};
