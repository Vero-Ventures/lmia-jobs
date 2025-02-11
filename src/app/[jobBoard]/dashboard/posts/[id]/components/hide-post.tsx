"use client";

import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { editPostVisibility } from "@/actions/handle-job-posts";

// Takes: The post Id and the current hidden state of the post.
export default function HidePost({
  id,
  hidden,
}: {
  id: number;
  hidden: boolean;
}) {
  return (
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
      {hidden ? (
        <div className="flex flex-row items-center gap-2">
          <Eye />
          <span>Show</span>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-2">
          <EyeOff />
          <span>Hide</span>
        </div>
      )}
    </Button>
  );
}
