"use server";

import { db } from "@/db";
import { jobPosting } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Takes: The post Id and a boolean to hide or unhide the post.
// Returns: A string indicating the result of the update.
export async function editPostVisibility(
  id: number,
  hidePost: boolean
): Promise<string> {
  try {
    // Update the post with the new visibility status.
    await db
      .update(jobPosting)
      .set({ hidden: hidePost })
      .where(eq(jobPosting.id, id));

    // Revalidate the post page to update the cache.
    revalidatePath(`/dashboard/posts/${id}`);

    // Log any caught errors and return an indication of the result.
    return "success";
  } catch (error) {
    console.error(error);
    return "error";
  }
}
