import { runScraper } from "@/actions/scraper/run-scraper/setup";

export async function GET() {
  const result = await runScraper();

  const formattedResult = "[" + result.join(", ") + "]";

  if (result[0] !== "error") {
    return new Response(formattedResult, { status: 400 });
  } else {
    return new Response("Error", { status: 400 });
  }
}
