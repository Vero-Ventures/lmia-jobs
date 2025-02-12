import { redirect } from "next/navigation";
import { OptOutPage } from "@/app/[jobBoard]/dashboard/opt-out/compontents/opt-out-page";

// Takes: The user email in the params.
export default async function OptOut({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  let email = "";
  // Get user email from URL query params. Throw an error if no email is found.
  email = (await params).email;

  if (!email) {
    redirect("/");
  }

  return (
    <div className="flex flex-grow flex-col">
      <main className="mx-auto flex max-w-2xl flex-1 items-center justify-center px-4 text-center">
        <OptOutPage email={email} />
      </main>
    </div>
  );
}
