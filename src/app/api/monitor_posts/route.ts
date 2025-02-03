// import { runScraper } from "@/actions/scraper/run-scraper/setup";

export default async function handler(request: Request) {
  try {
    const headers = request.headers;
    console.log(headers);

    const params = request.url;
    console.log(params);

    const _monitorPostAuth = process.env.MONIOR_POST_AUTH;

    try {
      // console.log(monitorPostUrl);
      // await runScraper(monitorPostUrl);

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
