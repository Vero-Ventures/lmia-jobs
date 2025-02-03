import { db } from "@/db/index";
import { jobPosting, userMailing } from "@/db/schema";
import type { JobPostData } from "@/actions/scraper/helpers/types";
import type {
  EmploymentType,
  Language,
  PaymentType,
  Province,
} from "@/app/lib/constants";
import type { JobPosting as JobPostingData } from "@/app/lib/types";

export class DataHandler {
  constructor(public post: JobPostData) {}

  async createPosts(): Promise<void> {
    console.log(JSON.stringify(this.post));

    try {
      const newPost = await this.handlePostCreation(this.post);

      await db.insert(jobPosting).values(newPost);

      try {
        await db.insert(userMailing).values({ email: this.post.email });
      } catch (error) {
        throw error;
      }

      return;
    } catch (error) {
      throw "Error Creating Post With Id: " + this.post.postId + ", " + error;
    }
  }

  async handlePostCreation(postData: JobPostData): Promise<JobPostingData> {
    try {
      const expireryDate = new Date();

      expireryDate.setMonth(new Date().getMonth() + 3);

      return {
        userId: process.env.ADMIN_USER_ID!,
        jobBankId: postData.postId,
        email: postData.email,
        title: postData.title,
        orgName: postData.orgName,
        province: postData.province as Province,
        city: postData.city,
        address: postData.address ? postData.address : "",
        startDate: new Date(postData.startDate),
        vacancies: postData.vacancies,
        employmentType: postData.employmentType as EmploymentType,
        workHours: Math.floor(postData.workHours),
        maxWorkHours: postData.maxWorkHours
          ? Math.floor(postData.maxWorkHours)
          : null,
        paymentType: postData.paymentType as PaymentType,
        minPayValue: Math.floor(postData.minPayValue),
        maxPayValue: postData.maxPayValue
          ? Math.floor(postData.maxPayValue)
          : null,
        description: postData.description,
        language: postData.language as Language,
        hidden: false,
        paymentConfirmed: true,
        expiresAt: expireryDate,
      };
    } catch (error) {
      throw error;
    }
  }
}
