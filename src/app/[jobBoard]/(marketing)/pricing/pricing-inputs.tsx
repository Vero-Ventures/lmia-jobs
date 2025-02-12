"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Takes: The number of boards posted and the duration of the post.
export default function PricingInputs({
  postBoards,
  postDuration,
}: {
  postBoards: number;
  postDuration: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track the number of boards and duration of the post.
  // Set the initial state of the inputs to the search parameters.
  const [boards, setBoards] = useState(postBoards);
  const [duration, setDuration] = useState(postDuration);

  // Takes: Which search parameter to update and the new value.
  function handleUpdateSearchParams(key: string, value: number) {
    // Get the current search parameters to be updated.
    const params = new URLSearchParams(searchParams);
    // Update the search parameters with the new values.
    params.set(key, value.toString());

    // Update the state of the specified.
    if (key === "boards") {
      setBoards(value);
    }
    if (key === "duration") {
      setDuration(value);
    }

    // Update the page with the newly created search parameters.
    router.replace(`${pathname}?${params.toString()}`);
  }
  return (
    <>
      <div className="space-y-2">
        <Label className="text-lg">Number Of Job Boards</Label>
        <Input
          type="number"
          value={boards}
          onChange={(e) =>
            handleUpdateSearchParams("boards", Number(e.target.value))
          }
          min="1"
          max="5"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-lg">Months Posted</Label>
        <Input
          type="number"
          value={duration}
          onChange={(e) =>
            handleUpdateSearchParams("duration", Number(e.target.value))
          }
          min="1"
          max="12"
        />
      </div>
    </>
  );
}
