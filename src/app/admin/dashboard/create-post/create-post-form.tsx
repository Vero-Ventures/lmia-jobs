"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  JOB_TYPES,
  jobTypeLabels,
  languages,
  paymentTypes,
  PRICE_PER_MONTH,
  PROVINCES,
  provinceValues,
} from "@/app/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

const createPostSchema = z.object({
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
  employmentType: z.enum(jobTypeLabels, {
    message: "Please select an employment type.",
  }),
  workHours: z.coerce
    .number()
    .min(0.0, { message: "Weekly hours must be greater than 0" })
    .optional(),
  paymentType: z.enum(paymentTypes, {
    message: "Please select a payment type.",
  }),
  minPayValue: z.coerce
    .number()
    .min(0, { message: "Minimum pay must be greater than or equal to $0.00" }),
  maxPayValue: z.coerce
    .number()
    .min(1, { message: "Maximum pay must at least $1" })
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
});
type CreatePost = z.infer<typeof createPostSchema>;

export function CreatePostForm() {
  const form = useForm<CreatePost>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      jobTitle: "",
      organizationName: "",
      province: "AB",
      city: "",
      address: "",
      startDate: new Date().toISOString().split("T")[0],
      vacancies: 0,
      employmentType: "Full Time",
      workHours: 1,
      paymentType: "Hourly",
      minPayValue: 0,
      maxPayValue: 1,
      description: "",
      language: "English",
      postAsylum: false,
      postDisabled: false,
      postIndigenous: false,
      postNewcomers: false,
      postYouth: false,
      monthsToPost: 1,
    },
  });

  const selectedJobBoards = [
    form.watch("postAsylum"),
    form.watch("postDisabled"),
    form.watch("postIndigenous"),
    form.watch("postNewcomers"),
    form.watch("postYouth"),
  ].filter(Boolean).length;
  const monthsToPost = form.watch("monthsToPost");

  async function onSubmit(values: CreatePost) {
    console.log(values);
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>Create a Job Posting</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            <div className="space-y-6">
              <h2 className="mt-6 text-xl font-semibold">Job Details</h2>
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an employment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {JOB_TYPES.map((jobType) => (
                            <SelectItem
                              key={jobType.value}
                              value={jobType.value}>
                              {jobType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Hiring Date{" "}
                        <span className="text-xs font-normal italic">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          min="1900-01-01"
                          defaultValue={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Weekly Hours{" "}
                        <span className="text-xs font-normal italic">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Enter weekly hours"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vacancies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Available Positions{" "}
                        <span className="text-xs font-normal italic">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Enter a hiring date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language} value={language}>
                              {language}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a job description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="mt-6 text-xl font-semibold">
                Organization Details
              </h2>
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a organization name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Address{" "}
                        <span className="text-xs font-normal italic">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter an address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a province" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROVINCES.map((province) => (
                            <SelectItem
                              key={province.value}
                              value={province.value}>
                              {province.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="mt-6 text-xl font-semibold">
                Compensation Details
              </h2>
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="paymentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a payment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentTypes.map((paymentType) => (
                            <SelectItem key={paymentType} value={paymentType}>
                              {paymentType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minPayValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Pay</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Enter a minimum pay"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxPayValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Maximum Pay{" "}
                        <span className="text-xs font-normal italic">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Enter a maximum pay"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="mt-6 text-xl font-semibold">
                Posting Preferences
              </h2>
              <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="postDisabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Accessible Job Board</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postAsylum"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Asylum Job Board</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postIndigenous"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Indigenous Job Board</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postNewcomers"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Newcomers Job Board</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postYouth"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Youth Job Board</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="monthsToPost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Months Posted</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Enter a minimum pay"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2 sm:text-right">
                <h2 className="text-2xl font-bold">Total Price</h2>
                <p className="text-xl font-semibold">
                  ${selectedJobBoards * monthsToPost * PRICE_PER_MONTH}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                className="order-2 w-full sm:order-1"
                variant="outline">
                <Link href="/admin/dashboard">Cancel</Link>
              </Button>
              <Button className="order-1 w-full sm:order-2" type="submit">
                Create
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
