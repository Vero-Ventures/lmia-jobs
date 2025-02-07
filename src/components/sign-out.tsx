"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { signOut } from "@/lib/auth-client";

export function SignOut() {
  const router = useRouter();
  return (
    <Button
      className="mx-auto mb-2 bg-black !px-6 font-sans !text-lg text-white hover:bg-gray-400 mb:mx-4 mb:max-w-28 sm:mt-2 sm:!text-xl md:!p-6"
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
