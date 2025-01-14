"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_TYPES, PROVINCES } from "@/app/lib/constants";

export default function SearchSelect({
  initalValue,
  filterType,
}: {
  initalValue?: string;
  filterType: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let paramString = filterType;

  let selections = PROVINCES;
  if (filterType === "job type") {
    selections = JOB_TYPES;
    paramString = "jobType";
  }

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  return (
    <Select
      defaultValue={initalValue}
      onValueChange={(value) =>
        router.push(pathname + "?" + createQueryString(paramString, value))
      }>
      <SelectTrigger>
        <SelectValue placeholder={`Choose ${filterType}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All</SelectItem>
        {selections.map((selection) => (
          <SelectItem key={selection.value} value={selection.value}>
            {selection.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
