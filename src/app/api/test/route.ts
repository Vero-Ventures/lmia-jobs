import {
  // runScraper,
  desciptionTest,
} from "@/actions/scraper/run-scraper/setup";

export async function GET() {
  await desciptionTest();

  return new Response("success", { status: 200 });

  // const result = await runScraper()

  // return new Response(JSON.stringify(result), { status: 200 });
}
