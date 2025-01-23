import { runScraper } from "@/actions/scraper/run-scraper/setup";

export async function GET() {
  const result = await runScraper();
  if (result) {
    return new Response("Success", { status: 200 });
  } else {
    return new Response("Error", { status: 400 });
  }
}
