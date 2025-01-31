import { CONFIG } from "@/actions/scraper/helpers/config";
import { db } from "@/db/index";
import { jobPosting } from "@/db/schema";
import { isNotNull } from "drizzle-orm";
import {
  getEmail,
  getJobDetails,
} from "@/actions/scraper/site-scrapers/job-bank/get-details";
import type { BrowserHandler } from "@/actions/scraper/scraping-handlers/browser-handler";
import type { JobPostData } from "@/actions/scraper/helpers/types";

export async function scrapeGovJobBank(
  browserHandler: BrowserHandler
): Promise<JobPostData[]> {
  let pageNum = 1;
  let scrape = true;

  const newPostIds: string[] = [];

  const existingPosts = await db
    .select({ jobBankId: jobPosting.jobBankId })
    .from(jobPosting)
    .where(isNotNull(jobPosting.jobBankId));

  while (scrape) {
    const newPosts = await scrapePosts(browserHandler, pageNum);
    newPosts.forEach((value) => newPostIds.push(value));

    // Testing: Limit Pages To 2
    if (pageNum === 1) {
      scrape = false;
    } else {
      pageNum += 1;
    }
  }

  const existingPostsArray: string[] = existingPosts.map(
    (row) => row.jobBankId!
  );

  const validPosts = newPostIds.filter(
    (postId) => !existingPostsArray.includes(postId)
  );

  const postDetails = await visitPages(browserHandler, validPosts);

  return postDetails;
}

async function scrapePosts(
  browserHandler: BrowserHandler,
  pageNum: number
): Promise<Set<string>> {
  try {
    const pagePostIds = new Set<string>();
    await browserHandler.visitPage(CONFIG.urls.govSearchPage + String(pageNum));

    const posts = await browserHandler.waitAndGetElement(
      CONFIG.selectors.govJobBank.jobPosting
    );

    // Testing: Limit Posts Handled Per Page.
    const allPosts = await posts.all();
    const testPosts = [allPosts[0], allPosts[1], allPosts[2]];

    for (const post of testPosts) {
      const postedToBank = post.locator(
        CONFIG.selectors.govJobBank.postedToBank
      );

      if ((await postedToBank.innerText()).includes("Posted on Job Bank")) {
        const fullId = await post.getAttribute("id");
        pagePostIds.add(fullId!.split("-")[1]);
      }
    }

    return pagePostIds;
  } catch (error) {
    console.error("Error getting job post Ids: " + error);
    return new Set<string>();
  }
}

async function visitPages(
  browserHandler: BrowserHandler,
  postIds: string[]
): Promise<JobPostData[]> {
  try {
    const postDetails: JobPostData[] = [];

    for (const post of postIds) {
      await browserHandler.visitPage(
        CONFIG.urls.searchResult + String(post) + "?source=searchresults"
      );

      const email = await getEmail(browserHandler);

      if (!email) {
        console.error("Post With ID: " + post + " Has Invalid Email");
        continue;
      }

      const details = await getJobDetails(browserHandler, post, email);

      if (!details) {
        console.error("Post With ID: " + post + " Has Invalid Details");
      } else {
        postDetails.push(details);
      }
    }

    return postDetails;
  } catch (error) {
    console.error("Error getting getting Email or Details: " + error);
    return [];
  }
}
