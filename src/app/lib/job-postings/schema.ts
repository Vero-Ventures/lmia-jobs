import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { jobPosting } from "@/db/schema";

export const baseSchema = createInsertSchema(jobPosting, {
  vacancies: z.coerce
    .number()
    .min(0, { message: "Available Position must be greater than or equal 0" })
    .optional(),
  minWorkHours: z.coerce
    .number()
    .min(0, { message: "Weekly hours must be greater than 0" }),
  maxWorkHours: z.coerce
    .number()
    .min(0, { message: "Weekly hours must be greater than 0" })
    .optional(),
  minPayValue: z.coerce.number().min(0, {
    message: "Minimum pay must be greater than or equal to $0.00",
  }),
  maxPayValue: z.coerce
    .number()
    .min(0, { message: "Maximum pay must at least $1" })
    .optional(),
})
  .extend({
    monthsToPost: z.coerce
      .number()
      .min(1, { message: "Months posted must be greater than 0" }),
  })
  .omit({
    createdAt: true,
    expiresAt: true,
    hidden: true,
    id: true,
    userId: true,
    paymentConfirmed: true,
    updatedAt: true,
  });

export const createJobPostingSchema = baseSchema.refine(
  (postData) => {
    return (
      postData.maxPayValue === 0 ||
      (postData.maxPayValue && postData.maxPayValue >= postData.minPayValue)
    );
  },
  {
    message: "Maximum pay must be greater than or equal to minimum pay",
    path: ["maxPayValue"],
  }
);

export const editJobPostingSchema = baseSchema
  .omit({
    monthsToPost: true,
  })
  .refine(
    (postData) => {
      return (
        postData.maxPayValue === 0 ||
        (postData.maxPayValue && postData.maxPayValue >= postData.minPayValue)
      );
    },
    {
      message: "Maximum pay must be greater than or equal to minimum pay",
      path: ["maxPayValue"],
    }
  );

export type CreateJobPosting = z.infer<typeof createJobPostingSchema>;
export type EditJobPosting = z.infer<typeof editJobPostingSchema>;
