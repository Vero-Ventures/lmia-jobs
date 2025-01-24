import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkUserPurchases } from "@/actions/stripe/check-purchases";
import { redirect } from "next/navigation";

export default async function CheckPayment() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (data) {
    await checkUserPurchases(data?.user.id);
  }

  redirect("/admin/dashboard");
}
