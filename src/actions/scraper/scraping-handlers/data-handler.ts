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
      const newEmails = new Set<string>();
      const newEmailsArray = [];

      for (const newPost of postsFromNewEmails) {
        try {
          newPosts.push(await this.handlePostCreation(newPost));
          if (!newEmails.has(newPost.email)) {
            newEmails.add(newPost.email);
            newEmailsArray.push({
              email: newPost.email,
            });
          }
        } catch (error) {
          console.error(
            "Error Creating Post With Id: " + newPost.postId + ", " + error
          );
        }
      }

      if (newPosts.length > 1) {
        console.log("Check For Double Call");
        await db.insert(jobPosting).values(newPosts);
        // await this.createUserMailingList(newEmailsArray);
      }

      return;
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
        address: postData.address ? postData.address : "",
        startDate: new Date(postData.startDate),
        vacancies: postData.vacancies,
        employmentType: postData.employmentType as EmploymentType,
        workHours: Math.floor(postData.workHours),
        maxWorkHours: postData.maxWorkHours
          ? Number(postData.maxWorkHours)
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

  async createUserMailingList(
    newEmails: {
      email: string;
    }[]
  ) {
    try {
      console.log("Emails: " + JSON.stringify(newEmails));
      await db.insert(userMailing).values(newEmails);
    } catch (error) {
      throw error;
    }
  }
}
