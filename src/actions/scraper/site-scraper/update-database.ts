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
  // Takes the formatted Job Post data on creation.
  constructor(public post: JobPostData) {}

  async createPost(): Promise<void> {
    try {
      // Call handler method to fill missing data for post creation.
      // Also provides additional typing conversion.
      const newPost = await this.handlePostCreation(this.post);

      // Create a new Job Posting in the database using the new object and return the result.
      const newPosting = await db
        .insert(jobPosting)
        .values(newPost)
        .returning()
        .then((res) => res[0]);

      // Use the returned database Job Posting to create the related database Job Board Posting objects.
      // Defines an object for each Job Board (including "all" board).
      const jobPostingBoards = [
        { jobBoard: JOB_BOARDS[0], jobPostingId: newPosting.id },
        { jobBoard: JOB_BOARDS[1], jobPostingId: newPosting.id },
        { jobBoard: JOB_BOARDS[2], jobPostingId: newPosting.id },
        { jobBoard: JOB_BOARDS[3], jobPostingId: newPosting.id },
        { jobBoard: JOB_BOARDS[4], jobPostingId: newPosting.id },
        { jobBoard: JOB_BOARDS[5], jobPostingId: newPosting.id },
      ];

      // Insert the created Job Board Postings into the database.
      await db.insert(jobBoardPosting).values(jobPostingBoards);

      // Try to insert the user email into the database for mailing list.
      // If the email already exists, catch and log the error, then continue.
      try {
        await db.insert(userMailing).values({ email: this.post.email });
      } catch {
        console.error("Did Not Create User Mailing, Existing Email.");
      }

      return;
    } catch (error) {
      throw "Error Creating Post With Id: " + this.post.postId + ", " + error;
    }
  }

  // Converts the formated data scraped from the Job Post into the database format.
  // Takes: The formatted Job Post data.
  // Not nessasary but makes code easier to read.
  async handlePostCreation(postData: JobPostData): Promise<JobPostingData> {
    try {
      // Create a new date object and add a month to get the expirery date.
      const expireryDate = new Date();

      expireryDate.setMonth(new Date().getMonth() + 1);

      // All posts are saved to an Admin user defined in the enviroment variables.
      // Address is not nullable in the database, so null values are saved as an empty string.
      // Enum typed strings are convered to database enum types: Province, EmploymentType, PaymentType, Language.
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
        maxWorkHours: postData.maxWorkHours,
        paymentType: postData.paymentType as PaymentType,
        minPayValue: postData.minPayValue,
        maxPayValue: postData.maxPayValue,
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
