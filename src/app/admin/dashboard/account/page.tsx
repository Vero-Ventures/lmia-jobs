import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Account from "./account";
import { unauthorized } from "next/navigation";

export default async function Component() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    unauthorized();
  }

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <div className="mx-auto mt-10 w-[80%]">
        <Account name={session.user.name} email={session.user.email} />
      </div>
    </div>
  );
}
