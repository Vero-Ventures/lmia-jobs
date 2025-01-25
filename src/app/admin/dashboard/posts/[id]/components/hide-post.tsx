"use client";

import { editPostVisibility } from "@/actions/handle-job-posts";
import type { JobPosting } from "@/app/lib/types";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function HidePost({ jobPosting }: { jobPosting: JobPosting }) {
  return jobPosting.hidden ? (
    <Button
      onClick={async () => {
        toast.promise(editPostVisibility(jobPosting.id, false), {
          loading: "Loading...",
          success: () => {
            return "Your post will now be shown";
          },
          error: "Unable to change post visibility",
        });
      }}>
      <Eye />
      <span>Show</span>
    </Button>
  ) : (
    <Button
      onClick={async () => {
        toast.promise(editPostVisibility(jobPosting.id, true), {
          loading: "Loading...",
          success: () => {
            return "Your post is hidden";
          },
          error: "Unable to change post visibility",
        });
      }}>
      <EyeOff />
      <span>Hide</span>
    </Button>
  );
}
