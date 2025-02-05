import { chromium as playwright } from "playwright-core";
import type { Browser, BrowserContext, Page } from "playwright-core";
import chromium from "@sparticuz/chromium";
import UserAgent from "user-agents";
import { BrowserHandler } from "@/actions/scraper/helpers/browser-handler";
import { DataHandler } from "@/actions/scraper/site-scraper/update-database";
import { scrapeJobBankPost } from "@/actions/scraper/site-scraper/handler";

export const runScraper = async (postId: string) => {
  let browser: Browser | undefined;
  try {
    console.log("Start Scraper Process");
    const [newBrowser, _context, page] = await createChromiunm();

    browser = newBrowser;

    const pageHandler = new BrowserHandler(page);

    const postToSave = await scrapeJobBankPost(pageHandler, postId);

    const dataHandler = new DataHandler(postToSave);

    try {
      console.log(JSON.stringify(postToSave));
      await dataHandler.createPosts();
    } catch (error) {
      console.error("Error Creating Posts: " + error);
    }
  } catch (error) {
    console.error("Error Creating Scraper: " + error);
  } finally {
    console.log("Complete Scraper Process");
    if (browser) {
      browser.close();
    }
  }
};

async function createChromiunm(): Promise<[Browser, BrowserContext, Page]> {
  const executablePath = await chromium.executablePath();

  const userAgent = new UserAgent();
  const randomUserAgent = userAgent.random();

  try {
    const browser = await playwright.launch({
      executablePath,
      headless: true,
      args: [
        ...chromium.args,
        "--disable-blink-features=AutomationControlled",
        "--disable-features=IsolateOrigins,site-per-process",
      ],
    });

    const context = await browser.newContext({
      userAgent: randomUserAgent.toString(),
      viewport: { width: 1920, height: 1080 },
      javaScriptEnabled: true,
      bypassCSP: true,
    });

    const page = await context.newPage();

    return [browser, context, page];
  } catch (error) {
    console.error("Browser Launch Failed: " + error);
    throw error;
  }
}
