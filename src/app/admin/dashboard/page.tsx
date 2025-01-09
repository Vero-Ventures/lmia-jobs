"use client";

import { WrenchIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Component() {
  const router = useRouter();

  return (
    <div>
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-100">
        <WrenchIcon className="h-12 w-12 text-gray-500" />
        <h1 className="text-2xl font-bold text-gray-800">
          Page Under Construction
        </h1>
        <p className="max-w-md text-center text-gray-500">
          This page is currently being worked on and will be available soon.
          Please check back later.
        </p>
        <button
          onClick={() =>
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/admin");
                },
              },
            })
          }>
          Sign Out
        </button>
      </div>
    </div>
  );
}
