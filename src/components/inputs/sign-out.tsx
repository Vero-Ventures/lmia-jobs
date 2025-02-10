"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { signOut } from "@/lib/auth-client";

export function SignOut() {
  const router = useRouter();
  return (
    <Button
      className="my-2 mb-3 bg-black text-white hover:bg-gray-400 mb:mx-4 mb:max-w-28 mb:!px-6 mb:!text-lg sm:mt-4 sm:!text-xl md:!p-6"
      onClick={async () =>
        await signOut({
          fetchOptions: {
            // Timeout function ensures refresh happens after session checks update to new state.
            // Needed to properly update nav-bar state.
            onSuccess: () => {
              router.push("/");
              setTimeout(() => {
                router.refresh();
              }, 100);
            },
          },
        })
      }
      variant="secondary">
      Log Out
    </Button>
  );
}
