import type { BrowserHandler } from "@/actions/scraper/scraping-handlers/browser-handler";
import { CONFIG } from "@/actions/scraper/helpers/config";

export async function scrapeGovJobBank(
  browserHandler: BrowserHandler
): Promise<string[]> {
  let pageNum = 1;
  let scrape = true;

  const postIds: string[] = [];

  while (scrape) {
    const newPostIds = await scrapePosts(browserHandler, pageNum);
    postIds.push(...newPostIds);
    pageNum += 1;

    if (pageNum >= 10) {
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
      const fullId = await post.getAttribute("id");
      pagePostIds.push(fullId!.split("-")[1]);
    }

    return pagePostIds;
  } catch (error) {
    console.error("Error getting job post Ids: " + error);
    return [];
  }
}
