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
  initalValue,
  filterType,
}: {
  initalValue?: string;
  filterType: "employmentType" | "province";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramString = filterType;

  const selections =
    filterType === "employmentType" ? EMPLOYMENT_TYPES : PROVINCES;

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
