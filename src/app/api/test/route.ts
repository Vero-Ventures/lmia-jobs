// import { runScraper } from "@/actions/scraper/run-scraper/setup";

export async function POST(request: Request) {
  // await runScraper("12345678");

  const body = await request.json();

  console.log("Query Parameters:", JSON.stringify(body));

  return new Response(JSON.stringify("Completed"), { status: 200 });
}
