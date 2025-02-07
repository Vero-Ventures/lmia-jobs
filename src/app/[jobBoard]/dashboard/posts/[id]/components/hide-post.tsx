"use client";

import { editPostVisibility } from "@/actions/handle-job-posts";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function HidePost({
  id,
  hidden,
}: {
  id: number;
  hidden: boolean;
}) {
  return hidden ? (
    <Button
      className="min-w-24"
      onClick={async () => {
        toast.promise(editPostVisibility(id, false), {
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
      className="min-w-24"
      onClick={async () => {
        toast.promise(editPostVisibility(id, true), {
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
