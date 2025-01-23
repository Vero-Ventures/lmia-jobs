import type { BrowserHandler } from "@/actions/scraper/scraping-handlers/browser-handler";
import { CONFIG } from "@/actions/scraper/helpers/config";

export async function scrapeGovJobBank(
  browserHandler: BrowserHandler
): Promise<string[]> {
  let pageNum = 1;
  let scrape = true;

  let postIds: string[] = [];

  while (scrape) {
    postIds = await scrapePosts(browserHandler, pageNum);
    pageNum += 1;

    // Test Limit
    if (pageNum >= 1) {
      scrape = false;
    }
  }

  return postIds;
}

async function scrapePosts(
  browserHandler: BrowserHandler,
  pageNum: number
): Promise<string[]> {
  try {
    const pagePostIds: string[] = [];

    console.log("visit");
    await browserHandler.visitPage(CONFIG.urls.govSearchPage + String(pageNum));

    console.log("get element");
    const posts = await browserHandler.getElement(
      CONFIG.selectors.govJobBank.jobPosting
    );

    console.log("read posts");
    for (const post of await posts.all()) {
      const fullId = await post.getAttribute("id");
      pagePostIds.push(fullId!.split("-")[1]);
    }

    console.log("return posts");
    return pagePostIds;
  } catch (error) {
    console.error("Error getting job post Ids: " + error);
    return [];
  }
}
