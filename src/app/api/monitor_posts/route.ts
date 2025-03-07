import { runScraper } from "@/actions/scraper/run-scraper/setup";

// Endpoint called by Zapier RSS monitor to trigger the scraper.
// Takes: An request containing the "authorization" key and the link to the new post.
export async function POST(request: Request) {
  try {
    // Get the text from the request body and parse it.
    // Body contains the authorization key and the post link.
    const text = await request.text();

    console.log("Text")

    const body = await JSON.parse(text);

    console.log("Body")

    // Check that the API request has the correct authorization value.
    if (
      !body.authorization ||
      body.authorization !== process.env.MONITOR_POST_AUTH
    ) {
      console.log("Bad Auth")
      return new Response("Invalid monitor posts call authorization.", {
        status: 500,
      });
    }

    console.log("Auth")

    // Check for a valid post link in the body.
    if (!body.postLink) {
      console.log("No Link")
      return new Response("Post Link Not Found On Monitor Posts Call.", {
        status: 500,
      });
    } else {
      try {
        console.log("Get ID")
        // Extract the post Id and run the scraper on the post.
        const postId = body.postLink.split("id=")[1];

        console.log("Post ID")
        console.log(postId)

        await runScraper(postId);

        return new Response("Success.", { status: 200 });
      } catch (error) {
        console.log("Scraper Error")
        return new Response("Failed to run scraper on RSS feed: " + error, {
          status: 500,
        });
      }
    }
  } catch (error) {
    console.log("Other Error")
    return new Response("Failed to fetch RSS feed: " + error, {
      status: 500,
    });
  }
}
