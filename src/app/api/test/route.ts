import {
  // runScraper,
  desciptionTest,
} from "@/actions/scraper/run-scraper/setup";

export async function GET() {
  await desciptionTest();

  // if (result.postEmails[0].email !== "error" && result.postIds[0] !== "error") {
  //   return new Response(JSON.stringify(result), { status: 200 });
  // } else {
  //   return new Response("Error", { status: 400 });
  // }
}
