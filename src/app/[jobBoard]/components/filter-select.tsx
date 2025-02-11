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
import { EMPLOYMENT_TYPES, PROVINCES } from "@/app/lib/constants";

export default function FilterSelect({
  initialValue,
  filterType,
}: {
  initialValue?: string;
  filterType: "employmentType" | "province";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramString = filterType;

  // Use paramater value to set filter as employment type or province.
  // A seperate filter select component is used for each filter type.
  const selections =
    filterType === "employmentType" ? EMPLOYMENT_TYPES : PROVINCES;

  // When user selects a filter:
  const createQueryString = useCallback(
    (name: string, value: string) => {
      // Update the URL params with the selected filter.
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      // Return the updated URL params in a string for redirection.
      return params.toString();
    },
    [searchParams]
  );
  return (
    <Select
      defaultValue={initialValue}
      onValueChange={(value) =>
        router.push(pathname + "?" + createQueryString(paramString, value))
      }>
      <SelectTrigger>
        <SelectValue
          placeholder={`Choose ${filterType === "employmentType" ? "employment type" : "province"}`}
        />
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
