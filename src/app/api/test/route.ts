// import { runScraper } from "@/actions/scraper/run-scraper/setup";

export async function GET(request: Request) {
  // await runScraper("12345678");

  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  console.log("Query Parameters:", params);

  return new Response(JSON.stringify("Completed"), { status: 200 });
}
