import Heading from "@/components/ui/html/heading";
import Paragraph from "@/components/ui/html/paragraph";
import PricingInputs from "@/app/[jobBoard]/(marketing)/pricing/pricing-inputs";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    boards?: string;
    duration?: string;
  }>;
}) {
  // Get the search parameters from the URL, used in pricing calculator.
  // If the parameters are not provided (on load), default to 3 boards and 4 months.
  const search = await searchParams;
  const postBoards = search.boards ? Number(search.boards) : 3;
  const postDuration = search.duration ? Number(search.duration) : 4;

  // Calculate the total cost of the post for the price calculator on page load.
  const totalCost = postDuration * postBoards * 5.0;

  return (
    <main className="flex flex-col">
      <div className="mx-auto w-5/6 max-w-xl space-y-4 py-10">
        <div className="flex flex-col gap-y-4 rounded-lg border-2 border-gray-300 p-6">
          <Heading variant="h1" className="text-center">
            Pricing
          </Heading>
          <Paragraph>
            The cost of an Opportunities job posting is based on its duration
            and the number of boards it appears on. The base price is $5 per
            month, multiplied by the number of boards selected.
          </Paragraph>
          <Paragraph className="font-semibold">
            Example: A post hosted on 5 boards for 3 months would cost $75.
          </Paragraph>
          <div className="mt-2 space-y-4">
            <PricingInputs
              postBoards={postBoards}
              postDuration={postDuration}
            />
          </div>
          <div>
            <div className="mx-auto mt-4 w-fit space-y-2">
              <h3 className="text-2xl font-bold">Total Cost</h3>
              <Paragraph className="text-center text-xl font-semibold">
                {"$" + totalCost + ".00"}
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
