import { db } from "@/db";
import { user, userMailing, jobPostings } from "@/db/schema";
import type { UserData, JobPostData } from "@/actions/scraper/helpers/types";

export class DataHandler {
  async saveUsersToDatabase(users: UserData[]) {
    try {
      const dataBaseUsers = [];

      for (const user of users) {
        const createDate = new Date();

        const newID =
          this.generateRandomChars(8) +
          "-" +
          this.generateRandomChars(4) +
          "-" +
          this.generateRandomChars(4) +
          "-" +
          this.generateRandomChars(4) +
          "-" +
          this.generateRandomChars(12);

        const newUser = {
          id: newID,
          name: user.email,
          email: user.email,
          emailVerified: false,
          createdAt: createDate,
          updatedAt: createDate,
        };

        dataBaseUsers.push(newUser);
      }

      const createdUsers = await db
        .insert(user)
        .values(dataBaseUsers)
        .returning();

      for (const createdUser of createdUsers) {
        await db.insert(userMailing).values({
          userId: createdUser.id,
          tempPassword: this.generateRandomChars(8),
        });
      }
    } catch (error) {
      console.error(`Error writing users to the database: `, error);
    }
  }

  async savePostsToDatabase(jobPosts: JobPostData[]) {
    try {
      const databasePost = [];

      for (const post of jobPosts) {
        const newPost = {
          ...post,
          postAsylum: false,
          postDisabled: false,
          postIndigenous: false,
          postNewcomers: false,
          postYouth: false,
          expiresAt: new Date().toISOString().split("T")[0],
          paymentConfirmed: false,
        };

        databasePost.push(newPost);
      }

      await db.insert(jobPostings).values(databasePost).returning();
    } catch (error) {
      console.error(`Error writing users to the database: `, error);
    }
  }

  generateRandomChars(length: number): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
}
