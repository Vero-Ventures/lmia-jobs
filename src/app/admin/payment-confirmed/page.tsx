import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { triggerStripeSyncForUser } from "@/actions/stripe/update-job-board-posting";
import { tryCatch } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function ConfirmStripeSession() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    return <div>You need to login.</div>;
  }

  console.log("user", data.user);

  const { error } = await tryCatch(triggerStripeSyncForUser());

  if (error) return <div>Failed to sync with stripe: {error.message}</div>;
  return redirect("/dashboard");
}

export default async function PaymentConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ stripe_session_id?: string }>;
}) {
  const params = await searchParams;

  console.log("[stripe/success] Checkout session id", params.stripe_session_id);

  return (
    <div className="flex min-h-dvh items-center justify-center text-xl">
      <Suspense fallback={<div>One moment...</div>}>
        <ConfirmStripeSession />
      </Suspense>
    </div>
  );
}
