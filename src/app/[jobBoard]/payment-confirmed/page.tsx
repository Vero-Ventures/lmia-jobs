import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { triggerStripeSyncForUser } from "@/actions/stripe/update-job-board-posting";
import { tryCatch } from "@/lib/utils";

export const dynamic = "force-dynamic";

// Returns: Basic message component before redirecting to dashboard.
async function ConfirmStripeSession() {
  // Get the user's session and redirect users who are not logged in.
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    return <div>Login Required</div>;
  }

  const { error } = await tryCatch(triggerStripeSyncForUser());

  if (error) {
    return <div>Failed to sync with Stripe: {error.message}</div>;
  }

  return redirect("/dashboard");
}

// Takes: An option Stripe session Id in the params.
export default async function PaymentConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ stripe_session_id?: string }>;
}) {
  // Get the Stripe session Id from paramaters.
  // NOTE: Currently Unused.
  const _params = await searchParams;

  return (
    <div className="flex items-center justify-center text-xl">
      <Suspense fallback={<div>One moment...</div>}>
        <ConfirmStripeSession />
      </Suspense>
    </div>
  );
}
