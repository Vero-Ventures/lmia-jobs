import { runScraper } from "@/actions/scraper/run-scraper/setup";

export async function GET() {
  const result = await runScraper();
  if (result[0] !== "error") {
    return result;
  } else {
    return new Response("Error", { status: 400 });
  }
}
