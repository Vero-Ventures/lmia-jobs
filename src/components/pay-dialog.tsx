import { createCheckoutSession } from "@/actions/stripe/create-checkout";
import { updateJobBoardPostings } from "@/app/admin/dashboard/posts/create/actions";
import {
  JOB_BOARDS,
  PRICE_PER_MONTH,
  type JobBoard,
} from "@/app/lib/constants";
import { useState } from "react";
import { toast } from "sonner";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function PayDialog({
  id,
  initialSelectedJobBoards,
}: {
  id: number;
  initialSelectedJobBoards?: JobBoard[];
}) {
  const [selectedJobBoards, setSelectedJobBoards] = useState<JobBoard[]>(
    initialSelectedJobBoards ?? []
  );
  const [monthsToPost, setMonthsToPost] = useState(1);

  async function handlePayForPost() {
    if (monthsToPost <= 0 || selectedJobBoards.length === 0) {
      return;
    }
    toast.promise(
      updateJobBoardPostings({ id, monthsToPost, selectedJobBoards }),
      {
        loading: "Updating job posting...",
        success: async () => {
          await createCheckoutSession({
            jobPostingId: id,
            numMonths: monthsToPost,
            numJobBoards: selectedJobBoards.length,
          });
          return "Job posting updated successfully";
        },
        error: (error) => {
          if (error instanceof Error) return error.message;
        },
      }
    );

    await createCheckoutSession({
      jobPostingId: id,
      numJobBoards: selectedJobBoards.length,
      numMonths: monthsToPost,
      return_url: `/posts/${id}`,
    });
  }
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Posting Preferences</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {JOB_BOARDS.map((jobBoard) => (
            <div
              className="flex items-center space-x-2 capitalize"
              key={jobBoard}>
              <Checkbox
                id={jobBoard}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedJobBoards([...selectedJobBoards, jobBoard]);
                  } else {
                    setSelectedJobBoards(
                      selectedJobBoards.filter(
                        (selectedJobBoard) => selectedJobBoard !== jobBoard
                      )
                    );
                  }
                }}
              />
              <Label
                htmlFor={jobBoard}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {jobBoard}
              </Label>
            </div>
          ))}
        </div>

        <div className="grid items-center gap-4">
          <Label htmlFor="monthsToPost">Months To Post</Label>
          <Input
            id="monthsToPost"
            value={monthsToPost}
            onChange={(e) => setMonthsToPost(+e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Total Price</h2>
          <p className="text-xl font-semibold">
            ${selectedJobBoards.length * monthsToPost * PRICE_PER_MONTH}
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handlePayForPost} type="submit">
          Pay
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
