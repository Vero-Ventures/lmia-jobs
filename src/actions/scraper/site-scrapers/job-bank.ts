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

    await browserHandler.visitPage(CONFIG.urls.govSearchPage + String(pageNum));

    const posts = await browserHandler.getElement(
      CONFIG.selectors.govJobBank.jobPosting
    );

    for (const post of await posts.all()) {
      const fullId = await post.getAttribute("Id");
      pagePostIds.push(fullId!.split("-")[1]);
    }

    return pagePostIds;
  } catch (error) {
    console.error("Error getting job post Ids: " + error);
    return [];
  }
}
