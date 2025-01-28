"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { signOut } from "@/lib/auth-client";

export function SignOut() {
  const router = useRouter();
  return (
    <Button
      onClick={async () =>
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/");
            },
          },
        })
      }
      variant="secondary">
      Log Out
    </Button>
  );
}
