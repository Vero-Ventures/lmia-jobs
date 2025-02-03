import Parser from "rss-parser";
// import { runScraper } from "@/actions/scraper/run-scraper/setup";

const parser = new Parser();
const RSS_FEED_URL =
  "https://www.jobbank.gc.ca/jobsearch/feed/jobSearchRSSfeed?fet=%C2%AC1&fglo=1&fsrc=16&fage=2&sort=D&rows=100";

export default async function handler() {
  try {
    const feed = await parser.parseURL(RSS_FEED_URL);

    const latestPost = feed.items[0];

    try {
      console.log(latestPost)
      // await runScraper(latestPost);

      return new Response("Completed", { status: 200 });
    } catch (error) {
      return new Response("Failed to run scraper on RSS feed: " + error, {
        status: 500,
      });
    }
  } catch (error) {
    return new Response("Failed to fetch RSS feed: " + error, {
      status: 500,
    });
  }
}
