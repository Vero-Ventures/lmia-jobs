import { CONFIG } from "@/actions/scraper/helpers/config";
import {
  getEmail,
  getJobDetails,
} from "@/actions/scraper/site-scrapers/job-bank/get-details";
import type { BrowserHandler } from "@/actions/scraper/scraping-handlers/browser-handler";
import type { JobPostData } from "@/actions/scraper/helpers/types";
// import type { DataHandler } from "@/actions/scraper/scraping-handlers/data-handler";

export async function scrapeGovJobBank(
  browserHandler: BrowserHandler
): Promise<{
  postIds: string[];
  postEmails: { postId: string; email: string }[];
  postDetails: JobPostData[];
}> {
  let pageNum = 1;
  let scrape = true;

  // const dataHandler = new DataHandler();

  const newPosts: string[] = [];

  while (scrape) {
    const newPostIds = await scrapePosts(browserHandler, pageNum);
    newPosts.push(...newPostIds);

    // Testing: Limit Pages To 1
    if ((pageNum = 2)) {
      scrape = false;
    } else {
      pageNum += 1;
    }
  }

  const { postEmails, badPostIds, postDetails } = await visitPages(
    browserHandler,
    newPosts
  );

  const postIds = newPosts!.filter(
    (postId: string) => !badPostIds.includes(postId)
  );

  return { postIds, postEmails, postDetails };
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
  postEmails: { postId: string; email: string }[];
  postDetails: JobPostData[];
  badPostIds: string[];
}> {
  try {
    const postEmails: { postId: string; email: string }[] = [];
    const postDetails: JobPostData[] = [];
    const badPostIds: string[] = [];

    for (const post of postIds) {
      await browserHandler.visitPage(
        CONFIG.urls.searchResult + String(post) + "?source=searchresults"
      );

      const email = await getEmail(browserHandler);

      if (!email) {
        console.error("Post With ID: " + post + " Has Invalid Email");
        badPostIds.push(post);
        continue;
      } else {
        postEmails.push({ postId: post, email });
      }

      const details = await getJobDetails(browserHandler, post, email);

      if (!details) {
        console.error("Post With ID: " + post + " Has Invalid Details");
        badPostIds.push(post);
      } else {
        postDetails.push(details);
      }
    }

    return { postEmails, postDetails, badPostIds };
  } catch (error) {
    console.error("Error getting gettig post page emails: " + error);
    return { postEmails: [], badPostIds: [], postDetails: [] };
  }
}
