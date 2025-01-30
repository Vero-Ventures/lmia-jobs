import Heading from "@/components/heading";
import PricingInputs from "./pricing-inputs";
import P from "@/components/paragraph";

interface PageProps {
  searchParams: Promise<{
    boards?: string;
    duration?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const search = await searchParams;
  const postBoards = search.boards ? Number(search.boards) : 3;
  const postDuration = search.duration ? Number(search.duration) : 4;

  const totalCost = postDuration * postBoards * 5.0;

  return (
    <main className="flex min-h-dvh flex-col">
      <div className="mx-auto max-w-xl space-y-4 py-10">
        <Heading variant="h1">Pricing</Heading>
        <P>
          The cost of an Opportunities job posting is based on its duration and
          the number of boards it appears on. The base price is $5 per month,
          multiplied by the number of boards selected.
        </P>
        <P>
          For example, a post hosted on 5 boards for 3 months would cost $75.
        </P>
        <div className="space-y-4">
          <PricingInputs postBoards={postBoards} postDuration={postDuration} />
        </div>
        <div>
          <div className="space-y-2">
            <h3 className="font-bold">Total Cost</h3>
            <P>{"$" + totalCost + ".00"}</P>
          </div>
        </div>
      </div>
    </main>
  );
}
