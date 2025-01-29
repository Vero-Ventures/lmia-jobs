import type { JobPostData } from "@/actions/scraper/helpers/types";

export class DataHandler {
  constructor(
    public users: Record<string, string[]>,
    public posts: JobPostData
  ) {}

  async createUsers(): Promise<void> {
    try {
    } catch (error) {
      throw error;
    }
  }

  async handleCreateUser(): Promise<void> {
    try {
    } catch (error) {
      throw error;
    }
  }

  async handleCreateStripeUser(): Promise<void> {
    try {
    } catch (error) {
      throw error;
    }
  }

  async handleCreateUserMailing(): Promise<void> {
    try {
    } catch (error) {
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
