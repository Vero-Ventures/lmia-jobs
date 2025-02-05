import { db } from "@/db/index";
import { jobBoardPosting, jobPosting, userMailing } from "@/db/schema";
import type { JobPostData } from "@/actions/scraper/helpers/types";
import {
  JOB_BOARDS,
  type EmploymentType,
  type Language,
  type PaymentType,
  type Province,
} from "@/app/lib/constants";
import type { JobPosting as JobPostingData } from "@/app/lib/types";

export class DataHandler {
  constructor(public post: JobPostData) {}

  async createPosts(): Promise<void> {
    try {
      const newPost = await this.handlePostCreation(this.post);

      await db.insert(jobPosting).values(newPost);

      try {
        const newPosting = await db
          .insert(userMailing)
          .values({ email: this.post.email })
          .returning()
          .then((res) => res[0]);

        console.log(newPosting.id)
        console.log(JOB_BOARDS[0])

        const jobPostingBoards = [
          { jobBoard: JOB_BOARDS[0], jobPostingId: newPosting.id },
          { jobBoard: JOB_BOARDS[1], jobPostingId: newPosting.id },
          { jobBoard: JOB_BOARDS[2], jobPostingId: newPosting.id },
          { jobBoard: JOB_BOARDS[3], jobPostingId: newPosting.id },
          { jobBoard: JOB_BOARDS[4], jobPostingId: newPosting.id },
        ];

        await db.insert(jobBoardPosting).values(jobPostingBoards);
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
        minWorkHours: postData.minWorkHours,
        maxWorkHours: postData.maxWorkHours ? postData.maxWorkHours : null,
        paymentType: postData.paymentType as PaymentType,
        minPayValue: postData.minPayValue,
        maxPayValue: postData.maxPayValue ? postData.maxPayValue : null,
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
