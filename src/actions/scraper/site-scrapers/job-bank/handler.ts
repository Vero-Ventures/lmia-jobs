import { CONFIG } from "@/actions/scraper/helpers/config";
import {
  getEmail,
  getJobDetails,
} from "@/actions/scraper/site-scrapers/job-bank/get-details";
import type { BrowserHandler } from "@/actions/scraper/scraping-handlers/browser-handler";
import type { JobPostData } from "@/actions/scraper/helpers/types";

export async function scrapeGovJobBank(
  browserHandler: BrowserHandler
): Promise<{
  postEmails: Record<string, Set<string>>;
  postDetails: Record<string, JobPostData>;
}> {
  let pageNum = 1;
  let scrape = true;

  const newPosts = new Set<string>();

  while (scrape) {
    const newPostIds = await scrapePosts(browserHandler, pageNum);
    newPostIds.forEach((value) => newPosts.add(value));

    // Testing: Limit Pages To 1
    if ((pageNum = 1)) {
      scrape = false;
    } else {
      pageNum += 1;
    }
  }

  const { postEmails, postDetails } = await visitPages(
    browserHandler,
    Array.from(newPosts)
  );

  return { postEmails, postDetails };
}

async function scrapePosts(
  browserHandler: BrowserHandler,
  pageNum: number
): Promise<string[]> {
  try {
    const pagePostIds: string[] = [];
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
        pagePostIds.push(fullId!.split("-")[1]);
      }
    }

    return pagePostIds;
  } catch (error) {
    console.error("Error getting job post Ids: " + error);
    return [];
  }
}

async function visitPages(
  browserHandler: BrowserHandler,
  postIds: string[]
): Promise<{
  postEmails: Record<string, Set<string>>;
  postDetails: Record<string, JobPostData>;
}> {
  try {
    const postEmails: Record<string, Set<string>> = {};
    const postDetails: Record<string, JobPostData> = {};
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
        if (postEmails.hasOwnProperty(email)) {
          postEmails[email].add(post);
        } else {
          postEmails[email] = new Set<string>(post);
        }

        if (!postDetails.hasOwnProperty(post)) {
          postDetails[post] = details;
        }
      }
    }

    return { postEmails, postDetails };
  } catch (error) {
    console.error("Error getting getting Email or Details: " + error);
    return { postEmails: {}, postDetails: {} };
  }
}
