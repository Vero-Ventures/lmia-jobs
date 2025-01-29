import { z } from "zod";
import {
  employmentTypeLabels,
  languages,
  paymentTypes,
  provinceValues,
} from "../constants";

export const createPostSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    jobTitle: z.string().trim().min(1, {
      message: "Job title must be at least 1 character.",
    }),
    organizationName: z.string().trim().min(1, {
      message: "Organization Name must be at least 1 character.",
    }),
    province: z.enum(provinceValues, {
      message: "Please select a province.",
    }),
    city: z.string().trim().min(1, {
      message: "City must be at least 1 character.",
    }),
    address: z.string().trim().optional(),
    startDate: z.string().date(),
    vacancies: z.coerce
      .number()
      .min(0, { message: "Available Position must be greater than or equal 0" })
      .optional(),
    employmentType: z.enum(employmentTypeLabels, {
      message: "Please select an employment type.",
    }),
    workHours: z.coerce
      .number()
      .min(0, { message: "Weekly hours must be greater than 0" })
      .optional(),
    paymentType: z.enum(paymentTypes, {
      message: "Please select a payment type.",
    }),
    minPayValue: z.coerce.number().min(0, {
      message: "Minimum pay must be greater than or equal to $0.00",
    }),
    maxPayValue: z.coerce
      .number()
      .min(0, { message: "Maximum pay must at least $1" })
      .optional(),
    description: z.string().trim().min(1, {
      message: "Description must be at least 1 character.",
    }),
    language: z.enum(languages, {
      message: "Please select a language.",
    }),
    postAsylum: z.boolean(),
    postDisabled: z.boolean(),
    postIndigenous: z.boolean(),
    postNewcomers: z.boolean(),
    postYouth: z.boolean(),
    monthsToPost: z.coerce
      .number()
      .min(1, { message: "Months posted must be greater than 0" }),
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
      path: ["maxPayValue"], // Pointing out which field is invalid
    }
  );
export type CreatePost = z.infer<typeof createPostSchema>;

export const editPostSchema = z
  .object({
    id: z.string().trim(),
    email: z.string().email({ message: "Invalid email address" }),
    jobTitle: z.string().trim().min(1, {
      message: "Job title must be at least 1 character.",
    }),
    organizationName: z.string().trim().min(1, {
      message: "Organization Name must be at least 1 character.",
    }),
    province: z.enum(provinceValues, {
      message: "Please select a province.",
    }),
    city: z.string().trim().min(1, {
      message: "City must be at least 1 character.",
    }),
    address: z.string().trim().optional(),
    startDate: z.string().date(),
    vacancies: z.coerce
      .number()
      .min(0, { message: "Available Position must be greater than or equal 0" })
      .optional(),
    employmentType: z.enum(employmentTypeLabels, {
      message: "Please select an employment type.",
    }),
    workHours: z.coerce
      .number()
      .min(0, { message: "Weekly hours must be greater than 0" })
      .optional(),
    paymentType: z.enum(paymentTypes, {
      message: "Please select a payment type.",
    }),
    minPayValue: z.coerce.number().min(0, {
      message: "Minimum pay must be greater than or equal to $0.00",
    }),
    maxPayValue: z.coerce
      .number()
      .min(0, { message: "Maximum pay must at least $1" })
      .optional(),
    description: z.string().trim().min(1, {
      message: "Description must be at least 1 character.",
    }),
    language: z.enum(languages, {
      message: "Please select a language.",
    }),
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
      path: ["maxPayValue"], // Pointing out which field is invalid
    }
  );
export type EditPost = z.infer<typeof editPostSchema>;
