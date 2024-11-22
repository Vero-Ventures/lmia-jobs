import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { JOB_TYPES, PROVINCES } from "./lib/constants";
import JobPostingSection from "./components/job-posting-section";

const JOB_SITES = [
  {
    id: "newcomers",
    title: "Newcomers Job Site",
  },
  {
    id: "youth",
    title: "Students Job Site",
  },
  {
    id: "indigenous",
    title: "Indigenous Job Site",
  },
  {
    id: "asylum",
    title: "Asylum Refugees Job Site",
  },
];

export default function Page({ params }: { params: { jobsiteId: string } }) {
  const jobsiteId = params.jobsiteId;
  const jobSite = JOB_SITES.find((jobSite) => jobSite.id === jobsiteId);

  if (!jobSite) {
    notFound();
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">{jobSite.title}</h1>
      </header>
      <main className="flex-1 bg-secondary p-4">
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div className="flex gap-2">
              <Input placeholder="Search Jobs..." />
              <Button>Search</Button>
            </div>
            <div className="flex gap-2 font-semibold">
              <FilterIcon />
              <span>Filters</span>
            </div>
            <div className="flex gap-2 font-semibold">
              <Select name="jobType">
                <SelectTrigger>
                  <SelectValue placeholder="Choose job type" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((jobType) => (
                    <SelectItem key={jobType} value={jobType}>
                      {jobType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select name="location">
                <SelectTrigger>
                  <SelectValue placeholder="Choose location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {PROVINCES.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <JobPostingSection />
      </main>
    </div>
  );
}
