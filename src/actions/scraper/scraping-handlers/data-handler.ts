import path from "path";
import { promises as fs } from "fs";
import { db } from "@/db";
import { user, userMailing, jobPostings } from "@/db/schema";
import type { UserData, JobPostData } from "@/actions/scraper/helpers/types";

export class DataHandler {
  private usersTempFile: string;
  private postsTempFile: string;

  constructor() {
    this.usersTempFile = path.join("/tmp", "users_temp.txt");
    this.postsTempFile = path.join("/tmp", "posts_temp.txt");
  }

  async createTempFile() {
    try {
      await fs.writeFile(this.usersTempFile, "", { flag: "w" });
      await fs.writeFile(this.postsTempFile, "", { flag: "w" });
    } catch (error) {
      console.error(`Error creating temp files at ${"/tmp"}: `, error);
    }
  }

  async checkForExistingUser(userEmail: string) {
    try {
      const data = await fs.readFile(this.usersTempFile, "utf-8");

      const lines = data.split("\n");

      for (const line of lines) {
        const email = line.split(",")[0];
        if (email === userEmail) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error(`Error reading the users file: `, error);
      return false;
    }
  }

  async checkForExistingPost(postId: string) {
    try {
      const data = await fs.readFile(this.usersTempFile, "utf-8");

      const lines = data.split("\n");

      for (const line of lines) {
        const Id = line.split(",")[0];
        if (Id === postId) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error(`Error reading the posts file: `, error);
      return false;
    }
  }

  async tempStoreUser(userId: string, userDetails: string[]) {
    try {
      const newUser = await this.checkForExistingUser(userId);
      if (newUser) {
        const newUserLine = `${userId}, ${userDetails.join(", ")}\n`;

        await fs.appendFile(this.postsTempFile, newUserLine);
      }
    } catch (error) {
      console.error(`Error writing post to temp file: `, error);
    }
  }

  async tempStorePost(postId: string, postDetails: string[]) {
    try {
      const newUser = await this.checkForExistingUser(postId);
      if (newUser) {
        const newUserLine = `${postId}, ${postDetails.join(", ")}\n`;

        await fs.appendFile(this.postsTempFile, newUserLine);
      }
    } catch (error) {
      console.error(`Error writing post to temp file: `, error);
    }
  }

  async readLocallyStoredUsers(): Promise<UserData[]> {
    try {
      const users: UserData[] = [];

      const data = await fs.readFile(this.usersTempFile, "utf-8");

      const lines = data.split("\n");

      for (const line of lines) {
        const lineData = line.split(",");

        const newUser = {
          email: lineData[0],
          posts: Number(lineData[1]),
        };

        users.push(newUser);
      }

      return users;
    } catch (error) {
      console.error(`Error reading the users file: `, error);
      return [];
    }
  }

  async readLocallyStoredPosts(): Promise<JobPostData[]> {
    try {
      const posts: JobPostData[] = [];

      const data = await fs.readFile(this.usersTempFile, "utf-8");

      const lines = data.split("\n");

      for (const line of lines) {
        const lineData = line.split(",");

        const newPost = {
          email: lineData[1],
          jobTitle: lineData[2],
          organizationName: lineData[3],
          region: lineData[4],
          city: lineData[5],
          address: lineData[6],
          startDate: lineData[7],
          employmentType: lineData[8],
          paymentType: lineData[9],
          workHours: Number(lineData[10]),
          minPayValue: Number(lineData[11]),
          maxPayValue: Number(lineData[12]),
          description: lineData[13],
          language: lineData[14],
          vacancies: Number(lineData[15]),
        };

        posts.push(newPost);
      }

      return posts;
    } catch (error) {
      console.error(`Error reading the job posts file: `, error);
      return [];
    }
  }

  async saveUsersToDatabase(users: UserData[]) {
    try {
      const dataBaseUsers = [];

      for (const user of users) {
        const createDate = new Date();

        const newUser = {
          id: this.generateRandomChars(32),
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
