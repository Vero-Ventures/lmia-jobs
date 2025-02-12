import { chromium as playwright } from "playwright-core";
import type { Browser, BrowserContext, Page } from "playwright-core";
import chromium from "@sparticuz/chromium";
import UserAgent from "user-agents";
import { BrowserHandler } from "@/actions/scraper/helpers/browser-handler";
import { DataHandler } from "@/actions/scraper/site-scraper/update-database";
import { scrapeJobBankPost } from "@/actions/scraper/site-scraper/handler";

// Creates the Chromium browser, page handler, and calls scraper functions
// Takes: The Job Bank Post Id.
export const runScraper = async (postId: string) => {
  // Define browser outside of try catch.
  // Allows closing in finally block without error.
  let browser: Browser | undefined;
  try {
    // Create the Chromium and assign the browser to the browser variable.
    const [newBrowser, _context, page] = await createChromiunm();

    browser = newBrowser;

    const pageHandler = new BrowserHandler(page);

    // Call scraper functions to visit the page and get the data.
    const postToSave = await scrapeJobBankPost(pageHandler, postId);

    // Create a handler with the Post data to save it to the database.
    const dataHandler = new DataHandler(postToSave);

    // Save the Post data to the database with seprate error handler.
    try {
      await dataHandler.createPost();
    } catch (error) {
      console.error("Error Creating Posts: " + error);
    }
  } catch (error) {
    // Only throw errors with scraper creation, not running.
    throw "Error Creating Or Running Scraper: " + error;
  } finally {
    // Close browser regardless of function result.
    if (browser) {
      browser.close();
    }
  }
};

// Create the Playwright Chromium browser, context, and page.
async function createChromiunm(): Promise<[Browser, BrowserContext, Page]> {
  const executablePath = await chromium.executablePath();

  // User Agent generates random user data to assist avoiding bot detection.
  const userAgent = new UserAgent();
  const randomUserAgent = userAgent.random();

  try {
    // Create browser in headless mode, using custom args to avoid bot detection.
    const browser = await playwright.launch({
      executablePath,
      headless: true,
      args: [
        ...chromium.args,
        "--disable-blink-features=AutomationControlled",
        "--disable-features=IsolateOrigins,site-per-process",
      ],
    });

    // Generate the browser context using the User Agent.
    const context = await browser.newContext({
      userAgent: randomUserAgent.toString(),
      viewport: { width: 1920, height: 1080 },
      javaScriptEnabled: true,
      bypassCSP: true,
    });

    // Generate the page from the browser context and return all created elements.
    const page = await context.newPage();

    return [browser, context, page];
  } catch (error) {
    throw "Browser Launch Failed: " + error;
  }
}
