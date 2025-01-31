import { db } from "@/db/index";
import { jobPosting, user, userMailing } from "@/db/schema";
import type { JobPostData } from "@/actions/scraper/helpers/types";
import type {
  EmploymentType,
  Language,
  PaymentType,
  Province,
} from "@/app/lib/constants";
import type { JobPosting as JobPostingData } from "@/app/lib/types";

export class DataHandler {
  constructor(public posts: JobPostData[]) {}

  async createPosts(): Promise<void> {
    console.log(JSON.stringify(this.posts));

    try {
      const userEmails = await db.select({ email: user.email }).from(user);

      const emailArray: string[] = userEmails.map((row) => row.email);

      const postsFromNewEmails = this.posts.filter(
        (post) => !emailArray.includes(post.email)
      );

      const newPosts = [];

      for (const newPost of postsFromNewEmails) {
        try {
          newPosts.push(await this.handlePostCreation(newPost));
        } catch (error) {
          console.error(
            "Error Creating Post With Id: " + newPost.postId + ", " + error
          );
        }
      }

      if (newPosts.length > 1) {
        await db.insert(jobPosting).values(newPosts);
      }

      this.createUserMailingList(emailArray);
    } catch (error) {
      throw error;
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
        address: postData.address ? postData.address : null,
        startDate: new Date(postData.startDate),
        vacancies: postData.vacancies,
        employmentType: postData.employmentType as EmploymentType,
        workHours: postData.workHours,
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

  async createUserMailingList(emailArray: string[]) {
    try {
      const newEmails = [];

      for (const email of emailArray) {
        newEmails.push({
          email: email,
        });
      }

      await db.insert(userMailing).values(newEmails);
    } catch (error) {
      throw error;
    }
  }
}
