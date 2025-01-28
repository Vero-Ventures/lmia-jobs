import { chromium as playwright } from "playwright-core";
import type { Browser, BrowserContext, Page } from "playwright-core";

import chromium from "@sparticuz/chromium";

import UserAgent from "user-agents";
import { BrowserHandler } from "@/actions/scraper/scraping-handlers/browser-handler";
import {
  getDescription,
  scrapeGovJobBank,
} from "@/actions/scraper/site-scrapers/job-bank";

export const runScraper = async () => {
  let browser: Browser | undefined;

  let result = {
    postIds: ["error"],
    postEmails: [{ email: "error", postId: "error" }],
  };
  try {
    const [newBrowser, _context, page] = await createChromiunm();

    browser = newBrowser;

    const pageHandler = new BrowserHandler(page);

    result = await runSiteScrapers(pageHandler);
  } catch (error) {
    console.error("Create Scraper Error: " + error);
  } finally {
    if (browser) {
      browser.close();
    }
    return result;
  }
};

export const desciptionTest = async () => {
  let browser: Browser | undefined;
  try {
    const [newBrowser, _context, page] = await createChromiunm();

    browser = newBrowser;

    const pageHandler = new BrowserHandler(page);

    getDescription(pageHandler);
  } catch (error) {
    console.error("Create Scraper Error: " + error);
  } finally {
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
    console.error("Browser Launch Failed:", error);
    throw error;
  }
}

async function runSiteScrapers(handler: BrowserHandler): Promise<{
  postIds: string[];
  postEmails: { email: string; postId: string }[];
}> {
  return await scrapeGovJobBank(handler);
}
