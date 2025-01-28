import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { JobPosting } from "@/app/lib/types";
import { Badge } from "@/components/ui/badge";

export function JobListCard({ jobPosting }: { jobPosting: JobPosting }) {
  const currentDate = new Date();
  return (
    <Card className={cn("mt-2 cursor-pointer space-y-3")}>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div className="space-y-2">
            <CardTitle className={`titleCase overflow-clip text-xl font-bold`}>
              {jobPosting.jobTitle}
            </CardTitle>
            <CardDescription>{jobPosting.organizationName}</CardDescription>
            <div>
              {jobPosting.hidden && <Badge variant="secondary">Hidden</Badge>}
              {currentDate > jobPosting.expiresAt && (
                <Badge variant="destructive">Expired</Badge>
              )}
            </div>
          </div>
          <div className="space-x-4 text-sm text-gray-500">
            <Badge variant="outline">
              {jobPosting.city}, {jobPosting.region}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {jobPosting.employmentType} - From ${`${jobPosting.minPayValue}`}{" "}
            {jobPosting.maxPayValue ? `to $${jobPosting.maxPayValue}` : ""}{" "}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
