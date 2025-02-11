import { runScraper } from "@/actions/scraper/run-scraper/setup";

// Test the scraper on a post with specific content.
// Examples" Address, Max Pay, Max Work Hours, Or Specific Description Content.
export async function GET() {
  const postId = "12345678";

  await runScraper(postId);

  return new Response("Completed", { status: 200 });
}
