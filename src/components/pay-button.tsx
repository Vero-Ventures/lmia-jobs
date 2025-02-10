"use client";

import { useState } from "react";
import { toast } from "sonner";
import { HandCoins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  JOB_BOARDS,
  PRICE_PER_MONTH,
  type JobBoard,
} from "@/app/lib/constants";
import { createCheckoutSession } from "@/actions/stripe/create-checkout";
import { updateJobBoardPostings } from "@/app/[jobBoard]/dashboard/posts/create/actions";

// Takes: A Job Posting ID and a nullable array of Job Board values.
export default function PayButton({
  id,
  initialSelectedJobBoards,
}: {
  id: number;
  initialSelectedJobBoards?: JobBoard[];
}) {
  // Track loading state, selected job boards, and months to post.
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJobBoards, setSelectedJobBoards] = useState<JobBoard[]>(
    initialSelectedJobBoards ?? []
  );
  const [monthsToPost, setMonthsToPost] = useState(1);

  async function handlePayForPost() {
    if (monthsToPost <= 0 || selectedJobBoards.length === 0) {
      return;
    }
    setIsLoading(true);

    // Update the job board postings, then create a checkout session on success.
    toast.promise(
      updateJobBoardPostings({ id, monthsToPost, selectedJobBoards }),
      {
        loading: "Updating job posting...",
        success: async () => {
          await createCheckoutSession({
            numJobBoards: selectedJobBoards.length,
            numMonths: monthsToPost,
          });
          return "Job posting updated successfully";
        },
        error: (error) => {
          if (error instanceof Error) return error.message;
        },
        finally: () => setIsLoading(false),
      }
    );

    // NOTE: Why called twice.
    await createCheckoutSession({
      numJobBoards: selectedJobBoards.length,
      numMonths: monthsToPost,
      return_url: `/posts/${id}`,
    });
  }
  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setSelectedJobBoards([]);
          setMonthsToPost(1);
        }
      }}>
      <DialogTrigger asChild>
        <Button disabled={isLoading}>
          <HandCoins />
          <span>Pay</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Posting Preferences</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 pt-2">
          <Label htmlFor="monthsToPost" className="text-lg font-semibold">
            Opportunities Job Boards
          </Label>
          <div className="grid grid-cols-2 items-center gap-4 lg:grid-cols-3">
            {JOB_BOARDS.filter((jobBoard) => jobBoard !== "all").map(
              (jobBoard) => (
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
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {jobBoard}
                  </Label>
                </div>
              )
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="monthsToPost"
              className="ml-2 mt-4 text-lg font-semibold">
              Months To Post
            </Label>
            <Input
              id="monthsToPost"
              value={monthsToPost}
              onChange={(e) => setMonthsToPost(+e.target.value)}
            />
          </div>
          <div className="mx-auto mt-2 space-y-2 rounded-lg border-2 border-gray-300 p-2 px-6">
            <h2 className="text-2xl font-bold">Total Price</h2>
            <p className="text-center text-2xl font-semibold">
              ${selectedJobBoards.length * monthsToPost * PRICE_PER_MONTH}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading}
            onClick={handlePayForPost}
            type="submit"
            className="mx-auto mt-2 w-4/5 py-6 text-xl">
            Pay For Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
