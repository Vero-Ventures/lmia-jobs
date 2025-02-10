import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { jobPosting } from "@/db/schema";

export const baseSchema = createInsertSchema(jobPosting, {
  // Define fields with required values.
  title: z.string().min(1, { message: "Description is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  orgName: z.string().min(1, { message: "Description is required" }),
  email: z.string().min(1, { message: "Description is required" }),
  address: z.string().min(1, { message: "Description is required" }),
  city: z.string().min(1, { message: "Description is required" }),
  // Define fields with specific value requirements.
  vacancies: z.coerce
    .number()
    .min(0, { message: "Number of vacancies must be greater than or equal 0" })
    .optional(),
  minWorkHours: z.coerce.number().min(1, {
    message: "Minumum weekly hours must be greater than or equal 1",
  }),
  maxWorkHours: z.coerce
    .number()

    .optional(),
  minPayValue: z.coerce.number().min(1, {
    message: "Minimum pay must be greater than or equal to $1.00",
  }),
  maxPayValue: z.coerce
    .number()
    .min(0, {
      message: "Maximum pay must at least greater than or equal to $0.00",
    })
    .optional(),
})
  .extend({
    monthsToPost: z.coerce
      .number()
      .min(1, { message: "Months posted must be greater than 0" }),
  })
  // Define database fields not included in the creation form.
  .omit({
    createdAt: true,
    expiresAt: true,
    hidden: true,
    id: true,
    userId: true,
    paymentConfirmed: true,
    updatedAt: true,
  });

export const createJobPostingSchema = baseSchema
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
  )
  .refine(
    (postData) => {
      return (
        postData.maxWorkHours === 0 ||
        (postData.maxWorkHours &&
          postData.maxWorkHours >= postData.minWorkHours)
      );
    },
    {
      message:
        "Maximum work hours must be greater than or equal to minimum work hours",
      path: ["maxWorkHours"],
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
  )
  .refine(
    (postData) => {
      return (
        postData.maxWorkHours === 0 ||
        (postData.maxWorkHours &&
          postData.maxWorkHours >= postData.minWorkHours)
      );
    },
    {
      message:
        "Maximum work hours must be greater than or equal to minimum work hours",
      path: ["maxWorkHours"],
    }
  );

export type CreateJobPosting = z.infer<typeof createJobPostingSchema>;
export type EditJobPosting = z.infer<typeof editJobPostingSchema>;
