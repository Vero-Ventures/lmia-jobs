import type { BrowserHandler } from "@/actions/scraper/scraping-handlers/browser-handler";
import { CONFIG } from "@/actions/scraper/helpers/config";
// import { DataHandler } from "@/actions/scraper/scraping-handlers/data-handler";

export async function scrapeGovJobBank(
  browserHandler: BrowserHandler
): Promise<{ postIds: string[]; postEmails: string[] }> {
  let pageNum = 1;
  let scrape = true;

  // const dataHandler = new DataHandler();

  const postIds: string[] = [];

  while (scrape) {
    const newPostIds = await scrapePosts(browserHandler, pageNum);
    postIds.push(...newPostIds);
    pageNum += 1;

    if (pageNum > 0) {
      scrape = false;
    }
  }

  const { postEmails, badPostIds } = await visitPages(browserHandler, postIds);

  const goodPosts = postIds!.filter(
    (postId: string) => !badPostIds.includes(postId)
  );

  return { postIds: goodPosts, postEmails: postEmails };
}

async function scrapePosts(
  browserHandler: BrowserHandler,
  pageNum: number
): Promise<string[]> {
  try {
    const pagePostIds: string[] = [];

    await browserHandler.visitPage(CONFIG.urls.govSearchPage + String(pageNum));

    const posts = await browserHandler.getElement(
      CONFIG.selectors.govJobBank.info.jobPosting
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

async function visitPages(
  browserHandler: BrowserHandler,
  postIds: string[]
): Promise<{ postEmails: string[]; badPostIds: string[] }> {
  try {
    const emails: string[] = [];
    const badPosts: string[] = [];

    for (const post of postIds) {
      console.log(
        "Go To Page: " +
          CONFIG.urls.searchResult +
          String(post) +
          "?source=searchresults"
      );

      await browserHandler.visitPage(
        CONFIG.urls.searchResult + String(post) + "?source=searchresults"
      );
      try {
        await browserHandler.waitAndClickInput(
          CONFIG.selectors.govJobBank.inputs.howToApply
        );

        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 5000);
        });

        const email = await browserHandler.waitAndGetElement(
          CONFIG.selectors.govJobBank.info.postEmail
        );

        const emailLink = await email.getAttribute("href");
        console.log("Email Link: " + emailLink);

        const emailText = await email.innerText();
        console.log("Email Text: " + emailText);

        if (emailText) {
          emails.push(emailText);
        }
      } catch (error) {
        console.error("Error: " + error);
        console.error("Post With ID: " + post + " Is Invalid");
        badPosts.push(post);
      }
    }

    return { postEmails: emails, badPostIds: badPosts };
  } catch (error) {
    console.error("Error getting gettig post page emails: " + error);
    return { postEmails: [], badPostIds: [] };
  }
}
