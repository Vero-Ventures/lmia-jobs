import { runScraper } from "@/actions/scraper/run-scraper/setup";

// The API route to run the scraper on a specific post.
// Use: Testing the scraper on a post with specific content.
export async function GET() {
  const postId = "12345678";

  await runScraper(postId);

  return new Response("Completed", { status: 200 });
}
