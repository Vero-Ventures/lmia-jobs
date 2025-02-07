"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const [boards, setBoards] = useState(postBoards);
  const [duration, setDuration] = useState(postDuration);

  function handleUpdateSearchParams(key: string, value: number) {
    const params = new URLSearchParams(searchParams);
    params.set(key, value.toString());
    if (key === "boards") {
      setBoards(value);
    }
    if (key === "duration") {
      setDuration(value);
    }
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
