import { runScraper } from "@/actions/scraper/run-scraper/setup";

// Endpoint called by Zapier RSS monitor to trigger the scraper.
// Takes: An request containing the "authorization" key and the link to the new post.
export async function POST(request: Request) {
  try {
    const body = await request.json();

    runHandler(body);

    return new Response("Success.", { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch RSS feed: " + error, {
      status: 500,
    });
  }
}

// Runs the scraper on the post link provided in the body.
// Takes: The body of the request containing the "authorization" key and the link to the new post.
async function runHandler(body: { authorization: string; postLink: string }) {
  try {
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
        status: 500,
      });
    } else {
      try {
        // Extract the post Id and run the scraper on the post.
        const postId = body.postLink.split("jobposting/")[1];
        await runScraper(postId);

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