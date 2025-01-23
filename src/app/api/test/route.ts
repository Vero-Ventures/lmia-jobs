import { runScraper } from "@/actions/scraper/run-scraper/setup";

export async function GET() {
  const result = await runScraper();
  if (result !== "error") {
    return JSON.parse(result!);
  } else {
    return new Response("Error", { status: 400 });
  }
}
