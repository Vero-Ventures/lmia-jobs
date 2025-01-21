"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { changePostVisibility, getJobPost } from "@/actions/handle-job-posts";

export default function HidePost({
  postId,
  userEmail,
}: {
  postId: string;
  userEmail: string;
}) {
  const router = useRouter();
  const [showConfirmHide, setShowConfirmHide] = useState(false);
  const [showConfirmUnHide, setShowConfirmUnHide] = useState(false);

  const checkPostVisibility = async () => {
    const [result, jobPost] = await getJobPost(postId, userEmail);
    if (result && !jobPost!.hidden) {
      setShowConfirmHide(true);
      setShowConfirmUnHide(false);
    } else if (result && jobPost!.hidden) {
      setShowConfirmHide(false);
      setShowConfirmUnHide(true);
    }
  };

  const changeVisibility = async () => {
    const hideResult = await changePostVisibility(postId, showConfirmHide);
    if (hideResult === "error") {
      console.error("Error");
    } else {
      setShowConfirmHide(false);
      setShowConfirmUnHide(false);
      router.refresh();
    }
  };

  return (
    <div className="w-full">
      <div
        className={`fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-50 ${showConfirmHide ? "" : "hidden"}`}>
        <div className="mx-4 flex w-96 flex-col space-y-4 rounded-lg border bg-white p-6 mb:w-[416px] sm:w-[448px]">
          <p className="mt-2 text-center text-2xl font-bold text-gray-800 mb:text-3xl">
            Are You Sure?
          </p>
          <p className="px-2 text-center text-lg text-gray-800 mb:pt-4 mb:text-xl">
            Setting the post as hidden will prevent it from being shown across
            all job boards.
          </p>
          <div className="flex flex-col sm:flex-row">
            <Button
              className="mx-auto w-4/5 py-6 text-base mb:!mt-4 mb:text-lg sm:w-2/5"
              onClick={() => setShowConfirmHide(false)}>
              Cancel
            </Button>
            <Button
              className="mx-auto !mt-6 w-4/5 py-6 text-base mb:text-lg sm:!mt-4 sm:w-2/5"
              onClick={() => changeVisibility()}>
              Confirm
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-50 ${showConfirmUnHide ? "" : "hidden"}`}>
        <div className="mx-4 flex w-96 flex-col space-y-4 rounded-lg border bg-white p-6 mb:w-[416px] sm:w-[448px]">
          <p className="mt-2 text-center text-2xl font-bold text-gray-800 mb:text-3xl">
            Are You Sure?
          </p>
          <p className="px-2 text-center text-lg text-gray-800 mb:pt-4 mb:text-xl">
            Setting the post as visible will cause it to be shown across all job
            boards.
          </p>
          <div className="flex flex-col sm:flex-row">
            <Button
              className="mx-auto w-4/5 py-6 text-base mb:!mt-4 mb:text-lg sm:w-2/5"
              onClick={() => setShowConfirmUnHide(false)}>
              Cancel
            </Button>
            <Button
              className="mx-auto !mt-6 w-4/5 py-6 text-base mb:text-lg sm:!mt-4 sm:w-2/5"
              onClick={() => changeVisibility()}>
              Confirm
            </Button>
          </div>
        </div>
      </div>

      <button
        className="mx-auto mt-2 flex max-h-40 min-h-36 w-full max-w-56 flex-col items-center justify-center rounded-xl border-4 border-green-200"
        onClick={() => {
          if (postId !== "") {
            checkPostVisibility();
          }
        }}
        disabled={postId === ""}>
        <p
          className={`mx-auto my-4 w-max max-w-fit px-2 text-center text-lg font-semibold italic lg:text-2xl ${postId !== "" ? "text-gray-800" : "text-gray-600"}`}>
          Hide / Show <br />
          Selected Post
        </p>
      </button>
    </div>
  );
}
