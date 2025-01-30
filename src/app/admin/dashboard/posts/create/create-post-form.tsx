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
import { useRouter } from "next/navigation";
import FormSubmitButton from "@/components/form-submit-button";
import type { CreateJobPosting } from "@/app/lib/job-postings/schema";
import { createJobPostingSchema } from "@/app/lib/job-postings/schema";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

export function CreatePostForm() {
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
      vacancies: 0,
      employmentType: "Full Time",
      workHours: 0,
      paymentType: "Hourly",
      minPayValue: 0,
      maxPayValue: 0,
      description: "",
      language: "English",
      monthsToPost: 1,
    },
  });
  const router = useRouter();
  const [selectedJobBoards, setSelectedJobBoards] = useState<JobBoard[]>([]);

  const monthsToPost = form.watch("monthsToPost");

  async function onSubmit(values: CreateJobPosting) {
    toast.promise(createJobPost(values, selectedJobBoards), {
      loading: "Creating job posting...",
      success: () => {
        form.reset();
        router.push("/dashboard");
        return "Job posting created successfully";
      },
      error: (error) => {
        if (error instanceof Error) return error.message;
      },
    });
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
                  name="title"
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
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          min="1900-01-01"
                          defaultValue={formatDate(field.value)}
                          onChange={(e) => {
                            field.onChange(new Date(e.target.value));
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
                        Work Hours{" "}
                        <span className="text-xs font-normal italic">
                          (Optional)
                        </span>
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
                  )}
                />
                <FormField
                  control={form.control}
                  name="vacancies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Vacancies{" "}
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
                  name="orgName"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
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
                    <FormItem>
                      <FormLabel>Address</FormLabel>
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
                          min={form.watch("minPayValue") || 0}
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
                {JOB_BOARDS.map((jobBoard) => (
                  <div
                    className="flex items-center space-x-2 capitalize"
                    key={jobBoard}>
                    <Checkbox
                      id={jobBoard}
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
                      {jobBoard}
                    </label>
                  </div>
                ))}
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
                isPending={form.formState.isSubmitting}
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
