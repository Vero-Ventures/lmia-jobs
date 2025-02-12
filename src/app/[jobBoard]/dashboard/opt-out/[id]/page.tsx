import { redirect } from "next/navigation";
import { OptOutPage } from "@/app/[jobBoard]/dashboard/opt-out/compontents/opt-out-page";

// Takes: The user mailer Id in the params.
export default async function OptOut({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Get mailer Id from URL query params. Throw an error if no mailer Id is found.
  const userId = (await params).id;

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="flex flex-grow flex-col">
      <main className="mx-auto flex max-w-2xl flex-1 items-center justify-center px-4 text-center">
        <OptOutPage userId={userId} />
      </main>
    </div>
  );
}
