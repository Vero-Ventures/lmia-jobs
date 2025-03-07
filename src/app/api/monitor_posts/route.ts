import { runScraper } from "@/actions/scraper/run-scraper/setup";

// Endpoint called by Zapier RSS monitor to trigger the scraper.
// Takes: An request containing the "authorization" key and the link to the new post.
export async function POST(request: Request) {
  try {
    // Get the text from the request body and parse it.
    // Body contains the authorization key and the post link.
    const text = await request.text();

    const body = await JSON.parse(text);

    // Check that the API request has the correct authorization value.
    if (
      !body.authorization ||
      body.authorization !== process.env.MONITOR_POST_AUTH
    ) {
      return new Response("Invalid monitor posts call authorization.", {
        status: 500,
      });
    }

    // Check for a valid post link in the body.
    if (!body.postLink) {
      return new Response("Post Link Not Found On Monitor Posts Call.", {
        status: 299,
      });
    } else {
      try {
        // Extract the post Id and run the scraper on the post.
        const postId = body.postLink.split("jobposting/")[1];

        await runScraper(postId);

        return new Response("Success.", { status: 200 });
      } catch (error) {
        return new Response("Error running scraper on post from RSS feed: " + error, {
          status: 299,
        });
      }
    }
  } catch (error) {
    return new Response("Unexpected Error: " + error, {
      status: 500,
    });
  }
}
