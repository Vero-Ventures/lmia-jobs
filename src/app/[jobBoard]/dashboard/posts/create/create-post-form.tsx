"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import type { JobBoard } from "@/app/lib/constants";
import {
  EMPLOYMENT_TYPES,
  JOB_BOARDS,
  languages,
  paymentTypes,
  PRICE_PER_MONTH,
  PROVINCES,
} from "@/app/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { createJobPost } from "./actions";
import FormSubmitButton from "@/components/inputs/form-submit-button";
import type { CreateJobPosting } from "@/app/lib/job-postings/schema";
import { createJobPostingSchema } from "@/app/lib/job-postings/schema";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import MoneyInput from "@/components/inputs/money-input";
import { createCheckoutSession } from "@/actions/stripe/create-checkout";

export function CreatePostForm({
  initialJobBoards,
}: {
  initialJobBoards: JobBoard[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CreateJobPosting>({
    resolver: zodResolver(createJobPostingSchema),
    defaultValues: {
      email: "",
      title: "",
      orgName: "",
      province: "BC",
      city: "",
      address: "",
      startDate: new Date(),
      vacancies: 1,
      employmentType: "Full Time",
      minWorkHours: 0,
      maxWorkHours: 0,
      paymentType: "Hourly",
      minPayValue: 0,
      maxPayValue: 0,
      description: "",
      language: "English",
      monthsToPost: 1,
    },
  });
  const [selectedJobBoards, setSelectedJobBoards] =
    useState<JobBoard[]>(initialJobBoards);

  const monthsToPost = form.watch("monthsToPost");

  async function onSubmit(values: CreateJobPosting) {
    setIsLoading(true);
    if (!form.formState.isValid) {
      setIsLoading(false);
      return;
    }

    toast.promise(createJobPost(values, selectedJobBoards), {
      loading: "Creating job posting...",
      success: async (id) => {
        if (id) {
          await createCheckoutSession({
            jobPostingId: id,
            numMonths: monthsToPost,
            numJobBoards: selectedJobBoards.length,
          });
        }
        return "Job posting created successfully";
      },
      error: (error) => {
        if (error instanceof Error)
          return error.message + " Post was saved to dashboard";
      },
      finally: () => setIsLoading(false),
    });
  }

  return (
    <Card className="m-6 max-w-3xl rounded-lg border-2 border-gray-300 sm:mx-auto sm:w-4/5">
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
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb:text-base">
                        Job Title <span className="text-destructive">*</span>
                      </FormLabel>
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
                    <FormItem className="mt-2">
                      <FormLabel className="mb:text-base">
                        Employment Type{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an employment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EMPLOYMENT_TYPES.map((jobType) => (
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
                    <FormItem className="mt-2">
                      <FormLabel className="mb:text-base">
                        Start Date <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          min="1900-01-01"
                          defaultValue={formatDate(field.value)}
                          onChange={(e) => {
                            if (e.target.value) {
                              const formattedDate = new Date(
                                e.target.value + "T00:00:00"
                              );
                              if (formattedDate) {
                                field.onChange(formattedDate);
                              }
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vacancies"
                  render={({ field }) => {
                    if (field.value && field.value < 0) {
                      field.value = 0;
                    }

                    return (
                      <FormItem className="mt-2">
                        <FormLabel className="mb:text-base">
                          Vacancies
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter the number of vacancies"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="minWorkHours"
                  render={({ field }) => {
                    if (field.value && field.value < 0) {
                      field.value = 0;
                    }

                    return (
                      <FormItem>
                        <FormLabel className="mb:text-base">
                          Minimum Work Hours{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Enter weekly hours"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="maxWorkHours"
                  render={({ field }) => {
                    if (field.value && field.value < 0) {
                      field.value = 0;
                    }

                    return (
                      <FormItem className="mt-2">
                        <FormLabel className="mb:text-base">
                          Max Work Hours
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="Enter weekly hours"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem className="mt-2 md:col-span-2 md:mx-auto md:w-1/2">
                      <FormLabel className="mb:text-base">
                        Language <span className="text-destructive">*</span>
                      </FormLabel>
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
                    <FormItem className="mt-2 md:col-span-2">
                      <FormLabel className="mb:text-base">
                        Description <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          className="max-h-80"
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
                  name="orgName"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel className="mb:text-base">
                        Organization Name{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel className="mb:text-base">
                        Contact Email{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter a contact email"
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
                    <FormItem className="mt-2">
                      <FormLabel className="mb:text-base">Address</FormLabel>
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
                    <FormItem className="mt-2">
                      <FormLabel className="mb:text-base">
                        City <span className="text-destructive">*</span>
                      </FormLabel>
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
                    <FormItem className="mt-2 md:col-span-2 md:mx-auto md:w-1/2">
                      <FormLabel className="mb:text-base">
                        Province <span className="text-destructive">*</span>
                      </FormLabel>
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
                    <FormItem className="mt-2 md:col-span-2 md:mx-auto md:w-1/2">
                      <FormLabel className="mb:text-base">
                        Payment Type <span className="text-destructive">*</span>
                      </FormLabel>
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
                <MoneyInput
                  form={form}
                  name="minPayValue"
                  label="Minimum Pay"
                  placeholder="Enter the minimum pay"
                  isRequired
                />
                <MoneyInput
                  form={form}
                  name="maxPayValue"
                  label="Maximum Pay"
                  placeholder="Enter the maximum pay"
                />
              </div>
            </div>

            <div className="items-center space-y-6">
              <h2 className="mt-6 text-xl font-semibold">
                Posting Preferences
              </h2>
              <div className="ml-4 grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="mb-1 flex justify-start space-x-2 capitalize">
                  <Checkbox
                    checked={selectedJobBoards.length !== 0}
                    id={"all"}
                  />
                  <label
                    htmlFor={"all"}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    All Opportunities
                  </label>
                </div>
                {JOB_BOARDS.filter((board) => board !== "all").map(
                  (jobBoard) => (
                    <div
                      className="mb-1 flex justify-start space-x-2 capitalize"
                      key={jobBoard}>
                      <Checkbox
                        id={jobBoard}
                        defaultChecked={initialJobBoards.includes(jobBoard)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedJobBoards([
                              ...selectedJobBoards,
                              jobBoard,
                            ]);
                          } else {
                            setSelectedJobBoards(
                              selectedJobBoards.filter(
                                (selectedJobBoard) =>
                                  selectedJobBoard !== jobBoard
                              )
                            );
                          }
                        }}
                      />
                      <label
                        htmlFor={jobBoard}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {jobBoard} Opportunities
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 items-center gap-4 sm:grid-cols-2 md:mt-12">
              <FormField
                control={form.control}
                name="monthsToPost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb:text-base">
                      Months Posted <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Enter the number of posted months"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mx-auto mt-2 w-fit space-y-2 rounded-lg border-2 border-gray-300 p-2 px-6 md:mt-0">
                <h2 className="text-2xl font-bold">Total Price</h2>
                <p className="text-center text-xl font-semibold sm:text-2xl">
                  ${selectedJobBoards.length * monthsToPost * PRICE_PER_MONTH}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                className="order-2 w-full sm:order-1"
                variant="outline">
                <Link href="/dashboard">Cancel</Link>
              </Button>
              <FormSubmitButton
                className="order-1 w-full sm:order-2"
                isPending={isLoading}
                loadingValue="Creating job posting..."
                value="Create"
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
