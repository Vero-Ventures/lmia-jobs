"use client";

import {
  MapPinIcon,
  ClockIcon,
  BriefcaseIcon,
  CircleDollarSignIcon,
  CalendarIcon,
  User2Icon,
  MailIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { JobPosting } from "@/app/lib/types";

export function JobPostingCard({ jobPosting }: { jobPosting: JobPosting }) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return (
    <Card className="h-fit overflow-y-auto">
      <CardHeader className="space-y-4">
        <div>
          <CardTitle
            className={`titleCase text-2xl font-bold dark:text-white ${jobPosting.hidden ? "italic text-gray-600" : ""}`}>
            {jobPosting.jobTitle} {jobPosting.hidden ? "- Hidden" : ""}
          </CardTitle>
          <CardDescription className="mt-2 text-gray-500 dark:text-gray-400">
            {jobPosting.organizationName}
          </CardDescription>
          <div className="ml-auto flex w-fit flex-col">
            <div className="mt-2 text-start text-sm text-gray-500 dark:text-gray-400">
              Opened: {new Date(jobPosting.createdAt).toDateString()}
            </div>
            <div className="mt-2 text-start text-sm text-gray-500 dark:text-gray-400">
              Closes: {new Date(jobPosting.expiresAt).toDateString()}
            </div>
            <div className="mt-2 text-center font-semibold text-red-500">
              {currentDate > new Date(jobPosting.expiresAt) ? "Expired" : ""}
            </div>
          </div>
        </div>

        <div className="grid gap-6 text-sm md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2">
              <BriefcaseIcon className="size-6 text-gray-500 dark:text-gray-400" />
              <span className="titleCase text-gray-500 dark:text-gray-400">
                {jobPosting.employmentType
                  ? `${jobPosting.employmentType}`
                  : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-6 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                {jobPosting.address && `${jobPosting.address}, `}
                {jobPosting.city}, {jobPosting.region}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CircleDollarSignIcon className="size-6 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                ${jobPosting.minPayValue}{" "}
                {jobPosting.minPayValue ? `to $${jobPosting.maxPayValue}` : ""}{" "}
                {jobPosting.paymentType}
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="size-6 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                {`${jobPosting.workHours ? jobPosting.workHours + " / Week" : "N/A"}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-6 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                {`${jobPosting.startTime ? "Start By: " + jobPosting.startTime : "N/A"}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User2Icon className="size-6 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                {jobPosting.vacancies
                  ? `${jobPosting.vacancies} ${jobPosting.vacancies > 1 ? "vacancies" : "vacancy"} `
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <div className="pt-4">
        <CardContent>
          <h5 className={`text-base font-bold dark:text-white`}>
            Job Description
          </h5>
          <p
            className="mt-4 text-gray-500 dark:text-gray-400"
            dangerouslySetInnerHTML={{ __html: jobPosting.description }}
          />
        </CardContent>
        <CardFooter>
          <div className="flex flex-col gap-2">
            <div className="flex">
              <MailIcon className="mr-2 mt-0.5" />
              <h5 className={`mr-4 mt-0.5 text-base font-bold dark:text-white`}>
                Apply by email
              </h5>
              <div className="flex items-center gap-3 text-sm">
                <a
                  href={`mailto:${jobPosting.email}`}
                  className="text-lg text-blue-900 underline">
                  {jobPosting.email}
                </a>
              </div>
            </div>
            <div>
              <p className="mt-2 italic text-gray-600">{jobPosting.language}</p>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
