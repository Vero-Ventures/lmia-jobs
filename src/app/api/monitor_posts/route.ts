import { runScraper } from "@/actions/scraper/run-scraper/setup";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check that the API request has the correct authorization value.
    if (
      !body.authorization ||
      body.authorization !== process.env.MONIOR_POST_AUTH
    ) {
      return new Response("Invalid monitor posts call authorization.", {
        status: 500,
      });
    }

    // Check for a valid post link in the body.
    if (!body.postLink) {
      return new Response("Post Link Not Found On Monitor Posts Call.", {
        status: 500,
      });
    } else {
      try {
        // Extract the post Id and run the scraper on the post.
        const postId = body.postLink.split("jobposting/")[1];
        await runScraper(postId);

        // Return success if process completes.
        return new Response("Success.", { status: 200 });
      } catch (error) {
        return new Response("Failed to run scraper on RSS feed: " + error, {
          status: 500,
        });
      }
    }
  } catch (error) {
    return new Response("Failed to fetch RSS feed: " + error, {
      status: 500,
    });
  }
}
