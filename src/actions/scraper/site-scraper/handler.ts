import { CONFIG } from "@/actions/scraper/helpers/config";
import { db } from "@/db/index";
import { user } from "@/db/schema";
import {
  getEmail,
  getJobDetails,
} from "@/actions/scraper/site-scraper/get-details";
import type { BrowserHandler } from "@/actions/scraper/helpers/browser-handler";
import type { JobPostData } from "@/actions/scraper/helpers/types";

export async function scrapeJobBankPost(
  browserHandler: BrowserHandler,
  postId: string = "test"
): Promise<JobPostData> {
  try {
    await browserHandler.visitPage(
      CONFIG.url + postId + "?source=searchresults"
    );

    const email = await getPageEmail(browserHandler);

    const postDetails = await getPageDetails(browserHandler, postId, email);

    return postDetails;
  } catch (error) {
    throw "Error Getting Post: " + error;
  }
}

async function getPageEmail(browserHandler: BrowserHandler): Promise<string> {
  try {
    const email = await getEmail(browserHandler);

    if (!email) {
      throw "Post Has Invalid Email";
    }

    const userEmails = await db.select({ email: user.email }).from(user);

    const emailArray: string[] = userEmails.map((row) => row.email);

    if (emailArray.includes(email)) {
      throw "Posting Email Belongs To Existing User";
    } else {
      return email;
    }
  } catch (error) {
    throw "Error Getting Post Email: " + error;
  }
}

async function getPageDetails(
  browserHandler: BrowserHandler,
  postId: string,
  email: string
): Promise<JobPostData> {
  try {
    const details = await getJobDetails(browserHandler, postId, email);

    if (!details) {
      throw "Post Has Invalid Details";
    }

    return details;
  } catch (error) {
    throw "Error Getting Post Details: " + error;
  }
}
