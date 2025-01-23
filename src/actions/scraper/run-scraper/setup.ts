import { chromium as playwright } from "playwright-core";
import type { Browser, BrowserContext, Page } from "playwright-core";

import chromium from "@sparticuz/chromium";

// import UserAgent from "user-agents";
import { BrowserHandler } from "@/actions/scraper/scraping-handlers/browser-handler";
// import { scrapeGovJobBank } from "@/actions/scraper/site-scrapers/job-bank";

export const runScraper = async () => {
  let browser: Browser | undefined;
  try {
    const [newBrowser, _context, page] = await createChromiunm();

    browser = newBrowser;

    const pageHandler = new BrowserHandler(page);

    await pageHandler.visitPage("https://www.facetofacegames.com/");
  } catch (error) {
    console.error("Create Scraper Error: " + error);
  } finally {
    if (browser) {
      browser.close();
    }
  }
};

async function createChromiunm(): Promise<[Browser, BrowserContext, Page]> {
  const executablePath =
    "C:\\Users\\coppe\\AppData\\Local\\Chromium\\Application\\chrome.exe";

  // const userAgent = new UserAgent();
  // const randomUserAgent = userAgent.random();

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
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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

// async function runSiteScrapers(handler: BrowserHandler) {
//   scrapeGovJobBank(handler);
// }
