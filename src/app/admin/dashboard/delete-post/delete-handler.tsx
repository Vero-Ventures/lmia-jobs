"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { deleteJobPost } from "@/actions/handle-job-posts";

export default function DeletePost({ postId }: { postId: string }) {
  const router = useRouter();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDelete = async () => {
    const deleteResult = await deleteJobPost(postId);
    if (deleteResult === "error") {
      console.error("Error");
    } else {
      setShowConfirmDelete(false);
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="w-full">
      <div
        className={`fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-50 ${showConfirmDelete ? "" : "hidden"}`}>
        <div className="mx-4 flex w-96 flex-col space-y-4 rounded-lg border bg-white p-6 mb:w-[416px] sm:w-[448px]">
          <p className="mt-2 text-center text-2xl font-bold text-gray-800 mb:text-3xl">
            Are You Sure?
          </p>
          <p className="px-2 text-center text-lg text-gray-800 mb:pt-4 mb:text-xl">
            Deleting the post will remove it from all job boards.
          </p>
          <Button
            className="mx-auto w-3/5 py-6 text-base mb:text-lg"
            onClick={() => setShowConfirmDelete(false)}>
            Cancel
          </Button>
          <Button
            className="mx-auto w-3/5 py-6 text-base mb:text-lg"
            onClick={() => handleDelete()}>
            Confirm
          </Button>
        </div>
      </div>
      <button
        className="mx-auto mt-2 flex max-h-40 min-h-36 w-full max-w-56 flex-col items-center justify-center rounded-xl border-4 border-green-200"
        onClick={() => {
          if (postId !== "") {
            setShowConfirmDelete(true);
          }
        }}
        disabled={postId === ""}>
        <p className="mx-auto my-4 w-max max-w-fit px-2 text-center text-lg font-semibold italic text-gray-800 lg:text-2xl">
          Delete <br />
          Selected Post
        </p>
      </button>
    </div>
  );
}
