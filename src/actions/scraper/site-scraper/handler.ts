import { CONFIG } from "@/actions/scraper/helpers/config";
import { db } from "@/db/index";
import { user, userMailing } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  getEmail,
  getJobDetails,
} from "@/actions/scraper/site-scraper/get-details";
import type { BrowserHandler } from "@/actions/scraper/helpers/browser-handler";
import type { JobPostData } from "@/actions/scraper/helpers/types";

// Visit the Job Bank Posting page, get the email and job details then retur them.
// Takes: The Chromium Browser Handler and the Job Bank Post Id.
export async function scrapeJobBankPost(
  browserHandler: BrowserHandler,
  postId: string = "test"
): Promise<JobPostData> {
  try {
    // Visit the Job Bank Posting page using the Post Id.
    await browserHandler.visitPage(
      CONFIG.url + postId + "?source=searchresults"
    );

    // Get the post email from "Apply Now" button.
    const email = await getPageEmail(browserHandler);

    // Get post details and return a formatted object for database insertion.
    const postDetails = await getPageDetails(browserHandler, postId, email);

    return postDetails;
  } catch (error) {
    throw "Error Getting Post: " + error;
  }
}

// Gets the email using the scraper and checks agains database users.
// Takes: The Chromium Browser Handler.
// Returns: The Post email.
async function getPageEmail(browserHandler: BrowserHandler): Promise<string> {
  try {
    // Use scraper to extract the user email, returning error if not found.
    const email = await getEmail(browserHandler);

    if (!email) {
      throw "Post Has Invalid Email";
    }

    // Get all user emails in the database belonging to real accounts.
    const userEmails = await db.select({ email: user.email }).from(user);

    const userEmailArray: string[] = userEmails.map((row) => row.email);

    // Get all mailing user emails from ignored users.
    const ignoredEmails = await db
      .select({ email: user.email })
      .from(userMailing)
      .where(eq(userMailing.ignore, true));

    const ignoredEmailArray: string[] = ignoredEmails.map((row) => row.email);

    // If the email belongs to a real user, throw an error.
    if (userEmailArray.includes(email)) {
      throw "Posting Email Belongs To Existing User";
    } else if (ignoredEmailArray.includes(email)) {
      // If the email belongs to an ignored user, throw an error.
      throw "Posting Email Belongs To Ignored User";
    } else {
      // Otherwise return the Post email.
      return email;
    }
  } catch (error) {
    throw "Error Getting Post Email: " + error;
  }
}

// Calls scraper to get idividual post details and format them as an object.
// Takes: The Chromium Browser Handler.
// Returns: The Post Details as a formatted object.
async function getPageDetails(
  browserHandler: BrowserHandler,
  postId: string,
  email: string
): Promise<JobPostData> {
  try {
    return await getJobDetails(browserHandler, postId, email);
  } catch (error) {
    throw "Error Getting Post Details: " + error;
  }
}
