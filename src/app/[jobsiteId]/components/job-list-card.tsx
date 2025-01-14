"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { JobPosting } from "@/app/lib/types";

export function JobListCard({
  jobPosting,
  handleChangeSelectedJobPosting,
  isSelected,
}: {
  jobPosting: JobPosting;
  handleChangeSelectedJobPosting: (jobPosting: JobPosting) => void;
  isSelected: boolean;
}) {
  return (
    <Card
      onClick={() => handleChangeSelectedJobPosting(jobPosting)}
      className={cn(
        "cursor-pointer space-y-3 transition-colors",
        isSelected && "border-2 border-primary"
      )}>
      <CardHeader>
        <CardTitle className="titleCase overflow-clip text-xl font-bold">
          {jobPosting.jobTitle}
        </CardTitle>
        <CardDescription>{jobPosting.hiringOrganization}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div className="overflow-clip text-gray-500 dark:text-gray-400">
            {jobPosting.addressLocality}, {jobPosting.addressRegion}
          </div>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ${`${jobPosting.minCompValue}`}{" "}
            {jobPosting.maxCompValue ? `to $${jobPosting.maxCompValue}` : ""}{" "}
            {jobPosting.compTimeUnit}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-gray-400">
          Opened: {new Date(jobPosting.datePosted).toDateString()}
        </div>
      </CardFooter>
    </Card>
  );
}
