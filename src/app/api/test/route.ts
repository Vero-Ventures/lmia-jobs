import { runScraper } from "@/actions/scraper/run-scraper/setup";

export async function GET() {
  await runScraper();

  return new Response(JSON.stringify("Completed"), { status: 200 });
}
