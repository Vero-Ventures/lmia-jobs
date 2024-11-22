"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROVINCES } from "../lib/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function LocationSelect({
  initialLocation,
}: {
  initialLocation?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  /**
   * Get a new searchParams string by merging the current searchParams with a provided key/value pair
   **/
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
      defaultValue={initialLocation}
      onValueChange={(value) =>
        router.push(pathname + "?" + createQueryString("location", value))
      }
      name="location"
    >
      <SelectTrigger>
        <SelectValue placeholder="Choose location" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All</SelectItem>
        {PROVINCES.map((province) => (
          <SelectItem key={province.value} value={province.value}>
            {province.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
