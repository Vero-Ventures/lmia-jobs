"use client";

import { cn, formatMoney } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { JobPosting } from "@/db/schema";
import Paragraph from "@/components/ui/html/paragraph";

// Takes: The job posting and if the user is the post owner.
export function JobListCard({
  jobPosting,
  isAdmin,
}: {
  jobPosting: JobPosting;
  isAdmin?: boolean;
}) {
  const currentDate = new Date();
  return (
    <Card className={cn("mt-2 cursor-pointer space-y-3")}>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div className="space-y-2">
            <CardTitle className={`titleCase overflow-clip text-xl font-bold`}>
              {jobPosting.title}
            </CardTitle>
            <CardDescription>{jobPosting.orgName}</CardDescription>
            <div>
              {isAdmin ? (
                jobPosting.paymentConfirmed ? (
                  <Badge variant="success">Paid</Badge>
                ) : (
                  <Badge variant="warning">Not Paid</Badge>
                )
              ) : null}
              {isAdmin && jobPosting.hidden && (
                <Badge variant="secondary">Hidden</Badge>
              )}
              {currentDate > jobPosting.expiresAt && (
                <Badge variant="destructive">Expired</Badge>
              )}
            </div>
          </div>
          <div className="space-x-4 text-sm text-gray-500">
            <Badge>
              {jobPosting.city && jobPosting.city + ", "} {jobPosting.province}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <Paragraph>
            ${`${formatMoney(Number(jobPosting.minPayValue))}`}{" "}
            {jobPosting.maxPayValue &&
              `to $${formatMoney(Number(jobPosting.maxPayValue))}`}
            {jobPosting.paymentType === "Hourly" ? " hourly" : " annually"}
          </Paragraph>
        </div>
      </CardContent>
    </Card>
  );
}
