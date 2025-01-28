import { runScraper } from "@/actions/scraper/run-scraper/setup";

export async function GET() {
  const result = await runScraper();

  return new Response(JSON.stringify(result), { status: 200 });
}
