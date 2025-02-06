import { runScraper } from "@/actions/scraper/run-scraper/setup";

export async function GET() {
  await runScraper("12345678");

  return new Response(JSON.stringify("Completed"), { status: 200 });
}
