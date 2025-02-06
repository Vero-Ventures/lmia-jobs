"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { signOut } from "@/lib/auth-client";

export function SignOut() {
  const router = useRouter();
  return (
    <Button
      className="bg-black !px-4 font-sans !text-lg text-white hover:bg-gray-500 mb:w-1/4 mb:max-w-28 sm:mt-2 sm:!text-xl md:ml-2 md:!p-6 lg:ml-0"
      onClick={async () =>
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/");
              router.refresh();
            },
          },
        })
      }
      variant="secondary">
      Log Out
    </Button>
  );
}
