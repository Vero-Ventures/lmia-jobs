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
  constructor(
    public users: Record<string, Set<string>>,
    public posts: Record<string, JobPostData>
  ) {}

  async createPosts(): Promise<void> {
    try {
      const emails = Object.keys(this.users);

      const userEmails = await db.select({ email: user.email }).from(user);

      const emailArray: string[] = userEmails.map((row) => row.email);

      const newEmails = emails.filter((email) => !emailArray.includes(email));

      const newPosts = [];

      for (const newEmail of newEmails) {
        const userPosts = this.users[newEmail];
        for (const post of userPosts) {
          try {
            newPosts.push(await this.handlePostCreation(post));
          } catch (error) {
            console.error(
              "Error Creating User With Email: " + newEmail + ", " + error
            );
          }
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

  async handlePostCreation(postId: string): Promise<JobPostingData> {
    try {
      const postDetails = this.posts[postId];

      const expireryDate = new Date();

      expireryDate.setMonth(new Date().getMonth() + 3);

      return {
        userId: process.env.ADMIN_USER_ID!,
        email: postDetails.email,
        title: postDetails.title,
        orgName: postDetails.orgName,
        province: postDetails.province as Province,
        city: postDetails.city,
        address: postDetails.address ? postDetails.address : null,
        startDate: new Date(postDetails.startDate),
        vacancies: postDetails.vacancies,
        employmentType: postDetails.employmentType as EmploymentType,
        workHours: postDetails.workHours,
        paymentType: postDetails.paymentType as PaymentType,
        minPayValue: postDetails.minPayValue,
        maxPayValue: postDetails.maxPayValue ? postDetails.maxPayValue : null,
        description: postDetails.description,
        language: postDetails.language as Language,
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
