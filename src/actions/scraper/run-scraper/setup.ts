import { chromium as playwright } from "playwright-core";
import type { Browser, BrowserContext, Page } from "playwright-core";

import chromium from "@sparticuz/chromium";

import UserAgent from "user-agents";
import { BrowserHandler } from "@/actions/scraper/scraping-handlers/browser-handler";
import { scrapeGovJobBank } from "@/actions/scraper/site-scrapers/job-bank";
import { CONFIG } from "@/actions/scraper/helpers/config";

export const runScraper = async () => {
  let browser: Browser | undefined;

  console.log(CONFIG.urls.govSearchPage + String(1))

  let result = ["error"];
  try {
    const [newBrowser, _context, page] = await createChromiunm();

    browser = newBrowser;

    const pageHandler = new BrowserHandler(page);

    result = await runSiteScrapers(pageHandler);
  } catch (error) {
    console.error("Create Scraper Error: " + error);
    result = ["error"];
  } finally {
    if (browser) {
      browser.close();
    }
    return result;
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
    console.error("Browser Launch Failed:", error);
    throw error;
  }
}

async function runSiteScrapers(handler: BrowserHandler): Promise<string[]> {
  return await scrapeGovJobBank(handler);
}
