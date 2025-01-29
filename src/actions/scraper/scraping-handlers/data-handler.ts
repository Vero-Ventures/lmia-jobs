import { db } from "@/db/index";
import { user } from "@/db/schema";
// import { userMailing, jobPosting } from "@/db/schema";
// import { eq } from "drizzle-orm";
import type { JobPostData } from "@/actions/scraper/helpers/types";

export class DataHandler {
  constructor(
    public users: Record<string, Set<string>>,
    public posts: Record<string, JobPostData>
  ) {}

  async handleCreateUser(_userEmail: string): Promise<void> {
    try {
    } catch (error) {
      const emails = Object.keys(this.users);

      const userEmails = await db.select({ email: user.email }).from(user);

      const emailArray: string[] = userEmails.map((row) => row.email);

      const newUsers = emails.filter((email) => !emailArray.includes(email));

      for (const newUser of newUsers) {
        try {
          this.handleCreateUser(newUser);
        } catch (error) {
          console.error(
            "Error Creating User With Email: " + newUser + ", " + error
          );
        }
      }
      throw error;
    }
  }

  async createPosts(): Promise<void> {
    try {
    } catch (error) {
      throw error;
    }
  }

  async handlePostCreation(): Promise<void> {
    try {
    } catch (error) {
      throw error;
    }
  }
}
