import type { Page } from "playwright-core";

export class BrowserHandler {
  constructor(private page: Page) {}

  async visitPage(url: string): Promise<void> {
    try {
      await this.page.goto(url, { timeout: 30000 });
      await this.page.waitForLoadState("load");
    } catch (error) {
      console.log("error");
      throw error;
    }
  }

  async waitAndClickInput(selector: string, timeout = 10000): Promise<void> {
    try {
      const element = await this.page.waitForSelector(selector, {
        state: "visible", // Or Attached
        timeout,
      });
      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }
      await element.click();
    } catch (error) {
      throw error;
    }
  }

  async waitAndClickLunk(
    selector: string,
    timeout = 5000,
    waitTime = 10000
  ): Promise<void> {
    try {
      const element = await this.page.waitForSelector(selector, {
        state: "visible", // Or Attached
        timeout,
      });

      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, waitTime);
      });

      await element.click();
    } catch (error) {
      throw error;
    }
  }

  async waitAndFill(
    selector: string,
    text: string,
    findTimeout: number = 10000,
    fillTimeout: number = 5000
  ): Promise<void> {
    try {
      const element = await this.page.waitForSelector(selector, {
        state: "visible",
        timeout: findTimeout,
      });

      if (!element) {
        throw new Error(`Input not found: ${selector}`);
      }

      await element.click();
      await this.page.waitForTimeout(fillTimeout);
      await this.page.fill(selector, text);
    } catch (error) {
      throw error;
    }
  }

  async clearAndFill(
    selector: string,
    text: string,
    timeout: number = 10000
  ): Promise<void> {
    try {
      await this.waitAndClickInput(selector, timeout);
      await this.page.keyboard.press("Control+A");
      await this.page.keyboard.press("Backspace");
      await this.page.fill(selector, text);
    } catch (error) {
      throw error;
    }
  }

  async getElement(selector: string) {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: "visible", timeout: 10000 });

      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }

      return element;
    } catch (error) {
      throw error;
    }
  }
}
