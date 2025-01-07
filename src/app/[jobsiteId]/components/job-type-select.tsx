"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_TYPES } from "../lib/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function JobTypeSelect({
  initialJobType,
}: {
  initialJobType?: string;
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
      defaultValue={initialJobType}
      onValueChange={(value) =>
        router.push(pathname + "?" + createQueryString("jobType", value))
      }>
      <SelectTrigger>
        <SelectValue placeholder="Choose job type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All</SelectItem>
        {JOB_TYPES.map((jobType) => (
          <SelectItem key={jobType} value={jobType}>
            {jobType}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
