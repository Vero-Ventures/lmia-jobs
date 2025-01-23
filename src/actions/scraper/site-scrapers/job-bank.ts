import type { BrowserHandler } from "@/actions/scraper/scraping-handlers/browser-handler";
import { CONFIG } from "../helpers/config";

export async function scrapeGovJobBank(browserHandler: BrowserHandler) {
  let pageNum = 1;
  let scrape = true;

  const postIds = [];

  while (scrape) {
    postIds.push(await scrapePosts(browserHandler, pageNum));
    pageNum += 1;

    // Test Limit
    if (pageNum > 10) {
      scrape = false;
    }
  }
}

async function scrapePosts(
  browserHandler: BrowserHandler,
  pageNum: number
): Promise<string[]> {
  try {
    const pagePostIds: string[] = [];

    browserHandler.visitPage(CONFIG.urls.govSearchPage + String(pageNum), 5000);

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
