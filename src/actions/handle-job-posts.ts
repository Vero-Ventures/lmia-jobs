"use server";

import { db } from "@/db";
import { jobPosting } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function editPostVisibility(
  id: number,
  hidePost: boolean
): Promise<string> {
  try {
    await db
      .update(jobPosting)
      .set({ hidden: hidePost })
      .where(eq(jobPosting.id, id));
    revalidatePath(`/dashboard/posts/${jobPosting.id}`);
    return "success";
  } catch (error) {
    console.error(error);
    return "error";
  }
}
