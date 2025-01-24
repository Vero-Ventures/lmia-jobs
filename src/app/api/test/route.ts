import { runScraper } from "@/actions/scraper/run-scraper/setup";

export async function GET() {
  const result = await runScraper();

  if (result.postEmails[0] !== "error" && result.postIds[0] !== "error") {
    return new Response(JSON.stringify(result), { status: 400 });
  } else {
    return new Response("Error", { status: 400 });
  }
}
