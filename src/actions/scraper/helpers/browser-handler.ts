import type { Page } from "playwright-core";
export class BrowserHandler {
  constructor(public page: Page) {}

  // Write the page HTML content to the console.
  async printPage(): Promise<void> {
    console.log(await this.page.innerHTML("main"));
  }

  // Log the page URL, go to the page and wait for the "Load" state.
  // Default timeout of 30 seconds.
  // Takes: The page URL and an optional timeout.
  async visitPage(url: string, loadTimeout = 30000): Promise<void> {
    try {
      console.log(url);
      await this.page.goto(url, { timeout: loadTimeout });
      await this.page.waitForLoadState("load");
    } catch (error) {
      throw error;
    }
  }

  // Wait for an element to be attached on the page (present in the HTML) and click it.
  // Default timeout of 10 seconds.
  // Takes: A CSS Playwright selector for the element and an optional timeout.
  async waitAndClickInput(selector: string, timeout = 10000): Promise<void> {
    try {
      const element = await this.page.waitForSelector(selector, {
        state: "attached",
        timeout,
      });

      await element.dispatchEvent("click");
    } catch (error) {
      throw error;
    }
  }

  // Wait for an element to be  attached on the page (present in the HTML).
  // Takes: A CSS Playwright selector for the element and an optional timeout.
  // Returns: A Playwright Locator for the element.
  async waitAndGetElement(selector: string, waitTimeout: number = 10000) {
    try {
      await this.page.waitForSelector(selector, {
        state: "attached",
        timeout: waitTimeout,
      });

      const element = this.page.locator(selector);

      return element;
    } catch (error) {
      throw error;
    }
  }
}
