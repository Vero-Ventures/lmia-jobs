import type { Page } from "playwright-core";
export class BrowserHandler {
  constructor(public page: Page) {}

  async printPage(): Promise<void> {
    console.log(await this.page.innerHTML("main"));
  }

  async visitPage(url: string): Promise<void> {
    try {
      await this.page.goto(url, { timeout: 30000 });
      await this.page.waitForLoadState("load");
    } catch (error) {
      throw error;
    }
  }

  async waitAndClickInput(selector: string, timeout = 10000): Promise<void> {
    try {
      const element = await this.page.waitForSelector(selector, {
        state: "attached",
        timeout,
      });

      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }
      await element.dispatchEvent("click");
    } catch (error) {
      throw error;
    }
  }

  async waitAndGetElement(selector: string, waitTimeout: number = 10000) {
    try {
      await this.page.waitForSelector(selector, {
        state: "attached",
        timeout: waitTimeout,
      });

      const element = this.page.locator(selector);

      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }

      return element;
    } catch (error) {
      throw error;
    }
  }

  async clickLinkAndWait(
    selector: string,
    selectTimeout = 10000,
    waitTime = 2000
  ): Promise<void> {
    try {
      const element = await this.page.waitForSelector(selector, {
        state: "attached",
        timeout: selectTimeout,
      });

      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }

      await element.click();

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, waitTime);
      });

      await this.page.waitForLoadState("load");
    } catch (error) {
      throw error;
    }
  }

  async clickAndFill(
    selector: string,
    text: string,
    selectTimeout: number = 10000
  ): Promise<void> {
    try {
      const element = await this.page.waitForSelector(selector, {
        state: "attached",
        timeout: selectTimeout,
      });

      if (!element) {
        throw new Error(`Input not found: ${selector}`);
      }

      await element.click();
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
}
