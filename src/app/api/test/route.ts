import { runScraper } from "@/actions/scraper/run-scraper/setup";

export async function GET() {
  try {
    await runScraper();
    
    return new Response("Success", { status: 200 });
  } catch (error) {
    console.error("Error: " + error);

    return new Response("Error", { status: 400 });
  }
}
