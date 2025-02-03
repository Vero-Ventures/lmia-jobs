// import { runScraper } from "@/actions/scraper/run-scraper/setup";
// Test Change For Vercel Re-Build

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.authorization ||
      body.authorization !== process.env.MONIOR_POST_AUTH
    ) {
      return new Response("Invalid monitor posts call authorization.", {
        status: 500,
      });
    }

    if (!body.postLink) {
      return new Response("Post Link Not Found On Monitor Posts Call.", {
        status: 500,
      });
    } else {
      try {
        console.log(body.postLink);
        console.log(body.postLink.split("jobposting/")[1]);

        // const postId = body.postLink.split('jobposting/')[1]
        // await runScraper(postId);

        return new Response("", { status: 200 });
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
